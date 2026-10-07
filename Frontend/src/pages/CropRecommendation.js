import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import InfoIcon from '@mui/icons-material/Info';
import SpaIcon from '@mui/icons-material/Spa';
import { recommendCrop } from '../services/api';
import ChatWidget from '../components/ChatWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';
import { translateDynamic } from '../i18n/translations';

const cropSuggestions = {
  rice: { icon: '🌾', conditions: 'High rainfall, humid conditions', season: 'Kharif' },
  wheat: { icon: '🌾', conditions: 'Cool climate, moderate rainfall', season: 'Rabi' },
  maize: { icon: '🌽', conditions: 'Warm climate, well-drained soil', season: 'Kharif' },
  cotton: { icon: '🧶', conditions: 'Warm climate, black soil', season: 'Kharif' },
  sugarcane: { icon: '🎋', conditions: 'Tropical climate, high water', season: 'Year Round' },
};

const CropRecommendation = () => {
  const { language } = useGlobalSettings();
  const { t } = useTranslation();
  const td = (val) => translateDynamic(language, val);

  const [formData, setFormData] = useState({
    nitrogen: 90,
    phosphorus: 40,
    potassium: 40,
    temperature: 25,
    humidity: 80,
    ph: 6.5,
    rainfall: 200,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleSubmit = async () => {
    // Comprehensive validation before hitting the API
    if (formData.nitrogen < 0 || formData.nitrogen > 200) {
      setError(t('validationN'));
      return;
    }
    if (formData.phosphorus < 0 || formData.phosphorus > 200) {
      setError(t('validationP'));
      return;
    }
    if (formData.potassium < 0 || formData.potassium > 300) {
      setError(t('validationK'));
      return;
    }
    if (formData.temperature < -10 || formData.temperature > 60) {
      setError(t('validationTemp'));
      return;
    }
    if (formData.humidity < 0 || formData.humidity > 100) {
      setError(t('validationHumidity'));
      return;
    }
    if (formData.ph < 0 || formData.ph > 14) {
      setError(t('validationPh'));
      return;
    }
    if (formData.rainfall < 0 || formData.rainfall > 500) {
      setError(t('validationRainfall'));
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await recommendCrop(formData);
      setResult(response);
    } catch (err) {
      // Show the actual API validation message when available
      const apiMessage = err?.message;
      const msg = apiMessage && !apiMessage.includes('500')
        ? apiMessage
        : t('errorBackend');
      setError(msg);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #558b2f 0%, #33691e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <GrassIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#33691e' }}>
            {t('cropTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('cropSubtitle')}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#33691e' }}>
                {t('enterCropData')}
              </Typography>

              <Grid container spacing={2.5}>
                {/* Nutrients */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('nitrogen')}
                      name="nitrogen"
                      type="number"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 140, step: 5 }}
                      size="small"
                      helperText={t('helperN')}
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('phosphorus')}
                      name="phosphorus"
                      type="number"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 140, step: 5 }}
                      size="small"
                      helperText={t('helperP')}
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('potassium')}
                      name="potassium"
                      type="number"
                      value={formData.potassium}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 200, step: 5 }}
                      size="small"
                      helperText={t('helperK')}
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#fce4ec', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('soilPh')}
                      name="ph"
                      type="number"
                      value={formData.ph}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 14, step: 0.1 }}
                      size="small"
                      helperText={t('phIdeal')}
                    />
                  </Paper>
                </Grid>

                {/* Climate */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#e0f2f1', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('temperature')}
                      name="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 50, step: 1 }}
                      size="small"
                      helperText={t('helperTemp')}
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#e1f5fe', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('humidity')}
                      name="humidity"
                      type="number"
                      value={formData.humidity}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 100, step: 5 }}
                      size="small"
                      helperText={t('helperHumidity')}
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 2 }}>
                    <TextField
                      fullWidth
                      label={t('rainfall')}
                      name="rainfall"
                      type="number"
                      value={formData.rainfall}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 500, step: 10 }}
                      size="small"
                      helperText={t('helperRainfall')}
                    />
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #558b2f 0%, #33691e 100%)',
                    flex: 1,
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('getRecommendation')
                  )}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setOpenInfo(true)}
                  startIcon={<InfoIcon />}
                  sx={{ fontWeight: 600 }}
                >
                  {t('info')}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          {result ? (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                borderLeft: '5px solid #558b2f',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {result.icon}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#33691e' }}>
                    {td(result.recommended_crop) || result.recommended_crop}
                  </Typography>
                  <Chip label={t('bestMatch')} color="success" sx={{ mt: 1 }} />
                </Box>

                <Paper sx={{ p: 2.5, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#333' }}>
                    {t('idealConditions')}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {td(result.conditions) || result.conditions}
                  </Typography>
                </Paper>

                <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#c8e6c9' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('nitrogen')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#2e7d32' }}>
                      {formData.nitrogen} mg/kg
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffcc80' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('temperature')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#f57f17' }}>
                      {formData.temperature}°C
                    </Typography>
                  </Paper>
                </Box>

                <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                  {t('cropSuccess')}
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, backgroundColor: '#f5f5f5' }}>
              <SpaIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t('fillDataPlaceholder')}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Crop Reference */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#33691e' }}>
          {t('commonPreferences')}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(cropSuggestions).map(([crop, info]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={crop}>
              <Card sx={{ borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' } }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>{info.icon}</Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t(`crop${crop.charAt(0).toUpperCase() + crop.slice(1)}`) || crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    {t(`cond${crop.charAt(0).toUpperCase() + crop.slice(1)}`) || info.conditions} — {info.season === 'Year Round' ? t('seasonYearRound') : t(`season${info.season}`) || info.season}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Info Dialog */}
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', backgroundColor: '#33691e', fontSize: '1.3rem' }}>
          {t('howItWorks')}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('aiAnalysis')}
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
            {t('soilNutrientsInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('soilNutrientsDesc')}
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {t('soilPhInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('soilPhDesc')}
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {t('climateInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('climateDesc')}
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {t('rainfallInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('rainfallDesc')}
          </Typography>

          <Box sx={{ mt: 2, p: 2.5, backgroundColor: '#f1f8e9', borderRadius: 2, border: '1px solid #aed581' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              📖 {t('howItWorks')} — Detailed Guide
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {t('cropInfoDetailed')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)} variant="contained" sx={{ backgroundColor: '#33691e', '&:hover': { backgroundColor: '#1b5e20' } }}>
            {t('gotIt')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Chatbot */}
      {result && <ChatWidget contextData={{ crop: result }} />}
    </Box>
  );
};

export default CropRecommendation;