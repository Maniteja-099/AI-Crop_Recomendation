import pytest
import sys
import os
import json
from datetime import datetime

def run_all_tests():
    print("\n" + "="*80)
    print(f"🚀 AGRI-AI SYSTEM COMPREHENSIVE TEST SUITE - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    # Define test files
    test_files = [
        "tests/test_prediction_service.py",
        "tests/test_chatbot_service.py",
        "tests/test_api.py"
    ]
    
    # Run tests and capture results
    # We'll use pytest's internal runner if possible, or just call it via subprocess
    import subprocess
    
    results = []
    all_passed = True
    
    for test_file in test_files:
        print(f"\nRunning {test_file}...")
        process = subprocess.run(
            [sys.executable, "-m", "pytest", test_file, "-v"],
            capture_output=True,
            text=True
        )
        
        passed = process.returncode == 0
        if not passed:
            all_passed = False
            
        results.append({
            "file": test_file,
            "passed": passed,
            "output": process.stdout,
            "error": process.stderr
        })
        
        if passed:
            print(f"✅ {test_file} PASSED")
        else:
            print(f"❌ {test_file} FAILED")
            print(process.stdout)
    
    # Generate Markdown Report
    report_path = "tests/FULL_PROJECT_TEST_REPORT.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"# 📊 Agri-AI Backend Test Report\n\n")
        f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Overall Status:** {'✅ PASSED' if all_passed else '❌ FAILED'}\n\n")
        
        f.write("## 🏁 Summary\n\n")
        f.write("| Test Module | Status | Details |\n")
        f.write("|-------------|--------|---------|\n")
        for res in results:
            status = "✅ PASS" if res["passed"] else "❌ FAIL"
            f.write(f"| {res['file']} | {status} | [View Logs](#{res['file'].replace('/', '').replace('.', '')}) |\n")
        
        f.write("\n## 📝 Detailed Logs\n\n")
        for res in results:
            f.write(f"### {res['file']}\n")
            f.write("```text\n")
            f.write(res["output"])
            if res["error"]:
                f.write("\nErrors:\n")
                f.write(res["error"])
            f.write("```\n\n")
    
    print("\n" + "="*80)
    if all_passed:
        print("🎉 ALL TESTS PASSED! PROJECT IS PRODUCTION-READY.")
    else:
        print("⚠️  SOME TESTS FAILED. PLEASE CHECK THE REPORT.")
    print(f"Report generated: {report_path}")
    print("="*80 + "\n")

if __name__ == "__main__":
    run_all_tests()
