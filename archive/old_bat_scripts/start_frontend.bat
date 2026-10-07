@echo off
echo ========================================
echo   Team 7 - AI Agricultural System
echo   Starting React Frontend
echo ========================================
echo.

cd /d "%~dp0Frontend"

echo Checking npm dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo ========================================
echo   Starting Frontend on Port 3000
echo   URL: http://localhost:3000
echo ========================================
echo.

call npm start

pause
