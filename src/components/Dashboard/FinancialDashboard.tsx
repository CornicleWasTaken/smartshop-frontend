import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as SalesIcon,
  Receipt as ExpenseIcon,
  AccountBalance as ProfitIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import { useFinancialDashboard } from '../../hooks/useFinancialDashboard';
import { MetricCard } from '../Financial/MetricCard';
import { TrendLineChart } from '../Charts/TrendLineChart';
import { DateRangePicker } from '../Controls/DateRangePicker';
import { getDefaultDateRange } from '../../utils/dateRangeUtils';
import { formatCurrency } from '../../utils/financialFormatters';
import type { DateRange } from '../../types/financial';

interface FinancialDashboardProps {
  initialDateRange?: DateRange;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  initialDateRange = getDefaultDateRange(),
}) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const {
    summary,
    recentExpenses,
    salesTrend,
    loading,
    error,
    refreshData,
  } = useFinancialDashboard(dateRange);

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
    }
  };

  const handleRefresh = () => {
    refreshData();
  };

  console.log("Sales Trend Data:", salesTrend);

  const latestSalesTrend = salesTrend.at(-1);
  const previousSalesTrend = salesTrend.at(-2);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Financial Dashboard
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={RouterLink}
            to="/financial/expenses"
            variant="outlined"
            startIcon={<ExpenseIcon />}
          >
            Manage Expenses
          </Button>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={handleDateRangeChange}
          />
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Sales"
            value={summary?.totalSales || 0}
            format="currency"
            icon={<SalesIcon />}
            loading={loading}
            tooltip="Total sales revenue for the selected period"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Expenses"
            value={summary?.totalExpenses || 0}
            format="currency"
            icon={<ExpenseIcon />}
            loading={loading}
            tooltip="Total expenses for the selected period"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Gross Profit"
            value={summary?.grossProfit || 0}
            format="currency"
            icon={<ProfitIcon />}
            loading={loading}
            tooltip="Sales minus direct costs"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Net Profit"
            value={summary?.netProfit || 0}
            format="currency"
            icon={<AnalyticsIcon />}
            loading={loading}
            tooltip="Profit after all expenses"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid size={{ xs: 12, md: 12 }} sx={{ width: '100%', minWidth: 0 }}>
          <Paper sx={{ p: 3, height: 500 }}>
            {loading ? (
              <Box>
                <Skeleton variant="text" height={32} width={200} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} />
              </Box>
            ) : (
              <TrendLineChart
                data={salesTrend}
                xDataKey="date"
                yDataKey="sales"
                title="Sales Trend"
                height={450}
                formatValue={formatCurrency}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Recent Expenses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Expenses
            </Typography>

            {loading ? (
              <Box>
                {[...Array(5)].map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Skeleton variant="text" height={20} width="80%" />
                    <Skeleton variant="text" height={16} width="60%" />
                  </Box>
                ))}
              </Box>
            ) : recentExpenses.length > 0 ? (
              <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                {recentExpenses.map((expense) => (
                  <Box
                    key={expense.expenseId}
                    sx={{
                      p: 2,
                      mb: 1,
                      backgroundColor: 'background.default',
                      borderRadius: 1,
                      borderLeft: 3,
                      borderLeftColor: 'primary.main',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {expense.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {expense.category} • {formatCurrency(expense.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent expenses found
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Insights */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Insights
            </Typography>

            <Stack spacing={3}>
              {/* Sales Trend */}
              <Box sx={{
                p: 2,
                backgroundColor: 'background.default',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SalesIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sales Performance
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {latestSalesTrend && previousSalesTrend ? (
                    <>
                      {Number(latestSalesTrend.sales ?? 0) > Number(previousSalesTrend.sales ?? 0)
                        ? 'Trending up from previous period'
                        : 'Trending down from previous period'}
                    </>
                  ) : (
                    'Insufficient data for trend analysis'
                  )}
                </Typography>
              </Box>

              {/* Expense Overview */}
              <Box sx={{
                p: 2,
                backgroundColor: 'background.default',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ExpenseIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {recentExpenses.length} recent expense{recentExpenses.length !== 1 ? 's' : ''} recorded
                </Typography>
              </Box>

              {/* Profitability */}
              {summary && (
                <Box sx={{
                  p: 2,
                  backgroundColor: 'background.default',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AnalyticsIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Profit Margin
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {summary.totalSales && summary.totalSales > 0
                      ? `${((summary.netProfit / summary.totalSales) * 100).toFixed(1)}% net margin`
                      : 'No sales data available'
                    }
                  </Typography>
                </Box>
              )}

              {/* Quick Actions */}
              <Box sx={{
                p: 2,
                backgroundColor: 'primary.main',
                borderRadius: 2,
                color: 'primary.contrastText'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    component={RouterLink}
                    to="/reports"
                    sx={{ color: 'primary.main' }}
                  >
                    View Reports
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    component={RouterLink}
                    to="/expenses"
                    sx={{ borderColor: 'primary.contrastText', color: 'primary.contrastText' }}
                  >
                    Add Expense
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};