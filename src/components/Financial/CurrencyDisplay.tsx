import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { formatCurrency, getValueColor } from '../../utils/financialFormatters';
import { useTheme } from '@mui/material/styles';

interface CurrencyDisplayProps extends Omit<TypographyProps, 'children'> {
  amount: number;
  showSign?: boolean;
  currency?: string;
  locale?: string;
  colorize?: boolean; // Apply color based on positive/negative
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  showSign = false,
  currency = 'INR',
  locale = 'en-IN',
  colorize = false,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  sx,
  ...typographyProps
}) => {
  const theme = useTheme();

  const formattedAmount = formatCurrency(amount, {
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const displayValue = showSign && amount > 0 ? `+${formattedAmount}` : formattedAmount;

  const color = colorize ? getValueColor(amount, theme) : undefined;

  return (
    <Typography
      {...typographyProps}
      sx={{
        color,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        ...sx,
      }}
    >
      {displayValue}
    </Typography>
  );
};