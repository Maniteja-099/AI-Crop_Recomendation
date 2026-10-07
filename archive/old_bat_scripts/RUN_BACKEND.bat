@echo off
REM ==========================================
REM Agri-Smart Backend Server
REM FastAPI + ML Models + Gemini AI
REM ==========================================

title Agri-Smart Backend Server

echo.
echo ========================================
echo   Agri-Smart Backend Server
echo   FastAPI + ML Models + Gemini AI
echo ========================================
echo.

cd /d "%~dp0backend"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    pause
    exit /b 1
)

REM Check .env file
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Creating from template...
    copy /Y ".env.example" ".env" >nul 2>&1
    echo.
    echo IMPORTANT: Please edit backend\.env and add your API keys:
    echo   - OPENWEATHER_API_KEY
    echo   - GEMINI_API_KEY
    echo.
    notepad .env
    echo.
    echo After saving API keys, restart this script.
    pause
    exit /b 0
)

echo [*] Starting FastAPI Server...
echo [*] URL: http://localhost:8000
echo [*] API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python main_v2.py

pause
