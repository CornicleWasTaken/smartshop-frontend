import { useProductManagement } from './useProductManagement';
import { ProductTable } from '../ProductTable/ProductTable';
import { ProductDialog } from '../ProductDialog/ProductDialog';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Box, Alert, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { ManagerOverrideDialog } from '../Auth/ManagerOverrideDialog';
import { useState } from 'react';

export function ProductManagement() {
  const { role, overrideToken, setOverrideToken, clearOverrideToken } = useAuth();
  const [isOverrideDialogOpen, setIsOverrideDialogOpen] = useState(false);

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

  // Deletion is a guard-eligible action: hidden for cashiers unless they hold an
  // active (transient) override token. The backend enforces the same rule.
  const canDelete = role === 'ADMIN' || role === 'MANAGER' || Boolean(overrideToken);

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          Product Management
        </Typography>
        {role === 'CASHIER' && (
          overrideToken ? (
            <Button variant="outlined" color="success" onClick={clearOverrideToken}>
              Override active
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={() => setIsOverrideDialogOpen(true)}
              aria-label="Request manager override"
            >
              Request override
            </Button>
          )
        )}
      </Stack>

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
        canDelete={canDelete}
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
        onConfirm={() => handleConfirmDelete(overrideToken)}
        productName={productToDelete?.name || ''}
        isDeleting={isDeleting}
      />

      <ManagerOverrideDialog
        isOpen={isOverrideDialogOpen}
        onClose={() => setIsOverrideDialogOpen(false)}
        onSuccess={(elevatedToken) => {
          setOverrideToken(elevatedToken);
          setIsOverrideDialogOpen(false);
        }}
      />
    </Box>
  );
}