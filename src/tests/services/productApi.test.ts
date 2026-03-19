import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchProducts, createProduct, ApiError } from '../../services/productApi';
import { Product, CreateProductRequest } from '../../types/product';

describe('productApi', () => {
  const mockProducts: Product[] = [
    { id: 1, name: 'Test Product', sku: 'TEST-001', price: 9.99, stockQuantity: 100 },
    { id: 2, name: 'Another Product', sku: 'TEST-002', price: 19.99, stockQuantity: 50 },
  ];

  const mockCreatedProduct: Product = {
    id: 3,
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
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await fetchProducts();
      expect(result).toEqual(mockProducts);
      expect(global.fetch).toHaveBeenCalledWith('/api/products');
    });

    it('should throw ApiError on failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      await expect(fetchProducts()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

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
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCreatedProduct,
      });

      const result = await createProduct(newProduct);
      expect(result).toEqual(mockCreatedProduct);
      expect(global.fetch).toHaveBeenCalledWith('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    });

    it('should throw ApiError on failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid data' }),
      });

      await expect(createProduct(newProduct)).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(createProduct(newProduct)).rejects.toThrow('Network error or server unavailable');
    });
  });
});
