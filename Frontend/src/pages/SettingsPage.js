// Settings Page - User Preferences for Farmers
// Customizable options for better user experience

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Button,
  Alert,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SpeedIcon from '@mui/icons-material/Speed';
import { ALL_INDIAN_STATES, LANGUAGE_NAMES } from '../context/GlobalSettingsContext';
import { getTranslation } from '../i18n/translations';
import useTranslation from '../hooks/useTranslation';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Language Settings
    language: localStorage.getItem('appLanguage') || 'en',

    // Voice Settings
    voiceEnabled: localStorage.getItem('voiceEnabled') === 'true' || true,
    voiceSpeed: parseFloat(localStorage.getItem('voiceSpeed')) || 0.9,
    autoSpeak: localStorage.getItem('autoSpeak') === 'true' || true,

    // Display Settings
    fontSize: localStorage.getItem('fontSize') || 'medium',
    theme: localStorage.getItem('theme') || 'light',
    animations: localStorage.getItem('animations') !== 'false',

    // Notification Settings
    notifications: localStorage.getItem('notifications') !== 'false',
    weatherAlerts: localStorage.getItem('weatherAlerts') !== 'false',
    cropReminders: localStorage.getItem('cropReminders') !== 'false',

    // Accessibility Settings
    highContrast: localStorage.getItem('highContrast') === 'true',
    simplifiedUI: localStorage.getItem('simplifiedUI') === 'true',
    keyboardShortcuts: localStorage.getItem('keyboardShortcuts') !== 'false',

    // Farmer-Specific Settings
    farmingExperience: localStorage.getItem('farmingExperience') || 'intermediate',
    primaryCrop: localStorage.getItem('primaryCrop') || 'Rice',
    location: localStorage.getItem('location') || 'Karnataka',
    measurementSystem: localStorage.getItem('measurementSystem') || 'metric',
  });

  const [saved, setSaved] = useState(false);

  // Helper to get translations based on the CURRENTLY SELECTED language in settings
  const t = (key) => getTranslation(settings.language, key);
  const opts = t('settingsOptions');

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Save all settings to localStorage
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, settings[key]);
    });
    // Also set specific keys for app-wide use
    localStorage.setItem('appLanguage', settings.language);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Reload page to apply settings
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const resetSettings = () => {
    if (window.confirm(t('resetConfirm'))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {t('settingsTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('settingsSubtitle')}
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t('savedSuccess')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Language & Communication */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TranslateIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('langComm')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('appLang')}</InputLabel>
                <Select
                  value={settings.language}
                  label={t('appLang')}
                  onChange={(e) => handleChange('language', e.target.value)}
                  MenuProps={{ PaperProps: { style: { maxHeight: 400 } } }}
                >
                  {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                    <MenuItem key={code} value={code}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('langDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Voice Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VolumeUpIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('voiceAudio')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.voiceEnabled}
                    onChange={(e) => handleChange('voiceEnabled', e.target.checked)}
                    color="success"
                  />
                }
                label={t('enableVoice')}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSpeak}
                    onChange={(e) => handleChange('autoSpeak', e.target.checked)}
                    color="success"
                    disabled={!settings.voiceEnabled}
                  />
                }
                label={t('autoSpeak')}
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" gutterBottom>
                {t('voiceSpeed')}: {settings.voiceSpeed.toFixed(1)}x
              </Typography>
              <Slider
                value={settings.voiceSpeed}
                onChange={(e, value) => handleChange('voiceSpeed', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                disabled={!settings.voiceEnabled}
                marks={[
                  { value: 0.5, label: opts.small?.split(' ')[0] || 'Slow' },
                  { value: 1.0, label: opts.medium?.split(' ')[0] || 'Normal' },
                  { value: 2.0, label: opts.large?.split(' ')[0] || 'Fast' }
                ]}
                sx={{ color: '#2e7d32' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkModeIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('displayApp')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('fontSize')}</InputLabel>
                <Select
                  value={settings.fontSize}
                  label={t('fontSize')}
                  onChange={(e) => handleChange('fontSize', e.target.value)}
                >
                  <MenuItem value="small">{opts.small}</MenuItem>
                  <MenuItem value="medium">{opts.medium}</MenuItem>
                  <MenuItem value="large">{opts.large}</MenuItem>
                  <MenuItem value="xlarge">{opts.xlarge}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('theme')}</InputLabel>
                <Select
                  value={settings.theme}
                  label={t('theme')}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <MenuItem value="light">{opts.light}</MenuItem>
                  <MenuItem value="dark">{opts.dark}</MenuItem>
                  <MenuItem value="auto">{opts.auto}</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animations}
                    onChange={(e) => handleChange('animations', e.target.checked)}
                    color="success"
                  />
                }
                label={t('enableAnim')}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('notifAlerts')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                    color="success"
                  />
                }
                label={t('enableNotif')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.weatherAlerts}
                    onChange={(e) => handleChange('weatherAlerts', e.target.checked)}
                    color="success"
                    disabled={!settings.notifications}
                  />
                }
                label={t('weatherAlerts')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cropReminders}
                    onChange={(e) => handleChange('cropReminders', e.target.checked)}
                    color="success"
                    disabled={!settings.notifications}
                  />
                }
                label={t('cropReminders')}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Accessibility */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessibilityIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('accessibility')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.highContrast}
                    onChange={(e) => handleChange('highContrast', e.target.checked)}
                    color="success"
                  />
                }
                label={t('highContrast')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.simplifiedUI}
                    onChange={(e) => handleChange('simplifiedUI', e.target.checked)}
                    color="success"
                  />
                }
                label={t('simplifiedUI')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.keyboardShortcuts}
                    onChange={(e) => handleChange('keyboardShortcuts', e.target.checked)}
                    color="success"
                  />
                }
                label={t('keyShortcuts')}
              />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('accessDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Farmer Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t('farmerProfile')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('farmExp')}</InputLabel>
                <Select
                  value={settings.farmingExperience}
                  label={t('farmExp')}
                  onChange={(e) => handleChange('farmingExperience', e.target.value)}
                >
                  <MenuItem value="beginner">{opts.beginner}</MenuItem>
                  <MenuItem value="intermediate">{opts.intermediate}</MenuItem>
                  <MenuItem value="advanced">{opts.advanced}</MenuItem>
                  <MenuItem value="expert">{opts.expert}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('priCrop')}</InputLabel>
                <Select
                  value={settings.primaryCrop}
                  label={t('priCrop')}
                  onChange={(e) => handleChange('primaryCrop', e.target.value)}
                >
                  <MenuItem value="Rice">{opts.rice}</MenuItem>
                  <MenuItem value="Wheat">{opts.wheat}</MenuItem>
                  <MenuItem value="Maize">{opts.maize}</MenuItem>
                  <MenuItem value="Cotton">{opts.cotton}</MenuItem>
                  <MenuItem value="Sugarcane">{opts.sugarcane}</MenuItem>
                  <MenuItem value="Vegetables">{opts.vegetables}</MenuItem>
                  <MenuItem value="Fruits">{opts.fruits}</MenuItem>
                  <MenuItem value="Mixed">{opts.mixed}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('locationState')}</InputLabel>
                <Select
                  value={settings.location}
                  label={t('locationState')}
                  onChange={(e) => handleChange('location', e.target.value)}
                >
                  {ALL_INDIAN_STATES.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('measureSys')}</InputLabel>
                <Select
                  value={settings.measurementSystem}
                  label={t('measureSys')}
                  onChange={(e) => handleChange('measurementSystem', e.target.value)}
                >
                  <MenuItem value="metric">{opts.metric}</MenuItem>
                  <MenuItem value="imperial">{opts.imperial}</MenuItem>
                  <MenuItem value="local">{opts.local}</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Settings Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('currSettings')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Chip label={`Language: ${settings.language.toUpperCase()}`} color="success" />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Chip label={`Voice: ${settings.voiceEnabled ? 'ON' : 'OFF'}`} color={settings.voiceEnabled ? 'success' : 'default'} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Chip label={`Theme: ${settings.theme}`} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Chip label={`Font: ${settings.fontSize}`} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Chip label={`Experience: ${settings.farmingExperience}`} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Chip label={`Crop: ${settings.primaryCrop}`} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={saveSettings}
              sx={{
                minWidth: 200,
                backgroundColor: '#2e7d32',
                '&:hover': { backgroundColor: '#1b5e20' }
              }}
            >
              {t('saveSettings')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RestartAltIcon />}
              onClick={resetSettings}
              color="error"
            >
              {t('resetDefault')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
