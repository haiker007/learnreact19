// components/views/ModelCardView.tsx
import React from 'react';
import { Card, Typography, Button, Badge, theme, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { type ModelDef } from '@/components/Cms/hooks/useModelListLogic';
import { HoverRevealLayer } from '@/components/Cms/layers/HoverRevealLayer';

const { Title, Text } = Typography;

interface ModelCardViewProps {
  models: ModelDef[];
  onCreate: (key: string) => void;
  onEdit?: (key: string) => void;
}

export const ModelCardView: React.FC<ModelCardViewProps> = ({ models, onCreate, onEdit }) => {
  const { token } = theme.useToken();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
      {models.map((model) => (
        // 使用 Behavior Layer 包裹每个卡片
        <HoverRevealLayer key={model.key} style={{ position: 'relative' }}>
          {(isHovered) => (
            <>
              <Card
                hoverable
                style={{
                  height: '100%',
                  transition: 'all 0.3s',
                  // 当 hover 且显示遮罩时，稍微模糊背景
                  filter: isHovered ? 'blur(2px)' : 'none',
                  opacity: isHovered ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 32,
                      background: token.colorFillAlter,
                      padding: 12,
                      borderRadius: 12,
                      marginRight: 16,
                    }}
                  >
                    {model.icon}
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {model.name}
                    </Title>
                    <Text type="secondary" code>
                      {model.key}
                    </Text>
                  </div>
                </div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16, minHeight: 44 }}>
                  {model.description}
                </Text>
                <Badge status="success" text={`${model.itemCount} 条内容`} />
              </Card>

              {/* 悬停时出现的按钮遮罩层 */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    // 简单的入场动画
                    animation: 'fadeIn 0.2s ease-in-out',
                  }}
                >
                  <Space size="middle">
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => onCreate(model.key)}
                      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                    >
                      创建内容
                    </Button>
                    {onEdit && (
                      <Button
                        type="default"
                        shape="round"
                        size="large"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(model.key)}
                        style={{
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          background: '#fff',
                        }}
                      >
                        编辑模型
                      </Button>
                    )}
                  </Space>
                </div>
              )}
            </>
          )}
        </HoverRevealLayer>
      ))}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};
