import base64
import json
import threading
import time
import requests
from ...config import DEEPSEEK_API_KEY, DEEPSEEK_URL, DEEPSEEK_TEXT_MODEL, DEEPSEEK_FAST_MODEL
from ..image_utils import detect_mime

# Both models reason before answering, and reasoning tokens count against max_tokens.
# Without this headroom a hard case burns the whole budget thinking and returns empty content (measured: with 3000,
# 3 of 8 scan reads came back empty and had to be asked again; max_tokens is only a cap, an easy case does not pay for it).
_REASONING_HEADROOM = 8000


_SLOTS = threading.BoundedSemaphore(24)  # a big file fans out many calls; never send the provider more than this at once
_RETRY_ON = {429, 500, 502, 503, 504}
IDLE = 40  # seconds of silence (no reasoning or answer tokens at all) before a call is given up
# Seconds to open the connection and send the request. A healthy call does both in well under a second, but some new connections
# to the API's edge never complete (measured 2026-11-11: about one in two, curl showed `tcp 0.000` or a send that never finished),
# so a stalled one is given up quickly and the call is retried on a fresh connection instead of failing.
CONNECT = 6
ATTEMPTS = 6  # a stalled attempt costs at most CONNECT seconds, so six tries still fit the call's budget
MAX_TOKENS_CAP = 32000  # the API accepts about 40000; a retry after an empty answer doubles the budget up to here, never past it


def _stream(headers: dict, payload: dict, deadline: float) -> tuple[str, str | None]:
    """One streamed completion. Streaming keeps a long answer (a 60-marker lab JSON) alive: the timeout is
    per chunk, not for the whole reply. Raises requests errors; returns (content, finish_reason).
    Neither wait is allowed to outlast the call's overall deadline."""
    left = max(1.0, deadline - time.time())
    resp = requests.post(DEEPSEEK_URL, headers=headers, json=payload, timeout=(min(CONNECT, left), min(IDLE, left)), stream=True)
    if resp.status_code != 200:
        raise _HttpError(resp.status_code, resp.text[:300])
    parts, finish = [], None
    for line in resp.iter_lines(decode_unicode=True):
        if time.time() > deadline:
            resp.close()
            raise requests.Timeout("overall deadline reached")
        if not line or not line.startswith("data:"):
            continue
        data = line[5:].strip()
        if data == "[DONE]":
            break
        choices = json.loads(data).get("choices") or []
        if not choices:  # e.g. a trailing usage chunk
            continue
        choice = choices[0]
        parts.append((choice.get("delta") or {}).get("content") or "")  # reasoning_content is dropped on purpose
        finish = choice.get("finish_reason") or finish
    return "".join(parts).strip(), finish


class _HttpError(Exception):
    def __init__(self, status: int, body: str):
        super().__init__(f"{status}: {body}")
        self.status = status


def _post(model: str, messages: list, max_tokens: int, temperature: float, total: int, think: bool = True) -> str | None:
    """`total` is the most seconds this call may take, retries included. think=False turns the model's reasoning off:
    several times faster, right for labelling and transcription, not for clinical reads."""
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "max_tokens": max_tokens + _REASONING_HEADROOM,
               "temperature": temperature, "stream": True}
    if not think:
        payload["thinking"] = {"type": "disabled"}
    deadline = time.time() + total
    for attempt in range(ATTEMPTS):
        if time.time() >= deadline:
            break
        try:
            with _SLOTS:
                content, finish = _stream(headers, payload, deadline)
            if content and finish != "length":
                return content
            # Empty or cut off: the model spent its budget reasoning (or the answer is longer than expected). Retry with double.
            print(f"[DEEPSEEK {model} {'EMPTY' if not content else 'TRUNCATED'}] finish_reason={finish}")
            payload["max_tokens"] = min(payload["max_tokens"] * 2, MAX_TOKENS_CAP)
            continue
        except _HttpError as e:
            print(f"[DEEPSEEK {model} ERROR] {e}")
            if e.status not in _RETRY_ON:
                return None
        except requests.RequestException as e:  # stalled or dropped connection (a stalled stream surfaces as ConnectionError)
            print(f"[DEEPSEEK {model} {'TIMEOUT' if isinstance(e, requests.Timeout) else 'EXCEPTION'}] {e}")
            continue  # no pause: the next attempt opens a new connection, which usually works
        except Exception as e:  # bad chunk
            print(f"[DEEPSEEK {model} EXCEPTION] {e}")
        time.sleep(1.5 * (attempt + 1))
    return None


def chat(system: str, user: str, max_tokens: int = 400, fast: bool = False, patient: bool = False, think: bool = True) -> str | None:
    """DeepSeek API (OpenAI-compatible, primary provider). Pro model first, fast model if it fails.
    fast=True goes straight to the fast model, for quick labelling jobs. patient=True allows minutes, for
    long structured answers (a lab panel with dozens of markers); the default fits the 60s Node waits for /symptoms."""
    if not DEEPSEEK_API_KEY:
        return None
    messages = [{"role": "system", "content": system}, {"role": "user", "content": user}]
    plan = ((DEEPSEEK_TEXT_MODEL, 150), (DEEPSEEK_FAST_MODEL, 100)) if patient else ((DEEPSEEK_TEXT_MODEL, 35), (DEEPSEEK_FAST_MODEL, 20))
    for model, total in plan[1:] if fast else plan:
        out = _post(model, messages, max_tokens, 0.3, total, think)
        if out:
            return out
    return None


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None, temperature: float = 0.2, think: bool = True, total: int = 120) -> str | None:
    """DeepSeek fast model, which accepts images (the pro model is text-only). `total` is the most seconds the call may take, retries included."""
    if not DEEPSEEK_API_KEY:
        return None
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": [
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:{detect_mime(image_bytes)};base64,{b64}"}},
    ]})
    return _post(DEEPSEEK_FAST_MODEL, messages, max_tokens, temperature, total, think)
