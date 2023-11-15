import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adminState: false,
    adminGrade: 0,
    adminAccount: '',
};

const adminLoginSlice = createSlice({
    name: 'adminLogin',
    initialState,
    reducers: {
        setAdminState: (state, action) => {
            state.adminState = action.payload;
        },
        setAdminGrade: (state, action) => {
            state.adminGrade = action.payload;
        },
        setAdminAccount: (state, action) => {
            state.adminAccount = action.payload;
        },
    },
});

export const adminStateAction = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
