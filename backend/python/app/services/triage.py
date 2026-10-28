import json
from . import chat as chat_service


# ── Symptom triage ────────────────────────────────────────────────────────
def analyze_symptoms_with_mistral(symptoms_text: str, wearable_context: str | None = None) -> dict:
    """
    Structured NLP triage via DeepSeek V4 Pro (with fallback chain).

    When wearable_context is provided, it is prepended to the user message
    as an immutable clinical baseline sourced from the patient's Apple Watch
    biometrics stored in MongoDB. The AI is instructed to factor these
    objective parameters into its differential diagnosis.
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
        '"low" if self-care is fine. '
        "When wearable biometric data is present in the user message, treat it as ground-truth "
        "objective clinical measurements and incorporate them into your assessment and confidence scoring."
    )

    # Prepend wearable biometric baseline before the symptom text so the
    # model has full objective context before performing differential analysis.
    user_msg = (
        f"{wearable_context}\n\nSymptoms: {symptoms_text}"
        if wearable_context
        else f"Symptoms: {symptoms_text}"
    )

    # deepseek-v4-pro is a reasoning model — it spends tokens on internal
    # reasoning_content before emitting the actual `content` field. A tight
    # budget here risks hitting max_tokens mid-reasoning and returning
    # empty content, which (with no other provider configured) falls
    # straight through to the offline rule-based fallback below.
    raw = chat_service.chat(system, user_msg, max_tokens=1200)
    if not raw:
        return _local_triage_fallback(symptoms_text)

    clean = raw.replace("```json", "").replace("```", "").strip()
    if "{" in clean and "}" in clean:
        clean = clean[clean.index("{"): clean.rindex("}") + 1]

    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"[SYMPTOM JSON DECODE] {e}")
        return {
            "assessment": raw,
            "confidence": 75,
            "urgency": "medium",
            "conditions": [],
            "recommendations": [],
        }

    conditions = []
    for c in (parsed.get("conditions") or []):
        if not isinstance(c, dict) or not c.get("name"):
            continue
        try:
            prob = int(c.get("probability", 0))
        except (TypeError, ValueError):
            prob = 0
        conditions.append({"name": str(c["name"]), "probability": max(0, min(100, prob))})

    urgency = (parsed.get("urgency") or "medium").lower()
    if urgency not in ("low", "medium", "high", "emergency"):
        urgency = "medium"

    return {
        "assessment":      parsed.get("assessment", "No assessment provided."),
        "confidence":      int(parsed.get("confidence", 80)),
        "urgency":         urgency,
        "conditions":      conditions,
        "recommendations": parsed.get("recommendations", []) or [],
    }


def _local_triage_fallback(symptoms_text: str) -> dict:
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
