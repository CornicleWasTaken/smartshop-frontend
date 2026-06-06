import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Avatar, Box, Button, Card, CardContent, Container, Divider, FormControlLabel, Link, Stack, TextField, Typography, Checkbox, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../auth/AuthContext';
import type { LoginRequest } from '../../types/auth';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/financial';

  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(values as LoginRequest);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Card elevation={6} sx={{ borderRadius: 3, width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 3, md: 6 } }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon fontSize="medium" />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to manage products and view sales insights.
                </Typography>
              </Box>
            </Box>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  label="Username or email"
                  autoComplete="username"
                  {...registerField('identifier')}
                  error={Boolean(errors.identifier)}
                  helperText={errors.identifier?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  {...registerField('password')}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2">Remember me</Typography>} />
                  <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
                </Box>

                <Button
                  type="submit"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    py: 1.75,
                    borderRadius: 2,
                    fontWeight: 700,
                    background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: theme => theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme => theme.shadows[4],
                      opacity: 0.98,
                    },
                  }}
                  variant="contained"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Need an account?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                      Create one
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
