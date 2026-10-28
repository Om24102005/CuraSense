import base64
import requests
from ...config import MISTRAL_API_KEY, MISTRAL_URL, MISTRAL_TEXT_MODEL, MISTRAL_VISION_MODEL
from ..image_utils import detect_mime


def chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    if not MISTRAL_API_KEY:
        return None
    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": MISTRAL_TEXT_MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "max_tokens": max_tokens,
        "temperature": 0.3,
    }
    try:
        resp = requests.post(MISTRAL_URL, headers=headers, json=payload, timeout=30)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[MISTRAL ERROR] {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[MISTRAL EXCEPTION] {e}")
    return None


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 600, system: str | None = None) -> str | None:
    if not MISTRAL_API_KEY:
        return None
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime = detect_mime(image_bytes)
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
        ],
    })
    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": MISTRAL_VISION_MODEL, "messages": messages, "max_tokens": max_tokens, "temperature": 0.2}
    try:
        resp = requests.post(MISTRAL_URL, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[MISTRAL VISION ERROR] {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        print(f"[MISTRAL VISION EXCEPTION] {e}")
    return None
