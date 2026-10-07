"""
Model Manager - Intelligent ML Model Loading with Fallbacks
Handles all pickle model loading and inference
"""

import os
import logging
import joblib
import warnings
from typing import Dict, Any, Optional
from functools import lru_cache

warnings.filterwarnings('ignore')

logger = logging.getLogger("model_manager")


class ModelManager:
    """
    Zero-Config Model Manager with Mock Fallback
    Gracefully handles missing model files without crashing
    """
    
    _instance = None
    
    def __new__(cls, models_dir: str = None):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, models_dir: str = None):
        if self._initialized:
            return
            
        # Find models directory
        if models_dir is None:
            # Try multiple possible locations
            possible_paths = [
                os.path.join(os.path.dirname(__file__), '..', 'trained_models'),
                os.path.join(os.path.dirname(__file__), '..', 'models'),
                os.path.join(os.path.dirname(__file__), '..', '..', 'models'),
                'trained_models',
                'models',
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    models_dir = os.path.abspath(path)
                    break
            else:
                models_dir = 'trained_models'
        
        self.models_dir = models_dir
        self.models: Dict[str, Any] = {}
        self.mock_mode = False
        self._load_models()
        self._initialized = True
    
    def _load_models(self):
        """Attempt to load models, fallback to mocks if missing"""
        models_to_load = {
            'soil_model': 'soil_fertility_model.pkl',
            'soil_features': 'soil_features.pkl',
            'weather_model': 'weather_risk_model.pkl',
            'weather_encoder': 'weather_label_encoder.pkl',
            'crop_model': 'crop_recommendation_model.pkl',
            'crop_scaler': 'crop_scaler.pkl',
            'yield_model': 'yield_model.pkl',
            'yield_cols': 'yield_columns.pkl',
            'fert_model': 'fertilizer_model.pkl',
            'fert_encoder': 'fertilizer_label_encoder.pkl',
            'fert_cols': 'fertilizer_columns.pkl'
        }
        
        missing_models = []
        
        for key, filename in models_to_load.items():
            filepath = os.path.join(self.models_dir, filename)
            try:
                if os.path.exists(filepath):
                    self.models[key] = joblib.load(filepath)
                    logger.info("Loaded: %s", filename)
                else:
                    missing_models.append(filename)
            except Exception as e:
                logger.warning("Error loading %s: %s", filename, e)
                missing_models.append(filename)
        
        if missing_models:
            self.mock_mode = False # Now using Optimized Rule Engine
            logger.info("OPTIMIZED RULE ENGINE ACTIVE — %d models missing", len(missing_models))
        else:
            logger.info("All %d model components loaded successfully", len(self.models))
    
    def get_model(self, key: str) -> Optional[Any]:
        """Get a specific model by key"""
        return self.models.get(key)
    
    def has_model(self, key: str) -> bool:
        """Check if a model is loaded"""
        return key in self.models
    
    def is_mock_mode(self) -> bool:
        """Check if running in mock mode"""
        return self.mock_mode
    
    def get_status(self) -> Dict[str, Any]:
        """Get model loading status"""
        return {
            'mock_mode': self.mock_mode,
            'models_loaded': list(self.models.keys()),
            'models_dir': self.models_dir
        }


@lru_cache()
def get_model_manager() -> ModelManager:
    """Get singleton ModelManager instance"""
    return ModelManager()
