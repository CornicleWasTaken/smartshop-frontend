// Financial data types matching backend DTOs

export const ExpenseStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT',
} as const;

export type ExpenseStatus = (typeof ExpenseStatus)[keyof typeof ExpenseStatus];

export interface ExpenseData {
  expenseId: number;
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  vendor?: string;
  receiptAttached: boolean;
  status: ExpenseStatus;
  createdDate: string;
  updatedDate: string;
}

export interface ExpenseCreateRequest {
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  vendor?: string;
  receiptAttached: boolean;
  status: ExpenseStatus;
}

export interface ExpenseUpdateRequest extends ExpenseCreateRequest {}

export interface ExpenseQueryParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: ExpenseStatus;
}

export interface ExpenseFormData {
  description: string;
  amount: string; // String for form binding
  category: string;
  expenseDate: Date | null;
  vendor: string;
  receiptAttached: boolean;
  status: ExpenseStatus;
}

export interface ExpenseReportData {
  periodStart: string;
  periodEnd: string;
  totalExpenses: number;
  totalItems: number;
  averageAmount: number;
  largestExpense: number;
  categoryBreakdown: CategoryExpenseData[];
  topExpenses: ExpenseData[];
  statusSummary: ExpenseStatusSummaryData;
}

export interface CategoryExpenseData {
  category: string;
  amount: number;
  items: number;
  percentage: number;
}

export interface ExpenseStatusSummaryData {
  pendingCount: number;
  pendingAmount: number;
  approvedCount: number;
  approvedAmount: number;
  paidCount: number;
  paidAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
}

export interface SalesReportData {
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  totalTransactions: number;
  averageTransactionValue: number;
  totalItemsSold: number;
  dailyBreakdown: DailySalesData[];
  topProducts: ProductSalesData[];
  categoryBreakdown: CategorySalesData[];
}

export interface DailySalesData {
  date: string;
  transactions: number;
  amount: number;
  averageValue: number;
}

export interface ProductSalesData {
  productId: number;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  percentageOfSales: number;
}

export interface CategorySalesData {
  category: string;
  itemsSold: number;
  revenue: number;
  percentageOfSales: number;
}

export interface ProfitLossData {
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  salesReturns: number;
  netSales: number;
  totalExpenses: number;
  operatingExpenses: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  grossMarginPercentage: number;
  netMarginPercentage: number;
}

export interface BalanceSheetData {
  asOfDate: string;
  currentAssets: number;
  inventoryValue: number;
  cash: number;
  totalAssets: number;
  currentLiabilities: number;
  accountsPayable: number;
  totalLiabilities: number;
  equity: number;
  retainedEarnings: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  balanceSheetBalanced: boolean;
}

export interface FinancialSummary {
  summaryId?: number;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  createdAt?: string;
}

// API Response types
export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Date range utilities
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

// Chart data types
export interface ChartDataPoint {
  [key: string]: string | number | null;
}

export interface CategoryChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

// Filter types
export interface ExpenseFilters {
  dateRange: DateRange | null;
  categories: string[];
  statuses: ExpenseStatus[];
  minAmount?: number;
  maxAmount?: number;
  vendor?: string;
}

export interface SalesReportFilters {
  dateRange: DateRange;
  productIds?: number[];
  categories?: string[];
}

// Report export types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  fileName?: string;
}