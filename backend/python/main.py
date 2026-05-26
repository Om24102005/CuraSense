import os
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import uvicorn

from ai_core import analyze_symptoms_with_mistral, classify_medical_image_with_resnet, analyze_lab_report, analyze_lab_report_file

# Load .env from the backend root (../) so a single env file feeds
# both this Python service and the Node service in ../node.
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")
load_dotenv()  # also pick up a local .env if present
GATEWAY_SECRET = os.getenv("GATEWAY_SECRET", "")

app = FastAPI(title="CuraSense AI Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    """Lightweight unauthenticated probe used by the frontend status pill."""
    return {
        "status": "ok",
        "service": "python-ai",
        "ai_keys_loaded": bool(os.getenv("MISTRAL_API_KEY") or os.getenv("GROQ_API_KEY")),
    }


async def verify_gateway_auth(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized System Access")
    token = authorization.split(" ")[1]
    if token != GATEWAY_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Gateway Token")
    return token


class SymptomPayload(BaseModel):
    patient_id: str
    symptoms: str
    # Optional biometric context injected by the Node server from MongoDB.
    # When present, it is prepended to the user message as an immutable
    # clinical baseline before DeepSeek V4 Pro performs triage analysis.
    wearable_context: Optional[str] = None


class LabReportPayload(BaseModel):
    patient_id: str
    report_text: str


# --- API ENDPOINTS ---

@app.post("/api/v1/diagnostics/symptoms")
async def process_symptoms(payload: SymptomPayload, token: str = Depends(verify_gateway_auth)):
    """
    DeepSeek V4 Pro structured triage. Returns conditions with
    probabilities, urgency level, and recommendations.
    When wearable_context is provided (injected by Node from MongoDB),
    the AI baseline includes real-time Apple Watch biometrics.
    """
    analysis = analyze_symptoms_with_mistral(
        payload.symptoms,
        wearable_context=payload.wearable_context,
    )
    return {
        "status":  "success",
        "module":  "NLP Symptom Triage",
        "analysis": analysis,
        "result":   analysis.get("assessment", ""),  # legacy text field
    }


@app.post("/api/v1/diagnostics/imaging")
async def process_imaging(
    patient_id: str = Form(...),
    scan_type: str = Form("scan"),
    file: UploadFile = File(...),
    token: str = Depends(verify_gateway_auth),
):
    """Routes images to Pixtral-12B vision model."""
    image_bytes = await file.read()
    result = classify_medical_image_with_resnet(image_bytes, scan_type)
    return {
        "status":          "success",
        "module":          "AI Medical Vision",
        "vision_analysis": result,
    }


@app.post("/api/v1/diagnostics/lab-report")
async def process_lab_report(payload: LabReportPayload, token: str = Depends(verify_gateway_auth)):
    """
    Clinical lab analysis from raw text (paste-text path).
    Returns biomarkers with normal ranges, clinical assessment,
    urgency level, and recommendations.
    """
    analysis = analyze_lab_report(payload.report_text)
    return {
        "status":   "success",
        "module":   "Clinical Lab AI",
        "analysis": analysis,
    }


@app.post("/api/v1/diagnostics/lab-report-file")
async def process_lab_report_file(
    patient_id: str = Form("demo-user"),
    file: UploadFile = File(...),
    token: str = Depends(verify_gateway_auth),
):
    """
    Same clinical lab analysis as /lab-report but accepts an upload:
    PDF (text-based), image (Pixtral OCR), or text file.
    Response shape matches /lab-report so the UI is identical.
    """
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    analysis = analyze_lab_report_file(file_bytes, file.filename or "", file.content_type or "")
    return {
        "status":   "success",
        "module":   "Clinical Lab AI",
        "analysis": analysis,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
