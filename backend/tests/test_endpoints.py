#!/usr/bin/env python3
"""
Backend Endpoint Test Script
Tests all critical endpoints for data structure and error handling
"""

import asyncio
import json
from main import app, FullReportRequest
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health_endpoint():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("Testing: GET /api/health")
    print("="*60)
    response = client.get("/api/health")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert response.status_code == 200
    assert "status" in data
    print("✅ PASSED\n")

def test_soil_fertility_endpoint():
    """Test soil fertility endpoint"""
    print("="*60)
    print("Testing: POST /api/soil-fertility/comprehensive")
    print("="*60)
    payload = {
        "nitrogen": 90,
        "phosphorus": 42,
        "potassium": 43
    }
    response = client.post("/api/soil-fertility/comprehensive", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert response.status_code == 200
    assert "summary" in data
    assert "soil_health" in data
    print("✅ PASSED\n")

def test_full_report_endpoint():
    """Test full report endpoint"""
    print("="*60)
    print("Testing: POST /api/analyze/full-report")
    print("="*60)
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
    print(f"Status: {response.status_code}")
    data = response.json()
    
    # Check structure
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert "status" in data, "Missing 'status' field"
    assert "report" in data, "Missing 'report' field"
    assert data["status"] == "success", f"Expected status='success', got {data['status']}"
    
    # Check nested structure
    report = data["report"]
    assert "soil" in report, "Missing 'soil' in report"
    assert "weather" in report, "Missing 'weather' in report"
    assert "crop" in report, "Missing 'crop' in report"
    assert "yield" in report, "Missing 'yield' in report"
    assert "fertilizer" in report, "Missing 'fertilizer' in report"
    
    # Check fertilizer deficiencies
    fertilizer = report["fertilizer"]
    assert "deficiencies" in fertilizer, "Missing 'deficiencies' in fertilizer"
    assert isinstance(fertilizer["deficiencies"], dict), "deficiencies should be a dict"
    assert "nitrogen" in fertilizer["deficiencies"], "Missing 'nitrogen' in deficiencies"
    assert "phosphorous" in fertilizer["deficiencies"], "Missing 'phosphorous' in deficiencies"
    assert "potassium" in fertilizer["deficiencies"], "Missing 'potassium' in deficiencies"
    
    print(f"Full Response: {json.dumps(data, indent=2)}")
    print("✅ PASSED - All structure checks passed!\n")

def test_input_validation():
    """Test input validation"""
    print("="*60)
    print("Testing: Input Validation")
    print("="*60)
    
    # Test invalid month
    payload = {
        "nitrogen": 90,
        "phosphorus": 42,
        "potassium": 43,
        "ph": 6.5,
        "temperature": 28,
        "humidity": 70,
        "rainfall": 202,
        "month": 13,  # Invalid
        "area": 2.5,
        "state": "Karnataka",
        "season": "Kharif",
        "soil_type": "Loamy"
    }
    response = client.post("/api/analyze/full-report", json=payload)
    print(f"Invalid month test - Status: {response.status_code}")
    assert response.status_code in [422, 400], f"Expected validation error, got {response.status_code}"
    print("✅ Invalid month rejected\n")

if __name__ == "__main__":
    print("\n" + "="*80)
    print("BACKEND ENDPOINT TEST SUITE")
    print("="*80)
    
    try:
        test_health_endpoint()
        test_soil_fertility_endpoint()
        test_full_report_endpoint()
        test_input_validation()
        
        print("="*80)
        print("✅ ALL TESTS PASSED!")
        print("="*80 + "\n")
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}\n")
        exit(1)
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}\n")
        exit(1)
