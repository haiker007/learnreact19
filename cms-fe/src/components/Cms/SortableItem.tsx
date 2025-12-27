// components/SortableItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: (args: {
    setNodeRef: (node: HTMLElement | null) => void;
    attributes: any;
    listeners: any;
    style: React.CSSProperties;
    isDragging: boolean;
  }) => React.ReactElement;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as 'relative', // Fix type inference
  };

  return children({ setNodeRef, attributes, listeners, style, isDragging });
};
