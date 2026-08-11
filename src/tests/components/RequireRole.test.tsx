import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequireRole } from '../../components/Auth/RequireRole';

vi.mock('../../auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../auth/AuthContext';
const mockedUseAuth = vi.mocked(useAuth);

describe('RequireRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children for admins regardless of the required roles', () => {
    mockedUseAuth.mockReturnValue({ role: 'ADMIN' } as never);
    render(<RequireRole roles={['MANAGER']}>secret</RequireRole>);
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('renders children when the role is one of the allowed roles', () => {
    mockedUseAuth.mockReturnValue({ role: 'MANAGER' } as never);
    render(<RequireRole roles={['MANAGER', 'CASHIER']}>secret</RequireRole>);
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('renders nothing for a role not in the allowed list', () => {
    mockedUseAuth.mockReturnValue({ role: 'CASHIER' } as never);
    render(<RequireRole roles={['MANAGER']}>secret</RequireRole>);
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('renders nothing when no role is set', () => {
    mockedUseAuth.mockReturnValue({ role: null } as never);
    render(<RequireRole roles={['ADMIN']}>secret</RequireRole>);
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });
});