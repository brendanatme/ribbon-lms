import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ROLE_HOME_PATH, type Role } from '@ribbon/shared';
import { useAuth } from '@/lib/auth';
import { Button } from './ui';
import { Breadcrumbs } from './Breadcrumbs';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <CenteredMessage>Loading…</CenteredMessage>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <CenteredMessage>Loading…</CenteredMessage>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
  return <>{children}</>;
}

function CenteredMessage({ children }: { children: ReactNode }) {
  return <div className="grid min-h-screen place-items-center text-ink/50">{children}</div>;
}

const NAV: Record<Role, { to: string; label: string }[]> = {
  ADMIN: [{ to: '/admin', label: 'Users' }],
  TEACHER: [{ to: '/teacher', label: 'My Courses' }],
  STUDENT: [
    { to: '/student', label: 'Catalog' },
    { to: '/student/learning', label: 'My Learning' },
  ],
};

export function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl font-bold text-ribbon">Ribbon</span>
            <nav className="flex gap-1">
              {NAV[user.role].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm font-medium ${
                      isActive ? 'bg-ribbon-light text-ribbon' : 'text-ink/60 hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink/60">{user.name}</span>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  );
}
