import { useNavigation, useActionData, useSubmit } from 'react-router';
import { useEffect } from 'react'; // React 19 Hooks
import { DashboardView } from '@/features/dashboard/DashboardView';
import { useGetDashboardStatsQuery } from '@/features/dashboard/dashboardApi';
import { message } from 'antd';

export const DashboardContainer = () => {
  const { data: stats } = useGetDashboardStatsQuery();

  const navigation = useNavigation();
  const actionData = useActionData() as { ok: boolean; message: string } | undefined;
  const submit = useSubmit();

  useEffect(() => {
    if (actionData) {
      if (actionData.ok) {
        message.success(actionData.message);
      } else {
        message.error(actionData.message);
      }
    }
  }, [actionData]);

  const handleSaveSettings = (values: any) => {
    const formData = new FormData();
    formData.append('theme', values.theme);
    if (values.notificationsEnabled) {
      formData.append('notifications', 'on');
    }

    submit(formData, { method: 'post' });
  };

  return <DashboardView stats={stats} isSaving={navigation.state === 'submitting'} onSaveSettings={handleSaveSettings} />;
};
