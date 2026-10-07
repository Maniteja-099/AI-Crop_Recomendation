"""
🌾 SMART AGRICULTURE DECISION SUPPORT SYSTEM 🌾
================================================
A Real-Time Integrated Application combining:
- Module 1: Soil Fertility Analysis
- Module 2: Weather Risk Prediction  
- Module 3: Crop Recommendation
- Module 4: Yield Prediction

Run this file to use the complete system!
"""

import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

# --- SETUP PATHS ---
current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(current_dir, '..', 'models')

# --- LOAD ALL MODELS ---
def load_models():
    """Load all trained models and return them as a dictionary"""
    models = {}
    
    try:
        # Module 1: Soil Fertility
        models['soil_model'] = joblib.load(os.path.join(models_dir, 'soil_fertility_model.pkl'))
        models['soil_features'] = joblib.load(os.path.join(models_dir, 'soil_features.pkl'))
        print("✅ Soil Fertility Model loaded")
    except:
        print("⚠️ Soil model not found - run module1__soil.py first")
        models['soil_model'] = None
    
    try:
        # Module 2: Weather Risk
        models['weather_model'] = joblib.load(os.path.join(models_dir, 'weather_risk_model.pkl'))
        models['weather_encoder'] = joblib.load(os.path.join(models_dir, 'weather_label_encoder.pkl'))
        print("✅ Weather Risk Model loaded")
    except:
        print("⚠️ Weather model not found - run module2_weather.py first")
        models['weather_model'] = None
    
    try:
        # Module 3: Crop Recommendation
        models['crop_model'] = joblib.load(os.path.join(models_dir, 'crop_recommendation_model.pkl'))
        print("✅ Crop Recommendation Model loaded")
    except:
        print("⚠️ Crop model not found - run module3_crop.py first")
        models['crop_model'] = None
    
    try:
        # Module 4: Yield Prediction
        models['yield_model'] = joblib.load(os.path.join(models_dir, 'yield_model.pkl'))
        models['yield_columns'] = joblib.load(os.path.join(models_dir, 'yield_columns.pkl'))
        print("✅ Yield Prediction Model loaded")
    except:
        print("⚠️ Yield model not found - run module4_yield.py first")
        models['yield_model'] = None
    
    return models

# --- PREDICTION FUNCTIONS ---

def predict_soil_fertility(models, nitrogen, phosphorus, potassium, temperature, humidity, moisture, soil_type):
    """Predict soil fertility based on soil parameters"""
    if models['soil_model'] is None:
        return "❌ Soil model not available"
    
    # Prepare input matching the training features
    input_data = {
        'Temperature': temperature,
        'Humidity': humidity,
        'Moisture': moisture,
        'Nitrogen': nitrogen,
        'Potassium': potassium,
        'Phosphorous': phosphorus
    }
    
    # Add soil type one-hot encoding
    soil_types = ['Clay', 'Loamy', 'Red', 'Sandy', 'Black']
    for st in soil_types[1:]:  # drop_first was used
        col_name = f'Soil Type_{st}'
        input_data[col_name] = 1 if soil_type == st else 0
    
    # Create DataFrame and align columns
    df = pd.DataFrame([input_data])
    
    # Ensure columns match training data
    for col in models['soil_features']:
        if col not in df.columns:
            df[col] = 0
    df = df[models['soil_features']]
    
    prediction = models['soil_model'].predict(df)
    return prediction[0]

def predict_weather_risk(models, month, temperature):
    """Predict weather risk based on month and temperature"""
    if models['weather_model'] is None:
        return "❌ Weather model not available"
    
    input_data = pd.DataFrame([[month, temperature]], columns=['Month', 'Temperature'])
    pred_numeric = models['weather_model'].predict(input_data)
    pred_text = models['weather_encoder'].inverse_transform(pred_numeric)
    return pred_text[0]

def predict_crop(models, n, p, k, temperature, humidity, ph, rainfall):
    """Recommend best crop based on soil and weather conditions"""
    if models['crop_model'] is None:
        return "❌ Crop model not available"
    
    input_data = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]], 
                               columns=['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall'])
    prediction = models['crop_model'].predict(input_data)
    return prediction[0]

def predict_yield(models, fertilizer, temperature, n, p, k):
    """Predict crop yield based on inputs"""
    if models['yield_model'] is None:
        return "❌ Yield model not available"
    
    # Create input matching the training columns
    input_data = pd.DataFrame([[fertilizer, temperature, n, p, k]], 
                               columns=['fertilizer', 'temp', 'n', 'p', 'k'])
    
    # Align with model's expected columns
    for col in models['yield_columns']:
        if col not in input_data.columns:
            input_data[col] = 0
    input_data = input_data[models['yield_columns']]
    
    prediction = models['yield_model'].predict(input_data)
    return round(prediction[0], 2)

# --- MENU FUNCTIONS ---

def soil_analysis_menu(models):
    """Interactive soil fertility analysis"""
    print("\n" + "="*50)
    print("🌱 SOIL FERTILITY ANALYSIS")
    print("="*50)
    
    try:
        nitrogen = float(input("Enter Nitrogen (N) level (0-100): "))
        phosphorus = float(input("Enter Phosphorus (P) level (0-100): "))
        potassium = float(input("Enter Potassium (K) level (0-100): "))
        temperature = float(input("Enter Soil Temperature (°C): "))
        humidity = float(input("Enter Humidity (%): "))
        moisture = float(input("Enter Moisture (%): "))
        
        print("\nSoil Types: Clay, Loamy, Red, Sandy, Black")
        soil_type = input("Enter Soil Type: ").strip().capitalize()
        
        result = predict_soil_fertility(models, nitrogen, phosphorus, potassium, 
                                        temperature, humidity, moisture, soil_type)
        
        print(f"\n🔮 Soil Fertility Status: {result}")
        
        # Provide recommendations
        if result == 'Fertile':
            print("✅ Your soil is in excellent condition for farming!")
        elif result == 'Semi-Fertile':
            print("⚠️ Consider adding organic matter or fertilizers to improve fertility.")
        else:
            print("❌ Soil needs significant improvement. Consider soil treatment.")
            
    except ValueError:
        print("❌ Invalid input. Please enter numeric values.")

def weather_prediction_menu(models):
    """Interactive weather risk prediction"""
    print("\n" + "="*50)
    print("🌤️ WEATHER RISK PREDICTION")
    print("="*50)
    
    try:
        month = int(input("Enter Month (1-12): "))
        if month < 1 or month > 12:
            print("❌ Invalid month. Enter 1-12.")
            return
            
        temperature = float(input("Enter Temperature (°C): "))
        
        result = predict_weather_risk(models, month, temperature)
        
        print(f"\n🔮 Weather Risk: {result}")
        
        # Provide recommendations
        if result == 'Drought Risk':
            print("⚠️ Low rainfall expected. Plan for irrigation!")
        elif result == 'Flood Risk':
            print("⚠️ Heavy rainfall expected. Ensure proper drainage!")
        else:
            print("✅ Normal weather conditions expected.")
            
    except ValueError:
        print("❌ Invalid input. Please enter numeric values.")

def crop_recommendation_menu(models):
    """Interactive crop recommendation"""
    print("\n" + "="*50)
    print("🌾 CROP RECOMMENDATION")
    print("="*50)
    
    try:
        n = float(input("Enter Nitrogen (N) level: "))
        p = float(input("Enter Phosphorus (P) level: "))
        k = float(input("Enter Potassium (K) level: "))
        temperature = float(input("Enter Temperature (°C): "))
        humidity = float(input("Enter Humidity (%): "))
        ph = float(input("Enter Soil pH (0-14): "))
        rainfall = float(input("Enter Rainfall (mm): "))
        
        result = predict_crop(models, n, p, k, temperature, humidity, ph, rainfall)
        
        print(f"\n🔮 Recommended Crop: {result.upper()}")
        print(f"✅ Based on your soil and weather conditions, '{result}' is the best choice!")
        
    except ValueError:
        print("❌ Invalid input. Please enter numeric values.")

def yield_prediction_menu(models):
    """Interactive yield prediction"""
    print("\n" + "="*50)
    print("📊 YIELD PREDICTION")
    print("="*50)
    
    try:
        fertilizer = float(input("Enter Fertilizer amount (kg/hectare): "))
        temperature = float(input("Enter Temperature (°C): "))
        n = float(input("Enter Nitrogen (N) level: "))
        p = float(input("Enter Phosphorus (P) level: "))
        k = float(input("Enter Potassium (K) level: "))
        
        result = predict_yield(models, fertilizer, temperature, n, p, k)
        
        print(f"\n🔮 Predicted Yield: {result} tons/hectare")
        
        # Provide feedback
        if result > 15:
            print("✅ Excellent yield expected!")
        elif result > 10:
            print("👍 Good yield expected.")
        else:
            print("⚠️ Consider optimizing fertilizer usage for better yield.")
            
    except ValueError:
        print("❌ Invalid input. Please enter numeric values.")

def full_analysis_menu(models):
    """Run complete analysis with all modules"""
    print("\n" + "="*50)
    print("🚜 COMPLETE FARM ANALYSIS")
    print("="*50)
    print("Enter your farm parameters for comprehensive analysis:\n")
    
    try:
        # Collect all inputs once
        n = float(input("Nitrogen (N) level: "))
        p = float(input("Phosphorus (P) level: "))
        k = float(input("Potassium (K) level: "))
        temperature = float(input("Temperature (°C): "))
        humidity = float(input("Humidity (%): "))
        moisture = float(input("Soil Moisture (%): "))
        ph = float(input("Soil pH (0-14): "))
        rainfall = float(input("Expected Rainfall (mm): "))
        fertilizer = float(input("Fertilizer (kg/hectare): "))
        
        print("\nSoil Types: Clay, Loamy, Red, Sandy, Black")
        soil_type = input("Soil Type: ").strip().capitalize()
        
        month = int(input("Current Month (1-12): "))
        
        # Run all predictions
        print("\n" + "="*50)
        print("📋 ANALYSIS RESULTS")
        print("="*50)
        
        # 1. Soil Analysis
        soil_result = predict_soil_fertility(models, n, p, k, temperature, humidity, moisture, soil_type)
        print(f"\n1️⃣ Soil Fertility: {soil_result}")
        
        # 2. Weather Risk
        weather_result = predict_weather_risk(models, month, temperature)
        print(f"2️⃣ Weather Risk: {weather_result}")
        
        # 3. Crop Recommendation
        crop_result = predict_crop(models, n, p, k, temperature, humidity, ph, rainfall)
        print(f"3️⃣ Recommended Crop: {crop_result.upper()}")
        
        # 4. Yield Prediction
        yield_result = predict_yield(models, fertilizer, temperature, n, p, k)
        print(f"4️⃣ Expected Yield: {yield_result} tons/hectare")
        
        # Summary & Recommendations
        print("\n" + "="*50)
        print("💡 RECOMMENDATIONS")
        print("="*50)
        
        if soil_result == 'Infertile':
            print("• ⚠️ Improve soil health before planting")
        if weather_result == 'Drought Risk':
            print("• ⚠️ Prepare irrigation systems")
        elif weather_result == 'Flood Risk':
            print("• ⚠️ Ensure proper field drainage")
        print(f"• 🌱 Plant {crop_result} for best results")
        if yield_result < 10:
            print("• 📈 Consider increasing fertilizer for better yield")
        
        print("\n✅ Analysis Complete!")
        
    except ValueError:
        print("❌ Invalid input. Please enter numeric values.")

# --- MAIN APPLICATION ---

def main():
    """Main application entry point"""
    print("\n" + "="*60)
    print("🌾 SMART AGRICULTURE DECISION SUPPORT SYSTEM 🌾")
    print("="*60)
    print(f"📅 {datetime.now().strftime('%B %d, %Y - %H:%M')}")
    print("="*60)
    
    # Load all models
    print("\n📦 Loading AI Models...")
    models = load_models()
    print("-"*60)
    
    while True:
        print("\n📌 MAIN MENU")
        print("-"*30)
        print("1. 🌱 Soil Fertility Analysis")
        print("2. 🌤️ Weather Risk Prediction")
        print("3. 🌾 Crop Recommendation")
        print("4. 📊 Yield Prediction")
        print("5. 🚜 Complete Farm Analysis")
        print("6. 🚪 Exit")
        print("-"*30)
        
        choice = input("Select option (1-6): ").strip()
        
        if choice == '1':
            soil_analysis_menu(models)
        elif choice == '2':
            weather_prediction_menu(models)
        elif choice == '3':
            crop_recommendation_menu(models)
        elif choice == '4':
            yield_prediction_menu(models)
        elif choice == '5':
            full_analysis_menu(models)
        elif choice == '6':
            print("\n👋 Thank you for using Smart Agriculture System!")
            print("🌾 Happy Farming! 🌾\n")
            break
        else:
            print("❌ Invalid choice. Please select 1-6.")

if __name__ == "__main__":
    main()
