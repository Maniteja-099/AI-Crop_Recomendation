// Unified Dashboard - Enter Data Once, Get Complete Intelligence Report
// Modern Agritech Design

import React, { useState, useEffect, useCallback } from 'react';
import { getFullReport, getLiveWeather } from '../api/client';
import ChatWidget from '../components/ChatWidget';
import { useGlobalSettings, ALL_INDIAN_STATES } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';
import { translateDynamic } from '../i18n/translations';

const UnifiedDashboard = () => {
  const { farmingRegion, locationStatus, language } = useGlobalSettings();
  const { t } = useTranslation();
  const td = (val) => translateDynamic(language, val);
  const months = t('months');
  const getMonthName = (i) => Array.isArray(months) ? months[i] : new Date(2024, i).toLocaleString('default', { month: 'long' });

  const currentMonth = new Date().getMonth() + 1; // 1-indexed

  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    month: currentMonth,
    area: '',
    state: '',
    season: 'Kharif',
    soil_type: 'Loamy'
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [weatherSource, setWeatherSource] = useState(null); // 'live' | 'manual' | null
  const [weatherLoading, setWeatherLoading] = useState(false);
  const weatherFetchInProgress = React.useRef(false);
  const weatherMountedRef = React.useRef(true);

  // Auto-fetch real-time weather on mount using geolocation
  const fetchRealTimeWeather = useCallback(async () => {
    if (!navigator.geolocation) return;
    // Guard against duplicate calls (React StrictMode double-mount)
    if (weatherFetchInProgress.current) return;
    weatherFetchInProgress.current = true;

    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!weatherMountedRef.current) { weatherFetchInProgress.current = false; return; }
        const { latitude, longitude } = position.coords;
        const result = await getLiveWeather(latitude, longitude);
        if (!weatherMountedRef.current) { weatherFetchInProgress.current = false; return; }
        if (result.success && result.data?.current) {
          const weather = result.data.current;
          setFormData(prev => ({
            ...prev,
            temperature: Math.round(weather.temperature) || prev.temperature,
            humidity: Math.round(weather.humidity) || prev.humidity,
            // Estimate monthly rainfall from current conditions
            rainfall: weather.humidity > 75 ? 200 : weather.humidity > 60 ? 120 : 60,
            month: currentMonth,
          }));
          setWeatherSource('live');
        }
        setWeatherLoading(false);
        weatherFetchInProgress.current = false;
      },
      () => {
        // Geolocation denied — leave fields for manual entry
        if (weatherMountedRef.current) setWeatherLoading(false);
        weatherFetchInProgress.current = false;
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [currentMonth]);

  // Sync global farmingRegion into form state when detected
  useEffect(() => {
    if (farmingRegion) {
      setFormData(prev => ({
        ...prev,
        state: farmingRegion
      }));
    }
  }, [farmingRegion]);

  // Auto-fetch real-time weather on mount
  useEffect(() => {
    weatherMountedRef.current = true;
    fetchRealTimeWeather();
    return () => { weatherMountedRef.current = false; };
  }, [fetchRealTimeWeather]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Mark weather as manually overridden if user changes weather fields
    if (['temperature', 'humidity', 'rainfall', 'month'].includes(name)) {
      setWeatherSource('manual');
    }
    setFormData(prev => ({
      ...prev,
      [name]: ['nitrogen', 'phosphorus', 'potassium', 'ph', 'temperature',
        'humidity', 'rainfall', 'month', 'area'].includes(name)
        ? (value === '' ? '' : parseFloat(value) || 0)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    // Validate required fields are filled
    const requiredNumeric = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'temperature', 'humidity', 'rainfall', 'area'];
    const emptyFields = requiredNumeric.filter(f => formData[f] === '' || formData[f] === undefined);
    if (emptyFields.length > 0) {
      setError(t('fillAllFields') || 'Please fill in all required fields before generating the report.');
      setLoading(false);
      return;
    }

    // Validation
    if (formData.temperature > 60 || formData.temperature < -10) {
      setError(t('invalidTemp'));
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      nitrogen: parseFloat(formData.nitrogen) || 0,
      phosphorus: parseFloat(formData.phosphorus) || 0,
      potassium: parseFloat(formData.potassium) || 0,
      ph: parseFloat(formData.ph) || 0,
      temperature: parseFloat(formData.temperature) || 0,
      humidity: parseFloat(formData.humidity) || 0,
      rainfall: parseFloat(formData.rainfall) || 0,
      area: parseFloat(formData.area) || 0,
      language
    };

    const result = await getFullReport(submitData);

    if (result.success) {
      setReport(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fertilizerDeficiencies = report?.report?.fertilizer?.deficiencies || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Enhanced Header with Animation */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <div className="inline-block mb-4">
          <div className="text-6xl animate-bounce">🌾</div>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 leading-tight">
          {t('reportTitle')}
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          {t('reportSubtitle')}
        </p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-green-700">
            {t('soilAnalysis')}
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-blue-700">
            {t('weatherIntel')}
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-amber-700">
            {t('cropRecommend')}
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-purple-700">
            {t('fertGuide')}
          </span>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto grid ${report || loading ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>

        {/* LEFT PANEL - Input Form */}
        {!report && !loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {t('farmDataInput')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('formSubtitle')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Soil Nutrients Section */}
              <div className="border-l-4 border-green-500 pl-4 bg-green-50 py-3 pr-4 rounded-r-lg">
                <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  {t('soilNutrients')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-green-600">●</span> {t('nitrogen')}
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      placeholder="e.g. 90"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-orange-600">●</span> {t('phosphorus')}
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      placeholder="e.g. 42"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-purple-600">●</span> {t('potassium')}
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      placeholder="e.g. 43"
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-blue-600">●</span> {t('phLevel')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      value={formData.ph}
                      onChange={handleInputChange}
                      placeholder="e.g. 6.5"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Weather Section */}
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-blue-700 flex items-center gap-2">
                    {t('weatherConditions')}
                  </h3>
                  <div className="flex items-center gap-2">
                    {weatherLoading && (
                      <span className="text-xs text-blue-600 animate-pulse flex items-center gap-1">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        {t('fetchingWeather') || 'Fetching weather...'}
                      </span>
                    )}
                    {weatherSource === 'live' && !weatherLoading && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        ✅ {t('liveWeatherData') || 'Live Weather'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={fetchRealTimeWeather}
                      className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                      disabled={weatherLoading}
                    >
                      🔄 {t('refreshWeather') || 'Refresh'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-red-600">🌡️</span> {t('temperature')}
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      placeholder="°C"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-cyan-600">💧</span> {t('humidity')}
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      placeholder="%"
                      className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-blue-600">🌧️</span> {t('rainfall')}
                    </label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      placeholder="mm"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span className="text-indigo-600">📅</span> {t('month')}
                    </label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg shadow-sm"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {getMonthName(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Farm Details Section */}
              <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 py-3 pr-4 rounded-r-lg">
                <h3 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                  {t('farmDetails')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('area')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="hectares"
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                      <span>{t('state')}</span>
                      {locationStatus === 'detecting' && (
                        <span className="text-xs text-blue-600 flex items-center gap-1 animate-pulse">
                          📍 {t('detectingLoc')}
                        </span>
                      )}
                      {locationStatus === 'detected' && (
                        <span className="text-xs text-green-600">
                          📍 {t('autoDetected')}
                        </span>
                      )}
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    >
                      {ALL_INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('season')}
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none text-lg"
                    >
                      <option value="Kharif">{t('seasonKharif')}</option>
                      <option value="Rabi">{t('seasonRabi')}</option>
                      <option value="Zaid">{t('seasonZaid')}</option>
                      <option value="Whole Year">{t('seasonWholeYear')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('soilType')}
                    </label>
                    <select
                      name="soil_type"
                      value={formData.soil_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    >
                      <option value="Loamy">{t('soilLoamy')}</option>
                      <option value="Sandy">{t('soilSandy')}</option>
                      <option value="Clayey">{t('soilClayey')}</option>
                      <option value="Black">{t('soilBlack')}</option>
                      <option value="Red">{t('soilRed')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold text-xl rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('analyzingFarm')}
                  </span>
                ) : (
                  t('generateReport')
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                <p className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">❌</span> {t('error')}
                </p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* RIGHT PANEL - Report Card */}
        <div className={`bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-500 ${report ? 'w-full' : ''}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span> {t('comprehensiveReport')}
          </h2>

          {!report && !loading && (
            <div className="text-center py-16">
              <div className="text-7xl mb-6 animate-pulse">🌱</div>
              <p className="text-gray-600 text-xl font-semibold mb-2">
                {t('farmReady')}
              </p>
              <p className="text-gray-500">
                {t('fillFormHint')}
              </p>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <div className="bg-green-50 px-4 py-3 rounded-lg">
                  <div className="text-2xl mb-1">🧪</div>
                  <p className="text-xs font-semibold text-gray-700">{t('soilAnalysis').replace(/^[✅] /, '')}</p>
                </div>
                <div className="bg-blue-50 px-4 py-3 rounded-lg">
                  <div className="text-2xl mb-1">🌤️</div>
                  <p className="text-xs font-semibold text-gray-700">{t('weatherIntel').replace(/^[🌤️] /, '')}</p>
                </div>
                <div className="bg-amber-50 px-4 py-3 rounded-lg">
                  <div className="text-2xl mb-1">🌾</div>
                  <p className="text-xs font-semibold text-gray-700">{t('cropRecommend').replace(/^[🌾] /, '')}</p>
                </div>
                <div className="bg-purple-50 px-4 py-3 rounded-lg">
                  <div className="text-2xl mb-1">💧</div>
                  <p className="text-xs font-semibold text-gray-700">{t('fertGuide').replace(/^[💧] /, '')}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {/* Skeleton Loader */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-xl mb-2"></div>
                </div>
              ))}
            </div>
          )}

          {report && (
            <div className="space-y-4">
              <button
                onClick={() => { setReport(null); setLoading(false); }}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold text-lg transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg border-2 border-green-100"
              >
                <span className="text-xl">←</span> {t('enterNewData') || 'Enter New Data'}
              </button>

              {/* Main Verdict */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 rounded-2xl shadow-2xl border-4 border-green-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">🌾</div>
                <p className="text-sm font-bold tracking-wide uppercase mb-2">{t('aiRec')}</p>
                <h3 className="text-5xl font-extrabold mt-2 mb-4 drop-shadow-lg relative z-10">{td(report.summary.verdict) || report.summary.verdict}</h3>
                <div className="flex items-center gap-4 mt-4 relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl flex-1">
                    <p className="text-xs opacity-90 mb-1">{t('aiConfidence')}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold">{report.confidence}%</p>
                      <div className="flex-1">
                        <div className="bg-white/30 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full" style={{ width: `${report.confidence}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                    <p className="text-xs opacity-90">{t('statusVerified').replace('✅ ', '')}</p>
                    <p className="text-lg font-bold">{t('statusVerified')}</p>
                  </div>
                </div>
              </div>

              {/* Soil Health */}
              <div className={`p-6 rounded-2xl border-l-8 shadow-xl transition-all hover:shadow-2xl ${report.report.soil.status === 'success' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-600' :
                report.report.soil.status === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-600' :
                  'bg-gradient-to-br from-red-50 to-red-100 border-red-600'
                }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-6xl">{report.report.soil.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('soilHealthStatus')}</p>
                    <h4 className="text-3xl font-extrabold text-gray-900">
                      {td(report.report.soil.message)}
                    </h4>
                  </div>
                </div>
                <div className="bg-white/70 p-4 rounded-xl shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('nutrientLevel')}</span>
                    <span className="text-2xl font-extrabold text-gray-900">{report.report.soil.avg_nutrients} <span className="text-sm font-normal text-gray-600">mg/kg</span></span>
                  </div>
                  <div className="bg-gray-300 h-4 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all ${report.report.soil.status === 'success' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      report.report.soil.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`} style={{ width: `${Math.min((report.report.soil.avg_nutrients / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div className="mt-4 bg-white/80 p-4 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-base font-bold text-gray-800 flex items-start gap-2">
                    <span className="text-2xl">💡</span>
                    <span className="flex-1">{td(report.report.soil.recommendation)}</span>
                  </p>
                </div>
              </div>

              {/* Weather Risk */}
              <div className={`p-6 rounded-2xl border-l-8 shadow-xl transition-all hover:shadow-2xl ${report.report.weather.status === 'success' ? 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-600' :
                report.report.weather.status === 'warning' ? 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-600' :
                  'bg-gradient-to-br from-red-50 to-pink-100 border-red-600'
                }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-7xl">{report.report.weather.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('weatherCond')}</p>
                    <h4 className="text-3xl font-extrabold text-gray-900">
                      {td(report.report.weather.label) || report.report.weather.label}
                    </h4>
                  </div>
                </div>
                <div className="bg-white/70 p-4 rounded-xl shadow-inner mb-4">
                  <p className="text-base text-gray-800 font-semibold">
                    {td(report.report.weather.description) || report.report.weather.description}
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border-l-4 border-blue-500">
                  <p className="text-base font-bold text-gray-800 flex items-start gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="flex-1">{td(report.report.weather.recommendation) || report.report.weather.recommendation}</span>
                  </p>
                </div>
              </div>

              {/* Crop Recommendation */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 border-l-8 border-green-600 shadow-xl transition-all hover:shadow-2xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{t('bestCrop')}</p>
                <div className="flex items-center gap-5 mb-4">
                  <div className="text-7xl animate-bounce">{report.report.crop.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-4xl font-extrabold text-gray-900 mb-3">
                      {td(report.report.crop.crop) || report.report.crop.crop}
                    </h4>
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full shadow-lg">
                      <span className="text-lg">✓</span>
                      <span className="text-lg font-bold">{report.report.crop.confidence}% {t('perfectMatch')}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-xl shadow-inner">
                  <p className="text-base text-gray-800 font-semibold flex items-center gap-2">
                    <span className="text-2xl">📍</span>
                    <span>{td(report.report.crop.conditions) || report.report.crop.conditions}</span>
                  </p>
                </div>
              </div>

              {/* Yield Prediction */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-l-8 border-amber-600 shadow-xl transition-all hover:shadow-2xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{t('expectedProd')}</p>
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg mb-4">
                  <div className="text-center mb-4">
                    <p className="text-sm font-bold text-gray-600 mb-2">{t('totalHarvest')}</p>
                    <h4 className="text-6xl font-extrabold text-amber-700 mb-2">
                      {report.report.yield.yield_value}
                    </h4>
                    <p className="text-2xl font-bold text-gray-700">{t('tons')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-amber-50 p-3 rounded-lg text-center border-2 border-amber-200">
                      <p className="text-xs text-gray-600 mb-1">{t('perHectareLabel')}</p>
                      <p className="text-xl font-bold text-amber-700">{report.report.yield.perHectare} {t('tons')}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center border-2 ${report.report.yield.quality === 'Excellent' ? 'bg-green-50 border-green-400' :
                      report.report.yield.quality === 'Good' ? 'bg-blue-50 border-blue-400' :
                        'bg-yellow-50 border-yellow-400'
                      }`}>
                      <p className="text-xs text-gray-600 mb-1">{t('qualityLabel')}</p>
                      <p className="text-lg font-bold text-gray-900">{report.report.yield.quality === 'Excellent' ? t('qualityExcellent') : report.report.yield.quality === 'Good' ? t('qualityGood') : t('qualityFair')}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl text-center shadow-lg">
                  <p className="text-sm mb-1 opacity-90">💰 {t('estimatedValue')}</p>
                  <p className="text-3xl font-extrabold">₹ {(report.report.yield.yield_value * 15000).toLocaleString('en-IN')}</p>
                  <p className="text-xs opacity-80 mt-1">{t('priceDisclaimer')}</p>
                </div>
              </div>

              {/* Fertilizer Advisory */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 border-l-8 border-purple-600 shadow-xl transition-all hover:shadow-2xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{t('fertPrescription')}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-6xl">{report.report.fertilizer.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-3xl font-extrabold text-gray-900">
                      {td(report.report.fertilizer.fertilizer) || report.report.fertilizer.fertilizer}
                    </h4>
                    <p className="text-sm text-gray-700 mt-2 font-semibold">
                      {td(report.report.fertilizer.use) || report.report.fertilizer.use}
                    </p>
                  </div>
                </div>
                <div className="bg-white/80 p-5 rounded-xl shadow-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-700 flex items-center gap-2">
                      <span className="text-2xl">📦</span>
                      <span>{t('applicationRate')}</span>
                    </span>
                    <span className="text-3xl font-extrabold text-purple-700">{td(report.report.fertilizer.application_rate) || report.report.fertilizer.application_rate}</span>
                  </div>
                </div>
                {(fertilizerDeficiencies.nitrogen ||
                  fertilizerDeficiencies.phosphorous || fertilizerDeficiencies.phosphorus ||
                  fertilizerDeficiencies.potassium) && (
                    <div className="bg-red-50 border-4 border-red-300 p-5 rounded-xl">
                      <p className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        <span>{t('deficiencyAlert')}</span>
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {fertilizerDeficiencies.nitrogen && (
                          <div className="bg-red-100 p-3 rounded-lg border-l-4 border-red-600">
                            <p className="font-bold text-red-900 flex items-center gap-2">
                              <span className="text-xl">🔴</span>
                              <span>{t('nDeficiency')}</span>
                            </p>
                          </div>
                        )}
                        {(fertilizerDeficiencies.phosphorous || fertilizerDeficiencies.phosphorus) && (
                          <div className="bg-orange-100 p-3 rounded-lg border-l-4 border-orange-600">
                            <p className="font-bold text-orange-900 flex items-center gap-2">
                              <span className="text-xl">🟠</span>
                              <span>{t('pDeficiency')}</span>
                            </p>
                          </div>
                        )}
                        {fertilizerDeficiencies.potassium && (
                          <div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-600">
                            <p className="font-bold text-yellow-900 flex items-center gap-2">
                              <span className="text-xl">🟡</span>
                              <span>{t('kDeficiency')}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-gray-500 text-center pt-2">
                {t('generatedAt')} {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div >

      {/* Chat Widget */}
      {report && <ChatWidget contextData={report.report} />}
    </div >
  );
};

export default UnifiedDashboard;
