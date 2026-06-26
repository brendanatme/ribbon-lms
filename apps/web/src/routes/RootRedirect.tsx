import { Navigate } from 'react-router-dom';
import { ROLE_HOME_PATH } from '@ribbon/shared';
import { useAuth } from '../lib/auth.js';

export function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-ink/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
}
