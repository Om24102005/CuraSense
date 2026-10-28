from ..config import HF_TOKEN, HF_VISION_MODEL, MISTRAL_API_KEY
from . import chat as chat_service
from .image_detect import detect_image_type

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
    if not chat_service.vision_available():
        return {"error": "No vision model configured. Set MISTRAL_API_KEY or GROQ_API_KEY in backend/.env."}

    detection = detect_image_type(image_bytes)
    detected = detection.get("type", "other")

    # Wrong tab — got a lab report under Scans. Run the lab pipeline so the user still gets a useful result.
    if detected == "lab_report":
        from .lab_parser import analyze_lab_report_image  # local import: breaks the radiology<->lab_parser cycle
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

    analysis = chat_service.vision(prompt, image_bytes, max_tokens=600)
    if not analysis:
        return {"error": "Vision model failed to return a response. Check API keys."}

    return {
        "detected_kind": detected,
        "detected_confidence": detection.get("confidence", 0),
        "detected_reason": detection.get("reason", ""),
        "scan_type_used": detected if detected != "other" else scan_type,
        "analysis": analysis,
        "model": (
            f"hf-{HF_VISION_MODEL.split('/')[-1]}" if HF_TOKEN
            else ("mistral-pixtral" if MISTRAL_API_KEY else "groq-llama4-vision")
        ),
    }
