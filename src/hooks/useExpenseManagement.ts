import { useState, useCallback, useEffect } from 'react';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  ApiError,
} from '../services/expenseApi';
import type {
  ExpenseData,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
  ExpenseQueryParams,
  ExpenseFilters,
  Page,
} from '../types/financial';

interface ExpenseManagementState {
  expenses: Page<ExpenseData>;
  categories: string[];
  filters: ExpenseFilters;
  selectedExpense: ExpenseData | null;
  loading: boolean;
  error: string | null;

  loadExpenses: (params?: ExpenseQueryParams) => Promise<void>;
  createNewExpense: (data: ExpenseCreateRequest) => Promise<void>;
  updateExistingExpense: (id: number, data: ExpenseUpdateRequest) => Promise<void>;
  deleteExistingExpense: (id: number) => Promise<void>;
  setFilters: (filters: ExpenseFilters) => void;
  setSelectedExpense: (expense: ExpenseData | null) => void;
  clearError: () => void;
}

// Mock categories - in a real app, this might come from an API
const DEFAULT_CATEGORIES = [
  'Office Supplies',
  'Equipment',
  'Marketing',
  'Travel',
  'Meals & Entertainment',
  'Professional Services',
  'Utilities',
  'Rent',
  'Software',
  'Maintenance',
];

export const useExpenseManagement = (): ExpenseManagementState => {
  const [expenses, setExpenses] = useState<Page<ExpenseData>>({
    content: [],
    pageNumber: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const [categories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [filters, setFiltersState] = useState<ExpenseFilters>({
    dateRange: null,
    categories: [],
    statuses: [],
  });

  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async (params: ExpenseQueryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build query params from filters
      const queryParams: ExpenseQueryParams = {
        page: 0,
        size: 20,
        ...params,
      };

      // Add filter parameters
      if (filters.dateRange) {
        queryParams.startDate = filters.dateRange.startDate.toISOString();
        queryParams.endDate = filters.dateRange.endDate.toISOString();
      }

      const response = await fetchExpenses(queryParams);
      setExpenses(response);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      if (err instanceof ApiError) {
        setError(`Failed to load expenses: ${err.message}`);
      } else {
        setError('Failed to load expenses');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createNewExpense = useCallback(async (data: ExpenseCreateRequest) => {
    setLoading(true);
    setError(null);

    try {
      await createExpense(data);
      // Reload expenses after creation
      await loadExpenses();
    } catch (err) {
      console.error('Failed to create expense:', err);
      if (err instanceof ApiError) {
        setError(`Failed to create expense: ${err.message}`);
      } else {
        setError('Failed to create expense');
      }
      throw err; // Re-throw to allow form handling
    } finally {
      setLoading(false);
    }
  }, [loadExpenses]);

  const updateExistingExpense = useCallback(async (id: number, data: ExpenseUpdateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const updatedExpense = await updateExpense(id, data);

      // Update the expenses in state
      setExpenses(prev => ({
        ...prev,
        content: prev.content.map(exp =>
          exp.expenseId === id ? updatedExpense : exp
        ),
      }));

      // Update selected expense if it was updated
      if (selectedExpense && selectedExpense.expenseId === id) {
        setSelectedExpense(updatedExpense);
      }
    } catch (err) {
      console.error('Failed to update expense:', err);
      if (err instanceof ApiError) {
        setError(`Failed to update expense: ${err.message}`);
      } else {
        setError('Failed to update expense');
      }
      throw err; // Re-throw to allow form handling
    } finally {
      setLoading(false);
    }
  }, [selectedExpense]);

  const deleteExistingExpense = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteExpense(id);

      // Remove from expenses in state
      setExpenses(prev => ({
        ...prev,
        content: prev.content.filter(exp => exp.expenseId !== id),
        totalElements: prev.totalElements - 1,
      }));

      // Clear selected expense if it was deleted
      if (selectedExpense && selectedExpense.expenseId === id) {
        setSelectedExpense(null);
      }
    } catch (err) {
      console.error('Failed to delete expense:', err);
      if (err instanceof ApiError) {
        setError(`Failed to delete expense: ${err.message}`);
      } else {
        setError('Failed to delete expense');
      }
      throw err; // Re-throw to allow UI handling
    } finally {
      setLoading(false);
    }
  }, [selectedExpense]);

  const setFilters = useCallback((newFilters: ExpenseFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load expenses when filters change
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    categories,
    filters,
    selectedExpense,
    loading,
    error,
    loadExpenses,
    createNewExpense: createNewExpense,
    updateExistingExpense: updateExistingExpense,
    deleteExistingExpense: deleteExistingExpense,
    setFilters,
    setSelectedExpense,
    clearError,
  };
};