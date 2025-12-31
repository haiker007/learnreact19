import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  // MAGIC PART: This dynamic import tells Vite to create separate chunks
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // Specify namespaces to preload
    ns: ['common', 'users', 'auth', 'dashboard'],
    defaultNS: 'common',
    // Remove 'resources' key because we are loading them via backend
    debug: true, // Turn off in production
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
