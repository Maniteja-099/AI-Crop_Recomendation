# Common Issues & Solutions

## 🔴 Critical Issues

### ❌ Application Won't Start

**Problem**: `START_APP.bat` shows error or nothing happens

**Solutions**:

1. **Check Prerequisites**
   ```bash
   python --version      # Should be 3.8+
   node --version        # Should be 14+
   npm --version         # Should be 6+
   ```

2. **Check Ports are Free**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   netstat -ano | findstr :3000
   
   # If something is using these ports, kill it
   taskkill /PID <PID> /F
   ```

3. **Run with Details**
   ```bash
   # Instead of double-clicking, run in terminal:
   cmd.exe
   cd e:\MiniProject
   START_APP.bat
   # Look at error messages
   ```

---

### ❌ Backend Server Crashes

**Problem**: "Connection refused" or backend stops suddenly

**Solutions**:

1. **Check Backend Folder**
   ```bash
   cd backend
   dir  # Should show main_v2.py, models/, requirements.txt
   ```

2. **Reinstall Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt --force-reinstall
   ```

3. **Run Backend Manually**
   ```bash
   cd backend
   python main_v2.py
   # Watch for error messages
   ```

4. **Check Model Files**
   - Ensure `backend/models/` folder exists
   - Should contain: `*.pkl` or `*.h5` files
   - If missing, see "Models Not Loading" below

---

### ❌ Frontend Shows Blank Page

**Problem**: Page is white/blank or shows errors

**Solutions**:

1. **Hard Refresh**
   ```
   Press: Ctrl + Shift + Delete
   Or: Ctrl + F5
   Or: F12 (open console, check for errors)
   ```

2. **Check Backend Connection**
   ```bash
   # In browser console:
   fetch('http://localhost:8000/health')
     .then(r => r.json())
     .then(d => console.log(d))
   ```
   If error, backend not running.

3. **Clear Browser Cache**
   - Clear cookies/cache (Ctrl + Shift + Delete)
   - Close and reopen browser
   - Try incognito mode

4. **Check Console Errors (F12)**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for red errors
   - Search Documentation/06_Troubleshooting/ for error message

---

## 🟡 Common Issues

### 🔴 Models Not Loading

**Problem**: Error says "Models not loaded" or predictions fail

**Solutions**:

1. **Check Model Files Exist**
   ```bash
   cd backend/models
   dir  # Should show multiple .pkl files
   ```

2. **Check Model Permissions**
   - Right-click model files → Properties
   - Make sure you have Read permission
   - If not, re-extract project or give permission

3. **Regenerate Models** (Last Resort)
   ```bash
   cd backend
   python -c "from services.model_loader import load_all_models; load_all_models()"
   ```

4. **Reinstall scikit-learn**
   ```bash
   pip uninstall scikit-learn
   pip install scikit-learn==1.3.0
   ```

---

### 🟡 API Returns Wrong Data

**Problem**: Predictions seem incorrect or change every time

**Solutions**:

1. **Validate Input Data**
   - Nitrogen: 0-200 mg/kg
   - Phosphorus: 0-200 mg/kg
   - Potassium: 0-300 mg/kg
   - Temperature: -20 to 60°C
   - Humidity: 0-100%
   - Month: 1-12

2. **Check API Response**
   ```bash
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
   ```

3. **Check Model Accuracy**
   - Run /test endpoint
   - Compare with known good values
   - See [05_ML_Models/MODEL_ACCURACY.md](../05_ML_Models/MODEL_ACCURACY.md)

---

### 🟡 Slow Response Times

**Problem**: Takes > 1 second to get predictions

**Causes & Solutions**:

1. **Too Many Requests**
   - Don't spam submit button
   - Wait 1 second between requests
   - Check browser Network tab (F12)

2. **Backend Overloaded**
   ```bash
   # Restart backend
   cd backend
   python main_v2.py
   ```

3. **Large Dataset Processing**
   - If area is very large (> 100 hectares)
   - Response might take 2-3 seconds
   - This is normal

4. **Network Issues**
   - Check internet connection
   - Try different network (wifi/ethernet)
   - Check latency: ping localhost

---

### 🟡 Language Not Changing

**Problem**: Language selector doesn't work or reverts

**Solutions**:

1. **Check Browser Storage**
   ```bash
   # In browser console:
   localStorage.getItem('language')  # Shows current language
   localStorage.setItem('language', 'hi')  # Set to Hindi
   location.reload()  # Refresh page
   ```

2. **Clear Cache**
   - Clear browser cache (Ctrl + Shift + Delete)
   - Hard refresh (Ctrl + F5)
   - Reopen browser

3. **Check Language Files**
   - Frontend/src/i18n/ should have translation files
   - If missing, download from GitHub

---

## 🟢 Minor Issues

### 📱 Mobile App Issues

**Problem**: App looks weird on phone or gestures don't work

**Solutions**:

1. **Install PWA** (Better Experience)
   - In mobile Chrome, tap menu → "Install app"
   - Or look for install icon in address bar
   - Restart app after installing

2. **Fix Touch Issues**
   - Close other apps
   - Restart phone
   - Use portrait mode (vertical)

3. **Check Mobile Resolution**
   - App designed for: 320px - 2560px width
   - Test on multiple devices

---

### 📶 Offline Mode Not Working

**Problem**: Data not saved when offline

**Solutions**:

1. **Enable PWA**
   - Must install as PWA first (see above)
   - Then works offline

2. **Check Browser Support**
   - Chrome 90+ ✅
   - Firefox 88+ ✅
   - Safari 14+ ✅
   - Edge 90+ ✅

3. **Clear Service Workers**
   ```bash
   # In browser console:
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.getRegistrations().then(r => {
       r.forEach(reg => reg.unregister())
     })
   }
   location.reload()
   ```

---

### 🔊 Voice Input Not Working

**Problem**: Microphone button does nothing

**Solutions**:

1. **Check Browser Permission**
   - Go to Settings → Privacy → Microphone
   - Make sure localhost:3000 has permission
   - Click "Allow" if prompted

2. **Restart Browser**
   - Close all browser windows
   - Reopen and refresh page

3. **Check Microphone**
   - Test on another app (Discord, Teams, etc.)
   - If doesn't work there, microphone is broken

4. **Check Language Support**
   - Voice works for: English, Hindi, Tamil, Telugu, Kannada
   - May not work for all languages depending on browser

---

## 🔵 Advanced Troubleshooting

### Restart Everything Cleanly

```bash
# 1. Kill existing processes
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# 2. Wait 5 seconds
timeout /t 5

# 3. Delete cache files
cd e:\MiniProject
rmdir /S /Q backend/__pycache__
rmdir /S /Q Frontend\node_modules\.cache

# 4. Start fresh
START_APP.bat
```

### Check Logs

**Backend Logs**:
- Watch the terminal where backend is running
- Look for ERROR or WARNING messages

**Frontend Logs**:
- Press F12 → Console tab
- Look for red error messages

**Browser Network**:
- Press F12 → Network tab
- Make a request
- Check status codes (should be 200)

### Reinstall Everything (Nuclear Option)

```bash
# 1. Backup your data
# If you have custom data files, save them

# 2. Uninstall Python packages
pip list | grep -E "fastapi|pydantic|scikit" | xargs pip uninstall -y

# 3. Delete node_modules
rmdir /S /Q Frontend\node_modules

# 4. Fresh install
cd e:\MiniProject\backend
pip install -r requirements.txt

cd e:\MiniProject\Frontend
npm install

# 5. Start fresh
cd e:\MiniProject
START_APP.bat
```

---

## 📞 Getting Help

### Check These First
1. **Quick Start**: [QUICK_START.md](../01_Getting_Started/QUICK_START.md)
2. **Setup Guide**: [ENVIRONMENT_SETUP.md](../04_Deployment/ENVIRONMENT_SETUP.md)
3. **API Reference**: [API_ENDPOINTS.md](../03_API_Reference/API_ENDPOINTS.md)

### Still Stuck?

**Option 1: Chat Bot**
- Open the 💬 Chat button in app
- Ask your question
- AI will help

**Option 2: Error Codes**
- Search error code in [ERROR_MESSAGES.md](ERROR_MESSAGES.md)

**Option 3: Check Logs**
- Terminal output has detailed error info
- Share this error in chat or with support

---

## ✅ Verification Checklist

Use this to verify everything is working:

- [ ] `http://localhost:8000/health` returns "healthy"
- [ ] `http://localhost:3000` loads without errors
- [ ] Can enter farm data in form
- [ ] Can click "Get My Farm Report" button
- [ ] Results show in < 1 second
- [ ] All 5 report sections visible (Soil, Weather, Crop, Yield, Fertilizer)
- [ ] Can switch language
- [ ] Chat bot opens
- [ ] Demo data button works

If all checked ✅ your system is working correctly!

---

**Version**: 2.0.0 | **Last Updated**: 2024-01-31 | **Status**: ✅ Troubleshooting Guide Complete
