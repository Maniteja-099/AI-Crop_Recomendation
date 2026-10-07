"""
Predict API Route - ML Model Predictions with Rate Limiting
Handles all machine learning prediction endpoints
"""

from fastapi import APIRouter, HTTPException, status, Request
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.prediction import (
    SoilInput, SoilResult,
    WeatherInput, WeatherResult,
    CropInput, CropResult,
    YieldInput, YieldResult,
    FertilizerInput, FertilizerResult,
    UnifiedAnalysisInput, UnifiedAnalysisResult
)
from services.prediction_service import get_prediction_service

router = APIRouter(prefix="/predict", tags=["Predictions"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/soil", response_model=SoilResult)
@limiter.limit("10/minute")
async def predict_soil_fertility(request: Request, input_data: SoilInput):
    """
    🧪 Module 1: Soil Fertility Assessment
    
    Analyzes soil based on NPK (Nitrogen, Phosphorus, Potassium) values.
    
    **Rate Limit:** 10 requests per minute
    
    - **nitrogen**: Nitrogen content in mg/kg (0-200)
    - **phosphorus**: Phosphorus content in mg/kg (0-200)
    - **potassium**: Potassium content in mg/kg (0-300)
    
    Returns soil fertility status: Fertile, Semi-Fertile, or Infertile
    """
    service = get_prediction_service()
    return service.predict_soil_fertility(input_data)


@router.post("/weather", response_model=WeatherResult)
async def predict_weather_risk(input_data: WeatherInput):
    """
    ☁️ Module 2: Weather Risk Forecasting
    
    Predicts weather-related farming risks based on conditions.
    
    - **month**: Current month (1-12)
    - **temperature**: Temperature in Celsius
    - **humidity**: Optional humidity percentage
    - **latitude/longitude**: Optional GPS for live weather fetch
    
    Returns risk level: Flood Risk, Drought Risk, or Normal Conditions
    """
    service = get_prediction_service()
    return service.predict_weather_risk(input_data)


@router.post("/crop", response_model=CropResult)
async def predict_crop_recommendation(input_data: CropInput):
    """
    🌾 Module 3: Smart Crop Recommendation
    
    Recommends the best crop based on soil and climate conditions.
    
    - **nitrogen, phosphorus, potassium**: Soil nutrients
    - **temperature**: Temperature in Celsius
    - **humidity**: Humidity percentage
    - **ph**: Soil pH value (0-14, ideal: 6.0-7.0)
    - **rainfall**: Rainfall in mm
    
    Returns recommended crop with growing tips
    """
    service = get_prediction_service()
    return service.predict_crop(input_data)


@router.post("/yield", response_model=YieldResult)
async def predict_crop_yield(input_data: YieldInput):
    """
    📊 Module 4: Yield (Production) Prediction
    
    Predicts expected crop yield based on farming conditions.
    
    - **crop**: Crop name (e.g., Rice, Wheat, Maize)
    - **season**: Kharif, Rabi, Zaid, or Whole Year
    - **state**: State name
    - **area**: Farm area in hectares
    - **rainfall**: Annual rainfall in mm
    - **fertilizer**: Fertilizer used in kg
    
    Returns predicted yield in tons with market value estimate
    """
    service = get_prediction_service()
    return service.predict_yield(input_data)


@router.post("/fertilizer", response_model=FertilizerResult)
async def predict_fertilizer_recommendation(input_data: FertilizerInput):
    """
    💧 Module 5: Fertilizer Advisory
    
    Recommends appropriate fertilizer based on soil and crop needs.
    
    - **temperature, humidity, moisture**: Environmental conditions
    - **soil_type**: Type of soil
    - **crop_type**: Target crop
    - **nitrogen, phosphorus, potassium**: Current soil nutrients
    
    Returns fertilizer recommendation with application method
    """
    service = get_prediction_service()
    return service.predict_fertilizer(input_data)


@router.post("/unified")
async def unified_farm_analysis(input_data: UnifiedAnalysisInput):
    """
    ⚡ Complete Farm Analysis
    
    Performs comprehensive analysis including:
    - Soil fertility assessment
    - Weather risk prediction
    - Crop recommendation
    - Yield prediction
    - Fertilizer advisory
    
    Returns complete farm intelligence report
    """
    service = get_prediction_service()
    
    # Perform all analyses
    soil_result = service.predict_soil_fertility(
        SoilInput(
            nitrogen=input_data.nitrogen,
            phosphorus=input_data.phosphorus,
            potassium=input_data.potassium
        )
    )
    
    weather_result = service.predict_weather_risk(
        WeatherInput(
            month=input_data.month,
            temperature=input_data.temperature,
            humidity=input_data.humidity
        )
    )
    
    crop_result = service.predict_crop(
        CropInput(
            nitrogen=input_data.nitrogen,
            phosphorus=input_data.phosphorus,
            potassium=input_data.potassium,
            temperature=input_data.temperature,
            humidity=input_data.humidity,
            ph=input_data.ph,
            rainfall=input_data.rainfall
        )
    )
    
    # Use recommended crop for yield prediction
    crop_name = input_data.crop_type or crop_result.recommended_crop
    
    yield_result = service.predict_yield(
        YieldInput(
            crop=crop_name,
            season=input_data.season,
            state=input_data.state,
            area=input_data.area,
            rainfall=input_data.rainfall,
            fertilizer=500  # Default fertilizer estimate
        )
    )
    
    fertilizer_result = service.predict_fertilizer(
        FertilizerInput(
            temperature=input_data.temperature,
            humidity=input_data.humidity,
            moisture=60,  # Default moisture
            soil_type=input_data.soil_type,
            crop_type=crop_name,
            nitrogen=input_data.nitrogen,
            phosphorus=input_data.phosphorus,
            potassium=input_data.potassium
        )
    )
    
    # Calculate overall score
    scores = {
        "soil": 100 if soil_result.status == "success" else 50 if soil_result.status == "warning" else 25,
        "weather": 100 if weather_result.status == "success" else 50 if weather_result.status == "warning" else 25,
    }
    overall_score = sum(scores.values()) / len(scores)
    
    # Generate summary
    summary = f"Your farm analysis shows {soil_result.message.lower()} with {weather_result.label.lower()}. "
    summary += f"Recommended crop: {crop_result.recommended_crop}. "
    summary += f"Expected yield: {yield_result.predicted_yield} tons."
    
    # Action items
    action_items = [
        soil_result.recommendation,
        weather_result.recommendation,
        f"Consider growing {crop_result.recommended_crop}",
        f"Apply {fertilizer_result.recommended_fertilizer} fertilizer"
    ]
    
    return {
        "success": True,
        "soil_analysis": soil_result.model_dump(),
        "weather_analysis": weather_result.model_dump(),
        "crop_recommendation": crop_result.model_dump(),
        "yield_prediction": yield_result.model_dump(),
        "fertilizer_advisory": fertilizer_result.model_dump(),
        "overall_score": round(overall_score, 1),
        "summary": summary,
        "action_items": action_items
    }
