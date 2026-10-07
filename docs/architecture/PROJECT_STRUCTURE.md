# 📁 Project Structure Documentation

**Last Updated:** February 20, 2026  
**Status:** ✅ Organized & Optimized

---

## 🎯 Overview

This is an **AI-Driven Agricultural Intelligence System** with a full-stack architecture:
- **Backend:** Python FastAPI with ML models
- **Frontend:** React-based web application
- **Data:** Agricultural datasets (crops, soil, weather, yield)
- **ML Models:** Trained models for crop recommendation, soil fertility, weather risk, and yield prediction

---

## 📂 Directory Structure

```
MiniProject/
│
├── 📄 .env                          # Environment variables (API keys, configs)
├── 📄 .env.example                  # Example environment configuration
├── 📄 .gitignore                    # Git ignore rules
├── 📄 requirements.txt              # DEPRECATED - Use backend/requirements.txt
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 🔧 .venv/                        # Python virtual environment
├── 🔧 .vscode/                      # VS Code workspace settings
├── 🔧 .git/                         # Git repository
│
├── 📦 backend/                      # Backend Python FastAPI Application
│   ├── 📄 main.py                   # Main FastAPI application entry point
│   ├── 📄 requirements.txt          # Python dependencies (USE THIS)
│   ├── 📄 .env                      # Backend-specific environment variables
│   │
│   ├── 📁 api/                      # API route handlers
│   │   ├── prediction_routes.py    # ML prediction endpoints
│   │   ├── chatbot_routes.py       # AI chatbot endpoints
│   │   └── ...
│   │
│   ├── 📁 config/                   # Configuration files
│   │   ├── settings.py              # App settings and configs
│   │   └── ...
│   │
│   ├── 📁 services/                 # Business logic services
│   │   ├── prediction_service.py   # ML prediction service
│   │   ├── chatbot_service.py      # Chatbot service
│   │   ├── weather_service.py      # Weather data service
│   │   ├── smart_weather_service.py # Advanced weather analysis
│   │   └── ...
│   │
│   ├── 📁 models/                   # Pydantic models & Python data classes
│   │   ├── chat.py                  # Chat-related models
│   │   ├── prediction.py            # Prediction request/response models
│   │   ├── farmer.py                # Farmer profile models
│   │   └── *.pkl                    # Legacy: ML model files (moved to trained_models/)
│   │
│   ├── 📁 ml_models/                # ML model management
│   │   ├── model_manager.py         # Model loading and inference logic
│   │   └── __init__.py
│   │
│   ├── 📁 trained_models/           # ✨ Trained ML model files (.pkl)
│   │   ├── crop_recommendation_model.pkl
│   │   ├── soil_fertility_model.pkl
│   │   ├── weather_risk_model.pkl
│   │   ├── yield_model.pkl
│   │   ├── fertilizer_model.pkl
│   │   └── *.pkl (scalers, encoders, columns)
│   │
│   ├── 📁 scripts/                  # ✨ Utility & training scripts
│   │   ├── train_ml_models.py       # Train all ML models from data
│   │   ├── module1__soil.py         # Soil analysis module
│   │   ├── module2_weather.py       # Weather module
│   │   ├── module3_crop.py          # Crop module
│   │   ├── module4_yield.py         # Yield prediction module
│   │   ├── module5_fertilizer.py    # Fertilizer module
│   │   └── quick_test.py            # Quick testing utilities
│   │
│   ├── 📁 tests/                    # Test files
│   │   ├── test_endpoints.py        # API endpoint tests
│   │   ├── test_data_integration.py # Data integration tests
│   │   ├── test_gemini.py           # AI service tests
│   │   └── archived/                # ✨ Archived old tests
│   │       ├── test_system.py
│   │       ├── test_smart_api.py
│   │       ├── test_backend_api.py
│   │       └── ...
│   │
│   └── 📁 logs/                     # ✨ Backend log files
│       ├── backend.log
│       ├── backend_error.log
│       ├── backend_test.log
│       └── dev-server.log
│
├── 📦 Frontend/                     # Frontend React Application
│   ├── 📄 package.json              # Node.js dependencies
│   ├── 📄 package-lock.json         # Dependency lock file
│   ├── 📄 README.md                 # Frontend documentation
│   ├── 📄 .env                      # Frontend environment variables
│   ├── 📄 .gitignore                # Frontend-specific ignores
│   │
│   ├── 📁 src/                      # React source code
│   │   ├── App.js                   # Main React component
│   │   ├── index.js                 # Application entry point
│   │   ├── 📁 components/           # Reusable UI components
│   │   ├── 📁 pages/                # Page components
│   │   ├── 📁 services/             # API service layer
│   │   ├── 📁 context/              # React context providers
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 i18n/                 # Internationalization
│   │   ├── 📁 translations/         # Language files
│   │   └── 📁 store/                # State management
│   │
│   ├── 📁 public/                   # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── ...
│   │
│   └── 📁 node_modules/             # Node.js dependencies (auto-generated)
│
├── 📦 data/                         # ✨ Agricultural datasets (renamed from Data/)
│   ├── Crop_recommendation.csv      # Crop recommendation dataset
│   ├── soil_fertility.csv           # Soil fertility dataset
│   ├── daily_weather.csv            # Historical weather data
│   ├── Crop Yiled.csv               # Crop yield dataset (note: typo in original)
│   └── *.zip                        # Compressed dataset backups
│
├── 📦 docs/                         # Project documentation
│   ├── 📄 README.md                 # Main documentation
│   ├── 📄 ORGANIZATION_COMPLETE.md  # Organization notes
│   │
│   ├── 📁 api/                      # API documentation
│   ├── 📁 architecture/             # Architecture diagrams & docs
│   ├── 📁 guides/                   # User & developer guides
│   ├── 📁 ml-models/                # ML model documentation
│   ├── 📁 deployment/               # Deployment guides
│   ├── 📁 troubleshooting/          # Troubleshooting guides
│   ├── 📁 quick-references/         # Quick reference cards
│   ├── 📁 changelogs/               # Version changelogs
│   ├── 📁 archived/                 # Archived documentation
│   │
│   └── 📁 project-reports/          # ✨ Project implementation reports
│       ├── IMPLEMENTATION_PLAN.md
│       ├── BACKEND_TEST_RESULTS.md
│       ├── FRONTEND_FIXES_APPLIED.md
│       ├── SYSTEM_TEST_REPORT.md
│       └── README.md
│
├── 📦 scripts/                      # Batch scripts & automation
│   ├── 📄 README.md                 # Scripts usage guide
│   ├── 📄 ORGANIZATION_SUMMARY.md   # Scripts organization summary
│   │
│   ├── 📁 setup/                    # Initial setup scripts
│   │   ├── SETUP_GEMINI_AI.bat      # Configure Gemini AI API
│   │   └── CREATE_DESKTOP_SHORTCUT.bat
│   │
│   ├── 📁 run/                      # Application launchers
│   │   ├── RUN_PROJECT.bat          # 🌟 RECOMMENDED - Main launcher
│   │   ├── RUN_BACKEND.bat          # Backend only
│   │   ├── RUN_FRONTEND.bat         # Frontend only
│   │   ├── START_APP.bat
│   │   └── ...
│   │
│   ├── 📁 test/                     # ✨ Testing scripts
│   │   ├── TEST_CHATBOT.bat
│   │   ├── TEST_GUIDE.bat
│   │   └── test_api.ps1             # PowerShell API test
│   │
│   └── 📁 utilities/                # ✨ Utility scripts
│       └── FRONTEND_QUICKSTART.sh   # Quick frontend setup
│
└── 📦 archive/                      # ✨ Archived/deprecated files
    └── 📁 old_root_scripts/         # Old scripts from root_scripts/
        ├── api.py
        ├── app.py
        ├── backend_api.py
        ├── main_app.py
        ├── minimal_api.py
        └── run_api_*.py

```

---

## ✨ Key Changes & Improvements

### 1. **Organized ML Models**
- ✅ Moved trained `.pkl` files from `models/` to `backend/trained_models/`
- ✅ Updated `backend/ml_models/model_manager.py` to use new path
- ✅ Separated data models (Python classes) from trained models (pickle files)

### 2. **Centralized Logs**
- ✅ Created `backend/logs/` directory
- ✅ Moved all `.log` files to `backend/logs/`
- ✅ Cleaner root directory

### 3. **Backend Scripts Organization**
- ✅ Created `backend/scripts/` for utility scripts
- ✅ Moved training script and modules to `backend/scripts/`
- ✅ Archived old test scripts to `backend/tests/archived/`

### 4. **Root Directory Cleanup**
- ✅ Removed empty `root_scripts/` directory
- ✅ Moved test scripts to appropriate locations
- ✅ Organized shell scripts to `scripts/utilities/`
- ✅ Moved PowerShell test to `scripts/test/`

### 5. **Documentation Consolidation**
- ✅ Merged `project_docs/` into `docs/project-reports/`
- ✅ Single source of truth for all documentation
- ✅ Better organization by category (api, guides, architecture, etc.)

### 6. **Naming Conventions**
- ✅ Renamed `Data/` to `data/` (lowercase for consistency)
- ⚠️ `Frontend/` → Pending rename (in use by active processes)
- ✅ Updated all file references to use new paths

### 7. **Archive Strategy**
- ✅ Created `archive/old_root_scripts/` for deprecated code
- ✅ Keep old code accessible but separated from active codebase

---

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Setup environment
cd backend
python -m venv ..\.venv
..\.venv\Scripts\activate
pip install -r requirements.txt

# 2. Setup Gemini AI (optional)
scripts\setup\SETUP_GEMINI_AI.bat

# 3. Run the project
scripts\run\RUN_PROJECT.bat
```

### Development
```bash
# Backend only
scripts\run\RUN_BACKEND.bat

# Frontend only
scripts\run\RUN_FRONTEND.bat

# Run tests
cd backend
pytest tests/
```

---

## 📋 File Locations Quick Reference

| What you need | Location |
|---------------|----------|
| **Main API** | `backend/main.py` |
| **Python Dependencies** | `backend/requirements.txt` |
| **Trained ML Models** | `backend/trained_models/*.pkl` |
| **Training Script** | `backend/scripts/train_ml_models.py` |
| **API Routes** | `backend/api/` |
| **Business Logic** | `backend/services/` |
| **Data Models** | `backend/models/` |
| **ML Logic** | `backend/ml_models/` |
| **Backend Tests** | `backend/tests/` |
| **Backend Logs** | `backend/logs/` |
| **React App** | `Frontend/src/App.js` |
| **Frontend Entry** | `Frontend/src/index.js` |
| **UI Components** | `Frontend/src/components/` |
| **Datasets** | `data/*.csv` |
| **Documentation** | `docs/` |
| **Batch Scripts** | `scripts/run/` |
| **Project Reports** | `docs/project-reports/` |

---

## 🎯 Best Practices

### Adding New Code
- **Backend API routes** → `backend/api/`
- **Backend services** → `backend/services/`
- **Python data models** → `backend/models/`
- **React components** → `Frontend/src/components/`
- **React pages** → `Frontend/src/pages/`

### Adding New Documentation
- **API docs** → `docs/api/`
- **User guides** → `docs/guides/`
- **Architecture** → `docs/architecture/`
- **Project reports** → `docs/project-reports/`

### Adding New Scripts
- **Setup scripts** → `scripts/setup/`
- **Run scripts** → `scripts/run/`
- **Test scripts** → `scripts/test/`
- **Utilities** → `scripts/utilities/`

### Working with ML Models
1. Update datasets in `data/`
2. Run training: `python backend/scripts/train_ml_models.py`
3. Trained models saved to `backend/trained_models/`
4. Model manager auto-loads from `backend/trained_models/`

---

## 📝 Notes

- **Root `requirements.txt`** is deprecated. Use `backend/requirements.txt` instead.
- **Frontend** folder still capitalized due to active processes. Will be renamed to `frontend/` when safe.
- **Archive** folder contains old/deprecated code for reference only.
- All log files are now centralized in `backend/logs/` for easier monitoring.
- Dataset files remain in root-level `data/` for easy access by training scripts.

---

## 🔧 Maintenance

### Keeping Structure Clean
1. ✅ Keep root directory minimal (config files only)
2. ✅ Put backend code in `backend/`
3. ✅ Put frontend code in `Frontend/`
4. ✅ Put datasets in `data/`
5. ✅ Put docs in `docs/`
6. ✅ Put scripts in `scripts/`
7. ✅ Archive old code in `archive/`

### Regular Cleanup Tasks
- Move logs older than 30 days to `backend/logs/archive/`
- Archive unused scripts to `archive/`
- Update documentation when adding major features
- Run tests before committing: `pytest backend/tests/`

---

**Project Structure Last Organized:** February 20, 2026  
**Next Review Date:** March 20, 2026 (or when adding major features)
