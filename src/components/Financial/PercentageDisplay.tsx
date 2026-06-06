import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { formatPercentage, getValueColor } from '../../utils/financialFormatters';
import { useTheme } from '@mui/material/styles';

interface PercentageDisplayProps extends Omit<TypographyProps, 'children'> {
  percentage: number;
  showSign?: boolean;
  colorize?: boolean; // Apply color based on positive/negative
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  percentage,
  showSign = false,
  colorize = false,
  minimumFractionDigits = 1,
  maximumFractionDigits = 2,
  sx,
  ...typographyProps
}) => {
  const theme = useTheme();

  const formattedPercentage = formatPercentage(percentage, {
    minimumFractionDigits,
    maximumFractionDigits,
    showSign,
  });

  const color = colorize ? getValueColor(percentage, theme) : undefined;

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
      {formattedPercentage}
    </Typography>
  );
};