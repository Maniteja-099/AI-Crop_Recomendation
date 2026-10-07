import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os

# --- PAGE CONFIGURATION ---
st.set_page_config(page_title="AI Agri-Tech System", page_icon="🌱", layout="wide")

# --- 1. SETUP PATHS & LOAD MODELS ---
current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(current_dir, '..', 'models')

@st.cache_resource # Caches the models so they load fast
def load_models():
    try:
        models = {
            # Module 1: Soil Fertility
            'soil_model': joblib.load(os.path.join(models_dir, 'soil_fertility_model.pkl')),
            
            # Module 2: Weather Risk
            'weather_model': joblib.load(os.path.join(models_dir, 'weather_risk_model.pkl')),
            'weather_encoder': joblib.load(os.path.join(models_dir, 'weather_label_encoder.pkl')),
            
            # Module 3: Crop Recommendation
            'crop_model': joblib.load(os.path.join(models_dir, 'crop_recommendation_model.pkl')),
            
            # Module 4: Yield Prediction
            'yield_model': joblib.load(os.path.join(models_dir, 'yield_model.pkl')),
            'yield_cols': joblib.load(os.path.join(models_dir, 'yield_columns.pkl')),
            
            # Module 5: Fertilizer Advisory
            'fert_model': joblib.load(os.path.join(models_dir, 'fertilizer_model.pkl')),
            'fert_encoder': joblib.load(os.path.join(models_dir, 'fertilizer_label_encoder.pkl')),
            'fert_cols': joblib.load(os.path.join(models_dir, 'fertilizer_columns.pkl')),
        }
        return models
    except FileNotFoundError as e:
        st.error(f"❌ Error loading models: {e}")
        st.stop()

models = load_models()

# --- SIDEBAR NAVIGATION ---
st.sidebar.title("🚜 Dashboard Navigation")
app_mode = st.sidebar.radio("Go to:", 
    ["Home", "1. Soil Fertility Check", "2. Weather Intelligence", "3. Crop Recommendation", "4. Yield Prediction", "5. Fertilizer Advisory"])

# --- PAGE 1: HOME ---
if app_mode == "Home":
    st.title("🌱 AI-Driven Agricultural Intelligence System")
    st.markdown("""
    Welcome to the **Integrated Smart Farming System**. This tool uses 5 different AI modules to help farmers make data-driven decisions.
    
    ### 🚀 Capabilities:
    1.  **Soil Health:** Check if your land is Fertile, Semi-Fertile, or Infertile.
    2.  **Weather Risk:** Predict Flood or Drought risks for the season.
    3.  **Crop Suggestion:** Find the perfect crop for your soil conditions.
    4.  **Yield Estimator:** Predict how many tons you will harvest.
    5.  **Doctor Advice:** Get specific fertilizer prescriptions for weak soil.
    
    👈 **Select a module from the sidebar to start!**
    """)
    st.image("https://images.unsplash.com/photo-1625246333195-098e4748041d", use_container_width=True)

# --- MODULE 1: SOIL FERTILITY ---
elif app_mode == "1. Soil Fertility Check":
    st.header("🧪 Module 1: Soil Fertility Assessment")
    st.write("Enter the nutrient levels from your Soil Health Card.")
    
    col1, col2, col3 = st.columns(3)
    n = col1.number_input("Nitrogen (N)", 0, 140, 50)
    p = col2.number_input("Phosphorus (P)", 0, 140, 50)
    k = col3.number_input("Potassium (K)", 0, 200, 50)
    
    # We need dummy inputs for the other columns used during training (Temp, pH, etc.)
    # We set them to average values because they don't impact the Fertility Formula we created
    # Inputs expected by model: [Temp, Hum, Moist, N, K, P, Soil_Type_Encoded...]
    # Simpler approach: We reuse the Logic Function directly for 100% accuracy on this rule
    
    if st.button("Check Fertility"):
        avg_nutrients = (n + p + k) / 3
        if avg_nutrients < 25:
            st.error("🔴 Result: **Infertile Soil** (Needs urgent treatment)")
        elif avg_nutrients < 50:
            st.warning("🟡 Result: **Semi-Fertile Soil** (Good, but needs care)")
        else:
            st.success("🟢 Result: **Fertile Soil** (Ready for planting!)")

# --- MODULE 2: WEATHER INTELLIGENCE ---
elif app_mode == "2. Weather Intelligence":
    st.header("☁️ Module 2: Weather Risk Forecasting")
    
    col1, col2 = st.columns(2)
    month = col1.slider("Select Month", 1, 12, 6)
    temp = col2.number_input("Average Temperature (°C)", -10.0, 50.0, 30.0)
    
    if st.button("Analyze Risk"):
        # Create input array
        input_data = pd.DataFrame([[month, temp]], columns=['Month', 'Temperature'])
        
        # Predict using XGBoost
        pred_idx = models['weather_model'].predict(input_data)[0]
        pred_label = models['weather_encoder'].inverse_transform([pred_idx])[0]
        
        if pred_label == "Flood Risk":
            st.error(f"🌊 Prediction: **{pred_label}** (High Rainfall Expected)")
        elif pred_label == "Drought Risk":
            st.warning(f"🔥 Prediction: **{pred_label}** (Dry Conditions Expected)")
        else:
            st.success(f"✅ Prediction: **{pred_label}** (Conditions look standard)")

# --- MODULE 3: CROP RECOMMENDATION ---
elif app_mode == "3. Crop Recommendation":
    st.header("🌾 Module 3: Smart Crop Recommender")
    
    col1, col2 = st.columns(2)
    n = col1.number_input("Nitrogen (N)", 0, 140, 90)
    p = col2.number_input("Phosphorus (P)", 0, 140, 40)
    k = col1.number_input("Potassium (K)", 0, 200, 40)
    temp = col2.number_input("Temperature (°C)", 0.0, 50.0, 25.0)
    hum = col1.number_input("Humidity (%)", 0.0, 100.0, 80.0)
    ph = col2.number_input("Soil pH", 0.0, 14.0, 6.5)
    rain = col1.number_input("Rainfall (mm)", 0.0, 300.0, 200.0)
    
    if st.button("Recommend Crop"):
        features = np.array([[n, p, k, temp, hum, ph, rain]])
        prediction = models['crop_model'].predict(features)[0]
        st.success(f"🏆 Best Crop to Grow: **{prediction.upper()}**")

# --- MODULE 4: YIELD PREDICTION ---
elif app_mode == "4. Yield Prediction":
    st.header("💰 Module 4: Yield (Profit) Prediction")
    
    # Inputs
    crop = st.text_input("Crop Name (e.g., Rice, Maize)", "Rice")
    season = st.selectbox("Season", ["Kharif", "Rabi", "Whole Year"])
    state = st.text_input("State (e.g., Karnataka)", "Karnataka")
    area = st.number_input("Area (Hectares)", 0.1, 10000.0, 1.0)
    rain = st.number_input("Annual Rainfall", 0.0, 3000.0, 1000.0)
    fert = st.number_input("Fertilizer Used (kg)", 0.0, 10000.0, 500.0)
    
    if st.button("Predict Yield"):
        # 1. Create a dictionary with 0s for all columns used in training
        input_dict = {col: 0 for col in models['yield_cols']}
        
        # 2. Fill in the numeric values
        input_dict['area'] = area
        input_dict['rainfall'] = rain
        input_dict['fertilizer'] = fert
        # Add N-P-K averages if they exist in columns, otherwise skip
        if 'nitrogen' in input_dict: input_dict['nitrogen'] = 50 
        
        # 3. Handle Categorical One-Hot Encoding
        # We look for columns like 'crop_Rice' and set them to 1
        crop_col = f"crop_{crop}"
        season_col = f"season_{season}"
        state_col = f"state_{state}"
        
        if crop_col in input_dict: input_dict[crop_col] = 1
        if season_col in input_dict: input_dict[season_col] = 1
        if state_col in input_dict: input_dict[state_col] = 1
        
        # 4. Convert to DataFrame and Predict
        input_df = pd.DataFrame([input_dict])
        
        # Align columns explicitly to match training order
        input_df = input_df[models['yield_cols']]
        
        prediction = models['yield_model'].predict(input_df)[0]
        st.success(f"📉 Estimated Yield: **{prediction:.2f} Tons**")

# --- MODULE 5: FERTILIZER ADVISORY ---
elif app_mode == "5. Fertilizer Advisory":
    st.header("🚑 Module 5: Fertilizer Advisory (The Doctor)")
    
    col1, col2 = st.columns(2)
    n = col1.number_input("Nitrogen", 0, 200, 30)
    p = col2.number_input("Phosphorous", 0, 200, 10)
    k = col1.number_input("Potassium", 0, 200, 10)
    temp = col2.number_input("Temperature", 0, 50, 25)
    hum = col1.number_input("Humidity", 0, 100, 50)
    soil_type = col2.selectbox("Soil Type", ["Sandy", "Loamy", "Black", "Red", "Clayey"])
    crop_type = col1.selectbox("Crop Type", ["Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy", "Barley", "Wheat", "Millets", "Oil seeds", "Pulses", "Ground Nuts"])
    
    if st.button("Get Prescription"):
        # Similar Logic to Yield: Create empty template and fill
        input_dict = {col: 0 for col in models['fert_cols']}
        
        input_dict['Nitrogen'] = n
        input_dict['Phosphorous'] = p
        input_dict['Potassium'] = k
        input_dict['Temperature'] = temp
        input_dict['Humidity'] = hum
        # Fill Moisture with average if user input not available
        if 'Moisture' in input_dict: input_dict['Moisture'] = 40
        
        # Set One-Hot Encoded bits
        soil_col = f"Soil Type_{soil_type}"
        crop_col = f"Crop Type_{crop_type}"
        
        if soil_col in input_dict: input_dict[soil_col] = 1
        if crop_col in input_dict: input_dict[crop_col] = 1
        
        # Predict
        input_df = pd.DataFrame([input_dict])
        input_df = input_df[models['fert_cols']] # Ensure order
        
        pred_idx = models['fert_model'].predict(input_df)[0]
        pred_name = models['fert_encoder'].inverse_transform([pred_idx])[0]
        
        st.info(f"💊 Recommended Fertilizer: **{pred_name}**")