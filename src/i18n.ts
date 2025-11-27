import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  // Load translations via http (recommended for production)
  // For Vite, this points to files in the public/locales directory,
  // but we'll use a local path configuration below for simplicity.

  .use(HttpBackend)

  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)

  .init({
    // Fallback language
    fallbackLng: 'en',

    // Default namespace
    ns: ['translation'],
    // defaultNS: 'translation',

    // Language to use if translations are missing
    lng: 'en',

    interpolation: {
      escapeValue: false, // React already protects against XSS
    },

    // Configuration for the HttpBackend to load files
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Note: With Vite, this path often needs to be relative to the public directory.
      // A more reliable method for small apps is to use `resources` directly,
      // but HttpBackend is better for large apps and dynamic loading.
    },

    // Enable debug mode in development
    debug: true,
  });

export default i18n;
