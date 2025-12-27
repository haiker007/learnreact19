import { Button, Layout, Menu, Select, Space, Tabs, theme, Typography, type MenuProps, type TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DesktopOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Footer } from 'antd/es/layout/layout';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

import DashboardPage from '@/pages/DashboardPage';
import UsersPage from '@/pages/UserPage';
import SettingsPage from '@/pages/SettingsPage';
import { addTab, removeTab, selectActiveKey, selectMenuData, selectOpenTabs, setActiveKey, type NavItem } from '@/features/tab/tabSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// You would add more component imports here

// 💡 Component mapping: Maps componentKey from Redux to the actual component
const ComponentMap: { [key: string]: React.FC } = {
  DashboardPage: DashboardPage,
  UsersPage: UsersPage,
  SettingsPage: SettingsPage,
  // Add other pages here (e.g., RolesPage: RolesPage)
};

// Function to convert NavItem structure to Antd MenuItems (recursive for tree)
const getMenuItems = (items: NavItem[]): MenuProps['items'] => {
  return items.map((item) => {
    return {
      key: item.key,
      icon: item.key === '/dashboard' ? <DesktopOutlined /> : null, // Add icons as needed
      label: item.label,
      children: item.children ? getMenuItems(item.children) : undefined,
    };
  });
};
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redux hooks
  const dispatch = useAppDispatch();
  const menuData = useAppSelector(selectMenuData);
  const openTabs = useAppSelector(selectOpenTabs);
  const activeKey = useAppSelector(selectActiveKey);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. Sync Redux activeKey with browser URL
  useEffect(() => {
    const currentTab = openTabs.find((tab) => tab.key === activeKey);
    if (currentTab && location.pathname !== currentTab.key) {
      navigate(currentTab.key);
    }
  }, [activeKey, navigate, openTabs, location.pathname]);
  // 2. Handle Menu Click (Navigation)
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // Find the NavItem object from the menuData (recursive search needed)
    const findNavItem = (items: NavItem[]): NavItem | undefined => {
      for (const item of items) {
        if (item.key === e.key) {
          return item;
        }
        if (item.children) {
          const found = findNavItem(item.children);
          if (found) return found;
        }
      }
    };
    const navItem = findNavItem(menuData);

    if (navItem && navItem.componentKey) {
      dispatch(addTab(navItem));
    }
  };
  // 3. Handle Tab Change
  const onTabChange = (key: string) => {
    dispatch(setActiveKey(key));
  };
  // 4. Handle Tab Remove
  const onEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      dispatch(removeTab(targetKey));
    }
  };
  // 5. Render Tab Content
  const renderTabContent = (key: string, componentKey: string) => {
    const Component = ComponentMap[componentKey];
    if (Component) {
      return (
        // The component is rendered here.
        // We ensure we only render the content for the active tab.
        <div key={key}>
          <Component />
        </div>
      );
    }
    return <div>Component not found for key: {componentKey}</div>;
  };

  const { i18n } = useTranslation();

  // const menuItems: MenuItem[] = [
  //   { key: '/dashboard', icon: <DesktopOutlined />, label: t('welcome_message') },
  //   { key: '/users', icon: <UserOutlined />, label: t('user_management') },
  //   { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  // ];

  // const selectedKey = location.pathname;

  // const handleMenuClick: MenuProps['onClick'] = (e) => {
  //   navigate(e.key);
  // };

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!collapsed && (
            <Title level={5} style={{ color: 'white', margin: 0 }}>
              Admin UI
            </Title>
          )}
        </div>
        {/* <Menu
          theme="dark"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        /> */}
        <Menu theme="dark" selectedKeys={[activeKey]} mode="inline" items={getMenuItems(menuData)} onClick={handleMenuClick} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Space>
            <Typography.Text strong>Welcome, Admin!</Typography.Text>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
            <Select
              defaultValue={i18n.language}
              onChange={changeLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
              ]}
            />
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          {/* <div
            id="content-area"
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div> */}
          <Tabs
            type="editable-card"
            onChange={onTabChange}
            activeKey={activeKey}
            onEdit={onEdit}
            hideAdd // Hide the default Antd '+' add button
            items={openTabs.map((tab) => ({
              key: tab.key,
              label: tab.label,
              closable: tab.closable,
              // Tab content is rendered here. Antd handles rendering only the active pane.
              children: (
                <div
                  style={{
                    padding: 24,
                    minHeight: '80vh',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  {renderTabContent(tab.key, tab.componentKey)}
                </div>
              ),
            }))}
          />
        </Content>

        <Footer style={{ textAlign: 'center' }}>Admin Dashboard @{new Date().getFullYear()} Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
