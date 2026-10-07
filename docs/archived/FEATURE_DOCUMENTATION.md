# 🌾 AgroCrop AI - Feature Documentation

## Date: 2026-02-10

---

## 📋 Table of Contents
1. [Soil Fertility Assessment](#soil-fertility)
2. [Weather Intelligence](#weather-intelligence)
3. [Crop Recommendation](#crop-recommendation)
4. [Yield Prediction](#yield-prediction)
5. [Fertilizer Advisory](#fertilizer-advisory)
6. [Unified Dashboard](#unified-dashboard)
7. [AI Chatbot](#ai-chatbot)
8. [Settings & Bilingual Support](#settings)

---

## 🌱 1. Soil Fertility Assessment <a name="soil-fertility"></a>

### What It Does
Provides a **comprehensive soil health report** based on three key nutrient values (N, P, K).

### Inputs
| Parameter | Unit | Range | Description |
|-----------|------|-------|-------------|
| Nitrogen (N) | mg/kg | 0 - 140 | Essential for leaf growth |
| Phosphorus (P) | mg/kg | 0 - 140 | Important for root development |
| Potassium (K) | mg/kg | 0 - 200 | Provides disease resistance |

### Report Includes
- **Fertility Score** (0-100%) with status indicator
- **Individual Nutrient Analysis** — level, optimal range, recommendations
- **Yield Potential Forecast** — High / Medium / Low with estimates
- **Precautions** — warnings and urgencies based on soil condition
- **Actions for Optimal Growth** — 5 step-by-step actions
- **Fertilizer Recommendations** — specific products with dosage and timing

### API Endpoint
```
POST /api/soil-fertility/comprehensive
Body: { nitrogen: float, phosphorus: float, potassium: float }
```

---

## ☁️ 2. Weather Intelligence <a name="weather-intelligence"></a>

### What It Does
Provides **live weather data** from OpenWeatherMap API and **AI-powered weather risk forecasting**.

### Two Modes
1. **Live Weather (Automatic)**
   - Uses browser geolocation to detect user's location
   - Fetches real-time data from OpenWeatherMap API
   - Displays temperature, humidity, wind, pressure, visibility
   - Provides farming-specific advisory (risk level, irrigation, precautions)
   - Falls back to demo data if no API key configured

2. **Risk Analysis (Manual)**
   - User selects month (1-12) and temperature
   - AI model predicts flood/drought/normal conditions
   - Returns risk level, description, and recommendations

### API Endpoints
```
GET  /api/weather/live?lat=19.076&lon=72.8777
POST /api/weather-risk  { month: int, temperature: float }
```

### Required Setup
Set `OPENWEATHER_API_KEY` in `backend/.env` for live data. Mock data provided as fallback.

---

## 🌾 3. Crop Recommendation <a name="crop-recommendation"></a>

### What It Does
Recommends the best crop to grow based on soil composition and climate conditions.

### Inputs
| Parameter | Range | Description |
|-----------|-------|-------------|
| Nitrogen | 0-140 mg/kg | Soil N level |
| Phosphorus | 0-140 mg/kg | Soil P level |
| Potassium | 0-200 mg/kg | Soil K level |
| Temperature | 0-50°C | Average temp |
| Humidity | 0-100% | Average humidity |
| pH | 0-14 | Soil pH level |
| Rainfall | 0-300 mm | Annual rainfall |

### API Endpoint
```
POST /api/crop-recommendation
```

---

## 📊 4. Yield Prediction <a name="yield-prediction"></a>

### What It Does
Estimates crop yield (in tons) based on crop type, season, state, area, rainfall, and fertilizer usage.

### Inputs
| Parameter | Type | Description |
|-----------|------|-------------|
| Crop | String | e.g., Rice, Wheat, Maize |
| Season | Select | Kharif / Rabi / Whole Year |
| State | Select | Indian state |
| Area | Float | Farm area in hectares |
| Rainfall | Float | Expected annual rainfall (mm) |
| Fertilizer | Float | Total fertilizer (kg) |

### API Endpoint
```
POST /api/yield-prediction
```

---

## 💊 5. Fertilizer Advisory <a name="fertilizer-advisory"></a>

### What It Does
Prescribes specific fertilizer based on soil nutrients, climate, soil type, and crop type.

### Outputs
- Recommended fertilizer name with icon
- Detected nutrient deficiencies
- Usage instructions

### API Endpoint
```
POST /api/fertilizer-recommendation
```

---

## 📈 6. Unified Dashboard <a name="unified-dashboard"></a>

### What It Does
Allows farmers to input all farm data **once** and receive a comprehensive AI-generated report combining:
- Soil health analysis
- Weather risk assessment
- Crop recommendation
- Yield estimation
- Fertilizer advice

### API Endpoint
```
POST /api/analyze/full-report
```

---

## 🤖 7. AI Chatbot <a name="ai-chatbot"></a>

### What It Does
Context-aware AI assistant powered by **Google Gemini AI** that helps farmers with:
- Farm-related questions
- Interpreting analysis results
- General agriculture advice

### Features
| Feature | Description |
|---------|-------------|
| **Voice Input** | Speech-to-text in 5 languages |
| **Voice Output** | Text-to-speech auto-read responses |
| **Multilingual** | EN, HI, TE, TA, KN |
| **Context-Aware** | Knows about current soil/weather/crop data |
| **Quick Questions** | Pre-built farming questions |

### Two Interfaces
1. **Floating Widget** — Available on every page, context-aware
2. **Standalone Page** — Full-screen chat at `/chat`

### API Endpoint
```
POST /api/chat
Body: { message: string, language: string, context_data: object }
```

---

## ⚙️ 8. Settings & Bilingual Support <a name="settings"></a>

### Language Support
| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `hi` | Hindi | Devanagari |
| `te` | Telugu | Telugu |
| `ta` | Tamil | Tamil |
| `kn` | Kannada | Kannada |
| `mr` | Marathi | Devanagari |

### Settings Available
- **Language** — Changes entire app UI + chatbot language
- **Theme** — Light/Dark mode
- **Accessibility** — Large text, high contrast, remove animations
- **Farming Region** — Sets your region (shown in sidebar)

### How Language Settings Work
1. User changes language in navbar globe icon or settings page
2. `GlobalSettingsContext` updates and persists to `localStorage`
3. All pages, chatbot, and voice input/output adapt automatically
