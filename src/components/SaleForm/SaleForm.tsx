import type { SaleFormData } from '../../types/sale';
import type { Product } from '../../types/product';
import { useSaleForm } from './useSaleForm';
import { Controller } from 'react-hook-form';
import { TextField, IconButton, Box, Typography, Autocomplete } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import './SaleForm.css';

interface SaleFormProps {
  onSubmit: (data: SaleFormData) => void;
  products: Product[];
  disabled?: boolean;
}

export function SaleForm({ onSubmit, products, disabled = false }: SaleFormProps) {
  const { register, handleSubmit, errors, fields, handleAddItem, handleRemoveItem, setValue, control } = useSaleForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      <div className="form-field">
        <label htmlFor="customerPhone">Customer Phone (optional)</label>
        <TextField
          id="customerPhone"
          type="text"
          {...register('customerPhone')}
          disabled={disabled}
          fullWidth
          variant="outlined"
          error={!!errors.customerPhone}
          helperText={errors.customerPhone?.message}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#2a2a2a',
              color: '#1976d2',
              '& fieldset': {
                borderColor: errors.customerPhone ? '#f44336' : '#555',
              },
              '&:hover fieldset': {
                borderColor: errors.customerPhone ? '#f44336' : '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
              '& input::placeholder': {
                color: '#ccc',
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#f44336',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#ccc',
            },
          }}
        />
      </div>

      <Box className="items-section">
        <Typography variant="subtitle1" gutterBottom>
          Items
        </Typography>

        {products.length === 0 && (
          <Typography color="text.secondary" sx={{ color: '#ccc', py: 1 }}>
            No products available
          </Typography>
        )}

        {fields.map((field, index) => (
          <Box key={field.id} className="item-row">
            <Box className="item-fields">
              <Autocomplete
                options={products}
                getOptionLabel={(product) =>
                  `${product.name} - ₹${product.price.toFixed(2)} (Stock: ${product.stockQuantity})`
                }
                value={products.find((p) => String(p.productId) === String(field.productId)) || null}
                onChange={(_, newValue) => {
                  const productId = newValue ? String(newValue.productId) : '';
                  setValue('items', fields.map((f, i) => {
                    if (i === index) {
                      return { ...f, productId };
                    }
                    return f;
                  }));
                }}
                disabled={disabled || products.length === 0}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    error={!!errors.items?.[index]?.productId}
                    helperText={errors.items?.[index]?.productId?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#2a2a2a',
                        color: '#1976d2',
                        '& fieldset': {
                          borderColor: errors.items?.[index]?.productId ? '#f44336' : '#555',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.items?.[index]?.productId ? '#f44336' : '#777',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '& input::placeholder': {
                          color: '#ccc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#ccc',
                      },
                    }}
                  />
                )}
                renderOption={(props, product) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      {product.name} - ₹{product.price.toFixed(2)} (Stock: {product.stockQuantity})
                    </Box>
                  );
                }}
                noOptionsText={products.length === 0 ? 'No products available' : 'No products found'}
                sx={{ flex: 2 }}
              />

              <Controller
                name={`items.${index}.quantity`}
                control={control}
                render={({ field: quantityField }) => (
                  <TextField
                    type="number"
                    label="Quantity"
                    {...quantityField}
                    disabled={disabled}
                    inputProps={{ min: 1, step: 1 }}
                    variant="outlined"
                    error={!!errors.items?.[index]?.quantity}
                    helperText={errors.items?.[index]?.quantity?.message}
                    sx={{
                      flex: '0 0 120px',
                      ml: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#2a2a2a',
                        color: '#1976d2',
                        '& fieldset': {
                          borderColor: errors.items?.[index]?.quantity ? '#f44336' : '#555',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.items?.[index]?.quantity ? '#f44336' : '#777',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '& input::placeholder': {
                          color: '#ccc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#ccc',
                      },
                    }}
                  />
                )}
              />
            </Box>

            <IconButton
              type="button"
              onClick={() => handleRemoveItem(index)}
              disabled={disabled || fields.length === 1}
              aria-label="Remove item"
              sx={{ color: 'white' }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}

        <Box className="form-actions">
          <button
            type="button"
            onClick={handleAddItem}
            className="btn-secondary btn-add-item"
            disabled={disabled}
          >
            <AddIcon fontSize="small" />
            Add Item
          </button>

          <button type="submit" className="btn-primary" disabled={disabled}>
            {disabled ? 'Creating...' : 'Create Sale'}
          </button>
        </Box>
      </Box>
    </form>
  );
}
