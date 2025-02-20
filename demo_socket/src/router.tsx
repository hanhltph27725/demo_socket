import { UrlInternal } from '@/constants/url-internal';
import Product from './pages/Product/Product';

export const routes = {
  HOME_PAGE: {
    url: UrlInternal.HOME,
    element: <Product />,
  },
};
