from fastapi import FastAPI

from app.routers.analyze import router as analyze_router

app = FastAPI(
    title="Resume Enhancement API",
    description="Rule-based + NLP microservice for AI-powered resume analysis",
    version="1.0.0",
)

app.include_router(analyze_router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
