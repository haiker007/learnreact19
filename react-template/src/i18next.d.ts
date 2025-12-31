import 'i18next';
import Resources from './locales/i18n-types';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}
