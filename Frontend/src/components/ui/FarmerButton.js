// Farmer-Friendly Button Component
// Large, high-contrast, icon-based buttons for easy interaction

import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const FarmerButton = ({
  children,
  icon,
  onClick,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  fullWidth = false,
  sx = {},
  ...props
}) => {
  const baseStyles = {
    minHeight: '56px',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: '12px',
    padding: '12px 24px',
    textTransform: 'none',
    boxShadow: variant === 'contained' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      color: '#666',
    },
    ...sx,
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : icon}
      sx={baseStyles}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

export default FarmerButton;
