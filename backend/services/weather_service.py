"""
Weather Service - Real-time Weather Data Integration
Uses OpenWeatherMap API for live weather data
"""

import os
import logging
import httpx
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("weather_service")


class WeatherService:
    """
    Weather Service for real-time weather data
    Integrates with OpenWeatherMap API
    """
    
    # OpenWeatherMap API configuration
    BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    # Default API key (user should replace with their own)
    # Get free API key at: https://openweathermap.org/api
    DEFAULT_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
    
    # Indian state capitals for location-based weather
    STATE_COORDINATES = {
        "Andhra Pradesh": {"lat": 15.9129, "lon": 79.7400, "city": "Amaravati"},
        "Karnataka": {"lat": 12.9716, "lon": 77.5946, "city": "Bengaluru"},
        "Tamil Nadu": {"lat": 13.0827, "lon": 80.2707, "city": "Chennai"},
        "Kerala": {"lat": 8.5241, "lon": 76.9366, "city": "Thiruvananthapuram"},
        "Telangana": {"lat": 17.3850, "lon": 78.4867, "city": "Hyderabad"},
        "Maharashtra": {"lat": 19.0760, "lon": 72.8777, "city": "Mumbai"},
        "Gujarat": {"lat": 23.0225, "lon": 72.5714, "city": "Ahmedabad"},
        "Rajasthan": {"lat": 26.9124, "lon": 75.7873, "city": "Jaipur"},
        "Uttar Pradesh": {"lat": 26.8467, "lon": 80.9462, "city": "Lucknow"},
        "Madhya Pradesh": {"lat": 23.2599, "lon": 77.4126, "city": "Bhopal"},
        "Bihar": {"lat": 25.6093, "lon": 85.1376, "city": "Patna"},
        "West Bengal": {"lat": 22.5726, "lon": 88.3639, "city": "Kolkata"},
        "Punjab": {"lat": 30.7333, "lon": 76.7794, "city": "Chandigarh"},
        "Haryana": {"lat": 30.7333, "lon": 76.7794, "city": "Chandigarh"},
        "Odisha": {"lat": 20.2961, "lon": 85.8245, "city": "Bhubaneswar"},
        "Assam": {"lat": 26.1445, "lon": 91.7362, "city": "Guwahati"},
    }
    
    # Maximum number of cached weather responses
    MAX_CACHE_SIZE = 100
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or self.DEFAULT_API_KEY
        self._cache: Dict[str, Dict] = {}
        self._cache_time: Dict[str, datetime] = {}
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create a shared httpx.AsyncClient with connection pooling"""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=10.0)
        return self._client

    async def close(self):
        """Close the shared httpx client"""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None
    
    async def get_weather_by_coordinates(
        self, 
        latitude: float, 
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get current weather by GPS coordinates
        
        Args:
            latitude: GPS latitude
            longitude: GPS longitude
            
        Returns:
            Weather data dictionary
        """
        if not self.api_key:
            return self._get_fallback_weather(latitude, longitude)
        
        cache_key = f"{latitude:.2f},{longitude:.2f}"
        
        # Check cache (valid for 30 minutes)
        if cache_key in self._cache:
            cache_age = (datetime.now() - self._cache_time[cache_key]).seconds
            if cache_age < 1800:  # 30 minutes
                return self._cache[cache_key]
        
        try:
            client = await self._get_client()
            response = await client.get(
                f"{self.BASE_URL}/weather",
                params={
                    "lat": latitude,
                    "lon": longitude,
                    "appid": self.api_key,
                    "units": "metric"
                },
            )
            
            if response.status_code == 200:
                data = response.json()
                weather_data = self._parse_weather_response(data)
                
                # Evict oldest cache entries if limit reached
                if len(self._cache) >= self.MAX_CACHE_SIZE:
                    oldest_key = min(self._cache_time, key=self._cache_time.get)
                    del self._cache[oldest_key]
                    del self._cache_time[oldest_key]
                
                # Cache the result
                self._cache[cache_key] = weather_data
                self._cache_time[cache_key] = datetime.now()
                
                return weather_data
            else:
                return self._get_fallback_weather(latitude, longitude)
                    
        except Exception as e:
            logger.warning("Weather API error: %s", e)
            return self._get_fallback_weather(latitude, longitude)
    
    async def get_weather_by_state(self, state: str) -> Dict[str, Any]:
        """
        Get weather for an Indian state
        
        Args:
            state: Indian state name
            
        Returns:
            Weather data dictionary
        """
        coords = self.STATE_COORDINATES.get(state)
        
        if coords:
            weather = await self.get_weather_by_coordinates(
                coords["lat"], 
                coords["lon"]
            )
            weather["city"] = coords["city"]
            weather["state"] = state
            return weather
        else:
            # Default to Karnataka if state not found
            return await self.get_weather_by_coordinates(12.9716, 77.5946)
    
    def _parse_weather_response(self, data: Dict) -> Dict[str, Any]:
        """Parse OpenWeatherMap API response"""
        main = data.get("main", {})
        weather = data.get("weather", [{}])[0]
        wind = data.get("wind", {})
        rain = data.get("rain", {})
        
        return {
            "success": True,
            "source": "OpenWeatherMap",
            "temperature": main.get("temp", 25),
            "feels_like": main.get("feels_like", 25),
            "humidity": main.get("humidity", 60),
            "pressure": main.get("pressure", 1013),
            "wind_speed": wind.get("speed", 0),
            "description": weather.get("description", "Clear sky"),
            "icon": weather.get("icon", "01d"),
            "rainfall_1h": rain.get("1h", 0),
            "rainfall_3h": rain.get("3h", 0),
            "city": data.get("name", "Unknown"),
            "country": data.get("sys", {}).get("country", "IN"),
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_fallback_weather(
        self, 
        latitude: float, 
        longitude: float
    ) -> Dict[str, Any]:
        """
        Generate fallback weather data based on location and season
        Used when API is unavailable
        """
        current_month = datetime.now().month
        
        # Seasonal defaults for India
        if current_month in [6, 7, 8, 9]:  # Monsoon
            temp = 28
            humidity = 85
            rainfall = 150
            description = "Monsoon season - expect rain"
        elif current_month in [3, 4, 5]:  # Summer
            temp = 38
            humidity = 40
            rainfall = 10
            description = "Summer - hot and dry"
        elif current_month in [10, 11]:  # Post-monsoon
            temp = 28
            humidity = 60
            rainfall = 30
            description = "Post-monsoon - pleasant"
        else:  # Winter
            temp = 20
            humidity = 50
            rainfall = 5
            description = "Winter - cool and dry"
        
        # Adjust based on latitude (north is cooler)
        if latitude > 25:
            temp -= 5
        
        return {
            "success": True,
            "source": "Fallback (API unavailable)",
            "temperature": temp,
            "feels_like": temp + 2,
            "humidity": humidity,
            "pressure": 1013,
            "wind_speed": 10,
            "description": description,
            "icon": "02d",
            "rainfall_1h": 0,
            "rainfall_3h": 0,
            "city": "Location-based estimate",
            "country": "IN",
            "timestamp": datetime.now().isoformat(),
            "is_fallback": True
        }
    
    def get_farming_advice_from_weather(
        self, 
        weather_data: Dict[str, Any]
    ) -> Dict[str, str]:
        """
        Generate farming advice based on current weather
        """
        temp = weather_data.get("temperature", 25)
        humidity = weather_data.get("humidity", 60)
        rainfall = weather_data.get("rainfall_1h", 0)
        
        advice = {
            "irrigation": "",
            "pest_alert": "",
            "harvesting": "",
            "general": ""
        }
        
        # Irrigation advice
        if humidity > 80 or rainfall > 10:
            advice["irrigation"] = "Skip irrigation today - sufficient moisture available"
        elif temp > 35 and humidity < 40:
            advice["irrigation"] = "Irrigate early morning or late evening to minimize evaporation"
        else:
            advice["irrigation"] = "Normal irrigation schedule recommended"
        
        # Pest alert
        if humidity > 75 and temp > 25:
            advice["pest_alert"] = "⚠️ High humidity - watch for fungal diseases"
        elif temp > 35:
            advice["pest_alert"] = "⚠️ High temperature - watch for pest outbreaks"
        else:
            advice["pest_alert"] = "✅ Normal conditions - regular pest monitoring"
        
        # Harvesting advice
        if rainfall > 5:
            advice["harvesting"] = "❌ Avoid harvesting today - wait for dry conditions"
        elif humidity > 70:
            advice["harvesting"] = "⚠️ High humidity - ensure proper drying after harvest"
        else:
            advice["harvesting"] = "✅ Good conditions for harvesting"
        
        # General advice
        if temp > 40:
            advice["general"] = "Extreme heat - provide shade for sensitive crops"
        elif temp < 10:
            advice["general"] = "Cold conditions - protect frost-sensitive crops"
        else:
            advice["general"] = "Weather conditions are favorable for farming activities"
        
        return advice


# Singleton instance
_weather_service: Optional[WeatherService] = None


def get_weather_service() -> WeatherService:
    """Get singleton WeatherService instance"""
    global _weather_service
    if _weather_service is None:
        _weather_service = WeatherService()
    return _weather_service
