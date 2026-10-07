"""
Test Script for Smart Agricultural API v3.0
Demonstrates the auto-weather-fetching system
"""

import requests
import json
from datetime import datetime

API_URL = "http://127.0.0.1:8000"

def print_section(title):
    """Print formatted section header"""
    print("\n" + "="*70)
    print(f"✨ {title}")
    print("="*70)

def test_health():
    """Test API health"""
    print_section("1. API Health Check")
    response = requests.get(f"{API_URL}/health")
    data = response.json()
    print(json.dumps(data, indent=2))
    return response.status_code == 200

def test_soil_test():
    """Test quick soil test"""
    print_section("2. Quick Soil Test")
    payload = {
        "nitrogen": 50,
        "phosphorus": 40,
        "potassium": 30,
        "ph": 6.5
    }
    print(f"📤 Input: {json.dumps(payload, indent=2)}")
    response = requests.post(f"{API_URL}/soil-test", json=payload)
    data = response.json()
    print(f"📥 Output:\n{json.dumps(data, indent=2)}")
    return response.status_code == 200

def test_locations():
    """Test available locations"""
    print_section("3. Available Locations (with weather data)")
    response = requests.get(f"{API_URL}/locations")
    data = response.json()
    print(json.dumps(data, indent=2))
    return response.status_code == 200

def test_weather_lookup():
    """Test weather lookup"""
    print_section("4. Check Weather for Location (Delhi, June)")
    response = requests.get(f"{API_URL}/weather/Delhi/6")
    data = response.json()
    print(json.dumps(data, indent=2))
    return response.status_code == 200

def test_smart_report():
    """Test the main smart report - WITH AUTO-FETCHED WEATHER"""
    print_section("5. SMART REPORT - Complete Farm Analysis (AUTO-FETCHED WEATHER)")
    print("\n📝 Notice: User only provides location + soil data")
    print("✨ System auto-fetches weather from 91,320 historical records!")
    
    payload = {
        "location": "Delhi",
        "nitrogen": 50,
        "phosphorus": 40,
        "potassium": 30,
        "ph": 6.5,
        "soil_moisture": 40,
        "month": 6
    }
    
    print(f"\n📤 User Input:\n{json.dumps(payload, indent=2)}")
    print("\n⏳ System is now:")
    print("  1. Fetching real weather for Delhi in June...")
    print("  2. Analyzing soil conditions...")
    print("  3. Selecting seasonal crops...")
    print("  4. Calculating fertilizer needs...")
    print("  5. Generating farming instructions...")
    print("  6. Predicting yield...")
    print("  7. Assessing risks...")
    print("  8. Creating action plan...")
    
    response = requests.post(f"{API_URL}/smart-report", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📥 Output ({data.get('timestamp')}):")
        
        if data.get('success'):
            report = data.get('data', {})
            
            # Print each section
            sections = [
                'soil_analysis',
                'weather_analysis',
                'crop_recommendations',
                'fertilizer_recommendations',
                'farming_instructions',
                'yield_expectations',
                'risk_assessment',
                'action_plan'
            ]
            
            for i, section in enumerate(sections, 1):
                if section in report:
                    print(f"\n{'─'*70}")
                    print(f"📊 [{i}] {section.upper().replace('_', ' ')}")
                    print(f"{'─'*70}")
                    print(json.dumps(report[section], indent=2))
            
            print(f"\n{'─'*70}")
            print(f"⏱️  Timestamp: {data.get('timestamp')}")
            print(f"💡 Note: {data.get('note')}")
        else:
            print(json.dumps(data, indent=2))
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
    
    return response.status_code == 200

def test_detailed_analysis():
    """Test detailed analysis"""
    print_section("6. Detailed Analysis (Step-by-Step Reasoning)")
    
    payload = {
        "location": "Mumbai",
        "nitrogen": 45,
        "phosphorus": 35,
        "potassium": 25,
        "ph": 6.8,
        "soil_moisture": 30,
        "month": 4
    }
    
    print(f"📤 Input (Mumbai, April - Summer):\n{json.dumps(payload, indent=2)}")
    response = requests.post(f"{API_URL}/detailed-analysis", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📥 Output:")
        print(f"  Status: {'✅ Success' if data.get('success') else '❌ Failed'}")
        print(f"  Sections Generated: {data.get('analysis', {}).get('sections')}")
    else:
        print(f"❌ Error: {response.status_code}")
    
    return response.status_code == 200

def main():
    """Run all tests"""
    print("\n" + "╔" + "="*68 + "╗")
    print("║" + " "*15 + "🌾 SMART AGRICULTURAL API v3.0 TEST 🌾" + " "*15 + "║")
    print("║" + " "*15 + "Auto-Fetched Weather & Autonomous Analysis" + " "*11 + "║")
    print("╚" + "="*68 + "╝")
    
    tests = [
        ("API Health", test_health),
        ("Soil Test", test_soil_test),
        ("Available Locations", test_locations),
        ("Weather Lookup", test_weather_lookup),
        ("Smart Report (MAIN TEST)", test_smart_report),
        ("Detailed Analysis", test_detailed_analysis),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ Error in {name}: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*70)
    print("📋 TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status:10} | {name}")
    
    print("="*70)
    print(f"Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        print("✨ The Smart API is working perfectly!")
        print("🚀 Ready for production!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check errors above.")
    
    print("\n" + "="*70)

if __name__ == "__main__":
    print("\n⚠️  Make sure the Smart API is running:")
    print("   python run_api_simple.py")
    print("\nStarting tests in 2 seconds...\n")
    
    import time
    time.sleep(2)
    
    main()
