import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import type { ChartDataPoint } from '../../types/financial';
import { formatChartTooltip, getChartAriaLabel, generateColorPalette } from '../../utils/chartHelpers';

interface ComparisonBarChartProps {
  data: ChartDataPoint[];
  xDataKey: string;
  yDataKey: string | string[];
  title?: string;
  height?: number;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
  colorScheme?: string[];
  horizontal?: boolean;
  onBarClick?: (data: ChartDataPoint) => void;
}

// Custom tooltip component
const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ color?: string; dataKey?: string; value?: number }>; label?: React.ReactNode; formatValue?: (value: number) => string }> = ({
  active,
  payload,
  label,
  formatValue,
}) => {
  const theme = useTheme();

  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2,
          boxShadow: theme.shadows[4],
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{ fontWeight: 600, color: entry.color }}
          >
            {entry.dataKey}: {formatValue ? formatValue(entry.value ?? 0) : formatChartTooltip(entry.value ?? 0, 'currency')}
          </Typography>
        ))}
      </Box>
    );
  }

  return null;
};

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  title,
  height = 300,
  formatValue,
  showGrid = true,
  colorScheme,
  horizontal = false,
  onBarClick,
}) => {
  const theme = useTheme();

  const yDataKeys = Array.isArray(yDataKey) ? yDataKey : [yDataKey];
  const colors = colorScheme || generateColorPalette(yDataKeys.length);

  const ariaLabel = React.useMemo(() => {
    return getChartAriaLabel('bar', title || 'Bar chart', data.length);
  }, [title, data.length]);

  const ChartComponent = BarChart;

  const handleChartClick = React.useCallback(
    (state: any) => {
      const point = state?.activePayload?.[0]?.payload as ChartDataPoint | undefined;
      if (point) {
        onBarClick?.(point);
      }
    },
    [onBarClick],
  );

  return (
    <Box sx={{ width: '100%', height }} role="img" aria-label={ariaLabel}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'horizontal' : 'vertical'}
          onClick={handleChartClick}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              strokeOpacity={0.5}
            />
          )}
          <XAxis
            type={horizontal ? 'number' : 'category'}
            dataKey={horizontal ? undefined : xDataKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={horizontal ? (formatValue || ((value) => formatChartTooltip(value, 'currency'))) : undefined}
          />
          <YAxis
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? xDataKey : undefined}
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={!horizontal ? (formatValue || ((value) => formatChartTooltip(value, 'currency'))) : undefined}
          />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />

          {yDataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index]}
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>

      {/* Screen reader accessible data table */}
      <Box sx={{ position: 'absolute', left: '-9999px' }}>
        <table>
          <caption>{title || 'Chart data'}</caption>
          <thead>
            <tr>
              <th>{xDataKey}</th>
              {yDataKeys.map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item[xDataKey]}</td>
                {yDataKeys.map(key => (
                  <td key={key}>
                    {formatValue ? formatValue(item[key] as number) : item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};