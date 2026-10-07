@echo off
REM ========================================
REM Agri-Smart Platform - OFFLINE MODE
REM No API Keys Needed!
REM ========================================

color 0A
cls

echo ========================================
echo   AGRI-SMART PLATFORM - OFFLINE MODE
echo ========================================
echo.
echo   Features:
echo   - All ML predictions work 100%%
echo   - Mock weather data (seasonal)
echo   - Rule-based chatbot
echo   - NO API KEYS NEEDED!
echo.
echo ========================================
echo.

REM Check if backend folder exists
if not exist "%~dp0backend" (
    echo ERROR: backend folder not found!
    pause
    exit /b 1
)

REM Check if Frontend folder exists
if not exist "%~dp0Frontend" (
    echo ERROR: Frontend folder not found!
    pause
    exit /b 1
)

echo Starting Backend Server...
echo.

REM Start backend in new window
start "Agri-Smart Backend (OFFLINE)" cmd /k "cd /d %~dp0backend && python main_v2.py"

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Starting Frontend...
echo.

REM Start frontend in new window
start "Agri-Smart Frontend" cmd /k "cd /d %~dp0Frontend && npm start"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo.
echo   Browser will open automatically!
echo.
echo   OFFLINE MODE - No internet needed!
echo   (Except for npm start first time)
echo.
echo ========================================
echo.
echo Press any key to close this window...
echo (Keep server windows open!)
pause >nul
