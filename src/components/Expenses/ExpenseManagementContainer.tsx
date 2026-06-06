import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
  Fab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useExpenseManagement } from '../../hooks/useExpenseManagement';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseTable } from './ExpenseTable';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import type { ExpenseData, ExpenseCreateRequest, ExpenseUpdateRequest } from '../../types/financial';

export const ExpenseManagementContainer: React.FC = () => {
  const {
    expenses,
    categories,
    loading,
    error,
    createNewExpense,
    updateExistingExpense,
    deleteExistingExpense,
    loadExpenses,
    clearError,
  } = useExpenseManagement();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseData | null>(null);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setDialogOpen(true);
  };

  const handleEditExpense = (expense: ExpenseData) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteExpense = (expense: ExpenseData) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const handleSubmitExpense = async (data: ExpenseCreateRequest | ExpenseUpdateRequest) => {
    try {
      if (editingExpense) {
        await updateExistingExpense(editingExpense.expenseId, data);
      } else {
        await createNewExpense(data);
      }
      handleCloseDialog();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to save expense:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExistingExpense(expenseToDelete.expenseId);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete expense:', err);
    }
  };

  const handleRefresh = () => {
    loadExpenses();
  };

  const getInitialFormData = () => {
    if (!editingExpense) return undefined;

    return {
      description: editingExpense.description,
      amount: editingExpense.amount.toString(),
      category: editingExpense.category,
      expenseDate: new Date(editingExpense.expenseDate),
      vendor: editingExpense.vendor || '',
      receiptAttached: editingExpense.receiptAttached,
      status: editingExpense.status,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Expense Management
        </Typography>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExpense}
          >
            Add Expense
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Expense Table */}
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onPageChange={(page) => loadExpenses({ page })}
        onRowsPerPageChange={(size) => loadExpenses({ size })}
      />

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add expense"
        onClick={handleAddExpense}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Expense Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minHeight: 600 },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ExpenseForm
            initialData={getInitialFormData()}
            categories={categories}
            onSubmit={handleSubmitExpense}
            onCancel={handleCloseDialog}
            submitLabel={editingExpense ? 'Update Expense' : 'Create Expense'}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={expenseToDelete?.description || ''}
        isDeleting={loading}
      />
    </Box>
  );
};