import type { AppRole, AuthUser, UserRoleUpdateRequest } from '../types/auth';
import { ApiError, requestJson } from './apiClient';

export { ApiError };

export function listUsers(): Promise<AuthUser[]> {
  return requestJson<AuthUser[]>('/api/users');
}

export function updateUserRole(userId: number, role: AppRole): Promise<AuthUser> {
  const body: UserRoleUpdateRequest = { role };
  return requestJson<AuthUser>(`/api/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
