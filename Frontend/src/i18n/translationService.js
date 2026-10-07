/**
 * Dynamic Translation Service
 * ============================
 * Provides real-time translation for languages that don't have
 * static translations in translations.js.
 *
 * Uses the backend /api/translate/batch endpoint (which uses deep-translator)
 * to avoid Content Security Policy (CSP) issues with direct Google Translate calls.
 *
 * Static translations (en, hi, te, ta, kn, mr) are served instantly.
 * All other languages are translated dynamically via backend and cached.
 */

// Languages that have full static translations
const STATIC_LANGUAGES = new Set(['en', 'hi', 'te', 'ta', 'kn', 'mr']);

// In-memory cache: { 'fr::dashboard': 'Tableau de bord', ... }
const translationCache = {};

// localStorage cache key
const CACHE_STORAGE_KEY = 'dynamicTranslations';

// Backend API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Load cached translations from localStorage on module init
try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(translationCache, parsed);
    }
} catch (e) {
    // Ignore parse errors
}

// Save cache to localStorage (debounced)
let saveTimer = null;
function saveCacheToStorage() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(translationCache));
        } catch (e) {
            // Storage full — clear old entries
            try {
                localStorage.removeItem(CACHE_STORAGE_KEY);
            } catch (_) { /* ignore */ }
        }
    }, 2000);
}

/**
 * Check if a language has static translations
 */
export function hasStaticTranslation(lang) {
    return STATIC_LANGUAGES.has(lang);
}

/**
 * Get a cached translation if available
 */
export function getCachedTranslation(lang, key, englishValue) {
    const cacheKey = `${lang}::${key}`;
    return translationCache[cacheKey] || null;
}

// Track in-flight translations to prevent duplicate backend requests from multiple components
const ongoingTranslations = {};

/**
 * Batch translate multiple key-value pairs for a language.
 * Uses the backend API which proxies to Google Translate via deep-translator.
 * Translates only uncached keys and stores results.
 *
 * @param {string} lang - Target language code
 * @param {Object} entries - { key: englishValue, ... }
 * @returns {Promise<Object>} - { key: translatedValue, ... }
 */
export async function batchTranslate(lang, entries) {
    if (!lang || lang === 'en' || STATIC_LANGUAGES.has(lang)) {
        return entries;
    }

    const result = {};
    const toTranslate = {};

    // Check cache first
    for (const [key, value] of Object.entries(entries)) {
        const cacheKey = `${lang}::${key}`;
        if (translationCache[cacheKey]) {
            result[key] = translationCache[cacheKey];
        } else if (typeof value === 'string' && value.trim().length >= 1) {
            toTranslate[key] = value;
        } else {
            result[key] = value;
        }
    }

    // If nothing to translate, return cached results
    const keysToTranslate = Object.keys(toTranslate);
    if (keysToTranslate.length === 0) {
        return result;
    }

    // Process translations in batches of 100 (backend translates in parallel)
    const BATCH_SIZE = 100;
    const promises = [];

    for (let i = 0; i < keysToTranslate.length; i += BATCH_SIZE) {
        const batchKeys = keysToTranslate.slice(i, i + BATCH_SIZE);

        // Create a unique hash/identifier for this specific batch group
        // If another component requests the exact same batch simultaneously, we can return the same promise
        const batchSig = `${lang}::${batchKeys.join(',')}`;

        if (!ongoingTranslations[batchSig]) {
            const batchTexts = {};
            for (const key of batchKeys) {
                batchTexts[key] = toTranslate[key];
            }

            // Create the promise and store it in the ongoing dictionary
            ongoingTranslations[batchSig] = (async () => {
                const subResult = {};
                try {
                    const response = await fetch(`${API_BASE}/api/translate/batch`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            texts: batchTexts,
                            target_language: lang,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.translations) {
                            for (const [key, translated] of Object.entries(data.translations)) {
                                const cacheKey = `${lang}::${key}`;
                                translationCache[cacheKey] = translated;
                                subResult[key] = translated;
                            }
                        } else {
                            for (const key of batchKeys) subResult[key] = toTranslate[key];
                        }
                    } else {
                        for (const key of batchKeys) subResult[key] = toTranslate[key];
                    }
                } catch (error) {
                    for (const key of batchKeys) subResult[key] = toTranslate[key];
                } finally {
                    // Remove from ongoing translations once complete to free memory
                    setTimeout(() => { delete ongoingTranslations[batchSig]; }, 1000);
                }
                return subResult;
            })();
        }

        promises.push(ongoingTranslations[batchSig]);
    }

    // Wait for all batches (or existing promises) to complete and merge back to result
    const segments = await Promise.all(promises);
    for (const segment of segments) {
        if (segment) {
            Object.assign(result, segment);
        }
    }

    saveCacheToStorage();
    return result;
}

/**
 * Translate a single key's value for a language (with caching)
 * @param {string} lang - Target language code
 * @param {string} key - Translation key
 * @param {string} englishValue - English value to translate
 * @returns {Promise<string>} - Translated value
 */
export async function translateSingle(lang, key, englishValue) {
    if (!lang || lang === 'en' || STATIC_LANGUAGES.has(lang)) {
        return englishValue;
    }

    const cacheKey = `${lang}::${key}`;

    // Check cache
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Use batch translate for a single key
    const result = await batchTranslate(lang, { [key]: englishValue });
    return result[key] || englishValue;
}

/**
 * Clear the translation cache for a specific language or all languages
 */
export function clearCache(lang = null) {
    if (lang) {
        const prefix = `${lang}::`;
        for (const key of Object.keys(translationCache)) {
            if (key.startsWith(prefix)) {
                delete translationCache[key];
            }
        }
    } else {
        Object.keys(translationCache).forEach(k => delete translationCache[k]);
    }
    saveCacheToStorage();
}

/**
 * Get all cached translations for a language (for bulk retrieval)
 */
export function getAllCachedForLanguage(lang) {
    const result = {};
    const prefix = `${lang}::`;
    for (const [key, value] of Object.entries(translationCache)) {
        if (key.startsWith(prefix)) {
            result[key.substring(prefix.length)] = value;
        }
    }
    return result;
}

/**
 * Check whether a language is fully pre-loaded in the cache.
 */
export function isLanguagePreloaded(lang) {
    if (STATIC_LANGUAGES.has(lang)) return true;
    const prefix = `${lang}::`;
    return Object.keys(translationCache).some(k => k.startsWith(prefix));
}

// Track which languages have been (or are being) preloaded so we don't repeat
const preloadedLanguages = new Set(STATIC_LANGUAGES);

/**
 * Preload translations for a single language in the background.
 * Safe to call multiple times — will skip if already cached/in-progress.
 *
 * @param {string} lang - Target language code
 * @param {Object} englishKeys - The full English translation map from translations.js
 */
export async function preloadLanguage(lang, englishKeys) {
    if (!lang || STATIC_LANGUAGES.has(lang) || preloadedLanguages.has(lang)) return;
    preloadedLanguages.add(lang);

    // If we already have cached entries for this language, treat as done
    const prefix = `${lang}::`;
    const alreadyCached = Object.keys(translationCache).some(k => k.startsWith(prefix));
    if (alreadyCached) return;

    // Flatten all string values from the English translation object
    const stringEntries = {};
    const flatten = (obj, pfx = '') => {
        if (typeof obj === 'string' && obj.trim().length >= 1) {
            stringEntries[pfx] = obj;
        } else if (Array.isArray(obj)) {
            obj.forEach((v, i) => flatten(v, `${pfx}[${i}]`));
        } else if (obj !== null && typeof obj === 'object') {
            Object.entries(obj).forEach(([k, v]) => flatten(v, pfx ? `${pfx}.${k}` : k));
        }
    };
    flatten(englishKeys);

    try {
        await batchTranslate(lang, stringEntries);
    } catch (_) {
        // Silently ignore errors during background preload; will be retried on demand
        preloadedLanguages.delete(lang); // allow retry later
    }
}

/**
 * Preload all non-static languages in the background so language switching is instant.
 * Call once on app startup. Respects existing cache to avoid redundant requests.
 * Languages are loaded sequentially to avoid overwhelming the backend.
 *
 * @param {string[]} allLanguages - Array of all language codes to preload
 * @param {Object} englishKeys - The full English translation map from translations.js
 */
export async function preloadAllLanguages(allLanguages, englishKeys) {
    const dynamicLangs = allLanguages.filter(l => !STATIC_LANGUAGES.has(l));

    // Separate already-cached and not-yet-cached
    const prefix = (l) => `${l}::`;
    const notCached = dynamicLangs.filter(
        l => !Object.keys(translationCache).some(k => k.startsWith(prefix(l)))
    );

    if (notCached.length === 0) return; // All already cached

    // Process in small parallel batches (3 at a time) to balance speed vs. backend load
    const PARALLEL = 3;
    for (let i = 0; i < notCached.length; i += PARALLEL) {
        const batch = notCached.slice(i, i + PARALLEL);
        await Promise.allSettled(batch.map(lang => preloadLanguage(lang, englishKeys)));
        // Small breathing gap between batches to avoid rate-limiting
        await new Promise(r => setTimeout(r, 300));
    }
}
