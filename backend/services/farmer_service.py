"""
Farmer Service - Farmer Profile Management
Handles CRUD operations for farmer profiles and settings
"""

import json
import os
from typing import Dict, Any, Optional, List
from datetime import datetime
from models.farmer import FarmerProfile, FarmerSettings


class FarmerService:
    """
    Farmer Profile and Settings Management Service
    Handles storage and retrieval of farmer data
    """
    
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'Data')
        
        self.data_dir = data_dir
        self.profiles_file = os.path.join(data_dir, 'farmer_profiles.json')
        self.settings_file = os.path.join(data_dir, 'farmer_settings.json')
        
        # Ensure data directory exists
        os.makedirs(data_dir, exist_ok=True)
        
        # Load existing data
        self.profiles: Dict[str, Dict] = self._load_profiles()
        self.settings: Dict[str, Dict] = self._load_settings()
    
    def _load_profiles(self) -> Dict[str, Dict]:
        """Load farmer profiles from file"""
        if os.path.exists(self.profiles_file):
            try:
                with open(self.profiles_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading profiles: {e}")
        return {}
    
    def _load_settings(self) -> Dict[str, Dict]:
        """Load farmer settings from file"""
        if os.path.exists(self.settings_file):
            try:
                with open(self.settings_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading settings: {e}")
        return {}
    
    def _save_profiles(self):
        """Save profiles to file"""
        try:
            with open(self.profiles_file, 'w', encoding='utf-8') as f:
                json.dump(self.profiles, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving profiles: {e}")
    
    def _save_settings(self):
        """Save settings to file"""
        try:
            with open(self.settings_file, 'w', encoding='utf-8') as f:
                json.dump(self.settings, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving settings: {e}")
    
    def create_profile(self, profile: FarmerProfile) -> Dict[str, Any]:
        """Create a new farmer profile"""
        # Generate ID if not provided
        if not profile.farmer_id:
            profile.farmer_id = f"farmer_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Store profile
        self.profiles[profile.farmer_id] = profile.model_dump()
        self._save_profiles()
        
        # Create default settings
        default_settings = FarmerSettings(
            language=profile.language,
            location=profile.state
        )
        self.settings[profile.farmer_id] = default_settings.model_dump()
        self._save_settings()
        
        return {
            "success": True,
            "message": "Profile created successfully",
            "farmer_id": profile.farmer_id
        }
    
    def get_profile(self, farmer_id: str) -> Optional[Dict]:
        """Get a farmer profile by ID"""
        return self.profiles.get(farmer_id)
    
    def update_profile(
        self, 
        farmer_id: str, 
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing farmer profile"""
        if farmer_id not in self.profiles:
            return {"success": False, "message": "Profile not found"}
        
        # Update fields
        for key, value in updates.items():
            if key in self.profiles[farmer_id]:
                self.profiles[farmer_id][key] = value
        
        self._save_profiles()
        
        return {
            "success": True,
            "message": "Profile updated successfully"
        }
    
    def delete_profile(self, farmer_id: str) -> Dict[str, Any]:
        """Delete a farmer profile"""
        if farmer_id in self.profiles:
            del self.profiles[farmer_id]
            self._save_profiles()
            
            # Also delete settings
            if farmer_id in self.settings:
                del self.settings[farmer_id]
                self._save_settings()
            
            return {"success": True, "message": "Profile deleted successfully"}
        
        return {"success": False, "message": "Profile not found"}
    
    def get_settings(self, farmer_id: str) -> Optional[Dict]:
        """Get settings for a farmer"""
        return self.settings.get(farmer_id, self._get_default_settings())
    
    def update_settings(
        self, 
        farmer_id: str, 
        settings: FarmerSettings
    ) -> Dict[str, Any]:
        """Update settings for a farmer"""
        self.settings[farmer_id] = settings.model_dump()
        self._save_settings()
        
        return {
            "success": True,
            "message": "Settings updated successfully"
        }
    
    def _get_default_settings(self) -> Dict:
        """Get default settings"""
        return FarmerSettings().model_dump()
    
    def list_profiles(self, limit: int = 100) -> List[Dict]:
        """List all farmer profiles"""
        profiles = list(self.profiles.values())[:limit]
        return profiles
    
    def search_profiles(
        self, 
        state: str = None, 
        crop: str = None
    ) -> List[Dict]:
        """Search profiles by criteria"""
        results = []
        
        for profile in self.profiles.values():
            if state and profile.get("state") != state:
                continue
            if crop and crop not in profile.get("primary_crops", []):
                continue
            results.append(profile)
        
        return results


# Singleton instance
_farmer_service: Optional[FarmerService] = None


def get_farmer_service() -> FarmerService:
    """Get singleton FarmerService instance"""
    global _farmer_service
    if _farmer_service is None:
        _farmer_service = FarmerService()
    return _farmer_service
