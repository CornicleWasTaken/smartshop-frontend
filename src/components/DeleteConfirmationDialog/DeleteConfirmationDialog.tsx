import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, productName, isDeleting = false }: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <WarningIcon
            sx={{
              color: 'warning.main',
              fontSize: 28,
            }}
          />
          <Typography variant="h6" component="span" sx={{ color: 'text.primary' }}>
            Confirm Delete
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          Are you sure you want to delete the product{' '}
          <Box component="strong" sx={{ color: 'warning.main' }}>
            "{productName}"
          </Box>
          ?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={isDeleting}
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
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
