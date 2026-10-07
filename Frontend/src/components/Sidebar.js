import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import CloudIcon from '@mui/icons-material/Cloud';
import GrassIcon from '@mui/icons-material/Grass';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon sx={{ fontSize: 24 }} />, path: '/', emoji: '🏠' },
  { text: '📊 Full Report', icon: <TrendingUpIcon sx={{ fontSize: 24 }} />, path: '/full-report', emoji: '🎯', description: 'Complete AI Analysis' },
  { text: 'Soil Fertility', icon: <ScienceIcon sx={{ fontSize: 24 }} />, path: '/soil-fertility', emoji: '🧪', description: 'Check N-P-K levels' },
  { text: 'Weather Risk', icon: <CloudIcon sx={{ fontSize: 24 }} />, path: '/weather-intelligence', emoji: '⛅', description: 'Predict flood/drought' },
  { text: 'Crop Selection', icon: <GrassIcon sx={{ fontSize: 24 }} />, path: '/crop-recommendation', emoji: '🌾', description: 'Best crop to grow' },
  { text: 'Yield Forecast', icon: <TrendingUpIcon sx={{ fontSize: 24 }} />, path: '/yield-prediction', emoji: '📊', description: 'Estimate harvest' },
  { text: 'Fertilizer Aid', icon: <LocalHospitalIcon sx={{ fontSize: 24 }} />, path: '/fertilizer-advisory', emoji: '💧', description: 'Fertilizer advice' },
  { text: '💬 AI Chatbot', icon: <ChatIcon sx={{ fontSize: 24 }} />, path: '/chatbot', emoji: '🤖', description: 'Talk to AI Assistant', divider: true },
  { text: '⚙️ Settings', icon: <SettingsIcon sx={{ fontSize: 24 }} />, path: '/settings', emoji: '⚙️', description: 'Customize your experience' },
];

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1b5e20 0%, #2e7d32 50%, #f5f5f5 100%)',
          borderRight: '2px solid #ddd',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ px: 2, py: 2, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 2, m: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              🚜 Modules
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Select a feature to get started
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Navigation List */}
        <List sx={{ flex: 1, px: 1 }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <React.Fragment key={item.text}>
                {item.divider && <Divider sx={{ my: 2 }} />}
                <Tooltip title={item.description || ''} placement="right" arrow>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={isActive}
                      sx={{
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        backgroundColor: isActive ? 'rgba(46, 125, 50, 0.15)' : 'transparent',
                        border: isActive ? '2px solid #2e7d32' : '2px solid transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          transform: 'translateX(4px)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(46, 125, 50, 0.15)',
                          '& .MuiListItemIcon-root': {
                            color: '#2e7d32',
                          },
                          '& .MuiListItemText-primary': {
                            fontWeight: 700,
                            color: '#1b5e20',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: isActive ? '#2e7d32' : '#666',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
                          <Typography sx={{ fontSize: '1.3rem' }}>{item.emoji}</Typography>
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#1b5e20' : '#333',
                      }}
                    />
                    {isActive && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#2e7d32',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              </React.Fragment>
            );
          })}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Footer Info */}
        <Box sx={{ px: 2, py: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)', borderRadius: 1, m: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <InfoIcon sx={{ fontSize: 18, color: '#2e7d32', mt: 0.5, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: '#2e7d32' }}>
                💡 Tip
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                Use your soil health card data for accurate results
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
