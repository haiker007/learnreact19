import { Breadcrumb, Button, Layout, Menu, Select, Space, Tabs, Typography } from 'antd';
import { useAdminLayout } from '@/components/AdminLayout/useAdminLayout';
import { LogoutOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import DynamicIcon from '@/components/DynamicIcon';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AdminLayout: React.FC = () => {
  const {
    collapsed,
    setCollapsed,
    menuData,
    activeKey,
    openTabs,
    breadcrumbItems,
    themeToken,
    t,
    currentLanguage,
    getMenuItems,
    handleMenuClick,
    handleTabChange,
    handleTabEdit,
    handleLogout,
    changeLanguage,
  } = useAdminLayout();
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
        <Menu theme="dark" selectedKeys={[activeKey]} mode="inline" items={getMenuItems(menuData)} onClick={handleMenuClick} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Breadcrumb items={breadcrumbItems} />
          <Space>
            <Text strong>Welcome, Admin!</Text>
            <Select
              defaultValue={currentLanguage}
              onChange={changeLanguage}
              options={[
                { value: 'cn', label: '简体中文' },
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
                { value: 'ru', label: 'Россия' },
                { value: 'es', label: 'Español' },
                { value: 'tw', label: '繁體中文' },
              ]}
              style={{ width: 100 }}
            />
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              {t('logout_button', 'Logout')}
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <Tabs
            type="editable-card"
            hideAdd
            onChange={handleTabChange}
            activeKey={activeKey}
            onEdit={handleTabEdit}
            items={openTabs.map((tab) => ({
              key: tab.key,
              label: t(tab.label),
              closable: tab.closable,
              // We do NOT render the content here because we want to use Router Outlet
              // This keeps the Tabs pure navigation
              children: null,
              icon: tab.icon ? <DynamicIcon iconName={tab.icon} /> : undefined,
            }))}
            style={{ marginBottom: -16, zIndex: 1 }}
          />
          {/* Main Content Area via Router */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: themeToken.colorBgContainer,
              borderRadius: themeToken.borderRadiusLG,
              borderTopLeftRadius: 0, // Visual tweak to merge with tabs
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
