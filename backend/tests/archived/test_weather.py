import joblib
import pandas as pd
import os

# 1. Load Model AND Label Encoder
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, '..', 'models', 'weather_risk_model.pkl')
encoder_path = os.path.join(current_dir, '..', 'models', 'weather_label_encoder.pkl')

if not os.path.exists(model_path):
    print("❌ Error: Run module2_weather.py first.")
    exit()

model = joblib.load(model_path)
le = joblib.load(encoder_path) # Load the translator
print("✅ XGBoost Model & Encoder Loaded!")

def predict_weather_risk(month, temperature):
    # Prepare input
    input_data = pd.DataFrame([[month, temperature]], columns=['Month', 'Temperature'])
    
    # Predict (Returns a number like 0, 1, or 2)
    pred_numeric = model.predict(input_data)
    
    # Convert number back to text (e.g., 0 -> "Drought Risk")
    pred_text = le.inverse_transform(pred_numeric)
    
    return pred_text[0]

print("\n--- 🌤️ XGBoost Weather Predictor ---")
while True:
    try:
        m_in = input("Enter Month (1-12) or 'exit': ")
        if m_in == 'exit': break
        month = int(m_in)
        
        t_in = input("Enter Temp (°C): ")
        temp = float(t_in)

        result = predict_weather_risk(month, temp)
        print(f"🔮 Prediction: {result}\n")
        
    except ValueError:
        print("Invalid input.")