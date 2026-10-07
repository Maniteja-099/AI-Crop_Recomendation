// Loading Spinner with Farmer-Friendly Messages
// Animated loader with contextual messages

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const loadingMessages = {
  en: [
    "Analyzing your farm data...",
    "Consulting AI models...",
    "Preparing recommendations...",
    "Almost there...",
  ],
  hi: [
    "आपके खेत का डेटा विश्लेषण कर रहे हैं...",
    "AI मॉडल से परामर्श कर रहे हैं...",
    "सिफारिशें तैयार कर रहे हैं...",
    "लगभग पूर्ण...",
  ],
  te: [
    "మీ వ్యవసాయ డేటాను విశ్లేషిస్తోంది...",
    "AI మోడల్స్‌తో సంప్రదిస్తోంది...",
    "సిఫార్సులు సిద్ధం చేస్తోంది...",
    "దాదాపు పూర్తయింది...",
  ],
};

const FarmerSpinner = ({
  loading = true,
  message,
  language = 'en',
  size = 60,
  fullScreen = false,
}) => {
  const [messageIndex, setMessageIndex] = React.useState(0);
  const messages = loadingMessages[language] || loadingMessages.en;

  React.useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, messages.length]);

  if (!loading) return null;

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: 4,
      }}
    >
      {/* Animated Tractor or Plant Icon */}
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{ color: '#2e7d32' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: size * 0.5,
          }}
        >
          🌱
        </Box>
      </Box>
      
      {/* Loading Message */}
      <Typography
        variant="h6"
        sx={{
          color: '#2e7d32',
          fontWeight: 600,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        {message || messages[messageIndex]}
      </Typography>
      
      {/* Progress Dots */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#2e7d32',
              animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': { transform: 'scale(0.6)' },
                '40%': { transform: 'scale(1)' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default FarmerSpinner;
