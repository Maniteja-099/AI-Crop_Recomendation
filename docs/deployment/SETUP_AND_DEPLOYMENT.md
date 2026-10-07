# 🚀 Setup & Deployment Guide - AgroCrop AI

## Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.8
- **pip** (Python package manager)
- **npm** (Node package manager)

---

## 📦 Quick Start

### 1. Clone & Navigate
```bash
cd MiniProject
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment
Copy and edit the `.env` file in `backend/`:
```env
# Required for AI Chatbot
GEMINI_API_KEY=your_gemini_api_key_here

# Required for Live Weather (optional - mock data provided as fallback)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Set to True to disable all external API calls
OFFLINE_MODE=False
```

### 4. Start Backend
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```
Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 5. Frontend Setup
```bash
cd ../Frontend
npm install
```

### 6. Start Frontend
```bash
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🔑 API Keys

### Google Gemini AI (Chatbot)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Add to `backend/.env` as `GEMINI_API_KEY`

### OpenWeatherMap (Live Weather)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free tier
3. Get API key
4. Add to `backend/.env` as `OPENWEATHER_API_KEY`

> **Note:** Both APIs work without keys — mock/fallback data is provided automatically.

---

## 📁 Project Structure
```
MiniProject/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── .env                 # API keys & configuration
│   ├── models/              # ML model files (.pkl)
│   └── requirements.txt     # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── api/client.js    # API client (chat, reports)
│   │   ├── services/api.js  # API client (legacy modules)
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ChatWidget.js
│   │   │   ├── ModernNavbar.js
│   │   │   ├── ModernSidebar.js
│   │   │   └── ui/ModernComponents.js
│   │   ├── context/         # Global state management
│   │   │   └── GlobalSettingsContext.js
│   │   ├── i18n/            # Translations
│   │   │   └── translations.js
│   │   ├── pages/           # App pages
│   │   │   ├── ModernHome.js
│   │   │   ├── SoilFertility.js
│   │   │   ├── WeatherIntelligence.js
│   │   │   ├── CropRecommendation.js
│   │   │   ├── YieldPrediction.js
│   │   │   ├── FertilizerAdvisory.js
│   │   │   ├── UnifiedDashboard.js
│   │   │   ├── ChatbotPage.js
│   │   │   └── FarmerFriendlySettings.js
│   │   ├── store/           # App state (Context + Reducer)
│   │   │   └── AppContext.js
│   │   ├── App.js           # Main app with routing
│   │   └── index.js         # Entry point & PWA setup
│   ├── package.json
│   └── public/
├── docs/                    # Documentation
└── README.md
```

---

## 🌐 Environment Variables (Frontend)

Create `.env` in `Frontend/` (optional):
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🏗️ Production Build

### Frontend
```bash
cd Frontend
npm run build
```
Output in `Frontend/build/` — serve with any static file server.

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend not starting | Check Python version >= 3.8 |
| Frontend build fails | Run `npm install` first |
| Chat not working | Verify `GEMINI_API_KEY` in `backend/.env` |
| Weather shows mock data | Add `OPENWEATHER_API_KEY` to `backend/.env` |
| API calls failing | Ensure backend is running on port 8000 |
| Voice input not working | Use Chrome/Edge browser, allow microphone |
