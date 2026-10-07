@echo off
REM ==========================================
REM Agri-Smart Platform - Complete Startup
REM Starts both Backend and Frontend servers
REM ==========================================

REM Navigate to project root
cd /d "%~dp0..\.."

echo.
echo ========================================
echo   Agri-Smart Precision Platform
echo   Starting All Services...
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Checking Backend Dependencies...
cd backend
if not exist ".env" (
    echo [WARNING] Backend .env file not found!
    echo Please copy .env.example to .env and configure API keys
    echo.
    pause
)

echo [2/4] Starting Backend Server...
start "Agri-Smart Backend" cmd /k "python main_v2.py"
timeout /t 3 /nobreak >nul

echo [3/4] Checking Frontend Dependencies...
cd ..\Frontend
if not exist "node_modules\" (
    echo Installing Frontend dependencies... This may take a few minutes.
    call npm install
)

echo [4/4] Starting Frontend Server...
start "Agri-Smart Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window
echo (Backend and Frontend will continue running)
echo ========================================
pause >nul
