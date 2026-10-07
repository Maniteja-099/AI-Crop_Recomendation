"""Quick integration test for all fixes. Run directly: python test_all_fixes.py"""
# This file is NOT a pytest module; it is a standalone script.
# Skip if collected by pytest.
import sys
if "pytest" in sys.modules:
    import pytest
    pytestmark = pytest.mark.skip(reason="standalone script, not a pytest module")

import requests, json

BASE = "http://localhost:8000"

def run_check(name, fn):
    print(f"=== {name} ===")
    try:
        fn()
        print("  PASSED\n")
    except Exception as e:
        print(f"  FAILED: {e}\n")
        return False
    return True

results = []

def t1():
    r = requests.get(f"{BASE}/api/health", timeout=10)
    assert r.status_code == 200
    print(f"  {r.json()}")
results.append(run_check("Health Check", t1))

def t2():
    r = requests.post(f"{BASE}/api/chat", json={"message": "What crop should I grow?", "language": "en"}, timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert "message" in d
    print(f"  Message: {d['message'][:150]}")
    print(f"  Language: {d['language']}")
results.append(run_check("Chat (English)", t2))

def t3():
    r = requests.post(f"{BASE}/api/chat", json={"message": "ఏ ఎరువు వాడాలి?", "language": "te"}, timeout=30)
    assert r.status_code == 200
    d = r.json()
    print(f"  Message: {d['message'][:150]}")
    print(f"  Language: {d['language']}")
    assert d["language"] == "te"
results.append(run_check("Chat (Telugu)", t3))

def t4():
    r = requests.post(f"{BASE}/api/chat",
        json={"message": "मुझे कौन सी फसल उगानी चाहिए?", "language": "hi"}, timeout=30)
    assert r.status_code == 200
    d = r.json()
    print(f"  Message: {d['message'][:150]}")
    print(f"  Language: {d['language']}")
    assert d["language"] == "hi"
results.append(run_check("Chat (Hindi)", t4))

def t5():
    r = requests.post(f"{BASE}/api/fertilizer-recommendation", json={
        "nitrogen": 30, "phosphorus": 10, "potassium": 10,
        "temperature": 25, "humidity": 50, "moisture": 50,
        "soil_type": "Loamy", "crop_type": "Paddy"
    }, timeout=15)
    assert r.status_code == 200
    d = r.json()
    fert = d["recommended_fertilizer"]
    print(f"  Fertilizer: {fert}")
    print(f"  Icon: {d.get('icon')}")
    # Should NOT be 'Minimal/Organic' for these inputs (model should predict)
    assert fert != "Minimal/Organic", f"Got fallback result: {fert}"
results.append(run_check("Fertilizer (Real ML Model)", t5))

def t6():
    r = requests.post(f"{BASE}/api/analyze/full-report", json={
        "nitrogen": 90, "phosphorus": 40, "potassium": 40,
        "ph": 6.5, "temperature": 25, "humidity": 80,
        "rainfall": 200, "month": 7, "area": 2,
        "state": "Karnataka", "season": "Kharif",
        "soil_type": "Loamy", "language": "en"
    }, timeout=60)
    assert r.status_code == 200
    d = r.json()
    print(f"  Crop: {d['report']['crop']['crop']}")
    print(f"  Fertilizer: {d['report']['fertilizer']['fertilizer']}")
    print(f"  Yield: {d['report']['yield']['yield_value']} tons")
results.append(run_check("Full Report (English)", t6))

def t7():
    r = requests.post(f"{BASE}/api/analyze/full-report", json={
        "nitrogen": 90, "phosphorus": 40, "potassium": 40,
        "ph": 6.5, "temperature": 25, "humidity": 80,
        "rainfall": 200, "month": 7, "area": 2,
        "state": "Karnataka", "season": "Kharif",
        "soil_type": "Loamy", "language": "te"
    }, timeout=120)
    assert r.status_code == 200
    d = r.json()
    print(f"  Crop (translated): {d['report']['crop']['crop']}")
    print(f"  Verdict (translated): {d['summary']['verdict']}")
results.append(run_check("Full Report (Telugu Translation)", t7))

# Summary
passed = sum(results)
total = len(results)
print("=" * 50)
print(f"Results: {passed}/{total} passed")
if passed == total:
    print("ALL TESTS PASSED!")
else:
    print("Some tests failed.")
    sys.exit(1)
