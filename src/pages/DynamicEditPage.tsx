// pages/DynamicEditPage.tsx
import React from 'react';
import { Form, Button, Card, Layout, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useContentForm } from '@/components/Cms/hooks/useContentForm';
import { DynamicFieldRenderer } from '@/components/Cms/DynamicFieldRenderer';
import type { FieldSchema } from '@/components/Cms/types';

const { Header, Content } = Layout;
const { Title } = Typography;

// --- 模拟数据: 一个包含 Repeater 的复杂模型 ---
const MOCK_SCHEMA: FieldSchema[] = [
  { id: '1', key: 'title', label: '文章标题', type: 'text', required: true },
  { id: '2', key: 'slug', label: 'URL 别名', type: 'text', required: true },
  { id: '3', key: 'cover', label: '封面图', type: 'media', options: { multiple: true } },
  { id: '6', key: 'content', label: '内容', type: 'textarea' },
  { id: '7', key: 'author', label: '作者', type: 'relation', options: { targetModelKey: 'users' } },
  {
    id: '4',
    key: 'authors',
    label: '作者列表 (Repeater)',
    type: 'repeater',
    subFields: [
      { id: '4-1', key: 'name', label: '作者姓名', type: 'text', required: true },
      { id: '4-2', key: 'role', label: '职位', type: 'relation', options: { targetModelKey: 'roles' } },
      { id: '4-3', key: 'is_guest', label: '特邀嘉宾', type: 'boolean' },
    ],
  },
  { id: '5', key: 'publish_at', label: '发布时间', type: 'datetime' },
  {
    id: '8',
    key: 'hero',
    label: '动态区域',
    type: 'dynamic_zone',
    options: {
      allowedComponents: ['hero_banner', 'image_gallery', 'text'],
    },
  }, // 暂不处理 Dynamic Zone
];

const MOCK_INITIAL_DATA = {
  title: 'Hello World',
  slug: '/hello-world',
  authors: [
    // 模拟已有的 Repeater 数据
    { name: 'Alice', role: '1', is_guest: false },
    { name: 'Bob', role: '2', is_guest: true },
  ],
  content: '这是一篇示例文章的内容。',
};

export const DynamicEditPage: React.FC = () => {
  const { form, loading, handleSubmit } = useContentForm(MOCK_INITIAL_DATA);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fafafa', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>
          编辑内容: 文章
        </Title>
        <Space>
          <Button onClick={() => form.resetFields()}>重置</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={form.submit}>
            保存
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24, maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <Card variant="outlined">
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={MOCK_INITIAL_DATA}>
            {/* 核心循环：遍历顶层 Schema */}
            {MOCK_SCHEMA.map((field, index) => (
              <DynamicFieldRenderer
                key={index}
                schema={field}
                namePath={[field.key]} // 顶层字段的路径就是 key 字符串数组
              />
            ))}
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default DynamicEditPage;
