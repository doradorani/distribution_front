import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adminTokenName: '',
    adminTokenExpired: '',
};

const adminTokenSlice = createSlice({
    name: 'adminToken',
    initialState,
    reducers: {
        setAdminTokenName: (state, action) => {
            state.adminTokenName = action.payload;
        },
        setAdminTokenExpired: (state, action) => {
            state.adminTokenExpired = action.payload;
        },
    },
});

export const adminTokenAction = adminTokenSlice.actions;
export default adminTokenSlice.reducer;
