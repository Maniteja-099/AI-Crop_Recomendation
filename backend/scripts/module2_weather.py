import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier  # <--- NEW IMPORT
from sklearn.preprocessing import LabelEncoder # <--- NEW IMPORT
from sklearn.metrics import accuracy_score
import joblib
import os

# --- 1. SETUP PATHS ---
current_script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_script_dir, '..', 'data', 'daily_weather.csv')

if not os.path.exists(csv_path):
    print("❌ ERROR: daily_weather.csv not found.")
    exit()

# --- 2. LOAD DATA ---
df = pd.read_csv(csv_path)

# Rename columns to standard names
possible_renames = {
    'date': 'Date', 'Date': 'Date',
    'tavg': 'Temperature', 'Tavg': 'Temperature', 'temperature': 'Temperature',
    'prcp': 'Rainfall', 'Precipitation': 'Rainfall', 'rainfall': 'Rainfall'
}
df.rename(columns=possible_renames, inplace=True)

# Handle missing columns if necessary (Sample data generation)
if 'Rainfall' not in df.columns: df['Rainfall'] = np.random.uniform(0, 15, len(df))
if 'Temperature' not in df.columns: df['Temperature'] = np.random.uniform(20, 35, len(df))
if 'Date' not in df.columns: df['Date'] = pd.date_range(start='1/1/2000', periods=len(df))

# --- 3. FEATURE ENGINEERING ---
df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)
df['Month'] = df['Date'].dt.month

# Create Risk Label
def classify_weather_risk(row):
    if row['Rainfall'] < 2.0: return 'Drought Risk'
    elif row['Rainfall'] > 50.0: return 'Flood Risk'
    else: return 'Normal'

df['Risk_Label'] = df.apply(classify_weather_risk, axis=1)

# --- 4. PREPARE DATA FOR XGBOOST ---
X = df[['Month', 'Temperature']]
y_text = df['Risk_Label']

# NEW STEP: Convert Text Labels to Numbers (0, 1, 2)
# XGBoost requires numeric targets.
le = LabelEncoder()
y = le.fit_transform(y_text) 

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- 5. TRAIN XGBOOST MODEL ---
print("Training XGBoost Weather Model...")
# use_label_encoder=False prevents a warning, eval_metric removes logs
model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
model.fit(X_train, y_train)

# --- 6. EVALUATE ---
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print(f"✅ XGBoost Model Trained Successfully!")
print(f"📊 Accuracy: {acc * 100:.2f}%")

# --- 7. SAVE EVERYTHING ---
models_dir = os.path.join(current_script_dir, '..', 'models')
os.makedirs(models_dir, exist_ok=True)

joblib.dump(model, os.path.join(models_dir, 'weather_risk_model.pkl'))
# We MUST save the LabelEncoder to translate numbers back to text later
joblib.dump(le, os.path.join(models_dir, 'weather_label_encoder.pkl')) 

print(f"💾 Model & Encoder saved to: {models_dir}")