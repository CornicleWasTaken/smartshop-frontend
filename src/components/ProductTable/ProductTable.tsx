import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import type { Product } from '../../types/product';
import './ProductTable.css';



interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onCreateClick: () => void;
}

export function ProductTable({ products, isLoading, onCreateClick }: ProductTableProps) {
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
        <Button variant="contained" onClick={onCreateClick} className="create-button">
          Create New Product
        </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
