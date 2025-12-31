import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

import { MainLayoutView } from '@/features/layout/MainLayoutView';
import { useAppSelector } from '@/store/hooks'; // Your typed hook

export const MainLayoutContainer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  // Example: Get user from Redux (assuming you have an auth slice later)
  const user = useAppSelector((state) => state.auth.user);
  const username = 'Admin User'; // Placeholder

  // Define Menu Items
  // We define them here (Logic layer) because they involve routing logic/permissions
  const items: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('menu.dashboard'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: t('menu.users'),
    },
    // {
    //   key: '/settings',
    //   icon: <SettingOutlined />,
    //   label: t('menu.settings'),
    // },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <MainLayoutView
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      menuItems={items}
      selectedKeys={[location.pathname]}
      onMenuClick={handleMenuClick}
      username={username}
    />
  );
};
