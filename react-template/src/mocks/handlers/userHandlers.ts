import { http, HttpResponse } from 'msw';

// Define the Mock Database (in-memory)
const mockUsers = [
  { id: '1', name: 'Alice Admin', email: 'alice@corp.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Bob Dev', email: 'bob@corp.com', role: 'user', status: 'inactive' },
];

export const userHandlers = [
  // 1. GET /api/users
  http.get('/api/users', () => {
    // You can add artificial delay to test loading states
    // await delay(500);
    return HttpResponse.json(mockUsers);
  }),

  // 2. POST /api/users (Create)
  http.post('/api/users', async ({ request }) => {
    console.log(`Creating new user...`);
    const newUser = (await request.json()) as any;
    newUser.id = Math.random().toString(36).substring(7); // Fake ID
    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),
];
