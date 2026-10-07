# Test Full Report API Endpoint

$headers = @{"Content-Type"="application/json"}
$body = @{
    nitrogen = 35
    phosphorus = 25
    potassium = 15
    temperature = 22
    humidity = 80
    ph = 6.5
    rainfall = 200
    month = 6
    area = 2
    state = "Karnataka"
    season = "Kharif"
    soil_type = "Loamy"
} | ConvertTo-Json

Write-Host "Testing Full Report Endpoint..." -ForegroundColor Green
Write-Host "Sending request to: http://localhost:8000/api/analyze/full-report" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/analyze/full-report" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ Success! Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $jsonResponse = $response.Content | ConvertFrom-Json
    $jsonResponse | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        Write-Host "Response Details:" -ForegroundColor Yellow
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorContent = $reader.ReadToEnd()
            $reader.Dispose()
            Write-Host $errorContent -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response" -ForegroundColor Red
        }
    }
}
