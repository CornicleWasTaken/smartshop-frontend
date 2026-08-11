import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  VerifyManagerResponse,
} from '../types/auth';
import { requestJson } from './apiClient';

export function login(request: LoginRequest): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  }, false);
}

export function register(request: RegisterRequest): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  }, false);
}

export function fetchCurrentUser(): Promise<AuthUser> {
  return requestJson<AuthUser>('/api/auth/me');
}

export function logoutSession(): Promise<void> {
  return requestJson<void>('/api/auth/logout', {
    method: 'POST',
  }, false);
}

/**
 * Verifies the current user's password and, when they are a manager or admin,
 * returns a fresh access token carrying the `OVERRIDE` authority. The elevated
 * token is transient — callers must not persist it.
 */
export function verifyManager(password: string): Promise<VerifyManagerResponse> {
  return requestJson<VerifyManagerResponse>('/api/auth/verify-manager', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}
