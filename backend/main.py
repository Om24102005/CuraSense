import os
from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

from ai_core import analyze_symptoms_with_mistral, classify_medical_image_with_resnet, parse_lab_report

load_dotenv()
GATEWAY_SECRET = os.getenv("GATEWAY_SECRET", "")

app = FastAPI(title="CuraSense AI Gateway")

# Allow your frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class LabReportPayload(BaseModel):
    patient_id: str
    report_text: str

# --- API ENDPOINTS ---

@app.post("/api/v1/diagnostics/symptoms")
async def process_symptoms(payload: SymptomPayload, token: str = Depends(verify_gateway_auth)):
    """Routes text to Mistral-7B"""
    triage_result = analyze_symptoms_with_mistral(payload.symptoms)
    return {
        "status": "success",
        "module": "NLP Symptom Triage",
        "result": triage_result
    }

@app.post("/api/v1/diagnostics/imaging")
async def process_imaging(patient_id: str = Form(...), scan_type: str = Form("scan"), file: UploadFile = File(...), token: str = Depends(verify_gateway_auth)):
    """Routes images to Pixtral-12B vision model"""
    image_bytes = await file.read()
    result = classify_medical_image_with_resnet(image_bytes, scan_type)
    return {
        "status": "success",
        "module": "AI Medical Vision",
        "vision_analysis": result
    }

@app.post("/api/v1/diagnostics/lab-report")
async def process_lab_report(payload: LabReportPayload, token: str = Depends(verify_gateway_auth)):
    """Routes raw text to the Bio-Parser"""
    parsed_data = parse_lab_report(payload.report_text)
    return {
        "status": "success",
        "module": "NLP Bio-Parser",
        "structured_data": parsed_data
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)