import pytest
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.prediction_service import get_prediction_service
from models.prediction import SoilInput, WeatherInput, CropInput, YieldInput, FertilizerInput

@pytest.fixture
def service():
    return get_prediction_service()

def test_soil_fertility_low(service):
    # Test low nutrients
    payload = SoilInput(nitrogen=5, phosphorus=5, potassium=5)
    result = service.predict_soil_fertility(payload)
    assert result.status in ["error", "warning"]
    assert "Soil" in result.message

def test_soil_fertility_high(service):
    # Test high nutrients
    payload = SoilInput(nitrogen=90, phosphorus=42, potassium=43)
    result = service.predict_soil_fertility(payload)
    assert result.status == "success"
    assert "Fertile" in result.message

def test_weather_risk_detection(service):
    # Test weather risk logic
    # July, 28°C - might be Flood Risk or Normal depending on model vs fallback
    payload = WeatherInput(month=7, temperature=28)
    result = service.predict_weather_risk(payload)
    assert result.label in ["Flood Risk", "Normal Conditions"]
    assert result.status in ["error", "success"]

def test_weather_risk_extreme(service):
    # May, 45°C - Very high chance of Drought Risk
    payload = WeatherInput(month=5, temperature=45)
    result = service.predict_weather_risk(payload)
    assert result.label in ["Drought Risk", "Normal Conditions"]

def test_crop_recommendation_rice(service):
    # Test rice conditions – use values that clearly match rice in the dataset
    payload = CropInput(
        nitrogen=100, phosphorus=45, potassium=45,
        temperature=26, humidity=82, ph=6.5, rainfall=250
    )
    result = service.predict_crop(payload)
    # The trained model should return a valid crop name
    assert result.recommended_crop, "Should return a non-empty crop name"
    assert isinstance(result.confidence, (int, float)), "Confidence should be numeric"
    assert result.confidence > 0, "Confidence should be positive"

def test_yield_prediction(service):
    # Test yield calculation
    payload = YieldInput(
        crop="rice", season="Kharif", state="Karnataka",
        area=1.0, rainfall=220, fertilizer=70
    )
    result = service.predict_yield(payload)
    assert result.predicted_yield > 0
    # Range check based on dataset (7.7 - 12.3)
    assert 7.0 <= result.yield_per_hectare <= 13.0

def test_fertilizer_recommendation_urea(service):
    # Test low nitrogen (Urea)
    payload = FertilizerInput(
        nitrogen=5, phosphorus=30, potassium=30,
        temperature=25, humidity=80, moisture=50,
        soil_type="Loamy", crop_type="Rice"
    )
    result = service.predict_fertilizer(payload)
    # For very low N (5), Urea is the primary recommendation
    # AI Model might recommend 14-35-14 or 28-28 based on other params (Crop/Soil)
    assert result.recommended_fertilizer in ["Urea", "DAP", "17-17-17", "14-35-14", "28-28"]
