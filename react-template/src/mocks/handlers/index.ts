import { userHandlers } from '@/mocks/handlers/userHandlers';
import { dashboardHandlers } from '@/mocks/handlers/dashboardHandlers';
// import { authHandlers } from './authHandlers';

// Combine all handlers into one array
export const handlers = [
  ...userHandlers,
  ...dashboardHandlers,
  // ...authHandlers
];
