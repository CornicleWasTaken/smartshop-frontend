import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ProductForm } from '../ProductForm/ProductForm';
import type { ProductFormData } from '../../types/product';
import './ProductDialog.css';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductDialog({ isOpen, onClose, onSubmit }: ProductDialogProps) {
  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="product-dialog">
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        <ProductForm onSubmit={handleFormSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
