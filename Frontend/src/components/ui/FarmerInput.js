// Farmer-Friendly Input Component
// Large, accessible input fields with icons and validation

import React from 'react';
import { TextField, InputAdornment, FormHelperText, Box } from '@mui/material';

const FarmerInput = ({
  label,
  value,
  onChange,
  type = 'text',
  icon,
  unit,
  helperText,
  error = false,
  errorText,
  min,
  max,
  step,
  placeholder,
  fullWidth = true,
  disabled = false,
  required = false,
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        fullWidth={fullWidth}
        disabled={disabled}
        required={required}
        error={error}
        placeholder={placeholder}
        inputProps={{
          min,
          max,
          step,
          style: { fontSize: '1.1rem', padding: '14px' },
        }}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start" sx={{ fontSize: '1.5rem' }}>
              {icon}
            </InputAdornment>
          ),
          endAdornment: unit && (
            <InputAdornment position="end">
              <Box
                sx={{
                  backgroundColor: '#e0e0e0',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {unit}
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '& fieldset': {
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#2e7d32',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2e7d32',
              borderWidth: '3px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#2e7d32',
          },
        }}
        {...props}
      />
      {(helperText || errorText) && (
        <FormHelperText
          error={error}
          sx={{ ml: 1, mt: 0.5, fontSize: '0.85rem' }}
        >
          {error ? errorText : helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FarmerInput;
