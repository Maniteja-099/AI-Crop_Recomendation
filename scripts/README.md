# 🚀 Scripts Directory

All batch scripts for the MiniProject have been organized here for easy access and maintenance.

## 📁 Folder Structure

```
scripts/
├── README.md           # This file
├── setup/             # Setup and configuration scripts
├── run/               # Scripts to run various parts of the application
├── test/              # Testing and debugging scripts
└── utilities/         # Utility and helper scripts
```

## 📂 Categories

### 🔧 Setup Scripts (`setup/`)

**Initial setup and configuration**

| Script | Description |
|--------|-------------|
| `SETUP_GEMINI_AI.bat` | Configure Gemini AI integration |
| `CREATE_DESKTOP_SHORTCUT.bat` | Create desktop shortcuts for quick access |

**Usage:**
```bash
# Run from project root
scripts\setup\SETUP_GEMINI_AI.bat
```

---

### ▶️ Run Scripts (`run/`)

**Main application launchers**

#### Primary Launchers
| Script | Description |
|--------|-------------|
| `RUN_PROJECT.bat` | **Main launcher** - Starts the complete project |
| `RUN_BACKEND.bat` | Run backend server only |
| `RUN_FRONTEND.bat` | Run frontend application only |
| `RUN_OFFLINE.bat` | Run in offline mode (no external APIs) |
| `RUN_SMART_API.bat` | Run Smart API server |

#### Alternative Starters
| Script | Description |
|--------|-------------|
| `START_APP.bat` | Alternative application starter |
| `START_APPLICATION.bat` | Another application starter variant |
| `START_API.bat` | Start API server |
| `START_SMART_API.bat` | Start Smart API (alternative) |

#### Version-Specific Starters
| Script | Description |
|--------|-------------|
| `start_backend.bat` | Backend starter (v1) |
| `start_backend_v2.bat` | Backend starter (v2) |
| `start_frontend.bat` | Frontend starter (v1) |
| `start_frontend_v2.bat` | Frontend starter (v2) |

**Usage:**
```bash
# Run the entire project
scripts\run\RUN_PROJECT.bat

# Run only backend
scripts\run\RUN_BACKEND.bat

# Run in offline mode
scripts\run\RUN_OFFLINE.bat
```

---

### 🧪 Test Scripts (`test/`)

**Testing and validation**

| Script | Description |
|--------|-------------|
| `TEST_CHATBOT.bat` | Test chatbot functionality |
| `TEST_GUIDE.bat` | Interactive testing guide |

**Usage:**
```bash
# Test the chatbot
scripts\test\TEST_CHATBOT.bat
```

---

## 🎯 Quick Reference

### For First-Time Setup
1. Run `scripts\setup\SETUP_GEMINI_AI.bat`
2. (Optional) Run `scripts\setup\CREATE_DESKTOP_SHORTCUT.bat`
3. Start the app with `scripts\run\RUN_PROJECT.bat`

### For Daily Development
- **Full Project:** `scripts\run\RUN_PROJECT.bat`
- **Backend Only:** `scripts\run\RUN_BACKEND.bat`
- **Frontend Only:** `scripts\run\RUN_FRONTEND.bat`
- **Offline Mode:** `scripts\run\RUN_OFFLINE.bat`

### For Testing
- **Test Chatbot:** `scripts\test\TEST_CHATBOT.bat`
- **Test Guide:** `scripts\test\TEST_GUIDE.bat`

## 📝 Notes

### Script Variants
Some functionality has multiple script versions:
- **RUN_* vs START_*** - Different launcher implementations, use RUN_* as primary
- **v1 vs v2** - Version-specific implementations, v2 is typically newer
- **Lowercase vs UPPERCASE** - Naming convention differences, both functional

### Recommended Scripts
For most use cases, use these **recommended scripts**:
- 🎯 **RUN_PROJECT.bat** - Start everything
- 🔙 **RUN_BACKEND.bat** - Backend only
- 🎨 **RUN_FRONTEND.bat** - Frontend only
- 📡 **RUN_OFFLINE.bat** - Offline mode
- ⚙️ **SETUP_GEMINI_AI.bat** - Initial setup

## 🔗 Related Documentation

- **Setup Guide:** `docs/deployment/SETUP_AND_DEPLOYMENT.md`
- **Quick Start:** `docs/guides/QUICKSTART.md`
- **Deployment Guide:** `docs/deployment/DEPLOYMENT_CONFIGURATION_GUIDE.md`

---

**Last Updated:** February 2026  
**Total Scripts:** 17 batch files organized into 4 categories
