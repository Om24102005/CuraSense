from ..config import HF_TOKEN, MISTRAL_API_KEY, GROQ_API_KEY
from .providers import deepseek, huggingface, mistral, groq


def chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    """Priority: DeepSeek → HuggingFace Mistral → Mistral API → Groq."""
    return (
        deepseek.chat(system, user, max_tokens)
        or huggingface.chat(system, user, max_tokens)
        or mistral.chat(system, user, max_tokens)
        or groq.chat(system, user, max_tokens)
    )


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None) -> str | None:
    """Priority: HuggingFace Pixtral → Mistral API Pixtral → Groq Llama-4 vision."""
    return (
        huggingface.vision(prompt, image_bytes, max_tokens, system)
        or mistral.vision(prompt, image_bytes, max_tokens, system)
        or groq.vision(prompt, image_bytes, max_tokens, system)
    )


def vision_available() -> bool:
    return bool(HF_TOKEN) or bool(MISTRAL_API_KEY) or bool(GROQ_API_KEY)
