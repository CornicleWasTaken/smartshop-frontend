import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { verifyManager } from '../../services/authApi';

interface ManagerOverrideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (elevatedToken: string) => void;
}

/**
 * Prompts the current user to re-enter their password and, when they are a
 * manager or admin, exchanges it for a short-lived token carrying the OVERRIDE
 * authority. The elevated token is returned via {@link onSuccess} and must be
 * kept transient — it is never persisted.
 */
export function ManagerOverrideDialog({ isOpen, onClose, onSuccess }: ManagerOverrideDialogProps) {
  const [password, setPassword] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reset = React.useCallback(() => {
    setPassword('');
    setError(null);
    setIsVerifying(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsVerifying(true);
    try {
      const response = await verifyManager(password);
      reset();
      onSuccess(response.accessToken);
    } catch {
      setError('Password verification failed. You may not be authorized to override.');
      setIsVerifying(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <SecurityIcon
              sx={{
                color: 'primary.main',
                fontSize: 28,
              }}
            />
            <Typography variant="h6" component="span" sx={{ color: 'text.primary' }}>
              Confirm Manager Access
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Re-enter your password to temporarily authorize this action.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            fullWidth
            autoComplete="current-password"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isVerifying}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isVerifying || !password}
          >
            {isVerifying ? 'Verifying...' : 'Confirm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
