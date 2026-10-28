import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import symptoms, imaging, lab_report

app = FastAPI(title="CuraSense AI Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptoms.router)
app.include_router(imaging.router)
app.include_router(lab_report.router)


@app.get("/health")
async def health():
    """Lightweight unauthenticated probe used by the frontend status pill."""
    return {
        "status": "ok",
        "service": "python-ai",
        "ai_keys_loaded": bool(os.getenv("MISTRAL_API_KEY") or os.getenv("GROQ_API_KEY")),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
