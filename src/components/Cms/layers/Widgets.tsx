// components/presentation/Widgets.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Input,
  InputNumber,
  Switch,
  DatePicker,
  Select,
  Upload,
  Button,
  Card,
  Space,
  Modal,
  List,
  Tag,
  Table,
  Radio,
  Tooltip,
  Typography,
  Tree, // <-- added
} from 'antd';
import { UploadOutlined, LinkOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { RelationSelector, SelectedRelationItems } from '@/components/Cms/RelationSelector';

// Mock data generator (reuse from RelationSelector)
const generateMockData = (targetModel: string, count: number = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    title: `${targetModel} Item ${i + 1}`,
    status: i % 3 === 0 ? 'published' : i % 3 === 1 ? 'draft' : 'archived',
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  }));
};

type MediaItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'doc';
  url: string;
  size?: string;
  updatedAt?: string;
  category?: string; // <-- added
};

const mockMedia: MediaItem[] = [
  { id: 'm1', name: '封面图.jpg', type: 'image', url: '/media/cover.jpg', size: '320KB', updatedAt: '2024-12-01', category: 'banner' },
  { id: 'm2', name: '介绍.mp4', type: 'video', url: '/media/intro.mp4', size: '12MB', updatedAt: '2024-12-03', category: 'promo' },
  { id: 'm3', name: '配乐.mp3', type: 'audio', url: '/media/bgm.mp3', size: '2.1MB', updatedAt: '2024-12-05', category: 'music' },
  { id: 'm4', name: '手册.pdf', type: 'doc', url: '/media/manual.pdf', size: '1.4MB', updatedAt: '2024-12-06', category: 'docs' },
];

type MediaType = MediaItem['type'];
type ViewMode = 'grid' | 'table';

const useMediaWidgetBehavior = ({
  multiple = false,
  value = [],
  onChange,
  types,
}: {
  multiple?: boolean;
  value?: string[];
  onChange?: (val: string[]) => void;
  types?: MediaType[]; // 仅显示这些类型
}) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [draftSelection, setDraftSelection] = useState<string[]>(value);
  const [category, setCategory] = useState<string>('all'); // <-- added

  // reset draft when modal opens
  useEffect(() => {
    if (open) setDraftSelection(value);
  }, [open, value]);

  // categories derived from allowed set (types)
  const categories = useMemo(() => {
    const allowedSet = types && types.length ? new Set(types) : null;
    const list = mockMedia.filter((m) => (allowedSet ? allowedSet.has(m.type) : true)).map((m) => m.category || 'uncategorized');
    return Array.from(new Set(list));
  }, [types]);

  const filtered = useMemo(() => {
    const allowedSet = types && types.length ? new Set(types) : null;
    return mockMedia.filter((m) => {
      if (allowedSet && !allowedSet.has(m.type)) return false;
      const matchType = typeFilter === 'all' ? true : m.type === typeFilter;
      const matchKw = keyword ? m.name.toLowerCase().includes(keyword.toLowerCase()) : true;
      const matchCat = category === 'all' ? true : (m.category || 'uncategorized') === category;
      return matchType && matchKw && matchCat;
    });
  }, [keyword, typeFilter, types, category]);

  const isChecked = (id: string) => draftSelection.includes(id);

  const toggleSelect = (id: string) => {
    setDraftSelection((prev) => {
      if (multiple) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return [id];
    });
  };

  // NEW: remove selected item and sync upward immediately
  const removeSelected = (id: string) => {
    setDraftSelection((prev) => {
      const next = prev.filter((x) => x !== id);
      onChange?.(next);
      return next;
    });
  };

  const handleOk = () => {
    onChange?.(draftSelection);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraftSelection(value); // revert
    setOpen(false);
  };

  const selectedItems = useMemo(() => mockMedia.filter((m) => draftSelection.includes(m.id)), [draftSelection]);
  return {
    state: {
      open,
      keyword,
      typeFilter,
      viewMode,
      draftSelection,
      filtered,
      category,
      categories,
      selectedItems,
    },
    actions: {
      setOpen,
      setKeyword,
      setTypeFilter,
      setViewMode,
      setCategory,
      toggleSelect,
      removeSelected, // <-- added
      isChecked,
      handleOk,
      handleCancel,
    },
  };
};

const MediaWidgetView: React.FC<{
  multiple?: boolean;
  state: {
    open: boolean;
    keyword: string;
    typeFilter: MediaType | 'all';
    viewMode: ViewMode;
    draftSelection: string[];
    filtered: MediaItem[];
    category: string;
    categories: string[];
    selectedItems: MediaItem[];
  };
  actions: {
    setOpen: (v: boolean) => void;
    setKeyword: (v: string) => void;
    setTypeFilter: (v: MediaType | 'all') => void;
    setViewMode: (v: ViewMode) => void;
    setCategory: (v: string) => void;
    toggleSelect: (id: string) => void;
    isChecked: (id: string) => boolean;
    handleOk: () => void;
    handleCancel: () => void;
    removeSelected: (id: string) => void;
  };
}> = ({ multiple = false, state, actions }) => {
  const typeOptions = [
    { label: '全部类型', value: 'all' },
    { label: '图片', value: 'image' },
    { label: '视频', value: 'video' },
    { label: '音频', value: 'audio' },
    { label: '文档', value: 'doc' },
  ];

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: MediaType) => <Tag>{t}</Tag> },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '更新', dataIndex: 'updatedAt', key: 'updatedAt' },
  ];

  const treeData = [
    {
      title: '全部',
      key: 'all',
      children: state.categories.map((c) => ({
        title: c,
        key: c,
      })),
    },
  ];

  return (
    <>
      <Space>
        <Button icon={<SearchOutlined />} onClick={() => actions.setOpen(true)}>
          选择媒体
        </Button>
        <span>已选：{state.draftSelection.length}</span>
        <Typography.Text>已选：{state.draftSelection.length}</Typography.Text>
        {state.selectedItems.length ? (
          state.selectedItems.map((item) => (
            <Tag
              key={item.id}
              color="green"
              closable
              onClose={(e) => {
                e.preventDefault();
                actions.removeSelected(item.id); // <-- use removeSelected
              }}
            >
              {item.name} ({item.type})
            </Tag>
          ))
        ) : (
          <Typography.Text type="secondary">暂无已选</Typography.Text>
        )}
      </Space>

      <Modal title="选择媒体文件" open={state.open} onCancel={actions.handleCancel} onOk={actions.handleOk} width={960}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 200 }}>
            <Tree
              defaultExpandAll
              treeData={treeData}
              selectedKeys={[state.category]}
              onSelect={(keys) => {
                const key = (keys?.[0] as string) || 'all';
                actions.setCategory(key);
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Space style={{ marginBottom: 12 }} wrap>
              <Input.Search
                allowClear
                placeholder="搜索文件名"
                value={state.keyword}
                onChange={(e) => actions.setKeyword(e.target.value)}
                style={{ width: 220 }}
              />
              <Select value={state.typeFilter} style={{ width: 160 }} onChange={actions.setTypeFilter} options={typeOptions} />
              <Radio.Group value={state.viewMode} onChange={(e) => actions.setViewMode(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value="grid">
                  <AppstoreOutlined /> 网格
                </Radio.Button>
                <Radio.Button value="table">
                  <BarsOutlined /> 表格
                </Radio.Button>
              </Radio.Group>
              {!multiple && <Tag color="purple">单选</Tag>}
              {multiple && <Tag color="blue">多选</Tag>}
            </Space>

            {state.viewMode === 'grid' ? (
              <List
                dataSource={state.filtered}
                grid={{ gutter: 12, column: 3 }}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => actions.toggleSelect(item.id)}
                      style={{ borderColor: actions.isChecked(item.id) ? '#1677ff' : undefined }}
                      title={
                        <Tooltip title={item.name}>
                          <Typography.Text ellipsis>{item.name}</Typography.Text>
                        </Tooltip>
                      }
                    >
                      <Space direction="vertical">
                        <Tag color="blue">{item.type}</Tag>
                        <span style={{ color: '#999' }}>{item.url}</span>
                        <span style={{ color: '#999' }}>{item.size}</span>
                        {actions.isChecked(item.id) && <Tag color="green">已选择</Tag>}
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Table
                rowKey="id"
                size="small"
                dataSource={state.filtered}
                columns={columns}
                pagination={false}
                onRow={(record) => ({
                  onClick: () => actions.toggleSelect(record.id),
                  style: actions.isChecked(record.id) ? { background: '#e6f4ff' } : {},
                })}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

// 2. 关系选择器 - Using separate component
export const RelationWidget: React.FC<{
  targetModel: string;
  value?: string[];
  onChange?: (val: string[]) => void;
  mode?: 'single' | 'multiple';
}> = ({ targetModel, value = [], onChange, mode = 'multiple' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data source
  const dataSource = generateMockData(targetModel);

  // Get selected items details
  const selectedItems = dataSource.filter((item) => value.includes(item.id));

  const handleRemoveItem = (id: string) => {
    const newValue = value.filter((v) => v !== id);
    onChange?.(newValue);
  };

  return (
    <>
      <Space orientation="vertical" style={{ width: '100%' }}>
        {/* Display selected items */}
        <SelectedRelationItems items={selectedItems} onRemove={handleRemoveItem} />

        {/* Open modal button */}
        <Button icon={<SearchOutlined />} onClick={() => setIsModalOpen(true)} block>
          选择关联 {targetModel}
        </Button>
      </Space>

      {/* Selection Modal */}
      <RelationSelector
        targetModel={targetModel}
        value={value}
        onChange={onChange}
        mode={mode}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

// 3. Repeater 容器 UI (仅负责样式布局)
export const RepeaterCard: React.FC<{
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}> = ({ title, onRemove, children }) => (
  <Card
    size="small"
    type="inner"
    title={title}
    extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={onRemove} />}
    style={{ marginBottom: 16, background: '#fafafa' }}
  >
    {children}
  </Card>
);

// 媒体选择器 (Mock UI)
export const MediaWidget: React.FC<{
  multiple?: boolean;
  value?: string[];
  onChange?: (val: string[]) => void;
  types?: MediaType[];
}> = (props) => {
  const { state, actions } = useMediaWidgetBehavior(props);
  return <MediaWidgetView multiple={props.multiple} state={state} actions={actions} />;
};
