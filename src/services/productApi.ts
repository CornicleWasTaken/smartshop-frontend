import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new ApiError('Failed to fetch products', response.status, await response.json());
    }
    const data = await response.json();
    console.log('Fetched products:', data);
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
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new ApiError('Failed to create product', response.status, await response.json());
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function updateProduct(productId: string | number, product: UpdateProductRequest): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new ApiError('Failed to update product', response.status, await response.json());
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function deleteProduct(productId: string | number): Promise<void> {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError('Failed to delete product', response.status, await response.json());
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}
