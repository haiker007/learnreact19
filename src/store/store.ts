import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '@/features/example/exampleSlice';
import authReducer from '@/features/auth/authSlice';
import tabReducer from '@/features/tab/tabSlice';
// import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
    tab: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
