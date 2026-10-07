import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { preloadAllLanguages } from '../i18n/translationService';
import { translations } from '../i18n/translations';

const GlobalSettingsContext = createContext();

// Available languages (all supported)
export const LANGUAGES = {
  // Indian
  EN: 'en', HI: 'hi', MR: 'mr', TA: 'ta', KN: 'kn', TE: 'te',
  GU: 'gu', PA: 'pa', BN: 'bn', ML: 'ml', OR: 'or', UR: 'ur', NE: 'ne',
  // European
  FR: 'fr', DE: 'de', ES: 'es', PT: 'pt', IT: 'it', NL: 'nl',
  PL: 'pl', RU: 'ru', UK: 'uk', RO: 'ro', CS: 'cs', SV: 'sv',
  DA: 'da', FI: 'fi', NO: 'no', EL: 'el', HU: 'hu', BG: 'bg',
  HR: 'hr', SK: 'sk',
  // Asian
  ZH_CN: 'zh-CN', ZH_TW: 'zh-TW', JA: 'ja', KO: 'ko',
  TH: 'th', VI: 'vi', ID: 'id', MS: 'ms', FIL: 'fil',
  // Middle-East / Africa
  AR: 'ar', FA: 'fa', HE: 'he', TR: 'tr', SW: 'sw', AF: 'af',
};

export const LANGUAGE_NAMES = {
  // Indian
  en: 'English 🇬🇧', hi: 'हिंदी 🇮🇳', mr: 'मराठी 🇮🇳',
  ta: 'தமிழ் 🇮🇳', kn: 'ಕನ್ನಡ 🇮🇳', te: 'తెలుగు 🇮🇳',
  gu: 'ગુજરાતી 🇮🇳', pa: 'ਪੰਜਾਬੀ 🇮🇳', bn: 'বাংলা 🇮🇳',
  ml: 'മലയാളം 🇮🇳', or: 'ଓଡ଼ିଆ 🇮🇳', ur: 'اردو 🇵🇰', ne: 'नेपाली 🇳🇵',
  // European
  fr: 'Français 🇫🇷', de: 'Deutsch 🇩🇪', es: 'Español 🇪🇸',
  pt: 'Português 🇧🇷', it: 'Italiano 🇮🇹', nl: 'Nederlands 🇳🇱',
  pl: 'Polski 🇵🇱', ru: 'Русский 🇷🇺', uk: 'Українська 🇺🇦',
  ro: 'Română 🇷🇴', cs: 'Čeština 🇨🇿', sv: 'Svenska 🇸🇪',
  da: 'Dansk 🇩🇰', fi: 'Suomi 🇫🇮', no: 'Norsk 🇳🇴',
  el: 'Ελληνικά 🇬🇷', hu: 'Magyar 🇭🇺', bg: 'Български 🇧🇬',
  hr: 'Hrvatski 🇭🇷', sk: 'Slovenčina 🇸🇰',
  // Asian
  'zh-CN': '中文(简) 🇨🇳', 'zh-TW': '中文(繁) 🇹🇼',
  ja: '日本語 🇯🇵', ko: '한국어 🇰🇷', th: 'ไทย 🇹🇭',
  vi: 'Tiếng Việt 🇻🇳', id: 'Bahasa Indonesia 🇮🇩', ms: 'Bahasa Melayu 🇲🇾',
  fil: 'Filipino 🇵🇭',
  // Middle-East / Africa
  ar: 'العربية 🇸🇦', fa: 'فارسی 🇮🇷', he: 'עברית 🇮🇱',
  tr: 'Türkçe 🇹🇷', sw: 'Kiswahili 🇰🇪', af: 'Afrikaans 🇿🇦',
};

// All 28 Indian States + 8 Union Territories
export const ALL_INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export function GlobalSettingsProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  const [accessibility, setAccessibility] = useState(() => {
    const saved = localStorage.getItem('appAccessibility');
    return saved ? JSON.parse(saved) : {
      largeText: false,
      highContrast: false,
      removeAnimations: false,
    };
  });

  const [farmingRegion, setFarmingRegion] = useState(() => {
    return localStorage.getItem('farmingRegion') || '';
  });

  const [locationStatus, setLocationStatus] = useState('detecting');

  // Auto-detect user location on first load
  useEffect(() => {
    const savedRegion = localStorage.getItem('farmingRegion');
    if (savedRegion) {
      setLocationStatus('detected');
      return; // Already have a saved region, skip detection
    }

    if ('geolocation' in navigator) {
      setLocationStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const detectedState = data.principalSubdivision || '';

            // Match detected state to our list
            const matched = ALL_INDIAN_STATES.find(
              (s) => detectedState.includes(s) || s.includes(detectedState)
            );

            if (matched) {
              setFarmingRegion(matched);
              localStorage.setItem('farmingRegion', matched);
              setLocationStatus('detected');
            } else {
              // Default fallback
              setFarmingRegion('Maharashtra');
              setLocationStatus('detected');
            }
          } catch {
            setFarmingRegion('Maharashtra');
            setLocationStatus('error');
          }
        },
        () => {
          // User denied or error
          setFarmingRegion('Maharashtra');
          setLocationStatus('denied');
        },
        { timeout: 10000, maximumAge: 600000, enableHighAccuracy: false }
      );
    } else {
      setFarmingRegion('Maharashtra');
      setLocationStatus('error');
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  // Save accessibility settings and apply styles
  useEffect(() => {
    localStorage.setItem('appAccessibility', JSON.stringify(accessibility));

    if (accessibility.largeText) {
      document.documentElement.setAttribute('data-large-text', 'true');
      document.body.style.fontSize = '18px';
    } else {
      document.documentElement.removeAttribute('data-large-text');
      document.body.style.fontSize = '16px';
    }

    if (accessibility.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
      document.body.classList.remove('high-contrast');
    }

    if (accessibility.removeAnimations) {
      document.documentElement.setAttribute('data-no-animations', 'true');
      document.body.classList.add('no-animations');
    } else {
      document.documentElement.removeAttribute('data-no-animations');
      document.body.classList.remove('no-animations');
    }
  }, [accessibility]);

  // Save farming region
  useEffect(() => {
    if (farmingRegion) {
      localStorage.setItem('farmingRegion', farmingRegion);
    }
  }, [farmingRegion]);

  // Preload all languages in the background on first render so that switching
  // languages is instant (translations are already cached before the user picks one).
  const preloadStarted = useRef(false);
  useEffect(() => {
    if (preloadStarted.current) return;
    preloadStarted.current = true;

    const allLangCodes = Object.values(LANGUAGES);
    const englishKeys = translations['en'] || {};

    // Run preload after a brief idle delay so it doesn't compete with initial render
    // Prioritise the user's currently selected language first, then load the rest
    const timer = setTimeout(async () => {
      try {
        // 1. Preload the user's chosen language immediately for instant switching
        if (language && language !== 'en') {
          await preloadAllLanguages([language], englishKeys);
        }
        // 2. Then preload all other languages in the background
        const remainingLangs = allLangCodes.filter(l => l !== language);
        await preloadAllLanguages(remainingLangs, englishKeys);
      } catch (_) {
        // Silently ignore — translations will fall back to on-demand fetching
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    language,
    setLanguage,
    accessibility,
    setAccessibility,
    farmingRegion,
    setFarmingRegion,
    locationStatus,
    LANGUAGE_NAMES,
    ALL_INDIAN_STATES,
  };

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within GlobalSettingsProvider');
  }
  return context;
}
