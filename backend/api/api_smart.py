"""
Smart Agricultural API v3.0 - Fixed Edition
With Auto-Fetched Weather & Comprehensive Autonomous Reasoning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
from datetime import datetime
from contextlib import asynccontextmanager
import sys

# Import trained model manager
sys.path.insert(0, os.path.dirname(__file__))
from ml_models.model_manager import ModelManager
from services.smart_weather_service import SmartWeatherService, ComprehensiveFarmRecommendationEngine

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class SimpleFarmDataRequest(BaseModel):
    """Simplified request - location-based, no weather prediction needed"""
    location: str
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    soil_moisture: float
    month: Optional[int] = None

class SoilTestRequest(BaseModel):
    """Quick soil test"""
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float

# ============================================================================
# GLOBAL SERVICES - INITIALIZE AT MODULE LOAD
# ============================================================================

# Global services - lazy initialized
_services_initialized = False
model_manager = None
weather_service = None
recommendation_engine = None

def _init_services():
    """Initialize services on first use (lazy loading)"""
    global _services_initialized, model_manager, weather_service, recommendation_engine
    
    if _services_initialized:
        return
    
    try:
        print("[INIT] Loading ModelManager...", flush=True)
        model_manager = ModelManager()
        print("[INIT] ModelManager loaded", flush=True)
        
        print("[INIT] Loading SmartWeatherService...", flush=True)
        weather_service = SmartWeatherService()
        print("[INIT] SmartWeatherService loaded", flush=True)
        
        print("[INIT] Loading ComprehensiveFarmRecommendationEngine...", flush=True)
        recommendation_engine = ComprehensiveFarmRecommendationEngine(weather_service)
        print("[INIT] ComprehensiveFarmRecommendationEngine loaded", flush=True)
        
        _services_initialized = True
        print("[INIT] All services ready", flush=True)
        
    except Exception as e:
        print(f"[ERROR] Service init failed: {type(e).__name__}: {e}", flush=True)
        import traceback
        traceback.print_exc()

# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="Smart Agricultural API v3.0",
    description="Auto-fetch weather + autonomous farm recommendations",
    version="3.0"
)

_ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """API Information"""
    return {
        "api": "Smart Agricultural Intelligence System v3.0",
        "status": "operational",
        "features": [
            "Auto-fetch weather (91,320 historical records)",
            "No weather prediction needed",
            "Comprehensive farm analysis",
            "All reasoning automated"
        ],
        "endpoints": {
            "health": "/health",
            "soil_test": "/soil-test",
            "smart_report": "/smart-report",
            "locations": "/locations",
            "weather": "/weather/{location}/{month}"
        }
    }

@app.get("/health")
async def health():
    """Health check"""
    _init_services()
    return {
        "status": "healthy",
        "models_loaded": model_manager is not None,
        "weather_service": weather_service is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/soil-test")
async def soil_test(request: SoilTestRequest):
    """Quick soil analysis"""
    _init_services()
    try:
        avg_npk = (request.nitrogen + request.phosphorus + request.potassium) / 3
        
        if avg_npk < 20:
            fertility = "Poor"
        elif avg_npk < 40:
            fertility = "Fair"
        else:
            fertility = "Good"
        
        if request.ph < 6:
            ph_status = "Acidic"
        elif request.ph > 7.5:
            ph_status = "Alkaline"
        else:
            ph_status = "Neutral"
        
        return {
            "success": True,
            "data": {
                "fertility": fertility,
                "average_npk": round(avg_npk, 2),
                "ph_status": ph_status,
                "nitrogen": request.nitrogen,
                "phosphorus": request.phosphorus,
                "potassium": request.potassium,
                "ph": request.ph
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/smart-report")
async def smart_report(request: SimpleFarmDataRequest):
    """Generate comprehensive farm report"""
    _init_services()
    try:
        if recommendation_engine is None:
            return {
                "success": False,
                "error": "Recommendation engine not initialized",
                "note": "System starting up, please retry"
            }
        
        # Generate comprehensive report
        report = recommendation_engine.generate_complete_farm_report(
            location=request.location,
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph=request.ph,
            soil_moisture=request.soil_moisture,
            month=request.month
        )
        
        return {
            "success": True,
            "data": report,
            "timestamp": datetime.now().isoformat(),
            "note": "[SUCCESS] Weather auto-fetched from historical data!"
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/locations")
async def get_locations():
    """Get available locations"""
    _init_services()
    try:
        if weather_service is None or not weather_service.locations:
            return {
                "success": False,
                "message": "Weather service not initialized",
                "note": "System uses default seasonal patterns"
            }
        
        return {
            "success": True,
            "locations": sorted(weather_service.locations),
            "count": len(weather_service.locations),
            "note": "Use these location names for accurate weather"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "locations": ["Delhi", "Mumbai", "Bangalore", "Chennai", "Default"]
        }

@app.get("/weather/{location}/{month}")
async def get_weather(location: str, month: int):
    """Get weather for location and month"""
    _init_services()
    try:
        if month < 1 or month > 12:
            return {"success": False, "error": "Month must be 1-12"}
        
        if weather_service is None:
            return {"success": False, "error": "Weather service not initialized"}
        
        weather = weather_service.get_current_month_weather(location, month)
        seasonal = weather_service.get_seasonal_crop_recommendations(location, month)
        
        return {
            "success": True,
            "location": location,
            "month": month,
            "weather": weather,
            "seasonal_info": seasonal,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/detailed-analysis")
async def detailed_analysis(request: SimpleFarmDataRequest):
    """Detailed analysis with full reasoning"""
    _init_services()
    try:
        if recommendation_engine is None:
            return {"success": False, "error": "Engine not initialized"}
        
        report = recommendation_engine.generate_complete_farm_report(
            location=request.location,
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph=request.ph,
            soil_moisture=request.soil_moisture,
            month=request.month
        )
        
        return {
            "success": True,
            "analysis": report,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ============================================================================
# ROOT STARTUP
# ============================================================================
