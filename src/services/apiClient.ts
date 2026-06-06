export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const AUTH_TOKEN_KEY = 'ishop_access_token';

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function readErrorData(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    clearStoredAuthToken();
    return false;
  }

  try {
    const payload = (await response.json()) as { accessToken?: string };
    if (!payload.accessToken) {
      clearStoredAuthToken();
      return false;
    }

    setStoredAuthToken(payload.accessToken);
    return true;
  } catch {
    clearStoredAuthToken();
    return false;
  }
}

export async function requestJson<T>(
  url: string,
  options: RequestInit = {},
  includeAuth = true,
  retryOnUnauthorized = true,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (includeAuth) {
    const token = getStoredAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
  });

  if (!response.ok) {
    if (response.status === 401 && includeAuth && retryOnUnauthorized) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return requestJson<T>(url, options, includeAuth, false);
      }
    }

    throw new ApiError('Request failed', response.status, await readErrorData(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function buildQueryParams(params: object): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
