import React, { useState } from 'react';
import { useGlobalSettings, LANGUAGE_NAMES, ALL_INDIAN_STATES } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';
import { Card, StatusBadge } from '../components/ui/ModernComponents';
import { Settings, Globe, Accessibility, MapPin, HelpCircle } from 'lucide-react';

export default function FarmerFriendlySettings() {
  const {
    language,
    setLanguage,
    accessibility,
    setAccessibility,
    farmingRegion,
    setFarmingRegion,
    locationStatus,
  } = useGlobalSettings();
  const { t } = useTranslation();

  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('language');
  const [langSearch, setLangSearch] = useState('');

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAccessibilityChange = (key) => {
    setAccessibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRegionChange = (e) => {
    setFarmingRegion(e.target.value);
  };

  // Tab components with simple, farmer-friendly design
  const SettingsTab = ({ icon: Icon, title, description, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-lg transition-all w-full text-left ${isActive
        ? 'bg-farm-600 text-white shadow-lg'
        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-farm-300'
        }`}
    >
      <Icon size={32} className="flex-shrink-0" />
      <div>
        <p className="font-bold text-lg">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-farm-600 to-farm-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Settings size={40} />
          <div>
            <h1 className="text-4xl font-bold">{t('settingsPageTitle')}</h1>
            <p className="text-farm-100 text-lg">{t('settingsCustomize')}</p>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showAlert && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-green-800">
          <p className="font-semibold">✅ {t('settingsUpdated')}</p>
          <p>{t('settingsSaved')}</p>
        </div>
      )}

      {/* Settings Tabs - Only 3 tabs: Language, Accessibility, Region */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SettingsTab
          icon={Globe}
          title={t('settingsLanguage')}
          description={t('settingsChangeLanguage')}
          onClick={() => setActiveTab('language')}
          isActive={activeTab === 'language'}
        />
        <SettingsTab
          icon={Accessibility}
          title={t('settingsAccessibility')}
          description={t('settingsAccessibilityDesc')}
          onClick={() => setActiveTab('accessibility')}
          isActive={activeTab === 'accessibility'}
        />
        <SettingsTab
          icon={MapPin}
          title={t('settingsFarmingRegion')}
          description={t('settingsFarmingRegionDesc')}
          onClick={() => setActiveTab('region')}
          isActive={activeTab === 'region'}
        />
      </div>

      {/* Language Settings */}
      {activeTab === 'language' && (
        <Card>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Globe size={32} className="text-farm-600" />
            {t('settingsLanguage')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('settingsSelectLanguageDesc')}
          </p>

          {/* Language search */}
          <div className="mb-6">
            <input
              type="text"
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              placeholder={t('settingsSearchLanguage') || 'Search languages...'}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-farm-500 focus:ring-2 focus:ring-farm-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
            {Object.entries(LANGUAGE_NAMES)
              .filter(([code, name]) => {
                if (!langSearch.trim()) return true;
                const q = langSearch.toLowerCase();
                return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
              })
              .map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`p-6 rounded-lg border-2 transition-all text-left font-semibold text-lg ${language === code
                  ? 'border-farm-600 bg-farm-50 text-farm-700'
                  : 'border-gray-300 hover:border-farm-400 text-gray-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span>{name}</span>
                  {language === code && (
                    <StatusBadge status={t('settingsSelected')} variant="success" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Accessibility Settings */}
      {activeTab === 'accessibility' && (
        <Card>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Accessibility size={32} className="text-farm-600" />
            {t('settingsAccessibility')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('settingsAccessibilityMakeEasier')}
          </p>

          <div className="space-y-4">
            {/* Large Text */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div>
                <p className="font-bold text-xl">{t('settingsLargeText')}</p>
                <p className="text-gray-600">{t('settingsLargeTextDesc')}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={accessibility.largeText}
                    onChange={() => handleAccessibilityChange('largeText')}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition ${accessibility.largeText ? 'bg-farm-600' : 'bg-gray-300'
                    }`}></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${accessibility.largeText ? 'translate-x-6' : ''
                      }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div>
                <p className="font-bold text-xl">{t('settingsHighContrast')}</p>
                <p className="text-gray-600">{t('settingsHighContrastDesc')}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={accessibility.highContrast}
                    onChange={() => handleAccessibilityChange('highContrast')}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition ${accessibility.highContrast ? 'bg-farm-600' : 'bg-gray-300'
                    }`}></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${accessibility.highContrast ? 'translate-x-6' : ''
                      }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Remove Animations */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div>
                <p className="font-bold text-xl">{t('settingsReduceAnim')}</p>
                <p className="text-gray-600">{t('settingsReduceAnimDesc')}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={accessibility.removeAnimations}
                    onChange={() => handleAccessibilityChange('removeAnimations')}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition ${accessibility.removeAnimations ? 'bg-farm-600' : 'bg-gray-300'
                    }`}></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${accessibility.removeAnimations ? 'translate-x-6' : ''
                      }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Region Settings - ALL STATES with auto-location */}
      {activeTab === 'region' && (
        <Card>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MapPin size={32} className="text-farm-600" />
            {t('settingsFarmingRegion')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('settingsRegionExplain')}
          </p>

          {/* Location Status */}
          <div className={`mb-6 p-4 rounded-lg border-2 ${locationStatus === 'detected' ? 'bg-green-50 border-green-300' :
            locationStatus === 'detecting' ? 'bg-blue-50 border-blue-300' :
              'bg-yellow-50 border-yellow-300'
            }`}>
            {locationStatus === 'detecting' && (
              <p className="text-blue-700 font-semibold flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                📍 {t('settingsDetectingLocation')}
              </p>
            )}
            {locationStatus === 'detected' && (
              <p className="text-green-700 font-semibold">
                📍 {t('settingsLocationDetected')}: <span className="text-lg">{farmingRegion}</span>
              </p>
            )}
            {locationStatus === 'denied' && (
              <p className="text-yellow-700 font-semibold">
                📍 {t('settingsLocationDenied')}
              </p>
            )}
            {locationStatus === 'error' && (
              <p className="text-yellow-700 font-semibold">
                📍 {t('settingsLocationError')}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-bold">{t('settingsSelectState')}</label>
            <select
              value={farmingRegion}
              onChange={handleRegionChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg"
            >
              <option value="" disabled>-- {t('settingsSelectStatePlaceholder')} --</option>
              <optgroup label={t('settingsStates')}>
                {ALL_INDIAN_STATES.slice(0, 28).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </optgroup>
              <optgroup label={t('settingsUnionTerritories')}>
                {ALL_INDIAN_STATES.slice(28).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </optgroup>
            </select>
            {farmingRegion && (
              <div className="p-4 bg-farm-50 border-2 border-farm-300 rounded-lg">
                <p className="font-semibold text-farm-700">
                  📍 {t('settingsCurrentRegion')}: <span className="text-lg">{farmingRegion}</span>
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <div className="flex gap-4">
          <HelpCircle size={32} className="text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-blue-900 mb-2">💡 {t('settingsNeedHelp')}</h3>
            <p className="text-blue-800 mb-4">
              {t('settingsHelpText')}
            </p>
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>✅ {t('settingsHelpLang')}</li>
              <li>✅ {t('settingsHelpAccess')}</li>
              <li>✅ {t('settingsHelpRegion')}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
