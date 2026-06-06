import { useProductManagement } from './useProductManagement';
import { ProductTable } from '../ProductTable/ProductTable';
import { ProductDialog } from '../ProductDialog/ProductDialog';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Box, Alert, Typography } from '@mui/material';

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
    <Box
      sx={{
        p: 4,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          mb: 3,
        }}
      >
        Product Management
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => {}}
        >
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
        product={selectedProduct ?? undefined}
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
