import type { Product } from '@/constants/product-type';
import axios from 'axios';
import classNames from 'classnames/bind';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './styles.module.scss';
import DraggableColumn from '@/components/DraggableColumn';
import DraggableRow from '@/components/DraggableRow';
const cx = classNames.bind(styles);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

type Trend = 'up' | 'down' | 'flat';

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

const Product: React.FC = (): JSX.Element => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [newProduct, setNewProduct] = React.useState({ code: '', name: '' });
  const [trends, setTrends] = React.useState<Record<number, Trend>>({});
  const prevPrices = React.useRef<Record<number, number>>({});
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

  const PAGE_SIZE = 8;
  const [page, setPage] = React.useState(1);

  const applyProducts = React.useCallback((incoming: Product[]) => {
    const nextTrends: Record<number, Trend> = {};
    incoming.forEach((p) => {
      const prev = prevPrices.current[p.id];
      if (prev === undefined || prev === p.price) {
        nextTrends[p.id] = 'flat';
      } else {
        nextTrends[p.id] = p.price > prev ? 'up' : 'down';
      }
      prevPrices.current[p.id] = p.price;
    });
    setTrends(nextTrends);
    setProducts(incoming);
  }, []);

  const stats = React.useMemo(() => {
    if (products.length === 0) {
      return { count: 0, avg: 0, max: 0, min: 0 };
    }
    const prices = products.map((p) => p.price);
    return {
      count: products.length,
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      max: Math.max(...prices),
      min: Math.min(...prices),
    };
  }, [products]);

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

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedProducts = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, page]);

  React.useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/stream`);

    eventSource.addEventListener('product', (event) => {
      const updatedProducts: Product[] = JSON.parse(event.data);
      applyProducts(updatedProducts);
    });

    eventSource.onopen = () => console.log('SSE connected');

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [applyProducts]);

  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/list`)
      .then((response) => applyProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [applyProducts]);

  const handleAddProduct = () => {
    if (newProduct.code && newProduct.name) {
      const randomPrice = Math.floor(Math.random() * 1000000) + 1;

      axios
        .post(`${API_BASE_URL}/products`, {
          ...newProduct,
          price: randomPrice,
        })
        .then((response) => setProducts(response.data))
        .catch((error) => console.error('Error adding product:', error));

      setNewProduct({ code: '', name: '' });
    } else {
      console.error('Thiếu dữ liệu sản phẩm.');
    }
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

  const swapRows = (dragIndex: number, hoverIndex: number) => {
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      const draggedRow = newProducts[dragIndex];
      newProducts[dragIndex] = newProducts[hoverIndex];
      newProducts[hoverIndex] = draggedRow;
      return newProducts;
    });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('panel')}>
        <div className={cx('panelHead')}>
          <div>
            <h1 className={cx('title')}>Realtime Products</h1>
            <p className={cx('subtitle')}>Live prices via SSE</p>
          </div>
          <span className={cx('liveBadge')}>
            <span className={cx('dot')} />
            LIVE
          </span>
        </div>

        <div className={cx('form')}>
          <div className={cx('field')}>
            <label className={cx('label')}>Code</label>
            <input
              type="text"
              name="code"
              placeholder="Product code"
              className={cx('input')}
              value={newProduct.code}
              onChange={(e) =>
                setNewProduct({ ...newProduct, code: e.target.value })
              }
            />
          </div>
          <div className={cx('field')}>
            <label className={cx('label')}>Name</label>
            <input
              placeholder="Product name"
              type="text"
              name="name"
              className={cx('input')}
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <button className={cx('addBtn')} onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </div>

      <div className={cx('stats')}>
        <div className={cx('statCard')}>
          <span className={cx('statLabel')}>Products</span>
          <span className={cx('statValue')}>{stats.count}</span>
        </div>
        <div className={cx('statCard')}>
          <span className={cx('statLabel')}>Avg Price</span>
          <span className={cx('statValue')}>{formatCurrency(stats.avg)}</span>
        </div>
        <div className={cx('statCard')}>
          <span className={cx('statLabel')}>Highest</span>
          <span className={cx('statValue', 'up')}>
            {formatCurrency(stats.max)}
          </span>
        </div>
        <div className={cx('statCard')}>
          <span className={cx('statLabel')}>Lowest</span>
          <span className={cx('statValue', 'down')}>
            {formatCurrency(stats.min)}
          </span>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className={cx('tableCard')}>
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
              {pagedProducts.length === 0 ? (
                <tr>
                  <td className={cx('empty')} colSpan={columnOrder.length}>
                    No products yet
                  </td>
                </tr>
              ) : (
                pagedProducts.map((product, index) => (
                  <DraggableRow
                    key={product.id}
                    index={(page - 1) * PAGE_SIZE + index}
                    product={product}
                    moveRow={swapRows}
                    columnOrder={columnOrder}
                    trend={trends[product.id] || 'flat'}
                  />
                ))
              )}
            </tbody>
          </table>

          {sortedProducts.length > 0 && (
            <div className={cx('pagination')}>
              <span className={cx('pageInfo')}>
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, sortedProducts.length)} of{' '}
                {sortedProducts.length}
              </span>
              <div className={cx('pageControls')}>
                <button
                  className={cx('pageBtn')}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className={cx('pageNow')}>
                  {page} / {totalPages}
                </span>
                <button
                  className={cx('pageBtn')}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default Product;
