@echo off
echo ========================================
echo   Team 7 - AI Agricultural System
echo   Starting FastAPI Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Installing/Checking Python dependencies...
pip install fastapi "uvicorn[standard]" pydantic pandas numpy scikit-learn joblib xgboost

echo.
echo ========================================
echo   Starting Backend on Port 8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.

python backend_api.py

pause
