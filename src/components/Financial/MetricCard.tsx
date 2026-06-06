import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { CurrencyDisplay } from './CurrencyDisplay';
import { PercentageDisplay } from './PercentageDisplay';
import { formatNumber, getTrendDirection, type TrendDirection } from '../../utils/financialFormatters';
import { useTheme } from '@mui/material/styles';

interface MetricCardProps {
  title: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  change?: number;
  changeFormat?: 'percentage' | 'currency';
  icon?: React.ReactNode;
  tooltip?: string;
  loading?: boolean;
}

const TrendIcon: React.FC<{ direction: TrendDirection }> = ({ direction }) => {
  const theme = useTheme();

  switch (direction) {
    case 'up':
      return <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} />;
    case 'down':
      return <TrendingDownIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
    default:
      return <TrendingFlatIcon sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />;
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  format,
  change,
  changeFormat = 'percentage',
  icon,
  tooltip,
  loading = false,
}) => {
  const theme = useTheme();

  const renderValue = () => {
    if (loading) {
      return (
        <Typography variant="h4" sx={{ color: 'text.secondary' }}>
          --
        </Typography>
      );
    }

    switch (format) {
      case 'currency':
        return <CurrencyDisplay amount={value} variant="h4" />;
      case 'percentage':
        return <PercentageDisplay percentage={value} variant="h4" />;
      case 'number':
        return (
          <Typography variant="h4" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
            {formatNumber(value)}
          </Typography>
        );
    }
  };

  const renderChange = () => {
    if (change === undefined || loading) return null;

    const trendDirection = getTrendDirection(change);

    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <TrendIcon direction={trendDirection} />
        {changeFormat === 'percentage' ? (
          <PercentageDisplay
            percentage={change}
            showSign
            colorize
            variant="body2"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <CurrencyDisplay
            amount={change}
            showSign
            colorize
            variant="body2"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Stack>
    );
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {icon && (
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1,
                  }}
                >
                  {icon}
                </Box>
              )}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {title}
              </Typography>
            </Box>
            {tooltip && (
              <Tooltip title={tooltip} arrow>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Value */}
          <Box>{renderValue()}</Box>

          {/* Change indicator */}
          <Box display="flex" justifyContent="flex-end">
            {renderChange()}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};