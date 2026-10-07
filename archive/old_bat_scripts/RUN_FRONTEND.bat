@echo off
REM ==========================================
REM Agri-Smart Frontend Server
REM React + PWA + Material-UI
REM ==========================================

title Agri-Smart Frontend Server

echo.
echo ========================================
echo   Agri-Smart Frontend Server
echo   React + PWA + Material-UI
echo ========================================
echo.

cd /d "%~dp0Frontend"

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    pause
    exit /b 1
)

REM Check node_modules
if not exist "node_modules\" (
    echo [*] Installing dependencies...
    echo This may take 2-5 minutes...
    call npm install
    echo.
)

echo [*] Starting React Development Server...
echo [*] URL: http://localhost:3000
echo.
echo The browser will open automatically.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start

pause
