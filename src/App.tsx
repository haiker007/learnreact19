import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';

import router from '@/router';
import type { Locale } from 'antd/es/locale';
import dayjs from 'dayjs';

// Vite-specific feature for dynamic imports
const antdLocales = import.meta.glob([
  '/node_modules/antd/es/locale/zh_CN.js',
  '/node_modules/antd/es/locale/zh_TW.js',
  '/node_modules/antd/es/locale/zh_HK.js',
  '/node_modules/antd/es/locale/en_US.js',
  '/node_modules/antd/es/locale/ja_JP.js',
  '/node_modules/antd/es/locale/es_ES.js',
  '/node_modules/antd/es/locale/ru_RU.js',
]);
const dayjsLocales = import.meta.glob([
  '/node_modules/dayjs/esm/locale/zh-cn.js',
  '/node_modules/dayjs/esm/locale/zh-tw.js',
  '/node_modules/dayjs/esm/locale/en.js',
  '/node_modules/dayjs/esm/locale/ja.js',
  '/node_modules/dayjs/esm/locale/es.js',
  '/node_modules/dayjs/esm/locale/ru.js',
]);

const localeMap: { [key: string]: string } = {
  en: 'en_US',
  ja: 'ja_JP',
  cn: 'zh_CN',
  tw: 'zh_TW',
  es: 'es_ES',
  ru: 'ru_RU',
};

const AppConfig: React.FC = () => {
  const { i18n } = useTranslation();
  const [antdLocale, setAntdLocale] = useState<Locale>();

  useEffect(() => {
    const langCode = i18n.language.split('-')[0];
    const antdLangFile = localeMap[langCode] || 'en_US';
    const localePath = `/node_modules/antd/es/locale/${antdLangFile}.js`;

    const dayjsExtSet: Record<string, string> = {
      cn: 'zh-cn',
      tw: 'zh-tw',
    };
    const dayjsLangFile = dayjsExtSet[langCode] || langCode;

    const loadLocale = async () => {
      const loader = antdLocales[localePath] || antdLocales[`/node_modules/antd/es/locale/en_US.js`];
      const loaderDayjs = dayjsLocales[`/node_modules/dayjs/esm/locale/${dayjsLangFile}.js`] || dayjsLocales['/node_modules/dayjs/esm/locale/en.js'];

      if (loaderDayjs) {
        const localeDayjs = await loaderDayjs();
        dayjs.locale((localeDayjs as { default: string }).default);
      }
      if (loader) {
        const locale = await loader();
        setAntdLocale((locale as { default: Locale }).default);
      }
    };

    dayjs.locale(langCode);

    loadLocale();
  }, [i18n.language]);

  return (
    <ConfigProvider locale={antdLocale}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default AppConfig;
