// useSettings Hook - Manage user settings with localStorage persistence
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  // Language Settings
  language: 'en',
  
  // Voice Settings
  voiceEnabled: true,
  voiceSpeed: 0.9,
  autoSpeak: true,
  
  // Display Settings
  fontSize: 'medium',
  theme: 'light',
  animations: true,
  highContrast: false,
  
  // Notification Settings
  notifications: true,
  weatherAlerts: true,
  cropReminders: true,
  
  // Farmer Profile
  farmerName: '',
  location: 'Karnataka',
  gpsLatitude: null,
  gpsLongitude: null,
  farmSize: 1,
  primaryCrop: 'Rice',
  farmingExperience: 'intermediate',
  
  // Measurement
  measurementSystem: 'metric',
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on initial render
    const savedSettings = {};
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        // Handle boolean conversion
        if (saved === 'true') savedSettings[key] = true;
        else if (saved === 'false') savedSettings[key] = false;
        else if (!isNaN(parseFloat(saved)) && key !== 'location' && key !== 'language') {
          savedSettings[key] = parseFloat(saved);
        } else {
          savedSettings[key] = saved;
        }
      } else {
        savedSettings[key] = DEFAULT_SETTINGS[key];
      }
    });
    return savedSettings;
  });

  // Update a single setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(key, value.toString());
      return newSettings;
    });
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      Object.entries(newSettings).forEach(([key, value]) => {
        localStorage.setItem(key, value.toString());
      });
      return updated;
    });
  }, []);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
      localStorage.removeItem(key);
    });
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Get GPS location
  const getGPSLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateSettings({
            gpsLatitude: latitude,
            gpsLongitude: longitude,
          });
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, [updateSettings]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [settings.theme, settings.highContrast]);

  // Apply font size
  useEffect(() => {
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
    };
    document.documentElement.style.fontSize = fontSizes[settings.fontSize] || '16px';
  }, [settings.fontSize]);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    getGPSLocation,
    DEFAULT_SETTINGS,
  };
};

export default useSettings;
