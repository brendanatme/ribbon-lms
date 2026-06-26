import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthResponse, LoginInput, SignupInput, UserProfile } from '@ribbon/shared';
import { api, setAccessToken, setUnauthorizedHandler } from './api';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<UserProfile>;
  signup: (input: SignupInput) => Promise<UserProfile>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from a token persisted across reloads.
  useEffect(() => {
    const saved = sessionStorage.getItem('ribbon_token');
    if (!saved) {
      setLoading(false);
      return;
    }
    setAccessToken(saved);
    api
      .get<UserProfile>('/auth/me')
      .then(setUser)
      .catch(() => {
        sessionStorage.removeItem('ribbon_token');
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // A 401 on any authenticated request means the token expired or is invalid:
  // clear the session so the route guards send the user back to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      sessionStorage.removeItem('ribbon_token');
      setAccessToken(null);
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  function applyAuth(res: AuthResponse) {
    setAccessToken(res.accessToken);
    sessionStorage.setItem('ribbon_token', res.accessToken);
    setUser(res.user);
    return res.user;
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (input) => applyAuth(await api.post<AuthResponse>('/auth/login', input)),
      signup: async (input) => applyAuth(await api.post<AuthResponse>('/auth/signup', input)),
      logout: () => {
        setAccessToken(null);
        sessionStorage.removeItem('ribbon_token');
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
