import os
from pathlib import Path
from dotenv import load_dotenv

# backend/python/app/config.py -> backend/.env (shared with the Node service)
load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")
load_dotenv()  # also pick up a local .env if present

GATEWAY_SECRET = os.getenv("GATEWAY_SECRET", "")


def _is_real_key(k: str) -> bool:
    if not k:
        return False
    placeholder = {"your_mistral_key_here", "your_groq_key_here", "your_hf_token_here", "your_deepseek_key_here", "changeme", "todo", "your_api_key"}
    return k.strip().lower() not in placeholder


_RAW_DEEPSEEK = os.getenv("DEEPSEEK_API_KEY", "")
_RAW_HF      = os.getenv("HF_TOKEN", "")
_RAW_MISTRAL = os.getenv("MISTRAL_API_KEY", "")
_RAW_GROQ    = os.getenv("GROQ_API_KEY", "")
DEEPSEEK_API_KEY = _RAW_DEEPSEEK if _is_real_key(_RAW_DEEPSEEK) else ""
HF_TOKEN        = _RAW_HF       if _is_real_key(_RAW_HF)       else ""
MISTRAL_API_KEY = _RAW_MISTRAL  if _is_real_key(_RAW_MISTRAL)  else ""
GROQ_API_KEY    = _RAW_GROQ     if _is_real_key(_RAW_GROQ)     else ""

# ── DeepSeek (primary — text only) ───────────────────────────────────────
DEEPSEEK_URL        = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_TEXT_MODEL = os.getenv("DEEPSEEK_TEXT_MODEL", "deepseek-v4-pro")

# ── HuggingFace Mistral (secondary) ──────────────────────────────────────
HF_BASE_URL    = "https://api-inference.huggingface.co/models"
HF_TEXT_MODEL  = os.getenv("HF_TEXT_MODEL",   "mistralai/Mistral-7B-Instruct-v0.3")
HF_VISION_MODEL = os.getenv("HF_VISION_MODEL", "mistralai/Pixtral-12B-2409")

# ── Mistral API (tertiary) ────────────────────────────────────────────────
MISTRAL_URL          = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_TEXT_MODEL   = "open-mistral-7b"
MISTRAL_VISION_MODEL = "pixtral-12b-2409"

# ── Groq (fallback) ───────────────────────────────────────────────────────
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_VISION_MODELS = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
]
