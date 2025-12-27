// types.ts
// export type FieldType = 'text' | 'number' | 'boolean' | 'datetime' | 'media' | 'relation' | 'repeater' | 'dynamic_zone';
export type FieldType =
  | 'date'
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'datetime'
  | 'media'
  | 'relation'
  | 'repeater'
  | 'component'
  | 'dynamic_zone';

// 媒体字段配置
export interface MediaOptions {
  multiple: boolean; // 是否允许多选
  allowedTypes: string[]; // ['images', 'videos', 'files']
}

// 关系字段配置
export interface RelationOptions {
  targetModelKey: string; // 关联的目标模型 (如 'author')
  relationType: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
}

export interface FieldSchema {
  id: string; // 唯一标识，用于拖拽
  key: string; // 数据库字段名
  label: string;
  type: FieldType;
  required?: boolean;
  // 新增：Repeater 专用的子字段定义
  subFields?: FieldSchema[];
  options?: RelationOptions | MediaOptions | any; // 用于存储组件白名单、正则等高级配置
}

export const FIELD_TOOLS = [
  { type: 'text', label: '单行文本', icon: '📝' },
  { type: 'number', label: '数字', icon: '🔢' },
  { type: 'boolean', label: '布尔值', icon: '✅' },
  { type: 'repeater', label: '重复列表', icon: '🔁' },
  { type: 'dynamic_zone', label: '动态区域', icon: '🧱' },
];

// 定义允许在 Repeater 里使用的简单字段类型
export const SUB_FIELD_TYPES = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '图片', value: 'media' },
  { label: '日期', value: 'datetime' },
];

export const DYNAMIC_ZONE_COMPONENTS = [
  {
    key: 'hero_banner',
    name: '横幅组件',
    fields: [
      { id: 'hero-1', key: 'heading', label: '标题', type: 'text', required: true },
      { id: 'hero-2', key: 'background_image1', label: '背景图', type: 'media', options: { multiple: false } },
      { id: 'hero-3', key: 'datetime', label: '日期时间', type: 'datetime' },
      { id: 'hero-4', key: 'date', label: '日期', type: 'date' },
    ],
  },
  {
    key: 'image_gallery',
    name: '图片画廊',
    fields: [{ id: 'gallery-1', key: 'images', label: '图片列表', type: 'media', options: { multiple: true } }],
  },
  {
    key: 'text',
    name: '文章内容',
    fields: [
      { id: 'text-1', key: 'title', label: '标题', type: 'text', required: true },
      { id: 'text-2', key: 'cover', label: '封面', type: 'media', required: true },
      { id: 'text-2', key: 'content', label: '内容', type: 'textarea', required: true },
      { id: 'text-3', key: 'author', label: '作者', type: 'relation', required: true },
      { id: 'text-4', key: 'datetime', label: '日期时间', type: 'datetime', required: true },
    ],
  },
];

// types.ts

// 定义工具箱的分类结构
export const TOOLBOX_CATEGORIES = [
  {
    title: '基础字段 (Basic)',
    items: [
      { type: 'text', label: '单行文本', icon: 'T' },
      { type: 'textarea', label: '多行文本', icon: '¶' },
      { type: 'number', label: '数字', icon: '#' },
      { type: 'boolean', label: '布尔值', icon: '✓' },
      { type: 'datetime', label: '日期时间', icon: '📅' },
    ],
  },
  {
    title: '媒体与关系 (Media & Rel)',
    items: [
      { type: 'media', label: '图片/文件', icon: '🖼️' },
      { type: 'relation', label: '引用关系', icon: '🔗' },
    ],
  },
  {
    title: '高级结构 (Advanced)',
    items: [
      { type: 'repeater', label: '重复列表', icon: '🔁' },
      { type: 'component', label: '嵌入组件', icon: '🧩' },
      { type: 'dynamic_zone', label: '动态区域', icon: '🧱' }, // 核心!
    ],
  },
];

export interface ModelMeta {
  name: string;
  key: string;
  description: string;
}

// 模拟系统里已存在的其他模型 (用于关系选择)
export const MOCK_EXISTING_MODELS = [
  { label: '用户 (User)', value: 'plugin::users-permissions.user' },
  { label: '作者 (Author)', value: 'api::author.author' },
  { label: '分类 (Category)', value: 'api::category.category' },
  { label: '标签 (Tag)', value: 'api::tag.tag' },
];
