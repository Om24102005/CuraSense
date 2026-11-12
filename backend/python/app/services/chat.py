from ..config import DEEPSEEK_API_KEY, HF_TOKEN, MISTRAL_API_KEY, GROQ_API_KEY
from .providers import deepseek, huggingface, mistral, groq


def chat(system: str, user: str, max_tokens: int = 400, fast: bool = False, patient: bool = False, think: bool = True) -> str | None:
    """Priority: DeepSeek → HuggingFace Mistral → Mistral API → Groq. fast=True skips DeepSeek's slow pro model;
    patient=True lets DeepSeek take minutes for a long structured answer;
    think=False turns DeepSeek's reasoning off (fast; for labelling and transcription)."""
    return (
        deepseek.chat(system, user, max_tokens, fast, patient, think)
        or huggingface.chat(system, user, max_tokens)
        or mistral.chat(system, user, max_tokens)
        or groq.chat(system, user, max_tokens)
    )


def vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None, temperature: float = 0.2, think: bool = True, total: int = 120) -> str | None:
    """Priority: DeepSeek → HuggingFace Pixtral → Mistral API Pixtral → Groq Llama-4 vision. temperature applies to DeepSeek only."""
    return (
        deepseek.vision(prompt, image_bytes, max_tokens, system, temperature, think, total)
        or huggingface.vision(prompt, image_bytes, max_tokens, system)
        or mistral.vision(prompt, image_bytes, max_tokens, system)
        or groq.vision(prompt, image_bytes, max_tokens, system)
    )


def vision_available() -> bool:
    return bool(DEEPSEEK_API_KEY) or bool(HF_TOKEN) or bool(MISTRAL_API_KEY) or bool(GROQ_API_KEY)
