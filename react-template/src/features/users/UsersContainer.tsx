import { useState } from 'react';
import { message } from 'antd';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation, // Import the hook we made earlier
} from '@/features/users/usersApi';
import { UsersView } from '@/features/users/UsersView';

export const UsersContainer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // 1. API Hooks
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [addUser, { isLoading: isCreating }] = useAddUserMutation();

  // 2. Handlers
  const handleCreateClick = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const handleSubmit = async (values: any) => {
    try {
      // unwrapping allows us to catch the error locally
      await addUser({
        ...values,
        status: 'active', // Default value logic
        lastLogin: new Date().toISOString(),
      }).unwrap();

      message.success('User created successfully');
      setDrawerOpen(false); // Close drawer on success
    } catch (error) {
      message.error('Failed to create user');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    // ... existing delete logic
  };

  return (
    <UsersView
      users={users}
      isLoading={isLoading}
      onDelete={handleDelete}
      onCreate={handleCreateClick}
      // New Props
      isDrawerOpen={isDrawerOpen}
      onCloseDrawer={handleCloseDrawer}
      onFormSubmit={handleSubmit}
      isSubmitting={isCreating}
    />
  );
};
