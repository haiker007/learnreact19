// components/views/ModelListView.tsx
import React from 'react';
import { Table, Button, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { type ModelDef } from '@/components/Cms/hooks/useModelListLogic';
import { HoverRevealLayer } from '@/components/Cms/layers/HoverRevealLayer';

interface ModelListViewProps {
  models: ModelDef[];
  onCreate: (key: string) => void;
  onEdit?: (key: string) => void;
}

export const ModelListView: React.FC<ModelListViewProps> = ({ models, onCreate, onEdit }) => {
  return (
    <Table
      dataSource={models}
      rowKey="key"
      pagination={false}
      columns={[
        {
          title: '模型名称',
          dataIndex: 'name',
          render: (_, record) => (
            <Space>
              <div style={{ fontSize: 24, width: 32 }}>{record.icon}</div>
              <Space orientation="vertical" size={0}>
                <Typography.Text strong>{record.name}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {record.description}
                </Typography.Text>
              </Space>
            </Space>
          ),
        },
        {
          title: 'Key',
          dataIndex: 'key',
          render: (text) => <Typography.Text code>{text}</Typography.Text>,
        },
        {
          title: '内容数量',
          dataIndex: 'itemCount',
          render: (count) => <span>{count} entries</span>,
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          render: (_, record) => (
            <HoverRevealLayer>
              {(isHovered) => (
                <Space>
                  <Button type={isHovered ? 'primary' : 'default'} icon={<PlusOutlined />} onClick={() => onCreate(record.key)}>
                    创建内容
                  </Button>
                  {onEdit && (
                    <Button type={isHovered ? 'default' : 'text'} icon={<EditOutlined />} onClick={() => onEdit(record.key)}>
                      编辑模型
                    </Button>
                  )}
                </Space>
              )}
            </HoverRevealLayer>
          ),
        },
      ]}
    />
  );
};
