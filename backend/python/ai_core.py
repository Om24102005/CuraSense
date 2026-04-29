import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_TEXT_MODEL = "open-mistral-7b"
MISTRAL_VISION_MODEL = "pixtral-12b-2409"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


def _mistral_chat(system: str, user: str, max_tokens: int = 400) -> str | None:
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


def _groq_chat(system: str, user: str, max_tokens: int = 400) -> str | None:
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


def _chat(system: str, user: str, max_tokens: int = 400) -> str | None:
    """Try Mistral first, fall back to Groq."""
    return _mistral_chat(system, user, max_tokens) or _groq_chat(system, user, max_tokens)


# --- SYMPTOM TRIAGE ---
def analyze_symptoms_with_mistral(symptoms_text: str) -> str:
    system = (
        "You are an expert medical AI triage system. Analyze the patient symptoms "
        "and provide a concise preliminary triage report: list 2-3 potential conditions, "
        "urgency level (Low / Medium / High / Emergency), and one key recommendation."
    )
    result = _chat(system, f"Symptoms: {symptoms_text}")
    return result if result else _local_triage_fallback(symptoms_text)


def _local_triage_fallback(symptoms_text: str) -> str:
    symptoms_lower = symptoms_text.lower()
    if any(k in symptoms_lower for k in ["chest pain", "shortness of breath", "loss of consciousness"]):
        urgency, note = "EMERGENCY", "Seek immediate medical attention. Do not wait."
    elif any(k in symptoms_lower for k in ["fever", "vomiting", "diarrhea", "muscle pain"]):
        urgency, note = "HIGH", "Consult a physician today."
    else:
        urgency, note = "LOW-MEDIUM", "Monitor symptoms. Consult a physician if they worsen."
    return (
        f"[Offline Triage]\nSymptoms: {symptoms_text}\n"
        f"Urgency: {urgency}\nRecommendation: {note}\n"
        f"Note: Consult a qualified healthcare professional for accurate diagnosis."
    )


# --- MEDICAL IMAGE ANALYSIS (Pixtral) ---
def classify_medical_image_with_resnet(image_bytes: bytes, scan_type: str = "scan") -> dict:
    """Uses Pixtral-12B for real medical image analysis."""
    if not MISTRAL_API_KEY:
        return {"error": "Mistral API key not configured."}

    b64 = base64.b64encode(image_bytes).decode("utf-8")
    # Detect mime type from magic bytes
    mime = "image/jpeg"
    if image_bytes[:4] == b'\x89PNG':
        mime = "image/png"
    elif image_bytes[:4] == b'GIF8':
        mime = "image/gif"

    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": MISTRAL_VISION_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"You are an expert radiologist AI. Analyze this {scan_type} medical image. "
                            "Provide: 1) Primary finding with confidence (%), "
                            "2) 2 secondary findings, "
                            "3) Urgency level (Normal/Monitor/Urgent/Critical), "
                            "4) One clinical recommendation. "
                            "Be concise and structured."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{b64}"}
                    }
                ]
            }
        ],
        "max_tokens": 400,
    }
    try:
        resp = requests.post(MISTRAL_URL, headers=headers, json=payload, timeout=45)
        if resp.status_code == 200:
            analysis_text = resp.json()["choices"][0]["message"]["content"].strip()
            return {"analysis": analysis_text, "model": MISTRAL_VISION_MODEL}
        print(f"[PIXTRAL ERROR] {resp.status_code}: {resp.text[:300]}")
        return {"error": f"Vision model error. Status {resp.status_code}"}
    except Exception as e:
        print(f"[PIXTRAL EXCEPTION] {e}")
        return {"error": str(e)}


# --- LAB REPORT PARSER ---
def parse_lab_report(report_text: str):
    system = (
        "Extract all medical biomarkers, their values, and units from the lab report. "
        'Output ONLY a valid JSON object like {"biomarker": {"value": ..., "unit": "..."}}. '
        "No markdown, no explanations."
    )
    result = _chat(system, f"Report: {report_text}", max_tokens=500)
    if result:
        clean = result.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(clean)
        except json.JSONDecodeError:
            return {"raw_extraction": result}
    return {"error": "Bio-Parser unavailable. Check API keys in backend/.env"}
