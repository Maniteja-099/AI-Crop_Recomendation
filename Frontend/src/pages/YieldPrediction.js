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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import { predictYield } from '../services/api';
import ChatWidget from '../components/ChatWidget';
import { ALL_INDIAN_STATES, useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';

const seasons = ['Kharif', 'Rabi', 'Whole Year'];

const YieldPrediction = () => {
  const { language } = useGlobalSettings();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    crop: 'Rice',
    season: 'Kharif',
    state: 'Karnataka',
    area: 1.0,
    rainfall: 1000,
    fertilizer: 500,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'area' || name === 'rainfall' || name === 'fertilizer'
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await predictYield(formData);
      setResult({
        yield: response.yield_value,
        perHectare: response.perHectare,
        area: response.area,
      });
    } catch (err) {
      setError(t('errorBackend'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            {t('yieldTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('yieldSubtitle')}
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenInfo(true)} color="primary" title="Help Guide">
          <InfoIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      {/* Quick Guide Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', borderRadius: 3, border: '1px solid #ffcc80' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('yieldGuideTitle')}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
          {t('yieldGuideText')}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic', color: '#e65100' }}>
          {t('yieldProTip')}
        </Typography>
      </Paper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('cropName')}
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                helperText={t('helperCropName')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('seasonLabel')}</InputLabel>
                <Select
                  name="season"
                  value={formData.season}
                  label={t('seasonLabel')}
                  onChange={handleChange}
                >
                  {seasons.map((season) => (
                    <MenuItem key={season} value={season}>
                      {season === 'Kharif' ? t('kharifTitle') :
                        season === 'Rabi' ? t('rabiTitle') :
                          t('wholeYearTitle')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('stateLabel')}</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  label={t('stateLabel')}
                  onChange={handleChange}
                >
                  {ALL_INDIAN_STATES.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('areaLabel')}
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                inputProps={{ min: 0.1, max: 10000, step: 0.1 }}
                helperText={t('areaLabel')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('rainfallLabel')}
                name="rainfall"
                type="number"
                value={formData.rainfall}
                onChange={handleChange}
                inputProps={{ min: 0, max: 3000 }}
                helperText={t('rainfallLabel')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('fertilizerLabel')}
                name="fertilizer"
                type="number"
                value={formData.fertilizer}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10000 }}
                helperText={t('fertilizerLabel')}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 200, backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('predictButton')}
            </Button>
          </Box>

          {result && (
            <Box sx={{ mt: 4 }}>
              <Alert
                severity="success"
                sx={{
                  fontSize: '1.1rem',
                  backgroundColor: '#fff3e0',
                  border: '1px solid #ffcc80',
                }}
              >
                <Typography variant="h5" fontWeight={700} color="warning.dark">
                  {t('resultTitle')}: {result.yield} {t('tons')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('yieldPerHa')}: {result.perHectare} {t('tons')}/ha | {t('totalArea')}: {result.area} ha
                </Typography>
              </Alert>
            </Box>
          )}

          {error && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="error">
                {t('errorBackend') || error}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Season Info */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7' }}>
            <CardContent>
              <Typography variant="h6">{t('kharifTitle')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('kharifDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082' }}>
            <CardContent>
              <Typography variant="h6">{t('rabiTitle')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('rabiDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9' }}>
            <CardContent>
              <Typography variant="h6">{t('wholeYearTitle')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('wholeYearDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Chatbot */}
      {result && <ChatWidget contextData={{ yield: result }} />}

      {/* Detailed Info Dialog */}
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ backgroundColor: '#ff9800', color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>
          {t('yieldInfoTitle')}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            {t('yieldInfoIntro')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {[
            { title: 'yieldInfoStep1Title', desc: 'yieldInfoStep1Desc' },
            { title: 'yieldInfoStep2Title', desc: 'yieldInfoStep2Desc' },
            { title: 'yieldInfoStep3Title', desc: 'yieldInfoStep3Desc' },
            { title: 'yieldInfoStep4Title', desc: 'yieldInfoStep4Desc' },
            { title: 'yieldInfoStep5Title', desc: 'yieldInfoStep5Desc' },
            { title: 'yieldInfoStep6Title', desc: 'yieldInfoStep6Desc' },
          ].map((step, idx) => (
            <Paper key={idx} elevation={0} sx={{ p: 2, mb: 2, backgroundColor: idx % 2 === 0 ? '#fff8e1' : '#f1f8e9', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t(step.title)}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {t(step.desc)}
              </Typography>
            </Paper>
          ))}
          <Divider sx={{ my: 2 }} />
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('yieldInfoResultTitle')}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {t('yieldInfoResultDesc')}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)} variant="contained" sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' } }}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default YieldPrediction;
