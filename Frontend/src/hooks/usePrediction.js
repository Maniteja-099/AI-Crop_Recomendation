// usePrediction Hook - ML Model Prediction API calls
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    soil: null,
    weather: null,
    crop: null,
    yield: null,
    fertilizer: null,
    unified: null,
  });

  // Predict soil fertility
  const predictSoil = useCallback(async (nitrogen, phosphorus, potassium) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict/soil`, {
        nitrogen,
        phosphorus,
        potassium,
      });
      
      setResults(prev => ({ ...prev, soil: response.data }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Soil prediction failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict weather risk
  const predictWeather = useCallback(async (month, temperature, humidity = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = { month, temperature };
      if (humidity) payload.humidity = humidity;
      
      const response = await axios.post(`${API_BASE}/api/predict/weather`, payload);
      
      setResults(prev => ({ ...prev, weather: response.data }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Weather prediction failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict crop recommendation
  const predictCrop = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict/crop`, data);
      
      setResults(prev => ({ ...prev, crop: response.data }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Crop prediction failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict yield
  const predictYield = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict/yield`, data);
      
      setResults(prev => ({ ...prev, yield: response.data }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Yield prediction failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict fertilizer
  const predictFertilizer = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict/fertilizer`, data);
      
      setResults(prev => ({ ...prev, fertilizer: response.data }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Fertilizer prediction failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Unified farm analysis
  const unifiedAnalysis = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict/unified`, data);
      
      setResults(prev => ({
        ...prev,
        unified: response.data,
        soil: response.data.soil_analysis,
        weather: response.data.weather_analysis,
        crop: response.data.crop_recommendation,
        yield: response.data.yield_prediction,
        fertilizer: response.data.fertilizer_advisory,
      }));
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Analysis failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all results
  const clearResults = useCallback(() => {
    setResults({
      soil: null,
      weather: null,
      crop: null,
      yield: null,
      fertilizer: null,
      unified: null,
    });
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    predictSoil,
    predictWeather,
    predictCrop,
    predictYield,
    predictFertilizer,
    unifiedAnalysis,
    clearResults,
  };
};

export default usePrediction;
