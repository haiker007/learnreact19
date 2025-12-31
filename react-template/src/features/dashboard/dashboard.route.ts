import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { dashboardApi } from '@/features/dashboard/dashboardApi';
import { store } from '@/store/store';

export const dashboardLoader = async ({ request }: LoaderFunctionArgs) => {
  const promise = store.dispatch(dashboardApi.endpoints.getDashboardStats.initiate());

  try {
    await promise.unwrap();
    return null;
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  } finally {
    promise.unsubscribe();
  }
};

export const dashboardAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const settings = {
    theme: formData.get('theme') as 'light' | 'dark',
    notificationsEnabled: formData.get('notifications') === 'on',
  };

  try {
    await store.dispatch(dashboardApi.endpoints.updateDashboardSettings.initiate(settings)).unwrap();
    return { ok: true, message: 'Settings saved successfully' };
  } catch {
    return { ok: false, message: 'Failed to save settings' };
  }
};
