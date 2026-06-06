import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode } from './useThemeMode';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides MUI theme with light/dark mode support
 * Includes CssBaseline for consistent baseline styles
 */
export const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const { mode } = useThemeMode();

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
