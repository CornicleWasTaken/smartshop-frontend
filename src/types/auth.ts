export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  role: string;
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
