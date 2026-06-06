import { AppBar, Box, Button, Chip, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getTabValue = () => {
    if (location.pathname === '/sales') return 'sales';
    if (location.pathname.startsWith('/financial')) return 'financial';
    if (location.pathname.startsWith('/reports')) return 'reports';
    return 'products';
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: 2,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: 'text.primary',
          }}
        >
          iShop
        </Typography>
        <Tabs
          value={getTabValue()}
          sx={{
            ml: 'auto',
            '& .MuiTab-root': {
              color: 'text.secondary',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: 'text.primary',
              },
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Tab
            label="Products"
            value="products"
            component={Link}
            to="/"
          />
          <Tab
            label="Sales"
            value="sales"
            component={Link}
            to="/sales"
          />
          <Tab
            label="Financial"
            value="financial"
            component={Link}
            to="/financial"
          />
            <Tab
              label="Reports"
              value="reports"
              component={Link}
              to="/reports"
            />
        </Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && <Chip size="small" label={user.username} />}
          <Button variant="outlined" onClick={logout} sx={{ whiteSpace: 'nowrap' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
