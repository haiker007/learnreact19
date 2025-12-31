import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  // 1. GET /api/dashboard/stats
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalUsers: 1500,
      revenue: 125000,
      activeSessions: 300,
    });
  }),

  // 2. PATCH /api/dashboard/settings
  http.patch('/api/dashboard/settings', async ({ request }) => {
    const settings = (await request.json()) as any;
    console.log('Received dashboard settings update:', settings);
    return HttpResponse.json({}, { status: 204 });
  }),
];
