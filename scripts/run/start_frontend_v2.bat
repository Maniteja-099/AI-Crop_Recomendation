@echo off
REM Zero-Config Frontend Startup Script
REM AI Agricultural Intelligence System

REM Navigate to project root
cd /d "%~dp0..\.."

echo ========================================
echo   AI Agricultural Frontend App
echo   Modern Agritech Design
echo ========================================
echo.

cd Frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/2] Installing dependencies (first time only)...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

REM Start React development server
echo [2/2] Starting React app on port 3000...
echo.
echo Open your browser: http://localhost:3000
echo Unified Dashboard: http://localhost:3000/unified-dashboard
echo.
call npm start

pause
