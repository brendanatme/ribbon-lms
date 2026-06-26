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

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

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

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message ?? 'Request failed', data.code, data.issues);
  }
  return data as T;
}

export const api = {
  get: <T = unknown>(path: string): Promise<T> => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('POST', path, body),
  patch: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('PATCH', path, body),
  del: <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('DELETE', path, body),
};
