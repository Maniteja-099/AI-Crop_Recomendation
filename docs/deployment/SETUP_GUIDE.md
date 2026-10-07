# 🚀 Complete Setup and Installation Guide

## Agri-Smart Precision Platform
**AI-Driven Crop Recommendation and Growth Prediction System**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [API Keys Configuration](#api-keys-configuration)
5. [Running the Application](#running-the-application)
6. [PWA Installation](#pwa-installation)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## 🛠️ Prerequisites

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Python** | 3.8 or higher | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 16.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.x or higher | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### System Requirements

- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** 2GB free space
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+

---

## 🔧 Backend Setup

### Step 1: Navigate to Project Directory

```bash
cd e:\MiniProject
```

### Step 2: Create Python Virtual Environment (Optional but Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
# Install backend requirements
pip install -r requirements.txt

# Or install from backend folder
cd backend
pip install -r requirements.txt
```

**Key Dependencies:**
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `scikit-learn` - Machine learning models
- `pandas` - Data manipulation
- `numpy` - Numerical operations
- `google-generativeai` - Gemini AI integration
- `python-dotenv` - Environment variable management
- `slowapi` - Rate limiting

### Step 4: Verify ML Models

Ensure all model files exist in the `models/` directory:

```
models/
├── soil_fertility_model.pkl
├── soil_features.pkl
├── weather_risk_model.pkl
├── weather_label_encoder.pkl
├── crop_recommendation_model.pkl
├── yield_model.pkl
├── yield_columns.pkl
├── fertilizer_model.pkl
├── fertilizer_label_encoder.pkl
└── fertilizer_columns.pkl
```

**Total Size:** ~15MB

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd Frontend
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

This will install:
- React 18+ ecosystem
- Material-UI (MUI) components
- Axios for API calls
- React Router for navigation
- Web Speech API wrapper
- PWA dependencies

**Installation Time:** 2-5 minutes (depending on internet speed)

### Step 3: Verify Package Installation

```bash
npm list --depth=0
```

Expected output should show:
- `react@18.x.x`
- `@mui/material@5.x.x`
- `axios@1.x.x`
- `react-router-dom@6.x.x`

---

## 🔑 API Keys Configuration

### Step 1: Get API Keys

#### **OpenWeatherMap API Key** (Required for Weather Features)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Navigate to "API keys" section
4. Copy your API key

**Free Tier Limits:**
- 1,000 calls/day
- Current weather data
- 5-day forecast

#### **Google Gemini API Key** (Required for AI Chatbot)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

**Free Tier Limits:**
- 60 requests/minute
- 1,500 requests/day
- gemini-1.5-flash model

### Step 2: Configure Environment Variables

#### **Backend Configuration**

1. Navigate to backend directory:
   ```bash
   cd e:\MiniProject\backend
   ```

2. Create `.env` file from template:
   ```bash
   # Windows
   copy .env .env.local
   
   # macOS/Linux
   cp .env .env.local
   ```

3. Edit `.env` file and add your API keys:

```env
# OpenWeatherMap API
OPENWEATHER_API_KEY=your_actual_api_key_here

# Google Gemini API
GEMINI_API_KEY=your_actual_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash

# Application Settings
APP_NAME="Agri-Smart Precision Platform"
ENVIRONMENT=development
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### **Frontend Configuration** (Optional)

Create `Frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

---

## ▶️ Running the Application

### Option 1: Using Provided Batch Scripts (Windows)

#### **Start Backend**

Double-click `START_APPLICATION.bat` or run:

```bash
start_backend.bat
```

This will:
- Activate virtual environment (if exists)
- Start FastAPI server on http://localhost:8000
- Load all 10 ML model components
- Enable hot-reload for development

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
✅ System Ready! All 10 model components loaded successfully!
```

#### **Start Frontend**

Double-click `start_frontend.bat` or run:

```bash
start_frontend.bat
```

This will:
- Start React development server on http://localhost:3000
- Register service worker for PWA
- Enable hot-module replacement

**Expected Output:**
```
Compiled successfully!

You can now view agrismart-platform in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Option 2: Manual Start

#### **Backend**

```bash
cd e:\MiniProject\backend

# With virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Start server
python main_v2.py

# Or with uvicorn directly
uvicorn main_v2:app --reload --host 0.0.0.0 --port 8000
```

#### **Frontend**

```bash
cd e:\MiniProject\Frontend
npm start
```

### Verify Services

#### **Backend Health Check**

```bash
curl http://localhost:8000/api/health
```

Expected Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "models_loaded": 10,
  "gemini_enabled": true,
  "weather_api_enabled": true
}
```

#### **Frontend Access**

Open browser and navigate to:
- **Main App:** http://localhost:3000
- **Backend API Docs:** http://localhost:8000/docs

---

## 📱 PWA Installation

### Desktop Installation (Chrome/Edge)

1. Open http://localhost:3000 in browser
2. Wait for "Install App" prompt in address bar
3. Click "Install" button
4. App will open in standalone window

**Or manually:**
1. Click three-dot menu (⋮)
2. Select "Install Agri-Smart..."
3. Confirm installation

### Mobile Installation (Android)

1. Open site in Chrome
2. Tap three-dot menu
3. Select "Add to Home screen"
4. Name the app and tap "Add"
5. App icon will appear on home screen

### iOS Installation

1. Open site in Safari
2. Tap Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

---

## 🐛 Troubleshooting

### Backend Issues

#### **"Module not found" Error**

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Or install missing package
pip install package-name
```

#### **"Port 8000 already in use"**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

#### **"Model file not found"**

Ensure all `.pkl` files are in `models/` directory. Re-download if missing.

#### **"Gemini API Error"**

- Verify API key is correct in `.env`
- Check API quota at [Google AI Studio](https://makersuite.google.com/)
- Ensure no extra spaces in API key

### Frontend Issues

#### **"npm install" Fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **"Blank screen" on http://localhost:3000**

1. Check browser console for errors (F12)
2. Ensure backend is running
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode

#### **"Service Worker Registration Failed"**

- Service workers only work on https:// or localhost
- Check browser console for specific errors
- Ensure manifest.json is accessible

### API Issues

#### **"Weather API not working"**

- Verify OpenWeatherMap API key
- Check if API key is activated (may take 10 minutes after creation)
- Test API manually:
  ```bash
  curl "http://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"
  ```

#### **"Chatbot not responding"**

- Check Gemini API key in `.env`
- Verify backend logs for errors
- Fallback to rule-based chatbot if API fails

---

## 🚀 Production Deployment

### Backend (Gunicorn + Nginx)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main_v2:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Build for Production)

```bash
cd Frontend
npm run build

# Serve build folder with static server
npx serve -s build -l 3000
```

### Environment Variables

Update `.env` for production:

```env
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=https://yourdomain.com
```

### Docker Deployment (Optional)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📊 System Status Check

### Backend Status

```bash
curl http://localhost:8000/api/health
```

### Frontend Build Status

```bash
npm run build --verbose
```

### Service Worker Status

Open browser console and type:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs));
```

---

## 📞 Support

### Documentation

- **API Documentation:** http://localhost:8000/docs
- **User Guide:** `/docs/user_guide.md`
- **Architecture:** `/docs/architecture.md`

### Common Commands

```bash
# Backend
python backend/main_v2.py  # Start backend
pip list                    # View installed packages

# Frontend
npm start                   # Start dev server
npm run build               # Production build
npm test                    # Run tests

# Both
git pull                    # Update code
```

---

## ✅ Final Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] OpenWeatherMap API key configured
- [ ] Gemini API key configured
- [ ] All 10 ML models present
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] API health check passes
- [ ] PWA manifest accessible
- [ ] Service worker registered

---

**🌾 Happy Farming with AI! 🚜**

*Last Updated: January 31, 2026*
