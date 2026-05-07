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
def analyze_symptoms_with_mistral(symptoms_text: str) -> dict:
    """
    Structured triage analysis. Returns conditions WITH probabilities so
    the UI can render a probability bar per condition, plus an urgency
    level the UI maps to a colored emoji.
    """
    system = (
        "You are an expert medical AI triage system. Analyze the patient symptoms and return "
        "ONLY a JSON object (no markdown wrapping, no prose around it) with this exact shape:\n"
        "{\n"
        '  "assessment": "2-3 sentence clinical reasoning. Use **bold** for key findings.",\n'
        '  "confidence": 88,\n'
        '  "urgency": "low" | "medium" | "high" | "emergency",\n'
        '  "conditions": [\n'
        '    { "name": "Influenza (Flu)", "probability": 65 },\n'
        '    { "name": "Common Cold",     "probability": 25 },\n'
        '    { "name": "Strep Throat",    "probability": 10 }\n'
        '  ],\n'
        '  "recommendations": ["Rest and hydrate.", "Monitor temperature every 4h.", "Seek care if breathing worsens."]\n'
        "}\n"
        "Probabilities are integers 0-100 and should sum to roughly 100. "
        "List 2-4 conditions ordered by descending probability. "
        'urgency = "emergency" only for life-threatening signs (chest pain, severe breathing issues, '
        'loss of consciousness). "high" if same-day care recommended. "medium" if see-doctor-soon. '
        '"low" if self-care is fine.'
    )
    raw = _chat(system, f"Symptoms: {symptoms_text}", max_tokens=600)
    if not raw:
        return _local_triage_fallback(symptoms_text)

    # Strip code fences, then carve out the JSON if the model wrapped it in prose.
    clean = raw.replace("```json", "").replace("```", "").strip()
    if "{" in clean and "}" in clean:
        clean = clean[clean.index("{"): clean.rindex("}") + 1]

    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"[SYMPTOM JSON DECODE] {e}")
        # Best-effort: return the raw assessment so the UI can still display *something*.
        return {
            "assessment": raw,
            "confidence": 75,
            "urgency": "medium",
            "conditions": [],
            "recommendations": [],
        }

    # Normalise conditions defensively
    conditions = []
    for c in (parsed.get("conditions") or []):
        if not isinstance(c, dict) or not c.get("name"):
            continue
        try:
            prob = int(c.get("probability", 0))
        except (TypeError, ValueError):
            prob = 0
        conditions.append({
            "name": str(c["name"]),
            "probability": max(0, min(100, prob)),
        })

    urgency = (parsed.get("urgency") or "medium").lower()
    if urgency not in ("low", "medium", "high", "emergency"):
        urgency = "medium"

    return {
        "assessment": parsed.get("assessment", "No assessment provided."),
        "confidence": int(parsed.get("confidence", 80)),
        "urgency": urgency,
        "conditions": conditions,
        "recommendations": parsed.get("recommendations", []) or [],
    }


def _local_triage_fallback(symptoms_text: str) -> dict:
    """Used when no AI provider is reachable. Keeps the UI working."""
    s = symptoms_text.lower()
    if any(k in s for k in ["chest pain", "shortness of breath", "loss of consciousness"]):
        urgency = "emergency"
        rec = ["Seek immediate medical attention.", "Do not wait or self-medicate."]
    elif any(k in s for k in ["fever", "vomiting", "diarrhea"]):
        urgency = "high"
        rec = ["Consult a physician today.", "Stay hydrated.", "Monitor temperature."]
    else:
        urgency = "low"
        rec = ["Monitor symptoms.", "Rest and hydrate.", "Consult a physician if symptoms worsen."]
    return {
        "assessment": f"**Offline triage** — AI provider unavailable. Triage based on rule-based fallback for: {symptoms_text}.",
        "confidence": 55,
        "urgency": urgency,
        "conditions": [],
        "recommendations": rec,
    }


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


# --- LAB REPORT PARSER + AI INTERPRETATION ---
def analyze_lab_report(report_text: str):
    """
    Full lab-report analysis using Mistral (same model the Symptoms tab uses).
    Returns BOTH biomarker extraction AND clinical interpretation, with
    normal ranges and per-biomarker status so the UI can render health bars.
    """
    system = (
        "You are a medical AI clinical analyst. Analyze the lab report and return ONLY a "
        "JSON object (no markdown, no prose around it) with this exact shape:\n"
        "{\n"
        '  "assessment": "2-4 sentence clinical interpretation. Use **bold** for key '
        'findings. Mention conditions suggested by the values.",\n'
        '  "confidence": 88,\n'
        '  "urgency": "low" | "medium" | "high" | "emergency",\n'
        '  "biomarkers": [\n'
        '    {\n'
        '      "name": "Total Cholesterol",\n'
        '      "value": 245,\n'
        '      "unit": "mg/dL",\n'
        '      "normal_min": 125,\n'
        '      "normal_max": 200,\n'
        '      "status": "normal" | "low" | "high" | "critical"\n'
        '    }\n'
        '  ],\n'
        '  "recommendations": ["Schedule cardiology follow-up.", "Reduce saturated fat."]\n'
        "}\n"
        "Use established clinical normal ranges (adult). value must be a number, not a string. "
        "Include EVERY biomarker present in the report. status follows the rules: "
        "low if below normal_min, high if above normal_max, critical if value is dangerously "
        "out of range (e.g. >150% of normal_max), normal otherwise."
    )
    raw = _chat(system, f"Report:\n{report_text}", max_tokens=900)
    if not raw:
        return {"error": "AI analyst unavailable. Check API keys in backend/.env"}

    # Strip stray code fences
    clean = raw.replace("```json", "").replace("```", "").strip()
    # Some models return prose around the JSON — slice from first { to last }
    if "{" in clean and "}" in clean:
        clean = clean[clean.index("{"): clean.rindex("}") + 1]

    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"[LAB JSON DECODE] {e}")
        return {"error": "AI returned malformed JSON.", "raw_extraction": raw}

    # Defensive normalisation — make sure every biomarker has the keys the UI needs.
    biomarkers = parsed.get("biomarkers", []) or []
    cleaned_biomarkers = []
    for b in biomarkers:
        if not isinstance(b, dict) or "name" not in b:
            continue
        try:
            value = float(b.get("value", 0))
        except (TypeError, ValueError):
            value = 0.0
        nmin = float(b.get("normal_min", 0) or 0)
        nmax = float(b.get("normal_max", 0) or 0)
        status = b.get("status") or "normal"
        # Re-derive status if model got it wrong
        if nmax > 0:
            if value > nmax * 1.5 or (nmin > 0 and value < nmin * 0.5):
                status = "critical"
            elif value > nmax:
                status = "high"
            elif nmin > 0 and value < nmin:
                status = "low"
            else:
                status = "normal"
        cleaned_biomarkers.append({
            "name": str(b.get("name", "Unknown")),
            "value": value,
            "unit": str(b.get("unit", "")),
            "normal_min": nmin,
            "normal_max": nmax,
            "status": status,
        })

    return {
        "assessment": parsed.get("assessment", "No assessment provided."),
        "confidence": int(parsed.get("confidence", 80)),
        "urgency": parsed.get("urgency", "medium"),
        "biomarkers": cleaned_biomarkers,
        "recommendations": parsed.get("recommendations", []) or [],
    }


# Backward-compat alias — keep the old name so anything still importing
# parse_lab_report keeps working until callers migrate.
def parse_lab_report(report_text: str):
    return analyze_lab_report(report_text)
