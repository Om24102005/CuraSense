import requests
from ...config import DEEPSEEK_API_KEY, DEEPSEEK_URL, DEEPSEEK_TEXT_MODEL


def chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    """DeepSeek API — OpenAI-compatible endpoint (primary provider)."""
    if not DEEPSEEK_API_KEY:
        return None
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": DEEPSEEK_TEXT_MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "max_tokens": max_tokens,
        "temperature": 0.3,
        "stream": False,
    }
    try:
        resp = requests.post(DEEPSEEK_URL, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[DEEPSEEK CHAT ERROR] {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        print(f"[DEEPSEEK CHAT EXCEPTION] {e}")
    return None
