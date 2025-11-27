import { useDispatch, useSelector, useStore, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState, store } from '@/store/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector.withTypes<RootState>();

export const useAppStore = useStore.withTypes<typeof store>();
