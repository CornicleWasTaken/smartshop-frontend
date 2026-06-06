import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

import { CurrencyDisplay } from '../Financial/CurrencyDisplay';
import type { ExpenseData, Page, ExpenseStatus } from '../../types/financial';

interface ExpenseTableProps {
  expenses: Page<ExpenseData>;
  loading?: boolean;
  onEdit?: (expense: ExpenseData) => void;
  onDelete?: (expense: ExpenseData) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const getStatusColor = (status: ExpenseStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PAID':
      return 'primary';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'error';
    case 'DRAFT':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: ExpenseStatus): string => {
  switch (status) {
    case 'APPROVED':
      return 'Approved';
    case 'PAID':
      return 'Paid';
    case 'PENDING':
      return 'Pending';
    case 'REJECTED':
      return 'Rejected';
    case 'DRAFT':
      return 'Draft';
    default:
      return status;
  }
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  loading = false,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  if (expenses.content.length === 0 && !loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No expenses found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first expense to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 60 }}>Receipt</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.content.map((expense) => (
              <TableRow
                key={expense.expenseId}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {expense.description}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <CurrencyDisplay amount={expense.amount} variant="body2" />
                </TableCell>

                <TableCell>
                  <Chip
                    label={expense.category}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: 'background.default',
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {expense.vendor || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={getStatusLabel(expense.status)}
                    color={getStatusColor(expense.status)}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </TableCell>

                <TableCell align="center">
                  {expense.receiptAttached && (
                    <Tooltip title="Receipt attached">
                      <ReceiptIcon
                        sx={{
                          color: 'success.main',
                          fontSize: 18,
                        }}
                      />
                    </Tooltip>
                  )}
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {onEdit && (
                      <Tooltip title="Edit expense">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(expense)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete expense">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(expense)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={expenses.totalElements}
        rowsPerPage={expenses.pageSize}
        page={expenses.pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
        }}
      />
    </Paper>
  );
};