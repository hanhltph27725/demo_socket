import { Product } from '@/constants/product-type';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DraggableColumnProps {
  column: keyof Product;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  handleSort: (key: keyof Product) => void;
}

const DraggableColumn: React.FC<DraggableColumnProps> = ({
  column,
  index,
  moveColumn,
  handleSort,
}) => {
  const ref = React.useRef<HTMLTableHeaderCellElement>(null);

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      onClick={() => handleSort(column)}
    >
      {column.toUpperCase()}
    </th>
  );
};

export default DraggableColumn;
