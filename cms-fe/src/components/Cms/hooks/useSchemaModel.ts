// hooks/useSchemaModel.ts
import { useState } from 'react';
import type { FieldSchema, FieldType } from '../types';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid'; // 假设你安装了uuid，这里用简单的随机数代替

export const useSchemaModel = () => {
  const [modelMeta, setModelMeta] = useState({
    name: '文章',
    key: 'article',
    description: '用于博客发布...',
  });
  const updateMeta = (key: string, value: string) => {
    setModelMeta((prev) => ({ ...prev, [key]: value }));
  };

  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 动作：添加字段
  const addField = (type: FieldType, label: string) => {
    const newField: FieldSchema = {
      id: `field_${Date.now()}`,
      key: `${type}_${fields.length + 1}`,
      label: label,
      type: type,
      required: false,
    };
    setFields([...fields, newField]);
  };

  // 动作：删除字段
  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (activeFieldId === id) setIsDrawerOpen(false);
  };

  // 动作：更新字段
  const updateField = (id: string, updates: Partial<FieldSchema>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // 动作：排序字段 (配合 dnd-kit)
  const reorderFields = (activeId: string, overId: string) => {
    setFields((items) => {
      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // 动作：打开配置
  const openConfig = (field: FieldSchema) => {
    setActiveFieldId(field.id);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveFieldId(null);
  };

  const activeField = fields.find((f) => f.id === activeFieldId);

  // [新增] 动作：在指定索引插入字段
  const insertField = (index: number, type: FieldType, label: string) => {
    const newField: FieldSchema = {
      id: `field_${Date.now()}`,
      key: `${type}_${Date.now()}`, // 使用时间戳避免重复
      label: label,
      type: type,
      required: false,
    };

    setFields((prev) => {
      const newFields = [...prev];
      // 如果 index 为 -1 或超出范围，追加到末尾
      if (index < 0 || index > newFields.length) {
        newFields.push(newField);
      } else {
        newFields.splice(index, 0, newField);
      }
      return newFields;
    });
  };

  return {
    fields,
    activeField,
    isDrawerOpen,
    modelMeta,
    actions: { updateMeta, addField, removeField, updateField, reorderFields, insertField, openConfig, closeDrawer },
  };
};
