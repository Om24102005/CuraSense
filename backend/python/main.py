import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import DEEPSEEK_API_KEY, GROQ_API_KEY, HF_TOKEN, MISTRAL_API_KEY
from app.routers import symptoms, imaging, lab_report

app = FastAPI(title="CuraSense AI Gateway")

# Browsers no longer call this service (Node proxies every AI request and holds
# the gateway secret), so no cross-origin access is granted by default.
# Set CORS_ORIGINS="http://a.example,http://b.example" only if a trusted tool needs it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
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
        "ai_keys_loaded": bool(DEEPSEEK_API_KEY or HF_TOKEN or MISTRAL_API_KEY or GROQ_API_KEY),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
