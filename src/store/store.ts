import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '@/features/example/exampleSlice';
import authReducer from '@/features/example/exampleSlice';
// import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
