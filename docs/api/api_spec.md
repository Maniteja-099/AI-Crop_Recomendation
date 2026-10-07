# API Specification

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. For production, implement JWT tokens.

---

## Health Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "Agricultural Intelligence System API is running",
  "timestamp": "2026-01-31T10:00:00",
  "version": "2.0.0"
}
```

### GET /status
Detailed system status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T10:00:00",
  "version": "2.0.0",
  "api": {
    "name": "Agricultural Intelligence System",
    "description": "AI-powered farming assistance platform"
  },
  "ml_models": {
    "mock_mode": false,
    "loaded_models": ["soil_model", "weather_model", "crop_model"],
    "models_directory": "/models"
  },
  "modules": [...],
  "features": {
    "bilingual_support": ["en", "hi", "te", "ta", "kn"],
    "voice_enabled": true,
    "offline_mode": true
  }
}
```

---

## Prediction Endpoints

### POST /api/predict/soil
Analyze soil fertility based on NPK values.

**Request Body:**
```json
{
  "nitrogen": 50,
  "phosphorus": 40,
  "potassium": 45
}
```

**Validation:**
- `nitrogen`: 0-200 (required)
- `phosphorus`: 0-200 (required)
- `potassium`: 0-300 (required)

**Response:**
```json
{
  "status": "success",
  "message": "Fertile Soil",
  "description": "Optimal for planting. Good nutrient balance.",
  "icon": "🟢",
  "avg_nutrients": 45.0,
  "recommendation": "Maintain current nutrient levels. Monitor pH regularly.",
  "detailed_analysis": {
    "nitrogen_status": "Medium",
    "phosphorus_status": "Medium",
    "potassium_status": "Medium",
    "individual_scores": {
      "nitrogen": 83.33,
      "phosphorus": 80.0,
      "potassium": 56.25
    }
  }
}
```

---

### POST /api/predict/weather
Predict weather risk.

**Request Body:**
```json
{
  "month": 7,
  "temperature": 30,
  "humidity": 80
}
```

**Validation:**
- `month`: 1-12 (required)
- `temperature`: -20 to 60 (required)
- `humidity`: 0-100 (optional)

**Response:**
```json
{
  "status": "error",
  "label": "Flood Risk",
  "description": "Monsoon season - high rainfall expected.",
  "icon": "🌊",
  "recommendation": "Ensure proper drainage. Protect crops from waterlogging."
}
```

---

### POST /api/predict/crop
Get crop recommendation.

**Request Body:**
```json
{
  "nitrogen": 90,
  "phosphorus": 40,
  "potassium": 40,
  "temperature": 25,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

**Validation:**
- `ph`: 0-14 (required, warning for extreme values <3 or >10)
- All nutrient values in valid ranges

**Response:**
```json
{
  "recommended_crop": "RICE",
  "icon": "🌾",
  "ideal_conditions": "High rainfall (150-300mm), humid (70-80%), temp 25-35°C",
  "growing_tips": "Requires standing water during growth. Best in Kharif season.",
  "alternatives": ["Sugarcane", "Maize"]
}
```

---

### POST /api/predict/yield
Predict crop yield.

**Request Body:**
```json
{
  "crop": "Rice",
  "season": "Kharif",
  "state": "Karnataka",
  "area": 2.5,
  "rainfall": 1000,
  "fertilizer": 500
}
```

**Validation:**
- `season`: "Kharif" | "Rabi" | "Zaid" | "Whole Year"
- `area`: > 0, <= 10000

**Response:**
```json
{
  "predicted_yield": 13.0,
  "yield_per_hectare": 5.2,
  "unit": "tons",
  "market_value_estimate": 260000,
  "recommendations": [
    "Expected yield: 13.0 tons from 2.5 hectares",
    "Yield per hectare: 5.2 tons",
    "Ensure timely irrigation and pest management"
  ]
}
```

---

### POST /api/predict/fertilizer
Get fertilizer recommendation.

**Request Body:**
```json
{
  "temperature": 28,
  "humidity": 65,
  "moisture": 40,
  "soil_type": "loamy",
  "crop_type": "Rice",
  "nitrogen": 25,
  "phosphorus": 40,
  "potassium": 50
}
```

**Response:**
```json
{
  "recommended_fertilizer": "UREA",
  "icon": "💧",
  "application_method": "Broadcast or band application",
  "timing": "Split application: at sowing and 30 days after",
  "dosage": "50-60 kg/hectare of Urea (split application)",
  "warnings": ["Nitrogen deficiency detected"]
}
```

---

### POST /api/predict/unified
Complete farm analysis.

**Request Body:**
```json
{
  "nitrogen": 50,
  "phosphorus": 40,
  "potassium": 45,
  "ph": 6.5,
  "temperature": 28,
  "humidity": 70,
  "rainfall": 150,
  "month": 7,
  "area": 2,
  "state": "Karnataka",
  "season": "Kharif",
  "soil_type": "loamy"
}
```

**Response:**
```json
{
  "success": true,
  "soil_analysis": {...},
  "weather_analysis": {...},
  "crop_recommendation": {...},
  "yield_prediction": {...},
  "fertilizer_advisory": {...},
  "overall_score": 75.0,
  "summary": "Your farm analysis shows fertile soil with flood risk...",
  "action_items": [
    "Maintain current nutrient levels",
    "Ensure proper drainage",
    "Consider growing RICE",
    "Apply UREA fertilizer"
  ]
}
```

---

## Weather Endpoints

### GET /api/weather/current
Get current weather.

**Query Parameters:**
- `latitude`: GPS latitude (optional)
- `longitude`: GPS longitude (optional)
- `state`: Indian state name (optional)

**Response:**
```json
{
  "success": true,
  "source": "OpenWeatherMap",
  "temperature": 28,
  "humidity": 65,
  "description": "Partly cloudy",
  "city": "Bengaluru",
  "farming_advice": {
    "irrigation": "Normal irrigation schedule recommended",
    "pest_alert": "✅ Normal conditions - regular pest monitoring",
    "harvesting": "✅ Good conditions for harvesting",
    "general": "Weather conditions are favorable"
  }
}
```

### GET /api/weather/by-state/{state}
Get weather by state.

**Path Parameters:**
- `state`: Indian state name (e.g., "Karnataka")

### GET /api/weather/states
List supported states.

---

## Chat Endpoints

### POST /api/chat/message
Send message to AI chatbot.

**Request Body:**
```json
{
  "message": "What crop should I grow?",
  "language": "en",
  "farm_context": {
    "soil_status": "Fertile",
    "recommended_crop": "Rice"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on your soil conditions, I recommend growing Rice...",
  "language": "en",
  "response_type": "recommendation",
  "quick_actions": [
    {"label": "Check soil health", "action": "soil_check", "icon": "🧪"},
    {"label": "Weather forecast", "action": "weather_check", "icon": "☁️"}
  ],
  "related_modules": ["crop-recommendation", "soil-fertility"],
  "should_speak": true
}
```

### GET /api/chat/quick-questions
Get suggested questions.

**Query Parameters:**
- `language`: Language code (default: "en")

---

## Settings Endpoints

### POST /api/settings/profile
Create farmer profile.

**Request Body:**
```json
{
  "name": "Ravi Kumar",
  "state": "Karnataka",
  "district": "Tumkur",
  "farm_size": 5.5,
  "language": "en",
  "primary_crops": ["Rice", "Ragi"]
}
```

### GET /api/settings/profile/{farmer_id}
Get farmer profile.

### PUT /api/settings/preferences/{farmer_id}
Update user preferences.

**Request Body:**
```json
{
  "language": "te",
  "voice_enabled": true,
  "theme": "high-contrast",
  "location": "Andhra Pradesh"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": [
    {
      "loc": ["body", "nitrogen"],
      "msg": "ensure this value is less than or equal to 200",
      "type": "value_error.number.not_le"
    }
  ]
}
```

### 404 Not Found
```json
{
  "detail": "Profile not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limits (Recommended for Production)

| Endpoint | Limit |
|----------|-------|
| /api/predict/* | 60 req/min |
| /api/weather/* | 30 req/min |
| /api/chat/* | 30 req/min |
| /api/settings/* | 20 req/min |
