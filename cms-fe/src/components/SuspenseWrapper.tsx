import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  ns?: string;
  loadingKey?: string;
}

const SuspenseWrapper = ({ children, loadingKey = 'loading' }: Props) => {
  const { t } = useTranslation();
  return <Suspense fallback={<div>{t(loadingKey)}</div>}>{children}</Suspense>;
};

export default SuspenseWrapper;
