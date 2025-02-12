import { UrlInternal } from '@/constants/url-internal';
import PageOne from './pages/PageOne';
import Product from './pages/Product/Product';

export const routes = {
  HOME_PAGE: {
    url: UrlInternal.HOME,
    element: <Product />,
  },
  PAGE_ONE: {
    url: UrlInternal.PAGE_ONE,
    element: <PageOne />,
  },
};
