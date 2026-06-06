import { TextField, Button, Box, Stack } from '@mui/material';
import type { ProductFormData } from '../../types/product';
import { useProductForm } from './useProductForm';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialValues?: Partial<ProductFormData>;
  disabled?: boolean;
}

export function ProductForm({ onSubmit, initialValues, disabled = false }: ProductFormProps) {
  const { register, handleSubmit, errors, reset } = useProductForm(onSubmit, initialValues);

  const handleReset = () => {
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 300 }}>
      <Stack spacing={2.5}>
        <TextField
          id="name"
          label="Name"
          type="text"
          fullWidth
          disabled={disabled}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
          inputProps={{
            'aria-label': 'Product name',
          }}
        />

        <TextField
          id="sku"
          label="SKU"
          type="text"
          fullWidth
          disabled={disabled}
          error={!!errors.sku}
          helperText={errors.sku?.message}
          {...register('sku')}
          inputProps={{
            'aria-label': 'Product SKU',
          }}
        />

        <TextField
          id="price"
          label="Price"
          type="number"
          fullWidth
          disabled={disabled}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price')}
          inputProps={{
            step: '0.01',
            'aria-label': 'Product price',
          }}
        />

        <TextField
          id="stockQuantity"
          label="Stock Quantity"
          type="number"
          fullWidth
          disabled={disabled}
          error={!!errors.stockQuantity}
          helperText={errors.stockQuantity?.message}
          {...register('stockQuantity')}
          inputProps={{
            'aria-label': 'Stock quantity',
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            variant="outlined"
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={disabled}
            variant="contained"
            color="primary"
          >
            {disabled ? 'Saving...' : (initialValues ? 'Update' : 'Create')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
