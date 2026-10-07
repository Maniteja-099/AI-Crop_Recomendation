# Environment Setup Guide

## 🖥️ System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
- **Python**: 3.8 or higher
- **Node.js**: 14 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 1GB for dependencies + 500MB for datasets

### Check Your System
```bash
# Check Python version
python --version          # Should output 3.8+
python -m pip --version   # Should be pip 20+

# Check Node.js version
node --version           # Should output 14+
npm --version            # Should output 6+
```

---

## 🪟 Windows Setup

### Step 1: Install Python 3.8+

1. Download from [python.org](https://www.python.org/downloads/)
2. Run installer
3. ✅ **IMPORTANT**: Check "Add Python to PATH"
4. Complete installation
5. Verify: `python --version`

### Step 2: Install Node.js

1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer (LTS version recommended)
3. Complete installation
4. Verify: `node --version` and `npm --version`

### Step 3: Clone/Extract Project

```bash
# Option A: If you have a ZIP file
# Extract the MiniProject.zip file
cd e:\MiniProject

# Option B: If using Git
git clone https://github.com/yourrepo/MiniProject.git
cd MiniProject
```

### Step 4: Install Python Dependencies

```bash
# Install root dependencies
pip install -r requirements.txt

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### Step 5: Install Frontend Dependencies

```bash
cd Frontend
npm install
cd ..
```

### Step 6: Start the Application

```bash
# Option A: Use batch file (easiest)
START_APP.bat

# Option B: Manual start (2 terminals)

# Terminal 1: Start backend
cd backend
python main_v2.py
# Wait for message: "Application startup complete"

# Terminal 2: Start frontend
cd Frontend
npm start
# Browser will open at http://localhost:3000
```

---

## 🍎 macOS Setup

### Step 1: Install Python 3.8+

**Using Homebrew (Recommended):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.10

# Create symlink
ln -s /usr/local/bin/python3.10 /usr/local/bin/python
```

**Or download from** [python.org](https://www.python.org/downloads/mac-osx/)

### Step 2: Install Node.js

```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

### Step 3: Clone/Extract Project

```bash
cd ~
git clone https://github.com/yourrepo/MiniProject.git
cd MiniProject
```

### Step 4: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

### Step 5: Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

cd backend
pip install -r requirements.txt
cd ..

# Install Frontend dependencies
cd Frontend
npm install
cd ..
```

### Step 6: Start Application

```bash
# Terminal 1: Backend
cd backend
python main_v2.py

# Terminal 2: Frontend (new terminal)
cd Frontend
npm start
```

---

## 🐧 Linux (Ubuntu/Debian) Setup

### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade
```

### Step 2: Install Python 3.8+

```bash
sudo apt install python3 python3-pip python3-venv

# Verify
python3 --version
pip3 --version
```

### Step 3: Install Node.js

```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Verify
node --version
npm --version
```

### Step 4: Clone/Extract Project

```bash
cd ~
git clone https://github.com/yourrepo/MiniProject.git
cd MiniProject
```

### Step 5: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate
```

### Step 6: Install Dependencies

```bash
# Python dependencies
pip install -r requirements.txt

cd backend
pip install -r requirements.txt
cd ..

# Frontend dependencies
cd Frontend
npm install
cd ..
```

### Step 7: Start Application

```bash
# Terminal 1: Backend
source venv/bin/activate
cd backend
python main_v2.py

# Terminal 2: Frontend
source venv/bin/activate
cd Frontend
npm start
```

---

## 🔧 Troubleshooting Setup

### ❌ "Python not found"
**Solution:**
```bash
# Windows: Add Python to PATH
# macOS/Linux: Use python3 instead
python3 --version

# Or create alias
alias python=python3
```

### ❌ "npm command not found"
**Solution:**
```bash
# Reinstall Node.js
# Or check PATH
echo $PATH

# Add to PATH if needed (macOS/Linux)
export PATH="/usr/local/bin:$PATH"
```

### ❌ "Port 3000 or 8000 in use"
**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux: Find and kill process
lsof -i :3000
kill -9 <PID>
```

### ❌ "Permission denied" (macOS/Linux)
**Solution:**
```bash
# Fix permissions
chmod +x start_app.sh
chmod +x backend/main_v2.py
```

### ❌ "Module not found" error
**Solution:**
```bash
# Ensure you're in correct directory
cd /path/to/MiniProject

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# For frontend
cd Frontend
npm install
npm install --legacy-peer-deps  # If conflicts
```

---

## ✅ Verify Installation

After setup, verify everything works:

```bash
# 1. Check backend health
curl http://localhost:8000/health
# Should return: {"status": "healthy", ...}

# 2. Check frontend loads
# Visit: http://localhost:3000
# Should see the farming assistant interface

# 3. Try demo analysis
# Click "Try Demo Data" button
# Should show results in < 1 second

# 4. Test API
curl -X POST http://localhost:8000/api/analyze/full-report \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 45.5,
    "phosphorus": 25.3,
    "potassium": 85.2,
    "temperature": 28.5,
    "humidity": 65,
    "month": 6,
    "area": 2.5
  }'
# Should return full analysis
```

---

## 🚀 Optional: Advanced Setup

### Using Python Virtual Environment (Recommended for Production)

**Windows:**
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Your prompt will show (venv)
```

**macOS/Linux:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Your prompt will show (venv)
```

### Using Docker (Optional)

```bash
# Build Docker image
docker build -t agricultural-ai .

# Run container
docker run -p 3000:3000 -p 8000:8000 agricultural-ai

# Open browser
http://localhost:3000
```

### Database Setup (Optional - SQLite)

```bash
# Initialize database
cd backend
python -c "from services.db import init_db; init_db()"
```

---

## 📋 Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] Project extracted/cloned
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend dependencies installed (`cd backend && pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`cd Frontend && npm install`)
- [ ] Backend started and healthy (`http://localhost:8000/health`)
- [ ] Frontend running (`http://localhost:3000`)
- [ ] Demo data works
- [ ] API responds correctly

---

## 🎯 Common Commands Summary

| Task | Windows | Mac/Linux |
|------|---------|-----------|
| **Start Everything** | `START_APP.bat` | `source venv/bin/activate && ./start_app.sh` |
| **Start Backend Only** | `cd backend && python main_v2.py` | `source venv/bin/activate && cd backend && python3 main_v2.py` |
| **Start Frontend Only** | `cd Frontend && npm start` | `source venv/bin/activate && cd Frontend && npm start` |
| **Stop Services** | `Ctrl+C` | `Ctrl+C` |
| **Check Backend** | `curl http://localhost:8000/health` | `curl http://localhost:8000/health` |
| **Check Frontend** | Visit `http://localhost:3000` | Visit `http://localhost:3000` |

---

## 📞 Need More Help?

- **Quick Start**: [QUICK_START.md](../01_Getting_Started/QUICK_START.md)
- **Troubleshooting**: [COMMON_ISSUES.md](../06_Troubleshooting/COMMON_ISSUES.md)
- **System Requirements**: Check this file (you're reading it!)
- **API Setup**: [API_ENDPOINTS.md](../03_API_Reference/API_ENDPOINTS.md)

---

**Version**: 2.0.0  
**Last Updated**: January 31, 2024  
**Status**: ✅ Complete
