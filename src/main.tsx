import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import 'antd/dist/reset.css';
import { store } from '@/store/store';
import '@/i18n';
import AppConfig from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading Translations...</div>}>
        <AppConfig />
      </Suspense>
    </Provider>
  </StrictMode>,
);
