import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

# --- 1. SETUP PATHS ---
current_script_dir = os.path.dirname(os.path.abspath(__file__))
# Reusing the dataset from Module 1
csv_path = os.path.join(current_script_dir, '..', 'data', 'soil_fertility.csv')

print(f"🔍 Looking for fertilizer data at: {csv_path}")

if not os.path.exists(csv_path):
    print("❌ ERROR: soil_fertility.csv not found.")
    exit()

# --- 2. LOAD DATA ---
df = pd.read_csv(csv_path)
print("✅ File loaded successfully!")

# Clean Column Names
# Input CSV has typos: 'Temparature', 'Humidity ', 'Phosphorous'
df.columns = df.columns.str.strip() # Remove 'Humidity ' space
rename_map = {
    'Temparature': 'Temperature',
    'Phosphorous': 'Phosphorus',
    'Fertilizer Name': 'Fertilizer'
}
df.rename(columns=rename_map, inplace=True)
print(f"✅ Columns cleaned: {list(df.columns)}")

# --- 3. PREPARE DATA ---
# Target: 'Fertilizer'
# Inputs: Standardized Names

# 3a. Label Encode the Target
fert_encoder = LabelEncoder()
df['Fertilizer'] = fert_encoder.fit_transform(df['Fertilizer'])

# 3b. One-Hot Encode Input Features
# We use get_dummies on categorical columns (Soil Type, Crop Type)
# and select only the relevant features
X = df[['Temperature', 'Humidity', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorus', 'Soil Type', 'Crop Type']]
X_processed = pd.get_dummies(X, columns=['Soil Type', 'Crop Type'])

y = df['Fertilizer']

X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)

# --- 4. TRAIN MODEL ---
print(f"Training Fertilizer Recommendation Model on {len(X.columns)} features...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 5. EVALUATE ---
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print(f"✅ Fertilizer Model Trained!")
print(f"📊 Accuracy: {acc * 100:.2f}%")

# --- 6. SAVE MODEL & ENCODERS ---
models_dir = os.path.join(current_script_dir, '..', 'models')

# Save the Brain
joblib.dump(model, os.path.join(models_dir, 'fertilizer_model.pkl'))

# Save the Dictionary (Label Encoder) so we can translate numbers back to names
joblib.dump(fert_encoder, os.path.join(models_dir, 'fertilizer_label_encoder.pkl'))

# Save the Column Structure (Crucial for One-Hot Encoding matching)
joblib.dump(X_processed.columns, os.path.join(models_dir, 'fertilizer_columns.pkl'))

print(f"💾 Model, Encoder & Columns saved to: {models_dir}")