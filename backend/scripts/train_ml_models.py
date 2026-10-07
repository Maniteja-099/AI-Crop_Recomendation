"""
ML Model Training Script - Train on Real Agricultural Data
Trains models on provided CSV datasets and saves them for production use
"""

import os
import sys
import pandas as pd
import numpy as np
import joblib
import warnings
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error

warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

DATA_DIR = "data"
MODELS_DIR = "backend/trained_models"
os.makedirs(MODELS_DIR, exist_ok=True)

print("="*70)
print("🌾 AGRICULTURAL ML MODEL TRAINING")
print("="*70)
print(f"Data Directory: {DATA_DIR}")
print(f"Models Directory: {MODELS_DIR}")
print("="*70 + "\n")

# ============================================================================
# 1. CROP RECOMMENDATION MODEL
# ============================================================================

print("📊 Training CROP RECOMMENDATION Model...")
print("-" * 70)

try:
    crop_df = pd.read_csv(os.path.join(DATA_DIR, "Crop_recommendation.csv"))
    print(f"✓ Loaded {len(crop_df)} crop recommendation samples")
    print(f"  Columns: {list(crop_df.columns)}")
    print(f"  Unique crops: {crop_df['label'].unique().tolist()}")
    print(f"  Data shape: {crop_df.shape}")
    
    # Prepare features and target
    X_crop = crop_df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y_crop = crop_df['label']
    
    # Train-test split
    X_train_crop, X_test_crop, y_train_crop, y_test_crop = train_test_split(
        X_crop, y_crop, test_size=0.2, random_state=42, stratify=y_crop
    )
    
    # Scale features
    crop_scaler = StandardScaler()
    X_train_crop_scaled = crop_scaler.fit_transform(X_train_crop)
    X_test_crop_scaled = crop_scaler.transform(X_test_crop)
    
    # Train Random Forest Classifier
    crop_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    crop_model.fit(X_train_crop_scaled, y_train_crop)
    
    # Evaluate
    y_pred_crop = crop_model.predict(X_test_crop_scaled)
    accuracy_crop = accuracy_score(y_test_crop, y_pred_crop)
    
    # Save model
    joblib.dump(crop_model, os.path.join(MODELS_DIR, 'crop_recommendation_model.pkl'))
    joblib.dump(crop_scaler, os.path.join(MODELS_DIR, 'crop_scaler.pkl'))
    
    print(f"✅ Crop Model Accuracy: {accuracy_crop*100:.2f}%")
    print(f"   Samples: {len(crop_df)} | Train: {len(X_train_crop)} | Test: {len(X_test_crop)}")
    print(f"   Model saved: crop_recommendation_model.pkl")
    print(f"   Scaler saved: crop_scaler.pkl\n")
    
except Exception as e:
    print(f"❌ Error training crop model: {e}\n")

# ============================================================================
# 2. SOIL FERTILITY MODEL
# ============================================================================

print("📊 Training SOIL FERTILITY Model...")
print("-" * 70)

try:
    soil_df = pd.read_csv(os.path.join(DATA_DIR, "soil_fertility.csv"))
    print(f"✓ Loaded {len(soil_df)} soil fertility samples")
    print(f"  Columns: {list(soil_df.columns)}")
    print(f"  Unique fertilizers: {soil_df['Fertilizer Name'].nunique()}")
    
    # Create a fertility score based on NPK
    soil_df['Fertility_Score'] = (soil_df['Nitrogen'] + soil_df['Potassium'] + soil_df['Phosphorous']) / 3
    soil_df['Fertility_Class'] = pd.cut(soil_df['Fertility_Score'], 
                                         bins=[0, 25, 50, 100],
                                         labels=['Low', 'Medium', 'High'])
    
    # Prepare features
    X_soil = soil_df[['Temparature', 'Humidity ', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous']]
    y_soil = soil_df['Fertility_Class']
    
    # Handle missing values
    X_soil = X_soil.fillna(X_soil.mean())
    
    # Encode categorical features if any
    soil_features_cols = X_soil.columns.tolist()
    
    # Train-test split
    X_train_soil, X_test_soil, y_train_soil, y_test_soil = train_test_split(
        X_soil, y_soil, test_size=0.2, random_state=42, stratify=y_soil
    )
    
    # Scale features
    soil_scaler = StandardScaler()
    X_train_soil_scaled = soil_scaler.fit_transform(X_train_soil)
    X_test_soil_scaled = soil_scaler.transform(X_test_soil)
    
    # Train Random Forest Classifier
    soil_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        n_jobs=-1
    )
    soil_model.fit(X_train_soil_scaled, y_train_soil)
    
    # Evaluate
    y_pred_soil = soil_model.predict(X_test_soil_scaled)
    accuracy_soil = accuracy_score(y_test_soil, y_pred_soil)
    
    # Save model
    joblib.dump(soil_model, os.path.join(MODELS_DIR, 'soil_fertility_model.pkl'))
    joblib.dump(soil_scaler, os.path.join(MODELS_DIR, 'soil_scaler.pkl'))
    joblib.dump(soil_features_cols, os.path.join(MODELS_DIR, 'soil_features.pkl'))
    
    print(f"✅ Soil Fertility Model Accuracy: {accuracy_soil*100:.2f}%")
    print(f"   Samples: {len(soil_df)} | Train: {len(X_train_soil)} | Test: {len(X_test_soil)}")
    print(f"   Classes: {soil_df['Fertility_Class'].unique().tolist()}")
    print(f"   Model saved: soil_fertility_model.pkl\n")
    
except Exception as e:
    print(f"❌ Error training soil fertility model: {e}\n")

# ============================================================================
# 3. CROP YIELD PREDICTION MODEL
# ============================================================================

print("📊 Training CROP YIELD PREDICTION Model...")
print("-" * 70)

try:
    yield_df = pd.read_csv(os.path.join(DATA_DIR, "Crop Yiled.csv"))
    print(f"✓ Loaded {len(yield_df)} crop yield samples")
    print(f"  Columns: {list(yield_df.columns)}")
    print(f"  Data shape: {yield_df.shape}")
    
    # Prepare data
    yield_df_clean = yield_df.fillna(yield_df.mean(numeric_only=True))
    
    # Identify numeric columns for training
    numeric_cols = yield_df_clean.select_dtypes(include=[np.number]).columns.tolist()
    
    if len(numeric_cols) < 2:
        print("⚠️  Insufficient numeric columns for yield model\n")
    else:
        # Assume last numeric column is target (yield)
        target_col = numeric_cols[-1]
        feature_cols = numeric_cols[:-1]
        
        X_yield = yield_df_clean[feature_cols]
        y_yield = yield_df_clean[target_col]
        
        print(f"  Features: {feature_cols}")
        print(f"  Target: {target_col}")
        print(f"  Yield range: {y_yield.min():.2f} - {y_yield.max():.2f}")
        
        # Train-test split
        X_train_yield, X_test_yield, y_train_yield, y_test_yield = train_test_split(
            X_yield, y_yield, test_size=0.2, random_state=42
        )
        
        # Scale features
        yield_scaler = StandardScaler()
        X_train_yield_scaled = yield_scaler.fit_transform(X_train_yield)
        X_test_yield_scaled = yield_scaler.transform(X_test_yield)
        
        # Train Random Forest Regressor
        yield_model = RandomForestRegressor(
            n_estimators=150,
            max_depth=20,
            random_state=42,
            n_jobs=-1
        )
        yield_model.fit(X_train_yield_scaled, y_train_yield)
        
        # Evaluate
        y_pred_yield = yield_model.predict(X_test_yield_scaled)
        rmse_yield = np.sqrt(mean_squared_error(y_test_yield, y_pred_yield))
        
        # Save model
        joblib.dump(yield_model, os.path.join(MODELS_DIR, 'yield_model.pkl'))
        joblib.dump(yield_scaler, os.path.join(MODELS_DIR, 'yield_scaler.pkl'))
        joblib.dump(feature_cols, os.path.join(MODELS_DIR, 'yield_columns.pkl'))
        
        print(f"✅ Yield Model RMSE: {rmse_yield:.2f}")
        print(f"   Samples: {len(yield_df)} | Train: {len(X_train_yield)} | Test: {len(X_test_yield)}")
        print(f"   Model saved: yield_model.pkl\n")
        
except FileNotFoundError:
    print(f"⚠️  Crop yield file not found (expected: data/Crop Yiled.csv)\n")
except Exception as e:
    print(f"❌ Error training yield model: {e}\n")

# ============================================================================
# 4. FERTILIZER RECOMMENDATION MODEL
# ============================================================================

print("📊 Training FERTILIZER RECOMMENDATION Model...")
print("-" * 70)

try:
    fert_df = pd.read_csv(os.path.join(DATA_DIR, "soil_fertility.csv"))
    print(f"✓ Using {len(fert_df)} fertilizer recommendation samples")
    
    # Prepare features (note: 'Humidity ' has trailing space in CSV)
    X_fert = fert_df[['Temparature', 'Humidity ', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous']]
    y_fert = fert_df['Fertilizer Name']
    
    X_fert = X_fert.fillna(X_fert.mean())
    
    print(f"  Features: {list(X_fert.columns)}")
    print(f"  Unique fertilizers: {y_fert.nunique()}")
    print(f"  Fertilizers: {y_fert.unique().tolist()}")
    
    # Train-test split
    X_train_fert, X_test_fert, y_train_fert, y_test_fert = train_test_split(
        X_fert, y_fert, test_size=0.2, random_state=42, stratify=y_fert
    )
    
    # Scale features
    fert_scaler = StandardScaler()
    X_train_fert_scaled = fert_scaler.fit_transform(X_train_fert)
    X_test_fert_scaled = fert_scaler.transform(X_test_fert)
    
    # Encode labels
    fert_encoder = LabelEncoder()
    y_train_fert_encoded = fert_encoder.fit_transform(y_train_fert)
    y_test_fert_encoded = fert_encoder.transform(y_test_fert)
    
    # Train Random Forest Classifier
    fert_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    fert_model.fit(X_train_fert_scaled, y_train_fert_encoded)
    
    # Evaluate
    y_pred_fert = fert_model.predict(X_test_fert_scaled)
    accuracy_fert = accuracy_score(y_test_fert_encoded, y_pred_fert)
    
    # Save model
    joblib.dump(fert_model, os.path.join(MODELS_DIR, 'fertilizer_model.pkl'))
    joblib.dump(fert_scaler, os.path.join(MODELS_DIR, 'fertilizer_scaler.pkl'))
    joblib.dump(fert_encoder, os.path.join(MODELS_DIR, 'fertilizer_label_encoder.pkl'))
    
    print(f"✅ Fertilizer Model Accuracy: {accuracy_fert*100:.2f}%")
    print(f"   Samples: {len(fert_df)} | Train: {len(X_train_fert)} | Test: {len(X_test_fert)}")
    print(f"   Model saved: fertilizer_model.pkl\n")
    
except Exception as e:
    print(f"❌ Error training fertilizer model: {e}\n")

# ============================================================================
# WEATHER RISK MODEL
# ============================================================================

print("📊 Training WEATHER RISK MODEL...")
print("-" * 70)

try:
    weather_df = pd.read_csv(os.path.join(DATA_DIR, "daily_weather.csv"))
    print(f"✓ Loaded {len(weather_df)} weather samples")
    print(f"  Columns: {list(weather_df.columns)}")
    
    # Extract month from date
    weather_df['date'] = pd.to_datetime(weather_df['date'], format='%d-%m-%Y')
    weather_df['month'] = weather_df['date'].dt.month
    
    # Create risk classes
    def classify_weather_risk(row):
        temp = row.get('temperature_2m_max', 0)
        precip = row.get('precipitation_sum', 0)
        month = row['month']
        
        # Monsoon months (June-September)
        if month in [6, 7, 8, 9] and precip > 100:
            return 'Flood Risk'
        # Summer months (March-May)
        elif month in [3, 4, 5] and temp > 35:
            return 'Drought Risk'
        else:
            return 'Normal'
    
    weather_df['risk_class'] = weather_df.apply(classify_weather_risk, axis=1)
    
    print(f"  Risk distribution: {weather_df['risk_class'].value_counts().to_dict()}")
    
    # Sample if too large
    if len(weather_df) > 10000:
        weather_df_sample = weather_df.sample(n=10000, random_state=42)
    else:
        weather_df_sample = weather_df
    
    # Prepare features
    X_weather = weather_df_sample[['month', 'temperature_2m_max']]
    y_weather = weather_df_sample['risk_class']
    
    # Train-test split
    X_train_weather, X_test_weather, y_train_weather, y_test_weather = train_test_split(
        X_weather, y_weather, test_size=0.2, random_state=42, stratify=y_weather
    )
    
    # Encode labels
    weather_encoder = LabelEncoder()
    y_train_weather_encoded = weather_encoder.fit_transform(y_train_weather)
    y_test_weather_encoded = weather_encoder.transform(y_test_weather)
    
    # Train classifier
    weather_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    weather_model.fit(X_train_weather, y_train_weather_encoded)
    
    # Evaluate
    y_pred_weather = weather_model.predict(X_test_weather)
    accuracy_weather = accuracy_score(y_test_weather_encoded, y_pred_weather)
    
    # Save model
    joblib.dump(weather_model, os.path.join(MODELS_DIR, 'weather_risk_model.pkl'))
    joblib.dump(weather_encoder, os.path.join(MODELS_DIR, 'weather_label_encoder.pkl'))
    
    print(f"✅ Weather Model Accuracy: {accuracy_weather*100:.2f}%")
    print(f"   Samples: {len(weather_df_sample)} | Train: {len(X_train_weather)} | Test: {len(X_test_weather)}")
    print(f"   Classes: {weather_encoder.classes_.tolist()}")
    print(f"   Model saved: weather_risk_model.pkl\n")
    
except Exception as e:
    print(f"❌ Error training weather model: {e}\n")

# ============================================================================
# SUMMARY
# ============================================================================

print("="*70)
print("✅ MODEL TRAINING COMPLETE")
print("="*70)

# List saved models
models_saved = os.listdir(MODELS_DIR)
print(f"\n📁 Models saved in '{MODELS_DIR}':")
for model in sorted(models_saved):
    if model.endswith('.pkl'):
        filepath = os.path.join(MODELS_DIR, model)
        filesize = os.path.getsize(filepath) / 1024  # KB
        print(f"   ✓ {model:<40} ({filesize:.1f} KB)")

print("\n" + "="*70)
print("🚀 Ready to use! Restart the backend server to load trained models.")
print("="*70)
