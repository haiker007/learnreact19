import { Form as RouterForm } from 'react-router';
import { Button, Input, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// Import the module
import styles from '@/features/auth/LoginView.module.scss';

interface LoginViewProps {
  isLoading: boolean;
  error?: string;
}

export const LoginView = ({ isLoading, error }: LoginViewProps) => {
  return (
    // Usage: styles.className
    <div className={styles.container}>
      <Card className={styles.card} variant="outlined">
        <div className={styles.titleGroup}>
          <h2>Welcome Back</h2>
          <span>Please sign in to your account</span>
        </div>

        {error && <Alert title={error} type="error" showIcon className="mb-6" />}

        <RouterForm method="post" className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input name="email" prefix={<UserOutlined />} size="large" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <Input.Password name="password" prefix={<LockOutlined />} size="large" />
          </div>

          <Button type="primary" htmlType="submit" loading={isLoading} block className={styles.submitBtn}>
            Sign In
          </Button>
        </RouterForm>
      </Card>
    </div>
  );
};
