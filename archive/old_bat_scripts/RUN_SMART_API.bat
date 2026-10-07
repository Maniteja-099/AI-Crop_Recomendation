@echo off
REM ============================================================================
REM Smart Agricultural API v3.0 - Auto-Fetched Weather System
REM ============================================================================
REM This script starts the intelligent farming recommendation system
REM Features:
REM   - Auto-fetches weather (no user guessing needed!)
REM   - Comprehensive farm analysis
REM   - All reasoning in background
REM   - Location-based recommendations
REM ============================================================================

echo.
echo ============================================================================
echo  ^>^>^>   SMART AGRICULTURAL API v3.0   ^<^<^<
echo ============================================================================
echo.
echo FEATURES:
echo  * Auto-fetched weather (91,320 historical records)
echo  * No user weather prediction needed!
echo  * Comprehensive 8-section farm report
echo  * All reasoning automated in background
echo  * Location-based recommendations
echo.
echo ============================================================================
echo.

REM Change to backend directory
cd /d "%~dp0backend" || (
    echo ERROR: Could not change to backend directory
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add it to PATH
    pause
    exit /b 1
)

REM Check if required packages are installed
echo Checking dependencies...
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Required packages not found
    echo Installing requirements...
    pip install -r requirements.txt
)

echo.
echo ============================================================================
echo Starting Smart Agricultural API...
echo ============================================================================
echo.
echo Server will be available at:
echo   http://localhost:8000
echo.
echo API Documentation:
echo   http://localhost:8000/docs
echo   http://localhost:8000/redoc
echo.
echo Test Script:
echo   python ../test_smart_api.py
echo.
echo To stop the server: Press Ctrl+C
echo ============================================================================
echo.

REM Start the API
python -m uvicorn api_smart:app --reload --port 8000

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start API
    echo Check that api_smart.py exists and has no syntax errors
    pause
    exit /b 1
)
