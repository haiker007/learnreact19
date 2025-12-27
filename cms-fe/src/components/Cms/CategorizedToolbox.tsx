// components/CategorizedToolbox.tsx
import React from 'react';
import { Button, Typography, Collapse } from 'antd';
import { TOOLBOX_CATEGORIES } from '@/components/Cms/types';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export const CategorizedToolbox = ({ onAddField }: { onAddField: (type: any, label: string) => void }) => {
  return (
    <div style={{ padding: 16 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        字段工具箱
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        拖拽或点击添加到右侧
      </Text>

      <Collapse defaultActiveKey={['0', '1', '2']} ghost expandIconPosition="end" size="small">
        {TOOLBOX_CATEGORIES.map((category, index) => (
          <Panel header={<strong>{category.title}</strong>} key={index}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {category.items.map((tool) => (
                <Button
                  key={tool.type}
                  block
                  style={{
                    height: 'auto',
                    padding: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    border: '1px solid #f0f0f0',
                  }}
                  onClick={() => onAddField(tool.type, tool.label)}
                >
                  <span style={{ fontSize: 18 }}>{tool.icon}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>{tool.label}</span>
                </Button>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
