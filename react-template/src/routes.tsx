import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { MainLayoutContainer } from '@/features/layout/MainLayoutContainer';
import { HomeLayoutContainer } from '@/features/layout/HomeLayoutContainer';
import { LoginContainer } from '@/features/auth/LoginContainer';
import { UsersContainer } from '@/features/users/UsersContainer';
import { loginAction } from '@/features/auth/auth.route';
import { DashboardContainer } from '@/features/dashboard/DashboardContainer';
import { dashboardAction, dashboardLoader } from './features/dashboard/dashboard.route';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginContainer />,
    action: loginAction, // <-- Connects the Form to the Logic
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    // ErrorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <MainLayoutContainer />,
        children: [
          {
            index: true,
            element: <DashboardContainer />,
            // loader: dashboardLoader,
            action: dashboardAction,
          },
          {
            path: 'users',
            element: <UsersContainer />,
          },
        ],
      },
    ],
  },
  {
    path: '/home',
    element: <HomeLayoutContainer />,
  },
]);
