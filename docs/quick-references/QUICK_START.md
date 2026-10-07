# ⚡ QUICK START REFERENCE

## 🎯 Fastest Way to Run (1 Minute)

### Windows
```
Double-click: RUN_PROJECT.bat
```

### Mac/Linux
```bash
# Terminal 1
cd backend && python main_v2.py

# Terminal 2  
cd Frontend && npm start
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Interactive API testing |
| **Health Check** | http://localhost:8000/health | Server status |

---

## 📦 First Time Setup (5 Minutes)

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys
```bash
# Edit backend/.env file:
OPENWEATHER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

**Get API Keys:**
- OpenWeather: https://openweathermap.org/api (Free)
- Gemini: https://makersuite.google.com/app/apikey (Free)

### 3. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

### 4. Run Project
```
Double-click: RUN_PROJECT.bat
```

---

## 🛑 How to Stop

- Close terminal windows
- Or press `Ctrl+C` in each terminal

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | `netstat -ano \| findstr :8000` then `taskkill /PID <id> /F` |
| Port 3000 in use | Type `Y` when prompted to use different port |
| Module not found | Run `pip install -r requirements.txt` again |
| npm errors | Delete `node_modules/` and run `npm install` |
| Models not loading | Check `models/` folder has 10 .pkl files |
| API key errors | Verify .env file has valid keys (no spaces) |

---

## 📁 Project Structure (Simplified)

```
MiniProject/
├── RUN_PROJECT.bat       ← Double-click this!
├── backend/
│   ├── main_v2.py       ← Backend server
│   └── .env             ← Add API keys here
├── Frontend/
│   ├── src/             ← React code
│   └── package.json     ← Dependencies
└── models/              ← ML models (10 files)
```

---

## 🔧 Common Commands

### Backend
```bash
# Start server
python main_v2.py

# Install dependencies
pip install -r requirements.txt

# Check Python version
python --version
```

### Frontend
```bash
# Start server
npm start

# Install dependencies
npm install

# Build for production
npm run build
```

---

## ✅ Pre-Flight Checklist

Before running:
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] Backend .env file configured
- [ ] Dependencies installed (both backend & frontend)

---

## 🎯 Daily Routine

1. **Open project folder**
2. **Double-click `RUN_PROJECT.bat`**
3. **Wait ~10 seconds**
4. **Browser opens at http://localhost:3000**
5. **Start farming! 🌾**

---

## 📞 Need More Help?

📖 **Read Full Guide:** `docs/MANUAL_RUN_GUIDE.md`

---

*Keep this file open while working on the project!*
