import base64
import requests
from ...config import GROQ_API_KEY, GROQ_URL, GROQ_MODEL, GROQ_VISION_MODELS
from ..image_utils import detect_mime


def chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    if not GROQ_API_KEY:
        return None
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "max_tokens": max_tokens,
        "temperature": 0.3,
    }
    try:
        resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[GROQ ERROR] {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[GROQ EXCEPTION] {e}")
    return None


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None) -> str | None:
    if not GROQ_API_KEY:
        return None
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime = detect_mime(image_bytes)
    user_content = [
        {"type": "text", "text": (system + "\n\n" + prompt) if system else prompt},
        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
    ]
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    last_err = None
    for model in GROQ_VISION_MODELS:
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": user_content}],
            "max_tokens": max_tokens,
            "temperature": 0.2,
        }
        try:
            resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=60)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"].strip()
            last_err = f"{resp.status_code}: {resp.text[:200]}"
            print(f"[GROQ VISION ERROR {model}] {last_err}")
        except Exception as e:
            last_err = str(e)
            print(f"[GROQ VISION EXCEPTION {model}] {e}")
    return None
