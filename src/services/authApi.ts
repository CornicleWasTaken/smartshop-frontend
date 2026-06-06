import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
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
