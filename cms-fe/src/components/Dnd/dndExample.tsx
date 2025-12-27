import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
function DraggableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    cursor: 'grab',
    padding: '20px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      Drag Me
    </button>
  );
}

function DroppableArea(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-1',
  });

  const style = {
    width: '200px',
    height: '200px',
    border: '2px dashed gray',
    backgroundColor: isOver ? 'lightgreen' : 'white', // 拖入时变色
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default function BasicDragDrop() {
  const [hasCopy, setHasCopy] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { over } = event;
    if (over?.id === 'droppable-1') setHasCopy(true);
    setActiveId(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <DraggableItem id="draggable-1" />
      <DroppableArea>
        {hasCopy ? <button style={{ padding: '20px', border: '1px solid #1890ff', backgroundColor: '#e6f4ff' }}>Copied Item</button> : 'Drop Here'}
      </DroppableArea>
      <DragOverlay>
        {activeId ? <button style={{ padding: '20px', border: '1px solid #1890ff', backgroundColor: '#e6f4ff' }}>Drop here</button> : null}
      </DragOverlay>
    </DndContext>
  );
}
