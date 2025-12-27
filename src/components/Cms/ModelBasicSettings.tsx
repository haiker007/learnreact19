// components/ModelBasicSettings.tsx
import React from 'react';
import { Card, Form, Input, Row, Col, Typography } from 'antd';

const { Text } = Typography;

interface ModelBasicSettingsProps {
  meta: { name: string; key: string; description: string };
  onChange: (key: string, value: string) => void;
}

export const ModelBasicSettings: React.FC<ModelBasicSettingsProps> = ({ meta, onChange }) => {
  return (
    <Card
      size="small"
      title={<Text strong>基本设置</Text>}
      style={{ marginBottom: 16, border: '1px solid #f0f0f0', background: '#fafafa' }}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="显示名称">
              <Input value={meta.name} onChange={(e) => onChange('name', e.target.value)} placeholder="例如：文章" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="系统 Key (自动生成/只读)">
              <Input value={meta.key} disabled style={{ cursor: 'not-allowed', color: '#888' }} addonBefore="api::" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="描述">
              <Input.TextArea
                rows={1}
                value={meta.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="例如：用于博客发布..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
