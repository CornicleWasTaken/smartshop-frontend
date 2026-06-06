import type { Sale, CreateSaleRequest } from '../types/sale';
import { ApiError, requestJson } from './apiClient';

// GET /api/sales - Fetch all sales (paginated, extract .content)
export async function fetchSales(): Promise<Sale[]> {
  try {
    const data = await requestJson<{ content: Sale[] }>('/api/sales');
    return data.content as Sale[];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

// GET /api/sales/:id - Fetch single sale by ID
export async function fetchSaleById(saleId: number): Promise<Sale> {
  try {
    return requestJson<Sale>(`/api/sales/${saleId}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

// POST /api/sales - Create new sale
export async function createSale(request: CreateSaleRequest): Promise<Sale> {
  try {
    return requestJson<Sale>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}
