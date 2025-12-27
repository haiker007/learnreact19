// SchemaBuilderUI.tsx
import React, { Children, lazy, useEffect } from 'react';
import {
  Layout,
  Card,
  List,
  Button,
  Typography,
  Tag,
  Drawer,
  Form,
  Input,
  Switch,
  Space,
  Empty,
  Tabs,
  Badge,
  Divider,
  Checkbox,
  Select,
  Radio,
  Alert,
  theme,
} from 'antd';
import {
  HolderOutlined,
  DeleteOutlined,
  SettingOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  FileImageOutlined,
  LinkOutlined,
  BlockOutlined,
  SwapRightOutlined,
} from '@ant-design/icons';
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSchemaModel } from '@/components/Cms/hooks/useSchemaModel'; // 引入上面定义的Hook
import { SortableItem } from '@/components/Cms/SortableItem'; // 引入上面定义的Behavior Component
import { DraggableToolItem } from '@/components/Cms/DraggableToolItem'; // 引入上面定义的Behavior Component
import { FIELD_TOOLS, MOCK_EXISTING_MODELS, type FieldSchema } from '@/components/Cms/types'; // 引入类型
import { RepeaterFieldEditor } from '@/components/Cms/RepeaterFieldEditor';
import { DynamicZoneSelector } from './DynamicZoneSelector';
import { CategorizedToolbox } from './CategorizedToolbox';
import { ModelBasicSettings } from './ModelBasicSettings';
const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

// 辅助函数：根据字段类型生成图标和颜色
const getFieldMeta = (field: FieldSchema) => {
  switch (field.type) {
    case 'media':
      return { icon: <FileImageOutlined />, color: 'cyan', label: '媒体' };
    case 'relation':
      return { icon: <LinkOutlined />, color: 'orange', label: '关系' };
    default:
      return { icon: <BlockOutlined />, color: 'default', label: field.type };
  }
};

const FIELD_TYPE_ICONS: Record<string, string> = {
  text: 'T',
  textarea: '¶',
  number: '#',
  boolean: '✓',
  datetime: '📅',
  relation: '🔗',
  repeater: '🔁',
  component: '🧩',
  media: '🖼️',
  dynamic_zone: '🧱',
};

const getFieldTypeIcon = (fieldType: string) => FIELD_TYPE_ICONS[fieldType] ?? '❓';
// 辅助函数：根据字段类型渲染子行组件
const components: Record<string, (field: FieldSchema, token?: any) => React.ReactNode> = {
  dynamic_zone: (field) => <DynamicZoneSubRow field={field} />,
  repeater: (field, token) => <RepeaterSubRow field={field} token={token} />,
  media: (field) => <MediaSubRow field={field} />,
  relation: (field) => <RelationSubRow field={field} />,
};
const renderSubRow = (field: FieldSchema, token: any) => {
  return components[field.type]?.(field, token) || null;
};
// --- 子组件：画布中的单个字段 ---
const CanvasFieldRow = ({
  field,
  onDelete,
  onConfig,
  dragProps,
}: {
  field: FieldSchema;
  onDelete: () => void;
  onConfig: () => void;
  dragProps: any;
}) => {
  const { setNodeRef, attributes, listeners, style, isDragging } = dragProps;

  // 根据类型显示不同颜色
  const getTagColor = (type: string) => {
    if (type === 'dynamic_zone') return 'purple';
    if (type === 'repeater') return 'blue';
    return 'default';
  };

  const { token } = theme.useToken();

  return (
    <div ref={setNodeRef} style={{ ...style, marginBottom: 8, opacity: isDragging ? 0.5 : 1 }}>
      <Card
        size="small"
        variant="outlined"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          borderColor: field.type === 'dynamic_zone' ? '#d3adf7' : '#f0f0f0',
          background: '#fff',
          cursor: 'default',
        }}
        styles={{ body: { padding: '12px', display: 'flex', flexDirection: 'column' } }}
      >
        {/* 上半部分：通用头部 */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {/* 拖拽手柄 */}
          <div {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: 12, color: '#bfbfbf' }}>
            <HolderOutlined />
          </div>
          {/* 图标与名称 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {/* 简单的图标映射 */}
            <span style={{ marginRight: 8, fontSize: 16 }}>{getFieldTypeIcon(field.type)}</span>

            <Space orientation="horizontal" size={0}>
              <Space>
                <Text strong>{field.label}</Text>
                <Text type="secondary" code style={{ fontSize: 12 }}>
                  {field.key}
                </Text>
                {field.required && (
                  <Text type="danger" style={{ fontSize: 12 }}>
                    *
                  </Text>
                )}
              </Space>
            </Space>
          </div>

          {/* 操作按钮 */}
          <Space>
            <Button type="text" size="small" icon={<SettingOutlined />} onClick={onConfig} />
            <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={onDelete} />
          </Space>
        </div>
        {/* 下半部分：类型特定内容 */}
        {renderSubRow(field, token)}
      </Card>
    </div>
  );
};

// --- 新增子组件：DynamicZoneSubRow ---
const DynamicZoneSubRow = ({ field }: { field: FieldSchema }) => {
  // 模拟：从 field.options 中获取 Dynamic Zone 允许的组件
  // 实际开发中这部分数据来自 ConfigForm 的保存结果
  const allowedComponents =
    field.type === 'dynamic_zone'
      ? field.options?.allowedComponents || ['Hero Banner', 'Rich Text'] // 默认假数据用于展示效果
      : [];

  return (
    <div
      style={{
        marginTop: 8,
        marginLeft: 36, // 对齐图标后的文字
        padding: '8px',
        background: '#f9f0ff', // 淡紫色背景
        borderRadius: 4,
        border: '1px dashed #d3adf7',
      }}
    >
      <Space size={[0, 8]} wrap>
        <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
          允许组件:
        </Text>
        {allowedComponents.map((comp: string) => (
          <Tag key={comp} color="purple" style={{ marginRight: 4 }}>
            {comp}
          </Tag>
        ))}
        <Tag style={{ borderStyle: 'dashed', background: 'transparent' }}>+ 添加</Tag>
      </Space>
    </div>
  );
};

// --- 新增子组件：RepeaterSubRow ---
const RepeaterSubRow = ({ field, token }: { field: FieldSchema; token: any }) => {
  return (
    <div
      style={{
        minHeight: 20,
        borderLeft: '2px dashed #1890ff',
        paddingLeft: 12,
        marginLeft: 12,
        alignContent: 'space-between',
      }}
    >
      {field.subFields?.length > 0 ? (
        field.subFields?.map((subField) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#72af81ff',
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusSM,
              padding: '8px 12px',
              marginBottom: 8,
            }}
          >
            {/* 内部字段也应该有拖拽手柄(视觉示意) */}
            {/* <HolderOutlined style={{ marginRight: 8, color: token.colorTextQuaternary }} /> */}

            {/* 类型图标 */}
            <Tag style={{ marginRight: 8 }}>{getFieldTypeIcon(subField.type)}</Tag>

            {/* 字段信息 */}
            <Space style={{ flex: 1 }}>
              <Text style={{ fontSize: 13 }}>{subField.label}</Text>
              <Text type="secondary" code style={{ fontSize: 12 }}>
                {subField.key}
              </Text>
              {subField.required && (
                <Text type="danger" style={{ fontSize: 12 }}>
                  *
                </Text>
              )}
            </Space>
          </div>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无子字段" style={{ margin: 0, padding: 0 }} />
      )}
    </div>
  );
};

// --- 新增子组件：MediaSubRow ---
const MediaSubRow = ({ field }: { field: FieldSchema }) => {
  return (
    <Space size="small">
      {field.options?.multiple ? <Tag variant="solid">多文件</Tag> : <Tag variant="outlined">单文件</Tag>}
      {field.options?.allowedTypes?.includes('images') && <Tag color="blue">图片</Tag>}
      {field.options?.allowedTypes?.includes('videos') && <Tag color="purple">视频</Tag>}
      {field.options?.allowedTypes?.includes('audios') && <Tag color="cyan">音频</Tag>}
      {field.options?.allowedTypes?.includes('files') && <Tag color="orange">文件</Tag>}
    </Space>
  );
};

// --- 新增子组件：RelationSubRow ---
const RelationSubRow = ({ field }: { field: FieldSchema }) => {
  return (
    <Space style={{ marginRight: 20 }}>
      <Tag icon={<SwapRightOutlined />} color="cyan">
        关联到：{field.options?.targetModelKey ? field.options.targetModelKey : '未选择'}
      </Tag>
      {field.options?.relationType && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          ({field.options.relationType})
        </Text>
      )}
    </Space>
  );
};

// --- Behavior Components for ConfigForm ---

// Basic Settings Tab
const BasicSettingsTab = ({ field }: { field: FieldSchema }) => (
  <>
    <Form.Item label="显示名称 (Label)" name="label" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="API 键名 (Key)" name="key" rules={[{ required: true }]}>
      <Input prefix={<Text type="secondary">api::</Text>} disabled={false} />
    </Form.Item>
    {field.type === 'repeater' && (
      <div style={{ marginTop: 24 }}>
        <Form.Item label="Repeater 结构定义" name="subFields">
          <RepeaterFieldEditor />
        </Form.Item>
      </div>
    )}
    <Form.Item label="帮助文本" name="helperText">
      <Input.TextArea rows={2} placeholder="给内容编辑者的提示..." />
    </Form.Item>
  </>
);

// Relation Options Tab
const RelationOptionsTab = () => (
  <>
    <Divider orientation="horizontal">关系设置</Divider>
    <Form.Item name={['options', 'targetModelKey']} label="关联目标模型" rules={[{ required: true, message: '请选择关联的模型' }]}>
      <Select placeholder="选择要关联的模型..." showSearch>
        {MOCK_EXISTING_MODELS.map((m) => (
          <Select.Option key={m.value} value={m.value}>
            {m.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item name={['options', 'relationType']} label="关系类型" initialValue="oneToOne">
      <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Radio.Button value="oneToOne" style={{ textAlign: 'center' }}>
            1 : 1<br />
            <span style={{ fontSize: 10 }}>一对一</span>
          </Radio.Button>
          <Radio.Button value="oneToMany" style={{ textAlign: 'center' }}>
            1 : N<br />
            <span style={{ fontSize: 10 }}>一对多</span>
          </Radio.Button>
          <Radio.Button value="manyToOne" style={{ textAlign: 'center' }}>
            N : 1<br />
            <span style={{ fontSize: 10 }}>多对一</span>
          </Radio.Button>
          <Radio.Button value="manyToMany" style={{ textAlign: 'center' }}>
            N : N<br />
            <span style={{ fontSize: 10 }}>多对多</span>
          </Radio.Button>
        </div>
      </Radio.Group>
    </Form.Item>

    {/* <Alert
      type="info"
      showIcon
      title="数据库提示"
      description="选择 '多对多' 关系将自动创建中间表。 '一对多' 将在目标表创建外键。"
      style={{ fontSize: 12 }}
    /> */}
  </>
);

// Media Options Tab
const MediaOptionsTab = () => (
  <>
    <Divider orientation="horizontal">媒体设置</Divider>
    <Form.Item name={['options', 'multiple']} valuePropName="checked" label="允许多文件上传">
      <Switch checkedChildren="开启" unCheckedChildren="关闭" />
    </Form.Item>

    <Form.Item name={['options', 'allowedTypes']} label="允许的文件类型">
      <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox value="images">图片 (JPG, PNG, WEBP, GIF)</Checkbox>
        <Checkbox value="videos">视频 (MP4, MOV)</Checkbox>
        <Checkbox value="files">文档 (PDF, DOCX)</Checkbox>
        <Checkbox value="audios">音频 (MP3, WAV)</Checkbox>
      </Checkbox.Group>
    </Form.Item>
  </>
);

// Validation Tab
const ValidationTab = ({ field }: { field: FieldSchema }) => (
  <>
    <Form.Item name="required" valuePropName="checked">
      <Switch checkedChildren="必填" unCheckedChildren="选填" />
    </Form.Item>
    <Form.Item name="unique" valuePropName="checked">
      <Switch checkedChildren="唯一" unCheckedChildren="非唯一" />
    </Form.Item>
    {field.type === 'text' && (
      <Form.Item label="正则校验 (Regex)" name={['options', 'regex']}>
        <Input placeholder="^[a-z]+$" />
      </Form.Item>
    )}
    {field.type === 'repeater' && (
      <Space>
        <Form.Item label="最小条数" name={['options', 'min']}>
          <Input type="number" min={0} style={{ width: 80 }} />
        </Form.Item>
        <Form.Item label="最大条数" name={['options', 'max']}>
          <Input type="number" min={0} style={{ width: 80 }} />
        </Form.Item>
      </Space>
    )}
  </>
);

// Dynamic Zone Components Tab
const DynamicZoneComponentsTab = () => (
  <>
    <div style={{ marginBottom: 16 }}>
      <Text type="secondary">定义允许在此区域中添加的组件类型。这也是 "Polymorphic" 数据的来源。</Text>
    </div>
    <Form.Item name={['options', 'allowedComponents']} initialValue={[]} trigger="onChange" validateTrigger="onChange">
      <DynamicZoneSelector />
    </Form.Item>
  </>
);

// Tab Items Builder (Data Layer Logic)
const buildTabItems = (field: FieldSchema) => {
  const tabConfig = {
    basic: {
      key: 'basic',
      label: '基本设置',
      component: BasicSettingsTab,
      condition: () => true,
    },
    relationOptions: {
      key: 'relationOptions',
      label: '关系选项',
      component: RelationOptionsTab,
      condition: (f: FieldSchema) => f.type === 'relation',
    },
    mediaOptions: {
      key: 'mediaOptions',
      label: '媒体选项',
      component: MediaOptionsTab,
      condition: (f: FieldSchema) => f.type === 'media',
    },
    validation: {
      key: 'validation',
      label: '校验规则',
      component: ValidationTab,
      condition: (f: FieldSchema) => f.type !== 'dynamic_zone',
    },
    components: {
      key: 'components',
      label: '组件白名单',
      component: DynamicZoneComponentsTab,
      condition: (f: FieldSchema) => f.type === 'dynamic_zone',
    },
  };

  return Object.values(tabConfig)
    .filter((tab) => tab.condition(field))
    .map(({ key, label, component: Component }) => ({
      key,
      label,
      children: <Component field={field} />,
    }));
};

// --- 子组件：配置抽屉 ---
const ConfigForm = ({ field, onUpdate }: { field: FieldSchema | undefined; onUpdate: (id: string, val: any) => void }) => {
  const [form] = Form.useForm();

  // 当选中的字段变化时，重置表单
  useEffect(() => {
    if (field) {
      const initialValues = {
        ...field,
        subFields: field.subFields || [],
      };
      form.setFieldsValue(initialValues);
    }
  }, [field, form]);

  if (!field) return null;

  const tabItems = buildTabItems(field);

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(changedValues, allValues) => {
        onUpdate(field.id, changedValues);
      }}
    >
      <Tabs defaultActiveKey="basic" items={tabItems} />
    </Form>
  );
};

// --- 主页面组件 ---
export const ModelBuilderPage = () => {
  // 1. 调用 Data Layer
  const { fields, activeField, isDrawerOpen, actions, modelMeta } = useSchemaModel();
  // [新增] 用于 DragOverlay 显示当前正在拖拽的元素信息
  const [activeDragItem, setActiveDragItem] = React.useState<any>(null);
  // [优化] 传感器设置，避免与 Antd Button 点击冲突，要求拖拽必须移动 5px 才触发
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  // [新增] 画布区域 Droppable 设置
  const { setNodeRef: setCanvasRef, isOver: isCanvasOver } = useDroppable({ id: 'canvas' });

  // [新增] 处理拖拽开始
  const handleDragStart = (event: any) => {
    const { active } = event;
    // 记录正在拖拽的是谁（可能是已有字段，也可能是工具箱新字段）
    if (active.data.current?.isTool) {
      // setActiveDragItem({ type: 'tool', ...active.data.current });
      setActiveDragItem({ type: 'tool', field: { ...active.data.current } });
    } else {
      // 查找当前 fields 中对应的 item 用于显示
      const field = fields.find((f) => f.id === active.id);
      if (field) setActiveDragItem({ type: 'field', field });
    }
  };

  // [修改] 处理拖拽结束：核心逻辑
  // 2. Behavior Layer: 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over) return;

    if (active.data.current?.isTool) {
      const type = active.data.current.type;
      const label = active.data.current.label;
      let newIndex = fields.length;
      if (over.id && over.id !== 'canvas') {
        const overIndex = fields.findIndex((f) => f.id === over.id);
        if (overIndex >= 0) newIndex = overIndex;
      }
      actions.insertField(newIndex, type, label);
      return;
    }

    if (over.id !== 'canvas' && active.id !== over.id) {
      actions.reorderFields(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} // 监听开始
      onDragEnd={handleDragEnd}
    >
      <Layout style={{ height: '100vh' }}>
        {/* 顶部导航 */}
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          <Space size={16}>
            <Button icon={<ArrowLeftOutlined />} type="text" />
            <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 16, height: 40, display: 'flex', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>
                编辑模型:{' '}
                <strong>
                  {modelMeta.name} ({modelMeta.key})
                </strong>
              </Title>
              <Tag color="gold">Draft</Tag>
            </div>
          </Space>
          <Space>
            <Text type="secondary">上次保存: 10分钟前</Text>
            <Button type="primary" icon={<SaveOutlined />}>
              保存模型
            </Button>
          </Space>
        </Header>
        <Layout>
          <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
            <CategorizedToolbox onAddField={actions.addField} />
          </Sider>
          <Content style={{ padding: 24, background: '#f5f7fa', overflowY: 'auto' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {/* 3.1 Basic Settings: 对应线框图 "基本设置" */}
              <ModelBasicSettings meta={modelMeta} onChange={actions.updateMeta} />

              {/* 3.2 Schema Canvas Header */}
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>
                  模型结构画布 (Schema Canvas)
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {fields.length} fields
                </Text>
              </div>

              {/* 3.3 Drag & Drop Area */}
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  {fields.length === 0 ? (
                    <div
                      style={{
                        border: '2px dashed #d9d9d9',
                        borderRadius: 8,
                        padding: 40,
                        textAlign: 'center',
                        background: '#fff',
                      }}
                    >
                      <Text type="secondary">画布为空，请从左侧拖拽字段添加</Text>
                    </div>
                  ) : (
                    fields.map((field) => (
                      <SortableItem key={field.id} id={field.id}>
                        {(dragProps) => (
                          <CanvasFieldRow
                            field={field}
                            onDelete={() => actions.removeField(field.id)}
                            onConfig={() => actions.openConfig(field)}
                            dragProps={dragProps}
                          />
                        )}
                      </SortableItem>
                    ))
                  )}
                </SortableContext>
              </DndContext>

              {/* 底部占位符，模拟线框图底部的 "(拖拽到此处添加新字段)" */}
              <div
                style={{
                  border: '1px dashed #d9d9d9',
                  borderRadius: 4,
                  padding: 12,
                  textAlign: 'center',
                  marginTop: 8,
                  color: '#bfbfbf',
                  fontSize: 12,
                  background: 'rgba(0,0,0,0.01)',
                }}
              >
                (拖拽到此处添加新字段)
              </div>
            </div>
          </Content>

          {/* 右侧配置抽屉 */}
          <Drawer
            title={`配置字段: ${activeField?.label || ''}`}
            size={400}
            open={isDrawerOpen}
            onClose={actions.closeDrawer}
            mask={false} // 非模态，允许看画布
            styles={{ body: { paddingBottom: 80 } }}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                  <Button onClick={actions.closeDrawer}>取消</Button>
                  <Button type="primary" onClick={actions.closeDrawer}>
                    确认
                  </Button>
                </Space>
              </div>
            }
          >
            <ConfigForm field={activeField} onUpdate={actions.updateField} />
          </Drawer>
        </Layout>
      </Layout>

      {/* [新增] DragOverlay: 拖拽时的视觉层 */}
      {/* createPortal 建议用于 overlay，但在 dnd-kit 中放在 DndContext 内即可自动处理 */}
      <DragOverlay>
        {activeDragItem ? (
          activeDragItem.type === 'tool' ? (
            <Button block style={{ width: 120, background: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
              {activeDragItem.field?.label}
            </Button>
          ) : (
            // 拖拽已有字段时的样式 (模拟 Card 外观)
            <Card size="small" style={{ width: 300, opacity: 0.8, cursor: 'grabbing' }}>
              <Space>
                <HolderOutlined />
                <Text strong>{activeDragItem.field.label}</Text>
              </Space>
            </Card>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ModelBuilderPage;
