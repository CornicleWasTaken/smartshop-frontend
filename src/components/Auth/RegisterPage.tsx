import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../auth/AuthContext';
import type { RegisterRequest } from '../../types/auth';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    try {
      await register(values as RegisterRequest);
      navigate('/financial', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={4} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register to start using the protected shop dashboard.
              </Typography>
            </Box>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField label="Username" {...registerField('username')} error={Boolean(errors.username)} helperText={errors.username?.message} fullWidth />
              <TextField label="Email" type="email" autoComplete="email" {...registerField('email')} error={Boolean(errors.email)} helperText={errors.email?.message} fullWidth />
              <TextField label="First name" {...registerField('firstName')} error={Boolean(errors.firstName)} helperText={errors.firstName?.message} fullWidth />
              <TextField label="Last name" {...registerField('lastName')} error={Boolean(errors.lastName)} helperText={errors.lastName?.message} fullWidth />
              <TextField label="Password" type="password" autoComplete="new-password" {...registerField('password')} error={Boolean(errors.password)} helperText={errors.password?.message} fullWidth />
              <TextField label="Confirm password" type="password" autoComplete="new-password" {...registerField('confirmPassword')} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message} fullWidth />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
