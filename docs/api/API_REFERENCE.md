# 🔧 API Reference - AgroCrop AI Backend

## Base URL
```
http://localhost:8000
```

## API Documentation (Interactive)
```
http://localhost:8000/docs     (Swagger UI)
http://localhost:8000/redoc    (ReDoc)
```

---

## Health & Status

### GET `/api/health`
Check if the backend is running.

**Response:**
```json
{
  "status": "healthy",
  "mode": "mock" | "production",
  "models_loaded": 5,
  "timestamp": "2026-02-10T20:00:00"
}
```

---

## Core Analysis Endpoints

### POST `/api/soil-fertility`
Basic soil fertility check.

**Request:**
```json
{
  "nitrogen": 50,
  "phosphorus": 30,
  "potassium": 40
}
```

**Response:**
```json
{
  "status": "success" | "warning" | "error",
  "message": "Soil is moderately fertile",
  "icon": "🟡",
  "description": "Some nutrients need attention"
}
```

---

### POST `/api/soil-fertility/comprehensive`
Comprehensive soil fertility report with full recommendations.

**Request:**
```json
{
  "nitrogen": 50,
  "phosphorus": 30,
  "potassium": 40
}
```

**Response:**
```json
{
  "status": "success",
  "timestamp": "2026-02-10T20:00:00",
  "soil_health": { "status": "warning", "message": "...", "icon": "🟡" },
  "nutrient_analysis": {
    "nitrogen": { "level": "Moderate", "status": "warning", "value": 50, "optimal_range": "30-60 mg/kg", "recommendation": "...", "action": "..." },
    "phosphorus": { ... },
    "potassium": { ... },
    "average": 40.0
  },
  "precautions": ["..."],
  "actions_for_optimal_growth": ["1. ...", "2. ...", ...],
  "fertilizer_recommendations": [
    { "name": "Urea", "icon": "💧", "dosage": "45-60 kg/hectare", "timing": "...", "purpose": "..." }
  ],
  "yield_potential": { "level": "Medium", "icon": "📊", "estimate": "60-80%", "description": "..." },
  "summary": {
    "overall_status": "...",
    "fertility_score": 53.3,
    "immediate_priority": "Monitor and maintain",
    "next_test_due": "In 3 months"
  }
}
```

---

### GET `/api/weather/live`
Fetch live weather data from OpenWeatherMap.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lat` | float | 19.076 | Latitude |
| `lon` | float | 72.8777 | Longitude |

**Response:**
```json
{
  "status": "success",
  "source": "openweathermap" | "mock" | "fallback",
  "location": { "lat": 19.076, "lon": 72.877, "city": "Mumbai" },
  "current": {
    "temperature": 28.5,
    "feels_like": 31.2,
    "humidity": 72,
    "pressure": 1013,
    "wind_speed": 3.6,
    "wind_direction": "SW",
    "description": "Partly Cloudy",
    "icon": "⛅",
    "visibility": 10000
  },
  "farming_advisory": {
    "risk_level": "low" | "moderate" | "high",
    "advisory": "Good conditions for farming.",
    "irrigation": "Normal irrigation schedule.",
    "precautions": ["Monitor soil moisture levels"]
  },
  "timestamp": "2026-02-10T20:00:00"
}
```

---

### POST `/api/weather-risk`
Analyze weather risk for a given month and temperature.

**Request:**
```json
{
  "month": 7,
  "temperature": 35
}
```

---

### POST `/api/crop-recommendation`
Get AI crop recommendation.

**Request:**
```json
{
  "nitrogen": 90, "phosphorus": 40, "potassium": 40,
  "temperature": 25, "humidity": 80, "ph": 6.5, "rainfall": 200
}
```

---

### POST `/api/yield-prediction`
Predict crop yield.

**Request:**
```json
{
  "crop": "Rice", "season": "Kharif", "state": "Karnataka",
  "area": 1.0, "rainfall": 1000, "fertilizer": 500
}
```

---

### POST `/api/fertilizer-recommendation`
Get fertilizer prescription.

**Request:**
```json
{
  "nitrogen": 30, "phosphorous": 10, "potassium": 10,
  "temperature": 25, "humidity": 50,
  "soilType": "Loamy", "cropType": "Paddy"
}
```

---

### POST `/api/analyze/full-report`
Unified analysis combining all modules.

**Request:** Combined farm data object with soil, weather, and farm details.

---

### POST `/api/chat`
AI chatbot interaction.

**Request:**
```json
{
  "message": "What crop should I grow?",
  "language": "en",
  "context_data": { "soil": { ... }, "weather": { ... } }
}
```

**Response:**
```json
{
  "reply": "Based on your soil conditions...",
  "intent": "crop_recommendation",
  "confidence": 0.92,
  "language": "en"
}
```

---

## Error Handling

All endpoints return errors in this format:
```json
{
  "detail": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `422` - Validation error (missing/invalid fields)
- `500` - Server error
- `502` - External API error (weather)
