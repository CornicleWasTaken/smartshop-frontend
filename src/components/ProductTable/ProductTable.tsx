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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onCreateClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
  isDeleting?: boolean;
  deletingProductId?: string | number;
}

export function ProductTable({ products, isLoading, onCreateClick, onEditClick, onDeleteClick, isDeleting = false, deletingProductId }: ProductTableProps) {
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
        <Typography color="text.secondary">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>
          Products
        </Typography>
        <Fab
          color="primary"
          onClick={onCreateClick}
          aria-label="Create new product"
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
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock Quantity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ color: 'text.secondary' }}
                >
                  No products available
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.productId}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <TableCell sx={{ color: 'text.primary' }}>{product.name}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{product.sku}</TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>
                    ₹{product.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>
                    {product.stockQuantity}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => onEditClick(product)}
                      aria-label="Edit product"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      disabled={isDeleting && deletingProductId === product.productId}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteClick(product)}
                      aria-label="Delete product"
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      disabled={isDeleting && deletingProductId === product.productId}
                    >
                      {isDeleting && deletingProductId === product.productId ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )}
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
