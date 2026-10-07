import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# --- 1. SETUP PATHS ---
current_script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_script_dir, '..', 'data', 'Crop Yiled.csv')

print(f"🔍 Looking for yield data at: {csv_path}")

if not os.path.exists(csv_path):
    print("❌ ERROR: crop_yield.csv not found.")
    exit()

# --- 2. LOAD DATA ---
df = pd.read_csv(csv_path)
print("✅ File loaded successfully!")

# Clean column names (strip spaces, lowercase)
df.columns = df.columns.str.strip().str.lower()

# Handle typo in column name: 'yeild' -> 'yield'
if 'yeild' in df.columns:
    df.rename(columns={'yeild': 'yield'}, inplace=True)
    print("⚙️ Renamed 'yeild' column to 'yield'")

# Expected columns often include: 'crop', 'season', 'state', 'area', 'production', ...
# We need to calculate Yield if it's not there: Yield = Production / Area

if 'yield' not in df.columns:
    # Some datasets have 'Production' and 'Area' but not 'Yield'
    if 'production' in df.columns and 'area' in df.columns:
        print("⚙️ Calculating Yield column from Production/Area...")
        df['yield'] = df['production'] / df['area']
        # Remove infinite values if Area was 0
        df = df.replace([np.inf, -np.inf], np.nan).dropna()
    else:
        print("⚠️ Warning: 'Yield' column missing. Using 'Production' as target.")
        df.rename(columns={'production': 'yield'}, inplace=True)

# --- 3. PREPARE DATA ---
# We need to convert Text columns (Crop, Season, State) to Numbers
# Select relevant features. 
# Note: We DROP 'production' because that's the answer, not an input.
categorical_cols = ['crop', 'season', 'state'] # Adjust based on your CSV
numeric_cols = ['area', 'rainfall', 'fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'temperature', 'n', 'p', 'k', 'temp'] # Add whatever your csv has

# Filter only columns that actually exist in your dataframe
available_cats = [c for c in categorical_cols if c in df.columns]
available_nums = [c for c in numeric_cols if c in df.columns]

# Combine them
df_final = df[available_cats + available_nums + ['yield']].copy()

# One-Hot Encoding (The Magic Step)
# This turns "Rice" into [1, 0, 0...] and "Maize" into [0, 1, 0...]
df_final = pd.get_dummies(df_final, columns=available_cats)

X = df_final.drop('yield', axis=1)
y = df_final['yield']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- 4. TRAIN MODEL (REGRESSION) ---
print("Training Yield Prediction Model (this may take a moment)...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 5. EVALUATE ---
preds = model.predict(X_test)
r2 = r2_score(y_test, preds)
print(f"✅ Yield Model Trained!")
print(f"📊 R2 Score (Accuracy): {r2 * 100:.2f}%") 
# R2 Score explains how well the model fits the data (100% is perfect)

# --- 6. SAVE MODEL & COLUMNS ---
models_dir = os.path.join(current_script_dir, '..', 'models')

# Save the model
joblib.dump(model, os.path.join(models_dir, 'yield_model.pkl'))

# CRITICAL: Save the column names. 
# When we predict later, we must provide inputs in this EXACT order.
joblib.dump(X.columns, os.path.join(models_dir, 'yield_columns.pkl'))

print(f"💾 Model & Column Map saved to: {models_dir}")