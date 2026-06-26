import { Navigate } from 'react-router-dom';
import { ROLE_HOME_PATH } from '@ribbon/shared';
import { useAuth } from '@/lib/auth';
import { CenteredMessage } from '@/components/ui';

export function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <CenteredMessage>Loading…</CenteredMessage>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
}
