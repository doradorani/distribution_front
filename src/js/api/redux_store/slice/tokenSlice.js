import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    tokenName : '',
    tokenExpired : '',
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setTokenName: (state, action) => {
            state.tokenName = action.payload;
        },
        setTokenExpired : (state, action) => {
            state.tokenExpired = action.payload;
        }
    },
});

export const tokenAction = tokenSlice.actions;
export default tokenSlice.reducer;