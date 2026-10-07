// API Configuration and Client
// Zero-Config Architecture

import axios from 'axios';

// Global API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_URL,  // Don't add /api here - endpoints include it
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request Timeout');
      error.message = 'Request timeout - Server took too long to respond';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error');
      error.message = 'Cannot connect to backend. Make sure the server is running on port 8000';
    } else if (error.response) {
      console.error(`❌ API Error: ${error.response.status}`, error.response.data);
      error.message = error.response.data?.detail || error.message;
    }
    return Promise.reject(error);
  }
);

// API Methods

/**
 * Health Check
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 🎯 MASTER ENDPOINT - Full Farm Report (Chained Pipeline)
 * Uses a longer timeout (120 s) because the backend runs 5 ML predictions
 * and optionally translates results via Google Translate.
 */
export const getFullReport = async (farmData) => {
  try {
    const response = await apiClient.post('/api/analyze/full-report', farmData, {
      timeout: 120000, // 2-minute timeout for comprehensive analysis
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Chatbot Endpoint
 */
export const sendChatMessage = async (message, language = 'en', contextData = null) => {
  try {
    const response = await apiClient.post('/api/chat', {
      message,
      language,
      context_data: contextData,
    });

    // Handle response — backend ChatResponse uses 'message' field; support legacy 'reply' too
    const replyText = response.data.reply || response.data.message;
    if (response.data && replyText) {
      return {
        success: true,
        data: {
          reply: replyText || 'No response',
          tts_message: response.data.tts_message || null,
          intent: response.data.intent || response.data.response_type || 'general',
          confidence: response.data.confidence || 0.85,
          quick_actions: response.data.quick_actions || [],
          related_modules: response.data.related_modules || []
        }
      };
    } else if (response.data) {
      // Handle unexpected response shape
      return {
        success: false,
        data: {
          reply: response.data.error || 'Chatbot is not responding',
          tts_message: null
        }
      };
    }

    return { success: false, error: 'No response from chatbot' };
  } catch (error) {
    console.error('Chatbot API error:', error);
    return {
      success: false,
      error: error.message,
      data: {
        reply: 'Chatbot is not responding. Please try again.',
        tts_message: null
      }
    };
  }
};

/**
 * Image Analysis - Disease Detection
 */
export const analyzeImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post('/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Legacy Endpoints (Backward Compatibility)
 */

export const checkSoilFertility = async (nitrogen, phosphorus, potassium) => {
  try {
    const response = await apiClient.post('/api/soil-fertility', {
      nitrogen,
      phosphorus,
      potassium,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const analyzeWeatherRisk = async (month, temperature) => {
  try {
    const response = await apiClient.post('/api/weather-risk', {
      month,
      temperature,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const recommendCrop = async (cropData) => {
  try {
    const response = await apiClient.post('/api/crop-recommendation', cropData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Live Weather Data from OpenWeatherMap
 */
export const getLiveWeather = async (lat, lon) => {
  try {
    const response = await apiClient.get(`/api/weather/live?lat=${lat}&lon=${lon}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Comprehensive Soil Report
 */
export const getComprehensiveSoilReport = async (nitrogen, phosphorus, potassium) => {
  try {
    const response = await apiClient.post('/api/soil-fertility/comprehensive', {
      nitrogen: parseFloat(nitrogen),
      phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium),
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default apiClient;
