"""
Prediction Input/Output Pydantic Models
Validates all ML model inputs and structures responses
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from enum import Enum


class Season(str, Enum):
    """Farming seasons in India"""
    KHARIF = "Kharif"
    RABI = "Rabi"
    ZAID = "Zaid"
    WHOLE_YEAR = "Whole Year"


# ============================================================================
# SOIL FERTILITY MODELS
# ============================================================================

class SoilInput(BaseModel):
    """Input for soil fertility prediction"""
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content (mg/kg)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (mg/kg)")
    potassium: float = Field(..., ge=0, le=300, description="Potassium content (mg/kg)")
    
    @field_validator('nitrogen', 'phosphorus', 'potassium')
    @classmethod
    def validate_nutrients(cls, v, info):
        if v < 0:
            raise ValueError(f'{info.field_name} cannot be negative')
        return round(v, 2)


class SoilResult(BaseModel):
    """Output for soil fertility prediction"""
    status: str  # 'success', 'warning', 'error'
    message: str  # 'Fertile Soil', 'Semi-Fertile', 'Infertile'
    description: str
    icon: str
    avg_nutrients: float
    recommendation: str
    detailed_analysis: Optional[Dict[str, Any]] = None


# ============================================================================
# WEATHER RISK MODELS
# ============================================================================

class WeatherInput(BaseModel):
    """Input for weather risk prediction"""
    month: int = Field(..., ge=1, le=12, description="Month (1-12)")
    temperature: float = Field(..., ge=-20, le=60, description="Temperature in Celsius")
    humidity: Optional[float] = Field(None, ge=0, le=100, description="Humidity percentage")
    rainfall: Optional[float] = Field(None, ge=0, description="Rainfall in mm")
    
    # Location-based auto-fetch
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)


class WeatherResult(BaseModel):
    """Output for weather risk prediction"""
    status: str  # 'success', 'warning', 'error'
    label: str  # 'Flood Risk', 'Drought Risk', 'Normal'
    description: str
    icon: str
    recommendation: str
    confidence: Optional[float] = None
    
    # Live weather data (if fetched)
    live_weather: Optional[Dict[str, Any]] = None


# ============================================================================
# CROP RECOMMENDATION MODELS
# ============================================================================

class CropInput(BaseModel):
    """Input for crop recommendation"""
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=300)
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500)
    
    @field_validator('ph')
    @classmethod
    def validate_ph(cls, v):
        if v < 0 or v > 14:
            raise ValueError('pH must be between 0 and 14')
        if v < 3 or v > 10:
            # Warning for extreme values but still valid
            pass
        return round(v, 2)


class CropResult(BaseModel):
    """Output for crop recommendation"""
    recommended_crop: str
    icon: str
    ideal_conditions: str
    confidence: Optional[float] = None
    alternatives: Optional[List[str]] = None
    growing_tips: Optional[str] = None
    seasonal: Optional[str] = None
    data_source: Optional[str] = None


# ============================================================================
# YIELD PREDICTION MODELS
# ============================================================================

class YieldInput(BaseModel):
    """Input for yield prediction"""
    crop: str = Field(..., min_length=2, description="Crop name")
    season: Season
    state: str = Field(..., min_length=2, description="State name")
    area: float = Field(..., gt=0, le=10000, description="Area in hectares")
    rainfall: float = Field(..., ge=0, le=5000, description="Annual rainfall in mm")
    fertilizer: float = Field(..., ge=0, le=50000, description="Fertilizer used in kg")


class YieldResult(BaseModel):
    """Output for yield prediction"""
    predicted_yield: float  # in tons
    yield_per_hectare: float
    unit: str  # "tons" or "quintals"
    confidence: Optional[float] = None
    market_value_estimate: Optional[float] = None
    recommendations: Optional[List[str]] = None
    data_source: Optional[str] = None


# ============================================================================
# FERTILIZER ADVISORY MODELS
# ============================================================================

class FertilizerInput(BaseModel):
    """Input for fertilizer recommendation"""
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    soil_type: str = Field(..., description="Type of soil")
    crop_type: str = Field(..., description="Target crop")
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=300)


class FertilizerResult(BaseModel):
    """Output for fertilizer recommendation"""
    recommended_fertilizer: str
    icon: str
    application_method: str
    dosage: Optional[str] = None
    timing: Optional[str] = None
    warnings: Optional[List[str]] = None
    deficiencies: Optional[Dict[str, bool]] = None  # {'nitrogen': True/False, 'phosphorous': True/False, 'potassium': True/False}
    deficiency_analysis: Optional[Dict[str, Any]] = None
    recommendation: Optional[str] = None
    data_source: Optional[str] = None


# ============================================================================
# UNIFIED ANALYSIS MODEL
# ============================================================================

class UnifiedAnalysisInput(BaseModel):
    """Complete farm analysis input"""
    # Soil data
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=300)
    ph: float = Field(..., ge=0, le=14)
    
    # Weather data
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    rainfall: float = Field(..., ge=0, le=500)
    month: int = Field(..., ge=1, le=12)
    
    # Farm data
    area: float = Field(..., gt=0, le=10000)
    state: str
    season: Season
    soil_type: str
    crop_type: Optional[str] = None  # If specified, use this; else recommend


class UnifiedAnalysisResult(BaseModel):
    """Complete farm analysis output"""
    soil_analysis: SoilResult
    weather_analysis: WeatherResult
    crop_recommendation: CropResult
    yield_prediction: YieldResult
    fertilizer_advisory: FertilizerResult
    overall_score: float  # 0-100 farm health score
    summary: str
    action_items: List[str]
