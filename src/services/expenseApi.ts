import type {
  ExpenseData,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
  ExpenseQueryParams,
  ExpenseReportData,
  Page,
  DateRangeParams
} from '../types/financial';
import { ApiError, buildQueryParams, requestJson } from './apiClient';

export { ApiError };

export async function fetchExpenses(params: ExpenseQueryParams = {}): Promise<Page<ExpenseData>> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/expenses${queryString ? `?${queryString}` : ''}`;
    return requestJson<Page<ExpenseData>>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function fetchExpenseById(id: number): Promise<ExpenseData> {
  try {
    return requestJson<ExpenseData>(`/api/expenses/${id}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function createExpense(expense: ExpenseCreateRequest): Promise<ExpenseData> {
  try {
    return requestJson<ExpenseData>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function updateExpense(id: number, expense: ExpenseUpdateRequest): Promise<ExpenseData> {
  try {
    return requestJson<ExpenseData>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function deleteExpense(id: number): Promise<void> {
  try {
    await requestJson<void>(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function fetchExpensesByDateRange(startDate: string, endDate: string, params: Omit<ExpenseQueryParams, 'startDate' | 'endDate'> = {}): Promise<Page<ExpenseData>> {
  try {
    const queryParams = {
      ...params,
      startDate,
      endDate
    };

    const queryString = buildQueryParams(queryParams);
    const url = `/api/expenses/date-range?${queryString}`;
    return requestJson<Page<ExpenseData>>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function fetchExpensesByCategory(category: string, params: Omit<ExpenseQueryParams, 'category'> = {}): Promise<Page<ExpenseData>> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/expenses/category/${encodeURIComponent(category)}${queryString ? `?${queryString}` : ''}`;
    return requestJson<Page<ExpenseData>>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function generateExpenseReport(params: DateRangeParams): Promise<ExpenseReportData> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/expenses/reports?${queryString}`;
    return requestJson<ExpenseReportData>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}