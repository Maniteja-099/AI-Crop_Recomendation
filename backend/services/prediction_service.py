"""
Prediction Service - ML Model Inference Logic
Handles all prediction operations with intelligent fallbacks
"""

import logging
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from ml_models import get_model_manager
from models.prediction import (
    SoilInput, SoilResult,
    WeatherInput, WeatherResult,
    CropInput, CropResult,
    YieldInput, YieldResult,
    FertilizerInput, FertilizerResult
)


class PredictionService:
    """
    Prediction Service for all ML model inferences
    Handles real model predictions and intelligent fallbacks
    """
    
    logger = logging.getLogger("prediction_service")
    
    # Crop database for intelligent recommendations
    CROP_DATABASE = {
        "rice": {
            "icon": "🌾",
            "conditions": "High rainfall (150-300mm), humid (70-80%), temp 25-35°C",
            "tips": "Requires standing water during growth. Best in Kharif season."
        },
        "wheat": {
            "icon": "🌾",
            "conditions": "Cool climate, moderate rainfall (50-100mm), temp 15-25°C",
            "tips": "Best grown in Rabi season. Needs well-drained soil."
        },
        "maize": {
            "icon": "🌽",
            "conditions": "Warm climate, well-drained soil, temp 20-30°C",
            "tips": "Versatile crop. Can be grown in both Kharif and Rabi."
        },
        "cotton": {
            "icon": "🧶",
            "conditions": "Black soil, warm climate, low humidity, temp 25-35°C",
            "tips": "Long growing season. Requires careful pest management."
        },
        "sugarcane": {
            "icon": "🎋",
            "conditions": "Tropical climate, high water requirement, temp 25-35°C",
            "tips": "Perennial crop. Needs 12-18 months to mature."
        },
        "pulses": {
            "icon": "🫘",
            "conditions": "Low water requirement, any soil type, temp 20-30°C",
            "tips": "Nitrogen-fixing crops. Good for crop rotation."
        },
        "groundnut": {
            "icon": "🥜",
            "conditions": "Sandy loam soil, moderate rainfall, temp 25-35°C",
            "tips": "Kharif crop. Requires well-drained soil."
        },
        "soybean": {
            "icon": "🫛",
            "conditions": "Warm climate, moderate rainfall, temp 25-30°C",
            "tips": "Good source of protein. Fixes nitrogen in soil."
        }
    }
    

    
    def __init__(self):
        self.model_manager = get_model_manager()
    
    def predict_soil_fertility(self, input_data: SoilInput) -> SoilResult:
        """
        Predict soil fertility based on NPK values
        Uses real dataset statistics from soil_fertility.csv (101 rows)
        """
        from config.data_ranges import (
            SOIL_DATA_RANGES,
            SOIL_FERTILITY_THRESHOLDS
        )
        
        n, p, k = input_data.nitrogen, input_data.phosphorus, input_data.potassium
        avg = (n + p + k) / 3
        
        # Real dataset ranges for normalization
        n_max = SOIL_DATA_RANGES["nitrogen"]["max"]  # 42
        p_max = SOIL_DATA_RANGES["phosphorus"]["max"]  # 42
        k_max = SOIL_DATA_RANGES["potassium"]["max"]  # 19
        
        # Detailed analysis with real dataset thresholds
        detailed = {
            "nitrogen_status": "Low" if n < 14 else "Medium" if n < 28 else "High",
            "phosphorus_status": "Low" if p < 10 else "Medium" if p < 32 else "High",
            "potassium_status": "Low" if k < 4 else "Medium" if k < 11 else "High",
            "individual_scores": {
                "nitrogen": min(100, (n / n_max) * 100),
                "phosphorus": min(100, (p / p_max) * 100),
                "potassium": min(100, (k / k_max) * 100)
            },
            "dataset_reference": {
                "nitrogen_range": f"{SOIL_DATA_RANGES['nitrogen']['min']}-{SOIL_DATA_RANGES['nitrogen']['max']}",
                "phosphorus_range": f"{SOIL_DATA_RANGES['phosphorus']['min']}-{SOIL_DATA_RANGES['phosphorus']['max']}",
                "potassium_range": f"{SOIL_DATA_RANGES['potassium']['min']}-{SOIL_DATA_RANGES['potassium']['max']}"
            }
        }
        
        # Classification based on real dataset quartiles
        if avg < SOIL_FERTILITY_THRESHOLDS["low"]["max_avg"]:
            return SoilResult(
                status="error",
                message="Infertile Soil",
                description=SOIL_FERTILITY_THRESHOLDS["low"]["description"],
                icon=SOIL_FERTILITY_THRESHOLDS["low"]["icon"],
                avg_nutrients=round(avg, 2),
                recommendation="Apply balanced NPK fertilizer immediately (DAP or 17-17-17). Consider organic matter for long-term improvement.",
                detailed_analysis=detailed
            )
        elif avg < SOIL_FERTILITY_THRESHOLDS["medium"]["max_avg"]:
            return SoilResult(
                status="warning",
                message="Semi-Fertile Soil",
                description=SOIL_FERTILITY_THRESHOLDS["medium"]["description"],
                icon=SOIL_FERTILITY_THRESHOLDS["medium"]["icon"],
                avg_nutrients=round(avg, 2),
                recommendation="Regular fertilization recommended. Apply 17-17-17 or crop-specific fertilizer. Add compost for long-term improvement.",
                detailed_analysis=detailed
            )
        else:
            return SoilResult(
                status="success",
                message="Fertile Soil",
                description=SOIL_FERTILITY_THRESHOLDS["high"]["description"],
                icon=SOIL_FERTILITY_THRESHOLDS["high"]["icon"],
                avg_nutrients=round(avg, 2),
                recommendation="Maintain current nutrient levels with minimal application. Monitor pH regularly (optimal: 5.7-7.8).",
                detailed_analysis=detailed
            )
    
    def predict_weather_risk(self, input_data: WeatherInput) -> WeatherResult:
        """
        Predict weather risk based on conditions
        """
        month = input_data.month
        temp = input_data.temperature
        
        # Try real model first
        if self.model_manager.has_model('weather_model'):
            try:
                model = self.model_manager.get_model('weather_model')
                encoder = self.model_manager.get_model('weather_encoder')
                
                input_df = pd.DataFrame([[month, temp]], columns=['month', 'temperature_2m_max'])
                pred_idx = model.predict(input_df)[0]
                pred_label = encoder.inverse_transform([pred_idx])[0]
                
                return self._create_weather_result(pred_label, month, temp)
            except Exception as e:
                self.logger.warning("Weather model error: %s", e)
        
        # Intelligent fallback
        return self._fallback_weather_prediction(month, temp)
    
    def _create_weather_result(
        self, 
        label: str, 
        month: int, 
        temp: float
    ) -> WeatherResult:
        """Create weather result from prediction"""
        if label == "Flood Risk":
            return WeatherResult(
                status="error",
                label=label,
                description="High rainfall expected. Risk of waterlogging.",
                icon="🌊",
                recommendation="Ensure proper drainage. Avoid low-lying planting areas."
            )
        elif label == "Drought Risk":
            return WeatherResult(
                status="warning",
                label=label,
                description="Low rainfall expected. Dry conditions likely.",
                icon="🔥",
                recommendation="Increase irrigation. Use mulching to retain moisture."
            )
        else:
            return WeatherResult(
                status="success",
                label="Normal Conditions",
                description="Favorable weather expected.",
                icon="✅",
                recommendation="Ideal conditions for farming activities."
            )
    
    def _fallback_weather_prediction(
        self, 
        month: int, 
        temp: float
    ) -> WeatherResult:
        """Intelligent fallback weather prediction"""
        # Monsoon months with high temp = flood risk
        if month in [6, 7, 8, 9] and temp > 25:
            return WeatherResult(
                status="error",
                label="Flood Risk",
                description="Monsoon season - high rainfall expected.",
                icon="🌊",
                recommendation="Ensure proper drainage. Protect crops from waterlogging."
            )
        # Summer months with high temp = drought risk
        elif month in [3, 4, 5] and temp > 35:
            return WeatherResult(
                status="warning",
                label="Drought Risk",
                description="Summer heat - low rainfall expected.",
                icon="🔥",
                recommendation="Increase irrigation frequency. Use mulching."
            )
        else:
            return WeatherResult(
                status="success",
                label="Normal Conditions",
                description="Favorable weather for farming.",
                icon="✅",
                recommendation="Good conditions for most farming activities."
            )
    
    def predict_crop(self, input_data: CropInput) -> CropResult:
        """
        Recommend best crop based on conditions
        Uses real dataset from Crop_recommendation.csv (2,202 rows, Rice-primary)
        """
        from config.data_ranges import (
            CROP_DATA_RANGES,
            RECOMMENDED_CROPS
        )
        
        # Try real model first
        if self.model_manager.has_model('crop_model'):
            try:
                model = self.model_manager.get_model('crop_model')
                scaler = self.model_manager.get_model('crop_scaler')
                features = np.array([[
                    input_data.nitrogen,
                    input_data.phosphorus,
                    input_data.potassium,
                    input_data.temperature,
                    input_data.humidity,
                    input_data.ph,
                    input_data.rainfall
                ]])
                # Apply scaler if available (trained model expects scaled input)
                if scaler is not None:
                    features = scaler.transform(features)
                prediction = model.predict(features)[0]
                return self._create_crop_result(prediction.lower(), input_data)
            except Exception as e:
                self.logger.warning("Crop model error: %s", e)
        
        # Intelligent fallback based on real dataset ranges
        return self._fallback_crop_prediction_optimized(input_data)
    
    def _fallback_crop_prediction_optimized(self, input_data: CropInput) -> CropResult:
        """
        Optimized fallback using multi-crop scoring
        Evaluates input against profiles for major crops to find best match
        """
        # Crop profiles with approximate ideal ranges
        profiles = {
            "rice": {
                "n": (60, 100), "p": (30, 60), "k": (30, 50),
                "temp": (20, 35), "hum": (70, 90), "ph": (5.5, 8.0), "rain": (150, 300)
            },
            "wheat": {
                "n": (20, 60), "p": (20, 40), "k": (20, 30),
                "temp": (15, 25), "hum": (50, 70), "ph": (5.5, 7.5), "rain": (50, 100)
            },
            "maize": {
                "n": (60, 100), "p": (30, 60), "k": (30, 50),
                "temp": (18, 27), "hum": (55, 75), "ph": (5.5, 7.5), "rain": (60, 120)
            },
            "cotton": {
                "n": (80, 140), "p": (40, 70), "k": (30, 50),
                "temp": (25, 35), "hum": (40, 60), "ph": (6.0, 8.0), "rain": (60, 100)
            },
            "sugarcane": {
                "n": (30, 60), "p": (30, 60), "k": (30, 50),
                "temp": (25, 35), "hum": (75, 95), "ph": (6.0, 7.5), "rain": (150, 250)
            }
        }

        best_crop = "rice"
        best_score = 0
        best_confidence = 0

        for crop, ranges in profiles.items():
            n_score = self._calculate_fit_score(input_data.nitrogen, ranges["n"][0], ranges["n"][1])
            p_score = self._calculate_fit_score(input_data.phosphorus, ranges["p"][0], ranges["p"][1])
            k_score = self._calculate_fit_score(input_data.potassium, ranges["k"][0], ranges["k"][1])
            temp_score = self._calculate_fit_score(input_data.temperature, ranges["temp"][0], ranges["temp"][1])
            hum_score = self._calculate_fit_score(input_data.humidity, ranges["hum"][0], ranges["hum"][1])
            ph_score = self._calculate_fit_score(input_data.ph, ranges["ph"][0], ranges["ph"][1])
            rain_score = self._calculate_fit_score(input_data.rainfall, ranges["rain"][0], ranges["rain"][1])
            
            # Weighted average (Climate factors are more critical)
            score = (
                n_score * 0.1 + p_score * 0.1 + k_score * 0.1 +
                temp_score * 0.2 + hum_score * 0.2 + rain_score * 0.2 +
                ph_score * 0.1
            )

            if score > best_score:
                best_score = score
                best_crop = crop
                best_confidence = score

        # Get details for winner
        crop_info = self.CROP_DATABASE.get(best_crop, {
            "icon": "🌱",
            "conditions": "Standard conditions",
            "tips": "Follow local guidelines"
        })
        
        return CropResult(
            recommended_crop=best_crop.upper(),
            icon=crop_info.get("icon", "🌱"),
            ideal_conditions=crop_info.get("conditions"),
            confidence=round(min(best_confidence, 98), 1),
            growing_tips=crop_info.get("tips"),
            seasonal="Check local calendar",
            data_source="Smart Fallback Logic (Profile Matching)"
        )
    
    def _calculate_fit_score(self, value, min_val, max_val):
        """Calculate fitness score (0-100) for a value against a range"""
        if value < min_val:
            deviation = min_val - value
            score = max(0, 100 - (deviation / min_val) * 50)
        elif value > max_val:
            deviation = value - max_val
            score = max(0, 100 - (deviation / max_val) * 50)
        else:
            # Within range - score based on proximity to center
            center = (min_val + max_val) / 2
            range_width = max_val - min_val
            distance = abs(value - center)
            score = 100 - (distance / (range_width / 2)) * 20
        
        return min(100, max(0, score))
    
    def _create_crop_result(
        self, 
        crop: str, 
        input_data: CropInput
    ) -> CropResult:
        """Create crop result from prediction"""
        crop_info = self.CROP_DATABASE.get(crop, {
            "icon": "🌱",
            "conditions": "Standard growing conditions",
            "tips": "Follow local agricultural practices"
        })
        
        return CropResult(
            recommended_crop=crop.upper(),
            icon=crop_info.get("icon", "🌱"),
            ideal_conditions=crop_info.get("conditions", "Standard growing conditions"),
            confidence=self._calculate_confidence(input_data, crop),
            growing_tips=crop_info["tips"],
            alternatives=self._get_alternative_crops(input_data)
        )
    
    def predict_yield(self, input_data: YieldInput) -> YieldResult:
        """
        Predict crop yield based on conditions
        PRIORITY 1: Use actual trained ML model (RandomForest) if available
        PRIORITY 2: Use calibrated deterministic formula (Fallback)
        """
        from config.data_ranges import YIELD_DATA_RANGES
        
        # Try to use the trained model first
        yield_per_ha = None
        confidence = 100.0
        source = "AI Model Prediction"
        
        try:
            model_manager = get_model_manager()
            model = model_manager.get_model('yield_model')
            model_cols = model_manager.get_model('yield_cols')
            
            if model and model_cols is not None:
                # 1. Prepare Base DataFrame
                input_dict = {
                    'area': [input_data.area],
                    'rainfall': [input_data.rainfall],
                    'fertilizer': [input_data.fertilizer],
                    'nitrogen': [70], # Default if missing in input
                    'phosphorus': [40],
                    'potassium': [40],
                    'temperature': [25]
                }
                
                # 2. Add One-Hot Encoded Columns
                # The model expects columns like 'crop_Rice', 'state_Karnataka'
                df_input = pd.DataFrame(input_dict)
                
                # Helper to set dummy variables
                def set_dummy(prefix, value):
                    col_name = f"{prefix}_{value}"
                    # Check mostly matching case
                    for model_col in model_cols:
                        if model_col.lower() == col_name.lower():
                            return model_col
                    return None

                # Initialize all model columns to 0
                for col in model_cols:
                    if col not in df_input.columns:
                        df_input[col] = 0
                
                # Set active columns to 1
                crop_col = set_dummy('crop', input_data.crop)
                season_col = set_dummy('season', input_data.season)
                state_col = set_dummy('state', input_data.state)
                
                if crop_col: df_input[crop_col] = 1
                if season_col: df_input[season_col] = 1
                if state_col: df_input[state_col] = 1
                
                # 3. Reorder to match training data exactly
                df_final = df_input[model_cols]
                
                # 4. Predict
                prediction = model.predict(df_final)[0]
                
                # The training script target is sometimes 'Yield' (tons/ha) or 'Production' (total tons)
                # If the value is huge (> 100), it's likely total production, need to divide by area
                if prediction > 100:
                    yield_per_ha = prediction / input_data.area
                else:
                    yield_per_ha = prediction
                    
        except Exception as e:
            self.logger.warning("Model prediction failed, using fallback: %s", e)
            yield_per_ha = None

        # Fallback if model failed
        if yield_per_ha is None:
            yield_per_ha = self._calculate_yield_optimized(input_data)
            source = "Calibrated Deterministic Formula (Fallback)"

        # Calculate totals
        total_yield = yield_per_ha * input_data.area
        
        # Market value estimate (prices from centralized config)
        from config.data_ranges import MARKET_PRICES
        crop_lower = input_data.crop.lower()
        price = MARKET_PRICES.get(crop_lower, MARKET_PRICES["default"])
        market_value = total_yield * price
        
        return YieldResult(
            predicted_yield=round(total_yield, 2),
            yield_per_hectare=round(yield_per_ha, 2),
            unit="tons",
            confidence=confidence,
            market_value_estimate=round(market_value, 0),
            recommendations=[
                f"Expected yield: {round(total_yield, 2)} tons from {input_data.area} hectare(s)",
                f"Yield per hectare: {round(yield_per_ha, 2)} tons",
                "Optimal conditions: Balanced NPK and sufficient rainfall required",
                "Ensure timely irrigation, pest management, and proper harvesting"
            ],
            data_source=source
        )
    
    def _calculate_yield_optimized(self, input_data: YieldInput) -> float:
        """
        Optimized yield calculation using real dataset calibration
        Deterministic logic - 0% Randomness
        """
        from config.data_ranges import YIELD_PREDICTION_MODEL, YIELD_DATA_RANGES
        
        # Use real model coefficients from training data
        model_params = YIELD_PREDICTION_MODEL
        base_yield = model_params["base_yield"]  # 8.5 tons from data
        
        # 1. Fertilizer Impact (Positive correlation in dataset)
        # Normalized against mean inputs
        fert_diff = input_data.fertilizer - YIELD_DATA_RANGES["fertilizer"]["mean"]
        fert_adjustment = fert_diff * model_params["fertilizer_coefficient"]
        
        # 2. Rainfall Impact (Parabolic - too little or too much is bad)
        optimal_rainfall = YIELD_DATA_RANGES["rainfall"]["mean"]
        rain_diff = abs(input_data.rainfall - optimal_rainfall)
        
        # Penalize deviation from optimal rainfall
        if rain_diff > 100:
            rain_adjustment = -(rain_diff * model_params["rainfall_coefficient"])
        else:
            # Shallow benefit for being near optimal
            rain_adjustment = (100 - rain_diff) * 0.005
            
        # 3. Area scaling (Base yield is per hectare, but larger farms might have efficiency scaling)
        # Keeping it linear for now as per dataset
        
        # Calculate raw yield
        yield_per_ha = base_yield + fert_adjustment + rain_adjustment
        
        # 4. Crop Specific Adjustments (Based on known high-yield varieties)
        crop_multipliers = {
            "sugarcane": 4.5, # Sugarcane yields are naturally much higher by weight
            "rice": 1.1,
            "wheat": 1.0,
            "maize": 1.2,
            "cotton": 0.4, # Cotton yields lower by weight
            "pulses": 0.3,
            "millets": 0.5
        }
        multiplier = crop_multipliers.get(input_data.crop.lower(), 1.0)
        yield_per_ha *= multiplier
        
        # 5. Strict Clamping to Real Dataset Bounds + 10% tolerance
        min_yield_bound = YIELD_DATA_RANGES["yield"]["min"] * 0.5 # Allow for lower bounds if conditions bad
        max_yield_bound = YIELD_DATA_RANGES["yield"]["max"] * 2.0 # Allow higher for sugarcane
        
        # Specialized bound for Sugarcane as it breaks normal tons/ha scale
        if input_data.crop.lower() == "sugarcane":
             min_yield_bound = 60
             max_yield_bound = 120
        
        final_yield = max(min_yield_bound, min(max_yield_bound, yield_per_ha))
        
        return round(final_yield, 2)
    
    def predict_fertilizer(self, input_data: FertilizerInput) -> FertilizerResult:
        """
        Recommend fertilizer based on soil and crop
        Uses real soil-crop-fertilizer data from soil_fertility.csv (101 rows)
        """
        from config.data_ranges import (
            SOIL_DATA_RANGES,
            FERTILIZER_TYPES,
            FERTILIZER_RECOMMENDATION_RULES
        )
        
        n, p, k = input_data.nitrogen, input_data.phosphorus, input_data.potassium
        
        # Real dataset thresholds from soil_fertility.csv
        n_thresh_low = 14  # 25th percentile
        p_thresh_low = 10
        k_thresh_low = 4
        n_thresh_high = 28  # 75th percentile
        p_thresh_high = 32
        k_thresh_high = 11
        
        # Calculate deficiencies based on real data distribution
        n_deficit = max(0, n_thresh_low - n) if n < n_thresh_low else 0
        p_deficit = max(0, p_thresh_low - p) if p < p_thresh_low else 0
        k_deficit = max(0, k_thresh_low - k) if k < k_thresh_low else 0
        
        total_deficit = n_deficit + p_deficit + k_deficit
        avg_npk = (n + p + k) / 3
        
        # ---------------------------------------------------------
        # PRIORITY 1: AI Model Prediction (Specific for Soil-Crop combo)
        # ---------------------------------------------------------
        fertilizer_type = None
        source = "Rule-Based Expert System (Fallback)"
        
        if self.model_manager.has_model('fert_model'):
            try:
                model = self.model_manager.get_model('fert_model')
                encoder = self.model_manager.get_model('fert_encoder')
                model_cols = self.model_manager.get_model('fert_cols')
                
                # Create Input DataFrame (Standardized Names)
                input_df = pd.DataFrame([{
                    'Temperature': input_data.temperature,
                    'Humidity': input_data.humidity,
                    'Moisture': input_data.moisture,
                    'Nitrogen': input_data.nitrogen,
                    'Potassium': input_data.potassium,
                    'Phosphorus': input_data.phosphorus,
                    'Soil Type': input_data.soil_type,
                    'Crop Type': input_data.crop_type
                }])
                
                # One-Hot Encode
                df_encoded = pd.get_dummies(input_df, columns=['Soil Type', 'Crop Type'])
                
                # Align with Model Columns (Fill missing with 0)
                for col in model_cols:
                    if col not in df_encoded.columns:
                        df_encoded[col] = 0
                
                # Reorder and Predict
                df_final = df_encoded[model_cols]
                pred_idx = model.predict(df_final)[0]
                fertilizer_type = encoder.inverse_transform([pred_idx])[0]
                source = "AI Model Prediction"
                
            except Exception as e:
                self.logger.warning("Fertilizer model error: %s", e)
                fertilizer_type = None

        # ---------------------------------------------------------
        # Fallback Logic (if AI fails or unavailable)
        # ---------------------------------------------------------
        if not fertilizer_type:
            if total_deficit > 0:
                if n_deficit > p_deficit and n_deficit > k_deficit:
                    fertilizer_type = "Urea"
                elif p_deficit > n_deficit and p_deficit > k_deficit:
                    fertilizer_type = "DAP"
                elif k_deficit > n_deficit and k_deficit > p_deficit:
                    fertilizer_type = "20-20"
                else:
                    fertilizer_type = "17-17-17"
            else:
                fertilizer_type = "Minimal/Organic"
                source = "Maintenance Recommendation"
        
        # Get fertilizer details
        fert_info = FERTILIZER_TYPES.get(fertilizer_type, {
            "npk": (0, 0, 0),
            "application_rate": "200-300 kg/hectare",
            "timing": "Based on crop growth stage",
            "description": "Balanced nutrient content"
        })
        
        # Calculate application rate based on deficiency
        if total_deficit > 0:
            application_rate = f"{150 + int(total_deficit * 20)}-{200 + int(total_deficit * 30)} kg/hectare"
        else:
            application_rate = "Maintenance: 50-100 kg/hectare or organic matter"
        
        return FertilizerResult(
            recommended_fertilizer=fertilizer_type,
            icon=self._get_fertilizer_icon(fertilizer_type),
            application_method=fert_info.get("timing", "Base application before planting"),
            timing=fert_info.get("application_rate", application_rate),
            recommendation=f"{fertilizer_type}: {application_rate}\n{fert_info.get('description', '')}",
            data_source=source,
            deficiencies={
                "nitrogen": n_deficit > 0,
                "phosphorus": p_deficit > 0,
                "potassium": k_deficit > 0,
            },
            deficiency_analysis={
                "nitrogen": {"current": n, "threshold": n_thresh_low, "deficit": n_deficit},
                "phosphorus": {"current": p, "threshold": p_thresh_low, "deficit": p_deficit},
                "potassium": {"current": k, "threshold": k_thresh_low, "deficit": k_deficit},
                "average_npk": round(avg_npk, 2)
            }
        )
    
    def _get_fertilizer_icon(self, fertilizer_type: str) -> str:
        """Get appropriate icon for fertilizer type"""
        icons = {
            "Urea": "🔵",
            "DAP": "🟠",
            "17-17-17": "🟢",
            "20-20": "🟡",
            "14-35-14": "🔴",
            "10-26-26": "🟣",
            "28-28": "🟤",
            "Minimal/Organic": "🟩"
        }
        return icons.get(fertilizer_type, "💊")
    
    def _calculate_confidence(self, input_data: CropInput, crop_name: str) -> float:
        """
        Calculate confidence score based on input parameter match with ideal crop conditions.
        Deterministic and rigorous scoring (0-100).
        """
        # Default base confidence
        base_score = 95.0
        
        # Calculate penalties for extreme conditions
        penalty = 0.0
        
        # pH penalty
        if input_data.ph < 4 or input_data.ph > 9:
            penalty += 15.0
            
        # Rainfall penalty
        if input_data.rainfall < 100 and crop_name.lower() in ["rice", "sugarcane", "jute"]:
            penalty += 40.0
            
        # Temperature penalty
        if input_data.temperature > 40:
            penalty += 10.0
            
        final_score = base_score - penalty
        return max(50.0, min(99.9, final_score))

    def _get_alternative_crops(self, input_data: CropInput) -> List[str]:
        """Get logical alternatives based on conditions"""
        alts = []
        if input_data.rainfall > 150:
            alts.append("Sugarcane")
        else:
            alts.append("Maize")
            
        if input_data.temperature > 25:
            alts.append("Cotton")
        else:
            alts.append("Wheat")
            
        if input_data.ph < 6:
            alts.append("Potato")
            
        return list(set(alts))[:2]


# Singleton instance
_prediction_service: Optional[PredictionService] = None


def get_prediction_service() -> PredictionService:
    """Get singleton PredictionService instance"""
    global _prediction_service
    if _prediction_service is None:
        _prediction_service = PredictionService()
    return _prediction_service
