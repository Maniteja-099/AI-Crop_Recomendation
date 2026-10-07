# API Documentation - Complete Reference

## 📋 Base Information

- **Base URL**: `http://localhost:8000` (Development)
- **Base URL**: `https://your-domain.com` (Production)
- **Protocol**: HTTP/HTTPS REST
- **Content-Type**: `application/json`
- **Authentication**: None (Current phase)
- **Rate Limits**: 
  - General: 100 requests/minute
  - Predictions: 10 requests/minute
  - Returns: `429 Too Many Requests`

---

## 🏥 Health Check Endpoint

### GET /health

**Purpose**: Check if API is running and all models are loaded

**Request Headers**:
```
GET /health HTTP/1.1
Host: localhost:8000
```

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "models_loaded": 10,
  "offline_mode": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Possible Status Codes**:
- `200 OK` - Server is healthy
- `503 Service Unavailable` - Server is down

---

## 🌾 Endpoint 1: Full Report (5-Model Analysis)

### ⭐ POST /api/analyze/full-report

**Purpose**: Execute complete 5-model farm analysis pipeline

**Request Headers**:
```
POST /api/analyze/full-report HTTP/1.1
Host: localhost:8000
Content-Type: application/json
```

**Request Body**:
```json
{
  "nitrogen": 45.5,
  "phosphorus": 25.3,
  "potassium": 85.2,
  "temperature": 28.5,
  "humidity": 65.0,
  "month": 6,
  "area": 2.5
}
```

**Field Validation Rules**:
```
nitrogen:    0-200 mg/kg (REQUIRED)
phosphorus:  0-200 mg/kg (REQUIRED)
potassium:   0-300 mg/kg (REQUIRED)
temperature: -20 to 60°C (REQUIRED)
humidity:    0-100% (REQUIRED)
month:       1-12 (REQUIRED)
area:        > 0 hectares (REQUIRED)
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "report": {
    "timestamp": "2024-01-15T10:30:00Z",
    "summary": "Good farming conditions detected",
    
    "soil_fertility": {
      "status": "success",
      "message": "Fertile Soil",
      "avg_nutrients": 51.67,
      "recommendation": "Continue current nutrient management"
    },
    
    "weather_risk": {
      "status": "success",
      "label": "Normal Conditions",
      "recommendation": "Ideal for farming activities"
    },
    
    "crop_recommendation": {
      "status": "success",
      "primary_crop": "rice",
      "icon": "🌾",
      "alternatives": ["wheat", "barley"],
      "confidence": 0.92,
      "crop_tips": [
        "Maintain soil moisture at 60-70%",
        "Apply NPK (1:1:1) ratio",
        "Monitor for pest activity weekly"
      ]
    },
    
    "yield_prediction": {
      "status": "success",
      "predicted_yield": 3.5,
      "per_hectare": 1.4,
      "quality": "Good",
      "market_value": "₹3500 per quintal"
    },
    
    "fertilizer_advisory": {
      "status": "success",
      "recommended_fertilizer": "NPK",
      "icon": "💧",
      "dosage": "20-30 kg/hectare",
      "timing": "Split application",
      "application_method": "Broadcast then incorporate",
      "warnings": [
        "Apply 1 week before sowing",
        "Ensure field moisture"
      ],
      "deficiencies": {
        "nitrogen": false,
        "phosphorous": false,
        "potassium": false
      }
    },
    
    "overall_confidence": 0.89
  }
}
```

**Error Response (422 Unprocessable Entity)**:
```json
{
  "status": "error",
  "message": "Invalid input parameters",
  "errors": [
    {
      "field": "temperature",
      "error": "Value -25 is less than minimum allowed value -20"
    }
  ]
}
```

**Error Response (500 Server Error)**:
```json
{
  "status": "error",
  "message": "Server error during prediction",
  "error_type": "ModelLoadError",
  "details": "Could not load crop recommendation model"
}
```

---

## 🌱 Endpoint 2: Soil Fertility Analysis

### POST /api/soil-fertility

**Purpose**: Analyze soil nutrient levels

**Request Body**:
```json
{
  "nitrogen": 45.5,
  "phosphorus": 25.3,
  "potassium": 85.2
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Fertile Soil",
  "avg_nutrients": 51.67,
  "recommendation": "Continue current nutrient management"
}
```

---

## ⛅ Endpoint 3: Weather Risk Prediction

### POST /api/weather-risk

**Purpose**: Predict weather-related farming risks

**Request Body**:
```json
{
  "temperature": 28.5,
  "humidity": 65.0,
  "month": 6
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "label": "Normal Conditions",
  "recommendation": "Ideal for farming activities"
}
```

---

## 🌾 Endpoint 4: Crop Recommendation

### POST /api/crop-recommendation

**Purpose**: Recommend best crop based on soil and weather

**Request Body**:
```json
{
  "nitrogen": 45.5,
  "phosphorus": 25.3,
  "potassium": 85.2,
  "temperature": 28.5,
  "humidity": 65.0,
  "month": 6
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "primary_crop": "rice",
  "icon": "🌾",
  "alternatives": ["wheat", "barley"],
  "confidence": 0.92,
  "crop_tips": [
    "Maintain soil moisture at 60-70%",
    "Apply NPK (1:1:1) ratio",
    "Monitor for pest activity weekly"
  ]
}
```

---

## 📊 Endpoint 5: Yield Prediction

### POST /api/yield-prediction

**Purpose**: Predict crop yield based on conditions

**Request Body**:
```json
{
  "crop": "rice",
  "area": 2.5,
  "nitrogen": 45.5,
  "phosphorus": 25.3,
  "potassium": 85.2,
  "temperature": 28.5,
  "humidity": 65.0,
  "month": 6
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "predicted_yield": 3.5,
  "per_hectare": 1.4,
  "quality": "Good",
  "market_value": "₹3500 per quintal"
}
```

---

## 💧 Endpoint 6: Fertilizer Advisory

### POST /api/fertilizer-advisory

**Purpose**: Recommend fertilizer and nutrient management

**Request Body**:
```json
{
  "crop": "rice",
  "nitrogen": 45.5,
  "phosphorus": 25.3,
  "potassium": 85.2
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "recommended_fertilizer": "NPK",
  "icon": "💧",
  "dosage": "20-30 kg/hectare",
  "timing": "Split application",
  "application_method": "Broadcast then incorporate",
  "warnings": [
    "Apply 1 week before sowing",
    "Ensure field moisture"
  ],
  "deficiencies": {
    "nitrogen": false,
    "phosphorous": false,
    "potassium": false
  }
}
```

---

## 💬 Endpoint 7: Chatbot (AI Assistance)

### POST /api/chat

**Purpose**: Get AI-powered farming advice

**Request Body**:
```json
{
  "message": "What should I do about nitrogen deficiency?",
  "language": "en",
  "context": {
    "crop": "rice",
    "nitrogen": 15,
    "phosphorus": 25,
    "potassium": 85
  }
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Nitrogen deficiency detected in your soil...",
  "suggestions": [
    "Apply urea 46% at 50 kg/hectare",
    "Split application recommended",
    "Water thoroughly after application"
  ],
  "confidence": 0.88
}
```

---

## 🔧 Request/Response Example - Complete Flow

### Step 1: Prepare Data (Frontend)
```javascript
const formData = {
  nitrogen: 45.5,
  phosphorus: 25.3,
  potassium: 85.2,
  temperature: 28.5,
  humidity: 65.0,
  month: 6,
  area: 2.5
};
```

### Step 2: Send Request (Frontend with Axios)
```javascript
axios.post('http://localhost:8000/api/analyze/full-report', formData)
  .then(response => {
    console.log('Report:', response.data.report);
    // Update UI with report
  })
  .catch(error => {
    console.error('Error:', error.response.data.message);
    // Show error message
  });
```

### Step 3: Process Request (Backend FastAPI)
```python
@app.post("/api/analyze/full-report")
async def analyze_full_report(request: FullReportRequest):
    # 1. Input validation (Pydantic)
    # 2. Model 1: Soil Fertility
    # 3. Model 2: Weather Risk
    # 4. Model 3: Crop Recommendation
    # 5. Model 4: Yield Prediction
    # 6. Model 5: Fertilizer Advisory
    # 7. Assemble report
    # 8. Return response
```

### Step 4: Process Response (Frontend)
```javascript
const report = response.data.report;
console.log("Crop:", report.crop_recommendation.primary_crop);
console.log("Fertilizer:", report.fertilizer_advisory.recommended_fertilizer);
console.log("Yield:", report.yield_prediction.predicted_yield);
```

---

## 📚 Error Handling Guide

### Error Response Structure
```json
{
  "status": "error",
  "message": "User-friendly error message",
  "error_type": "ErrorType",
  "details": "Technical details"
}
```

### Common HTTP Status Codes

| Code | Meaning | When | Example |
|------|---------|------|---------|
| 200 | OK | Request successful | Full report generated |
| 400 | Bad Request | Missing required field | No "nitrogen" field |
| 422 | Unprocessable Entity | Invalid value | nitrogen = -50 |
| 429 | Too Many Requests | Rate limit exceeded | >100 requests/min |
| 500 | Server Error | Internal error | Model load failed |
| 503 | Service Unavailable | Server down | Database connection lost |

### Example Error Responses

**Invalid Field Type** (400):
```json
{
  "status": "error",
  "message": "Invalid input type",
  "error_type": "ValidationError",
  "errors": [
    {
      "field": "nitrogen",
      "error": "Expected float, got string"
    }
  ]
}
```

**Value Out of Range** (422):
```json
{
  "status": "error",
  "message": "Input value out of allowed range",
  "error_type": "ValueError",
  "errors": [
    {
      "field": "temperature",
      "error": "Value 100 is greater than maximum 60"
    }
  ]
}
```

**Rate Limit Exceeded** (429):
```json
{
  "status": "error",
  "message": "Rate limit exceeded",
  "error_type": "RateLimitError",
  "retry_after": 60
}
```

**Model Not Available** (500):
```json
{
  "status": "error",
  "message": "Server error during prediction",
  "error_type": "ModelLoadError",
  "details": "Crop recommendation model not found",
  "fallback": "Using rule-based prediction"
}
```

---

## 🔐 Security & Headers

### Request Headers Required
```
Host: localhost:8000
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Accept-Encoding: gzip, deflate
```

### Response Headers Included
```
Content-Type: application/json
Content-Encoding: gzip
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cache-Control: no-cache, no-store, must-revalidate
```

---

## 💾 Data Types & Constraints

### All Numeric Ranges
```
Nitrogen (N):      0 to 200 mg/kg
Phosphorus (P):    0 to 200 mg/kg
Potassium (K):     0 to 300 mg/kg
Temperature:      -20 to 60 °C
Humidity:         0 to 100 %
Month:            1 to 12
Area:             > 0 hectares (any positive number)
```

### Soil Status Categories
```
High Fertile       → avg_nutrients > 80
Fertile            → avg_nutrients 50-80
Semi-Fertile       → avg_nutrients 30-50
Low Fertility       → avg_nutrients < 30
```

### Weather Risk Categories
```
Risk-Free
Normal Conditions
Moderate Risk
High Risk
Extreme Risk
```

### Crop Database (8 Crops)
```
rice      → 🌾
wheat     → 🌾
maize     → 🌽
cotton    → 🌾
sugarcane → 🌾
pulses    → 🫘
groundnut → 🥜
soybean   → 🫘
```

### Fertilizer Types
```
urea      → Nitrogen rich (46% N)
dap       → Phosphate rich (18% P)
mop       → Potassium rich (60% K)
npk       → Balanced (1:1:1 ratio)
organic   → Compost/manure
```

---

## 🛠️ Testing the API

### Using cURL

**Test Health Endpoint**:
```bash
curl -X GET http://localhost:8000/health
```

**Test Full Report**:
```bash
curl -X POST http://localhost:8000/api/analyze/full-report \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2,
    "temperature": 28.5,
    "humidity": 65.0,
    "month": 6,
    "area": 2.5
  }'
```

### Using Python Requests

```python
import requests
import json

url = "http://localhost:8000/api/analyze/full-report"
data = {
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2,
    "temperature": 28.5,
    "humidity": 65.0,
    "month": 6,
    "area": 2.5
}

response = requests.post(url, json=data)
print(json.dumps(response.json(), indent=2))
```

### Using JavaScript/Axios

```javascript
const axios = require('axios');

const data = {
  nitrogen: 45.5,
  phosphorus: 25.3,
  potassium: 85.2,
  temperature: 28.5,
  humidity: 65.0,
  month: 6,
  area: 2.5
};

axios.post('http://localhost:8000/api/analyze/full-report', data)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

---

## 📱 Offline Mode Fallback

When API fails or internet is unavailable:

```
Soil Fertility → Rule-based: avg(N,P,K) > 50 = Fertile
Weather Risk → Rule-based: month in [6,7,8] = Normal
Crop Recommendation → Default: "rice" + alternatives
Yield Prediction → Default: 2.5 tons/hectare
Fertilizer Advisory → Default: "NPK 1:1:1 ratio"
```

**Frontend Detection**:
```javascript
if (!navigator.onLine) {
  // Use offline mode
  const fallbackReport = getFallbackReport(formData);
}
```

---

## 🚀 Performance Tips

1. **Compress Responses**: GZip enabled by default (reduces size ~70%)
2. **Cache Models**: All 10 ML models cached in memory at startup
3. **Rate Limiting**: Prevents API abuse (100 general, 10 prediction/min)
4. **Async Processing**: FastAPI handles requests asynchronously
5. **Error Recovery**: Graceful fallback to rule-based predictions

---

**API Version**: v1.0
**Last Updated**: January 2024
**Status**: ✅ Production Ready
