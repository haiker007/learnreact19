import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { theme, type MenuProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectMenuData, selectOpenTabs, selectActiveKey, addTab, removeTab, setActiveKey, type NavItem } from '@/features/tab/tabSlice';
import DynamicIcon from '@/components/DynamicIcon';

export const useAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const menuData = useAppSelector(selectMenuData);
  const openTabs = useAppSelector(selectOpenTabs);
  const activeKey = useAppSelector(selectActiveKey);
  const removingKeyRef = useRef<string | null>(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const findNavItem = (key: string): NavItem | undefined => {
    const search = (items: NavItem[]): NavItem | undefined => {
      for (const item of items) {
        if (item.key === key) {
          return item;
        }
        if (item.children) {
          const found = search(item.children);
          if (found) {
            return found;
          }
        }
      }
    };
    return search(menuData);
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const navItem = findNavItem(url);
    return {
      key: url,
      title: navItem ? t(navItem.label) : url,
    };
  });

  useEffect(() => {
    const currentPath = location.pathname;
    if (removingKeyRef.current === currentPath) return;
    removingKeyRef.current = null;
    // Only add the tab if it is not already present
    const alreadyOpen = openTabs.some((t) => t.key === currentPath);
    if (!alreadyOpen) {
      const navItem = findNavItem(currentPath);
      if (navItem) {
        dispatch(addTab(navItem));
      }
    }
    if (activeKey !== currentPath) {
      dispatch(setActiveKey(currentPath));
    }
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const navItem = findNavItem(e.key);
    if (navItem) {
      navigate(navItem.path);
    }
  };

  const handleTabChange = (key: string) => {
    navigate(key);
  };

  const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action !== 'remove' || typeof targetKey !== 'string') return;

    // Make dashboard unclosable if it's the only tab
    if (targetKey === '/dashboard' && openTabs.length === 1) {
      return;
    }

    const wasActive = targetKey === activeKey;
    const targetIndex = openTabs.findIndex((t) => t.key === targetKey);
    if (targetIndex === -1) return;

    // Compute next active key if the removed tab is currently active
    let nextActiveKey = activeKey;
    if (wasActive) {
      removingKeyRef.current = targetKey;
      const remainingTabs = openTabs.filter((t) => t.key !== targetKey);
      if (remainingTabs.length === 0) {
        // No tabs left after removal: fallback to dashboard
        nextActiveKey = '/dashboard';
      } else {
        // Try to select the next tab at the same index, else previous
        const candidate = remainingTabs[targetIndex] || remainingTabs[targetIndex - 1] || remainingTabs[0];
        nextActiveKey = candidate.key;
      }
    }

    // Remove the tab
    dispatch(removeTab(targetKey));

    // Navigate only if we closed the active tab
    if (wasActive) {
      navigate(nextActiveKey);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getMenuItems = (items: NavItem[]): MenuProps['items'] => {
    return items.map((item) => ({
      key: item.key,
      label: t(item.label),
      icon: item.icon ? <DynamicIcon iconName={item.icon} /> : undefined,
      children: item.children ? getMenuItems(item.children) : undefined,
    }));
  };

  return {
    collapsed,
    setCollapsed,
    menuData,
    activeKey,
    openTabs,
    breadcrumbItems,
    themeToken: { colorBgContainer, borderRadiusLG },
    t,
    currentLanguage: i18n.language,
    getMenuItems,
    handleMenuClick,
    handleTabChange,
    handleTabEdit,
    handleLogout,
    changeLanguage,
  };
};
