import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cobuyHit: [],
    cobuyFund: [],
};

const userCobuySlice = createSlice({
    name: 'userCobuy',
    initialState,
    reducers: {
        setHit: (state, action) => {
            state.cobuyHit = action.payload;
        },
        setFund: (state, action) => {
            state.cobuyFund = action.payload;
        },
    },
});

export const userCobuyAction = userCobuySlice.actions;
export default userCobuySlice.reducer;
