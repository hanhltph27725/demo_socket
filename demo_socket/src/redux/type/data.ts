export interface IGetCurrentUserProfileData {
  createdDateTimeAgo: string;
  email: string;
  fullName: string;
  uuid: string;
  id: number;
  imageUrl: string;
  isActive: boolean;
  isAllowChangePassword: boolean;
  provider: string;
  verifiedPhoneNumber: boolean;
}

export interface IGetUserInfoProfileData {
  credit: {
    creditAmount: number;
    remainAmountWeek: number;
    totalAmount: number;
  };
  cash: any;
  features: {
    LIMIT_VIEW_COMPANY: string;
    LOC_CO_PHIEU_BIEN_AN_TOAN: string;
    LOC_CO_PHIEU_GIAO_DICH_NOI_BO: string;
    LOC_CO_PHIEU_NANG_CAO: string;
    PHAN_TICH_GIA_HANG_HOA: string;
    QUY_DAU_TU_QUY_NUOC_NGOAI: string;
    REWARD_STOCK: string;
    STOCK_RELATIVE_STRENGTH: string;
  };
  hasMembership: boolean;
  membershipStatus?: boolean;
  hasMembershipYear?: boolean;
  membership: {
    endDate: string;
    isExpired: boolean;
    startDate: string;
    totalAmount: number;
    type: boolean | string;
  };
}
