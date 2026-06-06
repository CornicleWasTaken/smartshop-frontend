import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';
import { ApiError, requestJson } from './apiClient';

export { ApiError };

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await requestJson<{ content: Product[] }>('/api/products');
    return data.content as Product[];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function createProduct(product: CreateProductRequest): Promise<Product> {
  try {
    return requestJson<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function updateProduct(productId: string | number, product: UpdateProductRequest): Promise<Product> {
  try {
    return requestJson<Product>(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function deleteProduct(productId: string | number): Promise<void> {
  try {
    await requestJson<void>(`/api/products/${productId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}
