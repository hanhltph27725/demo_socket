import { Product } from '@/constants/product-type';
import { useDrag, useDrop } from 'react-dnd';

interface DraggableRowProps {
  index: number;
  product: Product;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  columnOrder: (keyof Product)[];
}

const DraggableRow: React.FC<DraggableRowProps> = ({
  index,
  product,
  moveRow,
  columnOrder,
}) => {
  const [, drag] = useDrag({
    type: 'row',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'row',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
  });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(price);
  };

  return (
    <tr ref={(node) => drag(drop(node))}>
      {columnOrder.map((column) => (
        <td key={column}>
          {column === 'price' ? formatPrice(product[column]) : product[column]}
        </td>
      ))}
    </tr>
  );
};

export default DraggableRow;
