import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userState : false,
};

const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState,
    reducers: {
        setState: (state, action) => {
            state.userState = action.payload;
        },
    },
});

export const userStateAction = userLoginSlice.actions;
export default userLoginSlice.reducer;