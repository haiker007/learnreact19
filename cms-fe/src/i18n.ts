import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  .use(
    resourcesToBackend((lng: string, ns: string) => {
      const modules = import.meta.glob(`./locales/*/*.json`);
      const path = `./locales/${lng}/${ns}.json`;
      const loader = modules[path];
      if (!loader) {
        console.error(`Cannot find translation file: ${path}`);
        return Promise.resolve({});
      }
      return loader();
    }),
  )
  .use(initReactI18next)
  .init({
    fallbackLng: 'cn',
    lng: 'cn',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false },
  });

export default i18n;
