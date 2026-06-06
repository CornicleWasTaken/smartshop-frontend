import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Fab,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import type { Sale } from '../../types/sale';

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onCreateClick: () => void;
  onViewDetailsClick: (sale: Sale) => void;
  onDownloadClick: (sale: Sale) => void;
}

export function SalesTable({ sales, isLoading, onCreateClick, onViewDetailsClick, onDownloadClick }: SalesTableProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading sales...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: 'background.default',
        borderRadius: 3,
        p: 3,
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>
          Sales
        </Typography>
        <Fab
          color="primary"
          onClick={onCreateClick}
          aria-label="Create new sale"
          sx={{
            boxShadow: 3,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  color: 'text.primary',
                  fontWeight: 'bold',
                  backgroundColor: 'background.default',
                },
              }}
            >
              <TableCell>Date</TableCell>
              <TableCell>Customer Phone</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ color: 'text.secondary' }}
                >
                  No sales available
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow
                  key={sale.saleId}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <TableCell sx={{ color: 'text.primary' }}>
                    {new Date(sale.saleDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {sale.customerPhone || 'N/A'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>
                    ${sale.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sale.status}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        ...getStatusStyles(sale.status),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {sale.items.length}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => onViewDetailsClick(sale)}
                      aria-label="View sale details"
                      sx={{
                        color: 'info.main',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDownloadClick(sale)}
                      aria-label="Download sale"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'COMPLETED':
      return {
        backgroundColor: 'success.main',
        color: 'success.contrastText',
      };
    case 'PENDING':
      return {
        backgroundColor: 'warning.main',
        color: 'warning.contrastText',
      };
    case 'CANCELLED':
      return {
        backgroundColor: 'error.main',
        color: 'error.contrastText',
      };
    case 'REFUNDED':
      return {
        backgroundColor: 'action.disabled',
        color: 'text.primary',
      };
    default:
      return {
        backgroundColor: 'action.disabled',
        color: 'text.primary',
      };
  }
}
