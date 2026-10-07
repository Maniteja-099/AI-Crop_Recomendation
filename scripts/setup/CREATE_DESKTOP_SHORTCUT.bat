@echo off
echo ========================================
echo   Creating Desktop Shortcut
echo ========================================
echo.

set SCRIPT="%TEMP%\CreateShortcut.vbs"
set SHORTCUT="%USERPROFILE%\Desktop\AI Agricultural System.lnk"
set TARGET="%~dp0START_APPLICATION.bat"
set ICON="%SystemRoot%\System32\imageres.dll,1"

echo Creating shortcut on your desktop...

>%SCRIPT% echo Set oWS = WScript.CreateObject("WScript.Shell")
>>%SCRIPT% echo sLinkFile = %SHORTCUT%
>>%SCRIPT% echo Set oLink = oWS.CreateShortcut(sLinkFile)
>>%SCRIPT% echo oLink.TargetPath = %TARGET%
>>%SCRIPT% echo oLink.WorkingDirectory = "%~dp0"
>>%SCRIPT% echo oLink.Description = "AI Agricultural System - Team 7"
>>%SCRIPT% echo oLink.IconLocation = %ICON%
>>%SCRIPT% echo oLink.Save

cscript //nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================
echo   Shortcut Created Successfully!
echo ========================================
echo.
echo A shortcut "AI Agricultural System" 
echo has been created on your desktop.
echo.
echo Double-click it anytime to run the app!
echo.
echo ========================================

pause
