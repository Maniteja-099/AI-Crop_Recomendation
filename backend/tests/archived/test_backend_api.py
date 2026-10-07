#!/usr/bin/env python3
"""
Backend API Test Suite
Tests all endpoints for errors and proper responses
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Color codes
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

def test_endpoint(method, endpoint, data=None, description=""):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=5)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=5)
        else:
            return False, f"Unknown method: {method}"
        
        success = response.status_code in [200, 201]
        status_icon = f"{Colors.GREEN}✅{Colors.RESET}" if success else f"{Colors.RED}❌{Colors.RESET}"
        
        print(f"{status_icon} [{method}] {endpoint}")
        print(f"   Status: {response.status_code}")
        if description:
            print(f"   {description}")
        
        if not success:
            print(f"   {Colors.RED}Error: {response.text[:200]}{Colors.RESET}")
        
        return success, response
        
    except requests.exceptions.ConnectionError:
        print(f"{Colors.RED}❌ [{method}] {endpoint}{Colors.RESET}")
        print(f"   {Colors.RED}Connection Error: Backend not running!{Colors.RESET}")
        return False, None
    except Exception as e:
        print(f"{Colors.RED}❌ [{method}] {endpoint}{Colors.RESET}")
        print(f"   {Colors.RED}Error: {str(e)}{Colors.RESET}")
        return False, None

def main():
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.CYAN}  🧪 Backend API Test Suite{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")
    
    results = {"passed": 0, "failed": 0}
    
    # Test 1: Root endpoint
    print(f"\n{Colors.YELLOW}📋 Basic Endpoints{Colors.RESET}")
    print(f"{Colors.YELLOW}{'─'*60}{Colors.RESET}\n")
    
    success, _ = test_endpoint("GET", "/", description="Root endpoint")
    results["passed" if success else "failed"] += 1
    
    success, _ = test_endpoint("GET", "/api/health", description="Health check")
    results["passed" if success else "failed"] += 1
    
    # Test 2: Core ML Endpoints
    print(f"\n{Colors.YELLOW}📋 Machine Learning Endpoints{Colors.RESET}")
    print(f"{Colors.YELLOW}{'─'*60}{Colors.RESET}\n")
    
    # Crop Recommendation
    crop_data = {
        "nitrogen": 40,
        "phosphorus": 30,
        "potassium": 25,
        "temperature": 28,
        "humidity": 70,
        "ph": 6.5,
        "rainfall": 200
    }
    success, _ = test_endpoint("POST", "/api/crop-recommendation", crop_data, "Crop recommendation")
    results["passed" if success else "failed"] += 1
    
    # Yield Prediction
    yield_data = {
        "crop": "RICE",
        "season": "Kharif",
        "state": "Karnataka",
        "area": 2.5,
        "rainfall": 200,
        "fertilizer": 150
    }
    success, _ = test_endpoint("POST", "/api/yield-prediction", yield_data, "Yield prediction")
    results["passed" if success else "failed"] += 1
    
    # Fertilizer Recommendation
    fert_data = {
        "nitrogen": 25,
        "phosphorus": 18,
        "potassium": 20,
        "temperature": 28,
        "humidity": 70,
        "soilType": "Loamy",
        "cropType": "RICE"
    }
    success, _ = test_endpoint("POST", "/api/fertilizer-recommendation", fert_data, "Fertilizer recommendation")
    results["passed" if success else "failed"] += 1
    
    # Soil Fertility
    soil_data = {
        "nitrogen": 35,
        "phosphorus": 28,
        "potassium": 30
    }
    success, _ = test_endpoint("POST", "/api/soil-fertility", soil_data, "Soil fertility check")
    results["passed" if success else "failed"] += 1
    
    # Weather Risk
    weather_data = {
        "month": 7,
        "temperature": 32
    }
    success, _ = test_endpoint("POST", "/api/weather-risk", weather_data, "Weather risk analysis")
    results["passed" if success else "failed"] += 1
    
    # Test 3: Comprehensive Report
    print(f"\n{Colors.YELLOW}📋 Comprehensive Analysis{Colors.RESET}")
    print(f"{Colors.YELLOW}{'─'*60}{Colors.RESET}\n")
    
    full_report_data = {
        "nitrogen": 40,
        "phosphorus": 30,
        "potassium": 25,
        "ph": 6.5,
        "temperature": 28,
        "humidity": 70,
        "rainfall": 200,
        "month": 7,
        "area": 2.5,
        "state": "Karnataka",
        "season": "Kharif",
        "soil_type": "Loamy"
    }
    success, _ = test_endpoint("POST", "/api/analyze/full-report", full_report_data, "Full farm report")
    results["passed" if success else "failed"] += 1
    
    # Test 4: Weather Live (might fail if no API key)
    print(f"\n{Colors.YELLOW}📋 External API Integration{Colors.RESET}")
    print(f"{Colors.YELLOW}{'─'*60}{Colors.RESET}\n")
    
    success, _ = test_endpoint("GET", "/api/weather/live?lat=19.076&lon=72.8777", description="Live weather (may use mock data)")
    results["passed" if success else "failed"] += 1
    
    # Test 5: Chatbot
    print(f"\n{Colors.YELLOW}📋 Chatbot System{Colors.RESET}")
    print(f"{Colors.YELLOW}{'─'*60}{Colors.RESET}\n")
    
    chat_data = {
        "message": "What crop should I grow?",
        "language": "en"
    }
    success, _ = test_endpoint("POST", "/api/chat", chat_data, "Chatbot endpoint")
    results["passed" if success else "failed"] += 1
    
    # Summary
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.CYAN}  📊 Test Summary{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")
    
    total = results["passed"] + results["failed"]
    success_rate = (results["passed"] / total * 100) if total > 0 else 0
    
    print(f"Total Tests: {total}")
    print(f"{Colors.GREEN}Passed: {results['passed']}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {results['failed']}{Colors.RESET}")
    print(f"\nSuccess Rate: {Colors.CYAN}{success_rate:.1f}%{Colors.RESET}\n")
    
    if results["failed"] == 0:
        print(f"{Colors.GREEN}🎉 ALL TESTS PASSED!{Colors.RESET}\n")
        return 0
    else:
        print(f"{Colors.YELLOW}⚠️  Some tests failed. Check errors above.{Colors.RESET}\n")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main())
