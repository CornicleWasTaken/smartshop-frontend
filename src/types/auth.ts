export type AppRole = 'ADMIN' | 'MANAGER' | 'CASHIER';

/**
 * Normalizes a role string from the backend. The backend already maps legacy
 * `STAFF` → `CASHIER`, but this guards against any un-normalized value so the
 * frontend never holds an unknown role.
 */
export function normalizeRole(role: string | undefined | null): AppRole {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'ADMIN';
    case 'MANAGER':
      return 'MANAGER';
    default:
      return 'CASHIER';
  }
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  role: AppRole;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface VerifyManagerResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface UserRoleUpdateRequest {
  role: AppRole;
}
