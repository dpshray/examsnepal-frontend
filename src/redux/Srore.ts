import {configureStore} from '@reduxjs/toolkit';
import playersReducer from './slices/playerSlice';

import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['players'],
};
export const store = configureStore({
    reducer: {
        players: playersReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
