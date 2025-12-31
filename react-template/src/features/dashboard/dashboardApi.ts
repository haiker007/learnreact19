import { apiSlice } from '@/store/api/apiSlice';

export interface DashboardStats {
  totalUsers: number;
  revenue: number;
  activeSessions: number;
}

export interface DashboardSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

// Inject endpoints into the main API slice
export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET User Profile
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),

    // 2. PATCH User Profile
    updateDashboardSettings: builder.mutation<void, DashboardSettings>({
      query: (body) => ({
        url: '/dashboard/settings',
        method: 'PATCH',
        body,
      }),
      // Invalidate so any UI depending on settings updates immediately
      invalidatesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false, // Prevent errors in hot-reloading
});

// Export hooks for usage in Components (Container)
export const { useGetDashboardStatsQuery, useUpdateDashboardSettingsMutation } = dashboardApi;
