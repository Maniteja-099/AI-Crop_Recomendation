#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI-Driven Agricultural Intelligence System - Optimized Backend
Centralized Service-Oriented Architecture
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from contextlib import asynccontextmanager
try:
    from pydantic_core import ValidationError as CoreValidationError
except ImportError:
    CoreValidationError = ValidationError
from typing import Optional, Dict, Any
from datetime import datetime
import logging
import warnings

# Load environment variables early
from dotenv import load_dotenv
import os as _os
load_dotenv()

# Import internal services and models
from services.prediction_service import get_prediction_service
from services.chatbot_service import get_chatbot_service
from models.chat import ChatResponse, ChatRequest as InternalChatRequest

warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("main")

# Lifespan handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown resources."""
    logger.info("Starting Farm Intelligence API...")
    # Eagerly initialize services at startup
    get_prediction_service()
    get_chatbot_service()
    logger.info("All services initialized.")
    yield
    # Shutdown: close any open connections
    logger.info("Shutting down Farm Intelligence API...")

# Initialize FastAPI App
app = FastAPI(
    title="Farm Intelligence API",
    description="AI-powered backend for crop, soil, weather, and yield analysis",
    version="2.0",
    lifespan=lifespan,
)

# Configure CORS
_ALLOWED_ORIGINS = _os.getenv(
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

# Initialize Services
prediction_service = get_prediction_service()
chatbot_service = get_chatbot_service()

# Mount additional API route modules (settings, system status)
from api.routes.settings import router as settings_router
from api.routes.health import router as health_router
from api.routes.auth import router as auth_router
from api.routes.chatbot import router as chatbot_router
from api.routes.weather import router as weather_router
from api.routes.predict import router as predict_router

app.include_router(settings_router, prefix="/api")
app.include_router(health_router, prefix="/api/system")
app.include_router(auth_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api")
app.include_router(weather_router, prefix="/api")
app.include_router(predict_router, prefix="/api")

# ============================================================================
# API MODELS (Compatibility Layer for Frontend)
# ============================================================================

class FullReportRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    temperature: float
    humidity: float
    rainfall: float
    month: int
    area: float
    state: str = "Karnataka"
    season: str = "Kharif"
    soil_type: str = "Loamy"
    language: str = "en"

class ChatRequestApi(BaseModel):
    """frontend chat request model"""
    message: str
    language: str = "en"
    context_data: Optional[Dict[str, Any]] = None

class YieldPredictionRequest(BaseModel):
    """Standalone yield prediction request"""
    crop: str = "Rice"
    season: str = "Kharif"
    state: str = "Karnataka"
    area: float = 1.0
    rainfall: float = 1000.0
    fertilizer: float = 60.0

class CropRecommendationRequest(BaseModel):
    """Standalone crop recommendation request"""
    nitrogen: float = 90
    phosphorus: float = 40
    potassium: float = 40
    temperature: float = 25
    humidity: float = 80
    ph: float = 6.5
    rainfall: float = 200

class FertilizerRecommendationRequest(BaseModel):
    """Standalone fertilizer recommendation request"""
    nitrogen: float = 0
    phosphorus: float = 0
    potassium: float = 0
    temperature: float = 25
    humidity: float = 70
    moisture: float = 50
    soil_type: str = "Loamy"
    crop_type: str = "Rice"

class WeatherRiskRequest(BaseModel):
    """Standalone weather risk request"""
    month: int = 6
    temperature: float = 30

class TranslationBatchRequest(BaseModel):
    """Batch translation request from frontend"""
    texts: Dict[str, str]  # key -> English text
    target_language: str = "en"

# ============================================================================
# TRANSLATION ENDPOINT (for dynamic UI translations)
# ============================================================================

import re

@app.post("/api/translate/batch")
async def translate_batch(request: TranslationBatchRequest):
    """
    Translate a batch of UI strings from English to any target language.
    Uses Google Translate on the backend to avoid CSP issues.
    Parallelized with asyncio.gather + semaphore for fast batch translation.
    """
    if request.target_language == "en":
        return {"success": True, "translations": request.texts}
    try:
        import asyncio
        import urllib.parse
        import httpx

        translated = {}
        # Semaphore limits concurrent Google Translate requests to avoid rate-limiting
        sem = asyncio.Semaphore(15)

        async def translate_one(client, key, text):
            """Translate a single key-value pair."""
            if not text or not isinstance(text, str) or len(text.strip()) < 1:
                return key, text
            async with sem:
                try:
                    url = (
                        f"https://translate.googleapis.com/translate_a/single"
                        f"?client=gtx&sl=en&tl={request.target_language}&dt=t"
                        f"&q={urllib.parse.quote(text)}"
                    )
                    response = await client.get(url)
                    if response.status_code == 200:
                        data = response.json()
                        if data and isinstance(data, list) and len(data) > 0 and data[0]:
                            translated_text = "".join(
                                [sentence[0] for sentence in data[0] if sentence[0]]
                            )
                            return key, (translated_text if translated_text else text)
                        return key, text
                    else:
                        logger.warning(f"Translation API returned {response.status_code} for key '{key}'")
                        return key, text
                except httpx.TimeoutException:
                    logger.warning(f"Translation timed out for key '{key}': {text[:20]}...")
                    return key, text
                except Exception as e:
                    logger.warning(f"Translation failed for key '{key}': {text[:20]}... --> {e}")
                    return key, text

        # Fire all translations concurrently with semaphore-gated parallelism
        async with httpx.AsyncClient(timeout=10.0) as client:
            tasks = [
                translate_one(client, key, text)
                for key, text in request.texts.items()
            ]
            results = await asyncio.gather(*tasks)

        for key, value in results:
            translated[key] = value

        return {"success": True, "translations": translated}

    except Exception as e:
        logger.error(f"Batch translation error: {e}")
        return {"success": False, "translations": request.texts, "error": str(e)}

@app.post("/api/analyze/full-report")
async def analyze_full_report(request: FullReportRequest):
    """
    🎯 Optimized Unified Analysis Pipeline
    Uses specialized services for high-quality reasoning
    Returns bilingual response based on request.language
    """
    from models.prediction import SoilInput, WeatherInput, CropInput, YieldInput, FertilizerInput
    from config.data_ranges import DEFAULTS, YIELD_QUALITY_THRESHOLDS, TRANSLATION_TIMEOUT_SECONDS
    
    try:
        # 1. Soil Analysis
        soil_res = prediction_service.predict_soil_fertility(SoilInput(
            nitrogen=request.nitrogen, phosphorus=request.phosphorus, potassium=request.potassium
        ))
        
        # 2. Weather Analysis
        weather_res = prediction_service.predict_weather_risk(WeatherInput(
            month=request.month, temperature=request.temperature
        ))
        
        # 3. Crop Recommendation
        crop_res = prediction_service.predict_crop(CropInput(
            nitrogen=request.nitrogen, phosphorus=request.phosphorus, potassium=request.potassium,
            temperature=request.temperature, humidity=request.humidity, 
            ph=request.ph, rainfall=request.rainfall
        ))
        recommended_crop = crop_res.recommended_crop
        
        # 4. Yield Prediction
        yield_res = prediction_service.predict_yield(YieldInput(
            crop=recommended_crop, area=request.area, rainfall=request.rainfall,
            fertilizer=DEFAULTS["fertilizer_amount"], state=request.state, season=request.season # type: ignore
        ))
        
        # 5. Fertilizer Advisory
        fert_res = prediction_service.predict_fertilizer(FertilizerInput(
            nitrogen=request.nitrogen, phosphorus=request.phosphorus, potassium=request.potassium,
            temperature=request.temperature, humidity=request.humidity, 
            moisture=DEFAULTS["moisture"], soil_type=request.soil_type, crop_type=recommended_crop
        ))

        # FORMAT FOR FRONTEND COMPATIBILITY
        # The frontend expects specific keys (e.g. 'crop' in crop object, 'yield_value' in yield object)
        
        # Map Soil
        soil_mapped = {
            "status": soil_res.status,
            "message": soil_res.message,
            "description": soil_res.description,
            "icon": soil_res.icon,
            "avg_nutrients": soil_res.avg_nutrients,
            "recommendation": soil_res.recommendation
        }
        
        # Map Weather
        weather_mapped = {
            "status": weather_res.status,
            "label": weather_res.label,
            "description": weather_res.description,
            "icon": weather_res.icon,
            "recommendation": weather_res.recommendation
        }
        
        # Map Crop
        crop_mapped = {
            "crop": crop_res.recommended_crop.capitalize(),
            "icon": crop_res.icon,
            "conditions": crop_res.ideal_conditions,
            "confidence": crop_res.confidence
        }
        
        # Map Yield
        yield_mapped = {
            "yield_value": yield_res.predicted_yield,
            "perHectare": yield_res.yield_per_hectare,
            "quality": "Excellent" if yield_res.yield_per_hectare > YIELD_QUALITY_THRESHOLDS["excellent_min"] else "Good" if yield_res.yield_per_hectare > YIELD_QUALITY_THRESHOLDS["good_min"] else "Fair",
            "area": request.area
        }
        
        # Map Fertilizer
        deficiencies = fert_res.deficiency_analysis if fert_res.deficiency_analysis else {}
        fert_mapped = {
            "fertilizer": fert_res.recommended_fertilizer,
            "icon": fert_res.icon,
            "use": fert_res.recommendation, # Map long recommendation to 'use'
            "application_rate": fert_res.timing, # PredictionService puts it here
            "deficiencies": {
                "nitrogen": deficiencies.get("nitrogen", {}).get("deficit", 0) > 0,
                "phosphorous": deficiencies.get("phosphorus", {}).get("deficit", 0) > 0,
                "potassium": deficiencies.get("potassium", {}).get("deficit", 0) > 0
            }
        }

        final_response = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "report": {
                "soil": soil_mapped,
                "weather": weather_mapped,
                "crop": crop_mapped,
                "yield": yield_mapped,
                "fertilizer": fert_mapped
            },
            "summary": {
                "verdict": f"Grow {crop_mapped['crop']} {crop_mapped['icon']}",
                "expected_yield": f"{yield_mapped['yield_value']} tons",
                "soil_health": soil_mapped['message'],
                "weather_status": weather_mapped['label'],
                "priority_action": fert_mapped['fertilizer']
            },
            "confidence": crop_mapped['confidence']
        }

        # ---------------------------------------------------------
        # 6. TRANSLATION LAYER
        #    Step A: Replace known agricultural terms with proper
        #            regional names (crop, fertilizer, soil, weather)
        #    Step B: Use Google Translate for remaining free-text
        # ---------------------------------------------------------
        if request.language and request.language != "en":
            try:
                from config.regional_terms import get_regional_term, translate_agricultural_text
                from deep_translator import GoogleTranslator
                target_lang = request.language
                translator = GoogleTranslator(source='auto', target=target_lang)
                import asyncio

                # --- Step A: Regional term substitution (instant, no API call) ---
                # Discrete labels — use exact regional names
                crop_mapped["crop"]           = get_regional_term(crop_mapped["crop"], target_lang, "crop")
                fert_mapped["fertilizer"]     = get_regional_term(fert_mapped["fertilizer"], target_lang, "fertilizer")
                soil_mapped["message"]        = get_regional_term(soil_mapped["message"], target_lang, "soil_status")
                weather_mapped["label"]       = get_regional_term(weather_mapped["label"], target_lang, "weather")
                yield_mapped["quality"]       = get_regional_term(yield_mapped["quality"], target_lang, "yield_quality")

                # Longer text fields — swap embedded crop/fertilizer names first
                soil_mapped["description"]       = translate_agricultural_text(soil_mapped["description"], target_lang)
                soil_mapped["recommendation"]    = translate_agricultural_text(soil_mapped["recommendation"], target_lang)
                weather_mapped["description"]    = translate_agricultural_text(weather_mapped["description"], target_lang)
                weather_mapped["recommendation"] = translate_agricultural_text(weather_mapped["recommendation"], target_lang)
                crop_mapped["conditions"]        = translate_agricultural_text(crop_mapped["conditions"], target_lang)
                fert_mapped["use"]               = translate_agricultural_text(fert_mapped["use"], target_lang)
                fert_mapped["application_rate"]  = translate_agricultural_text(fert_mapped["application_rate"], target_lang)

                # Rebuild summary with regional terms already applied
                final_response["summary"]["verdict"]        = f"Grow {crop_mapped['crop']} {crop_mapped['icon']}"
                final_response["summary"]["soil_health"]    = soil_mapped["message"]
                final_response["summary"]["weather_status"] = weather_mapped["label"]
                final_response["summary"]["priority_action"]= fert_mapped["fertilizer"]

                # --- Step B: Google Translate for remaining free-text fields ---
                async def _t(text: str) -> str:
                    """Translate a single string in a thread with timeout.
                    Falls back to original text on any failure."""
                    if not text or not any(c.isalpha() for c in text):
                        return text
                    loop = asyncio.get_event_loop()
                    try:
                        return await asyncio.wait_for(
                            loop.run_in_executor(None, translator.translate, text),
                            timeout=TRANSLATION_TIMEOUT_SECONDS,
                        )
                    except Exception:
                        return text  # graceful fallback

                # Only translate free-text fields that still need machine translation
                # (crop name, fertilizer name, soil status, weather label, quality
                #  are already set to proper regional terms above)
                fields = {
                    "summary_verdict":        final_response["summary"]["verdict"],
                    "soil_description":       soil_mapped["description"],
                    "soil_recommendation":    soil_mapped["recommendation"],
                    "weather_description":    weather_mapped["description"],
                    "weather_recommendation": weather_mapped["recommendation"],
                    "crop_conditions":        crop_mapped["conditions"],
                    "fert_use":               fert_mapped["use"],
                    "fert_rate":              fert_mapped["application_rate"],
                }

                keys   = list(fields.keys())
                values = list(fields.values())

                translated = await asyncio.gather(
                    *[_t(v) for v in values],
                    return_exceptions=True,
                )

                result_map = {
                    k: (t if not isinstance(t, Exception) else v)
                    for k, t, v in zip(keys, translated, values)
                }

                # Write translated free-text back
                final_response["summary"]["verdict"]                       = result_map["summary_verdict"]
                final_response["report"]["soil"]["description"]            = result_map["soil_description"]
                final_response["report"]["soil"]["recommendation"]         = result_map["soil_recommendation"]
                final_response["report"]["weather"]["description"]         = result_map["weather_description"]
                final_response["report"]["weather"]["recommendation"]      = result_map["weather_recommendation"]
                final_response["report"]["crop"]["conditions"]             = result_map["crop_conditions"]
                final_response["report"]["fertilizer"]["use"]              = result_map["fert_use"]
                final_response["report"]["fertilizer"]["application_rate"] = result_map["fert_rate"]

                # Ensure regional-term labels are in final response
                final_response["report"]["soil"]["message"]           = soil_mapped["message"]
                final_response["report"]["weather"]["label"]          = weather_mapped["label"]
                final_response["report"]["crop"]["crop"]              = crop_mapped["crop"]
                final_response["report"]["yield"]["quality"]          = yield_mapped["quality"]
                final_response["report"]["fertilizer"]["fertilizer"]  = fert_mapped["fertilizer"]

            except Exception as e:
                logger.warning("Report Translation Failed: %s", e)
                # Fallback to English (original) if translation fails
        
        return final_response
        
    except (ValidationError, CoreValidationError, ValueError) as e:
        # Log validation errors for debugging
        logger.warning("Validation Error: %s", e)
        raise HTTPException(status_code=400, detail=f"Validation Error: {str(e)}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# ============================================================================
# STANDALONE ENDPOINTS (For Individual Frontend Modules)
# ============================================================================

class SoilFertilityRequest(BaseModel):
    """Simple soil fertility request"""
    nitrogen: float
    phosphorus: float
    potassium: float

@app.post("/api/soil-fertility")
async def check_soil_fertility_simple(request: SoilFertilityRequest):
    """Simple soil fertility check endpoint (used by frontend api.js)"""
    from models.prediction import SoilInput
    try:
        payload = SoilInput(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium
        )
        result = prediction_service.predict_soil_fertility(payload)
        return {
            "status": result.status,
            "message": result.message,
            "description": result.description,
            "icon": result.icon,
            "avg_nutrients": result.avg_nutrients,
            "recommendation": result.recommendation,
            "detailed_analysis": result.detailed_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/soil-fertility/comprehensive")
async def check_soil_fertility_comprehensive(request: SoilFertilityRequest):
    """
    Comprehensive Soil Fertility Report Endpoint
    """
    from models.prediction import SoilInput
    try:
        # Validate Input
        payload = SoilInput(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium
        )
        
        # Get AI Prediction
        result = prediction_service.predict_soil_fertility(payload)
        
        # Get Fertilizer Recommendation
        from models.prediction import FertilizerInput
        fert_res = prediction_service.predict_fertilizer(FertilizerInput(
            nitrogen=payload.nitrogen, phosphorus=payload.phosphorus, potassium=payload.potassium,
            temperature=25, humidity=60, moisture=50, soil_type="Loamy", crop_type="Generic"
        ))

        # Construct Comprehensive Response
        return {
            "summary": {
                "overall_status": result.message,
                "fertility_score": int(result.avg_nutrients * 2) if result.avg_nutrients < 50 else 95, 
                "immediate_priority": "Nitrogen" if payload.nitrogen < 50 else "None",
                "next_test_due": "6 months"
            },
            "soil_health": {
                "status": result.status,
                "icon": result.icon,
                "description": result.description
            },
            "nutrient_analysis": {
                "nitrogen": {
                    "value": payload.nitrogen,
                    "status": result.detailed_analysis["nitrogen_status"].lower(),
                    "level": result.detailed_analysis["nitrogen_status"],
                    "optimal_range": result.detailed_analysis["dataset_reference"]["nitrogen_range"],
                    "icon": "🟢",
                    "recommendation": "Apply Urea if low" if payload.nitrogen < 50 else "Maintain levels"
                },
                "phosphorus": {
                    "value": payload.phosphorus,
                    "status": result.detailed_analysis["phosphorus_status"].lower(),
                    "level": result.detailed_analysis["phosphorus_status"],
                    "optimal_range": result.detailed_analysis["dataset_reference"]["phosphorus_range"],
                    "icon": "🟠",
                    "recommendation": "Apply DAP if low" if payload.phosphorus < 30 else "Maintain levels"
                },
                "potassium": {
                    "value": payload.potassium,
                    "status": result.detailed_analysis["potassium_status"].lower(),
                    "level": result.detailed_analysis["potassium_status"],
                    "optimal_range": result.detailed_analysis["dataset_reference"]["potassium_range"],
                    "icon": "🔵",
                    "recommendation": "Apply Potash if low" if payload.potassium < 30 else "Maintain levels"
                }
            },
             "yield_potential": {
                "level": "High" if result.status == "success" else "Medium",
                "estimate": "4-5 tons/hectare",
                "description": "Based on current soil nutrient profile",
                "icon": "🌾"
            },
            "fertilizer_recommendations": [
                {
                    "name": fert_res.recommended_fertilizer,
                    "icon": fert_res.icon,
                    "dosage": fert_res.timing,
                    "timing": "At sowing",
                    "purpose": "Boost overall growth"
                }
            ],
            "precautions": [
                "✅ Ensure proper drainage",
                "⚠️ Avoid over-fertilization",
                "✅ Monitor pH levels regularly"
            ],
            "actions_for_optimal_growth": [
                "Apply recommended fertilizers in split doses",
                "Maintain soil moisture at 50%",
                "Use organic mulch to retain nutrients"
            ]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/yield-prediction")
async def predict_yield_standalone(request: YieldPredictionRequest):
    """Standalone yield prediction endpoint"""
    from models.prediction import YieldInput
    try:
        payload = YieldInput(
            crop=request.crop,
            season=request.season,
            state=request.state,
            area=request.area,
            rainfall=request.rainfall,
            fertilizer=request.fertilizer
        )
        result = prediction_service.predict_yield(payload)
        
        # Format for frontend compatibility
        return {
            "yield_value": result.predicted_yield,
            "perHectare": result.yield_per_hectare,
            "area": payload.area,
            "unit": result.unit,
            "currency": "INR",
            "market_value": result.market_value_estimate
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/crop-recommendation")
async def recommend_crop_standalone(request: CropRecommendationRequest):
    """Standalone crop recommendation endpoint"""
    from models.prediction import CropInput
    try:
        payload = CropInput(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            temperature=request.temperature,
            humidity=request.humidity,
            ph=request.ph,
            rainfall=request.rainfall
        )
        result = prediction_service.predict_crop(payload)
        return {
            "recommended_crop": result.recommended_crop,
            "confidence": result.confidence,
            "conditions": result.ideal_conditions,
            "icon": result.icon
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/fertilizer-recommendation")
async def recommend_fertilizer_standalone(request: FertilizerRecommendationRequest):
    """Standalone fertilizer recommendation endpoint"""
    from models.prediction import FertilizerInput
    try:
        payload = FertilizerInput(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            temperature=request.temperature,
            humidity=request.humidity,
            moisture=request.moisture,
            soil_type=request.soil_type,
            crop_type=request.crop_type
        )
        result = prediction_service.predict_fertilizer(payload)
        return {
            "recommended_fertilizer": result.recommended_fertilizer,
            "application_rate": result.timing,
            "icon": result.icon,
            "use": result.recommendation,
            "deficiencies": result.deficiencies,
            "deficiency_analysis": result.deficiency_analysis,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/weather-risk")
async def analyze_weather_standalone(request: WeatherRiskRequest):
    """Standalone weather risk endpoint"""
    from models.prediction import WeatherInput
    try:
        payload = WeatherInput(
            month=request.month,
            temperature=request.temperature
        )
        result = prediction_service.predict_weather_risk(payload)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/weather/live")
async def get_live_weather(lat: float, lon: float):
    """
    Get live weather data using OpenWeatherMap API.
    Falls back to deterministic seasonal estimates if API key is unavailable.
    Returns a structured response the frontend expects.
    """
    import os
    import httpx
    import math
    from datetime import datetime as dt

    api_key = os.getenv("OPENWEATHER_API_KEY", "")
    source = "estimated"
    raw = None

    # --- Try real OpenWeatherMap API first ---
    if api_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"},
                )
                if resp.status_code == 200:
                    raw = resp.json()
                    source = "openweathermap"
                else:
                    logger.warning("OpenWeatherMap API returned status %s", resp.status_code)
        except Exception as e:
            logger.warning("OpenWeatherMap API error: %s", e)

    # --- Build unified response ---
    if raw and source == "openweathermap":
        main = raw.get("main", {})
        weather = raw.get("weather", [{}])[0]
        wind_data = raw.get("wind", {})
        temp = main.get("temp", 25)
        humidity = main.get("humidity", 60)
        wind_speed = wind_data.get("speed", 0)
        wind_deg = wind_data.get("deg", 0)
        pressure = main.get("pressure", 1013)
        visibility = raw.get("visibility", 10000)
        city_name = raw.get("name", "Unknown")
        description = weather.get("description", "clear sky").title()
        feels_like = main.get("feels_like", temp)
    else:
        # Deterministic seasonal estimation based on latitude & month
        # Uses Indian climate model — no randomness
        month = dt.now().month
        hour = dt.now().hour

        # Base temperature from seasonal sinusoidal model
        # Peak in May (month 5), trough in Jan (month 1)
        seasonal_base = 27.0 + 8.0 * math.sin((month - 1) * math.pi / 6 - math.pi / 3)
        
        # Latitude adjustment: cooler at higher latitudes (~0.6°C per degree)
        lat_adjustment = max(0, (lat - 15)) * 0.6
        temp = round(seasonal_base - lat_adjustment, 1)

        # Diurnal cycle: cooler at night/morning, warmer at noon
        diurnal = 3.0 * math.sin((hour - 6) * math.pi / 12)
        temp = round(temp + diurnal, 1)

        # Humidity: higher in monsoon, lower in summer/winter
        if month in [6, 7, 8, 9]:
            humidity = 82.0
            description = "Overcast Clouds"
        elif month in [3, 4, 5]:
            humidity = 38.0
            description = "Clear Sky"
        elif month in [10, 11]:
            humidity = 60.0
            description = "Partly Cloudy"
        else:
            humidity = 52.0
            description = "Clear Sky"

        wind_speed = 8.0  # Average wind speed
        wind_deg = 180 if month in [6, 7, 8, 9] else 0  # SW monsoon vs N winter
        pressure = 1013
        visibility = 10000
        city_name = "Your Location"
        feels_like = round(temp + 2.0 if humidity > 70 else temp - 1.0, 1)

    # Wind direction label
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    wind_direction = directions[int((wind_deg + 22.5) % 360 / 45)]

    # Weather emoji
    desc_lower = description.lower()
    if "rain" in desc_lower:
        weather_icon = "🌧️"
    elif "cloud" in desc_lower or "overcast" in desc_lower:
        weather_icon = "☁️"
    elif "clear" in desc_lower:
        weather_icon = "☀️"
    elif "haze" in desc_lower or "fog" in desc_lower or "mist" in desc_lower:
        weather_icon = "🌫️"
    elif "thunder" in desc_lower or "storm" in desc_lower:
        weather_icon = "⛈️"
    elif "snow" in desc_lower:
        weather_icon = "❄️"
    else:
        weather_icon = "⛅"

    # Farming advisory
    if temp > 38:
        risk_level = "high"
        advisory = "Extreme heat — provide shade for crops, irrigate early morning/late evening."
        irrigation = "Increase irrigation frequency. Drip irrigation recommended."
        precautions = ["Apply mulch to retain soil moisture", "Avoid midday field work", "Monitor for heat stress in crops"]
    elif temp > 32:
        risk_level = "moderate"
        advisory = "Warm conditions — ensure adequate water supply for crops."
        irrigation = "Regular irrigation needed — early morning preferred."
        precautions = ["Monitor soil moisture daily", "Mulch to reduce evaporation"]
    elif humidity > 85:
        risk_level = "moderate"
        advisory = "High humidity — watch for fungal diseases and pests."
        irrigation = "Reduce irrigation — natural moisture is sufficient."
        precautions = ["Apply fungicide preventively", "Ensure good drainage", "Monitor for leaf blight"]
    else:
        risk_level = "low"
        advisory = "Optimal growing conditions for most crops."
        irrigation = "Standard irrigation schedule."
        precautions = ["Regular crop monitoring", "Follow seasonal best practices"]

    return {
        "source": source,
        "location": {
            "city": city_name,
            "lat": lat,
            "lon": lon,
        },
        "current": {
            "temperature": round(temp, 1),
            "feels_like": round(feels_like, 1),
            "humidity": round(humidity, 1),
            "wind_speed": round(wind_speed, 1),
            "wind_direction": wind_direction,
            "pressure": pressure,
            "visibility": visibility,
            "description": description,
            "icon": weather_icon,
        },
        "farming_advisory": {
            "risk_level": risk_level,
            "advisory": advisory,
            "irrigation": irrigation,
            "precautions": precautions,
        },
        "timestamp": dt.now().isoformat(),
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequestApi):
    """Bridge for ChatbotService with legacy API support"""
    try:
        # Bridge to new ChatbotService
        internal_request = InternalChatRequest(
            message=request.message,
            language=request.language,
            farm_context=request.context_data
        )
        
        response = await chatbot_service.process_message(internal_request)
        
        return ChatResponse(
            message=response.message,
            tts_message=response.tts_message,
            language=response.language,
            response_type=response.response_type,
            confidence=response.confidence if response.confidence else 0.9,
            quick_actions=response.quick_actions,
            suggestions=response.suggestions,
            should_speak=response.should_speak
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return ChatResponse(
            message=f"I'm sorry, I'm having trouble understanding. Error: {str(e)}",
            language=request.language,
            response_type="error",
            confidence=0.0
        )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Farm Intelligence API"}

if __name__ == "__main__":
    import uvicorn
    port = int(_os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
