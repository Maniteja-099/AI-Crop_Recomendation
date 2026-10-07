# AI-Driven Crop Recommendation & Growth Prediction System

## Comprehensive Technical Documentation

> **Version:** 2.0 | **Last Updated:** July 2025  
> **Tech Stack:** FastAPI 0.128.0 · React 19 · scikit-learn 1.8.0 · Gemini AI · OpenWeatherMap  
> **Test Suite:** 29/29 passing

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Backend Modules](#4-backend-modules)
   - 4.1 [main.py — FastAPI Application](#41-mainpy--fastapi-application)
   - 4.2 [services/prediction_service.py — ML Inference Engine](#42-servicesprediction_servicepy--ml-inference-engine)
   - 4.3 [services/chatbot_service.py — AI Chatbot Service](#43-serviceschatbot_servicepy--ai-chatbot-service)
   - 4.4 [services/weather_service.py — Weather Integration](#44-servicesweather_servicepy--weather-integration)
   - 4.5 [ml_models/model_manager.py — Model Loading Singleton](#45-ml_modelsmodel_managerpy--model-loading-singleton)
   - 4.6 [models/prediction.py — Pydantic Data Models](#46-modelspredictionpy--pydantic-data-models)
   - 4.7 [models/chat.py — Chat Data Models](#47-modelschatpy--chat-data-models)
   - 4.8 [config/data_ranges.py — Data Configuration](#48-configdata_rangespy--data-configuration)
5. [ML Training Scripts](#5-ml-training-scripts)
6. [Trained Models Inventory](#6-trained-models-inventory)
7. [API Reference](#7-api-reference)
8. [Frontend Modules](#8-frontend-modules)
   - 8.1 [App.js — Root Component & Routing](#81-appjs--root-component--routing)
   - 8.2 [Pages](#82-pages)
   - 8.3 [Components](#83-components)
   - 8.4 [API Clients](#84-api-clients)
   - 8.5 [Context Providers](#85-context-providers)
   - 8.6 [Custom Hooks](#86-custom-hooks)
   - 8.7 [Internationalization (i18n)](#87-internationalization-i18n)
9. [Data Files](#9-data-files)
10. [Testing](#10-testing)
11. [Configuration & Environment](#11-configuration--environment)
12. [Deployment](#12-deployment)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (React 19)                   │
│   App.js → React Router → 10 Pages → MUI + Tailwind UI         │
│   Context: GlobalSettings (language, accessibility, region)     │
│   API Layer: client.js (Axios) → backend:8000                   │
│   i18n: 5 languages (en/hi/te/ta/kn), 1,463 lines              │
│   PWA: Service Worker + Offline Indicator                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP REST (JSON)
┌───────────────────────────▼─────────────────────────────────────┐
│                    FASTAPI BACKEND (0.128.0)                     │
│   main.py → 9 REST endpoints (CORS-enabled)                     │
│   ├── PredictionService — 5 ML predictions + rule-based fallback│
│   ├── ChatbotService — Gemini AI + FAQ KB + 50+ languages       │
│   ├── WeatherService — OpenWeatherMap API + seasonal fallback   │
│   └── ModelManager — Singleton loader for 11 .pkl model files   │
│   Validation: Pydantic v2 models  |  Translation: deep-translator│
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    ML MODELS (trained_models/)                   │
│   14 serialised .pkl files  (scikit-learn 1.8.0 + XGBoost)      │
│   Trained on 4 CSV datasets (96,223 total rows)                 │
│   Modules: Soil · Weather · Crop · Yield · Fertilizer           │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow (Example: Full Report)

1. User fills form on `UnifiedDashboard.js` → clicks **Analyse**
2. `client.js` sends `POST /api/analyze/full-report` with NPK, pH, temp, humidity, rainfall, month, area, state, season, language
3. `main.py` validates via `FullReportRequest` (Pydantic)
4. `PredictionService` runs 5 predictions in sequence:  
   Soil Fertility → Weather Risk → Crop Recommendation → Yield Prediction → Fertilizer Advisory
5. If `language != "en"`, results are translated via `deep-translator` (Google Translate) with parallel `asyncio.gather`
6. 200 JSON response → frontend renders in 5 dashboard cards

---

## 2. Tech Stack & Dependencies

### Backend (Python 3.13+)

| Package | Version | Purpose |
|---|---|---|
| **fastapi** | 0.128.0 | ASGI web framework with auto-generated OpenAPI docs |
| **uvicorn[standard]** | 0.40.0 | High-performance ASGI server |
| **pydantic** | 2.12.5 | Data validation and settings management |
| **python-multipart** | 0.0.20 | File upload support |
| **python-dotenv** | 1.2.1 | `.env` file loading |
| **pandas** | 2.3.3 | DataFrame operations for ML pipelines |
| **numpy** | 2.4.1 | Numerical array computations |
| **scikit-learn** | 1.8.0 | ML model training and inference |
| **joblib** | 1.5.3 | Model serialization (.pkl) |
| **xgboost** | 3.1.3 | Gradient boosting for weather risk model |
| **requests** | 2.32.3 | Synchronous HTTP client |
| **httpx** | ≥0.27.0 | Async HTTP client (OpenWeatherMap) |
| **google-generativeai** | ≥0.8.0 | Google Gemini AI chatbot |
| **deep-translator** | 1.11.4 | Multi-language translation (50+ languages) |
| **slowapi** | ≥0.1.9 | API rate limiting |
| **pytest** | 9.0.2 | Test framework |
| **pytest-asyncio** | 1.3.0 | Async test support |

### Frontend (Node.js)

| Package | Version | Purpose |
|---|---|---|
| **react** | ^19.2.3 | UI component framework |
| **react-dom** | ^19.2.3 | DOM renderer |
| **react-router-dom** | ^7.12.0 | Client-side SPA routing |
| **react-scripts** | 5.0.1 | Create React App toolchain |
| **axios** | ^1.13.2 | HTTP client for API calls |
| **@mui/material** | ^7.3.7 | Material UI component library |
| **@mui/icons-material** | ^7.3.7 | Material UI icon set |
| **@emotion/react** | ^11.14.0 | CSS-in-JS (MUI dependency) |
| **tailwindcss** | ^3.4.1 | Utility-first CSS framework |
| **@headlessui/react** | ^1.7.17 | Unstyled accessible UI components |
| **@heroicons/react** | ^2.0.18 | Heroicons SVG icons |
| **lucide-react** | ^0.294.0 | Lucide icon library |
| **clsx** | ^2.0.0 | Conditional classname utility |

---

## 3. Project Structure

```
MiniProject/
├── backend/
│   ├── main.py                          # FastAPI app — all 9 endpoints
│   ├── requirements.txt                 # Python dependencies
│   ├── pytest.ini                       # Test configuration
│   ├── .env                             # API keys (not committed)
│   ├── api/                             # API route modules (unused — all in main.py)
│   ├── config/
│   │   └── data_ranges.py               # Dataset-derived constants (490 lines)
│   ├── ml_models/
│   │   ├── __init__.py
│   │   └── model_manager.py             # Singleton model loader (119 lines)
│   ├── models/
│   │   ├── prediction.py                # Pydantic input/output models (186 lines)
│   │   └── chat.py                      # Chat request/response models
│   ├── services/
│   │   ├── prediction_service.py        # ML inference engine (800 lines)
│   │   ├── chatbot_service.py           # AI chatbot (501 lines)
│   │   └── weather_service.py           # OpenWeatherMap integration (269 lines)
│   ├── scripts/
│   │   ├── module1__soil.py             # Train soil fertility model
│   │   ├── module2_weather.py           # Train weather risk model
│   │   ├── module3_crop.py              # Train crop recommendation model
│   │   ├── module4_yield.py             # Train yield prediction model
│   │   ├── module5_fertilizer.py        # Train fertilizer model
│   │   ├── train_ml_models.py           # Master training script
│   │   └── quick_test.py               # Quick validation
│   ├── trained_models/                  # 14 .pkl model files
│   ├── tests/
│   │   ├── test_api.py                  # API endpoint tests (6 tests)
│   │   ├── test_chatbot_service.py      # Chatbot service tests (5 tests)
│   │   ├── test_data_integration.py     # Data integration tests (7 tests)
│   │   ├── test_endpoints.py            # Endpoint tests (4 tests)
│   │   ├── test_prediction_service.py   # Prediction service tests (7 tests)
│   │   └── archived/                    # Legacy test scripts (excluded from pytest)
│   └── logs/                            # Runtime logs
│
├── Frontend/
│   ├── package.json                     # Node dependencies
│   ├── tailwind.config.js               # Tailwind CSS config
│   ├── postcss.config.js                # PostCSS config
│   ├── public/
│   │   ├── index.html                   # HTML template (CSP + MetaMask suppression)
│   │   ├── manifest.json                # PWA manifest
│   │   └── service-worker.js            # Service worker for offline support
│   └── src/
│       ├── App.js                       # Root component + routing (78 lines)
│       ├── index.js                     # React entry point
│       ├── api/
│       │   └── client.js                # Primary Axios API client (217 lines)
│       ├── services/
│       │   ├── api.js                   # Secondary API service (141 lines)
│       │   └── GeolocationService.js    # Browser geolocation wrapper (269 lines)
│       ├── pages/
│       │   ├── ModernHome.js            # Landing page
│       │   ├── UnifiedDashboard.js      # Main farm analysis dashboard
│       │   ├── SoilFertility.js         # Soil fertility page
│       │   ├── WeatherIntelligence.js   # Live weather + risk analysis
│       │   ├── CropRecommendation.js    # Crop recommendation (415 lines)
│       │   ├── YieldPrediction.js       # Yield prediction
│       │   ├── FertilizerAdvisory.js    # Fertilizer advisory (308 lines)
│       │   ├── ChatbotPage.js           # Full chatbot page
│       │   └── FarmerFriendlySettings.js# Settings & preferences
│       ├── components/
│       │   ├── ModernNavbar.js          # Top navigation bar
│       │   ├── ModernSidebar.js         # Collapsible sidebar
│       │   ├── ChatWidget.js            # Floating chat widget
│       │   ├── AdvancedChatbot.js       # Full chatbot component
│       │   ├── LocationButton.js        # GPS location button
│       │   ├── GuidancePanel.js         # Contextual help panel
│       │   └── ui/                      # Reusable UI primitives
│       │       ├── FarmerButton.js
│       │       ├── FarmerCard.js
│       │       ├── FarmerInput.js
│       │       ├── FarmerSpinner.js
│       │       ├── LanguageSelector.js
│       │       └── ModernComponents.js
│       ├── context/
│       │   └── GlobalSettingsContext.js  # Global settings provider (227 lines)
│       ├── store/
│       │   └── AppContext.js            # App state context
│       ├── hooks/
│       │   ├── useGeolocation.js        # GPS location hook
│       │   ├── usePrediction.js         # Prediction API hook
│       │   ├── useSettings.js           # Settings hook
│       │   ├── useTranslation.js        # Translation hook
│       │   ├── useVoice.js              # Voice I/O hook
│       │   └── useWeather.js            # Weather data hook
│       └── i18n/
│           └── translations.js          # i18n file (1,463 lines, 5 languages)
│
├── data/
│   ├── soil_fertility.csv               # 101 rows — soil NPK classification
│   ├── Crop_recommendation.csv          # 2,202 rows — crop recommendation
│   ├── daily_weather.csv                # 91,322 rows — daily weather history
│   └── Crop Yiled.csv                   # 2,598 rows — crop yield data
│
├── docs/                                # Project documentation
├── scripts/                             # Root-level utility scripts
├── health_check.py                      # System health check script
└── README.md                            # Project README
```

---

## 4. Backend Modules

### 4.1 `main.py` — FastAPI Application

**Path:** `backend/main.py` | **Lines:** ~660 | **Role:** Application entry point and API router

This is the central FastAPI application. It initialises all services, configures CORS, and defines 9 REST endpoints.

#### Key Sections

| Lines | Section | Description |
|---|---|---|
| 1–30 | **Imports & Setup** | Imports FastAPI, Pydantic models, services; suppresses sklearn warnings |
| 31–50 | **App Initialisation** | Creates FastAPI instance, configures CORS for `localhost:3000` |
| 51–80 | **Service Singletons** | Initialises `PredictionService`, `ModelManager`, `ChatbotService` |
| 81–100 | **Pydantic Models** | `FullReportRequest` (unified input), `ChatRequestApi` (chat input) |
| 101–130 | **Root & Health** | `GET /` returns welcome + status; `GET /api/health` returns service status |
| 131–380 | **`POST /api/analyze/full-report`** | Unified pipeline: validates input → 5 predictions → optional translation → JSON response. Uses `asyncio.gather` for parallel translation of 4 text fields. Returns soil, weather, crop, yield, fertilizer results + overall score + summary |
| 381–401 | **Soil & Yield** | `POST /api/soil-fertility/comprehensive`, `POST /api/yield-prediction` — standalone endpoints |
| 402–425 | **Crop Recommendation** | `POST /api/crop-recommendation` — takes 7 params (N, P, K, temp, humidity, pH, rainfall), returns recommended crop, confidence, conditions, icon |
| 426–460 | **Fertilizer Recommendation** | `POST /api/fertilizer-recommendation` — takes NPK + temp/humidity/moisture/soil/crop, returns fertilizer + deficiencies + analysis |
| 461–475 | **Weather Risk** | `POST /api/weather-risk` — month + temperature → flood/drought/normal |
| 476–600 | **Live Weather** | `GET /api/weather/live?lat=&lon=` — async endpoint using `httpx` to call OpenWeatherMap API. Returns structured `{ source, location, current, farming_advisory, timestamp }`. Falls back to seasonal mock when API unavailable |
| 601–660 | **Chatbot** | `POST /api/chat` — bridges frontend to `ChatbotService.process_message()`. Handles both `message` and `reply` response fields |

#### CORS Configuration

```python
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
allow_methods=["*"]
allow_headers=["*"]
allow_credentials=True
```

---

### 4.2 `services/prediction_service.py` — ML Inference Engine

**Path:** `backend/services/prediction_service.py` | **Lines:** ~800 | **Role:** All ML model predictions

The PredictionService class provides 5 prediction methods. Each method first attempts ML model inference, then falls back to a rule-based expert system if the model is unavailable.

#### Class: `PredictionService`

**Pattern:** Singleton via `get_prediction_service()` factory.

**Class-Level Data:**

| Attribute | Description |
|---|---|
| `CROP_DATABASE` | Dict of 8 crop profiles: rice, wheat, maize, cotton, sugarcane, pulses, groundnut, soybean. Each has icon, conditions list, growing tips |
| `FERTILIZER_DATABASE` | Dict of 5 fertilizer types with icons, application methods, timing |

**Methods:**

| Method | Input | Output | ML Model | Fallback |
|---|---|---|---|---|
| `predict_soil_fertility()` | `SoilInput` (N, P, K) | `SoilResult` | `soil_model` (RandomForestClassifier) | NPK threshold classification from soil_fertility.csv percentiles |
| `predict_weather_risk()` | `WeatherInput` (month, temperature) | `WeatherResult` | `weather_model` (XGBoost) | Temperature threshold rules (>40°C = Drought, <10°C + monsoon = Flood) |
| `predict_crop()` | `CropInput` (N, P, K, temp, humidity, pH, rainfall) | `CropResult` | `crop_model` (RandomForestClassifier) + `crop_scaler` (StandardScaler) | Multi-crop profile scoring across 5 crops × 7 features |
| `predict_yield()` | `YieldInput` (crop, season, state, area, rainfall, fertilizer) | `YieldResult` | `yield_model` (RandomForestRegressor) | Calibrated formula: base_yield × crop_factor × state_factor × season_factor |
| `predict_fertilizer()` | `FertilizerInput` (N, P, K, temp, humidity, moisture, soil, crop) | `FertilizerResult` | `fert_model` (RandomForestClassifier) + `fert_encoder` (LabelEncoder) | NPK deficit analysis → Urea/DAP/MOP/NPK selection |

**Crop Prediction Pipeline (detailed):**

1. Load `crop_model` and `crop_scaler` from ModelManager
2. Build feature array: `[N, P, K, temperature, humidity, ph, rainfall]`
3. Scale features: `scaler.transform(features)`
4. Predict: `model.predict(scaled_features)` → crop name
5. Look up crop in `CROP_DATABASE` for icon, conditions, tips
6. Calculate confidence score based on input parameter quality
7. Return `CropResult` with recommended_crop, confidence, conditions, icon

**Fertilizer Prediction Pipeline (detailed):**

1. Calculate NPK deficits against dataset thresholds (25th percentile: N=14, P=10, K=4)
2. Attempt ML model prediction (one-hot encode soil_type and crop_type, align with training columns)
3. If ML fails: rule-based selection (highest deficit → Urea/DAP/MOP/NPK)
4. Return `FertilizerResult` with fertilizer name, deficiencies dict, deficiency_analysis, application rate

---

### 4.3 `services/chatbot_service.py` — AI Chatbot Service

**Path:** `backend/services/chatbot_service.py` | **Lines:** 501 | **Role:** Multilingual agricultural AI chatbot

#### Class: `ChatbotService`

**Pipeline:** Translate → Understand → Respond → Translate Back

1. **Input Translation:** If `language != "en"`, translate user message to English using `deep-translator`
2. **Intent Detection:** Try Gemini AI → FAQ matching → keyword-based intent fallback
3. **Response Generation:** Best match from Gemini, FAQ, or template
4. **Output Translation:** Translate response back to user's language

**Key Attributes:**

| Attribute | Description |
|---|---|
| `SUPPORTED_LANGUAGES` | 50+ language codes → names (Indian, European, Asian, Middle Eastern, African languages) |
| `FAQ_KB` | 30+ farming FAQ entries covering rice, wheat, cotton, maize, sugarcane, vegetables, soil, irrigation, organic farming, pest control, government schemes |
| `INTENT_BASE` | Intent detection rules: greeting, weather, market, soil, crop, water, disease, organic |
| `QUICK_ACTIONS` | Quick action buttons: "🌾 Check Soil", "🌤 Weather", "🌱 Recommend Crop" |

**Methods:**

| Method | Description |
|---|---|
| `process_message(ChatRequest)` | Main async pipeline — returns `ChatResponse` with message, language, quick actions |
| `_query_gemini(prompt)` | Calls Google Gemini AI with agricultural system prompt |
| `_find_faq_match(query)` | Scores FAQs using word overlap + substring + phrase matching |
| `_detect_intent_from_keywords(query)` | Keyword-based intent classification |
| `_clean_for_tts(text)` | Strips emojis for clean text-to-speech output |
| `_translate_text(text, from_lang, to_lang)` | Translates via deep-translator with error handling |

---

### 4.4 `services/weather_service.py` — Weather Integration

**Path:** `backend/services/weather_service.py` | **Lines:** 269 | **Role:** OpenWeatherMap API integration

#### Class: `WeatherService`

**Key Attributes:**

| Attribute | Description |
|---|---|
| `STATE_COORDINATES` | GPS coordinates for 16 Indian state capitals (Andhra Pradesh through West Bengal) |

**Methods:**

| Method | Description |
|---|---|
| `get_weather_by_coordinates(lat, lon)` | Async OpenWeatherMap API call with 30-minute LRU caching |
| `get_weather_by_state(state)` | Looks up coordinates then calls `get_weather_by_coordinates()` |
| `_parse_weather_response(data)` | Parses raw OWM JSON into structured dict |
| `_get_fallback_weather(lat, lon)` | Seasonal mock data (monsoon/summer/winter variations) |
| `get_farming_advice_from_weather(data)` | Generates irrigation, pest, harvest, and general farming advice |

> **Note:** The `/api/weather/live` endpoint in `main.py` has its own inline OpenWeatherMap integration (with `httpx`) separate from this service class. Both produce the same structured output format.

---

### 4.5 `ml_models/model_manager.py` — Model Loading Singleton

**Path:** `backend/ml_models/model_manager.py` | **Lines:** 119 | **Role:** Lazy-load all ML models once

#### Class: `ModelManager`

**Pattern:** Singleton via `__new__` method.

**Models Loaded:**

| Key | File | Format | Purpose |
|---|---|---|---|
| `soil_model` | `soil_fertility_model.pkl` | RandomForestClassifier | Soil fertility classification |
| `soil_features` | `soil_features.pkl` | list | Feature name order for soil model |
| `weather_model` | `weather_risk_model.pkl` | XGBoost Classifier | Weather risk prediction |
| `weather_encoder` | `weather_label_encoder.pkl` | LabelEncoder | Weather class labels |
| `crop_model` | `crop_recommendation_model.pkl` | RandomForestClassifier | Crop recommendation |
| `crop_scaler` | `crop_scaler.pkl` | StandardScaler | Feature scaler for crop model |
| `yield_model` | `yield_model.pkl` | RandomForestRegressor | Yield prediction |
| `yield_cols` | `yield_columns.pkl` | list | Column order for yield model |
| `fert_model` | `fertilizer_model.pkl` | RandomForestClassifier | Fertilizer recommendation |
| `fert_encoder` | `fertilizer_label_encoder.pkl` | LabelEncoder | Fertilizer type labels |
| `fert_cols` | `fertilizer_columns.pkl` | list | Column order for fertilizer model |

**Methods:**

| Method | Description |
|---|---|
| `_load_models()` | Loads all 11 .pkl files from `trained_models/`, prints status for each |
| `get_model(key)` | Returns loaded model object or `None` |
| `has_model(key)` | Boolean check if model loaded successfully |
| `is_mock_mode()` | `True` if zero models loaded |
| `get_status()` | Returns dict with loaded count, total, model list |

---

### 4.6 `models/prediction.py` — Pydantic Data Models

**Path:** `backend/models/prediction.py` | **Lines:** 186 | **Role:** Request/response validation

| Model | Type | Fields | Validation |
|---|---|---|---|
| `Season` | Enum | Kharif, Rabi, Zaid, Whole Year | — |
| `SoilInput` | Input | nitrogen, phosphorus, potassium (0–200/300) | Auto-round to 2 decimals |
| `SoilResult` | Output | status, message, description, icon, avg_nutrients, recommendation, detailed_analysis | — |
| `WeatherInput` | Input | month (1–12), temperature (-10–60), optional humidity/rainfall/lat/lon | — |
| `WeatherResult` | Output | status, label, description, icon, recommendation, risk_level, live_weather | — |
| `CropInput` | Input | N, P, K (0–200), temp (-10–60), humidity (0–100), pH (0–14), rainfall (0–500) | pH auto-normalisation (>14 → /10) |
| `CropResult` | Output | recommended_crop, icon, ideal_conditions, confidence, alternatives, tips | — |
| `YieldInput` | Input | crop, season (Enum), state, area, rainfall, fertilizer | — |
| `YieldResult` | Output | predicted_yield, yield_per_hectare, unit, confidence, market_value, recommendations | — |
| `FertilizerInput` | Input | temp, humidity, moisture, soil_type, crop_type, N/P/K | — |
| `FertilizerResult` | Output | recommended_fertilizer, icon, method, dosage, timing, warnings, deficiencies, deficiency_analysis | — |
| `UnifiedAnalysisInput` | Input | All fields combined (NPK, pH, weather, yield params) | — |
| `UnifiedAnalysisResult` | Output | 5 analysis results + overall score + summary + action_items + data_sources | — |

---

### 4.7 `models/chat.py` — Chat Data Models

**Path:** `backend/models/chat.py` | **Role:** Chat request/response validation

| Model | Fields |
|---|---|
| `ChatRequest` | message, language (default "en"), context_data (optional dict) |
| `ChatResponse` | message, language, success, quick_actions (list of QuickAction) |
| `QuickAction` | label, query |

---

### 4.8 `config/data_ranges.py` — Data Configuration

**Path:** `backend/config/data_ranges.py` | **Lines:** 490 | **Role:** Dataset-derived constants

All thresholds and ranges in this file are extracted from the actual training CSV datasets, not hardcoded guesses.

| Export | Description |
|---|---|
| `SOIL_DATA_RANGES` | NPK/temp/humidity/moisture ranges from soil_fertility.csv |
| `SOIL_FERTILITY_THRESHOLDS` | Low/Medium/High classification (25th/75th percentile) |
| `CROP_DATA_RANGES` | 7-feature ranges from Crop_recommendation.csv |
| `RECOMMENDED_CROPS` | Primary crop profiles |
| `WEATHER_DATA_RANGES` | Temp/precip/wind from daily_weather.csv (91,322 rows) |
| `WEATHER_RISK_THRESHOLDS` | Optimal/Moderate/High risk classification |
| `SEASONAL_PATTERNS` | Kharif/Rabi/Zaid month ranges and crop lists |
| `YIELD_DATA_RANGES` | Yield data ranges from Crop Yield.csv |
| `YIELD_PREDICTION_MODEL` | Calibrated coefficients (base_yield=8.5) |
| `FERTILIZER_TYPES` | 7 fertilizer types with NPK ratios, application rates |
| `FERTILIZER_RECOMMENDATION_RULES` | 6 rule-based selection strategies |
| `REPORT_VALIDATION_RANGES` | Cross-dataset validation boundaries |

**Helper Functions:**

| Function | Description |
|---|---|
| `is_within_range(value, min, max)` | Boolean range check |
| `get_percentile_category(value, low, high)` | Returns "Low" / "Medium" / "High" |
| `validate_input_against_dataset(inputs)` | Validates inputs with warning list |

---

## 5. ML Training Scripts

**Location:** `backend/scripts/`

| Script | Model Output | Training Data | Algorithm |
|---|---|---|---|
| `module1__soil.py` | `soil_fertility_model.pkl`, `soil_features.pkl` | `soil_fertility.csv` (101 rows) | RandomForestClassifier |
| `module2_weather.py` | `weather_risk_model.pkl`, `weather_label_encoder.pkl` | `daily_weather.csv` (91,322 rows) | XGBoost Classifier |
| `module3_crop.py` | `crop_recommendation_model.pkl`, `crop_scaler.pkl` | `Crop_recommendation.csv` (2,202 rows) | RandomForestClassifier + StandardScaler |
| `module4_yield.py` | `yield_model.pkl`, `yield_columns.pkl` | `Crop Yiled.csv` (2,598 rows) | RandomForestRegressor |
| `module5_fertilizer.py` | `fertilizer_model.pkl`, `fertilizer_label_encoder.pkl`, `fertilizer_columns.pkl` | `soil_fertility.csv` (101 rows cross-referenced) | RandomForestClassifier |
| `train_ml_models.py` | Runs all 5 modules | All datasets | Master training orchestrator |

**To retrain all models:**

```bash
cd backend
python scripts/train_ml_models.py
```

---

## 6. Trained Models Inventory

**Location:** `backend/trained_models/`

| File | Size | sklearn Version | Type |
|---|---|---|---|
| `soil_fertility_model.pkl` | ~50 KB | 1.8.0 | RandomForestClassifier |
| `soil_features.pkl` | ~1 KB | — | Python list |
| `soil_scaler.pkl` | ~2 KB | 1.8.0 | StandardScaler |
| `weather_risk_model.pkl` | ~200 KB | — | XGBoost |
| `weather_label_encoder.pkl` | ~1 KB | 1.8.0 | LabelEncoder |
| `crop_recommendation_model.pkl` | ~500 KB | 1.8.0 | RandomForestClassifier |
| `crop_scaler.pkl` | ~2 KB | 1.8.0 | StandardScaler |
| `yield_model.pkl` | ~300 KB | 1.8.0 | RandomForestRegressor |
| `yield_columns.pkl` | ~1 KB | — | Python list |
| `yield_scaler.pkl` | ~2 KB | 1.8.0 | StandardScaler |
| `fertilizer_model.pkl` | ~100 KB | 1.8.0 | RandomForestClassifier |
| `fertilizer_label_encoder.pkl` | ~1 KB | 1.8.0 | LabelEncoder |
| `fertilizer_columns.pkl` | ~1 KB | — | Python list |
| `fertilizer_scaler.pkl` | ~2 KB | 1.8.0 | StandardScaler |

> **Important:** All models must be trained with the same scikit-learn version used at runtime (1.8.0). Version mismatch causes `ModuleNotFoundError`.

---

## 7. API Reference

### `POST /api/analyze/full-report`

**Description:** Unified farm analysis — runs all 5 ML predictions and optionally translates results.

**Request Body:**

```json
{
  "nitrogen": 90, "phosphorus": 40, "potassium": 40,
  "ph": 6.5, "temperature": 25, "humidity": 80,
  "rainfall": 200, "month": 6, "area": 2.0,
  "state": "Karnataka", "season": "Kharif",
  "soil_type": "Loamy", "language": "en"
}
```

**Response (200):**

```json
{
  "soil_fertility": { "status": "Fertile", "message": "...", "icon": "🌱", "recommendation": "..." },
  "weather_risk": { "status": "✅ Normal", "label": "Normal", "icon": "☀️", "recommendation": "..." },
  "crop_recommendation": { "recommended_crop": "Rice", "confidence": 0.92, "icon": "🌾", "conditions": [...] },
  "yield_prediction": { "predicted_yield": 17.5, "unit": "tonnes", "currency": "INR", "market_value": 385000 },
  "fertilizer_recommendations": [{ "recommendation": "Urea: 150-170 kg/hectare", "icon": "🔵" }],
  "overall_score": 78,
  "summary": "Your farm shows good potential...",
  "action_items": ["Apply recommended fertilizers", "Monitor weather patterns"]
}
```

---

### `POST /api/crop-recommendation`

**Request:** `{ nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall }`

**Response:** `{ recommended_crop, confidence, conditions, icon }`

---

### `POST /api/fertilizer-recommendation`

**Request:** `{ nitrogen, phosphorus, potassium, temperature, humidity, moisture, soil_type, crop_type }`

**Response:** `{ recommended_fertilizer, application_rate, icon, use, deficiencies, deficiency_analysis }`

---

### `GET /api/weather/live?lat={lat}&lon={lon}`

**Response:**

```json
{
  "source": "openweathermap",
  "location": { "city": "Bengaluru", "lat": 12.97, "lon": 77.59 },
  "current": {
    "temperature": 28.5, "feels_like": 30.1, "humidity": 65,
    "wind_speed": 8.2, "wind_direction": "SW",
    "pressure": 1012, "visibility": 10000,
    "description": "Scattered Clouds", "icon": "☁️"
  },
  "farming_advisory": {
    "risk_level": "low",
    "advisory": "Optimal growing conditions for most crops.",
    "irrigation": "Standard irrigation schedule.",
    "precautions": ["Regular crop monitoring", "Follow seasonal best practices"]
  },
  "timestamp": "2025-07-12T10:30:00"
}
```

---

### `POST /api/chat`

**Request:** `{ message, language, context_data }`

**Response:** `{ reply, language, success, quick_actions }`

---

### `POST /api/soil-fertility/comprehensive`

**Request:** `{ nitrogen, phosphorus, potassium }`

**Response:** Full soil report with status, NPK analysis, detailed fertilizer recommendations.

---

### `POST /api/yield-prediction`

**Request:** `{ crop, season, state, area, rainfall, fertilizer }`

**Response:** `{ predicted_yield, yield_per_hectare, unit, currency, market_value }`

---

### `POST /api/weather-risk`

**Request:** `{ month, temperature }`

**Response:** `{ status, label, description, icon, recommendation, risk_level }`

---

### `GET /api/health`

**Response:** `{ status: "healthy", models_loaded, timestamp }`

---

## 8. Frontend Modules

### 8.1 `App.js` — Root Component & Routing

**Path:** `Frontend/src/App.js` | **Lines:** 78

Sets up:
- `GlobalSettingsProvider` — wraps entire app with language/accessibility context
- `AppProvider` — app state context
- `BrowserRouter` — client-side routing
- Layout: `ModernNavbar` (top) + `ModernSidebar` (left) + page content (right) + `ChatWidget` (floating)
- 10 routes (see table below)

### 8.2 Pages

| Page | Route | Description | API Used |
|---|---|---|---|
| `ModernHome.js` | `/`, `/home` | Hero section, feature cards, call-to-action | None |
| `UnifiedDashboard.js` | `/dashboard` | Full farm analysis form → 5-module results | `POST /api/analyze/full-report` |
| `SoilFertility.js` | `/soil-fertility` | NPK slider input → soil health report | `POST /api/soil-fertility/comprehensive` |
| `WeatherIntelligence.js` | `/weather` | Live weather (auto-detected location) + risk analysis form | `GET /api/weather/live`, `POST /api/weather-risk` |
| `CropRecommendation.js` | `/crop-recommendation` | 7-parameter form → best crop recommendation | `POST /api/crop-recommendation` |
| `YieldPrediction.js` | `/yield-prediction` | Crop/season/state/area → yield forecast + market value | `POST /api/yield-prediction` |
| `FertilizerAdvisory.js` | `/fertilizer` | NPK + soil/crop type → fertilizer prescription with deficiency alerts | `POST /api/fertilizer-recommendation` |
| `ChatbotPage.js` | `/chat` | Full-page chatbot with message history and quick actions | `POST /api/chat` |
| `FarmerFriendlySettings.js` | `/settings` | Language selector (50+), accessibility toggles, farming region | None (localStorage) |

#### WeatherIntelligence.js — Detailed

1. On mount, requests browser geolocation permission
2. Calls `GET /api/weather/live` with GPS coordinates (fallback: Mumbai 19.076, 72.8777)
3. Displays: temperature, humidity, wind, pressure, visibility, description, farming advisory
4. Separate risk analysis form: month slider + temperature → `POST /api/weather-risk`
5. Duplicate request guard: `useRef(fetchInProgress)` prevents double calls in React StrictMode

#### CropRecommendation.js — Detailed

1. Form with 7 inputs: N, P, K, Temperature, Humidity, pH, Rainfall
2. Calls `POST /api/crop-recommendation`
3. Displays: recommended crop + icon, confidence percentage, growing conditions, tips
4. Full bilingual support via `useGlobalSettings()` + `getTranslation()`

#### FertilizerAdvisory.js — Detailed

1. Form with 7 inputs: N, P, K, Temperature, Humidity, Soil Type (dropdown), Crop Type (dropdown)
2. Calls `POST /api/fertilizer-recommendation`
3. Displays: fertilizer name + icon, deficiency alerts (N/P/K), application guidance
4. Reference grid showing 6 common fertilizers with descriptions
5. Contextual ChatWidget appears after results

---

### 8.3 Components

| Component | Description |
|---|---|
| `ModernNavbar.js` | Top navigation bar with language selector, breadcrumbs, mobile responsive |
| `ModernSidebar.js` | Collapsible left sidebar with route links, icons, active state |
| `ChatWidget.js` | Floating bottom-right chat bubble. Opens AdvancedChatbot in a dialog |
| `AdvancedChatbot.js` | Full-featured chatbot: message list, input field, quick action buttons, language support |
| `LocationButton.js` | Single-click GPS location detection with loading state |
| `GuidancePanel.js` | Contextual tooltips and help text for forms |
| `FarmerFriendlyCard.js` | Styled card with farmer-oriented language |
| `SimplerForm.js` | Simplified form with fewer inputs for casual users |

**UI Primitives (`components/ui/`):**

| Component | Description |
|---|---|
| `FarmerButton.js` | Large, accessible button with icon support |
| `FarmerCard.js` | Card with seasonal colour themes |
| `FarmerInput.js` | Input with labels, validation, and helper text |
| `FarmerSpinner.js` | Agricultural-themed loading animation |
| `LanguageSelector.js` | Language dropdown with flag emojis |
| `ModernComponents.js` | Shared styled components (gradients, shadows) |

---

### 8.4 API Clients

#### `api/client.js` (Primary)

**Used by:** UnifiedDashboard, SoilFertility, WeatherIntelligence

- Axios instance with base URL from `REACT_APP_API_URL` or `http://localhost:8000`
- **Request interceptor:** Logs outgoing requests
- **Response interceptor:** Wraps responses in `{ success: true, data }` / `{ success: false, error }`
- `getFullReport()` has 120-second timeout for complex analysis
- `sendChatMessage()` handles both `message` and `reply` response field names

#### `services/api.js` (Secondary)

**Used by:** CropRecommendation, FertilizerAdvisory, YieldPrediction

- Simpler Axios instance, throws errors directly instead of wrapping
- `getFertilizerAdvice()` maps frontend field `phosphorous` → backend field `phosphorus`
- Returns `response.data` directly

---

### 8.5 Context Providers

#### `GlobalSettingsContext.js`

**Provides:** `{ language, setLanguage, accessibility, setAccessibility, farmingRegion, setFarmingRegion, locationStatus }`

- **Languages:** 50+ languages with native names and flag emojis
- **Accessibility:** Large text, high contrast, reduced animations
- **Farming Region:** Auto-detected via browser geolocation → `ALL_INDIAN_STATES` lookup
- **Persistence:** All settings saved to `localStorage`

#### `store/AppContext.js`

- Secondary app state context for shared component state

---

### 8.6 Custom Hooks

| Hook | File | Description |
|---|---|---|
| `useGeolocation` | `hooks/useGeolocation.js` | Browser GPS with permission handling and error states |
| `usePrediction` | `hooks/usePrediction.js` | Generic prediction API caller with loading/error states |
| `useSettings` | `hooks/useSettings.js` | Settings management with localStorage sync |
| `useTranslation` | `hooks/useTranslation.js` | Translation utility wrapping `getTranslation()` |
| `useVoice` | `hooks/useVoice.js` | Web Speech API: speech-to-text input + text-to-speech output |
| `useWeather` | `hooks/useWeather.js` | Weather data fetching with caching |

---

### 8.7 Internationalization (i18n)

**Path:** `Frontend/src/i18n/translations.js` | **Lines:** 1,463

**Supported Languages:**

| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `hi` | Hindi | Devanagari |
| `te` | Telugu | Telugu |
| `ta` | Tamil | Tamil |
| `kn` | Kannada | Kannada |

**Coverage:** 150+ translation keys per language covering:
- Navigation labels
- Dashboard text
- Form field labels and helpers
- Result descriptions
- Error messages
- Settings page text
- Fertilizer names and uses
- Soil type names
- Crop type names

**Usage:**

```jsx
const { language } = useGlobalSettings();
const t = (key) => getTranslation(language, key);

// In JSX:
<Typography>{t('cropTitle')}</Typography>
```

---

## 9. Data Files

**Location:** `data/`

| File | Rows | Columns | Purpose |
|---|---|---|---|
| `soil_fertility.csv` | 101 | N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B, Output | Soil fertility classification training data |
| `Crop_recommendation.csv` | 2,202 | N, P, K, temperature, humidity, ph, rainfall, label | Crop recommendation training data (22 crop labels) |
| `daily_weather.csv` | 91,322 | date, temperature, precipitation, wind_speed, humidity, conditions | Multi-year daily weather for risk modelling |
| `Crop Yiled.csv` | 2,598 | Crop, Season, State, Area, Rainfall, Fertilizer, Production, Yield | Crop yield data for yield prediction |

---

## 10. Testing

**Framework:** pytest 9.0.2 + pytest-asyncio 1.3.0

**Configuration:** `backend/pytest.ini`

```ini
[pytest]
testpaths = tests
norecursedirs = tests/archived .git __pycache__ .pytest_cache
asyncio_mode = auto
```

**Test Files:**

| File | Tests | Coverage |
|---|---|---|
| `test_api.py` | 6 | Root, health, soil fertility API, full report API, chatbot API, input validation |
| `test_chatbot_service.py` | 5 | English greeting, Hindi soil query, Telugu crop query, emoji stripping, intent detection |
| `test_data_integration.py` | 7 | Soil fertility, crop recommendation, yield prediction, fertilizer recommendation, weather risk, data validation, report data sources |
| `test_endpoints.py` | 4 | Health endpoint, soil fertility endpoint, full report endpoint, input validation |
| `test_prediction_service.py` | 7 | Soil fertility (low/high), weather risk (detection/extreme), crop recommendation, yield prediction, fertilizer recommendation |
| **Total** | **29** | **All passing** |

**Run tests:**

```bash
cd backend
python -m pytest tests/ -v
```

---

## 11. Configuration & Environment

### Environment Variables (`.env`)

| Variable | Description | Required |
|---|---|---|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key for live weather | Optional (falls back to mock) |
| `GEMINI_API_KEY` | Google Gemini AI API key for chatbot | Optional (falls back to FAQ) |
| `OFFLINE_MODE` | Set to `True` to force mock mode | Optional |

### Content Security Policy

The frontend includes a CSP meta tag in `public/index.html` that:
- Allows `'unsafe-eval'` for build tool compatibility
- Allows `'unsafe-inline'` for MUI and inline styles
- Restricts connections to `localhost`, `api.openweathermap.org`, and `generativelanguage.googleapis.com`
- Allows blob: workers for service worker

### MetaMask Suppression

A `<script>` block in `index.html` catches and suppresses `unhandledrejection` events from MetaMask/SES browser extensions to prevent console noise.

---

## 12. Deployment

### Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd Frontend
npm install
npm start
```

### Production

```bash
# Backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Frontend
cd Frontend
npm run build
# Serve build/ with nginx or similar
```

### Prerequisites

- Python 3.13+
- Node.js 18+
- Trained ML models in `backend/trained_models/` (run `python scripts/train_ml_models.py` if missing)
- `.env` file with API keys (optional — app works with mock data)

---

*Documentation auto-generated. Last verified: 29/29 tests passing.*
