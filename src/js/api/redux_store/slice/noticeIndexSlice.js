import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    noticeIndexState: 0,
};

const noticeIndexSlice = createSlice({
    name: 'noticeIndex',
    initialState,
    reducers: {
        setNoticeIndexState: (state, action) => {
            state.noticeIndexState = action.payload;
        },
    },
});

export const noticeIndexAction = noticeIndexSlice.actions;
export default noticeIndexSlice.reducer;
