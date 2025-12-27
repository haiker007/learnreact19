import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from 'antd';
import { CSS } from '@dnd-kit/utilities';

interface DraggableToolItemProps {
  type: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

export const DraggableToolItem: React.FC<DraggableToolItemProps> = ({ type, label, icon, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `tool-${type}`,
    data: {
      isTool: true, // 标记这是一个工具箱项目
      type,
      label,
    },
  });

  const style: React.CSSProperties = {
    // transform: CSS.Translate.toString(transform),
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Button
        block
        onClick={onClick}
        style={{
          height: 'auto',
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          cursor: 'grab',
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 12 }}>{label}</span>
      </Button>
    </div>
  );
};
