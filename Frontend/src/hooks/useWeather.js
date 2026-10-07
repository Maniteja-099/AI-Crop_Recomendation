// useWeather Hook - Real-time weather data fetching
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useWeather = (autoFetch = false, location = null) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather by state
  const fetchWeatherByState = useCallback(async (state) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE}/api/weather/by-state/${state}`);
      setWeather(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch weather data';
      setError(errorMsg);
      console.error('Weather fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather by GPS coordinates
  const fetchWeatherByCoordinates = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE}/api/weather/by-coordinates`, {
        params: { lat: latitude, lon: longitude }
      });
      setWeather(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch weather data';
      setError(errorMsg);
      console.error('Weather fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current weather (uses state or coordinates based on availability)
  const fetchCurrentWeather = useCallback(async (state = null, lat = null, lon = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (lat && lon) {
        params.latitude = lat;
        params.longitude = lon;
      } else if (state) {
        params.state = state;
      }
      
      const response = await axios.get(`${API_BASE}/api/weather/current`, { params });
      setWeather(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch weather data';
      setError(errorMsg);
      console.error('Weather fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get farming advice based on current weather
  const getFarmingAdvice = useCallback(async (temperature, humidity, rainfall = 0) => {
    try {
      const response = await axios.get(`${API_BASE}/api/weather/farming-advice`, {
        params: { temperature, humidity, rainfall }
      });
      return response.data.advice;
    } catch (err) {
      console.error('Farming advice error:', err);
      return null;
    }
  }, []);

  // Get list of supported states
  const getSupportedStates = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/weather/states`);
      return response.data.states;
    } catch (err) {
      console.error('States fetch error:', err);
      return [];
    }
  }, []);

  // Auto-fetch weather on mount if enabled
  useEffect(() => {
    if (autoFetch && location) {
      fetchWeatherByState(location);
    }
  }, [autoFetch, location, fetchWeatherByState]);

  // Extract useful weather metrics
  const getWeatherSummary = useCallback(() => {
    if (!weather) return null;
    
    return {
      temperature: weather.temperature,
      humidity: weather.humidity,
      description: weather.description,
      city: weather.city,
      isGoodForFarming: weather.temperature >= 15 && weather.temperature <= 35 && weather.humidity >= 40,
      advice: weather.farming_advice,
    };
  }, [weather]);

  return {
    weather,
    loading,
    error,
    fetchWeatherByState,
    fetchWeatherByCoordinates,
    fetchCurrentWeather,
    getFarmingAdvice,
    getSupportedStates,
    getWeatherSummary,
  };
};

export default useWeather;
