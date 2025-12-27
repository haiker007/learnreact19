// hooks/useModelListLogic.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 定义数据模型接口
export interface ModelDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

// 模拟数据
const MOCK_MODELS: ModelDef[] = [
  { key: 'article', name: '文章 (Article)', description: '新闻、博客内容', icon: '📄', itemCount: 120 },
  { key: 'product', name: '产品 (Product)', description: '电商 SKU 信息', icon: '🛍️', itemCount: 45 },
  { key: 'page', name: '单页 (Page)', description: '关于我们、落地页', icon: '📟', itemCount: 8 },
  { key: 'author', name: '作者 (Author)', description: '内容创作者信息', icon: '🧑‍💻', itemCount: 12 },
];

export type ViewMode = 'card' | 'list';

export const useModelListLogic = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [loading, setLoading] = useState(false);

  // 动作：跳转到创建页面
  const navigateToCreate = (modelKey: string) => {
    // 实际项目中这里可能带上 hash 或 search params
    console.log(`Navigating to create page for: ${modelKey}`);
    navigate(`/contents/create/${modelKey}`);
  };

  // 动作：跳转到编辑模型页面
  const navigateToEdit = (modelKey: string) => {
    console.log(`Navigating to edit model page for: ${modelKey}`);
    navigate(`/models/edit/${modelKey}`);
  };

  return {
    models: MOCK_MODELS,
    loading,
    viewMode,
    actions: {
      toggleViewMode: setViewMode,
      navigateToCreate,
      navigateToEdit,
    },
  };
};
