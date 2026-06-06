import type {
  SalesReportData,
  ProfitLossData,
  BalanceSheetData,
  FinancialSummary,
  DateRangeParams
} from '../types/financial';
import { ApiError, buildQueryParams, requestJson } from './apiClient';

export { ApiError };

export async function generateSalesReport(params: DateRangeParams): Promise<SalesReportData> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/reports/sales?${queryString}`;
    return requestJson<SalesReportData>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function generateProfitLossStatement(params: DateRangeParams): Promise<ProfitLossData> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/reports/profit-loss?${queryString}`;
    return requestJson<ProfitLossData>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function generateBalanceSheet(asOfDate: string): Promise<BalanceSheetData> {
  try {
    const queryString = buildQueryParams({ asOfDate });
    const url = `/api/reports/balance-sheet?${queryString}`;
    return requestJson<BalanceSheetData>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}

export async function fetchFinancialSummary(params: DateRangeParams): Promise<FinancialSummary> {
  try {
    const queryString = buildQueryParams(params);
    const url = `/api/reports/financial-summary?${queryString}`;
    return requestJson<FinancialSummary>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0, error);
  }
}