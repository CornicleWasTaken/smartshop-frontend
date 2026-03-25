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
import './ProductTable.css';



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
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  return (
    <div className="product-table-container">
      <Box className="table-header">
        <Typography variant="h5">Products</Typography>
        <Fab color="primary" onClick={onCreateClick} className="create-fab" aria-label="Create new product">
          <AddIcon />
        </Fab>
      </Box>
      <TableContainer component={Paper}
      sx={{
            backgroundColor: '#16171D',
            color: 'white'
        }}>
        <Table sx = {{'& th, & td': { color: 'white' }}}>

          <TableHead>
            <TableRow sx={{
                '&:hover': {
                  backgroundColor: '#2a2a2a'
                }
              }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Stock Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products available
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productId}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{product.stockQuantity}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => onEditClick(product)}
                      aria-label="Edit product"
                      sx={{ color: 'white' }}
                      disabled={isDeleting && deletingProductId === product.productId}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteClick(product)}
                      aria-label="Delete product"
                      sx={{ color: 'white' }}
                      disabled={isDeleting && deletingProductId === product.productId}
                    >
                      {isDeleting && deletingProductId === product.productId ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
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
    </div>
  );
}
