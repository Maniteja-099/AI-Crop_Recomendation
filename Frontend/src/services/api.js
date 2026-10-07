import axios from 'axios';

// FIXED: Removed /api from baseURL to prevent double prefix (/api/api/)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      const err = new Error(error.response.data?.detail || 'Server error. Please try again.');
      err.status = error.response.status;
      throw err;
    } else if (error.request) {
      // Request made but no response
      console.error('No response:', error.request);
      const err = new Error('Cannot connect to backend server. Ensure the backend is running on port 8000.');
      err.status = 0;
      throw err;
    } else {
      console.error('Error:', error.message);
      const err = new Error(error.message || 'An unexpected error occurred');
      err.status = 0;
      throw err;
    }
  }
);

// Health check - verify backend connectivity
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    const err = new Error('Backend server is not responding. Please start the backend server.');
    err.error = true;
    throw err;
  }
};

// Soil Fertility API
export const checkSoilFertility = async (nitrogen, phosphorus, potassium) => {
  try {
    const response = await api.post('/api/soil-fertility', {
      nitrogen: parseFloat(nitrogen),
      phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Weather Intelligence API
export const analyzeWeatherRisk = async (month, temperature) => {
  try {
    const response = await api.post('/api/weather-risk', {
      month: parseInt(month),
      temperature: parseFloat(temperature),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crop Recommendation API
export const recommendCrop = async (data) => {
  try {
    const response = await api.post('/api/crop-recommendation', {
      nitrogen: parseFloat(data.nitrogen),
      phosphorus: parseFloat(data.phosphorus),
      potassium: parseFloat(data.potassium),
      temperature: parseFloat(data.temperature),
      humidity: parseFloat(data.humidity),
      ph: parseFloat(data.ph),
      rainfall: parseFloat(data.rainfall),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Yield Prediction API
export const predictYield = async (data) => {
  try {
    const response = await api.post('/api/yield-prediction', {
      crop: String(data.crop),
      season: String(data.season),
      state: String(data.state),
      area: parseFloat(data.area),
      rainfall: parseFloat(data.rainfall),
      fertilizer: parseFloat(data.fertilizer),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fertilizer Advisory API
export const getFertilizerAdvice = async (data) => {
  try {
    const response = await api.post('/api/fertilizer-recommendation', {
      nitrogen: parseFloat(data.nitrogen || 0),
      phosphorus: parseFloat(data.phosphorus || data.phosphorous || 0),
      potassium: parseFloat(data.potassium || 0),
      temperature: parseFloat(data.temperature || 25),
      humidity: parseFloat(data.humidity || 70),
      moisture: parseFloat(data.moisture || 50),
      soil_type: String(data.soil_type || data.soilType || 'Loamy'),
      crop_type: String(data.crop_type || data.cropType || 'Rice'),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
