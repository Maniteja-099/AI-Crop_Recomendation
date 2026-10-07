"""
Farmer Profile and Settings Pydantic Models
Handles farmer registration, preferences, and farm details
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from enum import Enum


class LanguagePreference(str, Enum):
    """Supported languages for bilingual interface"""
    ENGLISH = "en"
    HINDI = "hi"
    TELUGU = "te"
    TAMIL = "ta"
    KANNADA = "kn"


class MeasurementSystem(str, Enum):
    """Measurement system preference"""
    METRIC = "metric"
    IMPERIAL = "imperial"


class ExperienceLevel(str, Enum):
    """Farming experience level"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERT = "expert"


class SoilType(str, Enum):
    """Common soil types in India"""
    ALLUVIAL = "alluvial"
    BLACK = "black"
    RED = "red"
    LATERITE = "laterite"
    SANDY = "sandy"
    LOAMY = "loamy"
    CLAYEY = "clayey"


class GPSCoordinates(BaseModel):
    """GPS location model"""
    latitude: float = Field(..., ge=-90, le=90, description="Latitude (-90 to 90)")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude (-180 to 180)")
    accuracy: Optional[float] = Field(None, description="GPS accuracy in meters")


class FarmerProfile(BaseModel):
    """
    Complete Farmer Profile Model
    Stores all farmer-specific information for personalized recommendations
    """
    # Personal Information
    farmer_id: Optional[str] = Field(None, description="Unique farmer identifier")
    name: str = Field(..., min_length=2, max_length=100, description="Farmer's name")
    phone: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$", description="Phone number")
    
    # Location Information
    state: str = Field(..., description="State/Province")
    district: Optional[str] = Field(None, description="District")
    village: Optional[str] = Field(None, description="Village name")
    gps_coordinates: Optional[GPSCoordinates] = Field(None, description="Farm GPS location")
    
    # Farm Details
    farm_size: float = Field(..., gt=0, le=10000, description="Farm size in hectares")
    soil_type: Optional[SoilType] = Field(None, description="Primary soil type")
    primary_crops: List[str] = Field(default_factory=list, description="Main crops grown")
    irrigation_available: bool = Field(True, description="Has irrigation facility")
    
    # Preferences
    language: LanguagePreference = Field(LanguagePreference.ENGLISH, description="Preferred language")
    measurement_system: MeasurementSystem = Field(MeasurementSystem.METRIC)
    experience_level: ExperienceLevel = Field(ExperienceLevel.INTERMEDIATE)
    
    @field_validator('farm_size')
    @classmethod
    def validate_farm_size(cls, v):
        if v <= 0:
            raise ValueError('Farm size must be positive')
        return round(v, 2)


class FarmerSettings(BaseModel):
    """
    User Settings Model for App Preferences
    Customizable options for better user experience
    """
    # Language Settings
    language: LanguagePreference = Field(LanguagePreference.ENGLISH)
    
    # Voice Settings
    voice_enabled: bool = Field(True, description="Enable text-to-speech")
    voice_speed: float = Field(0.9, ge=0.5, le=2.0, description="Speech rate")
    auto_speak: bool = Field(True, description="Auto-read results")
    
    # Display Settings
    font_size: str = Field("medium", pattern=r"^(small|medium|large|xlarge)$")
    theme: str = Field("light", pattern=r"^(light|dark|high-contrast)$")
    animations: bool = Field(True, description="Enable UI animations")
    
    # Notification Settings
    notifications: bool = Field(True)
    weather_alerts: bool = Field(True, description="Receive weather warnings")
    crop_reminders: bool = Field(True, description="Seasonal crop reminders")
    
    # Accessibility Settings
    high_contrast: bool = Field(False, description="High contrast mode for visibility")
    simplified_ui: bool = Field(False, description="Simplified interface for beginners")
    keyboard_shortcuts: bool = Field(True)
    
    # Location Settings (for weather auto-fill)
    location: Optional[str] = Field(None, description="State for weather data")
    gps_latitude: Optional[float] = Field(None, ge=-90, le=90)
    gps_longitude: Optional[float] = Field(None, ge=-180, le=180)
    auto_fetch_weather: bool = Field(True, description="Auto-fetch weather based on location")


class FarmerProfileResponse(BaseModel):
    """Response model for farmer profile operations"""
    success: bool
    message: str
    profile: Optional[FarmerProfile] = None


class SettingsResponse(BaseModel):
    """Response model for settings operations"""
    success: bool
    message: str
    settings: Optional[FarmerSettings] = None
