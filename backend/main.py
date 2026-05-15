import logging
from dotenv import load_dotenv

# Must run before any module imports settings
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from core.config import settings
from routers.agent import agent_router
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info(f"Starting {settings.APP_NAME}...")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered backend for IronHaus",
    version="0.0.1",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler so the API always returns clean JSON on unexpected errors."""
    logger.exception("Unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred. Please try again later."},
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.APP_NAME}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": f"Welcome to the {settings.APP_NAME}", "docs": "/docs"}

# Include routers
app.include_router(agent_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
