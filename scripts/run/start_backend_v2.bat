@echo off
REM Zero-Config Backend Startup Script
REM AI Agricultural Intelligence System

REM Navigate to project root
cd /d "%~dp0..\.."

echo ========================================
echo   AI Agricultural Backend Server
echo   Zero-Config Architecture
echo ========================================
echo.

REM Check if virtual environment exists
if exist ".venv\Scripts\activate.bat" (
    echo [1/3] Activating Python virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo [1/3] Using system Python...
)

REM Install dependencies
echo [2/3] Checking dependencies...
cd backend
pip install -q -r requirements.txt

REM Start FastAPI server
echo [3/3] Starting FastAPI server on port 8000...
echo.
echo Server will run in MOCK MODE if models are missing.
echo API Docs: http://localhost:8000/docs
echo Health Check: http://localhost:8000/api/health
echo.
python main.py

pause
