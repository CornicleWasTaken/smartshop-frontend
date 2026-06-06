import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import type { ChartDataPoint } from '../../types/financial';
import { formatChartTooltip, getChartAriaLabel } from '../../utils/chartHelpers';

interface TrendLineChartProps {
  data: ChartDataPoint[];
  xDataKey: string;
  yDataKey: string;
  title?: string;
  height?: number;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
  strokeColor?: string;
  onPointClick?: (data: ChartDataPoint) => void;
}

// Custom tooltip component
const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ value?: number; color?: string }>; label?: React.ReactNode; formatValue?: (value: number) => string }> = ({
  active,
  payload,
  label,
  formatValue,
}) => {
  const theme = useTheme();

  if (active && payload && payload.length) {
    const value = payload[0].value ?? 0;
    const formattedValue = formatValue ? formatValue(value) : formatChartTooltip(value, 'currency');

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
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: payload[0].color }}>
          {formattedValue}
        </Typography>
      </Box>
    );
  }

  return null;
};

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  title,
  height = 300,
  formatValue,
  showGrid = true,
  strokeColor,
  onPointClick,
}) => {
  const theme = useTheme();

  const lineColor = strokeColor || theme.palette.primary.main;

  const ariaLabel = React.useMemo(() => {
    return getChartAriaLabel('line', title || 'Trend chart', data.length);
  }, [title, data.length]);

  const handleChartClick = React.useCallback(
    (state: any) => {
      const point = state?.activePayload?.[0]?.payload as ChartDataPoint | undefined;
      if (point) {
        onPointClick?.(point);
      }
    },
    [onPointClick],
  );

  return (
    <Box sx={{ width: '100%', height, display: 'flex', flexDirection: 'column' }} role="img" aria-label={ariaLabel}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              dataKey={xDataKey}
              interval="preserveStartEnd"
              minTickGap={30}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={formatValue || ((value) => formatChartTooltip(value, 'currency'))}
            />
            <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
            <Line
              type="monotone"
              dataKey={yDataKey}
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
              activeDot={{
                r: 6,
                stroke: lineColor,
                strokeWidth: 2,
                fill: theme.palette.background.paper
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Screen reader accessible data table */}
      <Box sx={{ position: 'absolute', left: '-9999px' }}>
        <table>
          <caption>{title || 'Chart data'}</caption>
          <thead>
            <tr>
              <th>{xDataKey}</th>
              <th>{yDataKey}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item[xDataKey]}</td>
                <td>{formatValue ? formatValue(item[yDataKey] as number) : item[yDataKey]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};