import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/store/api/apiSlice';
import authReducer from '@/features/auth/authSlice';
// We will add slices here later as your app grows
// import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Middleware: Default + any custom middleware (like loggers or persistence)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for non-serializable data (common with Dates/Files)
        ignoredActions: ['your/action/type'],
        ignoredPaths: ['items.dates'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
