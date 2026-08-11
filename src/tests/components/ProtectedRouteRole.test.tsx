import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';

vi.mock('../../auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../auth/AuthContext';
const mockedUseAuth = vi.mocked(useAuth);

function renderAtUsers() {
  return render(
    <MemoryRouter initialEntries={['/users']}>
      <Routes>
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/users" element={<div>Secret users page</div>} />
        </Route>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute with requiredRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the outlet for an admin', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      role: 'ADMIN',
    } as never);
    renderAtUsers();
    expect(screen.getByText('Secret users page')).toBeInTheDocument();
  });

  it('redirects a non-admin manager to the app root', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      role: 'MANAGER',
    } as never);
    renderAtUsers();
    expect(screen.queryByText('Secret users page')).not.toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('redirects a cashier to the app root', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      role: 'CASHIER',
    } as never);
    renderAtUsers();
    expect(screen.queryByText('Secret users page')).not.toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('redirects an unauthenticated user to login', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      role: null,
    } as never);
    renderAtUsers();
    expect(screen.queryByText('Secret users page')).not.toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});