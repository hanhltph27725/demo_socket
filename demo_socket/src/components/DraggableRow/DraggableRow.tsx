import { Product } from '@/constants/product-type';
import classNames from 'classnames/bind';
import { useDrag, useDrop } from 'react-dnd';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

interface DraggableRowProps {
  index: number;
  product: Product;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  columnOrder: (keyof Product)[];
  trend: 'up' | 'down' | 'flat';
}

const DraggableRow: React.FC<DraggableRowProps> = ({
  index,
  product,
  moveRow,
  columnOrder,
  trend,
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

  const renderCell = (column: keyof Product) => {
    if (column === 'price') {
      return (
        <span className={cx('price', trend)}>
          {trend === 'up' && <span className={cx('arrow')}>▲</span>}
          {trend === 'down' && <span className={cx('arrow')}>▼</span>}
          {formatPrice(product.price)}
        </span>
      );
    }
    if (column === 'code') {
      return <span className={cx('code')}>{product.code}</span>;
    }
    if (column === 'id') {
      return <span className={cx('id')}>{product.id}</span>;
    }
    return product[column];
  };

  return (
    <tr ref={(node) => drag(drop(node))} className={cx('rowItem')}>
      {columnOrder.map((column) => (
        <td key={column} className={cx('cell', { priceCell: column === 'price' })}>
          {renderCell(column)}
        </td>
      ))}
    </tr>
  );
};

export default DraggableRow;
