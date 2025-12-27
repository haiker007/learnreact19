// src/features/tab/tabSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

// Define the shape of a single navigation item
export interface NavItem {
  key: string; // Must be unique (usually the path)
  label: string; // Text shown on the menu and tab header
  path: string; // The route path for React Router
  componentKey: string; // A key to identify which component to render
  children?: NavItem[];
  icon?: string;
}

// Define the shape of an open tab
export interface TabItem {
  key: string; // Same as NavItem.key
  label: string;
  componentKey: string;
  closable: boolean;
  icon?: string; // TODO : Define a proper type for icons
}

interface TabState {
  menuData: NavItem[]; // The full tree data for the sidebar
  activeKey: string; // The key of the currently visible tab
  openTabs: TabItem[]; // List of all open tabs
}

const initialState: TabState = {
  // Placeholder Data: You will fetch this from an API in a real app
  menuData: [
    { key: '/dashboard', label: 'menu_dashboard', icon: 'DashboardOutlined', path: '/dashboard', componentKey: 'DashboardPage' },
    { key: '/cms', label: 'menu_cms', icon: 'DashboardOutlined', path: '/cms', componentKey: 'CmsPage' },
    { key: '/models', label: 'menu_models', icon: 'DashboardOutlined', path: '/models', componentKey: 'ModelListPage' },
    { key: '/editmodels', label: 'menu_edit_models', icon: 'DashboardOutlined', path: '/editmodels', componentKey: 'DynamicEditPage' },
    {
      key: 'user-group',
      label: 'menu_users',
      path: '/users',
      icon: 'TeamOutlined',
      componentKey: 'UserGroup',
      children: [
        { key: '/users/list', label: 'menu_user_list', icon: 'UserOutlined', path: '/users/list', componentKey: 'UsersPage' },
        { key: '/users/roles', label: 'menu_user_roles', icon: 'SafetyOutlined', path: '/users/roles', componentKey: 'RolesPage' },
      ],
    },
    { key: '/settings', label: 'menu_settings', icon: 'SettingOutlined', path: '/settings', componentKey: 'SettingsPage' },
  ],
  activeKey: '/dashboard', // Start on the dashboard
  openTabs: [
    // Initialize with the default starting tab
    { key: '/dashboard', label: 'menu_dashboard', icon: 'DashboardOutlined', componentKey: 'DashboardPage', closable: false },
  ],
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    // 1. Adds a new tab and makes it active
    addTab: (state, action: PayloadAction<NavItem>) => {
      if (!state.openTabs.some((tab) => tab.key === action.payload.key)) {
        state.openTabs.push({
          key: action.payload.key,
          label: action.payload.label,
          componentKey: action.payload.componentKey,
          closable: true, // Allow closing all new tabs
          icon: action.payload.icon,
        });
      }
      state.activeKey = action.payload.key;
    },
    // 2. Removes a tab
    removeTab: (state, action: PayloadAction<string>) => {
      const targetKey = action.payload;
      const index = state.openTabs.findIndex((tab) => tab.key === targetKey);

      if (index === -1) return;

      // Logic to select the next tab if the active one is closed
      if (state.activeKey === targetKey) {
        // Find the new active key (the one before or after the closed tab)
        const newActiveKey = state.openTabs[index + 1]?.key || state.openTabs[index - 1]?.key || '/dashboard';
        state.activeKey = newActiveKey;
      }

      // Filter out the closed tab
      state.openTabs = state.openTabs.filter((tab) => tab.key !== targetKey);
    },
    // 3. Changes the active tab
    setActiveKey: (state, action: PayloadAction<string>) => {
      state.activeKey = action.payload;
    },
  },
});

export const { addTab, removeTab, setActiveKey } = tabSlice.actions;

// Selectors
export const selectMenuData = (state: RootState) => state.tab.menuData;
export const selectOpenTabs = (state: RootState) => state.tab.openTabs;
export const selectActiveKey = (state: RootState) => state.tab.activeKey;

export default tabSlice.reducer;
