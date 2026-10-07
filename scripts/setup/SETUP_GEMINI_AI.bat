@echo off
REM ========================================
REM Gemini AI Setup Assistant
REM ========================================
REM This script helps enable Gemini AI for your chatbot
REM

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  Gemini AI Setup Assistant                     ║
echo ║              Enable AI-Powered Chatbot for Your Farm           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if we're in the right directory
if not exist "backend\.env" (
    color 0C
    echo ERROR: .env file not found!
    echo.
    echo This script must be run from: e:\MiniProject
    echo Current directory: %cd%
    echo.
    pause
    exit /b 1
)

echo [Step 1/4] Checking current configuration...
echo.

REM Read current OFFLINE_MODE
for /f "tokens=2 delims==" %%i in ('findstr "OFFLINE_MODE" backend\.env') do set OFFLINE_MODE=%%i

echo Current Status:
echo   OFFLINE_MODE = %OFFLINE_MODE%
echo.

echo [Step 2/4] What would you like to do?
echo.
echo   1. Enable Gemini AI (I have an API key)
echo   2. Get Gemini API key (No key yet)
echo   3. Test current setup
echo   4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto enable_gemini
if "%choice%"=="2" goto get_api_key
if "%choice%"=="3" goto test_setup
if "%choice%"=="4" goto exit
goto invalid_choice

:enable_gemini
cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                 Enable Gemini AI                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo I will help you enable Gemini AI.
echo.
echo Requirements:
echo   1. A Google account
echo   2. Your Gemini API key (from: https://makersuite.google.com/app/apikey)
echo.
set /p api_key="Paste your Gemini API key: "

if "%api_key%"=="" (
    color 0C
    echo ERROR: API key cannot be empty!
    echo.
    pause
    goto enable_gemini
)

echo.
echo Updating .env file...
echo   - Setting OFFLINE_MODE=False
echo   - Adding your API key
echo.

REM Create backup
copy backend\.env backend\.env.backup >nul
echo   ✓ Backup created: backend\.env.backup

REM Update .env file
(for /f "delims=" %%a in (backend\.env) do (
    if "%%a"=="OFFLINE_MODE=True" (
        echo OFFLINE_MODE=False
    ) else if "%%a"=="OFFLINE_MODE=False" (
        echo OFFLINE_MODE=False
    ) else if "%%a"=="GEMINI_API_KEY=" (
        echo GEMINI_API_KEY=%api_key%
    ) else (
        echo %%a
    )
)) > backend\.env.tmp
move /y backend\.env.tmp backend\.env >nul

echo   ✓ OFFLINE_MODE set to False
echo   ✓ API key configured
echo.

echo Verifying changes...
findstr "OFFLINE_MODE\|GEMINI_API_KEY" backend\.env
echo.

color 0B
echo.
echo ✅ Configuration updated successfully!
echo.
echo Next Steps:
echo   1. The backend will use Gemini AI
echo   2. Your chatbot will have AI responses
echo   3. Visit http://localhost:3000/chat to test
echo.
echo To start the backend:
echo   - Run: RUN_BACKEND.bat
echo   - Or: cd backend ^&^& python main_v2.py
echo.
pause
goto exit

:get_api_key
cls
color 0F
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║            How to Get Your Gemini API Key                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Step 1: Go to https://makersuite.google.com/app/apikey
echo        (Or search "Google AI Studio API key")
echo.
echo Step 2: Sign in with your Google account
echo.
echo Step 3: Click "Create API Key"
echo        - Select "Create new secret key in Google AI Studio"
echo.
echo Step 4: Copy the API key (looks like: AIza_...)
echo.
echo Step 5: Come back to this script and select option 1
echo.
echo ✅ It's FREE! (1,500 requests/day included)
echo.
pause
cls
set /p open_url="Would you like me to open the page now? (y/n): "
if "%open_url%"=="y" (
    start https://makersuite.google.com/app/apikey
    timeout /t 2 >nul
    goto enable_gemini
) else (
    goto exit
)

:test_setup
cls
color 0E
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   Testing Setup                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Checking backend/.env configuration...
echo.
findstr "OFFLINE_MODE\|GEMINI_API_KEY\|GEMINI_MODEL" backend\.env
echo.
echo.
echo Instructions:
echo   1. Start the backend: python main_v2.py (in backend folder)
echo   2. Watch for startup message:
echo.
echo   If Gemini is working:
echo      "✅ Gemini model initialized successfully"
echo.
echo   If offline mode:
echo      "[INFO] Gemini AI disabled - Running in OFFLINE MODE..."
echo.
echo Press any key to continue...
pause

echo.
echo [TESTING] Starting backend in 3 seconds...
echo           (Watch the console output)
echo.
timeout /t 3 >nul

cd backend
python main_v2.py
cd ..

goto exit

:invalid_choice
color 0C
echo ERROR: Invalid choice. Please enter 1, 2, 3, or 4.
pause
goto enable_gemini

:exit
color 07
cls
echo.
echo Thank you for using Gemini AI Setup Assistant!
echo.
echo For more help, see: GEMINI_AI_SETUP_GUIDE.md
echo.
exit /b 0
