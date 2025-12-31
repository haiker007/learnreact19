import { apiSlice } from '@/store/api/apiSlice';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

// "Inject" endpoints into the main apiSlice
export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
      // Mock data transform for dev (remove this transform when you have a real API)
      // transformResponse: () =>
      //   [
      //     { id: '1', name: 'Alice Admin', email: 'alice@company.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
      //     { id: '2', name: 'Bob User', email: 'bob@company.com', role: 'user', status: 'inactive', lastLogin: '2023-12-20' },
      //   ] as User[],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Mutation: POST/PUT/DELETE
    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      // When this succeeds, look for any active query providing 'User' and kill it
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      // 1. The Network Request (Standard)
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),

      // 2. The Optimistic Logic (Magic happens here)
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // STEP A: Optimistically update the 'getUsers' cache
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
            // 'draft' is the current cached list of users.
            // We can mutate it directly (thanks to Immer inside RTK).
            const user = draft.find((u) => u.id === id);
            if (user) {
              Object.assign(user, patch); // Apply the new name/role immediately
            }
          }),
        );

        try {
          // STEP B: Wait for the actual server response
          await queryFulfilled;
        } catch {
          // STEP C: If server fails, Undo the optimistic change
          patchResult.undo();
        }
      },
      // Note: We typically DON'T invalidate tags here, because we already updated the cache manually!
    }),
  }),
});

// Auto-generated hooks!
export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
