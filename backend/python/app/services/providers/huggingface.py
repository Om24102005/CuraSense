import base64
import requests
from ...config import HF_TOKEN, HF_BASE_URL, HF_TEXT_MODEL, HF_VISION_MODEL
from ..image_utils import detect_mime


def chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    """HuggingFace Inference API — Mistral (OpenAI-compatible endpoint)."""
    if not HF_TOKEN:
        return None
    url = f"{HF_BASE_URL}/{HF_TEXT_MODEL}/v1/chat/completions"
    headers = {"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"}
    payload = {
        "model": HF_TEXT_MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "max_tokens": max_tokens,
        "temperature": 0.3,
        "stream": False,
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[HF CHAT ERROR] {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        print(f"[HF CHAT EXCEPTION] {e}")
    return None


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 600, system: str | None = None) -> str | None:
    """HuggingFace Inference API — Pixtral vision (OpenAI-compatible multimodal endpoint)."""
    if not HF_TOKEN:
        return None
    b64  = base64.b64encode(image_bytes).decode("utf-8")
    mime = detect_mime(image_bytes)
    url  = f"{HF_BASE_URL}/{HF_VISION_MODEL}/v1/chat/completions"
    headers = {"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"}
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({
        "role": "user",
        "content": [
            {"type": "text",      "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
        ],
    })
    payload = {
        "model": HF_VISION_MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.2,
        "stream": False,
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=90)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[HF VISION ERROR] {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        print(f"[HF VISION EXCEPTION] {e}")
    return None
