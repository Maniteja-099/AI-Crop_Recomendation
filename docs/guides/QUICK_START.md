# Quick Start Guide

## ⚡ 5-Minute Setup

### Option 1: Windows (Easiest)

**Step 1: Download & Extract**
```bash
# Extract project to folder of choice
cd e:\MiniProject
```

**Step 2: Run the Application**
```bash
# Double-click this file:
START_APP.bat

# OR run in terminal:
START_APP.bat
```

**Step 3: Open in Browser**
```
http://localhost:3000
```

✅ **Done!** Application is running.

---

### Option 2: Manual Setup (All Platforms)

**Step 1: Install Python Dependencies**
```bash
cd e:\MiniProject
pip install -r requirements.txt
cd backend
pip install -r requirements.txt
```

**Step 2: Start Backend**
```bash
cd e:\MiniProject\backend
python main_v2.py
# Server runs on: http://localhost:8000
```

**Step 3: Start Frontend (New Terminal)**
```bash
cd e:\MiniProject\Frontend
npm install  # First time only
npm start
# App opens at: http://localhost:3000
```

---

## 🎯 What You Can Do

### ✅ Main Features

1. **Farm Analysis**
   - Enter your soil nutrients (N, P, K)
   - Add weather data
   - Get crop recommendations
   - See yield predictions

2. **AI Assistant** 💬
   - Ask questions about farming
   - Get instant answers
   - In 5 languages

3. **Weather Check** ⛅
   - Current conditions
   - Farm risk assessment
   - Planting recommendations

4. **Mobile Ready** 📱
   - Works on phone/tablet
   - Offline mode available
   - Voice input supported

---

## 📊 Demo Data

**Try without entering data:**
1. Go to main dashboard
2. Click "Try Demo Data"
3. See sample analysis instantly

**Demo Values:**
- Nitrogen: 45.5 mg/kg
- Phosphorus: 25.3 mg/kg
- Potassium: 85.2 mg/kg
- Temperature: 28.5°C
- Humidity: 65%
- Month: June
- Area: 2.5 hectares

---

## 🚀 Common Commands

### Start Everything
```bash
START_APP.bat  # Windows
./start_app.sh # Mac/Linux
```

### Start Individual Components

**Backend Only:**
```bash
cd backend
python main_v2.py
```

**Frontend Only:**
```bash
cd Frontend
npm start
```

### Stop the Application
- Press `Ctrl + C` in terminal where app is running
- Or close the browser and wait 10 seconds

---

## 🔧 Troubleshooting

### Application won't start?
1. Make sure port 3000 and 8000 are free
2. Check Python 3.8+ is installed: `python --version`
3. Check Node.js is installed: `node --version`

### Backend shows error?
1. Check all files in `backend/` folder exist
2. Run: `pip install -r requirements.txt`
3. Restart backend

### Frontend shows blank page?
1. Open browser console (F12)
2. Check for red errors
3. Hard refresh: `Ctrl + Shift + R`

### Models not loading?
1. Check `backend/models/` folder has files
2. Check logs for specific model errors
3. Restart backend server

---

## 📚 Next Steps

- **Setup Guide**: See [ENVIRONMENT_SETUP.md](../04_Deployment/ENVIRONMENT_SETUP.md)
- **Full Architecture**: See [SYSTEM_ARCHITECTURE.md](../02_System_Architecture/COMPLETE_SYSTEM_DESIGN.md)
- **API Reference**: See [API_ENDPOINTS.md](../03_API_Reference/API_ENDPOINTS.md)
- **Troubleshooting**: See [COMMON_ISSUES.md](../06_Troubleshooting/COMMON_ISSUES.md)

---

## 💡 Pro Tips

1. **Use Demo Data First**: Test features without entering data
2. **Check Farmer Support**: Click the help button on any page
3. **Mobile App**: Save to home screen for PWA experience
4. **Offline Mode**: Data syncs when online
5. **Multiple Languages**: Switch language in settings (5 languages available)

---

**Version**: 2.0.0 | **Last Updated**: 2024-01-31 | **Status**: ✅ Ready to Use
