import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ROLE_HOME_PATH, type UserProfile } from '@ribbon/shared';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { Button, Card, Field } from '@/components/ui';

function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl font-bold text-ribbon">Ribbon</span>
          <h1 className="mt-4 font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
        </div>
        <Card>{children}</Card>
      </div>
    </div>
  );
}

/**
 * Drives an auth form: owns the error/submitting state and the submit lifecycle
 * (prevent default → run `action` → redirect home, or surface the error).
 * Shared by login and signup, which differ only in their fields and action.
 */
function useAuthSubmit(action: (form: FormData) => Promise<UserProfile>) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await action(new FormData(e.currentTarget));
      navigate(ROLE_HOME_PATH[user.role]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return { error, submitting, onSubmit };
}

export function LoginPage() {
  const { user, login } = useAuth();
  const { error, submitting, onSubmit } = useAuthSubmit((form) =>
    login({ email: String(form.get('email')), password: String(form.get('password')) }),
  );

  if (user) return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue learning">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        New here?{' '}
        <Link to="/signup" className="font-medium text-ribbon hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function SignupPage() {
  const { user, signup } = useAuth();
  const { error, submitting, onSubmit } = useAuthSubmit((form) =>
    signup({
      name: String(form.get('name')),
      email: String(form.get('email')),
      password: String(form.get('password')),
    }),
  );

  if (user) return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;

  return (
    <AuthShell title="Create your account" subtitle="Start learning for free — no payment needed">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name" name="name" type="text" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ribbon hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
