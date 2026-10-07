// Farmer-Friendly Card Component
// High-visibility cards with icons and clear status indicators

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const StatusColors = {
  success: { bg: '#e8f5e9', border: '#4caf50', text: '#1b5e20' },
  warning: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
  error: { bg: '#ffebee', border: '#f44336', text: '#b71c1c' },
  info: { bg: '#e3f2fd', border: '#2196f3', text: '#0d47a1' },
  neutral: { bg: '#fafafa', border: '#9e9e9e', text: '#424242' },
};

const FarmerCard = ({
  title,
  subtitle,
  icon,
  status = 'neutral',
  statusText,
  children,
  onClick,
  elevation = 3,
  sx = {},
}) => {
  const colors = StatusColors[status] || StatusColors.neutral;

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        borderRadius: '16px',
        border: `3px solid ${colors.border}`,
        backgroundColor: colors.bg,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        } : {},
        ...sx,
      }}
    >
      <CardContent sx={{ padding: '20px' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box
                sx={{
                  fontSize: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: colors.text,
                  fontSize: '1.3rem',
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          {statusText && (
            <Chip
              label={statusText}
              sx={{
                backgroundColor: colors.border,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '4px 8px',
              }}
            />
          )}
        </Box>

        {/* Content */}
        {children && (
          <Box sx={{ mt: 2 }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FarmerCard;
