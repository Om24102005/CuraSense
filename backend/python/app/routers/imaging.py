from fastapi import APIRouter, Depends, UploadFile, File, Form
from ..deps import verify_gateway_auth
from ..services.radiology import classify_medical_image_with_resnet

router = APIRouter()


@router.post("/api/v1/diagnostics/imaging")
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
