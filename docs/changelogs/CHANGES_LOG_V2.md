# 🔄 Changes Log - AgroCrop AI Enhancement v2

## Date: 2026-02-10

---

## 🐛 Critical Bug Fixes

### 1. API Endpoint Prefix Missing (`api/client.js`)
**Problem:** All API endpoints in `api/client.js` were missing the `/api` prefix, causing 404 errors for:
- Chat messages → `/chat` should be `/api/chat`
- Full reports → `/analyze/full-report` should be `/api/analyze/full-report`  
- Health checks → `/health` should be `/api/health`
- All legacy endpoints

**Impact:** UnifiedDashboard, ChatWidget, ChatbotPage could NOT communicate with the backend.

**Fix:** Added `/api` prefix to all endpoints in `api/client.js`.

---

### 2. Chat Context Data Field Mismatch (`api/client.js`)
**Problem:** `sendChatMessage()` was sending `context` but the backend expected `context_data`.

**Impact:** Chatbot was receiving messages but had zero context awareness — couldn't reference soil/weather data.

**Fix:** Changed `context` → `context_data` in the request body.

---

### 3. ChatbotPage Language Desync (`ChatbotPage.js`)
**Problem:** ChatbotPage read language from `localStorage.getItem('appLanguage')` independently, never syncing with GlobalSettingsContext.

**Impact:** When user changed language in Settings, the chatbot page ignored it.

**Fix:** Imported `useGlobalSettings()` and synced language state with global context.

---

### 4. ChatWidget Language Desync (`ChatWidget.js`)
**Problem:** Floating chat widget had its own independent language state, defaulting to 'en'.

**Impact:** Chat widget language didn't follow the app's language setting.

**Fix:** Added `useGlobalSettings()` integration with automatic sync on language change.

---

### 5. HealthCheck URL in `services/api.js`
**Problem:** healthCheck was bypassing the API client and making a direct axios call without `/api` prefix.

**Fix:** Changed to use the `api` instance which already has the correct base URL.

---

## ✨ New Features

### 1. Live Weather Integration (`WeatherIntelligence.js`)
- Auto-fetches weather from OpenWeatherMap API using browser geolocation
- Displays live temperature, humidity, wind speed, pressure, visibility
- Provides farming-specific advisory (risk level, irrigation advice, precautions)
- Falls back to mock data when API key not configured
- Refresh button for manual update

### 2. Comprehensive Soil Report (`SoilFertility.js`)
- Complete soil health report on button click
- Individual nutrient analysis (N, P, K) with optimal ranges
- Yield potential forecast (High/Medium/Low with percentage)
- Soil precautions and warnings
- Step-by-step actions for optimal growth
- Specific fertilizer recommendations with dosage and timing
- Fertility score (0-100%)

### 3. New Backend Endpoints
- `GET /api/weather/live` — Live weather from OpenWeatherMap
- `POST /api/soil-fertility/comprehensive` — Full soil analysis report

### 4. New API Client Functions
- `getLiveWeather(lat, lon)` — Fetch live weather
- `getComprehensiveSoilReport(n, p, k)` — Full soil report

---

## 🗑️ Removed Non-Working UI Elements

### ModernNavbar
- ❌ **Notification bell** — Had no backend support, showed fake red dot
- ❌ **Profile dropdown** — Displayed hardcoded "Farmer Name" and non-functional "Logout"
- ❌ **`@headlessui/react` Disclosure wrapper** — Unnecessary, replaced with standard `<nav>`
- ✅ **Kept:** Sidebar toggle, logo, language switcher, settings link
- ✅ **Added:** Click-outside handler for language dropdown

### ModernSidebar
- ❌ **Hardcoded "Maharashtra, India"** — Replaced with dynamic farming region from GlobalSettingsContext
- ✅ **Added:** "Change in Settings →" link
- ✅ **Fixed:** Custom color classes (`farm-*`, `harvest-*`) → standard Tailwind (`green-*`, `orange-*`)

---

## 🌐 Bilingual Improvements

### Language Sync Architecture
```
User changes language (Navbar/Settings)
    → GlobalSettingsContext updates
        → localStorage persisted
        → ChatWidget auto-syncs
        → ChatbotPage auto-syncs
        → Voice input/output language changes
        → Speech Recognition language changes
```

### Supported Languages
| Code | Language | Voice Support |
|------|----------|---------------|
| en | English | ✅ en-IN |
| hi | Hindi | ✅ hi-IN |
| te | Telugu | ✅ te-IN |
| ta | Tamil | ✅ ta-IN |
| kn | Kannada | ✅ kn-IN |
| mr | Marathi | ✅ mr-IN |

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `Frontend/src/api/client.js` | Fixed all API prefixes, added new endpoints |
| `Frontend/src/services/api.js` | Fixed healthCheck URL |
| `Frontend/src/components/ChatWidget.js` | Added GlobalSettings language sync |
| `Frontend/src/components/ModernNavbar.js` | Removed non-working elements, cleanup |
| `Frontend/src/components/ModernSidebar.js` | Dynamic region, fixed colors |
| `Frontend/src/pages/ChatbotPage.js` | Fixed language sync with GlobalSettings |
| `Frontend/src/pages/WeatherIntelligence.js` | Complete rewrite with live weather |
| `Frontend/src/pages/SoilFertility.js` | Complete rewrite with comprehensive report |
| `backend/main.py` | Added live weather & comprehensive soil endpoints |
