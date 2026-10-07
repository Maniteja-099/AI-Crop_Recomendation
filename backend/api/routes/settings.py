"""
Settings API Route - Farmer Profile Management
Handles farmer registration, profile updates, and settings
"""

from fastapi import APIRouter, HTTPException, status
from typing import Optional, Dict, Any

from models.farmer import (
    FarmerProfile, 
    FarmerSettings, 
    FarmerProfileResponse,
    SettingsResponse
)
from services.farmer_service import get_farmer_service

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.post("/profile", response_model=FarmerProfileResponse)
async def create_farmer_profile(profile: FarmerProfile):
    """
    Create a new farmer profile
    
    - **name**: Farmer's name (required)
    - **state**: State/Province (required)
    - **farm_size**: Farm size in hectares (required)
    - **language**: Preferred language (en, hi, te, ta, kn)
    """
    service = get_farmer_service()
    result = service.create_profile(profile)
    
    if result["success"]:
        return FarmerProfileResponse(
            success=True,
            message=result["message"],
            profile=profile
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )


@router.get("/profile/{farmer_id}", response_model=FarmerProfileResponse)
async def get_farmer_profile(farmer_id: str):
    """
    Get farmer profile by ID
    """
    service = get_farmer_service()
    profile_data = service.get_profile(farmer_id)
    
    if profile_data:
        return FarmerProfileResponse(
            success=True,
            message="Profile found",
            profile=FarmerProfile(**profile_data)
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )


@router.put("/profile/{farmer_id}")
async def update_farmer_profile(farmer_id: str, updates: Dict[str, Any]):
    """
    Update farmer profile
    
    Accepts partial updates - only send fields that need to be changed
    """
    service = get_farmer_service()
    result = service.update_profile(farmer_id, updates)
    
    if result["success"]:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )


@router.delete("/profile/{farmer_id}")
async def delete_farmer_profile(farmer_id: str):
    """
    Delete farmer profile
    """
    service = get_farmer_service()
    result = service.delete_profile(farmer_id)
    
    if result["success"]:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )


@router.get("/preferences/{farmer_id}", response_model=SettingsResponse)
async def get_farmer_settings(farmer_id: str):
    """
    Get farmer's app settings/preferences
    """
    service = get_farmer_service()
    settings_data = service.get_settings(farmer_id)
    
    return SettingsResponse(
        success=True,
        message="Settings retrieved",
        settings=FarmerSettings(**settings_data)
    )


@router.put("/preferences/{farmer_id}", response_model=SettingsResponse)
async def update_farmer_settings(farmer_id: str, settings: FarmerSettings):
    """
    Update farmer's app settings/preferences
    
    - **language**: Preferred language (en, hi, te, ta, kn)
    - **voice_enabled**: Enable text-to-speech
    - **theme**: light, dark, or high-contrast
    - **notifications**: Enable/disable notifications
    - **location**: State for weather data
    - **gps_latitude/longitude**: GPS coordinates for precise weather
    """
    service = get_farmer_service()
    result = service.update_settings(farmer_id, settings)
    
    return SettingsResponse(
        success=True,
        message=result["message"],
        settings=settings
    )


@router.get("/default")
async def get_default_settings():
    """
    Get default settings for new users
    """
    return {
        "success": True,
        "settings": FarmerSettings().model_dump()
    }


@router.get("/profiles")
async def list_all_profiles(limit: int = 100):
    """
    List all farmer profiles (admin endpoint)
    """
    service = get_farmer_service()
    profiles = service.list_profiles(limit)
    
    return {
        "success": True,
        "count": len(profiles),
        "profiles": profiles
    }


@router.get("/search")
async def search_profiles(
    state: Optional[str] = None,
    crop: Optional[str] = None
):
    """
    Search farmer profiles by state or crop
    """
    service = get_farmer_service()
    results = service.search_profiles(state=state, crop=crop)
    
    return {
        "success": True,
        "count": len(results),
        "profiles": results
    }
