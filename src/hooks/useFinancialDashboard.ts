import { useState, useEffect, useCallback } from 'react';
import type {
  FinancialSummary,
  ExpenseData,
  DateRange,
  ChartDataPoint
} from '../types/financial';
import { fetchFinancialSummary } from '../services/financialReportApi';
import { fetchExpenses } from '../services/expenseApi';
import { getDefaultDateRange, formatDateRangeForAPI } from '../utils/dateRangeUtils';
import { ApiError } from '../services/expenseApi';

interface FinancialDashboardState {
  summary: FinancialSummary | null;
  recentExpenses: ExpenseData[];
  salesTrend: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useFinancialDashboard = (dateRange: DateRange = getDefaultDateRange()): FinancialDashboardState => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseData[]>([]);
  const [salesTrend, setSalesTrend] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFinancialSummary = useCallback(async () => {
    try {
      const apiDateRange = formatDateRangeForAPI(dateRange);
      const summaryData = await fetchFinancialSummary(apiDateRange);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch financial summary:', err);
      if (err instanceof ApiError) {
        setError(`Failed to load financial summary: ${err.message}`);
      } else {
        setError('Failed to load financial summary');
      }
    }
  }, [dateRange]);

  const loadRecentExpenses = useCallback(async () => {
    try {
      const expensesResponse = await fetchExpenses({
        page: 0,
        size: 5, // Only get 5 most recent
      });
      setRecentExpenses(expensesResponse.content);
    } catch (err) {
      console.error('Failed to fetch recent expenses:', err);
      // Don't set error for recent expenses as it's not critical
    }
  }, []);

  const loadSalesTrend = useCallback(async () => {
    try {
      // For now, we'll generate mock sales trend data
      // In a real implementation, this would call a sales trend API
      const mockSalesTrend: ChartDataPoint[] = [];
      const days = 30;
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        // Generate mock sales data with some randomness
        const baseAmount = 1000 + Math.random() * 2000;
        const seasonalFactor = 1 + 0.3 * Math.sin((i / days) * Math.PI * 2);
        const randomFactor = 0.8 + Math.random() * 0.4;

        mockSalesTrend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: Math.round(baseAmount * seasonalFactor * randomFactor),
          formattedDate: date.toISOString().split('T')[0],
        });
      }

      setSalesTrend(mockSalesTrend);
    } catch (err) {
      console.error('Failed to generate sales trend:', err);
      setSalesTrend([]);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadFinancialSummary(),
        loadRecentExpenses(),
        loadSalesTrend(),
      ]);
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [loadFinancialSummary, loadRecentExpenses, loadSalesTrend]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    summary,
    recentExpenses,
    salesTrend,
    loading,
    error,
    refreshData,
  };
};