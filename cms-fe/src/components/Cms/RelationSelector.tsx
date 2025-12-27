// components/RelationSelector.tsx
import React, { useState } from 'react';
import { Modal, Table, Input, Space, Typography, Tag, Button, Card, Select } from 'antd';
import { SearchOutlined, LinkOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Mock data generator
const generateMockData = (targetModel: string, count: number = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    title: `${targetModel} Item ${i + 1}`,
    status: i % 3 === 0 ? 'published' : i % 3 === 1 ? 'draft' : 'archived',
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  }));
};

interface RelationSelectorProps {
  targetModel: string;
  value?: string[];
  onChange?: (val: string[]) => void;
  mode?: 'single' | 'multiple';
  open: boolean;
  onClose: () => void;
}

export const RelationSelector: React.FC<RelationSelectorProps> = ({ targetModel, value = [], onChange, mode = 'multiple', open, onClose }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(value);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Mock data source
  const dataSource = generateMockData(targetModel);

  // Filter data based on search and status
  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
    return matchesSearch && matchesStatus;
  });

  const handleOk = () => {
    onChange?.(selectedRowKeys);
    onClose();
  };

  const handleCancel = () => {
    setSelectedRowKeys(value);
    onClose();
  };

  const handleReset = () => {
    setSearchText('');
    setStatusFilter([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      if (mode === 'single') {
        setSelectedRowKeys(keys.slice(-1) as string[]);
      } else {
        setSelectedRowKeys(keys as string[]);
      }
    },
    type: mode === 'single' ? ('radio' as const) : ('checkbox' as const),
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          published: 'green',
          draft: 'orange',
          archived: 'default',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <Modal title={`选择关联 ${targetModel}`} open={open} onOk={handleOk} onCancel={handleCancel} width={800} okText="确定" cancelText="取消">
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        {/* Search and Filter Row */}
        <Space style={{ width: '100%' }}>
          <Input
            placeholder="搜索标题..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            mode="multiple"
            placeholder="筛选状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ minWidth: 200 }}
            allowClear
            options={[
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ]}
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>

        {/* Stats Row */}
        <Space>
          <Text type="secondary">已选择 {selectedRowKeys.length} 项</Text>
          <Text type="secondary">•</Text>
          <Text type="secondary">
            显示 {filteredData.length} / {dataSource.length} 条
          </Text>
        </Space>
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        size="small"
      />
    </Modal>
  );
};

// Selected items display component
interface SelectedRelationItemsProps {
  items: Array<{ id: string; title: string; status: string }>;
  onRemove: (id: string) => void;
}

export const SelectedRelationItems: React.FC<SelectedRelationItemsProps> = ({ items, onRemove }) => {
  if (items.length === 0) {
    return <Text type="secondary">未选择任何关联</Text>;
  }

  return (
    <Card size="small" style={{ background: '#fafafa' }}>
      <Space orientation="vertical" style={{ width: '100%' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <LinkOutlined />
              <Text>{item.title}</Text>
              <Tag color="blue" style={{ fontSize: 11 }}>
                {item.status}
              </Tag>
            </Space>
            <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onRemove(item.id)} />
          </div>
        ))}
      </Space>
    </Card>
  );
};
