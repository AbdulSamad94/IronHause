from fastapi import FastAPI
from contextlib import asynccontextmanager
from core.config import settings
from routers.agent import agent_router
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    print(f"Starting {settings.APP_NAME}...")
    yield
    print(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered backend for IronHaus",
    version="0.0.1",
    lifespan=lifespan,
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
