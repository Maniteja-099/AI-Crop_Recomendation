# System Architecture Documentation

## Overview

The Agricultural Intelligence System follows a **decoupled architecture** with a React frontend and FastAPI backend, communicating via REST APIs.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    React Frontend (Port 3000)                    ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            ││
│  │  │  Home   │  │  Soil   │  │ Weather │  │  Crop   │            ││
│  │  │  Page   │  │ Module  │  │ Module  │  │ Module  │            ││
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            ││
│  │  │  Yield  │  │Fertilizer│ │ Chatbot │  │Settings │            ││
│  │  │ Module  │  │ Module  │  │  Page   │  │  Page   │            ││
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/REST
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                                  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                   FastAPI Backend (Port 8000)                    ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │                    CORS Middleware                       │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          ││
│  │  │ /predict │ │ /weather │ │  /chat   │ │/settings │          ││
│  │  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │          ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                         Services                                 ││
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    ││
│  │  │ Prediction     │  │    Weather     │  │   Chatbot      │    ││
│  │  │   Service      │  │    Service     │  │   Service      │    ││
│  │  └────────────────┘  └────────────────┘  └────────────────┘    ││
│  │  ┌────────────────┐                                             ││
│  │  │    Farmer      │                                             ││
│  │  │   Service      │                                             ││
│  │  └────────────────┘                                             ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                      ML Models (.pkl)                            ││
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       ││
│  │  │  Soil  │ │Weather │ │  Crop  │ │ Yield  │ │  Fert  │       ││
│  │  │ Model  │ │ Model  │ │ Model  │ │ Model  │ │ Model  │       ││
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    External Services                             ││
│  │  ┌─────────────────────┐  ┌─────────────────────┐              ││
│  │  │  OpenWeatherMap API │  │   LocalStorage      │              ││
│  │  └─────────────────────┘  └─────────────────────┘              ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Components

#### Page Components
- **Home**: Landing page with system overview
- **SoilFertility**: NPK input and fertility analysis
- **WeatherIntelligence**: Weather risk prediction
- **CropRecommendation**: AI crop suggestions
- **YieldPrediction**: Production estimation
- **FertilizerAdvisory**: Fertilizer recommendations
- **UnifiedDashboard**: Complete farm analysis
- **ChatbotPage**: AI assistant interface
- **SettingsPage**: User preferences

#### UI Components
- **FarmerButton**: Large, accessible buttons
- **FarmerCard**: Status cards with icons
- **FarmerInput**: Accessible input fields
- **FarmerSpinner**: Loading indicators
- **LanguageSelector**: Language switching

#### Hooks
- **useSettings**: User preferences management
- **useWeather**: Weather data fetching
- **useTranslation**: Bilingual support
- **useVoice**: Speech features
- **usePrediction**: ML API calls

### 2. Backend Components

#### API Routes
| Route | Purpose |
|-------|---------|
| `/api/predict/*` | ML model predictions |
| `/api/weather/*` | Weather data |
| `/api/chat/*` | Chatbot interactions |
| `/api/settings/*` | User management |

#### Services
- **PredictionService**: ML inference logic
- **WeatherService**: OpenWeatherMap integration
- **ChatbotService**: NLP and responses
- **FarmerService**: Profile management

### 3. ML Models

| Model | Algorithm | Purpose | Accuracy |
|-------|-----------|---------|----------|
| Soil Fertility | Rule-based | NPK analysis | 95%+ |
| Weather Risk | XGBoost | Flood/Drought | 87% |
| Crop Recommendation | Random Forest | Crop selection | 92% |
| Yield Prediction | Gradient Boosting | Production | 85% |
| Fertilizer Advisory | Decision Tree | Fertilizer type | 89% |

## Data Flow

### Prediction Flow
```
User Input → Frontend Validation → API Request → 
Pydantic Validation → Service Layer → Model Manager → 
ML Model Inference → Response Formatting → Frontend Display
```

### Weather Flow
```
Location Input → Weather Service → OpenWeatherMap API → 
Response Parsing → Caching → Farming Advice Generation → 
Frontend Display
```

### Chat Flow
```
User Message → Voice/Text Input → API Request → 
Intent Detection → Context Analysis → Knowledge Base Lookup → 
Response Generation → Voice Output (optional) → Display
```

## Security Considerations

1. **Input Validation**: All inputs validated with Pydantic
2. **CORS**: Configured for specific origins
3. **Rate Limiting**: Recommended for production
4. **API Keys**: Environment variables for sensitive data

## Scalability

1. **Horizontal Scaling**: Stateless backend design
2. **Caching**: Weather data cached for 30 minutes
3. **Model Loading**: Singleton pattern for ML models
4. **Database**: Ready for PostgreSQL integration

## Offline Capability

- Service Worker for PWA support
- Local Storage for settings persistence
- Fallback predictions when API unavailable
