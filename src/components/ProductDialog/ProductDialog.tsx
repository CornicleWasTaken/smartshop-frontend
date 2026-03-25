import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ProductForm } from '../ProductForm/ProductForm';
import type { ProductFormData, Product } from '../../types/product';
import type { ProductDialogMode } from '../../types/product';
import './ProductDialog.css';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  mode?: ProductDialogMode;
  product?: Product;
  isSubmitting?: boolean;
}

export function ProductDialog({ isOpen, onClose, onSubmit, mode = 'create', product, isSubmitting = false }: ProductDialogProps) {
  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    onClose();
  };

  const initialValues: Partial<ProductFormData> | undefined = product ? {
    name: product.name,
    sku: product.sku,
    price: product.price.toString(),
    stockQuantity: product.stockQuantity.toString(),
  } : undefined;

  const title = mode === 'edit' ? 'Edit Product' : 'Create New Product';

  return (
    <Dialog open={isOpen} onClose={onClose} className="product-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ProductForm onSubmit={handleFormSubmit} initialValues={initialValues} disabled={isSubmitting} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
