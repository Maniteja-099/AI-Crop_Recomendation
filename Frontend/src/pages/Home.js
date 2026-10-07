import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import CloudIcon from '@mui/icons-material/Cloud';
import GrassIcon from '@mui/icons-material/Grass';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const features = [
  {
    icon: <ScienceIcon sx={{ fontSize: 40 }} />,
    title: 'Soil Health',
    description: 'Check if your land is Fertile, Semi-Fertile, or Infertile.',
    color: '#8b4513',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 40 }} />,
    title: 'Weather Risk',
    description: 'Predict Flood or Drought risks for the season.',
    color: '#1976d2',
  },
  {
    icon: <GrassIcon sx={{ fontSize: 40 }} />,
    title: 'Crop Suggestion',
    description: 'Find the perfect crop for your soil conditions.',
    color: '#2e7d32',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Yield Estimator',
    description: 'Predict how many tons you will harvest.',
    color: '#ff9800',
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
    title: 'Fertilizer Advice',
    description: 'Get specific fertilizer prescriptions for weak soil.',
    color: '#d32f2f',
  },
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #004d40 100%)',
          borderRadius: 4,
          p: 5,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            fontSize: '200px',
            opacity: 0.1,
          }}
        >
          🌾
        </Box>
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}>
          🌾 An AI-Driven Crop Recommendation and Growth Prediction System
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '800px', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
          Using Soil Fertility and Climate Intelligence to empower farmers with data-driven decisions. 
          This comprehensive tool uses 5 different AI modules powered by advanced machine learning algorithms.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Chip
            label="🤖 AI Powered"
            sx={{ mr: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <Chip
            label="📊 Data-Driven"
            sx={{ mr: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <Chip
            label="🌾 Smart Farming"
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>
      </Box>

      {/* Capabilities Section */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        🚀 Capabilities
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    backgroundColor: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Instructions */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: '#fff3e0',
          borderRadius: 2,
          border: '1px solid #ffcc80',
        }}
      >
        <Typography variant="h6" color="warning.dark" gutterBottom>
          👈 How to Get Started
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a module from the sidebar to start analyzing your farm data. 
          Each module provides AI-powered insights to help you make better farming decisions.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
