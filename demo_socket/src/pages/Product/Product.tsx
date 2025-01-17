import { Client } from '@stomp/stompjs';
import axios from 'axios';
import classNames from 'classnames/bind';
import React from 'react';
import SockJS from 'sockjs-client';
import styles from './styles.module.scss';
const cx = classNames.bind(styles);

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

const Product: React.FC = (): JSX.Element => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [newProduct, setNewProduct] = React.useState({ code: '', name: '' });
  const [stompClient, setStompClient] = React.useState<Client | null>(null);

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
  console.log(products);

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

      <table className={cx('table')}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{formatPrice(product.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
