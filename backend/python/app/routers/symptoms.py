from fastapi import APIRouter, Depends
from ..deps import verify_gateway_auth
from ..schemas.symptom import SymptomPayload
from ..services.triage import analyze_symptoms_with_mistral

router = APIRouter()


@router.post("/api/v1/diagnostics/symptoms")
def process_symptoms(payload: SymptomPayload, token: str = Depends(verify_gateway_auth)):
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
