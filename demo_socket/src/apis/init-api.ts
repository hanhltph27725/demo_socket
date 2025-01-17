import { IResponse } from 'simplize-component';
import mainAxios from './main-axios';

enum URL {
  MEMBERSHIP_INFO = `/api/general/membership/info`,
}

const initApi = {
  getMembershipInfo: (): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.MEMBERSHIP_INFO}`);
  },
};

export default initApi;
