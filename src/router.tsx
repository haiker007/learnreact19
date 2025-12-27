import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';

import AdminLayout from '@/components/AdminLayout/AdminLayout';
import SuspenseWrapper from '@/components/SuspenseWrapper';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/pages/UserPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const CmsPage = lazy(() => import('@/pages/CmsPage'));
const ModelListPage = lazy(() => import('@/pages/ModelListPage'));
const DynamicEditPage = lazy(() => import('@/pages/DynamicEditPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'cms',
        element: (
          <SuspenseWrapper loadingKey="loading">
            <CmsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'models',
        element: (
          <SuspenseWrapper loadingKey="loading">
            <ModelListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'editmodels',
        element: (
          <SuspenseWrapper loadingKey="loading">
            <DynamicEditPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper loadingKey="loading">
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            element: (
              <SuspenseWrapper>
                <UsersPage />
              </SuspenseWrapper>
            ),
          },
          // Add other user sub-routes here matching your menuData
        ],
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: <h1>404 Not Found</h1>,
      },
    ],
  },
]);

export default router;
