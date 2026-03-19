import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData, CreateProductRequest } from '../../types/product';
import { fetchProducts, createProduct, ApiError } from '../../services/productApi';

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load products');
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCreateProduct = async (formData: ProductFormData) => {
    const newProduct: CreateProductRequest = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10),
    };

    try {
      await createProduct(newProduct);
      await loadProducts();
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create product: ${err.message}`);
      } else {
        setError('Failed to create product');
      }
    }
  };

  return {
    products,
    isLoading,
    isDialogOpen,
    error,
    handleCreateClick,
    handleCloseDialog,
    handleCreateProduct,
  };
}
