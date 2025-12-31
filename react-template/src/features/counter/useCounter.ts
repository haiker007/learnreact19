import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { increment, selectCount } from './counterSlice';

export const useCounter = () => {
  const dispatch = useAppDispatch();

  // TypeScript knows 'count' is a number automatically!
  const count = useAppSelector((state) => state.counter.value);
  // Or if you use memoized selectors:
  // const count = useAppSelector(selectCount);

  const handleIncrement = () => {
    dispatch(increment());
  };

  return { count, handleIncrement };
};
