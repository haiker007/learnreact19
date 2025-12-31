import { type ActionFunctionArgs } from 'react-router';
import { store } from '@/store/store';
import { setCredentials } from '@/features/auth/authSlice';

// 1. Mock API (Replace with real fetch later)
const loginApi = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay

  if (password === 'error') throw new Error('Invalid credentials');

  return {
    user: { id: '1', name: 'Admin User', email },
    token: 'fake-jwt-token-123',
  };
};

// 2. The Router Action (Runs on Server or Client before rendering)
export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const data = await loginApi(email, password);

    // Dispatch to Redux (Yes, you can dispatch from loaders/actions!)
    store.dispatch(setCredentials(data));

    // Redirect to dashboard on success
    return { ok: true };
  } catch {
    // Return errors to the component
    return { error: 'Invalid email or password' };
  }
};
