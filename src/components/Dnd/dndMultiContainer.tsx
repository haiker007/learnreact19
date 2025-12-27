import React, { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// [新增] 纯展示组件：负责长什么样
const Item = React.forwardRef(
  (
    {
      id,
      isDragging, // 1. 解构出 isDragging
      dragOverlay,
      style,
      ...props
    },
    ref,
  ) => {
    const inlineStyles = {
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      marginBottom: '8px',
      borderRadius: '4px',
      cursor: 'grab',
      // 使用解构出来的变量
      boxShadow: dragOverlay ? '0 5px 15px rgba(0,0,0,0.25)' : 'none',
      opacity: isDragging ? 0.3 : 1,
      ...style, // 合并传入的 transform/transition
    };
    return (
      <div ref={ref} style={inlineStyles} {...props}>
        {id}
      </div>
    );
  },
);

// --- 1. 卡片组件 (和之前一样) ---
function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // [新增] 获取是否正在被拖拽的状态
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 将逻辑传递给展示组件
  return <Item ref={setNodeRef} id={id} style={style} isDragging={isDragging} {...attributes} {...listeners} />;
}

// --- 2. 容器组件 (每一列) ---
function Container({ id, items }) {
  const { setNodeRef } = useDroppable({ id });
  const containerStyle = {
    background: '#f0f0f0',
    padding: '10px',
    width: '200px',
    minHeight: '200px', // 2. 必须保留高度，否则空的时候鼠标指不到
    borderRadius: '5px',
    display: 'flex', // 建议添加
    flexDirection: 'column', // 建议添加
  };

  return (
    <div style={containerStyle} ref={setNodeRef}>
      <h3 style={{ marginTop: 0 }}>{id.toUpperCase()}</h3>
      {/* 每个容器都有自己的 SortableContext */}
      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        {items.map((itemId) => (
          <SortableItem key={itemId} id={itemId} />
        ))}
      </SortableContext>
    </div>
  );
}

// --- 3. 主应用 (看板) ---
export default function KanbanBoard() {
  // 数据结构：对象映射数组
  const [items, setItems] = useState({
    todo: ['Task 1', 'Task 2', 'Task 3'],
    doing: ['Task 4'],
    done: ['Task 5', 'Task 6'],
  });

  // [新增] 记录当前正在拖拽的 ID
  const [activeId, setActiveId] = useState(null);
  // [新增] 开始拖拽时，记录 ID
  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // 辅助函数：根据 id 查找它所在的容器
  function findContainer(id) {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].includes(id));
  }

  // --- 关键逻辑：处理拖拽过程中的移动 (onDragOver) ---
  function handleDragOver(event) {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // 如果跨越了容器，移动数据
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(active.id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // 如果我们拖到了容器本身上面（例如空容器），放在末尾
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  // --- 结束逻辑：处理同一容器内的排序 (onDragEnd) ---
  function handleDragEnd(event) {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over?.id);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[activeContainer].indexOf(over.id);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null); // [新增] 重置状态
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners} // 这种场景下 corners 算法体验更好
        onDragStart={handleDragStart} // [新增] 绑定事件
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(items).map((containerId) => (
          <Container key={containerId} id={containerId} items={items[containerId]} />
        ))}
      </DndContext>

      {/* [新增] 拖拽覆盖层 */}
      {/* createPortal 并不是必须的，但在复杂布局中推荐使用以避免 z-index 问题，这里简单直接放 */}
      <DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
    </div>
  );
}
