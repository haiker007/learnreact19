import { HomeLayout } from '@/components/HomeLayout';
import type { MenuProps } from 'antd';
import { Outlet } from 'react-router';
import { cn } from '@/utils/cn';

interface HomeLayoutViewProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    menuItems: MenuProps['items'];
    selectedKeys: string[];
    onMenuClick: (key: string) => void;
    username: string;
}

export const HomeLayoutView = ({
    collapsed,
    onToggleCollapse,
    menuItems,
    selectedKeys,
    onMenuClick,
    username,
}: HomeLayoutViewProps) => {
    // Logo Component
    const Logo = (
        <div className={cn('flex items-center gap-2 overflow-hidden whitespace-nowrap font-display font-bold text-white transition-all', collapsed ? 'justify-center' : 'px-2')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <span className="text-lg text-white">A</span>
            </div>
            {!collapsed && <span className="text-xl tracking-tight opacity-100 transition-opacity duration-300">AdminPanel</span>}
        </div>
    );

    // Header Right Content
    const HeaderRight = (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100 transition-colors hover:bg-gray-100 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm border border-indigo-200">
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{username}</span>
            </div>
        </div>
    );

    return (
        <HomeLayout
            collapsed={collapsed}
            onToggleCollapse={onToggleCollapse}
            menuItems={menuItems}
            selectedKeys={selectedKeys}
            onMenuClick={onMenuClick}
            logo={Logo}
            headerRight={HeaderRight}
        >
            <Outlet />
        </HomeLayout>
    );
};
