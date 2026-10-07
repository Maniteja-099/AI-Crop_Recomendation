import requests
import json
import time

time.sleep(2)

API_URL = 'http://127.0.0.1:8000'
print('✅ TESTING SMART AGRICULTURAL API - ALL ENDPOINTS')
print('='*70 + '\n')

tests_passed = 0
tests_failed = 0

# Test 1: Health
try:
    r = requests.get('http://localhost:8000/health', timeout=5)
    if r.status_code == 200:
        print('✅ Test 1: Health Check - PASS')
        tests_passed += 1
    else:
        print(f'❌ Test 1: Health Check - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 1 Failed: {str(e)[:50]}')
    tests_failed += 1

# Test 2: Soil Test
try:
    r = requests.post('http://localhost:8000/soil-test', 
        json={'nitrogen': 50, 'phosphorus': 40, 'potassium': 30, 'ph': 6.5},
        timeout=5)
    if r.status_code == 200:
        print('✅ Test 2: Soil Test - PASS')
        tests_passed += 1
    else:
        print(f'❌ Test 2: Soil Test - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 2 Failed: {str(e)[:50]}')
    tests_failed += 1

# Test 3: Locations
try:
    r = requests.get('http://localhost:8000/locations', timeout=5)
    if r.status_code == 200:
        print('✅ Test 3: Locations - PASS')
        tests_passed += 1
    else:
        print(f'❌ Test 3: Locations - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 3 Failed: {str(e)[:50]}')
    tests_failed += 1

# Test 4: Weather Lookup
try:
    r = requests.get('http://localhost:8000/weather/Delhi/6', timeout=5)
    if r.status_code == 200:
        print('✅ Test 4: Weather Lookup - PASS')
        tests_passed += 1
    else:
        print(f'❌ Test 4: Weather Lookup - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 4 Failed: {str(e)[:50]}')
    tests_failed += 1

# Test 5: Smart Report (MAIN ENDPOINT)
try:
    r = requests.post('http://localhost:8000/smart-report',
        json={
            'location': 'Delhi',
            'nitrogen': 50,
            'phosphorus': 40,
            'potassium': 30,
            'ph': 6.5,
            'soil_moisture': 40,
            'month': 6
        },
        timeout=10)
    if r.status_code == 200:
        data = r.json()
        if 'data' in data and 'success' in data:
            print('✅ Test 5: Smart Report (AUTO-WEATHER) - PASS')
            print(f'   ✨ Weather auto-fetched for Delhi, June')
            tests_passed += 1
        else:
            print(f'❌ Test 5: Smart Report - Invalid response format')
            tests_failed += 1
    else:
        print(f'❌ Test 5: Smart Report - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 5 Failed: {str(e)[:50]}')
    tests_failed += 1

# Test 6: Detailed Analysis
try:
    r = requests.post('http://localhost:8000/detailed-analysis',
        json={
            'location': 'Delhi',
            'nitrogen': 50,
            'phosphorus': 40,
            'potassium': 30,
            'ph': 6.5,
            'soil_moisture': 40,
            'month': 6
        },
        timeout=10)
    if r.status_code == 200:
        print('✅ Test 6: Detailed Analysis - PASS')
        tests_passed += 1
    else:
        print(f'❌ Test 6: Detailed Analysis - {r.status_code}')
        tests_failed += 1
except Exception as e:
    print(f'❌ Test 6 Failed: {str(e)[:50]}')
    tests_failed += 1

print('\n' + '='*70)
print(f'📊 RESULTS: {tests_passed}/6 PASSED ✅')
if tests_failed == 0:
    print('🎉 ALL TESTS PASSED!')
else:
    print(f'   {tests_failed} tests failed')
print('='*70)
