/**
 * Geolocation Service
 * Provides location detection and reverse geocoding
 */

export const GeolocationService = {
  /**
   * Get current location coordinates
   * @returns {Promise<{latitude: number, longitude: number}>}
   */
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp),
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your GPS settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while fetching location.';
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  },

  /**
   * Watch position changes
   * @param {Function} onSuccess - Callback for position updates
   * @param {Function} onError - Callback for errors
   * @returns {number} Watch ID
   */
  watchPosition(onSuccess, onError) {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation is not supported'));
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp),
        });
      },
      (error) => {
        onError(error);
      },
      options
    );
  },

  /**
   * Clear position watch
   * @param {number} watchId
   */
  clearWatch(watchId) {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  /**
   * Check if geolocation is supported
   * @returns {boolean}
   */
  isSupported() {
    return 'geolocation' in navigator;
  },

  /**
   * Request location permission
   * @returns {Promise<string>} Permission state: 'granted', 'denied', or 'prompt'
   */
  async checkPermission() {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.warn('Permission query not supported:', error);
      return 'unknown';
    }
  },

  /**
   * Reverse geocode coordinates to location name
   * Uses OpenStreetMap Nominatim API (free, no API key required)
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<object>} Location details
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AgriSmart-Platform/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      return {
        city: data.address.city || data.address.town || data.address.village || 'Unknown',
        state: data.address.state || data.address.region || 'Unknown',
        country: data.address.country || 'Unknown',
        district: data.address.state_district || data.address.county || 'Unknown',
        displayName: data.display_name,
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to get location name. Please enter manually.');
    }
  },

  /**
   * Get location name from coordinates
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<string>} Location name
   */
  async getLocationName(latitude, longitude) {
    try {
      const location = await this.reverseGeocode(latitude, longitude);
      return `${location.city}, ${location.state}, ${location.country}`;
    } catch (error) {
      return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
    }
  },

  /**
   * Calculate distance between two coordinates (in kilometers)
   * Uses Haversine formula
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  },

  /**
   * Convert degrees to radians
   * @param {number} degrees
   * @returns {number}
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  /**
   * Format coordinates for display
   * @param {number} latitude
   * @param {number} longitude
   * @returns {string}
   */
  formatCoordinates(latitude, longitude) {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const lonDirection = longitude >= 0 ? 'E' : 'W';
    
    return `${Math.abs(latitude).toFixed(4)}° ${latDirection}, ${Math.abs(longitude).toFixed(4)}° ${lonDirection}`;
  },

  /**
   * Get location with auto-retry
   * @param {number} maxRetries - Maximum retry attempts
   * @returns {Promise<object>} Location data
   */
  async getLocationWithRetry(maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const position = await this.getCurrentPosition();
        const locationName = await this.getLocationName(
          position.latitude,
          position.longitude
        );
        
        return {
          ...position,
          locationName,
          formattedCoordinates: this.formatCoordinates(
            position.latitude,
            position.longitude
          ),
        };
      } catch (error) {
        lastError = error;
        console.warn(`Location attempt ${i + 1} failed:`, error.message);
        
        // Wait before retry (exponential backoff)
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError;
  },
};

export default GeolocationService;
