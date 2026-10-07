// Global State Store using React Context
// Manages application-wide state for settings, predictions, and user data

import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  // User settings
  settings: {
    language: localStorage.getItem('language') || 'en',
    theme: localStorage.getItem('theme') || 'light',
    voiceEnabled: localStorage.getItem('voiceEnabled') !== 'false',
    highContrast: localStorage.getItem('highContrast') === 'true',
  },
  
  // Farmer profile
  farmer: {
    name: localStorage.getItem('farmerName') || '',
    location: localStorage.getItem('location') || 'Karnataka',
    gpsLatitude: parseFloat(localStorage.getItem('gpsLatitude')) || null,
    gpsLongitude: parseFloat(localStorage.getItem('gpsLongitude')) || null,
    farmSize: parseFloat(localStorage.getItem('farmSize')) || 1,
    primaryCrop: localStorage.getItem('primaryCrop') || 'Rice',
  },
  
  // Current analysis data
  analysis: {
    soil: null,
    weather: null,
    crop: null,
    yield: null,
    fertilizer: null,
    unified: null,
  },
  
  // Live weather data
  weather: null,
  
  // Loading states
  loading: {
    analysis: false,
    weather: false,
    chat: false,
  },
  
  // Error states
  errors: {},
  
  // Chat history
  chatHistory: [],
};

// Action types
const ActionTypes = {
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_FARMER: 'UPDATE_FARMER',
  SET_ANALYSIS: 'SET_ANALYSIS',
  SET_WEATHER: 'SET_WEATHER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  CLEAR_CHAT: 'CLEAR_CHAT',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_SETTINGS:
      const newSettings = { ...state.settings, ...action.payload };
      // Persist to localStorage
      Object.entries(action.payload).forEach(([key, value]) => {
        localStorage.setItem(key, value.toString());
      });
      return { ...state, settings: newSettings };
      
    case ActionTypes.UPDATE_FARMER:
      const newFarmer = { ...state.farmer, ...action.payload };
      // Persist to localStorage
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value.toString());
        }
      });
      return { ...state, farmer: newFarmer };
      
    case ActionTypes.SET_ANALYSIS:
      return {
        ...state,
        analysis: {
          ...state.analysis,
          ...action.payload,
        },
      };
      
    case ActionTypes.SET_WEATHER:
      return { ...state, weather: action.payload };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, ...action.payload },
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };
      
    case ActionTypes.CLEAR_ERROR:
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };
      
    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };
      
    case ActionTypes.CLEAR_CHAT:
      return { ...state, chatHistory: [] };
      
    case ActionTypes.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext(null);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Action creators
  const updateSettings = useCallback((settings) => {
    dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
  }, []);
  
  const updateFarmer = useCallback((farmerData) => {
    dispatch({ type: ActionTypes.UPDATE_FARMER, payload: farmerData });
  }, []);
  
  const setAnalysis = useCallback((analysisData) => {
    dispatch({ type: ActionTypes.SET_ANALYSIS, payload: analysisData });
  }, []);
  
  const setWeather = useCallback((weatherData) => {
    dispatch({ type: ActionTypes.SET_WEATHER, payload: weatherData });
  }, []);
  
  const setLoading = useCallback((loadingState) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loadingState });
  }, []);
  
  const setError = useCallback((errorData) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: errorData });
  }, []);
  
  const clearError = useCallback((key) => {
    dispatch({ type: ActionTypes.CLEAR_ERROR, payload: key });
  }, []);
  
  const addChatMessage = useCallback((message) => {
    dispatch({ type: ActionTypes.ADD_CHAT_MESSAGE, payload: message });
  }, []);
  
  const clearChat = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_CHAT });
  }, []);
  
  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);
  
  const value = {
    state,
    actions: {
      updateSettings,
      updateFarmer,
      setAnalysis,
      setWeather,
      setLoading,
      setError,
      clearError,
      addChatMessage,
      clearChat,
      resetState,
    },
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the store
export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
