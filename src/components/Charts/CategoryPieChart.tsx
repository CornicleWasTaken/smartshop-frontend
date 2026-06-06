import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import type { CategoryChartData } from '../../types/financial';
import { formatChartTooltip, getChartAriaLabel } from '../../utils/chartHelpers';

interface CategoryPieChartProps {
  data: CategoryChartData[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  formatValue?: (value: number) => string;
  onSliceClick?: (data: CategoryChartData) => void;
}

// Custom tooltip component
const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ payload?: CategoryChartData }> ; formatValue?: (value: number) => string }> = ({
  active,
  payload,
  formatValue,
}) => {
  const theme = useTheme();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data) return null;
    const value = data.value;
    const percentage = data.percentage;
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
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Value: {formattedValue}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Percentage: {percentage ? `${percentage.toFixed(1)}%` : ''}
        </Typography>
      </Box>
    );
  }

  return null;
};

// Custom label function for pie slices
const renderCustomLabel = (entry: CategoryChartData & { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number }) => {
  if (entry.percentage && entry.percentage < 5) return null; // Don't show labels for small slices

  const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
  const x = entry.cx + radius * Math.cos(-entry.midAngle * Math.PI / 180);
  const y = entry.cy + radius * Math.sin(-entry.midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > entry.cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {entry.percentage ? `${entry.percentage.toFixed(0)}%` : ''}
    </text>
  );
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  title,
  height = 300,
  showLegend = true,
  showPercentages = true,
  formatValue,
  onSliceClick,
}) => {
  const theme = useTheme();

  const ariaLabel = React.useMemo(() => {
    return getChartAriaLabel('pie', title || 'Category breakdown', data.length);
  }, [title, data.length]);

  return (
    <Box sx={{ width: '100%', height }} role="img" aria-label={ariaLabel}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showPercentages ? (renderCustomLabel as any) : false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={onSliceClick as any}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                color: theme.palette.text.secondary,
              }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Screen reader accessible data table */}
      <Box sx={{ position: 'absolute', left: '-9999px' }}>
        <table>
          <caption>{title || 'Category breakdown chart'}</caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{formatValue ? formatValue(item.value) : item.value}</td>
                <td>{item.percentage ? `${item.percentage.toFixed(1)}%` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};