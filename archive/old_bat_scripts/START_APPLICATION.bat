@echo off
echo ========================================
echo   Team 7 - AI Agricultural System
echo   COMPLETE APPLICATION LAUNCHER
echo ========================================
echo.
echo This will start BOTH backend and frontend servers
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "call .venv\Scripts\activate.bat && cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && set BROWSER=none && npm start"

echo.
echo ========================================
echo   Both Servers Starting!
echo ========================================
echo.
echo Backend Server: http://localhost:8000
echo Frontend App: http://localhost:3000
echo.
echo Two new windows will open - DO NOT CLOSE THEM
echo.
echo To access the application:
echo 1. Wait 10-15 seconds for both servers to start
echo 2. Open your browser
echo 3. Go to http://localhost:3000
echo.
echo To stop the application:
echo - Close both server windows (Backend and Frontend)
echo.
echo ========================================

timeout /t 3 >nul
start http://localhost:3000

echo.
echo Opening application in your browser...
echo.
pause
