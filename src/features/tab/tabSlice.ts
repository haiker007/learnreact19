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
}

// Define the shape of an open tab
export interface TabItem {
  key: string; // Same as NavItem.key
  label: string;
  componentKey: string;
  closable: boolean;
}

interface TabState {
  menuData: NavItem[]; // The full tree data for the sidebar
  activeKey: string; // The key of the currently visible tab
  openTabs: TabItem[]; // List of all open tabs
}

const initialState: TabState = {
  // Placeholder Data: You will fetch this from an API in a real app
  menuData: [
    { key: '/dashboard', label: 'Dashboard', path: '/dashboard', componentKey: 'DashboardPage' },
    {
      key: 'user-group',
      label: 'Users',
      path: '/users',
      componentKey: 'UserGroup',
      children: [
        { key: '/users/list', label: 'User List', path: '/users/list', componentKey: 'UsersPage' },
        { key: '/users/roles', label: 'Roles & Permissions', path: '/users/roles', componentKey: 'RolesPage' },
      ],
    },
    { key: '/settings', label: 'Settings', path: '/settings', componentKey: 'SettingsPage' },
  ],
  activeKey: '/dashboard', // Start on the dashboard
  openTabs: [
    // Initialize with the default starting tab
    { key: '/dashboard', label: 'Dashboard', componentKey: 'DashboardPage', closable: false },
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
