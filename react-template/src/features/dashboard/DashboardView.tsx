import { Button, Card, Form, Input, Select, Statistic, Switch } from 'antd';
import type { DashboardStats } from '@/features/dashboard/dashboardApi';
import { ArrowUpOutlined } from '@ant-design/icons';
// import type { User } from './types';

interface DashboardViewProps {
  stats?: DashboardStats;
  isSaving: boolean;
  onSaveSettings: (values: any) => void;
}

export const DashboardView = ({ stats, isSaving, onSaveSettings }: DashboardViewProps) => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <Statistic title="Total Users" value={stats?.totalUsers} loading={!stats} />
        </Card>
        <Card>
          <Statistic title="Revenue" value={stats?.revenue} prefix="$" loading={!stats} />
        </Card>
        <Card>
          <Statistic
            title="Active Sessions"
            value={stats?.activeSessions}
            styles={{ content: { color: '#3f8600' } }}
            prefix={<ArrowUpOutlined />}
            loading={!stats}
          />
        </Card>
      </div>

      {/* Settings Form Section */}
      <Card title="Quick Settings" className="max-w-md">
        <Form onFinish={onSaveSettings} layout="vertical">
          <Form.Item name="theme" label="Theme" initialValue="light">
            <Select>
              <Select.Option value="light">Light Mode</Select.Option>
              <Select.Option value="dark">Dark Mode</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="notificationsEnabled" label="Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isSaving}>
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};
