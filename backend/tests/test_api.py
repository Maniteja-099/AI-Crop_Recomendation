import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_root():
    # The app has no root '/' route; test the health endpoint instead
    response = client.get("/api/health")
    assert response.status_code == 200

def test_health():
    # /api/health returns {"status": "ok", "service": "Farm Intelligence API"}
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_soil_fertility_api():
    payload = {
        "nitrogen": 90,
        "phosphorus": 42,
        "potassium": 43
    }
    # Correct endpoint is /api/soil-fertility/comprehensive
    response = client.post("/api/soil-fertility/comprehensive", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "soil_health" in data

def test_full_report_api():
    payload = {
        "nitrogen": 90,
        "phosphorus": 42,
        "potassium": 43,
        "ph": 6.5,
        "temperature": 28,
        "humidity": 70,
        "rainfall": 202,
        "month": 6,
        "area": 2.5,
        "state": "Karnataka",
        "season": "Kharif",
        "soil_type": "Loamy"
    }
    response = client.post("/api/analyze/full-report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "report" in data
    assert "soil" in data["report"]
    assert "weather" in data["report"]

def test_chatbot_api():
    payload = {
        "message": "how is the soil?",
        "language": "en"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    # ChatResponse model uses 'message' field (not 'reply')
    assert "message" in data
    assert "language" in data

def test_input_validation_failure():
    # Pass a string instead of float to trigger 422
    payload = {
        "nitrogen": "very high", # Invalid type
        "phosphorus": 42,
        "potassium": 43,
        "ph": 6.5,
        "temperature": 28,
        "humidity": 70,
        "rainfall": 202,
        "month": 6,
        "area": 2.5,
        "state": "Karnataka",
        "season": "Kharif",
        "soil_type": "Loamy"
    }
    response = client.post("/api/analyze/full-report", json=payload)
    assert response.status_code == 422
