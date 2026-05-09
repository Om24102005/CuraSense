import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()


def _is_real_key(k: str) -> bool:
    if not k:
        return False
    placeholder = {"your_mistral_key_here", "your_groq_key_here", "changeme", "todo", "your_api_key"}
    return k.strip().lower() not in placeholder


_RAW_MISTRAL = os.getenv("MISTRAL_API_KEY", "")
_RAW_GROQ = os.getenv("GROQ_API_KEY", "")
MISTRAL_API_KEY = _RAW_MISTRAL if _is_real_key(_RAW_MISTRAL) else ""
GROQ_API_KEY = _RAW_GROQ if _is_real_key(_RAW_GROQ) else ""

MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_TEXT_MODEL = "open-mistral-7b"
MISTRAL_VISION_MODEL = "pixtral-12b-2409"

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_VISION_MODELS = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
]


# ── Text chat ─────────────────────────────────────────────────────────────
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


# ── Vision chat (image in, text out) ──────────────────────────────────────
def _detect_mime(image_bytes: bytes) -> str:
    if image_bytes[:4] == b"\x89PNG":
        return "image/png"
    if image_bytes[:3] == b"GIF":
        return "image/gif"
    if image_bytes[:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    if image_bytes[:2] == b"BM":
        return "image/bmp"
    return "image/jpeg"


def _mistral_vision(prompt: str, image_bytes: bytes, max_tokens: int = 600, system: str | None = None) -> str | None:
    if not MISTRAL_API_KEY:
        return None
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime = _detect_mime(image_bytes)
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
        ],
    })
    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": MISTRAL_VISION_MODEL, "messages": messages, "max_tokens": max_tokens, "temperature": 0.2}
    try:
        resp = requests.post(MISTRAL_URL, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        print(f"[MISTRAL VISION ERROR] {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        print(f"[MISTRAL VISION EXCEPTION] {e}")
    return None


def _groq_vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None) -> str | None:
    if not GROQ_API_KEY:
        return None
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime = _detect_mime(image_bytes)
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


def _vision(prompt: str, image_bytes: bytes, max_tokens: int = 800, system: str | None = None) -> str | None:
    """Try Mistral Pixtral first, fall back to Groq Llama-4 vision."""
    return (
        _mistral_vision(prompt, image_bytes, max_tokens, system)
        or _groq_vision(prompt, image_bytes, max_tokens, system)
    )


def vision_available() -> bool:
    return bool(MISTRAL_API_KEY) or bool(GROQ_API_KEY)


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
    raw = _vision(_DETECT_PROMPT, image_bytes, max_tokens=200)
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


# ── Symptom triage ────────────────────────────────────────────────────────
def analyze_symptoms_with_mistral(symptoms_text: str) -> dict:
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
        "assessment": parsed.get("assessment", "No assessment provided."),
        "confidence": int(parsed.get("confidence", 80)),
        "urgency": urgency,
        "conditions": conditions,
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


# ── Radiology image analysis ──────────────────────────────────────────────
SCAN_TYPE_LABELS = {
    "xray": "X-ray radiograph",
    "ct": "CT scan",
    "mri": "MRI scan",
    "ultrasound": "ultrasound image",
    "skin_lesion": "dermatological / skin lesion photograph",
    "skin": "dermatological / skin lesion photograph",
    "scan": "medical imaging scan",
}


def classify_medical_image_with_resnet(image_bytes: bytes, scan_type: str = "scan") -> dict:
    """Vision-LLM-driven radiology assessment with auto-detection.

    The model first detects what kind of image it is. If it sees a lab report
    in the Scans tab, it flips and routes to lab analysis instead, and signals
    that to the caller via `detected_kind`.
    """
    if not vision_available():
        return {"error": "No vision model configured. Set MISTRAL_API_KEY or GROQ_API_KEY in backend/.env."}

    detection = detect_image_type(image_bytes)
    detected = detection.get("type", "other")

    # Wrong tab — got a lab report under Scans. Run the lab pipeline so the user still gets a useful result.
    if detected == "lab_report":
        lab = analyze_lab_report_image(image_bytes)
        return {
            "detected_kind": "lab_report",
            "detected_confidence": detection.get("confidence", 0),
            "redirected_to": "lab_report",
            "analysis": (
                f"**Detected: Lab / Blood Report** (auto-routed by AI).\n\n"
                f"This file looks like a lab report, not a radiology scan. The Reports tab is the right home for it, "
                f"but I went ahead and analyzed it for you.\n\n"
                + (lab.get("assessment") or lab.get("error", ""))
            ),
            "lab": lab,
            "model": "auto-router",
        }

    label = SCAN_TYPE_LABELS.get(detected, SCAN_TYPE_LABELS.get(scan_type, "medical imaging scan"))
    prompt = (
        f"You are an expert radiologist AI. The image has been identified as a **{label}**. "
        "Analyze it and return a clinical assessment with:\n"
        "1) **Primary finding** with confidence (%).\n"
        "2) Two **secondary findings** (if any).\n"
        "3) **Urgency level**: Normal / Monitor / Urgent / Critical.\n"
        "4) One **clinical recommendation**.\n\n"
        "Use **bold** for key findings. Be concise and structured. "
        "If the image quality is too poor to assess, say so explicitly."
    )

    analysis = _vision(prompt, image_bytes, max_tokens=600)
    if not analysis:
        return {"error": "Vision model failed to return a response. Check API keys."}

    return {
        "detected_kind": detected,
        "detected_confidence": detection.get("confidence", 0),
        "detected_reason": detection.get("reason", ""),
        "scan_type_used": detected if detected != "other" else scan_type,
        "analysis": analysis,
        "model": "mistral-pixtral" if MISTRAL_API_KEY else "groq-llama4-vision",
    }


# ── Lab report analysis ───────────────────────────────────────────────────
_LAB_SYSTEM_PROMPT = (
    "You are a medical AI clinical analyst. Analyze the lab report and return ONLY a "
    "JSON object (no markdown, no prose around it) with this exact shape:\n"
    "{\n"
    '  "assessment": "2-4 sentence clinical interpretation. Use **bold** for key '
    'findings. Mention conditions suggested by the values.",\n'
    '  "confidence": 88,\n'
    '  "urgency": "low" | "medium" | "high" | "emergency",\n'
    '  "biomarkers": [\n'
    '    {"name":"Total Cholesterol","value":245,"unit":"mg/dL",'
    '"normal_min":125,"normal_max":200,"status":"high"}\n'
    '  ],\n'
    '  "recommendations": ["Schedule cardiology follow-up.", "Reduce saturated fat."]\n'
    "}\n"
    "Use established adult clinical normal ranges. value MUST be a number, not a string. "
    "Include EVERY biomarker visible in the report. status: low if value<normal_min, "
    "high if value>normal_max, critical if dangerously out of range (>150% of normal_max), "
    "else normal."
)


def _normalise_lab_response(raw: str) -> dict:
    clean = raw.replace("```json", "").replace("```", "").strip()
    if "{" in clean and "}" in clean:
        clean = clean[clean.index("{"): clean.rindex("}") + 1]
    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"[LAB JSON DECODE] {e}")
        return {"error": "AI returned malformed JSON.", "raw_extraction": raw[:600]}

    cleaned = []
    for b in (parsed.get("biomarkers") or []):
        if not isinstance(b, dict) or "name" not in b:
            continue
        try:
            value = float(b.get("value", 0))
        except (TypeError, ValueError):
            value = 0.0
        try:
            nmin = float(b.get("normal_min", 0) or 0)
        except (TypeError, ValueError):
            nmin = 0.0
        try:
            nmax = float(b.get("normal_max", 0) or 0)
        except (TypeError, ValueError):
            nmax = 0.0
        status = b.get("status") or "normal"
        if nmax > 0:
            if value > nmax * 1.5 or (nmin > 0 and value < nmin * 0.5):
                status = "critical"
            elif value > nmax:
                status = "high"
            elif nmin > 0 and value < nmin:
                status = "low"
            else:
                status = "normal"
        cleaned.append({
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
        "biomarkers": cleaned,
        "recommendations": parsed.get("recommendations", []) or [],
    }


def analyze_lab_report(report_text: str):
    """Lab analysis from raw text (paste-text path)."""
    raw = _chat(_LAB_SYSTEM_PROMPT, f"Report:\n{report_text}", max_tokens=900)
    if not raw:
        return {"error": "AI analyst unavailable. Check API keys in backend/.env"}
    return _normalise_lab_response(raw)


def parse_lab_report(report_text: str):
    return analyze_lab_report(report_text)


def analyze_lab_report_image(image_bytes: bytes) -> dict:
    """OCR + analysis from a photo/scan of a lab report."""
    if not vision_available():
        return {"error": "No vision model configured. Set MISTRAL_API_KEY or GROQ_API_KEY in backend/.env."}

    raw = _vision(
        "Read every biomarker visible in this lab report image and return the JSON described in the system prompt.",
        image_bytes,
        max_tokens=1400,
        system=_LAB_SYSTEM_PROMPT,
    )
    if not raw:
        return {"error": "Vision model failed to read the image. Try a clearer photo."}
    return _normalise_lab_response(raw)


def _extract_pdf_text(pdf_bytes: bytes) -> str:
    try:
        from pypdf import PdfReader
        from io import BytesIO
        reader = PdfReader(BytesIO(pdf_bytes))
        return "\n".join((p.extract_text() or "") for p in reader.pages).strip()
    except Exception as e:
        print(f"[PDF EXTRACT EXCEPTION] {e}")
        return ""


def _rasterize_first_pdf_page(pdf_bytes: bytes) -> bytes | None:
    """Render the first page of a PDF to a PNG so vision models can OCR it.
    Tries pymupdf if installed; returns None otherwise."""
    try:
        import pymupdf  # type: ignore
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        if doc.page_count == 0:
            return None
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=200)
        return pix.tobytes("png")
    except Exception as e:
        print(f"[PDF RASTER EXCEPTION] {e}")
        return None


def analyze_lab_report_file(file_bytes: bytes, filename: str, content_type: str) -> dict:
    ct = (content_type or "").lower()
    name = (filename or "").lower()

    if ct.startswith("image/") or name.endswith((".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif")):
        # Auto-detect — if user uploaded an X-ray to the Reports tab, route correctly.
        det = detect_image_type(file_bytes)
        if det.get("type") in {"xray", "ct", "mri", "ultrasound", "skin_lesion"}:
            radio = classify_medical_image_with_resnet(file_bytes, det["type"])
            return {
                "detected_kind": det["type"],
                "detected_confidence": det.get("confidence", 0),
                "redirected_to": "radiology",
                "assessment": (
                    f"**Detected: {SCAN_TYPE_LABELS.get(det['type'], det['type'])}** "
                    f"(auto-routed by AI). This belongs in the Scans tab, but here is the radiology read:\n\n"
                    + (radio.get("analysis") or radio.get("error", ""))
                ),
                "confidence": det.get("confidence", 70),
                "urgency": "medium",
                "biomarkers": [],
                "recommendations": ["Re-upload under the Scans tab for full radiology workflow."],
            }
        return analyze_lab_report_image(file_bytes)

    if ct == "application/pdf" or name.endswith(".pdf"):
        text = _extract_pdf_text(file_bytes)
        if text and len(text) >= 20:
            return analyze_lab_report(text)
        # Text-extract failed — try rasterizing the first page and using vision OCR.
        png = _rasterize_first_pdf_page(file_bytes)
        if png:
            return analyze_lab_report_image(png)
        return {
            "error": "Could not extract text from this PDF and no PDF rasterizer is installed. "
                     "Re-upload as a clear JPG/PNG image, or `pip install pymupdf` on the backend to enable scanned-PDF OCR."
        }

    try:
        text = file_bytes.decode("utf-8", errors="ignore").strip()
    except Exception:
        return {"error": "Unsupported file type. Upload a PDF, image, or .txt lab report."}

    if not text:
        return {"error": "File appears empty."}
    return analyze_lab_report(text)
