import { useUpdateUserMutation, type User } from '@/features/users/usersApi';

export const UserItem = ({ user }: { user: User }) => {
  const [updateUser] = useUpdateUserMutation();

  const handleRename = (newName: string) => {
    // UI updates INSTANTLY when this is called
    updateUser({ id: user.id, name: newName });
  };

  return <input defaultValue={user.name} onBlur={(e) => handleRename(e.target.value)} />;
};
