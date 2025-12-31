import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
// Define the "Tag Types" for cache invalidation (e.g., when you add a User, invalidate the 'User' list)
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    // AUTO-AUTH: This automatically adds the JWT token to every request
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Global tag types (add more as you build features)
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}), // We inject endpoints from feature folders!
});
