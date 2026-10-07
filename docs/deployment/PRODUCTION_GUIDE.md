# 🌾 AI-Driven Agricultural Intelligence System v2.0

## Production-Ready • Zero-Config • Unified Intelligence Platform

---

## 🎯 Project Vision

A **Unified Intelligence System** where farmers enter data **ONCE** and receive a comprehensive "Farm Health Report" through a **Chained AI Pipeline**. Features include:

- 🎯 **Unified Dashboard**: Single-entry, multi-output intelligence
- 🤖 **5-Module AI Chain**: Soil → Weather → Crop → Yield → Fertilizer
- 💬 **Voice-Enabled Chatbot**: Bilingual, context-aware assistant
- 🛡️ **Zero-Config Architecture**: Graceful fallback with mock models
- 🎨 **Modern Agritech UI**: Clean, farmer-friendly design

---

## 🏗️ Architecture

### Backend (FastAPI)
- **File**: `backend/main.py`
- **Port**: 8000
- **Features**:
  - 🔗 **Chained Inference Pipeline** - Results from one model feed into the next
  - 🎭 **Intelligent Mock Mode** - Runs without model files for testing
  - 🌐 **Advanced Chatbot** - Intent detection, context awareness, translation
  - 📸 **Image Analysis** - Disease detection (mock implementation)
  - ✅ **Auto CORS** - Zero manual configuration

### Frontend (React + Tailwind)
- **Framework**: React 19.2.3
- **Design**: Tailwind CSS + Material-UI
- **Features**:
  - 🎯 **UnifiedDashboard** - Enter data once, get complete report
  - 💬 **ChatWidget** - Voice input, auto-scroll, quick questions
  - 📱 **Responsive Design** - Touch-friendly for farmers
  - 🔄 **Real-time Status** - Backend connectivity monitoring

---

## 🚀 Quick Start (Zero-Config)

### 1️⃣ Start Backend
```cmd
start_backend_v2.bat
```
- Auto-installs dependencies
- Runs on http://localhost:8000
- **Works without model files** (mock mode)
- API Docs: http://localhost:8000/docs

### 2️⃣ Start Frontend
```cmd
start_frontend_v2.bat
```
- Auto-installs npm packages (first time)
- Runs on http://localhost:3000
- **Access Unified Dashboard**: http://localhost:3000/unified-dashboard

---

## 📊 The Chained AI Pipeline

**Endpoint**: `POST /api/analyze/full-report`

```
User Input → [Soil Analysis] → [Weather Risk] → [Crop Recommendation]
                                                         ↓
                                                 (Capture Crop Type)
                                                         ↓
                                    [Yield Prediction] ← Crop
                                                         ↓
                                    [Fertilizer Advisory] ← Crop
                                                         ↓
                                              Comprehensive Report
```

**Key Innovation**: The crop recommendation from Step 3 is automatically used as input for yield and fertilizer predictions.

---

## 🤖 Chatbot Intelligence

### Features:
- **Intent Detection**: Automatically understands user queries
- **Context Awareness**: Uses farm report data to answer questions
- **Multilingual**: English, Hindi, Telugu, Tamil, Kannada
- **Voice Input**: Speech-to-text (browser-supported)
- **Quick Questions**: Pre-loaded common queries

### Example Conversations:
```
User: "What crop should I grow?"
Bot: "Based on your soil and weather, I recommend growing RICE 🌾. 
      The AI model is 94.2% confident..."

User: "Is this yield good?"  
Bot: "Your predicted yield is 10.5 tons from 2.5 hectares 
      (about 4.2 tons/hectare). This is a Good yield! 🌾"
```

---

## 📁 Project Structure

```
BATCH_07(CODE)/
│
├── backend/
│   ├── main.py                  # 🆕 Zero-config FastAPI server
│   ├── requirements.txt         # 🆕 Production dependencies
│   └── models/                  # (Optional) .pkl model files
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # 🆕 Axios client with interceptors
│   │   ├── components/
│   │   │   ├── ChatWidget.js    # 🆕 Voice-enabled chatbot
│   │   │   ├── Navbar.js
│   │   │   └── Sidebar.js       # 🆕 Added Unified Dashboard link
│   │   ├── pages/
│   │   │   ├── UnifiedDashboard.js  # 🆕 Main intelligence hub
│   │   │   ├── Home.js
│   │   │   ├── SoilFertility.js
│   │   │   ├── WeatherIntelligence.js
│   │   │   ├── CropRecommendation.js
│   │   │   ├── YieldPrediction.js
│   │   │   └── FertilizerAdvisory.js
│   │   ├── tailwind.css         # 🆕 Tailwind utilities
│   │   └── App.js               # Updated routing
│   └── package.json
│
├── start_backend_v2.bat         # 🆕 Zero-config backend launcher
├── start_frontend_v2.bat        # 🆕 Zero-config frontend launcher
└── PRODUCTION_GUIDE.md          # This file
```

---

## 🛡️ Zero-Config Features

### Backend
1. **Model Manager Class**:
   - Attempts to load `.pkl` files from `backend/models/`
   - If missing: Initializes intelligent mock models
   - Mock predictions based on realistic agricultural logic
   - Logs warning but **NEVER crashes**

2. **CORS Auto-Configuration**:
   - Pre-configured for `localhost:3000` and `127.0.0.1:3000`
   - No manual setup needed

### Frontend
3. **API Client**:
   - Automatic error handling
   - User-friendly error messages
   - Connection failure detection

4. **Graceful Degradation**:
   - Voice input fallback (keyboard if unsupported)
   - Translation fallback (original text if API fails)

---

## 🎨 Design Philosophy: "Modern Agritech"

### Color Palette:
- **Primary Green**: `#16a34a` (Trust, Growth)
- **White Background**: Clean, minimal cognitive load
- **Vibrant Accents**: Color-coded inputs (Green=N, Orange=P, Purple=K)

### UX Principles:
1. **Large Touch Targets**: 48px minimum (farmer-friendly)
2. **Progressive Disclosure**: Show what matters, hide complexity
3. **Visual Feedback**: Loading states, success/error indicators
4. **Bilingual Support**: Language switcher in chatbot
5. **Demo Data Button**: One-click testing

---

## 📈 API Endpoints

### Core Endpoints

#### Health Check
```http
GET /api/health
```
Returns backend status and model mode (MOCK/PRODUCTION).

#### Full Report (Chained Pipeline)
```http
POST /api/analyze/full-report
Content-Type: application/json

{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "ph": 6.5,
  "temperature": 28,
  "humidity": 70,
  "rainfall": 202,
  "month": 6,
  "area": 2.5,
  "state": "Karnataka",
  "season": "Kharif",
  "soil_type": "Loamy"
}
```

**Response**: Nested JSON with 5 module results + summary.

#### Chatbot
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What crop should I grow?",
  "language": "en",
  "context_data": { ... }
}
```

#### Image Analysis
```http
POST /api/analyze-image
Content-Type: multipart/form-data

file: <image_file>
```

### Legacy Endpoints (Backward Compatible)
- `POST /api/soil-fertility`
- `POST /api/weather-risk`
- `POST /api/crop-recommendation`

---

## 🧪 Testing Guide

### 1. Backend Health Check
```cmd
curl http://localhost:8000/api/health
```

Expected Response:
```json
{
  "status": "healthy",
  "models_loaded": 9,
  "mock_mode": false,
  "timestamp": "2026-01-21T..."
}
```

### 2. Full Report Test
Open http://localhost:8000/docs → Try the `/api/analyze/full-report` endpoint.

### 3. Frontend Test
1. Navigate to http://localhost:3000/unified-dashboard
2. Click "✨ Load Demo Data"
3. Click "🚀 Generate Comprehensive Report"
4. Wait for results (should appear in right panel)
5. Open chatbot (💬 icon, bottom-right)
6. Ask: "What crop should I grow?"

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**:
```cmd
netstat -ano | findstr :8000
taskkill /F /PID <PID>
```

**Models not loading**:
- Check if `backend/models/*.pkl` files exist
- If missing, backend runs in **MOCK MODE** (this is normal for testing)

**Import errors**:
```cmd
cd backend
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use**:
- Stop other React apps
- Or edit `package.json`: `"start": "PORT=3001 react-scripts start"`

**Network Error in browser**:
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` in `.env`

**Tailwind not working**:
- Tailwind is using CDN approach (inline styles)
- If issues persist, install: `npm install -D tailwindcss postcss autoprefixer`

---

## 🔐 Environment Variables

### Backend
No environment variables required (zero-config).

### Frontend
Create `Frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📦 Dependencies

### Backend (`backend/requirements.txt`)
```
fastapi==0.128.0
uvicorn[standard]==0.40.0
pandas==2.3.3
numpy==2.4.1
scikit-learn==1.8.0
joblib==1.5.3
xgboost==3.1.3
deep-translator==1.11.4
python-multipart==0.0.20
```

### Frontend (`Frontend/package.json`)
```json
{
  "dependencies": {
    "react": "^19.2.3",
    "react-router-dom": "^7.12.0",
    "axios": "^1.13.2",
    "@mui/material": "^7.3.7"
  }
}
```

---

## 🚀 Deployment Considerations

### Backend
1. Change `host="0.0.0.0"` to specific IP in production
2. Set `CORS allow_origins` to your domain (remove `"*"`)
3. Add authentication middleware
4. Use gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app`

### Frontend
1. Build: `npm run build`
2. Serve `build/` folder with nginx/Apache
3. Update API URL in `.env.production`
4. Enable HTTPS

---

## 🎓 Key Learnings & Best Practices

1. **Always provide fallbacks**: Mock mode prevents crashes during demos
2. **Chain AI models strategically**: Pass outputs between models for richer insights
3. **Context is king**: Chatbot becomes 10x more useful with report context
4. **Optimize for user intent**: "Demo Data" button = instant gratification
5. **Progressive enhancement**: Voice input works where supported, degrades gracefully

---

## 👥 Team & Credits

**Team 7 - BATCH 7 (Mini Project)**
- **Architecture**: Zero-config, production-ready design
- **Backend**: FastAPI, intelligent model fallback
- **Frontend**: React, Tailwind, Material-UI
- **AI Models**: Soil, Weather, Crop, Yield, Fertilizer

---

## 📞 Support

**Backend API Docs**: http://localhost:8000/docs
**Frontend App**: http://localhost:3000
**Unified Dashboard**: http://localhost:3000/unified-dashboard

For issues:
1. Check browser console (F12)
2. Check backend terminal for logs
3. Review this guide's troubleshooting section

---

## 🏁 Next Steps

1. ✅ Test the Unified Dashboard with demo data
2. ✅ Try the voice-enabled chatbot
3. ✅ Explore individual module pages
4. ⏭️ Add real ML model files to `backend/models/`
5. ⏭️ Customize UI colors/branding
6. ⏭️ Deploy to cloud (AWS/Azure/GCP)

---

**🌾 Happy Farming with AI! 🚜**
