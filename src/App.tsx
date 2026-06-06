import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './auth/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { RegisterPage } from './components/Auth/RegisterPage';
import { ReportsPage } from './components/Reports/ReportsPage';
import { Navigation } from './components/Navigation';
import { ProductManagement } from './components/ProductManagement';
import { SalesManagement } from './components/SalesManagement';
import { FinancialDashboard } from './components/Dashboard/FinancialDashboard';
import { ExpenseManagementContainer } from './components/Expenses/ExpenseManagementContainer';

function AppShell() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box className="app">
      {!isAuthRoute && <Navigation />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/financial" element={<FinancialDashboard />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/financial/expenses" element={<ExpenseManagementContainer />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;
