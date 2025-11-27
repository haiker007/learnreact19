import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

interface ExampleState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ExampleState = {
  value: 0,
  status: 'idle',
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
  },
});

export const { increment, decrement, incrementByAmount, setLoading } = exampleSlice.actions;
export const selectCount = (state: RootState) => state.example.value;
export default exampleSlice.reducer;
