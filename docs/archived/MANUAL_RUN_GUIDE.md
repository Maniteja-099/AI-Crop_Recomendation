# 📖 MANUAL STARTUP GUIDE

## Complete Step-by-Step Instructions to Run the Project Manually

---

## 🎯 Prerequisites Check

Before starting, ensure you have:

### 1. Python 3.8 or higher
```bash
python --version
# Should show: Python 3.8.x or higher
```

**If not installed:**
- Download from: https://www.python.org/downloads/
- During installation, CHECK "Add Python to PATH"

### 2. Node.js 16 or higher
```bash
node --version
# Should show: v16.x.x or higher

npm --version
# Should show: 8.x.x or higher
```

**If not installed:**
- Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version

### 3. Git (Optional - for version control)
```bash
git --version
```

---

## 📁 Project Structure Overview

```
MiniProject/
├── backend/              # Python FastAPI backend
│   ├── main_v2.py       # Main server file (START HERE)
│   ├── .env             # Configuration (API keys)
│   ├── requirements.txt # Python dependencies
│   ├── api/             # API routes
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   └── ml_models/       # ML model loader
│
├── Frontend/            # React frontend
│   ├── src/             # Source code
│   ├── public/          # Static files
│   ├── package.json     # Dependencies
│   └── node_modules/    # Installed packages
│
├── models/              # ML model files (.pkl)
├── docs/                # Documentation
├── Data/                # Training datasets
│
├── RUN_PROJECT.bat      # ⭐ Run everything (Windows)
├── RUN_BACKEND.bat      # Run only backend
├── RUN_FRONTEND.bat     # Run only frontend
└── .gitignore           # Files to ignore in Git
```

---

## 🚀 METHOD 1: Quick Start (Easiest)

### Windows Users:

**Option A: Run Everything Together**
```
1. Double-click: RUN_PROJECT.bat
2. Wait for both servers to start
3. Browser opens automatically at http://localhost:3000
```

**Option B: Run Separately**
```
1. Double-click: RUN_BACKEND.bat
2. Wait 5 seconds
3. Double-click: RUN_FRONTEND.bat
```

### What Happens:
- ✅ Backend starts on port 8000
- ✅ Frontend starts on port 3000
- ✅ Browser opens automatically
- ✅ All services connected

---

## 🔧 METHOD 2: Manual Start (Learn Every Step)

### STEP 1: Prepare Backend

#### 1.1 Open Terminal/Command Prompt
```bash
# Windows: Press Win+R, type "cmd", press Enter
# Or right-click in folder → "Open in Terminal"
```

#### 1.2 Navigate to Backend Folder
```bash
cd e:\MiniProject\backend
```

#### 1.3 Install Python Dependencies (First Time Only)
```bash
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi uvicorn pandas numpy...
```

**If you see errors:**
- `pip not found`: Python not in PATH, reinstall Python
- `Permission denied`: Run as administrator
- `Connection timeout`: Check internet connection

#### 1.4 Configure API Keys

**Edit .env file (already exists in backend folder):**
```bash
# Make sure you're in backend folder:
cd e:\MiniProject\backend

# Open .env file for editing:
notepad .env
```

**Add your API keys:**
```env
OPENWEATHER_API_KEY=your_actual_openweather_key_here
GEMINI_API_KEY=your_actual_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
ALLOWED_ORIGINS=http://localhost:3000
```

**Where to get API keys:**

**OpenWeatherMap (Weather Data):**
1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (free)
3. Verify email
4. Go to "API keys" section
5. Copy the key (starts with a long string)
6. Paste in .env file

**Google Gemini (AI Chatbot):**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste in .env file

#### 1.5 Start Backend Server
```bash
python main_v2.py
```

**Expected output:**
```
============================================================
🌱 Agricultural Intelligence System - Starting Up
============================================================
📦 Models Directory: e:\MiniProject\models
🎭 Mock Mode: No
🔑 OpenWeather API: Configured
🤖 Gemini API: Configured

✅ System Ready!
📖 API Docs: http://localhost:8000/docs
🔍 Health Check: http://localhost:8000/health
============================================================

INFO: Uvicorn running on http://0.0.0.0:8000
```

**If you see errors:**

**"ModuleNotFoundError: No module named 'fastapi'"**
```bash
pip install fastapi uvicorn
```

**"Port 8000 is already in use"**
```bash
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

**"Model file not found"**
- Ensure `models/` folder exists in project root
- All .pkl files should be present (10 files)

#### 1.6 Test Backend (New Terminal)
```bash
# Open new terminal, keep backend running
curl http://localhost:8000/health

# Or open in browser:
# http://localhost:8000/docs
```

**Expected response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "models_loaded": 10
}
```

---

### STEP 2: Prepare Frontend

#### 2.1 Open NEW Terminal
**Important:** Keep backend terminal running!

#### 2.2 Navigate to Frontend Folder
```bash
cd e:\MiniProject\Frontend
```

#### 2.3 Install Node.js Dependencies (First Time Only)
```bash
npm install
```

**This will take 2-5 minutes and install:**
- React and related libraries
- Material-UI components
- Axios for API calls
- Service worker for PWA
- And ~1000 other dependencies

**Expected output:**
```
added 1500 packages in 120s
```

**If you see errors:**

**"npm not found"**
- Node.js not installed or not in PATH
- Reinstall Node.js with "Add to PATH" option

**"EACCES permission denied"**
```bash
# Run terminal as administrator
```

**"Network error"**
- Check internet connection
- Try: `npm install --registry https://registry.npmjs.org/`

#### 2.4 Start Frontend Server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view agrismart-platform in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Browser automatically opens:** http://localhost:3000

**If you see errors:**

**"Port 3000 is already in use"**
```
Would you like to run the app on another port instead? (Y/n)
Type: Y
# App will start on port 3001
```

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Verify Everything Works

### 1. Check Backend Health
**Open:** http://localhost:8000/health

**Should see:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "models_loaded": 10,
  "gemini_enabled": true
}
```

### 2. Check API Documentation
**Open:** http://localhost:8000/docs

**Should see:** Interactive API documentation (Swagger UI)

### 3. Check Frontend
**Open:** http://localhost:3000

**Should see:** Agri-Smart Platform home page

### 4. Test Full Flow

**Step 1:** Click "Crop Recommendation"
**Step 2:** Enter soil values (N=90, P=42, K=43)
**Step 3:** Enter climate data
**Step 4:** Click "Get Recommendation"
**Step 5:** Should see crop suggestion (e.g., "Rice")

---

## 🛑 How to Stop Servers

### Stop Backend:
```bash
# In backend terminal:
Press Ctrl+C
```

### Stop Frontend:
```bash
# In frontend terminal:
Press Ctrl+C
# Type: Y (to confirm)
```

### Or close terminal windows

---

## 🔄 Daily Startup Routine

### Option 1: Using Batch Files (Fastest)
```
1. Double-click: RUN_PROJECT.bat
2. Done!
```

### Option 2: Manual (Good Practice)
```
Terminal 1:
cd e:\MiniProject\backend
python main_v2.py

Terminal 2:
cd e:\MiniProject\Frontend
npm start
```

---

## 🐛 Common Problems & Solutions

### Problem 1: "Python not found"
**Solution:**
```bash
# Add Python to PATH:
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add: C:\Users\YourName\AppData\Local\Programs\Python\Python3x
4. Restart terminal
```

### Problem 2: "npm not found"
**Solution:**
- Reinstall Node.js from https://nodejs.org/
- Choose "Add to PATH" during installation

### Problem 3: Backend starts but models don't load
**Solution:**
```bash
# Check models folder exists:
dir e:\MiniProject\models

# Should show 10 .pkl files
# If missing, models need to be retrained or downloaded
```

### Problem 4: Frontend shows "Network Error"
**Solution:**
- Ensure backend is running (check http://localhost:8000/health)
- Check if ports are correct in code
- Disable firewall/antivirus temporarily

### Problem 5: "Module not found" errors
**Solution:**
```bash
# Backend:
pip install --upgrade -r requirements.txt

# Frontend:
cd Frontend
npm install
```

### Problem 6: Changes not reflecting
**Solution:**
```bash
# Backend: Restart server (Ctrl+C, then python main_v2.py)
# Frontend: Auto-reloads (just save file)
# Browser: Hard refresh (Ctrl+Shift+R)
```

---

## 📦 Dependency Installation Details

### Backend Dependencies (pip)
```bash
# What gets installed:
fastapi          # Web framework
uvicorn          # ASGI server
pandas           # Data manipulation
numpy            # Numerical operations
scikit-learn     # Machine learning
google-generativeai  # Gemini AI
slowapi          # Rate limiting
python-dotenv    # Environment variables
```

### Frontend Dependencies (npm)
```bash
# What gets installed:
react            # UI library
@mui/material    # Material-UI components
axios            # HTTP client
react-router-dom # Navigation
# ... and many more
```

---

## 🔍 Advanced: Understanding Each Command

### Backend Commands Explained

**`cd e:\MiniProject\backend`**
- Changes directory to backend folder
- `cd` = "change directory"
- Backslash (\) for Windows, forward slash (/) for Mac/Linux

**`pip install -r requirements.txt`**
- `pip` = Python package installer
- `install` = install packages
- `-r` = read from file
- `requirements.txt` = file containing package list

**`python main_v2.py`**
- `python` = Python interpreter
- `main_v2.py` = script to run
- Starts FastAPI server

### Frontend Commands Explained

**`npm install`**
- `npm` = Node Package Manager
- `install` = install packages
- Reads `package.json` automatically
- Downloads to `node_modules/` folder

**`npm start`**
- `npm` = Node Package Manager
- `start` = run "start" script from package.json
- Starts React development server
- Runs: `react-scripts start`

---

## 📚 Learning Resources

### FastAPI (Backend)
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

### React (Frontend)
- Official Docs: https://react.dev/
- Tutorial: https://react.dev/learn

### Python
- Official Tutorial: https://docs.python.org/3/tutorial/

### Node.js & npm
- npm Documentation: https://docs.npmjs.com/

---

## 🎓 Next Steps to Learn More

### 1. Understand Project Structure
```bash
# Explore files:
cd backend
dir /s  # Windows
ls -la  # Mac/Linux

# Read source code:
notepad api/routes/predict.py
```

### 2. Make Small Changes
```python
# backend/main_v2.py
# Change API title:
app = FastAPI(
    title="My Custom Title",  # ← Change this
    ...
)
```

### 3. Learn Git (Version Control)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 4. Deploy to Production
- Frontend: Vercel, Netlify
- Backend: Heroku, Railway, AWS
- Docs: See `docs/PRODUCTION_GUIDE.md`

---

## ✅ Checklist Before Running

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file configured with API keys
- [ ] All 10 model files present in `models/` folder
- [ ] No other applications using ports 8000 or 3000

---

## 🎯 Summary: Simplest Way to Run

### Every Time You Want to Start:

**Windows:**
```
Double-click: RUN_PROJECT.bat
```

**Mac/Linux:**
```bash
# Terminal 1:
cd backend && python main_v2.py

# Terminal 2:
cd Frontend && npm start
```

### That's It!

---

## 📞 Need Help?

1. **Check logs:** Read error messages carefully
2. **Check documentation:** `docs/` folder
3. **Verify installation:** Run `python --version` and `node --version`
4. **Check API keys:** Ensure `.env` file has valid keys
5. **Restart everything:** Sometimes a fresh start helps!

---

**🎉 Congratulations! You now know how to run the project manually!**

*Last Updated: January 31, 2026*
