import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment } from '@/features/example/exampleSlice';

export function ExampleComponent() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.example.value);

  const handleIncrement = () => {
    dispatch(increment());
  };
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
