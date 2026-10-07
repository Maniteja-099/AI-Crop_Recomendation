import { useState, useEffect, useCallback } from 'react';
import GeolocationService from '../services/GeolocationService';

/**
 * useGeolocation Hook
 * Provides easy access to browser geolocation with permission handling
 */
export const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    watch = false,
    autoStart = false,
  } = options;

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('unknown');
  const [watchId, setWatchId] = useState(null);

  // Check permission status
  const checkPermission = useCallback(async () => {
    const permissionStatus = await GeolocationService.checkPermission();
    setPermission(permissionStatus);
    return permissionStatus;
  }, []);

  // Get current position once
  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await GeolocationService.getCurrentPosition();
      
      // Try to get location name (optional, won't fail if unavailable)
      let locationName = null;
      try {
        locationName = await GeolocationService.getLocationName(
          position.latitude,
          position.longitude
        );
      } catch (geoError) {
        console.warn('Failed to get location name:', geoError);
      }

      const locationData = {
        ...position,
        locationName,
        formattedCoordinates: GeolocationService.formatCoordinates(
          position.latitude,
          position.longitude
        ),
      };

      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Start watching position
  const startWatch = useCallback(() => {
    if (watchId) {
      console.warn('Already watching position');
      return;
    }

    const id = GeolocationService.watchPosition(
      (position) => {
        setLocation({
          ...position,
          formattedCoordinates: GeolocationService.formatCoordinates(
            position.latitude,
            position.longitude
          ),
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );

    setWatchId(id);
  }, [watchId]);

  // Stop watching position
  const stopWatch = useCallback(() => {
    if (watchId) {
      GeolocationService.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Reset state
  const reset = useCallback(() => {
    setLocation(null);
    setError(null);
    setLoading(false);
    if (watchId) {
      stopWatch();
    }
  }, [watchId, stopWatch]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      if (watch) {
        startWatch();
      } else {
        getLocation();
      }
    }

    // Cleanup on unmount
    return () => {
      if (watchId) {
        GeolocationService.clearWatch(watchId);
      }
    };
  }, [autoStart, watch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    location,
    loading,
    error,
    permission,
    getLocation,
    startWatch,
    stopWatch,
    reset,
    checkPermission,
    isSupported: GeolocationService.isSupported(),
  };
};

export default useGeolocation;
