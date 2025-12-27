// hooks/useContentForm.ts
import { Form, message } from 'antd';
import { useState, useEffect } from 'react';

export const useContentForm = (initialData?: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟数据回填
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form Submitted Payload:', values);
      // 模拟 API 请求
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('保存成功！');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSubmit,
  };
};
