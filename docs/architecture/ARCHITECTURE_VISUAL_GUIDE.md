# Agricultural Intelligence System - Visual Architecture & Data Flow

## 🎨 Complete System Diagram

### Tier 1: User Interface Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                      FARMER INTERFACE                          │
│                        (React 19)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │   Dashboard   │  │   Chatbot     │  │   Weather     │      │
│  │   (5 Models)  │  │   (AI + Voice)│  │   (Live/Fore) │      │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘      │
│          │                  │                  │               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │    Soil       │  │  Crop Info    │  │  Settings     │      │
│  │  Analysis     │  │  & Tips       │  │  & Profile    │      │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘      │
│          │                  │                  │               │
│          └──────────────────┼──────────────────┘               │
│                             │                                 │
│                    ┌────────▼────────┐                        │
│                    │  Form Input &   │                        │
│                    │  Voice Control  │                        │
│                    │  (Multilingual) │                        │
│                    └────────┬────────┘                        │
│                             │                                 │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                     HTTP/REST │ Axios
                              │
```

### Tier 2: API Gateway & Middleware Layer

```
┌──────────────────────────────────────────────────────────────────┐
│                    FASTAPI SERVER (Port 8000)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           MIDDLEWARE STACK                              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Rate Limiter (slowapi)                                │   │
│  │ • CORS Handler (CORSMiddleware)                         │   │
│  │ • GZip Compression (GZipMiddleware)                     │   │
│  │ • Security Headers (Custom)                            │   │
│  │ • Request Logging (Custom)                             │   │
│  │ • Error Handler (Custom)                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │           ROUTE HANDLERS                                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │  POST /api/analyze/full-report                ★ MAIN   │   │
│  │  POST /api/soil-fertility                              │   │
│  │  POST /api/weather-risk                                │   │
│  │  POST /api/crop-recommendation                         │   │
│  │  POST /api/yield-prediction                            │   │
│  │  POST /api/fertilizer-advisory                         │   │
│  │  POST /api/chat                                        │   │
│  │  GET /health                                           │   │
│  │                                                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │    INPUT VALIDATION (Pydantic)                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Type Checking        • Range Validation               │   │
│  │ • Required Fields      • Error Messages                │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                     Python │ Services
                            │
```

### Tier 3: Business Logic Layer

```
┌──────────────────────────────────────────────────────────────────┐
│              SERVICES & PREDICTION ENGINE                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PredictionService                                        │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │ Soil        │  │ Weather     │  │ Crop        │      │  │
│  │  │ Fertility   │→ │ Risk        │→ │ Recommend   │      │  │
│  │  │ Analyzer    │  │ Predictor   │  │ Engine      │      │  │
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘      │  │
│  │                                           │             │  │
│  │                              ┌────────────▼──────────┐  │  │
│  │                              │ (Recommended Crop)    │  │  │
│  │                              │       ↓               │  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │  │
│  │  │ Fertilizer  │←─│ Yield       │←─│ Chaining    │ │  │  │
│  │  │ Advisor     │  │ Predictor   │  │             │ │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ChatbotService                                           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ • Message Processing                                      │  │
│  │ • Intent Detection                                        │  │
│  │ • Context Management                                      │  │
│  │ • Gemini AI Integration (fallback: Rule-based)           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  WeatherService                                           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ • Fetch Live Weather (OpenWeatherMap)                    │  │
│  │ • Forecast 7-Day                                          │  │
│  │ • Location-based Auto-Fill                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │
```

### Tier 4: Data & Model Layer

```
┌──────────────────────────────────────────────────────────────────┐
│                    ML MODELS & DATA LAYER                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ML MODELS DIRECTORY                                            │
│  ├─ soil_fertility_model.pkl                                    │
│  ├─ soil_features.pkl                                           │
│  ├─ weather_risk_model.pkl                                      │
│  ├─ weather_label_encoder.pkl                                   │
│  ├─ crop_recommendation_model.pkl                               │
│  ├─ yield_model.pkl                                             │
│  ├─ yield_columns.pkl                                           │
│  ├─ fertilizer_model.pkl                                        │
│  ├─ fertilizer_label_encoder.pkl                                │
│  └─ fertilizer_columns.pkl                                      │
│                                                                  │
│  MODEL MANAGER                                                  │
│  ├─ Load All Models at Startup                                 │
│  ├─ Cache in Memory for Fast Access                            │
│  ├─ Fallback to Rule-based if Missing                          │
│  └─ Version Management                                         │
│                                                                  │
│  EXTERNAL SERVICES                                              │
│  ├─ OpenWeatherMap API (Live Weather)                          │
│  ├─ Google Gemini API (AI Chat)                                │
│  ├─ Browser APIs (Geolocation, Voice)                          │
│  └─ Browser Storage (LocalStorage, IndexedDB)                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Data Flow (Request → Response)

```
STEP 1: USER SUBMITS FORM
┌─────────────────────────────────────────┐
│ Farmer fills in:                        │
│ • Soil nutrients (N, P, K)              │
│ • Weather conditions                    │
│ • Farm details (location, area, type)   │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 2: CLIENT-SIDE PROCESSING
┌─────────────────────────────────────────┐
│ React Component:                        │
│ 1. Validate form inputs                 │
│ 2. Format data for API                  │
│ 3. Show loading spinner                 │
│ 4. Disable submit button                │
└────────────┬────────────────────────────┘
             │
             ▼ (HTTPS POST)
STEP 3: API GATEWAY
┌─────────────────────────────────────────┐
│ FastAPI Middleware:                     │
│ 1. Check CORS origin                    │
│ 2. Rate limit check                     │
│ 3. Security headers                     │
│ 4. Log request                          │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 4: INPUT VALIDATION
┌─────────────────────────────────────────┐
│ Pydantic Models:                        │
│ • Validate types                        │
│ • Check ranges                          │
│ • Verify required fields                │
│ → On Error: Return 422                  │
└────────────┬────────────────────────────┘
             │
             ▼ (Valid)
STEP 5: MODEL 1 - SOIL FERTILITY
┌─────────────────────────────────────────┐
│ Input: Nitrogen, Phosphorus, Potassium  │
│ Process:                                │
│ 1. Calculate average NPK                │
│ 2. Compare thresholds                   │
│ 3. Generate status (Fertile/Semi/etc)   │
│ 4. Create recommendation                │
│                                         │
│ Output:                                 │
│ {                                       │
│   status: "success",                    │
│   message: "Fertile Soil",              │
│   avg_nutrients: 58.33,                 │
│   recommendation: "Maintain levels"     │
│ }                                       │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 6: MODEL 2 - WEATHER RISK
┌─────────────────────────────────────────┐
│ Input: Month, Temperature               │
│ Process:                                │
│ 1. Load ML model                        │
│ 2. Create feature vector                │
│ 3. Predict risk category                │
│ 4. Fallback if model unavailable        │
│                                         │
│ Output:                                 │
│ {                                       │
│   label: "Normal Conditions",           │
│   recommendation: "Ideal for farming"   │
│ }                                       │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 7: MODEL 3 - CROP RECOMMENDATION ⭐
┌─────────────────────────────────────────┐
│ Input: All soil + weather data          │
│ Process:                                │
│ 1. Feature engineering                  │
│ 2. ML model prediction                  │
│ 3. Alternative crops                    │
│ 4. Confidence score                     │
│                                         │
│ Output: recommended_crop = "RICE"       │
│ (Used in STEP 8 & 9)                    │
└────────────┬────────────────────────────┘
             │
             ▼ (Uses crop from Step 7)
STEP 8: MODEL 4 - YIELD PREDICTION
┌─────────────────────────────────────────┐
│ Input: Crop (from Step 7), Area, etc   │
│ Process:                                │
│ 1. Get base yield for crop              │
│ 2. Apply weather factors                │
│ 3. Apply fertilizer factors             │
│ 4. Calculate market value               │
│                                         │
│ Output:                                 │
│ {                                       │
│   predicted_yield: 3.5,                 │
│   perHectare: 1.4,                      │
│   quality: "Good"                       │
│ }                                       │
└────────────┬────────────────────────────┘
             │
             ▼ (Uses crop from Step 7)
STEP 9: MODEL 5 - FERTILIZER ADVISORY
┌─────────────────────────────────────────┐
│ Input: Crop (Step 7), Soil Deficiencies │
│ Process:                                │
│ 1. Detect deficiencies (N,P,K)          │
│ 2. Primary deficiency determination     │
│ 3. Calculate dosage                     │
│ 4. Timing recommendations               │
│                                         │
│ Output:                                 │
│ {                                       │
│   fertilizer: "NPK",                    │
│   dosage: "20-30 kg/hectare",           │
│   timing: "Split application",          │
│   deficiencies: {                       │
│     nitrogen: false,                    │
│     phosphorous: false,                 │
│     potassium: false                    │
│   }                                     │
│ }                                       │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 10: REPORT ASSEMBLY
┌─────────────────────────────────────────┐
│ Combine all 5 model outputs:            │
│ • Soil result (Step 5)                  │
│ • Weather result (Step 6)               │
│ • Crop result (Step 7)                  │
│ • Yield result (Step 8)                 │
│ • Fertilizer result (Step 9)            │
│                                         │
│ Add metadata:                           │
│ • Timestamp                             │
│ • Summary verdict                       │
│ • Overall confidence score              │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 11: RESPONSE FORMATTING
┌─────────────────────────────────────────┐
│ Format as JSON:                         │
│ • Serialize all Pydantic models         │
│ • Add HTTP status code (200)            │
│ • Apply GZip compression                │
│ • Add security headers                  │
└────────────┬────────────────────────────┘
             │
             ▼ (HTTP 200 JSON)
STEP 12: CLIENT RECEIVES RESPONSE
┌─────────────────────────────────────────┐
│ React Component:                        │
│ 1. Parse JSON response                  │
│ 2. Update component state               │
│ 3. Hide loading spinner                 │
│ 4. Render report cards                  │
│ 5. Save to localStorage                 │
└────────────┬────────────────────────────┘
             │
             ▼
STEP 13: DISPLAY REPORT TO FARMER
┌─────────────────────────────────────────┐
│ UnifiedDashboard displays:              │
│ • Soil Health Card (🟢)                 │
│ • Weather Alert (⚠️)                     │
│ • Recommended Crop (🌾)                 │
│ • Yield Forecast (📊)                   │
│ • Fertilizer Plan (💧)                  │
│ • Confidence Score (92%)                │
│ • Action Items                          │
│ • Chat Widget for questions             │
└─────────────────────────────────────────┘
```

---

## 🔄 Component Interaction Flow

```
┌──────────────────┐
│ Farmer Submits   │
│ Form Data        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ UnifiedDashboard Component   │
│ State: formData, loading,    │
│        report, error         │
└────────┬─────────────────────┘
         │
         ├─→ Call getFullReport() API
         │
         ├─→ Update loading state
         │   (Show spinner)
         │
         ├─→ Backend processes
         │   (5 Models)
         │
         ├─→ Receive JSON response
         │
         ├─→ Update report state
         │   (Trigger re-render)
         │
         └─→ Display results

┌──────────────────────────────┐
│ ReportCard Components        │
│ • SoilCard                   │
│ • WeatherCard                │
│ • CropCard                   │
│ • YieldCard                  │
│ • FertilizerCard             │
└──────────────────────────────┘
         │
         ├─→ Props from parent report
         │
         ├─→ Format display data
         │
         └─→ Render with icons &
             recommendations

┌──────────────────────────────┐
│ ChatWidget Component         │
│ (Optional, below report)     │
└──────────────────────────────┘
         │
         └─→ Access report context
             (For smart chatbot)
```

---

## 🏗️ Key Architectural Patterns

### 1. Layered Architecture
```
Presentation (React)
    ↓
API Gateway (FastAPI)
    ↓
Business Logic (Services)
    ↓
Data Access (ML Models)
```

### 2. Service Pattern
```
Each service handles one domain:
├─ PredictionService (ML inference)
├─ ChatbotService (AI conversations)
├─ WeatherService (External data)
└─ FarmerService (User management)
```

### 3. Factory Pattern
```
get_model_manager()  → Singleton ModelManager
get_prediction_service() → Singleton PredictionService
get_chatbot_service()    → Singleton ChatbotService
```

### 4. Strategy Pattern
```
Prediction Strategies:
├─ Real ML Model (if available)
└─ Fallback Rule-based Logic (if model fails)
```

### 5. Middleware Pattern
```
Request → Middleware Stack → Route Handler → Response
├─ CORS Check
├─ Rate Limit Check
├─ Logging
├─ Security Headers
└─ Compression
```

---

## 💾 Data State Management

### Frontend (React)
```javascript
// Component State
const [formData, setFormData] = useState({...})
const [report, setReport] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [language, setLanguage] = useState('en')

// LocalStorage
localStorage.setItem('appLanguage', 'en')
localStorage.setItem('userProfile', JSON.stringify(farmer))
localStorage.setItem('savedReports', JSON.stringify([...]))
```

### Backend (Python)
```python
# In-Memory Caching
model_manager = ModelManager()  # Singleton with loaded models
prediction_service = PredictionService()  # Access via get_prediction_service()

# Request Processing
input_data = FullReportRequest(...)  # Pydantic validation
result = prediction_service.predict_soil_fertility(...)  # Get prediction
response = {...}  # Format response
```

---

## 🔐 Security Features

```
1. INPUT VALIDATION
   ├─ Pydantic type checking
   ├─ Range validation
   ├─ Required fields
   └─ Error messages

2. RATE LIMITING
   ├─ 100 requests/minute per IP (general)
   ├─ 10 requests/minute per IP (predictions)
   └─ 429 status code if exceeded

3. CORS PROTECTION
   ├─ Allow specific origins only
   ├─ Credentials allowed
   └─ Headers validation

4. SECURITY HEADERS
   ├─ X-Content-Type-Options: nosniff
   ├─ X-Frame-Options: DENY
   ├─ X-XSS-Protection: 1; mode=block
   └─ Strict-Transport-Security

5. HTTPS
   ├─ In production
   └─ TLS 1.2+

6. ENVIRONMENT VARIABLES
   ├─ API keys in .env
   ├─ Never in source code
   └─ .gitignore protection
```

---

## 📈 Scalability Considerations

```
Current Capacity:
├─ Single server: 100 requests/minute
└─ In-memory models: ~500MB

To Scale:

1. HORIZONTAL
   ├─ Load balancer (nginx)
   ├─ Multiple API instances
   └─ Shared model cache (Redis)

2. VERTICAL
   ├─ Larger server instance
   ├─ More CPU cores
   └─ More RAM for model cache

3. CACHING
   ├─ Redis for predictions
   ├─ CDN for static assets
   └─ Browser cache

4. DATABASE
   ├─ PostgreSQL (farmer data)
   ├─ MongoDB (predictions history)
   └─ Elasticsearch (analytics)
```

---

**This architecture provides:**
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable to production
- ✅ Resilient with fallbacks
- ✅ Secure and validated
- ✅ High performance and responsiveness
