// components/RepeaterFieldEditor.tsx
import React from 'react';
import { Button, Card, Input, Select, Space, Typography, Empty, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, BarsOutlined } from '@ant-design/icons';
import { type FieldSchema, SUB_FIELD_TYPES } from '@/components/Cms/types';
import { v4 as uuidv4 } from 'uuid'; // 或使用简单的 Math.random()

interface RepeaterFieldEditorProps {
  value?: FieldSchema[]; // AntD Form 会自动传入 value
  onChange?: (value: FieldSchema[]) => void; // AntD Form 会自动传入 onChange
}

export const RepeaterFieldEditor: React.FC<RepeaterFieldEditorProps> = ({ value = [], onChange }) => {
  // 动作：添加子字段
  const handleAdd = () => {
    const newField: FieldSchema = {
      id: `sub_${Date.now()}`,
      label: '新字段',
      key: `field_${value.length + 1}`,
      type: 'text',
      required: false,
    };
    onChange?.([...value, newField]);
  };

  // 动作：删除子字段
  const handleDelete = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange?.(newValue);
  };

  // 动作：更新子字段属性
  const handleUpdate = (index: number, key: keyof FieldSchema, val: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [key]: val };
    onChange?.(newValue);
  };

  return (
    <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Typography.Text type="secondary" strong>
          子字段结构定义
        </Typography.Text>
        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
          添加子字段
        </Button>
      </div>

      {value.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无子字段" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {value.map((field, index) => (
            <Card key={field.id} size="small" bodyStyle={{ padding: 8 }} style={{ border: '1px solid #e8e8e8' }}>
              <Row gutter={8} align="middle">
                {/* 仅作视觉装饰的拖拽把手图标 */}
                <Col flex="20px" style={{ textAlign: 'center', color: '#ccc', cursor: 'grab' }}>
                  <BarsOutlined />
                </Col>

                {/* 字段显示名称 */}
                <Col span={16}>
                  <Input placeholder="显示名称" value={field.label} onChange={(e) => handleUpdate(index, 'label', e.target.value)} size="small" />
                </Col>
                {/* 删除按钮 */}
                <Col flex="auto" style={{ textAlign: 'right' }}>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(index)} />
                </Col>
              </Row>
              <Row gutter={8} style={{ marginTop: 8 }}>
                {/* 字段 Key */}
                <Col span={16}>
                  <Input
                    placeholder="Key"
                    addonBefore="key:"
                    value={field.key}
                    onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                    size="small"
                  ></Input>
                </Col>

                {/* 字段类型 */}
                <Col span={8}>
                  <Select
                    style={{ width: '100%' }}
                    value={field.type}
                    options={SUB_FIELD_TYPES}
                    onChange={(val) => handleUpdate(index, 'type', val)}
                    size="small"
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
