"""
Smart Weather Service - Auto-fetch real weather data based on location
Provides intelligent weather recommendations without user input
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import os

class SmartWeatherService:
    """
    Intelligent weather service that:
    1. Fetches real weather data from CSV based on location and date
    2. Analyzes weather patterns
    3. Provides seasonal recommendations
    4. Predicts weather risks automatically
    """
    
    def __init__(self, weather_csv_path: str = None):
        """Initialize weather service with historical data"""
        if weather_csv_path is None:
            # Auto-detect the path
            backend_dir = os.path.dirname(__file__)
            weather_csv_path = os.path.join(backend_dir, '../../data/daily_weather.csv')
            weather_csv_path = os.path.abspath(weather_csv_path)
        
        self.weather_data = None
        self.locations = []
        self.date_range = None
        self.load_weather_data(weather_csv_path)
    
    def load_weather_data(self, csv_path: str):
        """Load historical weather data from CSV"""
        try:
            if os.path.exists(csv_path):
                self.weather_data = pd.read_csv(csv_path)
                self.weather_data['date'] = pd.to_datetime(self.weather_data['date'], format='%d-%m-%Y')
                self.locations = self.weather_data['city'].unique().tolist()
                
                if len(self.weather_data) > 0:
                    self.date_range = {
                        'start': self.weather_data['date'].min(),
                        'end': self.weather_data['date'].max()
                    }
                
                print(f"[OK] Weather data loaded: {len(self.weather_data)} records")
                print(f"   Locations: {len(self.locations)} cities")
                print(f"   Date range: {self.date_range['start'].date()} to {self.date_range['end'].date()}")
            else:
                print(f"[WARN] Weather CSV not found: {csv_path}")
                self.weather_data = pd.DataFrame()
        except Exception as e:
            print(f"[ERROR] Error loading weather data: {e}")
            self.weather_data = pd.DataFrame()
    
    def get_current_month_weather(self, location: str, month: Optional[int] = None) -> Dict[str, Any]:
        """
        Get average weather for a location in a specific month
        Uses historical data to predict current weather patterns
        """
        if self.weather_data is None or len(self.weather_data) == 0:
            return self._get_default_weather(month)
        
        if month is None:
            month = datetime.now().month
        
        # Filter data for location and month
        try:
            location_data = self.weather_data[
                self.weather_data['city'].str.lower() == location.lower()
            ]
            
            if len(location_data) == 0:
                # Use first available location if exact match not found
                location_data = self.weather_data
            
            month_data = location_data[location_data['date'].dt.month == month]
            
            if len(month_data) == 0:
                month_data = location_data
            
            # Calculate statistics
            avg_temp_max = float(month_data['temperature_2m_max'].mean())
            avg_temp_min = float(month_data['temperature_2m_min'].mean())
            avg_temp = (avg_temp_max + avg_temp_min) / 2
            
            total_precip = float(month_data['precipitation_sum'].sum())
            avg_precip = float(month_data['precipitation_sum'].mean())
            
            # Determine weather condition
            weather_condition = self._classify_weather(
                avg_temp, total_precip, month, len(month_data)
            )
            
            return {
                'location': location,
                'month': month,
                'avg_temperature': round(avg_temp, 2),
                'max_temperature': round(avg_temp_max, 2),
                'min_temperature': round(avg_temp_min, 2),
                'avg_precipitation': round(avg_precip, 2),
                'total_precipitation': round(total_precip, 2),
                'weather_condition': weather_condition['condition'],
                'risk_level': weather_condition['risk'],
                'recommendation': weather_condition['recommendation'],
                'data_points': len(month_data)
            }
        except Exception as e:
            print(f"Error getting weather for {location}: {e}")
            return self._get_default_weather(month)
    
    def _classify_weather(self, temp: float, precip: float, month: int, data_points: int) -> Dict:
        """Classify weather conditions based on temperature and precipitation"""
        
        # Monsoon months (June-September)
        if month in [6, 7, 8, 9]:
            if precip > 200:
                return {
                    'condition': 'Monsoon (Heavy Rainfall)',
                    'risk': 'High',
                    'recommendation': 'Ensure proper drainage. Plant flood-resistant crops. Prepare for waterlogging.'
                }
            elif precip > 100:
                return {
                    'condition': 'Rainy Season',
                    'risk': 'Medium',
                    'recommendation': 'Good for water-intensive crops. Manage drainage. Plant rice, maize, cotton.'
                }
            else:
                return {
                    'condition': 'Uncertain Monsoon',
                    'risk': 'Low-Medium',
                    'recommendation': 'Prepare irrigation. Monitor rainfall patterns.'
                }
        
        # Summer months (March-May)
        elif month in [3, 4, 5]:
            if temp > 35:
                return {
                    'condition': 'Hot & Dry (Drought Risk)',
                    'risk': 'High',
                    'recommendation': 'High irrigation needed. Plant drought-resistant crops. Use mulching. Ensure water availability.'
                }
            elif temp > 30:
                return {
                    'condition': 'Hot Season',
                    'risk': 'Medium',
                    'recommendation': 'Regular irrigation required. Suitable for warm-season crops like cotton, sugarcane.'
                }
            else:
                return {
                    'condition': 'Warm Season',
                    'risk': 'Low',
                    'recommendation': 'Good growing conditions. Plant warm-season crops.'
                }
        
        # Winter months (November-February)
        elif month in [11, 12, 1, 2]:
            if temp < 10:
                return {
                    'condition': 'Cold Season',
                    'risk': 'Low',
                    'recommendation': 'Ideal for winter crops: wheat, barley, chickpea. Frost protection if needed.'
                }
            elif temp < 20:
                return {
                    'condition': 'Cool Season',
                    'risk': 'Low',
                    'recommendation': 'Perfect for winter crops. Minimal irrigation needed.'
                }
            else:
                return {
                    'condition': 'Mild Season',
                    'risk': 'Low',
                    'recommendation': 'Good for most crops. Normal irrigation sufficient.'
                }
        
        # Transition months (October, April)
        else:
            return {
                'condition': 'Transitional Season',
                'risk': 'Low-Medium',
                'recommendation': 'Monitor weather changes. Prepare for upcoming season.'
            }
    
    def _get_default_weather(self, month: Optional[int] = None) -> Dict:
        """Provide default weather based on month alone"""
        if month is None:
            month = datetime.now().month
        
        # Seasonal defaults for Indian agriculture
        seasonal_defaults = {
            # Winter (Nov-Feb): Cool, dry
            1: {'temp': 15, 'precip': 10, 'condition': 'Cold Season'},
            2: {'temp': 18, 'precip': 15, 'condition': 'Cool Season'},
            # Summer (Mar-May): Hot, dry
            3: {'temp': 30, 'precip': 20, 'condition': 'Hot Season'},
            4: {'temp': 35, 'precip': 15, 'condition': 'Hot & Dry'},
            5: {'temp': 38, 'precip': 30, 'condition': 'Very Hot'},
            # Monsoon (Jun-Sep): Wet, moderate temp
            6: {'temp': 28, 'precip': 150, 'condition': 'Monsoon'},
            7: {'temp': 26, 'precip': 200, 'condition': 'Heavy Monsoon'},
            8: {'temp': 26, 'precip': 180, 'condition': 'Monsoon'},
            9: {'temp': 25, 'precip': 120, 'condition': 'Late Monsoon'},
            # Post-monsoon (Oct): Transition
            10: {'temp': 22, 'precip': 50, 'condition': 'Transitional'},
            11: {'temp': 18, 'precip': 20, 'condition': 'Early Winter'},
            12: {'temp': 14, 'precip': 10, 'condition': 'Winter'},
        }
        
        default = seasonal_defaults.get(month, {'temp': 25, 'precip': 50, 'condition': 'Moderate'})
        
        return {
            'location': 'Default (India)',
            'month': month,
            'avg_temperature': default['temp'],
            'max_temperature': default['temp'] + 5,
            'min_temperature': default['temp'] - 5,
            'avg_precipitation': default['precip'] / 30,
            'total_precipitation': default['precip'],
            'weather_condition': default['condition'],
            'risk_level': self._get_risk_from_condition(default['condition']),
            'recommendation': self._get_recommendation_from_condition(default['condition']),
            'data_points': 0
        }
    
    def _get_risk_from_condition(self, condition: str) -> str:
        """Get risk level from weather condition"""
        if 'Monsoon' in condition or 'Heavy' in condition:
            return 'High'
        elif 'Hot' in condition or 'Dry' in condition:
            return 'High'
        elif 'Transition' in condition or 'Uncertain' in condition:
            return 'Medium'
        else:
            return 'Low'
    
    def _get_recommendation_from_condition(self, condition: str) -> str:
        """Get recommendation from weather condition"""
        recommendations = {
            'Monsoon': 'Ensure proper drainage. Plant water-loving crops.',
            'Heavy Monsoon': 'High flood risk. Plan drainage carefully. Plant flood-resistant varieties.',
            'Hot & Dry': 'High irrigation requirement. Use drought-resistant crops. Apply mulch.',
            'Very Hot': 'Critical water needs. Shade management important. Use crop covers.',
            'Cold Season': 'Perfect for winter crops: wheat, barley, chickpea.',
            'Hot Season': 'Good for cotton, sugarcane, groundnut.',
            'Cool Season': 'Ideal for most crops. Minimal irrigation needed.',
            'Transitional': 'Monitor weather patterns. Prepare for next season.'
        }
        
        for key, rec in recommendations.items():
            if key in condition:
                return rec
        
        return 'Normal farming conditions. Monitor weather regularly.'
    
    def get_seasonal_crop_recommendations(self, location: str, month: Optional[int] = None) -> Dict[str, Any]:
        """Get crop recommendations based on season"""
        weather = self.get_current_month_weather(location, month)
        month = weather['month']
        temp = weather['avg_temperature']
        precip = weather['total_precipitation']
        
        # Season-based crop recommendations
        recommendations = {
            # Monsoon season (June-September)
            'Monsoon': {
                'primary_crops': ['Rice', 'Maize', 'Cotton', 'Sugarcane'],
                'alternative_crops': ['Jute', 'Soybean', 'Groundnut'],
                'timing': 'Plant when rainfall starts',
                'irrigation': 'Minimal - depends on rainfall',
                'soil_prep': 'Ensure good drainage, add organic matter'
            },
            # Winter season (November-February)
            'Winter': {
                'primary_crops': ['Wheat', 'Barley', 'Chickpea', 'Mustard'],
                'alternative_crops': ['Lentil', 'Pea', 'Gram'],
                'timing': 'Sow in October-November',
                'irrigation': 'Moderate - 3-4 irrigations for wheat',
                'soil_prep': 'Clear monsoon debris, add nitrogen'
            },
            # Summer season (March-May)
            'Summer': {
                'primary_crops': ['Groundnut', 'Millets', 'Vegetables'],
                'alternative_crops': ['Sunflower', 'Sesame'],
                'timing': 'Early sowing recommended',
                'irrigation': 'Heavy - weekly irrigation needed',
                'soil_prep': 'Apply mulch, add organic matter'
            }
        }
        
        # Classify month to season
        if month in [6, 7, 8, 9]:
            season = 'Monsoon'
        elif month in [11, 12, 1, 2]:
            season = 'Winter'
        else:
            season = 'Summer'
        
        season_rec = recommendations.get(season, recommendations['Monsoon'])
        
        return {
            'season': season,
            'month': month,
            'weather': weather,
            'crops': season_rec['primary_crops'],
            'alternatives': season_rec['alternative_crops'],
            'sowing_time': season_rec['timing'],
            'irrigation': season_rec['irrigation'],
            'soil_preparation': season_rec['soil_prep']
        }


# ============================================================================
# COMPREHENSIVE FARM RECOMMENDATION ENGINE
# ============================================================================

class ComprehensiveFarmRecommendationEngine:
    """
    Intelligent farm recommendation system that:
    1. Analyzes soil conditions
    2. Fetches weather automatically
    3. Recommends suitable crops
    4. Provides fertilizer guidance
    5. Gives detailed farming instructions
    """
    
    def __init__(self, weather_service: SmartWeatherService):
        self.weather_service = weather_service
    
    def generate_complete_farm_report(self,
                                     location: str,
                                     nitrogen: float,
                                     phosphorus: float,
                                     potassium: float,
                                     ph: float,
                                     soil_moisture: float,
                                     temperature: Optional[float] = None,
                                     month: Optional[int] = None) -> Dict[str, Any]:
        """
        Generate comprehensive farm report with all reasoning done automatically
        No need for user to predict weather - we fetch it!
        """
        
        if month is None:
            month = datetime.now().month
        
        # AUTO-FETCH weather data (no user input needed!)
        weather_data = self.weather_service.get_current_month_weather(location, month)
        seasonal_info = self.weather_service.get_seasonal_crop_recommendations(location, month)
        
        # Use weather temperature if not provided
        if temperature is None:
            temperature = weather_data['avg_temperature']
        
        # Calculate humidity based on precipitation
        humidity = self._estimate_humidity(weather_data['total_precipitation'], temperature)
        rainfall = weather_data['total_precipitation']
        
        return {
            'location': location,
            'month': month,
            'season': seasonal_info['season'],
            'analysis_date': datetime.now().isoformat(),
            
            # =====================================================================
            # SECTION 1: SOIL ANALYSIS
            # =====================================================================
            'soil_analysis': {
                'status': self._analyze_soil(nitrogen, phosphorus, potassium, ph),
                'npk_values': {
                    'nitrogen': nitrogen,
                    'phosphorus': phosphorus,
                    'potassium': potassium,
                    'average': round((nitrogen + phosphorus + potassium) / 3, 2)
                },
                'ph_level': ph,
                'ph_suitability': self._analyze_ph(ph),
                'moisture': soil_moisture,
                'recommendations': self._soil_recommendations(nitrogen, phosphorus, potassium, ph)
            },
            
            # =====================================================================
            # SECTION 2: WEATHER ANALYSIS (Auto-fetched!)
            # =====================================================================
            'weather_analysis': {
                'current_weather': weather_data,
                'season_info': seasonal_info,
                'weather_risk': weather_data['risk_level'],
                'precautions': self._weather_precautions(weather_data, month)
            },
            
            # =====================================================================
            # SECTION 3: CROP RECOMMENDATIONS
            # =====================================================================
            'crop_recommendations': self._generate_crop_recommendations(
                nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall,
                seasonal_info
            ),
            
            # =====================================================================
            # SECTION 4: FERTILIZER RECOMMENDATIONS
            # =====================================================================
            'fertilizer_recommendations': self._generate_fertilizer_recommendations(
                nitrogen, phosphorus, potassium, temperature, humidity, soil_moisture,
                weather_data, seasonal_info
            ),
            
            # =====================================================================
            # SECTION 5: DETAILED FARMING INSTRUCTIONS
            # =====================================================================
            'farming_instructions': self._generate_farming_instructions(
                location, month, seasonal_info, weather_data,
                nitrogen, phosphorus, potassium
            ),
            
            # =====================================================================
            # SECTION 6: YIELD PREDICTION
            # =====================================================================
            'yield_expectations': self._predict_yield(
                temperature, nitrogen, phosphorus, potassium, rainfall
            ),
            
            # =====================================================================
            # SECTION 7: RISK ASSESSMENT & MITIGATION
            # =====================================================================
            'risk_assessment': self._assess_risks(
                weather_data, ph, nitrogen, phosphorus, potassium, soil_moisture
            ),
            
            # =====================================================================
            # SECTION 8: ACTION PLAN
            # =====================================================================
            'action_plan': self._create_action_plan(
                location, month, seasonal_info, weather_data,
                nitrogen, phosphorus, potassium
            )
        }
    
    def _estimate_humidity(self, precipitation: float, temperature: float) -> float:
        """Estimate humidity from precipitation and temperature"""
        # More rainfall = higher humidity
        # Higher temp = lower humidity (evaporation)
        base_humidity = 60
        precip_factor = min(precipitation / 50 * 5, 30)  # Max +30%
        temp_factor = max((25 - temperature) * 1.5, -20)  # Lower at higher temps
        
        humidity = base_humidity + precip_factor + temp_factor
        return max(20, min(95, humidity))
    
    def _analyze_soil(self, n: float, p: float, k: float, ph: float) -> Dict:
        """Comprehensive soil analysis"""
        avg_npk = (n + p + k) / 3
        
        if avg_npk < 20:
            fertility = "Poor"
            icon = "🔴"
        elif avg_npk < 40:
            fertility = "Fair"
            icon = "🟡"
        else:
            fertility = "Good"
            icon = "🟢"
        
        if ph < 6:
            ph_status = "Acidic"
        elif ph > 7.5:
            ph_status = "Alkaline"
        else:
            ph_status = "Neutral"
        
        return {
            'fertility_level': fertility,
            'icon': icon,
            'average_npk': avg_npk,
            'ph_status': ph_status,
            'overall_rating': f"{fertility} - {ph_status} soil"
        }
    
    def _analyze_ph(self, ph: float) -> Dict:
        """Analyze soil pH suitability"""
        if ph < 5.5:
            return {'rating': 'Very Acidic', 'suitable_crops': ['Rice', 'Tea'], 'action': 'Add lime'}
        elif ph < 6.5:
            return {'rating': 'Acidic', 'suitable_crops': ['Most crops', 'Potato'], 'action': 'Add lime gradually'}
        elif ph <= 7.5:
            return {'rating': 'Optimal', 'suitable_crops': ['All major crops'], 'action': 'Maintain pH'}
        elif ph <= 8.5:
            return {'rating': 'Alkaline', 'suitable_crops': ['Wheat', 'Cotton'], 'action': 'Add sulfur if needed'}
        else:
            return {'rating': 'Very Alkaline', 'suitable_crops': ['Salt-tolerant crops'], 'action': 'Intensive amendment'}
    
    def _soil_recommendations(self, n: float, p: float, k: float, ph: float) -> list:
        """Generate soil-specific recommendations"""
        recommendations = []
        
        if n < 30:
            recommendations.append("🔵 Add nitrogen-rich fertilizers: Urea or DAP")
        if p < 20:
            recommendations.append("🟣 Phosphorus deficiency detected: Use DAP or SSP")
        if k < 20:
            recommendations.append("🟠 Potassium deficiency detected: Apply MOP or wood ash")
        if ph < 6:
            recommendations.append("⚪ Soil too acidic: Add limestone to increase pH")
        if ph > 8:
            recommendations.append("⚫ Soil too alkaline: Add gypsum or sulfur")
        
        if not recommendations:
            recommendations.append("[OK] Soil nutrients are well-balanced!")
        
        return recommendations
    
    def _weather_precautions(self, weather: Dict, month: int) -> list:
        """Weather-specific precautions"""
        precautions = []
        
        if weather['risk_level'] == 'High':
            if 'Monsoon' in weather['weather_condition']:
                precautions.extend([
                    "[WARN] Heavy rainfall expected: Ensure proper field drainage",
                    "[WARN] Create drainage channels to prevent waterlogging",
                    "[WARN] Use raised bed cultivation if possible",
                    "[WARN] Apply fungicide to prevent fungal diseases"
                ])
            elif 'Drought' in weather['weather_condition']:
                precautions.extend([
                    "🔥 High temperature expected: Increase irrigation frequency",
                    "🔥 Use drip irrigation to conserve water",
                    "🔥 Apply mulch to retain soil moisture",
                    "🔥 Mulch helps reduce evaporation by 50%"
                ])
        
        return precautions if precautions else ["[OK] Normal weather conditions"]
    
    def _generate_crop_recommendations(self, n: float, p: float, k: float,
                                      temp: float, humidity: float, ph: float, rainfall: float,
                                      seasonal_info: Dict) -> Dict:
        """Generate comprehensive crop recommendations"""
        return {
            'season': seasonal_info['season'],
            'recommended_crops': seasonal_info['crops'],
            'alternative_crops': seasonal_info['alternatives'],
            'sowing_time': seasonal_info['sowing_time'],
            'best_crop_for_soil': self._best_crop_for_conditions(n, p, k, temp, humidity, ph, rainfall),
            'reasoning': f"Based on NPK values, temperature ({temp}°C), pH ({ph}), and seasonal patterns"
        }
    
    def _best_crop_for_conditions(self, n: float, p: float, k: float,
                                  temp: float, humidity: float, ph: float, rainfall: float) -> str:
        """Determine best crop based on all conditions"""
        if rainfall > 200 and humidity > 70 and temp > 20:
            return "RICE - High water needs, well-suited to monsoon"
        elif temp < 20 and rainfall < 100:
            return "WHEAT - Cool season, moderate water"
        elif temp > 30 and rainfall < 100:
            return "COTTON - Heat tolerant, drought resistant"
        else:
            return "MAIZE - Versatile, grows well in most conditions"
    
    def _generate_fertilizer_recommendations(self, n: float, p: float, k: float,
                                            temp: float, humidity: float, moisture: float,
                                            weather: Dict, seasonal_info: Dict) -> Dict:
        """Generate detailed fertilizer recommendations"""
        
        deficiencies = {}
        if n < 30:
            deficiencies['Nitrogen'] = 'Severe'
        elif n < 40:
            deficiencies['Nitrogen'] = 'Moderate'
        
        if p < 20:
            deficiencies['Phosphorus'] = 'Severe'
        elif p < 30:
            deficiencies['Phosphorus'] = 'Moderate'
        
        if k < 20:
            deficiencies['Potassium'] = 'Severe'
        elif k < 30:
            deficiencies['Potassium'] = 'Moderate'
        
        recommendations = []
        
        if 'Nitrogen' in deficiencies:
            recommendations.append({
                'fertilizer': 'Urea (46-0-0)',
                'application_rate': '100-150 kg/hectare',
                'timing': '2-3 split applications',
                'reason': f"{deficiencies['Nitrogen']} nitrogen deficiency"
            })
        
        if 'Phosphorus' in deficiencies:
            recommendations.append({
                'fertilizer': 'DAP (18-46-0)',
                'application_rate': '75-100 kg/hectare',
                'timing': 'At sowing time',
                'reason': f"{deficiencies['Phosphorus']} phosphorus deficiency"
            })
        
        if 'Potassium' in deficiencies:
            recommendations.append({
                'fertilizer': 'MOP (0-0-60)',
                'application_rate': '50-75 kg/hectare',
                'timing': 'Split applications',
                'reason': f"{deficiencies['Potassium']} potassium deficiency"
            })
        
        if not recommendations:
            recommendations.append({
                'fertilizer': 'Balanced NPK (10-26-26)',
                'application_rate': '100-150 kg/hectare',
                'timing': 'As per crop schedule',
                'reason': 'Maintenance and support'
            })
        
        return {
            'deficiencies': deficiencies,
            'recommendations': recommendations,
            'season_specific': seasonal_info['sowing_time'],
            'application_tips': [
                "Apply in morning or evening to avoid sun burn",
                "Water well after fertilizer application",
                "Split applications give better results than single application",
                "Follow local guidelines for organic or conventional farming"
            ]
        }
    
    def _generate_farming_instructions(self, location: str, month: int,
                                      seasonal_info: Dict, weather: Dict,
                                      n: float, p: float, k: float) -> Dict:
        """Generate detailed step-by-step farming instructions"""
        
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        return {
            'location': location,
            'current_month': month_names[month - 1],
            'season': seasonal_info['season'],
            'immediate_actions': [
                f"1. Test soil: Current NPK - N:{n}, P:{p}, K:{k}",
                f"2. Weather check: {weather['weather_condition']}",
                f"3. Prepare field: {seasonal_info['soil_preparation']}",
                f"4. Plan irrigation: {seasonal_info['irrigation']}",
                f"5. Schedule: {seasonal_info['sowing_time']}"
            ],
            'preparation_steps': [
                "Clear previous crop residue",
                "Deep ploughing for 3-4 times",
                "Add organic matter (2-3 tons/hectare)",
                "Level the field for uniform water distribution",
                "Remove weeds and stones"
            ],
            'sowing_guidelines': {
                'timing': seasonal_info['sowing_time'],
                'spacing': "Crop-specific: 60-90 cm between rows",
                'depth': "4-5 cm for most cereals",
                'seed_rate': "20-25 kg/hectare for wheat, 15-20 for rice"
            },
            'care_tips': [
                "Monitor for pests weekly",
                "Weed removal at 20-30, 50-60 days after sowing",
                "Protect from birds and animals",
                "Watch for disease symptoms"
            ],
            'harvest_time': self._get_harvest_time(month, seasonal_info)
        }
    
    def _get_harvest_time(self, month: int, seasonal_info: Dict) -> str:
        """Get harvest time based on season"""
        if seasonal_info['season'] == 'Monsoon':
            return "September-October (4-5 months after sowing)"
        elif seasonal_info['season'] == 'Winter':
            return "March-April (4-5 months after sowing)"
        else:
            return "June-July (3-4 months after sowing)"
    
    def _predict_yield(self, temp: float, n: float, p: float, k: float, rainfall: float) -> Dict:
        """Predict crop yield based on conditions"""
        
        # Base yield
        base_yield = 4.0  # tons/hectare
        
        # Temperature factor (optimal 20-30°C)
        if 20 <= temp <= 30:
            temp_factor = 1.0
        elif 15 <= temp < 20 or 30 < temp <= 35:
            temp_factor = 0.85
        else:
            temp_factor = 0.65
        
        # NPK factor
        avg_npk = (n + p + k) / 3
        if avg_npk > 40:
            npk_factor = 1.1
        elif avg_npk > 30:
            npk_factor = 1.0
        else:
            npk_factor = 0.8
        
        # Rainfall factor
        if 100 <= rainfall <= 250:
            rainfall_factor = 1.0
        elif 50 <= rainfall < 100 or rainfall > 250:
            rainfall_factor = 0.85
        else:
            rainfall_factor = 0.6
        
        predicted_yield = base_yield * temp_factor * npk_factor * rainfall_factor
        
        quality = "Excellent" if predicted_yield > 6 else "Good" if predicted_yield > 4 else "Average"
        
        return {
            'predicted_yield': round(predicted_yield, 2),
            'unit': 'tons/hectare',
            'quality': quality,
            'factors': {
                'temperature': round(temp_factor * 100, 0),
                'soil_npk': round(npk_factor * 100, 0),
                'rainfall': round(rainfall_factor * 100, 0)
            },
            'confidence': 85
        }
    
    def _assess_risks(self, weather: Dict, ph: float, n: float, p: float, k: float, moisture: float) -> Dict:
        """Assess and mitigation strategies for risks"""
        
        risks = []
        
        # Weather risks
        if weather['risk_level'] == 'High':
            risks.append({
                'type': 'Weather',
                'severity': 'High',
                'description': weather['weather_condition'],
                'mitigation': weather.get('recommendation', 'Monitor weather closely')
            })
        
        # Soil pH risks
        if ph < 6 or ph > 8:
            risks.append({
                'type': 'Soil pH',
                'severity': 'Medium',
                'description': f"pH {ph} is not optimal",
                'mitigation': 'Adjust pH with lime or sulfur'
            })
        
        # Nutrient deficiency risks
        if n < 20 or p < 15 or k < 15:
            risks.append({
                'type': 'Nutrient Deficiency',
                'severity': 'High',
                'description': 'Critical nutrient shortage',
                'mitigation': 'Apply recommended fertilizers immediately'
            })
        
        # Moisture risks
        if moisture < 20:
            risks.append({
                'type': 'Low Moisture',
                'severity': 'Medium',
                'description': 'Soil too dry',
                'mitigation': 'Increase irrigation frequency'
            })
        elif moisture > 80:
            risks.append({
                'type': 'High Moisture',
                'severity': 'Medium',
                'description': 'Soil waterlogged',
                'mitigation': 'Improve drainage, reduce irrigation'
            })
        
        return {
            'identified_risks': risks if risks else [{'type': 'None', 'severity': 'Low', 'description': 'All conditions normal'}],
            'overall_risk_level': 'High' if any(r['severity'] == 'High' for r in risks) else 'Medium' if risks else 'Low'
        }
    
    def _create_action_plan(self, location: str, month: int, seasonal_info: Dict,
                           weather: Dict, n: float, p: float, k: float) -> Dict:
        """Create comprehensive action plan for next 30 days"""
        
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        return {
            'location': location,
            'period': f"{month_names[month-1]} (Next 30 days)",
            'week_1': {
                'priority': 'High',
                'actions': [
                    f"✓ Soil preparation: {seasonal_info['soil_preparation']}",
                    f"✓ Soil testing confirmation (Current: N={n}, P={p}, K={k})",
                    f"✓ Plan irrigation schedule: {seasonal_info['irrigation']}",
                    f"✓ Procure seeds for {seasonal_info['crops']}"
                ]
            },
            'week_2': {
                'priority': 'High',
                'actions': [
                    "✓ Field preparation: Ploughing and leveling",
                    "✓ Organic matter incorporation",
                    "✓ Arrange fertilizers and implements",
                    "✓ Weather monitoring"
                ]
            },
            'week_3': {
                'priority': 'Medium',
                'actions': [
                    f"✓ Sowing: {seasonal_info['sowing_time']}",
                    "✓ Initial fertilizer application",
                    "✓ Irrigation schedule starts",
                    "✓ Document field conditions"
                ]
            },
            'week_4': {
                'priority': 'Medium',
                'actions': [
                    "✓ Monitor germination",
                    "✓ First weeding (if needed)",
                    "✓ Pest/disease surveillance",
                    "✓ Second irrigation"
                ]
            },
            'notes': [
                f"Season: {seasonal_info['season']}",
                f"Weather: {weather['weather_condition']}",
                f"Expected rainfall: {weather['total_precipitation']} mm",
                "Follow local agricultural extension services for guidance"
            ]
        }
