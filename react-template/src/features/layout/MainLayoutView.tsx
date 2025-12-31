import React from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router'; // RR7 uses 'react-router'
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

// --- CVA STYLES ---
// We define the structural classes here to keep JSX clean
const layoutStyles = cva("min-h-screen");

const headerStyles = cva("sticky top-0 z-10 flex w-full items-center justify-between px-4 shadow-sm backdrop-blur-md", {
  variants: {
    theme: {
      light: "bg-white/80",
      dark: "bg-slate-900/80",
    }
  },
  defaultVariants: { theme: "light" }
});

const contentStyles = cva("m-4 overflow-initial rounded-lg p-6 shadow-sm transition-all", {
  variants: {
    bg: {
      default: "bg-white",
      gray: "bg-gray-50",
    }
  },
  defaultVariants: { bg: "default" }
});

// --- INTERFACE ---
interface MainLayoutViewProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  menuItems: MenuProps['items'];
  selectedKeys: string[];
  onMenuClick: (key: string) => void;
  username: string;
}

export const MainLayoutView = ({
  collapsed,
  onToggleCollapse,
  menuItems,
  selectedKeys,
  onMenuClick,
  username
}: MainLayoutViewProps) => {
  // Use AntD's token system if you need exact color matches, 
  // or just stick to Tailwind colors.
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className={layoutStyles()}>
      {/* 1. Sider: Controlled by AntD logic, styled by Tailwind props if needed */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-slate-900" // Tailwind override for Sider bg
        width={240}
      >
        <div className="flex h-16 items-center justify-center">
          {/* Logo placeholder */}
          <div className={cn("h-8 w-8 rounded bg-blue-500 transition-all", collapsed ? "w-8" : "w-32")} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => onMenuClick(key)}
          className="!bg-slate-900"
        />
      </Sider>

      <Layout>
        {/* 2. Header: Using CVA styles */}
        <Header className={headerStyles()} style={{ background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleCollapse}
            className="!h-16 !w-16"
          />

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              Hi, {username}
            </span>
            {/* Add Language Switcher or Avatar here later */}
          </div>
        </Header>

        {/* 3. Content: Where the pages render */}
        <Content className={cn("overflow-y-auto")}>
          <div className={contentStyles()}>
            {/* This is where your child routes (Dashboard, etc.) appear */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};