import { Button, Layout, Menu, Select, Space, theme, Typography, type MenuProps } from 'antd';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DesktopOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Footer } from 'antd/es/layout/layout';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// import { changeLanguage } from 'i18next';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const menuItems: MenuItem[] = [
    { key: '/dashboard', icon: <DesktopOutlined />, label: t('welcome_message') },
    { key: '/users', icon: <UserOutlined />, label: t('user_management') },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKey = location.pathname;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
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
          <div
            id="content-area"
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Admin Dashboard @{new Date().getFullYear()} Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
