import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import type { AppRole } from '../../types/auth';

interface ProtectedRouteProps {
  /**
   * When set, the route is only reachable by users whose role matches (admins
   * are always allowed). Mismatches are redirected to the app root.
   */
  requiredRole?: AppRole;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole && role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
