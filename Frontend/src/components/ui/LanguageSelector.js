// Language Selector Component
// Easy language switching with visual flags

import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckIcon from '@mui/icons-material/Check';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

const LanguageSelector = ({ currentLanguage = 'en', onLanguageChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode) => {
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    handleClose();
  };

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="outlined"
        startIcon={<TranslateIcon />}
        sx={{
          borderRadius: '12px',
          padding: '8px 16px',
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '1.2rem' }}>{currentLang.flag}</Typography>
          <Typography sx={{ fontWeight: 600 }}>{currentLang.nativeName}</Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={lang.code === currentLanguage}
            sx={{
              padding: '12px 20px',
              '&.Mui-selected': {
                backgroundColor: '#e8f5e9',
              },
            }}
          >
            <ListItemIcon sx={{ fontSize: '1.5rem', minWidth: 40 }}>
              {lang.flag}
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 500 }}>{lang.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.nativeName}
              </Typography>
            </ListItemText>
            {lang.code === currentLanguage && (
              <CheckIcon sx={{ color: '#2e7d32', ml: 2 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
