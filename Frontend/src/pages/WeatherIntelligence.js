import React, { useState, useEffect } from 'react';
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
  Chip,
  Slider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterIcon from '@mui/icons-material/Water';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { analyzeWeatherRisk } from '../services/api';
import { getLiveWeather } from '../api/client';
import ChatWidget from '../components/ChatWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';

const WeatherIntelligence = () => {
  // useTranslation provides language internally
  const { t } = useTranslation();
  const months = t('months');

  // Live weather state
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState(null);
  const [, setLocationGranted] = useState(false);

  // Risk analysis state (manual)
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    temperature: 30,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const fetchInProgress = React.useRef(false);
  const mountedRef = React.useRef(true);

  // Auto-fetch live weather on mount
  useEffect(() => {
    mountedRef.current = true;
    fetchLiveWeather();
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLiveWeather = async () => {
    // Guard against duplicate calls (React StrictMode / geolocation race)
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    setLiveLoading(true);
    setLiveError(null);

    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (!mountedRef.current) { fetchInProgress.current = false; return; }
            setLocationGranted(true);
            const { latitude, longitude } = position.coords;
            const response = await getLiveWeather(latitude, longitude);
            if (!mountedRef.current) { fetchInProgress.current = false; return; }
            if (response.success) {
              setLiveWeather(response.data);
              // Auto-populate risk analysis form with live data
              if (response.data && response.data.current && response.data.current.temperature !== undefined) {
                setFormData(prev => ({
                  ...prev,
                  temperature: Math.round(response.data.current.temperature),
                }));
              }
            } else {
              setLiveError(response.error);
            }
            setLiveLoading(false);
            fetchInProgress.current = false;
          },
          async (err) => {
            if (!mountedRef.current) { fetchInProgress.current = false; return; }
            // Fallback: fetch with default coordinates (Mumbai)
            console.log('Location denied, using default coordinates');
            const response = await getLiveWeather(19.076, 72.8777);
            if (!mountedRef.current) { fetchInProgress.current = false; return; }
            if (response.success) {
              setLiveWeather(response.data);
              if (response.data && response.data.current && response.data.current.temperature !== undefined) {
                setFormData(prev => ({
                  ...prev,
                  temperature: Math.round(response.data.current.temperature),
                }));
              }
            }
            setLiveLoading(false);
            fetchInProgress.current = false;
          },
          { timeout: 5000 }
        );
      } else {
        // No geolocation support, use default
        const response = await getLiveWeather(19.076, 72.8777);
        if (!mountedRef.current) { fetchInProgress.current = false; return; }
        if (response.success) {
          setLiveWeather(response.data);
        }
        setLiveLoading(false);
        fetchInProgress.current = false;
      }
    } catch (err) {
      if (mountedRef.current) {
        setLiveError(t('fetchError'));
        setLiveLoading(false);
      }
      fetchInProgress.current = false;
    }
  };

  const handleMonthChange = (event, newValue) => {
    setFormData({ ...formData, month: newValue });
  };

  const handleTempChange = (e) => {
    setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await analyzeWeatherRisk(formData.month, formData.temperature);
      setResult(response);
    } catch (err) {
      setError(err.message || t('errorBackend'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#999';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#f44336';
      case 'moderate': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#999';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box
          sx={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}
        >
          <CloudIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1565c0' }}>
            {t('weatherTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('weatherSubtitle')}
          </Typography>
        </Box>
      </Box>

      {/* ═══════════ LIVE WEATHER SECTION ═══════════ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#1565c0', display: 'flex', alignItems: 'center', gap: 1 }}>
          {t('liveWeather')} {liveWeather?.location?.city && `— ${liveWeather.location.city}`}
          {liveWeather?.source === 'openweathermap' && (
            <Chip label={t('live')} color="success" size="small" sx={{ ml: 1 }} />
          )}
        </Typography>

        {liveLoading ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography color="text.secondary">{t('fetchingWeather')}</Typography>
          </Paper>
        ) : liveWeather ? (
          <Grid container spacing={3}>
            {/* Main Weather Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(25,118,210,0.3)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.9 }}>
                    <LocationOnIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{liveWeather.location?.city || t('unknownLocation')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Typography sx={{ fontSize: 64 }}>{liveWeather.current?.icon || "⛅"}</Typography>
                    <Box>
                      <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1 }}>
                        {liveWeather.current?.temperature !== undefined ? liveWeather.current.temperature.toFixed(1) + "°C" : "--"}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                        {liveWeather.current?.description || t('noData')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('feelsLike')} {liveWeather.current?.feels_like !== undefined ? liveWeather.current.feels_like.toFixed(1) + "°C" : "--"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Weather Details Grid */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="caption" color="text.secondary">💧 {t('humidity')}</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#1976d2' }}>
                      {liveWeather.current?.humidity !== undefined ? liveWeather.current.humidity.toFixed(0) : "--"}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, backgroundColor: '#e8f5e9' }}>
                    <Typography variant="caption" color="text.secondary">🌬️ {t('wind')}</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#2e7d32' }}>
                      {liveWeather.current?.wind_speed || "--"} m/s
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{liveWeather.current?.wind_direction || ""}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, backgroundColor: '#fff3e0' }}>
                    <Typography variant="caption" color="text.secondary">📊 {t('pressure')}</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#ff9800' }}>
                      {liveWeather.current?.pressure || "--"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">hPa</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, backgroundColor: '#f3e5f5' }}>
                    <Typography variant="caption" color="text.secondary">👁️ {t('visibility')}</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#7b1fa2' }}>
                      {liveWeather.current?.visibility ? (liveWeather.current.visibility / 1000).toFixed(1) : "--"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">km</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Farming Advisory */}
            {/* Farming Advisory */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{
                borderRadius: 3,
                border: `2px solid ${getRiskColor(liveWeather.farming_advisory?.risk_level || 'low')}`,
                height: '100%',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={`${(liveWeather.farming_advisory?.risk_level || 'unknown').toUpperCase()} ${t('riskSuffix')}`}
                      sx={{
                        backgroundColor: getRiskColor(liveWeather.farming_advisory?.risk_level || 'low'),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                      size="small"
                    />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    {t('farmAdvisory')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {liveWeather.farming_advisory?.advisory || t('noAdvisory')}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                    {t('irrigation')}:
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {liveWeather.farming_advisory?.irrigation || t('noIrrigation')}
                  </Typography>
                  {(liveWeather.farming_advisory?.precautions || []).map((p, idx) => (
                    <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      • {p}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity={liveError ? "warning" : "info"}>
            {liveError || t('weatherError')}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchLiveWeather}
            startIcon={<CloudIcon />}
            disabled={liveLoading}
          >
            {liveLoading ? t('refreshing') : t('refreshWeather')}
          </Button>
        </Box>
      </Box>

      {/* ═══════════ RISK ANALYSIS SECTION ═══════════ */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#1565c0' }}>
        {t('aiRiskAnalysis')}
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#1565c0' }}>
                {t('selectSeasonTemp')}
              </Typography>

              {/* Month Selection */}
              <Paper sx={{ p: 2.5, backgroundColor: '#e3f2fd', borderRadius: 2, mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#1565c0' }}>
                    {t('monthLabel')}: <Chip label={months[formData.month - 1]} size="small" sx={{ ml: 1, fontWeight: 700 }} />
                  </Typography>
                </Box>
                <Slider
                  value={formData.month}
                  onChange={handleMonthChange}
                  min={1} max={12} step={1}
                  marks={[
                    { value: 1, label: t('months')[0].slice(0, 3) },
                    { value: 4, label: t('months')[3].slice(0, 3) },
                    { value: 7, label: t('months')[6].slice(0, 3) },
                    { value: 10, label: t('months')[9].slice(0, 3) },
                    { value: 12, label: t('months')[11].slice(0, 3) },
                  ]}
                  valueLabelDisplay="off"
                  sx={{
                    color: '#1976d2',
                    '& .MuiSlider-thumb': { backgroundColor: '#1976d2', width: 24, height: 24 },
                  }}
                />
              </Paper>

              {/* Temperature Input */}
              <Paper sx={{ p: 2.5, backgroundColor: '#fff3e0', borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ThermostatIcon sx={{ color: '#ff9800' }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#e65100' }}>
                    {t('tempLabel')}: <Chip label={`${formData.temperature}°C`} size="small" sx={{ ml: 1 }} />
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label={t('avgTemp')}
                  name="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={handleTempChange}
                  inputProps={{ min: -10, max: 50, step: 1 }}
                  variant="outlined"
                  size="small"
                  helperText={liveWeather && liveWeather.current && liveWeather.current.temperature ? t('liveTempHelper').replace('{temp}', liveWeather.current.temperature) : t('typicalRange')}
                />
              </Paper>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained" size="large"
                  onClick={handleSubmit} disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    flex: 1, fontWeight: 600, py: 1.5,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('analyzeRisk')}
                </Button>
                <Button
                  variant="outlined" size="large"
                  onClick={() => setOpenInfo(true)}
                  startIcon={<InfoIcon />}
                  sx={{ fontWeight: 600 }}
                >
                  {t('info')}
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          {result ? (
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${getStatusColor(result.status)}`,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>{result.icon}</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: getStatusColor(result.status) }}>
                    {result.label}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {result.description}
                  </Typography>
                </Box>

                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                    {t('conditionsAnalysis')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{t('monthLabel')}</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>
                          {months[formData.month - 1]}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{t('tempLabel')}</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#ff9800' }}>
                          {formData.temperature}°C
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {result.recommendation && (
                  <Paper sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      {t('recommendation')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.recommendation}
                    </Typography>
                  </Paper>
                )}

                {result.status === 'error' && (
                  <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
                    {t('highRiskAlert')}
                  </Alert>
                )}
                {result.status === 'warning' && (
                  <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                    {t('moderateRiskAlert')}
                  </Alert>
                )}
                {result.status === 'success' && (
                  <Alert severity="success" sx={{ borderRadius: 2, mt: 2 }}>
                    {t('safeConditionAlert')}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, backgroundColor: '#f5f5f5' }}>
              <WaterIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t('weatherPlaceholder')}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Risk Types Information */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#1565c0' }}>
          {t('understandingRisks')}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', border: '2px solid #1976d2' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>{t('floodRisk')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('when')}:</strong> {t('riskDescriptions').flood.when}<br />
                  <strong>{t('tempShort')}:</strong> {t('riskDescriptions').flood.temp}<br />
                  <strong>{t('action')}:</strong> {t('riskDescriptions').flood.action}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: '2px solid #ff9800' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>{t('droughtRisk')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('when')}:</strong> {t('riskDescriptions').drought.when}<br />
                  <strong>{t('tempShort')}:</strong> {t('riskDescriptions').drought.temp}<br />
                  <strong>{t('action')}:</strong> {t('riskDescriptions').drought.action}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', border: '2px solid #4caf50' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>{t('normalConditions')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('when')}:</strong> {t('riskDescriptions').normal.when}<br />
                  <strong>{t('tempShort')}:</strong> {t('riskDescriptions').normal.temp}<br />
                  <strong>{t('action')}:</strong> {t('riskDescriptions').normal.action}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Info Dialog */}
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', backgroundColor: '#1565c0', fontSize: '1.3rem' }}>
          {t('aboutWeather')}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('weatherFeatures')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {t('liveWeatherFeature')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('liveWeatherInfo')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {t('riskAnalysisFeature')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1 }}>
            {t('riskAnalysisInfo')}
          </Typography>
          <Box sx={{ mt: 2, p: 2.5, backgroundColor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              📖 {t('aboutWeather')} — {t('settingsPageTitle')}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {t('weatherInfoDetailed')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)} variant="contained">{t('close')}</Button>
        </DialogActions>
      </Dialog>

      {/* AI Chatbot */}
      {(result || liveWeather) && <ChatWidget contextData={{ weather: result || liveWeather }} />}
    </Box>
  );
};

export default WeatherIntelligence;
