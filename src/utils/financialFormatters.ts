// Utility functions for financial data formatting

import { format } from 'date-fns';

// Currency formatting
export const formatCurrency = (
  amount: number,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    currency = 'INR',
    locale = 'en-IN',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {}
): string => {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = false,
  } = options;

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);

  if (showSign && value > 0) {
    return `+${formatted}`;
  }

  return formatted;
};

// Number formatting with thousands separator
export const formatNumber = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

// Compact number formatting (e.g., 1.2K, 3.4M)
export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

// Date formatting for financial reports
export const formatReportDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MM/dd/yy');
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

// Calculate percentage change
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Determine color based on value (positive/negative)
export const getValueColor = (value: number, theme: any): string => {
  if (value > 0) return theme.palette.success.main;
  if (value < 0) return theme.palette.error.main;
  return theme.palette.text.secondary;
};

// Determine trend direction
export type TrendDirection = 'up' | 'down' | 'neutral';

export const getTrendDirection = (value: number): TrendDirection => {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
};

// Format financial statement line items
export const formatStatementLineItem = (
  label: string,
  amount: number,
  options: {
    indent?: number;
    bold?: boolean;
    isTotal?: boolean;
  } = {}
): { label: string; amount: string; indent: number; bold: boolean } => {
  const { indent = 0, bold = false, isTotal = false } = options;

  return {
    label: isTotal ? label.toUpperCase() : label,
    amount: formatCurrency(amount),
    indent,
    bold: bold || isTotal,
  };
};

// Validate numeric input for forms
export const parseNumericInput = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Safe division to avoid division by zero
export const safeDivide = (numerator: number, denominator: number): number => {
  return denominator === 0 ? 0 : numerator / denominator;
};

// Calculate margin percentage
export const calculateMargin = (profit: number, revenue: number): number => {
  return safeDivide(profit, revenue) * 100;
};

// Round to specified decimal places
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};