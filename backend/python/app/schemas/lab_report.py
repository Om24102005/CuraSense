from pydantic import BaseModel


class LabReportPayload(BaseModel):
    patient_id: str
    report_text: str
