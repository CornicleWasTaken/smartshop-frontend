import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import './DeleteConfirmationDialog.css';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, productName, isDeleting = false }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="delete-confirmation-dialog" maxWidth="xs" fullWidth>
      <DialogTitle className="delete-dialog-title">
        <Box className="delete-dialog-header">
          <WarningIcon className="delete-dialog-icon" />
          <Typography variant="h6" component="span">
            Confirm Delete
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent className="delete-dialog-content">
        <Typography variant="body1">
          Are you sure you want to delete the product <strong>"{productName}"</strong>?
        </Typography>
        <Typography variant="body2" className="delete-dialog-warning">
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions className="delete-dialog-actions">
        <Button onClick={onClose} className="delete-dialog-cancel-btn" disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={onConfirm} className="delete-dialog-confirm-btn" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
