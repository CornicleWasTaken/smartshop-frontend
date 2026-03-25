import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchProducts, createProduct, updateProduct, deleteProduct, ApiError } from '../../services/productApi';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../types/product';

describe('productApi', () => {
  const mockProducts: Product[] = [
    { productId: 1, name: 'Test Product', sku: 'TEST-001', price: 9.99, stockQuantity: 100 },
    { productId: 2, name: 'Another Product', sku: 'TEST-002', price: 19.99, stockQuantity: 50 },
  ];

  const mockCreatedProduct: Product = {
    productId: 3,
    name: 'New Product',
    sku: 'NEW-001',
    price: 29.99,
    stockQuantity: 25,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchProducts', () => {
    it('should return products on success', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ content: mockProducts }),
      }));

      const result = await fetchProducts();
      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith('/api/products');
    });

    it('should throw ApiError on failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      }));

      await expect(fetchProducts()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchProducts()).rejects.toThrow('Network error or server unavailable');
    });
  });

  describe('createProduct', () => {
    const newProduct: CreateProductRequest = {
      name: 'New Product',
      sku: 'NEW-001',
      price: 29.99,
      stockQuantity: 25,
    };

    it('should return created product on success', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCreatedProduct,
      }));

      const result = await createProduct(newProduct);
      expect(result).toEqual(mockCreatedProduct);
      expect(fetch).toHaveBeenCalledWith('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    });

    it('should throw ApiError on failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid data' }),
      }));

      await expect(createProduct(newProduct)).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(createProduct(newProduct)).rejects.toThrow('Network error or server unavailable');
    });
  });

  describe('updateProduct', () => {
    const updatedProduct: UpdateProductRequest = {
      name: 'Updated Product',
      price: 39.99,
    };

    it('should return updated product on success', async () => {
      const expectedResponse: Product = {
        ...mockCreatedProduct,
        ...updatedProduct,
      };

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => expectedResponse,
      }));

      const result = await updateProduct(1, updatedProduct);
      expect(result).toEqual(expectedResponse);
      expect(fetch).toHaveBeenCalledWith('/api/products/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
    });

    it('should throw ApiError on failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid data' }),
      }));

      await expect(updateProduct(1, updatedProduct)).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(updateProduct(1, updatedProduct)).rejects.toThrow('Network error or server unavailable');
    });
  });

  describe('deleteProduct', () => {
    it('should resolve successfully on delete', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
      }));

      await deleteProduct(1);
      expect(fetch).toHaveBeenCalledWith('/api/products/1', {
        method: 'DELETE',
      });
    });

    it('should throw ApiError on failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Product not found' }),
      }));

      await expect(deleteProduct(999)).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(deleteProduct(1)).rejects.toThrow('Network error or server unavailable');
    });
  });
});
