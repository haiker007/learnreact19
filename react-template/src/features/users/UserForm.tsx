import { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import type { User } from '@/features/users/usersApi';
import styles from '@/features/users/UserForm.module.scss';

interface UserFormProps {
  id: string;
  onFinish: (values: Partial<User>) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialValues?: Partial<User>; // Optional for now, useful for Edit mode
}

export const UserForm = ({ id, onFinish, onCancel, isLoading, initialValues }: UserFormProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation('users');

  // Reset form when opening/closing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form id={id} form={form} layout="vertical" onFinish={onFinish} className={styles.formLayout} requiredMark="optional">
      <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter a name' }]}>
        <Input placeholder="e.g. John Doe" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter an email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input placeholder="john@company.com" size="large" />
      </Form.Item>

      <Form.Item name="role" label="Role" initialValue="user">
        <Select size="large">
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Administrator</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};
