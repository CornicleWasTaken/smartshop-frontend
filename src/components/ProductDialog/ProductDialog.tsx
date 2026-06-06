import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ProductForm } from '../ProductForm/ProductForm';
import type { ProductFormData, Product } from '../../types/product';
import type { ProductDialogMode } from '../../types/product';

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
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
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
      <DialogTitle
        sx={{
          color: 'text.primary',
          fontWeight: 600,
          fontSize: '1.25rem',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <ProductForm onSubmit={handleFormSubmit} initialValues={initialValues} disabled={isSubmitting} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
