@echo off
REM ==============================================================================
REM SMART AGRICULTURAL API v3.0 - Startup Script
REM Auto-Fetching Weather + Autonomous Farm Recommendations
REM ==============================================================================

title Smart Agricultural API Server
cd /d "%~dp0backend"

:loop
echo.
echo [START] Launching Smart API on port 8000...
echo.

python -m uvicorn api_smart:app --host 0.0.0.0 --port 8000

echo.
echo [STOP] API exited with code %ERRORLEVEL%
echo [WAIT] Restarting in 5 seconds...
timeout /t 5
goto loop
