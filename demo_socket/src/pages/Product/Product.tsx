import type { Product } from '@/constants/product-type';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import classNames from 'classnames/bind';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SockJS from 'sockjs-client';
import styles from './styles.module.scss';
import DraggableColumn from '@/components/DraggableColumn';
const cx = classNames.bind(styles);

const Product: React.FC = (): JSX.Element => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [newProduct, setNewProduct] = React.useState({ code: '', name: '' });
  const [stompClient, setStompClient] = React.useState<Client | null>(null);
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [columnOrder, setColumnOrder] = React.useState<(keyof Product)[]>([
    'id',
    'code',
    'name',
    'price',
  ]);

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig) return products;
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [products, sortConfig]);

  React.useEffect(() => {
    const socket = new SockJS('http://localhost:8080/my-websocket-endpoint');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log('Connected server');

      client.subscribe('/topic/product', (message) => {
        if (message.body) {
          const updatedProducts = JSON.parse(message.body);
          setProducts(updatedProducts);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers.message);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  React.useEffect(() => {
    axios
      .get('http://localhost:8080/list')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddProduct = () => {
    if (
      stompClient &&
      stompClient.connected &&
      newProduct.code &&
      newProduct.name
    ) {
      const randomPrice = Math.floor(Math.random() * 1000000) + 1;

      const productToSend = JSON.stringify({
        id: Date.now(),
        ...newProduct,
        price: randomPrice,
      });

      setProducts((prevProducts) => [
        ...prevProducts,
        { id: Date.now(), ...newProduct, price: randomPrice },
      ]);

      stompClient.publish({
        destination: '/app/products',
        body: productToSend,
      });
      setNewProduct({ code: '', name: '' });
    } else {
      console.error('STOMP client chưa kết nối hoặc thiếu dữ liệu sản phẩm.');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(price);
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const swapColumns = (dragIndex: number, hoverIndex: number) => {
    setColumnOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      [newOrder[dragIndex], newOrder[hoverIndex]] = [
        newOrder[hoverIndex],
        newOrder[dragIndex],
      ];
      return newOrder;
    });
  };

  return (
    <div className={cx('wrapper')}>
      <div>
        <div className={cx('formbold-form-wrapper')}>
          <div className={cx('formbold-input-flex')}>
            <div>
              <label className={cx('formbold-form-label')}>Code</label>
              <input
                type="text"
                name="code"
                placeholder="Product Code (code)"
                className={cx('formbold-form-input')}
                value={newProduct.code}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, code: e.target.value })
                }
              />
            </div>
            <div>
              <label className={cx('formbold-form-label')}>Last name</label>
              <input
                placeholder="Product Name (name)"
                type="text"
                name="name"
                className={cx('formbold-form-input')}
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
          </div>
          <button className={cx('formbold-btn')} onClick={handleAddProduct}>
            Send Message
          </button>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <table className={cx('table')}>
          <thead>
            <tr>
              {columnOrder.map((column, index) => (
                <DraggableColumn
                  key={column}
                  column={column}
                  index={index}
                  moveColumn={swapColumns}
                  handleSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                {columnOrder.map((column) => (
                  <td key={column}>
                    {' '}
                    {column === 'price'
                      ? formatPrice(product[column])
                      : product[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndProvider>
    </div>
  );
};

export default Product;
