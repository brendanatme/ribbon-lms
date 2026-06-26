export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public issues?: unknown,
  ) {
    super(message);
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Called whenever an authenticated request is rejected with 401 (typically an
// expired token). The auth layer registers a handler that clears the session so
// the route guards redirect to login, instead of leaving the user stranded on a
// cryptic error. Skipped for the login/signup calls, which surface 401s inline.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

const AUTH_PATHS = ['/auth/login', '/auth/signup'];

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  // An empty body (e.g. a controller returning `null`/`void`) is not valid JSON;
  // parse only when there's something to parse so it doesn't masquerade as `{}`.
  const text = await res.text();
  let data: { message?: string; code?: string; issues?: unknown } = {};
  if (text !== '') {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!res.ok) {
    // An expired/invalid token on a normal request means the session is gone;
    // hand off to the auth layer to log out and redirect (but not for the
    // login/signup endpoints, where 401 just means bad credentials).
    if (res.status === 401 && !AUTH_PATHS.includes(path)) onUnauthorized?.();
    throw new ApiError(res.status, data.message ?? 'Request failed', data.code, data.issues);
  }

  if (text === '') return undefined as T;
  return data as T;
}

export const api = {
  get: <T = unknown>(path: string): Promise<T> => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('PUT', path, body),
  patch: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('PATCH', path, body),
  del: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('DELETE', path, body),
};
