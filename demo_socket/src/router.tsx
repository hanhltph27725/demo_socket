import { UrlInternal } from '@/constants/url-internal';
import Product from './pages/Product/Product';
import PrivateRoute from './guards/PrivateRoute';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';

export const routes = {
  HOME_PAGE: {
    url: UrlInternal.HOME,
    element: <Home />,
  },
  PRODUCT_PAGE: {
    url: UrlInternal.PRODUCT,
    element: (
      <PrivateRoute>
        <Product />
      </PrivateRoute>
    ),
  },
  CHAT_PAGE: {
    url: UrlInternal.CHAT,
    element: <Chat />,
  },
};
