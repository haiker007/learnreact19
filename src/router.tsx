import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '@/components/AdminLayout/AdminLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import SettingsPage from '@/pages/SettingsPage';
import UserPage from '@/pages/UserPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/users',
        element: <UserPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '*',
        element: <h1>404 Not Found</h1>,
      },
    ],
  },
]);

export default router;
