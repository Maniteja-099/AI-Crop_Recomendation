# 🚀 Quick Start Guide
## Team 7 - AI Driven Crop Recommendation and Growth Prediction System

---

## ✅ Current Status

**✓ Frontend**: React app running on http://localhost:3000  
**✓ Backend**: FastAPI running on http://localhost:8000  
**✓ ML Models**: Successfully loaded (9 components)

---

## 🎯 How to Use the System

### 1. **Open the Web Interface**
   - Frontend is already running at: **http://localhost:3000**
   - You'll see the "TEAM 7" logo in the header
   - Full app name: "AI Driven Crop Recommendation and Growth Prediction System"

### 2. **Navigate Through Modules**
   Use the sidebar to access 5 different modules:

   **🧪 Module 1: Soil Fertility Check**
   - Enter N-P-K (Nitrogen, Phosphorus, Potassium) values
   - Get instant fertility assessment
   - Backend predicts: Fertile/Semi-Fertile/Infertile

   **☁️ Module 2: Weather Intelligence**
   - Select month and temperature
   - Get weather risk prediction
   - Backend analyzes: Flood/Drought/Normal conditions

   **🌾 Module 3: Crop Recommendation**
   - Input soil nutrients, temperature, humidity, pH, rainfall
   - Backend ML model recommends optimal crop
   - Get specific growing conditions

   **💰 Module 4: Yield Prediction**
   - Enter crop type, season, state, area, rainfall, fertilizer
   - Backend predicts total harvest yield
   - Get per-hectare estimates

   **🚑 Module 5: Fertilizer Advisory**
   - Input NPK levels, temperature, humidity, soil & crop type
   - Backend recommends specific fertilizer
   - Shows nutrient deficiencies

---

## 🔄 System Architecture

```
User Browser (Port 3000)
    ↓
React Frontend (Material-UI)
    ↓ HTTP Requests
FastAPI Backend (Port 8000)
    ↓
ML Models (.pkl files)
    ↓
Predictions & Results
```

---

## 📡 Testing the API Directly

### Using Swagger UI (Interactive Docs)
Visit: **http://localhost:8000/docs**

### Example API Test:
```bash
# Test Soil Fertility
curl -X POST "http://localhost:8000/api/soil-fertility" \
  -H "Content-Type: application/json" \
  -d "{\"nitrogen\": 50, \"phosphorus\": 50, \"potassium\": 50}"

# Expected Response:
{
  "status": "success",
  "message": "Fertile Soil",
  "description": "Ready for planting!",
  "icon": "🟢",
  "avg_nutrients": 50.0
}
```

---

## 🔧 If You Need to Restart

### Restart Backend:
1. Press `Ctrl+C` in backend terminal
2. Run: `.venv\Scripts\python.exe backend_api.py`

### Restart Frontend:
1. Press `Ctrl+C` in frontend terminal
2. Run: `npm start` (from Frontend folder)

**OR** use the batch files:
- `start_backend.bat` - Starts backend server
- `start_frontend.bat` - Starts frontend server

---

## 💡 Key Features

✅ **Real-time Predictions**: All predictions come from backend ML models  
✅ **No Mock Data**: Frontend fetches actual predictions from FastAPI  
✅ **Team 7 Branding**: Logo visible in header  
✅ **Professional UI**: Material-UI components with green agriculture theme  
✅ **Error Handling**: Clear messages if backend is unavailable  
✅ **Responsive Design**: Works on desktop and mobile  

---

## 📊 Data Flow Example

1. User enters N=50, P=50, K=50 in Soil Fertility page
2. Frontend sends POST request to `http://localhost:8000/api/soil-fertility`
3. Backend receives data, calculates average (50)
4. Backend returns: "Fertile Soil" with 🟢 icon
5. Frontend displays success alert with result
6. User sees: "🟢 Result: Fertile Soil (Ready for planting!)"

---

## 🎓 Educational Value

This project demonstrates:
- **Full-stack development** (React + FastAPI)
- **Machine Learning integration** (scikit-learn, XGBoost)
- **RESTful API design** (FastAPI with Pydantic)
- **Modern frontend** (React Hooks, Material-UI)
- **Agricultural domain knowledge** (N-P-K, crop cycles, weather patterns)

---

## 🆘 Troubleshooting

### Error: "Failed to connect to backend API"
**Solution**: Make sure backend is running on port 8000
```bash
.venv\Scripts\python.exe backend_api.py
```

### Error: "Cannot GET /"
**Solution**: Use `/docs` endpoint to see API documentation
```
http://localhost:8000/docs
```

### Port Already in Use
**Backend**: Change port in `backend_api.py` (line: `uvicorn.run(app, port=8001)`)  
**Frontend**: Kill the process or use different port in `package.json`

---

## 📸 Screenshots

### Frontend
- Home page with 5 module cards
- Sidebar navigation with green theme
- "TEAM 7" logo in white badge
- Full app name in header

### Backend
- Swagger UI at `/docs`
- 6 API endpoints
- Request/Response schemas
- Interactive testing

---

## 👥 Team 7 Contacts

**Project**: AI Driven Crop Recommendation System  
**Tech Stack**: React.js, FastAPI, scikit-learn, XGBoost  
**Models**: 5 ML modules for agricultural intelligence  

---

**System is ready! Start making predictions! 🌱**
