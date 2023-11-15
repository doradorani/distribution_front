import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminTokenReducer from './slice/adminTokenSlice';
import adminStateReducer from './slice/adminLoginSlice';
import tokenReducer from './slice/tokenSlice';
import userStateReducer from './slice/userLoginSlice';
import userInfoReducer from './slice/userInfoSlice';
import userCobuyReducer from './slice/userCobuySlice';
import noticeIndexReducer from './slice/noticeIndexSlice';

const reducers = combineReducers({
    token: tokenReducer,
    userLogin: userStateReducer,
    userInfo: userInfoReducer,
    userCobuy: userCobuyReducer,
    adminToken: adminTokenReducer,
    adminLogin: adminStateReducer,
    noticeIndex: noticeIndexReducer,
});

const persistConfig = {
    key: 'root',
    storage, //storage에 redux 상태값을 저장함
    //persist 시킬 리듀서들을 넣어주기
    whitelist: ['token', 'adminToken', 'userLogin', 'adminLogin', 'userInfo', 'noticeIndex', 'userCobuy'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, //직렬화 안하겠다 설정
        }),
});
