import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGetCurrentUserProfileData, IGetUserInfoProfileData } from '../type/data';

export interface ProfileState {
  userInfo: IGetUserInfoProfileData | null;
  currentUser: IGetCurrentUserProfileData | null;
  lockMembershipPopup: boolean;
}

const initialState: ProfileState = {
  currentUser: null,
  userInfo: null,
  lockMembershipPopup: false,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentUser: (
      state: ProfileState,
      action: PayloadAction<IGetCurrentUserProfileData>
    ) => {
      state.currentUser = action.payload;
    },
    setUserInfo: (state: ProfileState, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setMembershipPopup: (state, action: PayloadAction<boolean>) => {
      state.lockMembershipPopup = action.payload;
    },
  },
});

export const { setUserInfo, setCurrentUser, setMembershipPopup } = profileSlice.actions;

export default profileSlice.reducer;
