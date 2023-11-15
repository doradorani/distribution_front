import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userProfile: '',
    userName: '',
    userPreNickname: '',
    userNickname: '',
    userEmail: '',
    userPhone: '',
    userZipcode: '',
    userAddress: '',
    userDetailAddress: '',
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userProfile = action.payload.userProfile;
            state.userName = action.payload.userName;
            state.userPreNickname = action.payload.userPreNickname;
            state.userNickname = action.payload.userNickname;
            state.userEmail = action.payload.userEmail;
            state.userPhone = action.payload.userPhone;
            state.userZipcode = action.payload.userZipcode;
            state.userAddress = action.payload.userAddress;
            state.userDetailAddress = action.payload.userDetailAddress;
        },
    },
});

export const userInfoAction = userInfoSlice.actions;
export default userInfoSlice.reducer;
