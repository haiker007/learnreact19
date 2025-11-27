import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';

import router from '@/router';

import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';

const localeMap: { [key: string]: typeof enUS } = {
  en: enUS,
  ja: jaJP,
};

const AppConfig: React.FC = () => {
  const { i18n } = useTranslation();

  const langCode = i18n.language.split('-')[0];
  const antdLocale = localeMap[langCode] || enUS;

  return (
    <ConfigProvider locale={antdLocale}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default AppConfig;
