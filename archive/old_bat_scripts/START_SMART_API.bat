@echo off
REM Start Smart Agricultural API v3.0

cd /d "%~dp0"

echo ======================================================================
echo  SMART AGRICULTURAL API v3.0
echo  Auto-Fetching Weather - Autonomous Farm Analysis
echo ======================================================================
echo.

python run_api_simple.py

if errorlevel 1 (
    echo.
    echo ❌ API crashed or failed to start
    echo.
    pause
)
