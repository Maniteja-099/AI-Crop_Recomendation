// Export all translations
export { en } from './en';
export { hi } from './hi';

// Default to English if language not available
export const getTranslations = (lang) => {
  const translations = {
    en: require('./en').en,
    hi: require('./hi').hi,
  };
  
  return translations[lang] || translations.en;
};
