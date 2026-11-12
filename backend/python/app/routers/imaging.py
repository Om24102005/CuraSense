from fastapi import APIRouter, Depends, UploadFile, File, Form
from ..deps import verify_gateway_auth
from ..services.radiology import analyze_scan

router = APIRouter()


# Plain `def`: the AI calls block, so FastAPI runs them in its threadpool instead of the event loop.
@router.post("/api/v1/diagnostics/imaging")
def process_imaging(
    patient_id: str = Form(...),
    scan_type: str = Form("scan"),
    study: str = Form(""),
    context: str = Form(""),
    regions: str = Form(""),
    file: UploadFile = File(...),
    token: str = Depends(verify_gateway_auth),
):
    """Scans page: radiology read of an image, DICOM, ZIP, scanned PDF or report. Refuses other kinds of content."""
    result = analyze_scan(file.file.read(), scan_type, study, context, regions)
    return {
        "status":          "success",
        "module":          "AI Medical Vision",
        "vision_analysis": result,
    }
