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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import { getFertilizerAdvice } from '../services/api';
import ChatWidget from '../components/ChatWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';

const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
const cropTypes = [
  'Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy',
  'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'
];

const fertilizerInfo = {
  'Urea': { icon: '💧', use: 'High nitrogen content, quick release' },
  'DAP': { icon: '🔵', use: 'Diammonium phosphate, good for P deficiency' },
  'MOP': { icon: '🟠', use: 'Muriate of Potash, potassium supplement' },
  'NPK 10-26-26': { icon: '🟢', use: 'Balanced fertilizer for multiple nutrients' },
  'NPK 17-17-17': { icon: '⚪', use: 'Equal ratio fertilizer' },
  '14-35-14': { icon: '🔴', use: 'High phosphorus blend' },
  '28-28': { icon: '🟡', use: 'NP fertilizer combination' },
  '20-20': { icon: '🟣', use: 'Balanced NP fertilizer' },
  '10-10-10': { icon: '⚫', use: 'Starter fertilizer' },
};

// Maps English fertilizer name keys to fertUse translation sub-keys
const FERT_USE_KEYS = {
  'Urea': 'urea', 'DAP': 'dap', 'MOP': 'mop',
  'NPK 10-26-26': 'npk1', 'NPK 17-17-17': 'npk2',
  '14-35-14': 'pHigh', '28-28': 'npHigh', '20-20': 'npBal', '10-10-10': 'starter',
};

const FertilizerAdvisory = () => {
  // useGlobalSettings no longer needed here — useTranslation provides language

  const { t } = useTranslation();

  // Soil type translation: value sent to API stays in English; display is translated
  const SOIL_TYPE_KEYS = { Sandy: 'sandy', Loamy: 'loamy', Black: 'black', Red: 'red', Clayey: 'clayey' };
  const CROP_TYPE_KEYS = {
    Maize: 'maize', Sugarcane: 'sugarcane', Cotton: 'cotton', Tobacco: 'tobacco',
    Paddy: 'paddy', Barley: 'barley', Wheat: 'wheat', Millets: 'millets',
    'Oil seeds': 'oilseeds', Pulses: 'pulses', 'Ground Nuts': 'groundnuts',
  };
  const tSoilType = (val) => { const st = t('soilTypes'); return (typeof st === 'object' && SOIL_TYPE_KEYS[val]) ? st[SOIL_TYPE_KEYS[val]] || val : val; };
  const tCropType = (val) => { const ct = t('cropTypes'); return (typeof ct === 'object' && CROP_TYPE_KEYS[val]) ? ct[CROP_TYPE_KEYS[val]] || val : val; };
  const tFertUse = (name) => { const key = FERT_USE_KEYS[name]; if (!key) return fertilizerInfo[name]?.use || ''; const fu = t('fertUse'); return (typeof fu === 'object' && fu[key]) ? fu[key] : fertilizerInfo[name]?.use || ''; };

  const [formData, setFormData] = useState({
    nitrogen: 30,
    phosphorous: 10,
    potassium: 10,
    temperature: 25,
    humidity: 50,
    soilType: 'Loamy',
    cropType: 'Paddy',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['nitrogen', 'phosphorous', 'potassium', 'temperature', 'humidity'].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await getFertilizerAdvice(formData);
      setResult(response);
    } catch (err) {
      setError(t('errorBackend') || 'Failed to connect to backend API. Please ensure the backend server is running on port 8000.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocalHospitalIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            {t('fertTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('fertSubtitle')}
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenInfo(true)} color="error" title="Help Guide">
          <InfoIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      {/* Quick Guide Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', borderRadius: 3, border: '1px solid #ef9a9a' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('fertGuideTitle')}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
          {t('fertGuideText')}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic', color: '#b71c1c' }}>
          {t('fertProTip')}
        </Typography>
      </Paper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('nitrogen')}
                name="nitrogen"
                type="number"
                value={formData.nitrogen}
                onChange={handleChange}
                inputProps={{ min: 0, max: 200 }}
                helperText={t('currentNLevel')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('phosphorus')}
                name="phosphorous"
                type="number"
                value={formData.phosphorous}
                onChange={handleChange}
                inputProps={{ min: 0, max: 200 }}
                helperText={t('currentPLevel')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('potassium')}
                name="potassium"
                type="number"
                value={formData.potassium}
                onChange={handleChange}
                inputProps={{ min: 0, max: 200 }}
                helperText={t('currentKLevel')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('temperature')}
                name="temperature"
                type="number"
                value={formData.temperature}
                onChange={handleChange}
                inputProps={{ min: 0, max: 50 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('humidity')}
                name="humidity"
                type="number"
                value={formData.humidity}
                onChange={handleChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('soilType')}</InputLabel>
                <Select
                  name="soilType"
                  value={formData.soilType}
                  label={t('soilType')}
                  onChange={handleChange}
                >
                  {soilTypes.map((type) => (
                    <MenuItem key={type} value={type}>{tSoilType(type)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('cropTypeLabel')}</InputLabel>
                <Select
                  name="cropType"
                  value={formData.cropType}
                  label={t('cropTypeLabel')}
                  onChange={handleChange}
                >
                  {cropTypes.map((type) => (
                    <MenuItem key={type} value={type}>{tCropType(type)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 200, backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('getPrescription')}
            </Button>
          </Box>

          {result && (
            <Box sx={{ mt: 4 }}>
              <Alert
                severity="info"
                sx={{
                  fontSize: '1.1rem',
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #90caf9',
                }}
              >
                <Typography variant="h5" fontWeight={700} color="primary">
                  {t('recFert')}: {result.icon} {result.recommended_fertilizer || result.fertilizer}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {tFertUse(result.recommended_fertilizer || result.fertilizer) || result.use}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">{t('detectDef')}:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {result.deficiencies?.nitrogen && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowN')}</Alert>
                    )}
                    {(result.deficiencies?.phosphorous || result.deficiencies?.phosphorus) && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowP')}</Alert>
                    )}
                    {result.deficiencies?.potassium && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowK')}</Alert>
                    )}
                    {/* Fallback check for deficiency_analysis from new backend structure */}
                    {result.deficiency_analysis?.nitrogen.deficit > 0 && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowN')}</Alert>
                    )}
                    {result.deficiency_analysis?.phosphorus.deficit > 0 && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowP')}</Alert>
                    )}
                    {result.deficiency_analysis?.potassium.deficit > 0 && (
                      <Alert severity="warning" sx={{ py: 0 }}>{t('lowK')}</Alert>
                    )}

                    {!result.deficiencies && !result.deficiency_analysis && (
                      <Alert severity="success" sx={{ py: 0 }}>{t('noDef')}</Alert>
                    )}
                  </Box>
                </Box>
              </Alert>
            </Box>
          )}

          {error && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Fertilizer Reference */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('commonFert')}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(fertilizerInfo).slice(0, 6).map(([name, info]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {info.icon} {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tFertUse(name)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}        </Grid>
      </Box>

      {/* AI Chatbot */}
      {result && <ChatWidget contextData={{ fertilizer: result }} />}

      {/* Detailed Info Dialog */}
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ backgroundColor: '#d32f2f', color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>
          {t('fertInfoTitle')}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            {t('fertInfoIntro')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {[
            { title: 'fertInfoStep1Title', desc: 'fertInfoStep1Desc' },
            { title: 'fertInfoStep2Title', desc: 'fertInfoStep2Desc' },
            { title: 'fertInfoStep3Title', desc: 'fertInfoStep3Desc' },
            { title: 'fertInfoStep4Title', desc: 'fertInfoStep4Desc' },
          ].map((step, idx) => (
            <Paper key={idx} elevation={0} sx={{ p: 2, mb: 2, backgroundColor: idx % 2 === 0 ? '#fce4ec' : '#f1f8e9', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t(step.title)}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {t(step.desc)}
              </Typography>
            </Paper>
          ))}
          <Divider sx={{ my: 2 }} />
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#e8eaf6', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('fertInfoResultTitle')}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {t('fertInfoResultDesc')}
            </Typography>
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#e0f7fa', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('fertInfoNPKTitle')}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {t('fertInfoNPKDesc')}
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('fertInfoWhenTitle')}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {t('fertInfoWhenDesc')}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)} variant="contained" sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FertilizerAdvisory;
