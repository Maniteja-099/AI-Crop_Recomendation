import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert, Tooltip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { useGeolocation } from '../hooks/useGeolocation';

/**
 * LocationButton Component
 * Auto-detects user location and provides coordinates
 */
const LocationButton = ({ onLocationDetected, disabled = false, variant = 'outlined' }) => {
  const { location, loading, error, getLocation, permission, isSupported } = useGeolocation();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleGetLocation = async () => {
    try {
      const locationData = await getLocation();
      
      if (onLocationDetected) {
        onLocationDetected({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          locationName: locationData.locationName,
          accuracy: locationData.accuracy,
        });
      }

      setSnackbar({
        open: true,
        message: `Location detected: ${locationData.locationName || 'Coordinates captured'}`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to get location',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Choose icon based on state
  const getIcon = () => {
    if (loading) {
      return <CircularProgress size={20} sx={{ color: 'inherit' }} />;
    }
    if (location) {
      return <LocationOnIcon />;
    }
    if (!isSupported || permission === 'denied') {
      return <LocationOffIcon />;
    }
    return <MyLocationIcon />;
  };

  // Get button text
  const getButtonText = () => {
    if (loading) {
      return 'Detecting...';
    }
    if (location) {
      return 'Location Detected';
    }
    if (permission === 'denied') {
      return 'Location Denied';
    }
    return 'Auto-Detect Location';
  };

  // Get tooltip message
  const getTooltip = () => {
    if (!isSupported) {
      return 'Geolocation is not supported by your browser';
    }
    if (permission === 'denied') {
      return 'Location permission denied. Please enable it in browser settings.';
    }
    if (error) {
      return error;
    }
    return 'Click to automatically detect your current location';
  };

  return (
    <>
      <Tooltip title={getTooltip()} arrow>
        <span>
          <Button
            variant={variant}
            color={location ? 'success' : 'primary'}
            startIcon={getIcon()}
            onClick={handleGetLocation}
            disabled={disabled || loading || !isSupported || permission === 'denied'}
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {getButtonText()}
          </Button>
        </span>
      </Tooltip>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocationButton;
