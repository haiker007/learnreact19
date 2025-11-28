import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '@/components/AdminLayout/AdminLayout';
import LoginPage from '@/pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // The AdminLayout will handle all content rendering via Tabs
    path: '/',
    element: <AdminLayout />,
    // We remove children routes because the component will be loaded internally.
    // We keep a single index redirect for initial landing.
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '*',
        element: <h1>404 Not Found</h1>,
      },
    ],
  },
]);

export default router;
