import { store } from '@/store/store';
import { usersApi } from '@/features/users/usersApi';

export const usersLoader = async () => {
  // Initiate the fetch in the router
  store.dispatch(usersApi.endpoints.getUsers.initiate());
  return null;
};
