import type { ReactNode } from 'react';
import { useAuth } from '../../auth/AuthContext';
import type { AppRole } from '../../types/auth';

interface RequireRoleProps {
  /** Roles allowed to see the children (admins are always allowed). */
  roles?: AppRole[];
  children: ReactNode;
}

/**
 * Renders children only when the current user's role is in {@link roles}
 * (or is an admin). Anything else renders nothing. Use for hiding buttons and
 * sections that require a minimum role; the backend enforces the same rule.
 */
export function RequireRole({ roles = [], children }: RequireRoleProps) {
  const { role } = useAuth();
  if (role === 'ADMIN' || (role && roles.includes(role))) {
    return <>{children}</>;
  }
  return null;
}
