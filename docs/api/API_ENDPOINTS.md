# API Reference - Complete Guide

## 📋 Quick Start

- **Base URL**: `http://localhost:8000` (Development)
- **Base URL**: `https://your-domain.com` (Production)
- **Protocol**: HTTP/HTTPS REST
- **Content-Type**: `application/json`
- **Response Time**: < 500ms average
- **Rate Limits**: 100 requests/min (general), 10 requests/min (predictions)

---

## 🏥 Health Checks

### GET /health
Check if API is running and models are loaded.

```bash
curl http://localhost:8000/health
```

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "models_loaded": 10,
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "2.0.0"
}
```

### GET /status
Detailed system status with all components.

```bash
curl http://localhost:8000/status
```

---

## 🌾 Main Endpoint: Full Farm Analysis

### ⭐ POST /api/analyze/full-report

Execute complete 5-model analysis pipeline. This is the main endpoint for getting comprehensive farm recommendations.

**Request**:
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

**Field Specifications**:

| Field | Type | Range | Required | Description |
|-------|------|-------|----------|-------------|
| nitrogen | float | 0-200 | ✅ | Nitrogen level (mg/kg) |
| phosphorus | float | 0-200 | ✅ | Phosphorus level (mg/kg) |
| potassium | float | 0-300 | ✅ | Potassium level (mg/kg) |
| temperature | float | -20 to 60 | ✅ | Temperature (°C) |
| humidity | float | 0-100 | ✅ | Humidity (%) |
| month | integer | 1-12 | ✅ | Month of year |
| area | float | > 0 | ✅ | Farm area (hectares) |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "report": {
      "soil_fertility": {...},
      "weather_risk": {...},
      "crop_recommendation": {...},
      "yield_prediction": {...},
      "fertilizer_advisory": {...}
    }
  }
}
```

---

## 🌱 Individual Endpoints

### 1. Soil Fertility Analysis

**POST** `/api/analyze/soil`

```bash
curl -X POST http://localhost:8000/api/analyze/soil \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "fertility_level": "Medium",
    "avg_nutrients": 52.0,
    "nitrogen_level": "Medium",
    "phosphorus_level": "Low",
    "potassium_level": "High",
    "message": "Medium Fertility",
    "recommendation": "Apply nitrogen-rich fertilizer"
  }
}
```

### 2. Crop Recommendation

**POST** `/api/analyze/crop`

Predicts best crop based on soil and weather conditions.

```bash
curl -X POST http://localhost:8000/api/analyze/crop \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2,
    "temperature": 28.5,
    "humidity": 65.0,
    "month": 6
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "primary_crop": "rice",
    "confidence": 0.92,
    "alternatives": ["maize", "wheat"],
    "crop_tips": [
      "Plant in early June",
      "Maintain 80% soil moisture"
    ]
  }
}
```

### 3. Weather Risk Assessment

**POST** `/api/analyze/weather`

```bash
curl -X POST http://localhost:8000/api/analyze/weather \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28.5,
    "humidity": 65.0,
    "month": 6
  }'
```

### 4. Yield Prediction

**POST** `/api/analyze/yield`

```bash
curl -X POST http://localhost:8000/api/analyze/yield \
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

### 5. Fertilizer Advisory

**POST** `/api/analyze/fertilizer`

```bash
curl -X POST http://localhost:8000/api/analyze/fertilizer \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2
  }'
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Common Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | ✅ Request successful |
| 400 | Bad Request | Check your input data |
| 422 | Validation Error | Invalid field values |
| 429 | Rate Limited | Wait before retrying |
| 500 | Server Error | Server error, try again |
| 503 | Service Unavailable | Server is down |

### Example Error Response

```json
{
  "success": false,
  "error": "Invalid input: nitrogen must be between 0 and 200",
  "code": "VALIDATION_ERROR"
}
```

---

## 🔄 Request/Response Examples

### Example 1: Complete Farm Analysis

**Request**:
```bash
curl -X POST http://localhost:8000/api/analyze/full-report \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 60,
    "phosphorus": 40,
    "potassium": 150,
    "temperature": 25,
    "humidity": 70,
    "month": 6,
    "area": 5
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "report": {
      "soil_fertility": {
        "fertility_level": "High",
        "message": "High Fertility - Excellent conditions",
        "recommendation": "Maintain current nutrient levels"
      },
      "weather_risk": {
        "label": "Favorable",
        "risk_level": "Low",
        "recommendation": "Perfect growing season"
      },
      "crop_recommendation": {
        "primary_crop": "Rice",
        "confidence": 0.95,
        "alternatives": ["Sugarcane", "Maize"]
      },
      "yield_prediction": {
        "predicted_yield": 5.8,
        "quality": "Excellent"
      },
      "fertilizer_advisory": {
        "recommended_fertilizer": "Balanced NPK",
        "dosage": "100 kg/hectare"
      }
    }
  }
}
```

---

## 📱 Frontend Integration

### Using Axios (React)

```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000
});

// Make analysis request
const getFullReport = async (formData) => {
  try {
    const response = await client.post('/api/analyze/full-report', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

### Using Fetch API

```javascript
const getFullReport = async (formData) => {
  try {
    const response = await fetch('http://localhost:8000/api/analyze/full-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 🧪 Testing

### Using cURL

```bash
# Test health
curl http://localhost:8000/health

# Test full report
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

### Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:8000/api/analyze/full-report`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
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
6. Click Send

---

## 📚 More Information

- See [03_API_Reference/](.) for more detailed API documentation
- See [02_System_Architecture/](../02_System_Architecture/) for system design
- See [06_Troubleshooting/](../06_Troubleshooting/) for common issues

**Last Updated**: 2024-01-31
**Status**: ✅ Production Ready
