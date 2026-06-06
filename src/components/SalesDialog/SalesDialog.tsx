import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { SaleForm } from '../SaleForm/SaleForm';
import type { Sale, SaleFormData } from '../../types/sale';
import type { SaleDialogMode } from '../../types/sale';
import type { Product } from '../../types/product';
import './SalesDialog.css';

interface SalesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: SaleDialogMode;
  sale: Sale | null;
  onSubmit: (data: SaleFormData) => void;
  isSubmitting: boolean;
  products: Product[];
  onDownloadJson: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
}

export function SalesDialog({
  isOpen,
  onClose,
  mode,
  sale,
  onSubmit,
  isSubmitting,
  products,
  onDownloadJson,
  onPrint,
}: SalesDialogProps) {

  if (mode === 'create') {
    return (
      <Dialog open={isOpen} onClose={onClose} className="sales-dialog" maxWidth="md" fullWidth>
        <DialogTitle>Create New Sale</DialogTitle>
        <DialogContent>
          <SaleForm onSubmit={onSubmit} products={products} disabled={isSubmitting} />
        </DialogContent>
      </Dialog>
    );
  }

  if (mode === 'view-details' && sale) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="sales-dialog">
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          <Box className="sale-details-content">
            <Typography variant="body1" paragraph>
              <strong>Sale ID:</strong> #{sale.saleId}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Customer Phone:</strong> {sale.customerPhone || 'N/A'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (mode === 'download-options' && sale) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="sales-dialog">
        <DialogTitle>Download Sale Record</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Sale #{sale.saleId} - {new Date(sale.saleDate).toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#1976d2' }}>
            Choose how to save the sale record:
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => onPrint(sale)} color="primary" variant="outlined">
            Print
          </Button>
          <Button onClick={() => onDownloadJson(sale)} color="primary" variant="contained">
            Save as JSON
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}
