To get the most out of GitHub Copilot for a project of this scale, you need to use a **"Specification-First"** approach. Copilot works best when it has a clear blueprint of the folder structure and the data types it needs to handle.

Copy and paste the following prompt into a `PROMPT.md` file in your root directory or paste it directly into Copilot Chat.

---

### The "Master Architect" Prompt for Copilot

**Role:** Act as a Senior Full-Stack Engineer and DevOps Specialist.
**Task:** Scaffold a production-ready "Agricultural Intelligence System" using React (Frontend) and FastAPI (Backend).

**1. Project Structure & Organization:**
Initialize the project with a decoupled architecture. Organize the folders as follows:

* `/backend`: FastAPI application, `/api/routes`, `/models` (Pydantic), `/ml_models` (Pickle files), `/services` (Logic).
* `/frontend`: React.js (Vite), `/src/components`, `/src/hooks`, `/src/i18n` (Bilingual support), `/src/store`.
* `/docs`: Detailed technical documentation, API specifications (OpenAPI), User Manual, and System Design.
* `/data`: Datasets and preprocessing scripts.

**2. Backend Specifications (FastAPI):**

* Create a `settings.py` route to manage farmer profiles (Location, Language preference, Farm size).
* Implement a `predict.py` route that loads a Random Forest `.pkl` model and returns JSON predictions.
* Include **CORS Middleware** and **Pydantic** validation for all inputs.
* Integrate a real-time weather service (OpenWeatherMap) to auto-fill climate data based on user settings.

**3. Frontend Specifications (React):**

* Use **Tailwind CSS** for a "Farmer-Friendly" UI: High contrast, large buttons, and icon-based navigation.
* Implement `react-i18next` for bilingual support (English/Regional Language).
* Create a "Settings" page where the user can toggle language and save their GPS coordinates.
* Use **Axios** for API calls with a loading state (Spinner) for ML processing.

**4. Documentation & README:**

* Generate a `README.md` containing: Installation steps, Technology Stack, System Architecture Diagram (Mermaid), and API Endpoints.
* In `/docs`, create `architecture.md` explaining the ML model performance and `user_guide.md` in both languages.

**5. Constraint:** The code must be modular, follow PEP8 for Python, and use Functional Components with Hooks for React.

---

### Recommended Folder Structure

Once Copilot starts generating, you should see an organization like this:

```text
/root
│
├── /backend
│   ├── main.py              # FastAPI entry point
│   ├── /api                 # Routes and Endpoints
│   ├── /ml                  # .pkl models and inference logic
│   └── requirements.txt
│
├── /frontend
│   ├── /src
│   │   ├── /components      # UI Buttons, Cards, Forms
│   │   ├── /i18n            # translation.json files
│   │   └── App.jsx
│   └── package.json
│
├── /docs
│   ├── api_spec.md          # Detailed API documentation
│   ├── model_report.md      # Accuracy and dataset details
│   └── setup_guide.md       # How to run the project
│
└── README.md                # The project "Face"

```

### Key "Farmer-Friendly" Details to include in /docs:

* **Edge Case Handling:** Document what happens if the user enters a pH of 14 (invalid for crops).
* **Offline Logic:** Explain how the PWA (Progressive Web App) manifest allows the farmer to use the tool without a stable 5G connection.
* **Localization Map:** A table showing which keys in the React code map to which regional language strings.

**Would you like me to generate the specific `README.md` content for you now, or should I write the `i18n` configuration for your React frontend?**
