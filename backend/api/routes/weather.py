"""
Weather API Route - Real-time Weather Integration
Provides live weather data from OpenWeatherMap
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from services.weather_service import get_weather_service

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/current")
async def get_current_weather(
    latitude: Optional[float] = Query(None, ge=-90, le=90),
    longitude: Optional[float] = Query(None, ge=-180, le=180),
    state: Optional[str] = Query(None, description="Indian state name")
):
    """
    Get current weather data
    
    Provide either GPS coordinates OR state name.
    
    - **latitude/longitude**: GPS coordinates for precise location
    - **state**: Indian state name (uses state capital coordinates)
    
    Returns current weather including temperature, humidity, rainfall, and farming advice.
    """
    weather_service = get_weather_service()
    
    if latitude is not None and longitude is not None:
        weather_data = await weather_service.get_weather_by_coordinates(latitude, longitude)
    elif state:
        weather_data = await weather_service.get_weather_by_state(state)
    else:
        # Default to Karnataka (Bengaluru)
        weather_data = await weather_service.get_weather_by_state("Karnataka")
    
    # Add farming advice
    farming_advice = weather_service.get_farming_advice_from_weather(weather_data)
    weather_data["farming_advice"] = farming_advice
    
    return weather_data


@router.get("/by-state/{state}")
async def get_weather_by_state(state: str):
    """
    Get weather for an Indian state
    
    Uses the state capital's coordinates.
    
    Supported states:
    - Andhra Pradesh, Karnataka, Tamil Nadu, Kerala, Telangana
    - Maharashtra, Gujarat, Rajasthan, Uttar Pradesh, Madhya Pradesh
    - Bihar, West Bengal, Punjab, Haryana, Odisha, Assam
    """
    weather_service = get_weather_service()
    weather_data = await weather_service.get_weather_by_state(state)
    
    if not weather_data:
        raise HTTPException(
            status_code=404,
            detail=f"Weather data not available for state: {state}"
        )
    
    # Add farming advice
    farming_advice = weather_service.get_farming_advice_from_weather(weather_data)
    weather_data["farming_advice"] = farming_advice
    
    return weather_data


@router.get("/by-coordinates")
async def get_weather_by_coordinates(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude")
):
    """
    Get weather by GPS coordinates
    
    For precise location-based weather data.
    """
    weather_service = get_weather_service()
    weather_data = await weather_service.get_weather_by_coordinates(lat, lon)
    
    # Add farming advice
    farming_advice = weather_service.get_farming_advice_from_weather(weather_data)
    weather_data["farming_advice"] = farming_advice
    
    return weather_data


@router.get("/states")
async def list_supported_states():
    """
    List all supported Indian states for weather data
    """
    weather_service = get_weather_service()
    
    states = []
    for state, coords in weather_service.STATE_COORDINATES.items():
        states.append({
            "state": state,
            "city": coords["city"],
            "latitude": coords["lat"],
            "longitude": coords["lon"]
        })
    
    return {
        "success": True,
        "count": len(states),
        "states": states
    }


@router.get("/farming-advice")
async def get_farming_advice(
    temperature: float = Query(..., description="Temperature in Celsius"),
    humidity: float = Query(..., ge=0, le=100, description="Humidity percentage"),
    rainfall: float = Query(0, ge=0, description="Recent rainfall in mm")
):
    """
    Get farming advice based on weather conditions
    
    Returns recommendations for:
    - Irrigation timing
    - Pest alerts
    - Harvesting conditions
    - General farming tips
    """
    weather_service = get_weather_service()
    
    weather_data = {
        "temperature": temperature,
        "humidity": humidity,
        "rainfall_1h": rainfall
    }
    
    advice = weather_service.get_farming_advice_from_weather(weather_data)
    
    return {
        "success": True,
        "conditions": {
            "temperature": temperature,
            "humidity": humidity,
            "rainfall": rainfall
        },
        "advice": advice
    }
