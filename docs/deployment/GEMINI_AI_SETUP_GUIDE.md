# 🔧 Gemini AI Configuration Guide - Fix Offline Mode

**Status:** 🔴 Currently Running in OFFLINE MODE  
**Goal:** Enable Gemini AI for advanced AI-powered chatbot  
**Time Required:** 5-10 minutes  
**Difficulty:** Easy  

---

## 📋 Current Status

### Why Gemini AI is Disabled

```
[INFO] Gemini AI disabled - Running in OFFLINE MODE with rule-based responses
```

**Reasons:**
1. ✅ `OFFLINE_MODE=True` is set in `.env`
2. ✅ `GEMINI_API_KEY` is empty/not configured in `.env`
3. ✅ System intentionally defaults to offline mode for portability

**Current Behavior:**
- ✅ App works perfectly without Gemini
- ✅ Chatbot uses rule-based responses
- ✅ No external API calls needed
- ✅ No costs incurred

---

## 🚀 How to Enable Gemini AI

### Step 1: Get Your Free Gemini API Key

1. **Go to Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **Click "Create API Key"**
   - Select "Create new secret key"
   - Choose "Google AI Studio"
   - Copy the API key

3. **Your API Key Format:**
   ```
   AIza... (long alphanumeric string)
   ```

---

### Step 2: Update Your .env File

**Location:** `e:\MiniProject\backend\.env`

**Find these lines (Lines 22-40):**
```dotenv
OFFLINE_MODE=True
...
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

**Replace with:**
```dotenv
OFFLINE_MODE=False

# Google Gemini API (Free tier: 60 req/min, 1,500/day)
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIza_YOUR_API_KEY_HERE

# Gemini Model (gemini-1.5-flash is faster, gemini-1.5-pro is smarter)
GEMINI_MODEL=gemini-1.5-flash
```

**Example (with real key):**
```dotenv
OFFLINE_MODE=False
GEMINI_API_KEY=AIzaSyD...abcd1234XYZ
GEMINI_MODEL=gemini-1.5-flash
```

---

### Step 3: Save and Restart Backend

**Option A: Command Line**
```bash
cd e:\MiniProject\backend
python main_v2.py
```

**Option B: Use Batch File**
```bash
# Run from e:\MiniProject\
RUN_BACKEND.bat
```

---

### Step 4: Verify Gemini is Enabled

**Expected Output:**
```
✅ Gemini model 'gemini-1.5-flash' initialized successfully
```

**Instead of:**
```
[INFO] Gemini AI disabled - Running in OFFLINE MODE with rule-based responses
```

---

## 📊 Comparison: Offline vs Online Mode

| Feature | Offline Mode | Online Mode (Gemini) |
|---------|--------------|----------------------|
| **Chatbot** | Rule-based | AI-powered (Gemini) |
| **Response Quality** | Good | Excellent |
| **API Keys** | ❌ None needed | ✅ 1 key (free) |
| **Cost** | ✅ Free | ✅ Free (1,500 calls/day) |
| **Requires Internet** | ❌ No | ✅ Yes |
| **Response Time** | Fast | ~1-2 seconds |
| **Personalization** | Basic | Advanced |

---

## 🔑 Gemini API Key Details

### Free Tier Limits
- **Rate:** 60 requests per minute
- **Daily:** 1,500 requests per day
- **Cost:** $0 (completely free)
- **Requirements:** Google account only

### How to Get API Key (Detailed Steps)

1. **Open Browser:**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **Sign in with Google Account**
   - Use your personal or work Gmail

3. **Create API Key:**
   - Click blue "Create API Key" button
   - Select "Create new secret key in Google AI Studio"
   - Copy the key to clipboard

4. **Paste in `.env` file**
   ```dotenv
   GEMINI_API_KEY=AIza_YourKeyHere
   ```

---

## ✅ What Happens After Enabling

### Backend Changes
```
✅ Gemini model initialized
✅ AI chatbot enabled
✅ Enhanced responses available
✅ Natural language processing active
```

### User Experience Changes
1. **Chatbot responds better** to farming questions
2. **Context-aware answers** - remembers conversation history
3. **Multilingual support** - responds in Hindi, English, regional languages
4. **Smart recommendations** - personalized based on your farm details

### Example Chatbot Improvement

**Offline Mode (Rule-Based):**
```
User: "My cotton crop is yellowing. What should I do?"

Bot: Yellowing could indicate nitrogen deficiency.
Add nitrogen fertilizer. Monitor pH levels.
```

**Online Mode (Gemini AI):**
```
User: "My cotton crop is yellowing. What should I do?"

Bot: Cotton yellowing typically indicates nitrogen deficiency or 
magnesium deficiency. Given your soil NPK (90:42:43), I recommend:
1. Apply urea (46% nitrogen) at 25-30 kg/hectare
2. Add magnesium sulfate (2 kg/hectare) for quick absorption
3. Check soil pH - should be 7.0-7.5 for cotton
4. Water well after application
Monitor for 7-10 days for improvement.
```

---

## 🔒 Security Best Practices

### DO ✅
- ✅ Keep API key secret
- ✅ Use `.env` file (never commit to Git)
- ✅ Regenerate key if compromised
- ✅ Monitor API usage in Google Console

### DON'T ❌
- ❌ Don't share API key in emails
- ❌ Don't commit `.env` to GitHub
- ❌ Don't expose key in frontend code
- ❌ Don't use in public repositories

### .gitignore Already Configured
```
# File: .gitignore
*.env
.env.local
```

Your API key is safe! ✅

---

## 🐛 Troubleshooting

### Issue 1: "API Key Invalid"

**Solution:**
```
1. Copy key again from: https://makersuite.google.com/app/apikey
2. Paste in .env (no extra spaces)
3. Save file
4. Restart backend: python main_v2.py
```

### Issue 2: "Still shows offline mode"

**Check:**
```
1. OFFLINE_MODE=False (not True)
2. GEMINI_API_KEY=AIza_... (not empty)
3. File saved (Ctrl+S)
4. Backend restarted
```

### Issue 3: "429 Rate Limit Error"

**Means:**
- Too many requests (>60/min or >1,500/day)

**Solution:**
- System automatically falls back to offline mode
- Resumes next minute
- No action needed - fully automatic!

### Issue 4: "API Key not recognized"

**Solution:**
1. Go to https://makersuite.google.com/app/apikey
2. Delete old key: "🗑️ Delete"
3. Create new key: "Create API Key"
4. Copy new key
5. Update `.env` file
6. Restart backend

---

## 📱 Gemini Model Options

### gemini-1.5-flash (Recommended) ⚡
- **Speed:** Fast (~0.5-1 second)
- **Quality:** Good
- **Cost:** Free
- **Best for:** Quick responses, high volume
- **Recommended:** YES ✅

### gemini-1.5-pro 🚀
- **Speed:** Slower (~2-3 seconds)
- **Quality:** Excellent
- **Cost:** Free (limited)
- **Best for:** Complex analysis, long responses
- **Recommended:** For advanced users

### Switch Between Models
```dotenv
# In .env file, change:
GEMINI_MODEL=gemini-1.5-pro

# Then restart backend
```

---

## 🧪 Test Your Setup

### After Enabling Gemini, Test It

**Using Frontend:**
1. Open http://localhost:3000/chat
2. Click chatbot icon
3. Ask: "Tell me about nitrogen fertilizer"
4. If you get AI response → ✅ Gemini is working!

**Using API Directly:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about nitrogen fertilizer",
    "language": "en",
    "region": "Maharashtra"
  }'
```

**Expected Response (Gemini Enabled):**
```json
{
  "status": "success",
  "response": "Nitrogen is essential for cotton growth...",
  "source": "Gemini AI",
  "confidence": 0.95
}
```

---

## 📊 Monitoring Gemini Usage

### Check API Usage in Google Console

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to: APIs & Services → Quotas
4. Check requests/day vs limit
5. View detailed logs if needed

### Current Limits
- ✅ 60 requests/minute
- ✅ 1,500 requests/day
- ✅ Sufficient for most users

---

## 🎯 Quick Reference

| Task | Command | Result |
|------|---------|--------|
| Get API Key | https://makersuite.google.com/app/apikey | 🔑 Key obtained |
| Enable Gemini | Set `OFFLINE_MODE=False` in `.env` | ✅ Enabled |
| Add API Key | Set `GEMINI_API_KEY=AIza_...` in `.env` | ✅ Configured |
| Restart Backend | `python main_v2.py` | ✅ Running |
| Test Chatbot | http://localhost:3000/chat | ✅ Test |
| Check Usage | https://console.cloud.google.com/ | 📊 Monitor |

---

## 💡 Why Keep Offline Mode Option?

1. **Portability:** Works anywhere, anytime
2. **Privacy:** No external data sharing
3. **Reliability:** No API dependencies
4. **Cost:** Completely free
5. **Development:** Perfect for testing
6. **Backup:** Automatic fallback if API fails

**Our System is Smart:**
- Works offline by default
- Enables AI when available
- Falls back to rules if API fails
- Best of both worlds! 🎯

---

## ✅ Complete Checklist

- [ ] Visit https://makersuite.google.com/app/apikey
- [ ] Create new API Key
- [ ] Copy API key
- [ ] Open `backend/.env`
- [ ] Set `OFFLINE_MODE=False`
- [ ] Set `GEMINI_API_KEY=AIza_YOUR_KEY`
- [ ] Save file (Ctrl+S)
- [ ] Restart backend
- [ ] See: "✅ Gemini model initialized successfully"
- [ ] Test at http://localhost:3000/chat

---

## 🎉 Result

After completing these steps:

**Before:**
```
[INFO] Gemini AI disabled - Running in OFFLINE MODE with rule-based responses
```

**After:**
```
✅ Gemini model 'gemini-1.5-flash' initialized successfully
```

**New Capabilities:**
- ✅ AI-powered chatbot
- ✅ Natural language understanding
- ✅ Context-aware responses
- ✅ Multilingual support
- ✅ Enhanced farming advice

---

## 📞 Support

**If you get stuck:**
1. Check this guide again (section: Troubleshooting)
2. Verify API key is correct (copy-paste, no spaces)
3. Ensure `OFFLINE_MODE=False`
4. Check backend restart message
5. Test via http://localhost:3000/chat

**Everything is automatic!** No complex setup needed. 🚀

---

**Generated:** February 1, 2026  
**Status:** Ready to Enable  
**Complexity:** ⭐ Easy  
**Time:** ⏱️ 5 minutes  

**Next Step:** Get your API key and update `.env` file! 🔑
