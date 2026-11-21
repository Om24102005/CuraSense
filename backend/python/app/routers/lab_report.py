from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from ..deps import verify_gateway_auth
from ..schemas.lab_report import LabReportPayload
from ..services.lab_parser import analyze_lab_report, analyze_lab_report_file

router = APIRouter()


@router.post("/api/v1/diagnostics/lab-report")
def process_lab_report(payload: LabReportPayload, token: str = Depends(verify_gateway_auth)):
    """
    Clinical lab analysis from raw text (paste-text path).
    Returns biomarkers with normal ranges, clinical assessment,
    urgency level, and recommendations.
    """
    analysis = analyze_lab_report(payload.report_text, payload.context)
    return {
        "status":   "success",
        "module":   "Clinical Lab AI",
        "analysis": analysis,
    }


@router.post("/api/v1/diagnostics/lab-report-file")
def process_lab_report_file(
    patient_id: str = Form("demo-user"),
    context: str = Form(""),
    file: UploadFile = File(...),
    token: str = Depends(verify_gateway_auth),
):
    """
    Same clinical lab analysis as /lab-report but accepts an upload:
    PDF (text-based or scanned), image (vision OCR), or text file.
    Response shape matches /lab-report so the UI is identical.
    """
    file_bytes = file.file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    analysis = analyze_lab_report_file(file_bytes, context)
    return {
        "status":   "success",
        "module":   "Clinical Lab AI",
        "analysis": analysis,
    }
