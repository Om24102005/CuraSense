import json
from . import chat as chat_service
from .image_detect import detect_image_type
from .radiology import SCAN_TYPE_LABELS

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
        "assessment":      parsed.get("assessment", "No assessment provided."),
        "confidence":      int(parsed.get("confidence", 80)),
        "urgency":         parsed.get("urgency", "medium"),
        "biomarkers":      cleaned,
        "recommendations": parsed.get("recommendations", []) or [],
    }


def analyze_lab_report(report_text: str):
    """Lab analysis from raw text (paste-text path)."""
    raw = chat_service.chat(_LAB_SYSTEM_PROMPT, f"Report:\n{report_text}", max_tokens=900)
    if not raw:
        return {"error": "AI analyst unavailable. Check API keys in backend/.env"}
    return _normalise_lab_response(raw)


def parse_lab_report(report_text: str):
    return analyze_lab_report(report_text)


def analyze_lab_report_image(image_bytes: bytes) -> dict:
    """OCR + analysis from a photo/scan of a lab report."""
    if not chat_service.vision_available():
        return {"error": "No vision model configured. Set MISTRAL_API_KEY or GROQ_API_KEY in backend/.env."}

    raw = chat_service.vision(
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
            from .radiology import classify_medical_image_with_resnet  # local import: breaks the lab_parser<->radiology cycle
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
