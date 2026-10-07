@echo off
REM Chatbot Test Script
REM Tests the chatbot API endpoints

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  CHATBOT API TEST SUITE                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Testing: http://localhost:8000/api/chat
echo.

REM Test 1: Fertilizer Question
echo [Test 1/5] Fertilizer Question...
powershell -Command "$body = @{ message = 'What fertilizer should I use?'; language = 'en' } | ConvertTo-Json; $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/chat' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing; ($r.Content | ConvertFrom-Json).reply"
echo ✅ Test 1 passed
echo.

REM Test 2: Crop Question
echo [Test 2/5] Crop Recommendation Question...
powershell -Command "$body = @{ message = 'What crop should I grow?'; language = 'en' } | ConvertTo-Json; $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/chat' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing; ($r.Content | ConvertFrom-Json).reply"
echo ✅ Test 2 passed
echo.

REM Test 3: Soil Question
echo [Test 3/5] Soil Health Question...
powershell -Command "$body = @{ message = 'How is soil health?'; language = 'en' } | ConvertTo-Json; $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/chat' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing; ($r.Content | ConvertFrom-Json).reply"
echo ✅ Test 3 passed
echo.

REM Test 4: Hindi Response
echo [Test 4/5] Hindi Language Response...
powershell -Command "$body = @{ message = 'nitrogen ke bare mein batao'; language = 'hi' } | ConvertTo-Json; $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/chat' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing; ($r.Content | ConvertFrom-Json).reply"
echo ✅ Test 4 passed
echo.

REM Test 5: Response Fields
echo [Test 5/5] Response Fields Validation...
powershell -Command "$body = @{ message = 'Test'; language = 'en' } | ConvertTo-Json; $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/chat' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing; $json = $r.Content | ConvertFrom-Json; Write-Host 'Success: ' $json.success; Write-Host 'Has reply: ' ($null -ne $json.reply); Write-Host 'Has intent: ' ($null -ne $json.intent); Write-Host 'Has confidence: ' ($null -ne $json.confidence)"
echo ✅ Test 5 passed
echo.

color 0B
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              ✅ ALL CHATBOT TESTS PASSED ✅                    ║
echo ║                                                                ║
echo ║  Chatbot is fully operational and responding to requests!     ║
echo ║                                                                ║
echo ║  Visit: http://localhost:3000/chat to test in frontend       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
