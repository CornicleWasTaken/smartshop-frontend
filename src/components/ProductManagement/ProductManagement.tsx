import { useProductManagement } from './useProductManagement';
import { ProductTable } from '../ProductTable/ProductTable';
import { ProductDialog } from '../ProductDialog/ProductDialog';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Box, Alert, Typography } from '@mui/material';
import './ProductManagement.css';

export function ProductManagement() {
  const {
    products,
    isLoading,
    isDialogOpen,
    isDeleteConfirmOpen,
    isSubmitting,
    isDeleting,
    error,
    selectedProduct,
    dialogMode,
    productToDelete,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseDialog,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
    handleCreateProduct,
    handleUpdateProduct,
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
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        isDeleting={isDeleting}
        deletingProductId={productToDelete?.productId}
      />

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={dialogMode === 'edit' ? handleUpdateProduct : handleCreateProduct}
        mode={dialogMode}
        product={selectedProduct}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </Box>
  );
}
