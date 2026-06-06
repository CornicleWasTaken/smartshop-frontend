import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  Popover,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

import {
  DATE_RANGE_PRESETS,
  formatDateRangeDisplay,
  isValidDateRange,
  type DateRangePreset,
} from '../../utils/dateRangeUtils';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  presets?: DateRangePreset[];
  maxDate?: Date;
  minDate?: Date;
  label?: string;
  disabled?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  presets = DATE_RANGE_PRESETS,
  maxDate,
  minDate,
  label = 'Date Range',
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);

  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate && isValidDateRange({ startDate: tempStartDate, endDate: tempEndDate })) {
      onChange(tempStartDate, tempEndDate);
    }
    handleClose();
  };

  const handlePresetSelect = (preset: DateRangePreset) => {
    const range = preset.getRange();
    setTempStartDate(range.startDate);
    setTempEndDate(range.endDate);
    onChange(range.startDate, range.endDate);
    handleClose();
  };

  const displayValue = React.useMemo(() => {
    if (startDate && endDate) {
      return formatDateRangeDisplay({ startDate, endDate });
    }
    return 'Select date range';
  }, [startDate, endDate]);

  const isValidRange = React.useMemo(() => {
    return tempStartDate && tempEndDate && isValidDateRange({ startDate: tempStartDate, endDate: tempEndDate });
  }, [tempStartDate, tempEndDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          variant="outlined"
          startIcon={<CalendarIcon />}
          onClick={handleOpen}
          disabled={disabled}
          sx={{
            minWidth: 240,
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: 'text.primary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {displayValue}
            </Typography>
          </Box>
        </Button>

        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Paper sx={{ p: 3, minWidth: 500 }}>
            <Stack spacing={3}>
              {/* Quick Presets */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Select
                </Typography>
                <Grid container spacing={1}>
                  {presets.slice(0, 8).map((preset) => (
                    <Grid size={6} key={preset.value}>
                      <Chip
                        label={preset.label}
                        onClick={() => handlePresetSelect(preset)}
                        variant="outlined"
                        sx={{
                          width: '100%',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider />

              {/* Custom Date Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Custom Range
                </Typography>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={tempStartDate}
                    onChange={setTempStartDate}
                    maxDate={tempEndDate || maxDate}
                    minDate={minDate}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={tempEndDate}
                    onChange={setTempEndDate}
                    minDate={tempStartDate || minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  variant="contained"
                  disabled={!isValidRange}
                >
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};