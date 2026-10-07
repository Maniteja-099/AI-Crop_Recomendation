#!/usr/bin/env python3
"""
Comprehensive System Test Script
Tests Backend, Data, and ML Models
"""

import os
import sys
from pathlib import Path

# Color codes for terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    GRAY = '\033[90m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.CYAN}{'═' * 60}{Colors.RESET}")
    print(f"{Colors.CYAN}  {text}{Colors.RESET}")
    print(f"{Colors.CYAN}{'═' * 60}{Colors.RESET}\n")

def print_section(text):
    print(f"\n{Colors.YELLOW}📋 {text}{Colors.RESET}")
    print(f"{Colors.GRAY}{'─' * 60}{Colors.RESET}\n")

def test_pass(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def test_fail(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def test_info(text):
    print(f"{Colors.GRAY}   {text}{Colors.RESET}")

# Test Results
results = {
    'passed': 0,
    'failed': 0,
    'total': 0
}

def run_test(test_name, test_func):
    """Run a test and track results"""
    results['total'] += 1
    try:
        success, message = test_func()
        if success:
            test_pass(message)
            results['passed'] += 1
        else:
            test_fail(message)
            results['failed'] += 1
        return success
    except Exception as e:
        test_fail(f"{test_name}: {str(e)}")
        results['failed'] += 1
        return False

# ========================================
# TESTS
# ========================================

def test_python_version():
    """Test Python version"""
    version = sys.version.split()[0]
    return True, f"Python Version: {version}"

def test_backend_structure():
    """Test backend folder structure"""
    backend_path = Path("backend")
    if not backend_path.exists():
        return False, "Backend folder not found"
    
    required_files = ["main.py", "requirements.txt"]
    missing = [f for f in required_files if not (backend_path / f).exists()]
    
    if missing:
        return False, f"Backend missing files: {', '.join(missing)}"
    return True, "Backend structure complete"

def test_data_files():
    """Test data files"""
    data_path = Path("Data")
    if not data_path.exists():
        return False, "Data folder not found"
    
    csv_files = list(data_path.glob("*.csv"))
    if len(csv_files) < 3:
        return False, f"Only {len(csv_files)} CSV files found (expected 4+)"
    
    total_size = sum(f.stat().st_size for f in csv_files) / (1024 * 1024)  # MB
    return True, f"{len(csv_files)} data files found ({total_size:.2f} MB total)"

def test_frontend_structure():
    """Test frontend structure"""
    frontend_path = Path("Frontend")
    if not frontend_path.exists():
        return False, "Frontend folder not found"
    
    required_items = ["package.json", "src", "public"]
    missing = [item for item in required_items if not (frontend_path / item).exists()]
    
    if missing:
        return False, f"Frontend missing: {', '.join(missing)}"
    return True, "Frontend structure complete"

def test_env_configuration():
    """Test environment configuration"""
    env_path = Path(".env")
    if not env_path.exists():
        return False, ".env file not found"
    
    with open(env_path) as f:
        content = f.read()
        if "GEMINI_API_KEY" in content:
            return True, "Environment configured with Gemini AI"
    return False, "Missing GEMINI_API_KEY in .env"

def test_backend_imports():
    """Test critical backend imports"""
    sys.path.insert(0, str(Path("backend").absolute()))
    try:
        import fastapi
        import pandas
        import sklearn
        test_info(f"   FastAPI: {fastapi.__version__}")
        test_info(f"   Pandas: {pandas.__version__}")
        test_info(f"   Scikit-learn: {sklearn.__version__}")
        return True, "All backend dependencies installed"
    except ImportError as e:
        return False, f"Missing dependency: {str(e)}"

def test_ml_models():
    """Test ML models directory"""
    ml_path = Path("backend/ml_models")
    if not ml_path.exists():
        return False, "ML models folder not found"
    
    model_files = list(ml_path.glob("*.pkl")) + list(ml_path.glob("*.joblib"))
    if len(model_files) == 0:
        return False, "No trained models found"
    
    return True, f"{len(model_files)} trained models found"

def test_scripts_organization():
    """Test scripts organization"""
    scripts_path = Path("scripts")
    if not scripts_path.exists():
        return False, "Scripts folder not found"
    
    bat_files = list(scripts_path.glob("**/*.bat"))
    return True, f"Scripts organized: {len(bat_files)} batch files"

def test_docs_organization():
    """Test documentation organization"""
    docs_path = Path("docs")
    if not docs_path.exists():
        return False, "Docs folder not found"
    
    md_files = list(docs_path.glob("**/*.md"))
    return True, f"Documentation organized: {len(md_files)} markdown files"

# ========================================
# MAIN TEST RUNNER
# ========================================

def main():
    print_header("🧪 COMPREHENSIVE SYSTEM TEST")
    
    print_section("Phase 1: Environment Check")
    run_test("Python Version", test_python_version)
    run_test("Environment Config", test_env_configuration)
    
    print_section("Phase 2: Backend Tests")
    run_test("Backend Structure", test_backend_structure)
    run_test("Backend Dependencies", test_backend_imports)
    run_test("ML Models", test_ml_models)
    
    print_section("Phase 3: Data Tests")
    run_test("Data Files", test_data_files)
    
    print_section("Phase 4: Frontend Tests")
    run_test( "Frontend Structure", test_frontend_structure)
    
    print_section("Phase 5: Organization Tests")
    run_test("Scripts Organization", test_scripts_organization)
    run_test("Docs Organization", test_docs_organization)
    
    # Summary
    print_header("📊 TEST SUMMARY")
    print(f"{Colors.BOLD}Total Tests: {results['total']}{Colors.RESET}")
    print(f"{Colors.GREEN}Passed: {results['passed']}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {results['failed']}{Colors.RESET}")
    
    success_rate = (results['passed'] / results['total'] * 100) if results['total'] > 0 else 0
    print(f"\n{Colors.CYAN}Success Rate: {success_rate:.1f}%{Colors.RESET}\n")
    
    if results['failed'] == 0:
        print(f"{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED!{Colors.RESET}\n")
        return 0
    else:
        print(f"{Colors.YELLOW}⚠️  Some tests failed. Review above for details.{Colors.RESET}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
