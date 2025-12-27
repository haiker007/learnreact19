// components/layers/HoverRevealLayer.tsx
import React, { useState } from 'react';

interface HoverRevealLayerProps {
  // 渲染属性 (Render Props) 模式，将 hover 状态传给子组件
  children: (isHovered: boolean) => React.ReactNode;
  // 或者直接包裹内容
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 行为层组件：专门处理鼠标悬停状态
 */
export const HoverRevealLayer: React.FC<HoverRevealLayerProps> = ({ children, className, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={className} style={style} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children(isHovered)}
    </div>
  );
};
