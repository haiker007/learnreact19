// components/DynamicZoneSelector.tsx
import React, { useState, useMemo } from 'react';
import { Input, List, Checkbox, Avatar, Typography, Tag, Space, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AVAILABLE_COMPONENTS, type ComponentMeta } from '@/components/Cms/mockData'; // 引入上面的数据

const { Text } = Typography;

interface DynamicZoneSelectorProps {
  value?: string[]; // AntD Form 自动传入: ['hero_banner', 'rich_text']
  onChange?: (value: string[]) => void; // AntD Form 自动传入
}

export const DynamicZoneSelector: React.FC<DynamicZoneSelectorProps> = ({ value = [], onChange }) => {
  const [searchText, setSearchText] = useState('');

  // 触发变更
  const handleToggle = (key: string, checked: boolean) => {
    const newValue = checked ? [...value, key] : value.filter((k) => k !== key);
    onChange?.(newValue);
  };

  // 过滤逻辑
  const filteredComponents = useMemo(() => {
    return AVAILABLE_COMPONENTS.filter((comp) => comp.name.includes(searchText) || comp.key.includes(searchText));
  }, [searchText]);

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
      {/* 1. 搜索栏 */}
      <div style={{ padding: 8, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          placeholder="搜索组件..."
          variant="borderless"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 2. 组件列表 */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {filteredComponents.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到组件" />
        ) : (
          <List
            dataSource={filteredComponents}
            size="small"
            renderItem={(item) => {
              const isChecked = value.includes(item.key);
              return (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: isChecked ? '#e6f7ff' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                  onClick={() => handleToggle(item.key, !isChecked)}
                >
                  <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '4px 8px' }}>
                    {/* Checkbox */}
                    <Checkbox checked={isChecked} style={{ marginRight: 12 }} />

                    {/* Icon */}
                    <div
                      style={{
                        fontSize: 24,
                        marginRight: 12,
                        opacity: isChecked ? 1 : 0.6,
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Text Info */}
                    <div style={{ flex: 1 }}>
                      <Space>
                        <Text strong>{item.name}</Text>
                        <Tag style={{ fontSize: 10, lineHeight: '18px' }}>{item.key}</Tag>
                      </Space>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.description}</div>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>

      {/* 3. 底部统计 */}
      <div
        style={{
          padding: '8px 12px',
          background: '#f5f5f5',
          borderTop: '1px solid #f0f0f0',
          fontSize: 12,
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          已选中: <b>{value.length}</b> 个组件
        </span>
        <a onClick={() => onChange?.([])} style={{ color: '#ff4d4f' }}>
          清空选择
        </a>
      </div>
    </div>
  );
};
