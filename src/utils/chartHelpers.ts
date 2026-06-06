// Chart utilities and helpers for financial data visualization

import type { ChartDataPoint, CategoryChartData } from '../types/financial';

// Color palette for charts (theme-compatible)
export const CHART_COLORS = {
  primary: '#aa3bff',
  secondary: '#c084fc',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  neutral: '#9e9e9e',
} as const;

// Generate color palette for multiple series
export const generateColorPalette = (count: number): string[] => {
  const colors = Object.values(CHART_COLORS);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }

  return result;
};

// Format data for pie charts
export const formatPieChartData = (
  data: Array<{ name: string; value: number }>,
  options: {
    showPercentage?: boolean;
    minPercentage?: number; // Group small slices into "Others"
  } = {}
): CategoryChartData[] => {
  const { minPercentage = 2 } = options;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  let processedData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
    color: generateColorPalette(data.length)[index],
  }));

  // Group small slices if specified
  if (minPercentage > 0) {
    const smallSlices = processedData.filter(item => item.percentage < minPercentage);
    const largeSlices = processedData.filter(item => item.percentage >= minPercentage);

    if (smallSlices.length > 0) {
      const othersValue = smallSlices.reduce((sum, item) => sum + item.value, 0);
      const othersPercentage = smallSlices.reduce((sum, item) => sum + item.percentage, 0);

      largeSlices.push({
        name: 'Others',
        value: othersValue,
        percentage: othersPercentage,
        color: CHART_COLORS.neutral,
      });
    }

    processedData = largeSlices;
  }

  return processedData.sort((a, b) => b.value - a.value);
};

// Format data for line/bar charts with time series
export const formatTimeSeriesData = (
  data: Array<{ date: string; value: number }>,
  options: {
    formatDate?: (date: string) => string;
    fillMissingDates?: boolean;
  } = {}
): ChartDataPoint[] => {
  const { formatDate, fillMissingDates = false } = options;

  let processedData = data.map(item => ({
    date: formatDate ? formatDate(item.date) : item.date,
    value: item.value,
    formattedDate: item.date,
  }));

  // TODO: Implement missing date filling if needed
  if (fillMissingDates) {
    // This would require more complex logic to fill gaps
  }

  return processedData;
};

// Calculate moving average for trend lines
export const calculateMovingAverage = (
  data: ChartDataPoint[],
  valueKey: string,
  window: number
): ChartDataPoint[] => {
  return data.map((item, index) => {
    if (index < window - 1) {
      return { ...item, [`${valueKey}MA`]: null };
    }

    const sum = data
      .slice(index - window + 1, index + 1)
      .reduce((acc, curr) => acc + (curr[valueKey] as number), 0);

    return { ...item, [`${valueKey}MA`]: sum / window };
  });
};

// Format chart tooltips
export const formatChartTooltip = (
  value: number,
  format: 'currency' | 'number' | 'percentage' = 'number'
): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(value);
    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value / 100);
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

// Responsive chart dimensions
export const getResponsiveChartDimensions = (containerWidth: number) => {
  if (containerWidth < 600) {
    return { width: containerWidth - 32, height: 200 };
  }
  if (containerWidth < 900) {
    return { width: containerWidth - 48, height: 300 };
  }
  return { width: containerWidth - 64, height: 400 };
};

// Chart accessibility helpers
export const getChartAriaLabel = (
  chartType: 'line' | 'bar' | 'pie',
  title: string,
  dataPoints: number
): string => {
  return `${chartType} chart showing ${title} with ${dataPoints} data points`;
};

// Generate chart data summary for screen readers
export const generateDataSummary = (
  data: ChartDataPoint[],
  valueKey: string,
  format: 'currency' | 'number' | 'percentage' = 'number'
): string => {
  if (data.length === 0) return 'No data available';

  const values = data.map(item => item[valueKey] as number).filter(val => typeof val === 'number');
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  const formatValue = (val: number) => formatChartTooltip(val, format);

  return `Data range from ${formatValue(min)} to ${formatValue(max)}, with an average of ${formatValue(avg)}`;
};