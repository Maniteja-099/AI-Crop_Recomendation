import { useState, useEffect, useCallback, useRef } from 'react';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { translations, getTranslation as getStaticTranslation } from '../i18n/translations';
import {
  hasStaticTranslation,
  batchTranslate,
  getCachedTranslation,
  getAllCachedForLanguage,
  isLanguagePreloaded,
} from '../i18n/translationService';

/**
 * useTranslation Hook
 * ====================
 * Provides seamless translation for all supported languages.
 *
 * For languages with static translations (en, hi, te, ta, kn, mr),
 * translations are instant and synchronous.
 *
 * For all other languages (40+ supported), translations are:
 *   1. First shown in English (instant)
 *   2. Then dynamically translated via Google Translate
 *   3. Cached for future use (localStorage + in-memory)
 *
 * Usage:
 *   const { t, language, isTranslating } = useTranslation();
 *   return <h1>{t('homeTitle')}</h1>;
 */
export function useTranslation() {
  const { language } = useGlobalSettings();
  const [dynamicTranslations, setDynamicTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const abortControllerRef = useRef(null);
  const lastLanguage = useRef(language);

  // When language changes, load dynamic translations if needed
  useEffect(() => {
    // Skip for static languages
    if (hasStaticTranslation(language)) {
      setDynamicTranslations({});
      setIsTranslating(false);
      lastLanguage.current = language;
      return;
    }

    // Check if we already have cached translations for this language
    const cached = getAllCachedForLanguage(language);
    const hasCachedData = Object.keys(cached).length > 0;

    if (hasCachedData) {
      // Language is already preloaded — apply instantly, no loading state
      setDynamicTranslations(cached);
      setIsTranslating(false);
      lastLanguage.current = language;
      return;
    }

    // If language didn't change and we have cached data, skip
    if (lastLanguage.current === language) {
      return;
    }
    lastLanguage.current = language;

    // Abort any previous in-flight translation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Start translating all English keys
    setIsTranslating(true);

    const englishKeys = translations['en'] || {};

    // Filter and flatten string values for batch translation
    const stringEntries = {};
    const flatten = (obj, prefix = '') => {
      if (typeof obj === 'string' && obj.trim().length >= 1) {
        stringEntries[prefix] = obj;
      } else if (Array.isArray(obj)) {
        obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`));
      } else if (obj !== null && typeof obj === 'object') {
        Object.entries(obj).forEach(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
      }
    };
    flatten(englishKeys);

    batchTranslate(language, stringEntries)
      .then((translated) => {
        if (!controller.signal.aborted) {
          setDynamicTranslations((prev) => ({ ...prev, ...translated }));
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [language]);

  /**
   * Translation function - works for all languages
   * @param {string} key - Translation key
   * @returns {*} - Translated value (string, array, or object)
   */
  const t = useCallback(
    (key) => {
      // For static languages, use the existing system directly
      if (hasStaticTranslation(language)) {
        return getStaticTranslation(language, key);
      }

      const enVal = getStaticTranslation('en', key);

      // Reconstruct values deeply from the flat translation cache
      const reconstruct = (obj, prefix) => {
        if (typeof obj === 'string') {
          // Check local state or persistent cache
          return dynamicTranslations[prefix] || getCachedTranslation(language, prefix, null) || obj;
        } else if (Array.isArray(obj)) {
          return obj.map((v, i) => reconstruct(v, `${prefix}[${i}]`));
        } else if (obj !== null && typeof obj === 'object') {
          const res = {};
          for (const [k, v] of Object.entries(obj)) {
            res[k] = reconstruct(v, `${prefix}.${k}`);
          }
          return res;
        }
        return obj;
      };

      return reconstruct(enVal, key);
    },
    [language, dynamicTranslations]
  );

  return {
    t,
    language,
    isTranslating,
    isStaticLanguage: hasStaticTranslation(language),
  };
}

export default useTranslation;
