"""
Health Check API Route
System status and diagnostics
"""

from fastapi import APIRouter
from datetime import datetime

from ml_models import get_model_manager

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint
    
    Returns API status and timestamp
    """
    return {
        "status": "healthy",
        "message": "Agricultural Intelligence System API is running",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }


@router.get("/status")
async def system_status():
    """
    Detailed system status
    
    Returns information about:
    - API status
    - ML models loading status
    - Available endpoints
    """
    model_manager = get_model_manager()
    model_status = model_manager.get_status()
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "api": {
            "name": "Agricultural Intelligence System",
            "description": "AI-powered farming assistance platform"
        },
        "ml_models": {
            "mock_mode": model_status["mock_mode"],
            "loaded_models": model_status["models_loaded"],
            "models_directory": model_status["models_dir"]
        },
        "modules": [
            {"name": "Soil Fertility", "status": "active", "endpoint": "/api/predict/soil"},
            {"name": "Weather Risk", "status": "active", "endpoint": "/api/predict/weather"},
            {"name": "Crop Recommendation", "status": "active", "endpoint": "/api/predict/crop"},
            {"name": "Yield Prediction", "status": "active", "endpoint": "/api/predict/yield"},
            {"name": "Fertilizer Advisory", "status": "active", "endpoint": "/api/predict/fertilizer"},
            {"name": "AI Chatbot", "status": "active", "endpoint": "/api/chat/message"},
            {"name": "Weather Service", "status": "active", "endpoint": "/api/weather/current"},
            {"name": "Settings", "status": "active", "endpoint": "/api/settings/profile"}
        ],
        "features": {
            "bilingual_support": ["en", "hi", "te", "ta", "kn"],
            "voice_enabled": True,
            "offline_mode": True,
            "real_time_weather": True
        }
    }


@router.get("/")
async def root():
    """
    Root endpoint - API welcome message
    """
    return {
        "message": "🌱 Welcome to Agricultural Intelligence System API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "status": "/status"
    }
