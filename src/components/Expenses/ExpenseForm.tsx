import React from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller } from 'react-hook-form';

import { useExpenseForm } from '../../hooks/useExpenseForm';
import { ExpenseStatus } from '../../types/financial';
import type { ExpenseFormData, ExpenseCreateRequest, ExpenseUpdateRequest } from '../../types/financial';

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  categories: string[];
  onSubmit: (data: ExpenseCreateRequest | ExpenseUpdateRequest) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const EXPENSE_STATUSES: { value: ExpenseStatus; label: string }[] = [
  { value: ExpenseStatus.DRAFT, label: 'Draft' },
  { value: ExpenseStatus.PENDING, label: 'Pending Approval' },
  { value: ExpenseStatus.APPROVED, label: 'Approved' },
  { value: ExpenseStatus.PAID, label: 'Paid' },
  { value: ExpenseStatus.REJECTED, label: 'Rejected' },
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  submitLabel = 'Save Expense',
}) => {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
    onFormSubmit,
    handleCancel,
  } = useExpenseForm({
    initialData,
    onSubmit,
    onCancel,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={onFormSubmit} noValidate>
        <Stack spacing={3}>
          {/* Form Title */}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </Typography>

          {/* Error Alert */}
          {errors.root && (
            <Alert severity="error">
              {errors.root.message}
            </Alert>
          )}

          {/* Description */}
          <TextField
            {...register('description')}
            label="Description"
            placeholder="Enter expense description"
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            required
            multiline
            rows={2}
          />

          {/* Amount and Category Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('amount')}
              label="Amount"
              placeholder="0.00"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              fullWidth
              required
              type="number"
              inputProps={{
                step: '0.01',
                min: '0',
              }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>₹</Typography>,
              }}
            />

            <TextField
              {...register('category')}
              label="Category"
              select
              error={!!errors.category}
              helperText={errors.category?.message}
              fullWidth
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Date and Vendor Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="expenseDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Expense Date"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.expenseDate,
                      helperText: errors.expenseDate?.message,
                      required: true,
                    },
                  }}
                />
              )}
            />

            <TextField
              {...register('vendor')}
              label="Vendor"
              placeholder="Enter vendor name (optional)"
              error={!!errors.vendor}
              helperText={errors.vendor?.message}
              fullWidth
            />
          </Stack>

          {/* Status */}
          <TextField
            {...register('status')}
            label="Status"
            select
            error={!!errors.status}
            helperText={errors.status?.message}
            fullWidth
            required
          >
            {EXPENSE_STATUSES.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Receipt Attached */}
          <Controller
            name="receiptAttached"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                  />
                }
                label="Receipt attached"
              />
            )}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              onClick={handleCancel}
              color="inherit"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};