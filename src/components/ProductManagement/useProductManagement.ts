import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData, CreateProductRequest, UpdateProductRequest } from '../../types/product';
import type { ProductDialogMode } from '../../types/product';
import { fetchProducts, createProduct, updateProduct, deleteProduct, ApiError } from '../../services/productApi';

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogMode, setDialogMode] = useState<ProductDialogMode>('create');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setDialogMode('create');
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setDialogMode('edit');
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.productId);
      await loadProducts();
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to delete product: ${err.message}`);
      } else {
        setError('Failed to delete product');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateProduct = async (formData: ProductFormData) => {
    const newProduct: CreateProductRequest = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10),
    };

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!selectedProduct) return;

    const updatedProduct: UpdateProductRequest = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10),
    };

    setIsSubmitting(true);
    try {
      await updateProduct(selectedProduct.productId, updatedProduct);
      await loadProducts();
      setIsDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to update product: ${err.message}`);
      } else {
        setError('Failed to update product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
