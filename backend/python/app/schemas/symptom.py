from typing import Optional
from pydantic import BaseModel


class SymptomPayload(BaseModel):
    patient_id: str
    symptoms: str
    # Optional biometric context injected by the Node server from MongoDB.
    # When present, it is prepended to the user message as an immutable
    # clinical baseline before DeepSeek V4 Pro performs triage analysis.
    wearable_context: Optional[str] = None
