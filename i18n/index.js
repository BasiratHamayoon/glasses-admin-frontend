// i18n/index.js
import en from './locales/en.json';
import ar from './locales/ar.json';

export const translations = {
  en,
  ar
};

export const defaultLocale = 'en';

export const getTranslation = (locale = 'en') => {
  return translations[locale] || translations.en;
};