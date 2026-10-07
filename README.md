# 🌾 AI-Driven Agricultural Intelligence System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Smart farming powered by Machine Learning and AI**

An intelligent agricultural system that provides crop recommendations, soil fertility analysis, weather risk predictions, yield forecasting, and an AI-powered chatbot assistant.

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Technologies](#-technologies)
- [Contributing](#-contributing)

---

## ✨ Features

### 🌱 Core Functionality
- **Crop Recommendation** - ML-powered crop suggestions based on soil and climate
- **Soil Fertility Analysis** - Comprehensive soil health assessment
- **Weather Risk Prediction** - Weather pattern analysis and risk forecasting
- **Yield Prediction** - Crop yield estimation using historical data
- **Fertilizer Recommendation** - Optimized fertilizer suggestions
- **AI Chatbot** - Multilingual agricultural assistant powered by Gemini AI

### 🎯 Advanced Features
- Real-time weather data integration
- Location-based recommendations
- Seasonal analysis
- Multi-language support (English, Hindi, Telugu, Tamil, Kannada, Bengali, Marathi)
- Offline mode with rule-based fallbacks
- RESTful API architecture

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

### Installation

#### Option 1: Automated Setup (Windows)
```bash
# Run the main launcher
scripts\run\RUN_PROJECT.bat
```

#### Option 2: Manual Setup

**1. Backend Setup**
```bash
# Navigate to project root
cd MiniProject

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
cd backend
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run backend
python main.py
```

**2. Frontend Setup**
```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run frontend
npm start
```

**3. Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 📁 Project Structure

For a complete overview of the project organization, see **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**.

### Quick Overview
```
MiniProject/
├── backend/              # Python FastAPI backend
│   ├── api/             # API routes
│   ├── services/        # Business logic
│   ├── ml_models/       # ML model management
│   ├── trained_models/  # Trained .pkl files
│   └── main.py          # Application entry
├── Frontend/            # React frontend
│   ├── src/            # Source code
│   └── public/         # Static assets
├── data/               # Agricultural datasets
├── docs/               # Documentation
├── scripts/            # Automation scripts
└── archive/            # Archived code
```

---

## 📚 Documentation

### For Users
- [Quick Start Guide](docs/guides/) - Get started in 5 minutes
- [User Manual](docs/guides/) - Complete feature documentation

### For Developers
- [API Documentation](docs/api/) - REST API reference
- [Architecture Overview](docs/architecture/) - System design
- [ML Models Guide](docs/ml-models/) - Model training & deployment
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

### Additional Resources
- [Troubleshooting](docs/troubleshooting/) - Common issues & solutions
- [Deployment Guide](docs/deployment/) - Production deployment
- [Changelogs](docs/changelogs/) - Version history

---

## 🛠️ Technologies

### Backend
- **Framework:** FastAPI
- **ML Libraries:** scikit-learn, pandas, numpy
- **AI:** Google Gemini AI
- **APIs:** OpenWeatherMap
- **Database:** CSV-based (upgradable to PostgreSQL/MongoDB)

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **HTTP Client:** Axios
- **Internationalization:** i18next

### DevOps
- **Version Control:** Git
- **Testing:** pytest (backend), Jest (frontend)
- **CI/CD:** GitHub Actions (coming soon)

---

## 📊 ML Models

The system uses trained Random Forest models for:

| Model | Purpose | Accuracy |
|-------|---------|----------|
| **Crop Recommendation** | Suggest optimal crops | ~95% |
| **Soil Fertility** | Assess soil health | ~92% |
| **Weather Risk** | Predict weather risks | ~88% |
| **Yield Prediction** | Forecast crop yields | RMSE: ~15% |
| **Fertilizer Recommendation** | Suggest fertilizers | ~90% |

Models are stored in `backend/trained_models/` and automatically loaded at startup.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd Frontend
npm test
```

### API Tests
```bash
# PowerShell
scripts\test\test_api.ps1

# Or use the batch file
scripts\test\TEST_CHATBOT.bat
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- ✅ Code follows project conventions
- ✅ Tests pass
- ✅ Documentation is updated
- ✅ Commit messages are descriptive

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Udvikanth10** - *Initial work* - [GitHub](https://github.com/Udvikanth10)

---

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- Google Gemini AI for chatbot capabilities
- Agricultural datasets from Kaggle
- React and FastAPI communities

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Udvikanth10/MiniProject/issues)
- **Documentation:** [docs/](docs/)
- **Discussions:** [GitHub Discussions](https://github.com/Udvikanth10/MiniProject/discussions)

---

**Made with ❤️ for farmers and agricultural innovation**
