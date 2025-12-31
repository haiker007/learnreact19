import { useEffect } from 'react';
import { useNavigation, useActionData, useNavigate, useLocation } from 'react-router';
import { LoginView } from '@/features/auth/LoginView';

interface ActionResponse {
  error?: string;
  ok?: boolean; // New flag to signal success
}

export const LoginContainer = () => {
  const navigation = useNavigation();
  const actionData = useActionData() as ActionResponse | undefined;
  const navigate = useNavigate();
  const location = useLocation();

  // "from" defaults to "/" if not set
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (actionData?.ok) {
      // Success! Send them back to where they came from
      navigate(from, { replace: true });
    }
  }, [actionData, navigate, from]);

  const isLoading = navigation.state === 'submitting';

  return <LoginView isLoading={isLoading} error={actionData?.error} />;
};
