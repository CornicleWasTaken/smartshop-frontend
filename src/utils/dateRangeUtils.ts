// Date range utilities for financial reporting

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  format
} from 'date-fns';

import type { DateRange } from '../types/financial';

export interface DateRangePreset {
  label: string;
  value: string;
  getRange: () => DateRange;
}

// Predefined date range presets
export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday),
      };
    },
  },
  {
    label: 'Last 7 days',
    value: 'last-7-days',
    getRange: () => ({
      startDate: startOfDay(subDays(new Date(), 6)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 days',
    value: 'last-30-days',
    getRange: () => ({
      startDate: startOfDay(subDays(new Date(), 29)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'This week',
    value: 'this-week',
    getRange: () => ({
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
    }),
  },
  {
    label: 'Last week',
    value: 'last-week',
    getRange: () => {
      const lastWeek = subWeeks(new Date(), 1);
      return {
        startDate: startOfWeek(lastWeek),
        endDate: endOfWeek(lastWeek),
      };
    },
  },
  {
    label: 'This month',
    value: 'this-month',
    getRange: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last month',
    value: 'last-month',
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: 'This quarter',
    value: 'this-quarter',
    getRange: () => ({
      startDate: startOfQuarter(new Date()),
      endDate: endOfQuarter(new Date()),
    }),
  },
  {
    label: 'Last quarter',
    value: 'last-quarter',
    getRange: () => {
      const lastQuarter = subQuarters(new Date(), 1);
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter),
      };
    },
  },
  {
    label: 'This year',
    value: 'this-year',
    getRange: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
  {
    label: 'Last year',
    value: 'last-year',
    getRange: () => {
      const lastYear = subYears(new Date(), 1);
      return {
        startDate: startOfYear(lastYear),
        endDate: endOfYear(lastYear),
      };
    },
  },
];

// Get preset by value
export const getPresetByValue = (value: string): DateRangePreset | undefined => {
  return DATE_RANGE_PRESETS.find(preset => preset.value === value);
};

// Format date range for display
export const formatDateRangeDisplay = (range: DateRange): string => {
  const { startDate, endDate } = range;
  const startFormatted = format(startDate, 'MMM dd, yyyy');
  const endFormatted = format(endDate, 'MMM dd, yyyy');

  if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
    return startFormatted;
  }

  return `${startFormatted} - ${endFormatted}`;
};

// Format date range for API calls (ISO strings)
export const formatDateRangeForAPI = (range: DateRange): { startDate: string; endDate: string } => {
  return {
    startDate: range.startDate.toISOString(),
    endDate: range.endDate.toISOString(),
  };
};

// Check if date range is valid
export const isValidDateRange = (range: DateRange | null): boolean => {
  if (!range) return false;
  return range.startDate <= range.endDate;
};

// Get comparison date range (same period in previous timeframe)
export const getComparisonDateRange = (range: DateRange): DateRange => {
  const duration = range.endDate.getTime() - range.startDate.getTime();
  const comparisonEndDate = new Date(range.startDate.getTime() - 1);
  const comparisonStartDate = new Date(comparisonEndDate.getTime() - duration);

  return {
    startDate: comparisonStartDate,
    endDate: comparisonEndDate,
  };
};

// Calculate the number of days in a date range
export const getDaysInRange = (range: DateRange): number => {
  const diffTime = Math.abs(range.endDate.getTime() - range.startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Get default date range (last 30 days)
export const getDefaultDateRange = (): DateRange => {
  return DATE_RANGE_PRESETS.find(preset => preset.value === 'last-30-days')!.getRange();
};