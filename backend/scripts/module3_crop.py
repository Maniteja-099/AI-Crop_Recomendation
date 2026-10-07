import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# --- 1. SETUP PATHS ---
current_script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_script_dir, '..', 'data', 'crop_recommendation.csv')

print(f"🔍 Looking for crop data at: {csv_path}")

if not os.path.exists(csv_path):
    print("❌ ERROR: crop_recommendation.csv not found.")
    print("   Please check your 'data' folder.")
    exit()

# --- 2. LOAD DATA ---
df = pd.read_csv(csv_path)
print("✅ File loaded successfully!")

# Standardize Column Names (Lowercase to avoid case errors)
df.columns = df.columns.str.lower()
# Expected columns: ['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall', 'label']

# --- 3. PREPARE DATA ---
X = df.drop('label', axis=1)  # Features
y = df['label']               # Target (Crop Name)

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- 4. TRAIN MODEL ---
print("Training Crop Recommendation Model...")
# Random Forest is the industry standard for this specific dataset
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 5. EVALUATE ---
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print(f"✅ Crop Model Trained Successfully!")
print(f"📊 Accuracy: {acc * 100:.2f}%") 
# Note: Don't be surprised if this is 99%+. This dataset is very clean.

# --- 6. SAVE MODEL ---
models_dir = os.path.join(current_script_dir, '..', 'models')
joblib.dump(model, os.path.join(models_dir, 'crop_recommendation_model.pkl'))

print(f"💾 Model saved to: {models_dir}")