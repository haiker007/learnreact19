// components/behavior/DynamicFieldRenderer.tsx
import React, { useState } from 'react';
import { Form, Input, InputNumber, Switch, DatePicker, Button, Select, Card, theme } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FieldSchema, MediaOptions, RelationOptions } from '@/components/Cms/types';
import { MediaWidget, RelationWidget, RepeaterCard } from '@/components/Cms/layers/Widgets';
import { DYNAMIC_ZONE_COMPONENTS } from '@/components/Cms/types';

interface RendererProps {
  schema: FieldSchema;
  namePath: (string | number)[]; // 关键：处理嵌套路径
  hoverable?: boolean;
}

/**
 * 递归组件：根据 Schema 类型分发组件
 */
export const DynamicFieldRenderer: React.FC<RendererProps> = ({ schema, namePath, hoverable = false }) => {
  const { token } = theme.useToken();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 1. 生成校验规则
  const rules = [{ required: schema.required, message: `${schema.label} 不能为空` }];

  const hoverStyle = hoverable
    ? {
        // backgroundColor: isHovered ? token.colorFillTertiary : token.colorFillQuaternary,
        backgroundColor: isHovered ? 'red' : token.colorFillQuaternary,
        borderRadius: token.borderRadiusLG,
        padding: schema.type === 'repeater' || schema.type === 'dynamic_zone' ? 12 : 8,
        transition: 'background-color 0.2s ease',
      }
    : {};

  const hoverEvents = hoverable
    ? {
        onMouseEnter: () => {
          setIsHovered(true);
          console.log('enter');
        },
        onMouseLeave: () => {
          setIsHovered(false);
          console.log('leave');
        },
      }
    : {};

  // 2. 基础控件渲染逻辑
  const renderInputWidget = () => {
    switch (schema.type) {
      case 'text':
        return <Input placeholder={`请输入${schema.label}`} />;
      case 'textarea':
        return <Input.TextArea rows={4} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'boolean':
        return <Switch />;
      case 'datetime':
        return <DatePicker showTime style={{ width: '100%' }} />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      case 'media':
        const mediaOpts = schema.options as MediaOptions;
        return <MediaWidget multiple={mediaOpts?.multiple} />;
      case 'relation':
        const relOpts = schema.options as RelationOptions;
        return <RelationWidget targetModel={relOpts?.targetModelKey} mode="single" />;
      default:
        return <Input disabled placeholder="暂不支持的字段类型" />;
    }
  };

  // 3. 处理复杂嵌套类型 (Repeater)
  if (schema.type === 'repeater') {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{schema.label}</div>
        <Form.List name={namePath}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <RepeaterCard key={index} title={`${schema.label} #${index + 1}`} onRemove={() => remove(field.name)}>
                  {/* 递归渲染子字段 */}
                  {schema.subFields?.map((subField, subIndex) => (
                    <DynamicFieldRenderer
                      key={subIndex}
                      schema={subField}
                      // 关键：路径拼接 [parentName, index, childKey]
                      namePath={[field.name, subField.key]}
                    />
                  ))}
                </RepeaterCard>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加 {schema.label}
              </Button>
            </>
          )}
        </Form.List>
      </div>
    );
  }

  // 4. 处理 Dynamic Zone
  if (schema.type === 'dynamic_zone') {
    const dzOptions = schema.options as { allowedComponents?: string[] };
    const allowedComponents = dzOptions?.allowedComponents || [];

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{schema.label}</div>
        <Form.List name={namePath}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card
                  key={index}
                  style={{
                    marginBottom: 16,
                    border: `1px dashed ${token.colorBorder}`,
                    backgroundColor: hoveredCard === index ? token.colorBgTextActive : token.colorFillQuaternary,
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  title={
                    <Form.Item name={[field.name, '__component']} noStyle rules={[{ required: true, message: '请选择组件类型' }]}>
                      <Select
                        placeholder="选择组件类型"
                        style={{ width: 200 }}
                        options={allowedComponents.map((compKey) => {
                          const comp = DYNAMIC_ZONE_COMPONENTS.find((c) => c.key === compKey);
                          return {
                            label: comp?.name || compKey,
                            value: compKey,
                          };
                        })}
                      />
                    </Form.Item>
                  }
                  extra={
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                      删除
                    </Button>
                  }
                >
                  <Form.Item noStyle shouldUpdate={(prev, curr) => prev !== curr}>
                    {({ getFieldValue }) => {
                      const componentType = getFieldValue([...namePath, field.name, '__component']);
                      const component = DYNAMIC_ZONE_COMPONENTS.find((c) => c.key === componentType);

                      if (!component?.fields) return null;

                      return component.fields.map((subField, subIndex) => (
                        <DynamicFieldRenderer key={subIndex} schema={subField as FieldSchema} namePath={[field.name, subField.key]} />
                      ));
                    }}
                  </Form.Item>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加 {schema.label} 组件
              </Button>
            </>
          )}
        </Form.List>
      </div>
    );
  }

  // 5. 渲染标准 Form.Item
  const valuePropName = schema.type === 'boolean' ? 'checked' : 'value';

  return (
    <Form.Item
      label={schema.label}
      name={namePath} // 使用传入的完整路径
      rules={rules}
      valuePropName={valuePropName}
    >
      {renderInputWidget()}
    </Form.Item>
  );
};
