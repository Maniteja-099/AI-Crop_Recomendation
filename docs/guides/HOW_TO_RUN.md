# 🚀 HOW TO RUN THE PROJECT

## ⚡ EASIEST WAY (Double-Click)

Just **double-click** this file:
```
START_APPLICATION.bat
```

This will:
- ✅ Start the backend server (port 8000)
- ✅ Start the frontend app (port 3000)
- ✅ Open your browser automatically
- ✅ Everything runs in separate windows

**That's it!** Wait 10-15 seconds and your app will be ready at http://localhost:3000

---

## 📝 ALTERNATIVE METHODS

### Method 1: Start Backend and Frontend Separately

#### Step 1: Start Backend
Double-click: `start_backend.bat`
- Opens in a new window
- Backend runs on http://localhost:8000
- **Keep this window open**

#### Step 2: Start Frontend
Double-click: `start_frontend.bat`
- Opens in a new window
- Frontend runs on http://localhost:3000
- **Keep this window open**

### Method 2: Manual Start (Using Terminal)

#### Terminal 1 - Backend:
```powershell
cd E:\MiniProject
.\.venv\Scripts\Activate.ps1
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend:
```powershell
cd E:\MiniProject\Frontend
npm start
```

---

## 🌐 ACCESS THE APPLICATION

Once both servers are running:

**Main Application:** http://localhost:3000  
**API Documentation:** http://localhost:8000/docs  
**Backend Health Check:** http://localhost:8000/api/health

---

## 💬 USING THE CHATBOT

1. Open http://localhost:3000
2. Click **"⚡ Unified Report"** in sidebar
3. Fill the farm data form
4. Click **"Generate Report"**
5. Click the **💬 chat button** (bottom-right corner)
6. Start chatting with AI!

---

## ⏹️ HOW TO STOP THE APPLICATION

### If using START_APPLICATION.bat:
- Close both windows titled "Backend Server" and "Frontend Server"

### If using separate batch files:
- Close each batch file window
- Or press `Ctrl+C` in each window

### If using terminals:
- Press `Ctrl+C` in each terminal

---

## 🔧 TROUBLESHOOTING

### Problem: "Port already in use"
**Solution:** Close any existing backend/frontend processes
```powershell
# Kill backend
Get-Process -Name python | Where-Object {$_.Path -like "*MiniProject*"} | Stop-Process

# Kill frontend
Get-Process -Name node | Stop-Process
```

### Problem: "Virtual environment not found"
**Solution:** Create virtual environment
```powershell
cd E:\MiniProject
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### Problem: "node_modules not found"
**Solution:** Install frontend dependencies
```powershell
cd E:\MiniProject\Frontend
npm install
```

### Problem: Backend shows errors
**Solution:** Check if models exist in `models/` folder
- If missing, backend will run in MOCK mode (still works!)

---

## 📋 QUICK CHECKLIST

Before running, ensure:
- [ ] Python 3.x installed
- [ ] Node.js installed
- [ ] Virtual environment exists (`.venv` folder)
- [ ] Frontend dependencies installed (`node_modules` folder)

If any is missing, the batch files will help install them automatically!

---

## 🎯 RECOMMENDED WORKFLOW

### Every Time You Want to Use the App:

1. **Double-click:** `START_APPLICATION.bat`
2. **Wait:** 10-15 seconds
3. **Use:** Your app opens automatically at http://localhost:3000
4. **Done:** When finished, close both server windows

---

## 🎉 THAT'S ALL!

The **easiest way** is to just double-click `START_APPLICATION.bat` and everything starts automatically!

---

*Last Updated: January 27, 2026*  
*Team 7 - AI Driven Crop Recommendation System*
