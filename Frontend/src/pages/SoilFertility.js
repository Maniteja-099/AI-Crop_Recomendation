import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Slider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import InfoIcon from '@mui/icons-material/Info';
import NatureIcon from '@mui/icons-material/Nature';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScienceIcon from '@mui/icons-material/Science';
import { getComprehensiveSoilReport } from '../api/client';
import ChatWidget from '../components/ChatWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';
import { translateDynamic } from '../i18n/translations';

const SoilFertility = () => {
  const { language } = useGlobalSettings();
  const { t } = useTranslation();
  const td = (value) => translateDynamic(language, value);
  const [formData, setFormData] = useState({
    nitrogen: 50,
    phosphorus: 30,
    potassium: 30,
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setReport(null);
    setError(null);

    try {
      const response = await getComprehensiveSoilReport(
        formData.nitrogen,
        formData.phosphorus,
        formData.potassium
      );
      if (response.success) {
        setReport(response.data);
      } else {
        setError(response.error || t('errorBackend'));
      }
    } catch (err) {
      setError(err.message || t('fetchError'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNutrientColor = (status) => {
    switch (status) {
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'success': return '#4caf50';
      default: return '#999';
    }
  };

  const getProgressColor = (value, max = 100) => {
    const pct = (value / max) * 100;
    if (pct < 30) return '#f44336';
    if (pct < 60) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box
          sx={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}
        >
          <SpaIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#5d4037' }}>
            {t('soilTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('soilSubtitle')}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* ═══════════ INPUT SECTION ═══════════ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#5d4037' }}>
                {t('enterSoilValues')}
              </Typography>

              {/* Nitrogen */}
              <Paper sx={{ p: 2.5, backgroundColor: '#e8f5e9', borderRadius: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>🟢 {t('nitrogen')}</Typography>
                  <Chip label={`${formData.nitrogen} mg/kg`} size="small" color="success" />
                </Box>
                <Slider
                  value={formData.nitrogen}
                  onChange={handleSliderChange('nitrogen')}
                  min={0} max={140} step={5}
                  sx={{ color: '#4caf50' }}
                  valueLabelDisplay="auto"
                />
                <LinearProgress
                  variant="determinate"
                  value={(formData.nitrogen / 140) * 100}
                  sx={{
                    mt: 1, height: 8, borderRadius: 4, backgroundColor: '#c8e6c9',
                    '& .MuiLinearProgress-bar': { backgroundColor: getProgressColor(formData.nitrogen, 140) }
                  }}
                />
              </Paper>

              {/* Phosphorus */}
              <Paper sx={{ p: 2.5, backgroundColor: '#fff3e0', borderRadius: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>🟠 {t('phosphorus')}</Typography>
                  <Chip label={`${formData.phosphorus} mg/kg`} size="small" sx={{ backgroundColor: '#ff9800', color: 'white' }} />
                </Box>
                <Slider
                  value={formData.phosphorus}
                  onChange={handleSliderChange('phosphorus')}
                  min={0} max={140} step={5}
                  sx={{ color: '#ff9800' }}
                  valueLabelDisplay="auto"
                />
                <LinearProgress
                  variant="determinate"
                  value={(formData.phosphorus / 140) * 100}
                  sx={{
                    mt: 1, height: 8, borderRadius: 4, backgroundColor: '#ffe0b2',
                    '& .MuiLinearProgress-bar': { backgroundColor: getProgressColor(formData.phosphorus, 140) }
                  }}
                />
              </Paper>

              {/* Potassium */}
              <Paper sx={{ p: 2.5, backgroundColor: '#f3e5f5', borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>🔵 {t('potassium')}</Typography>
                  <Chip label={`${formData.potassium} mg/kg`} size="small" sx={{ backgroundColor: '#7b1fa2', color: 'white' }} />
                </Box>
                <Slider
                  value={formData.potassium}
                  onChange={handleSliderChange('potassium')}
                  min={0} max={200} step={5}
                  sx={{ color: '#7b1fa2' }}
                  valueLabelDisplay="auto"
                />
                <LinearProgress
                  variant="determinate"
                  value={(formData.potassium / 200) * 100}
                  sx={{
                    mt: 1, height: 8, borderRadius: 4, backgroundColor: '#e1bee7',
                    '& .MuiLinearProgress-bar': { backgroundColor: getProgressColor(formData.potassium, 200) }
                  }}
                />
              </Paper>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained" size="large" fullWidth
                  onClick={handleSubmit} disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
                    fontWeight: 600, py: 1.5,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('generateReport')}
                </Button>
                <Button
                  variant="outlined" size="large"
                  onClick={() => setOpenInfo(true)}
                  sx={{ minWidth: 50, fontWeight: 600 }}
                >
                  <InfoIcon />
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        {/* ═══════════ COMPREHENSIVE REPORT SECTION ═══════════ */}
        <Grid size={{ xs: 12, md: 8 }}>
          {report ? (
            <Box>
              {/* Summary Card */}
              <Card sx={{
                borderRadius: 3, mb: 3,
                background: report.soil_health.status === 'success'
                  ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                  : report.soil_health.status === 'warning'
                    ? 'linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%)'
                    : 'linear-gradient(135deg, #fce4ec 0%, #ffcdd2 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight={700}
                      sx={{ color: report.soil_health.status === 'success' ? '#2e7d32' : report.soil_health.status === 'warning' ? '#f57f17' : '#c62828' }}>
                      {report.soil_health.icon} {td(report.summary.overall_status)}
                    </Typography>
                    <Chip
                      label={`${t('fertilityScore')}: ${report.summary.fertility_score}%`}
                      sx={{
                        fontWeight: 700, fontSize: '1rem', py: 2.5, px: 1,
                        backgroundColor: report.soil_health.status === 'success' ? '#4caf50' : report.soil_health.status === 'warning' ? '#ff9800' : '#f44336',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip label={`${t('priority')}: ${td(report.summary.immediate_priority)}`} variant="outlined" size="small" />
                    <Chip label={`${t('nextTest')}: ${td(report.summary.next_test_due)}`} variant="outlined" size="small" />
                    <Chip label={`${report.yield_potential.icon} ${t('yieldLabel')}: ${td(report.yield_potential.level)}`} variant="outlined" size="small" />
                  </Box>
                </CardContent>
              </Card>

              {/* Nutrient Analysis Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={nutrient}>
                    <Card sx={{
                      borderRadius: 2,
                      borderLeft: `4px solid ${getNutrientColor(report.nutrient_analysis[nutrient].status)}`,
                      height: '100%',
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {report.nutrient_analysis[nutrient].icon} {t(nutrient)}
                          </Typography>
                          <Chip
                            label={td(report.nutrient_analysis[nutrient].level)}
                            size="small"
                            sx={{
                              backgroundColor: getNutrientColor(report.nutrient_analysis[nutrient].status),
                              color: 'white', fontWeight: 600, fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                        <Typography variant="h5" fontWeight={800} sx={{ color: getNutrientColor(report.nutrient_analysis[nutrient].status) }}>
                          {report.nutrient_analysis[nutrient].value} mg/kg
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {t('optimal')}: {report.nutrient_analysis[nutrient].optimal_range}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                          {td(report.nutrient_analysis[nutrient].recommendation)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Yield Potential */}
              <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AgricultureIcon sx={{ color: '#33691e' }} /> {t('yieldPotential')}
                  </Typography>
                  <Paper sx={{ p: 3, backgroundColor: '#f1f8e9', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h3">{report.yield_potential.icon}</Typography>
                      <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#33691e' }}>
                          {td(report.yield_potential.level)} {t('yieldPotentialLabel')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {td(report.yield_potential.estimate)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {td(report.yield_potential.description)}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              {/* Precautions */}
              <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {t('precautions')}
                  </Typography>
                  {report.precautions.map((p, idx) => {
                    // Strip emoji prefixes for translation, then re-add severity
                    const cleanP = p.replace(/^[✅⚠️🚨]\s*/, '');
                    const translated = td(cleanP) || td(p) || p;
                    return (
                      <Alert
                        key={idx}
                        severity={p.includes('✅') ? 'success' : p.includes('🚨') ? 'error' : 'warning'}
                        sx={{ mb: 1, borderRadius: 2 }}
                      >
                        {translated}
                      </Alert>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Actions for Optimal Growth */}
              <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NatureIcon sx={{ color: '#2e7d32' }} /> {t('actionsGrowth')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {report.actions_for_optimal_growth.map((action, idx) => (
                      <Paper key={idx} sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, borderLeft: '3px solid #4caf50' }}>
                        <Typography variant="body2">{td(action)}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Fertilizer Recommendations */}
              <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScienceIcon sx={{ color: '#1565c0' }} /> {t('fertilizerRec')}
                  </Typography>
                  <Grid container spacing={2}>
                    {report.fertilizer_recommendations.map((fert, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Paper sx={{
                          p: 2.5, borderRadius: 2,
                          border: '1px solid #e0e0e0',
                          background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                        }}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                            {fert.icon} {fert.name}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>{t('dosage')}:</strong> {fert.dosage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>{t('timing')}:</strong> {td(fert.timing)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>{t('purpose')}:</strong> {td(fert.purpose)}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, backgroundColor: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <SpaIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {t('enterValuesPlaceholder')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                {t('adjustSliders')}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Info Dialog */}
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', backgroundColor: '#5d4037', fontSize: '1.3rem' }}>
          {t('aboutSoil')}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('soilInfoIntro')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            🟢 {t('nitrogen')}:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('nitrogenDesc')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            🟠 {t('phosphorus')}:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('phosphorusDesc')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            🔵 {t('potassium')}:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('potassiumDesc')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
            📊 {t('reportIncludes')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 1, whiteSpace: 'pre-line', mb: 2 }}>
            {t('reportIncludesItems')}
          </Typography>
          <Box sx={{ mt: 2, p: 2.5, backgroundColor: '#efebe9', borderRadius: 2, border: '1px solid #bcaaa4' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              📖 {t('aboutSoil')} — Detailed Guide
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {t('soilInfoDetailed')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)} variant="contained" sx={{ backgroundColor: '#5d4037', '&:hover': { backgroundColor: '#3e2723' } }}>{t('understood')}</Button>
        </DialogActions>
      </Dialog>

      {/* AI Chatbot */}
      {report && <ChatWidget contextData={{ soil: report }} />}
    </Box>
  );
};

export default SoilFertility;
