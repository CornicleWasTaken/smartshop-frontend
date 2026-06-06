import React from 'react';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from '../services/apiClient';
import { fetchCurrentUser, login as loginRequest, logoutSession, register as registerRequest } from '../services/authApi';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<AuthResponse>;
  register: (request: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(() => getStoredAuthToken());
  const [isLoading, setIsLoading] = React.useState(true);

  const persistSession = React.useCallback((response: AuthResponse) => {
    setStoredAuthToken(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const currentUser = await fetchCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          clearStoredAuthToken();
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [persistSession]);

  const login = React.useCallback(async (request: LoginRequest) => {
    const response = await loginRequest(request);
    persistSession(response);
    return response;
  }, [persistSession]);

  const register = React.useCallback(async (request: RegisterRequest) => {
    const response = await registerRequest(request);
    persistSession(response);
    return response;
  }, [persistSession]);

  const logout = React.useCallback(() => {
    clearStoredAuthToken();
    setToken(null);
    setUser(null);
    void logoutSession().catch(() => undefined);
  }, []);

  const value = React.useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
  }), [user, token, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
