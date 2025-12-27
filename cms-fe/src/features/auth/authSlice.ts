import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

const initialToken = localStorage.getItem('authToken');

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  token: initialToken,
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state: AuthState, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
      localStorage.setItem('authToken', action.payload.token);
    },
    setAuthLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state: AuthState) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isLoading = false;
      localStorage.removeItem('authToken');
    },
  },
});

export const { loginSuccess, logout, setAuthLoading } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;
