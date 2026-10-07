import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CloudIcon from '@mui/icons-material/Cloud';

const Navbar = ({ toggleSidebar }) => {
  const [apiStatus, setApiStatus] = useState('connecting');

  useEffect(() => {
    // Check backend status
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (err) {
        setApiStatus('error');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return '#4caf50';
      case 'connecting':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusLabel = () => {
    switch (apiStatus) {
      case 'connected':
        return 'Backend Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Backend Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Toggle Navigation">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleSidebar}
              edge="start"
              sx={{ 
                mr: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              backgroundColor: 'white',
              color: '#2e7d32',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <AgricultureIcon sx={{ fontSize: 20 }} />
            TEAM 7
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <CloudIcon sx={{ fontSize: 24, opacity: 0.9 }} />
            <Typography 
              variant="h6" 
              noWrap 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '0.7rem', sm: '0.85rem', md: '1rem' },
                maxWidth: { xs: '200px', sm: '400px', md: '600px' },
              }}
            >
              🌾 AI Crop Recommendation & Growth Prediction
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9, 
              display: { xs: 'none', lg: 'block' },
              fontSize: '0.85rem'
            }}
          >
            Soil & Climate Intelligence
          </Typography>

          <Tooltip title={getStatusLabel()}>
            <Chip
              icon={<span style={{ fontSize: '10px' }}>●</span>}
              label={getStatusLabel()}
              size="small"
              sx={{
                backgroundColor: getStatusColor(),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
