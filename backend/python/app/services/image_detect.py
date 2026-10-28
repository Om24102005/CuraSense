import json
from . import chat as chat_service

# ── AI-driven image type detection ────────────────────────────────────────
_DETECT_PROMPT = (
    "Classify this medical image. Return ONLY a JSON object (no markdown, no prose) "
    "with this exact shape:\n"
    "{\n"
    '  "type": "xray" | "ct" | "mri" | "ultrasound" | "skin_lesion" | "lab_report" | "other",\n'
    '  "confidence": 0-100,\n'
    '  "reason": "one short sentence"\n'
    "}\n"
    "Rules:\n"
    "- 'xray': plain radiograph (chest, bone, dental — black-and-white penetration image).\n"
    "- 'ct': CT scan slice.\n"
    "- 'mri': MRI scan slice.\n"
    "- 'ultrasound': sonography image (often fan-shaped, grayscale).\n"
    "- 'skin_lesion': dermatoscopic / clinical skin photograph.\n"
    "- 'lab_report': printed/handwritten/scanned page of a blood / biomarker / pathology report "
    "(e.g. CBC, lipid panel, HbA1c, glucose, hemoglobin) — anything that's primarily TEXT and TABLES of test values, not an image of the body.\n"
    "- 'other' if it doesn't fit any of the above."
)


def detect_image_type(image_bytes: bytes) -> dict:
    """Ask the vision model what kind of medical image this is."""
    raw = chat_service.vision(_DETECT_PROMPT, image_bytes, max_tokens=200)
    if not raw:
        return {"type": "unknown", "confidence": 0, "reason": "Vision model unavailable."}

    clean = raw.replace("```json", "").replace("```", "").strip()
    if "{" in clean and "}" in clean:
        clean = clean[clean.index("{"): clean.rindex("}") + 1]
    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError:
        return {"type": "unknown", "confidence": 0, "reason": raw[:120]}

    t = str(parsed.get("type", "other")).lower().strip()
    valid = {"xray", "ct", "mri", "ultrasound", "skin_lesion", "lab_report", "other"}
    if t not in valid:
        t = "other"
    try:
        conf = int(parsed.get("confidence", 0))
    except (TypeError, ValueError):
        conf = 0
    return {"type": t, "confidence": max(0, min(100, conf)), "reason": str(parsed.get("reason", ""))[:200]}
