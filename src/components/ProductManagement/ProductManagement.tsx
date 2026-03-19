import { useProductManagement } from './useProductManagement';
import { ProductTable } from '../ProductTable/ProductTable';
import { ProductDialog } from '../ProductDialog/ProductDialog';
import { Box, Alert, Typography } from '@mui/material';
import './ProductManagement.css';

export function ProductManagement() {
  const {
    products,
    isLoading,
    isDialogOpen,
    error,
    handleCreateClick,
    handleCloseDialog,
    handleCreateProduct,
  } = useProductManagement();

  return (
    <Box className="product-management">
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      {error && (
        <Alert severity="error" className="error-alert" onClose={() => {}}>
          {error}
        </Alert>
      )}

      <ProductTable
        products={products}
        isLoading={isLoading}
        onCreateClick={handleCreateClick}
      />

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateProduct}
      />
    </Box>
  );
}
