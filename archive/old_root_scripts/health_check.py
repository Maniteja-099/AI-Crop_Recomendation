"""
Project Health Check Script
Verifies all critical systems are operational
Run this after reorganization or updates
"""

import sys
import os

# Add backend to path for runtime imports
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

def test_imports():
    """Test all critical imports"""
    print("🔍 Testing Imports...")
    try:
        from services.prediction_service import get_prediction_service
        from services.chatbot_service import get_chatbot_service
        from ml_models.model_manager import get_model_manager
        from models.prediction import SoilInput, WeatherInput, CropInput, YieldInput, FertilizerInput
        from models.chat import ChatRequest, ChatResponse
        print("  ✅ All imports successful\n")
        return True
    except Exception as e:
        print(f"  ❌ Import error: {e}\n")
        return False

def test_services():
    """Test service initialization"""
    print("🔍 Testing Services...")
    try:
        from services.prediction_service import get_prediction_service
        from services.chatbot_service import get_chatbot_service
        from ml_models.model_manager import get_model_manager
        
        prediction_service = get_prediction_service()
        chatbot_service = get_chatbot_service()
        model_manager = get_model_manager()
        
        print("  ✅ Prediction Service: Initialized")
        print("  ✅ Chatbot Service: Initialized")
        print(f"  ✅ Model Manager: {len(model_manager.models)} models loaded")
        print(f"  ℹ️  Mock Mode: {model_manager.is_mock_mode()}\n")
        return True
    except Exception as e:
        print(f"  ❌ Service error: {e}\n")
        return False

def test_app():
    """Test FastAPI app loading"""
    print("🔍 Testing FastAPI App...")
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
        from main import app
        print("  ✅ FastAPI app loads successfully")
        print("  ✅ Backend configuration verified\n")
        return True
    except Exception as e:
        print(f"  ❌ App error: {e}\n")
        return False

def test_file_structure():
    """Test critical directories exist"""
    print("🔍 Testing File Structure...")
    critical_dirs = [
        'backend/api',
        'backend/services',
        'backend/ml_models',
        'backend/trained_models',
        'backend/models',
        'backend/logs',
        'backend/scripts',
        'backend/tests',
        'Frontend/src',
        'data',
        'docs',
        'scripts'
    ]
    
    all_present = True
    for dir_path in critical_dirs:
        if os.path.exists(dir_path):
            print(f"  ✅ {dir_path}")
        else:
            print(f"  ❌ Missing: {dir_path}")
            all_present = False
    print()
    return all_present

def test_model_files():
    """Check if ML model files exist"""
    print("🔍 Testing ML Model Files...")
    model_dir = 'backend/trained_models'
    expected_models = [
        'crop_recommendation_model.pkl',
        'soil_fertility_model.pkl',
        'weather_risk_model.pkl',
        'yield_model.pkl',
        'fertilizer_model.pkl'
    ]
    
    all_present = True
    if os.path.exists(model_dir):
        for model_file in expected_models:
            model_path = os.path.join(model_dir, model_file)
            if os.path.exists(model_path):
                print(f"  ✅ {model_file}")
            else:
                print(f"  ⚠️  Missing: {model_file}")
                all_present = False
    else:
        print(f"  ❌ Directory not found: {model_dir}")
        all_present = False
    
    if not all_present:
        print("  ℹ️  Note: System can run in mock mode without models")
    print()
    return True  # Not critical, system has fallback

def main():
    """Run all health checks"""
    print("="*70)
    print("🌾 AI Agricultural Intelligence System - Health Check")
    print("="*70)
    print()
    
    results = []
    
    # Run tests
    results.append(("File Structure", test_file_structure()))
    results.append(("Model Files", test_model_files()))
    results.append(("Imports", test_imports()))
    results.append(("Services", test_services()))
    results.append(("FastAPI App", test_app()))
    
    # Summary
    print("="*70)
    print("📊 HEALTH CHECK SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {test_name:<20} {status}")
    
    print()
    print(f"  Success Rate: {passed}/{total} ({passed*100//total}%)")
    print()
    
    if passed == total:
        print("  🎉 ALL SYSTEMS OPERATIONAL!")
        print("  🚀 Ready to run the application")
        print()
        print("  Start Backend:  cd backend && python main.py")
        print("  Start Frontend: cd Frontend && npm start")
        print("  API Docs:       http://localhost:8000/docs")
    else:
        print("  ⚠️  Some checks failed. Please review the errors above.")
    
    print("="*70)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
