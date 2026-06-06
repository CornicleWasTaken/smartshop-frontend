import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Helvetica, system-ui, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.2 },
    h4: { fontSize: '2.125rem', fontWeight: 500, lineHeight: 1.235 },
    h5: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.334 },
    h6: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.43 },
    button: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.75, textTransform: 'none' },
    caption: { fontSize: '0.75rem', lineHeight: 1.66 },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
};

const sharedComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '8px 20px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
    },
  },
} as const;

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: { main: '#aa3bff' },
    secondary: { main: '#64748b' },
    error: { main: '#d32f2f' },
    warning: { main: '#ed6c02' },
    info: { main: '#0288d1' },
    success: { main: '#2e7d32' },
    background: { default: '#ffffff', paper: '#f8f9fa' },
    text: { primary: '#08060d', secondary: '#6b6375' },
    divider: '#e5e4e7',
  },
  components: sharedComponents,
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: { main: '#aa3bff' },
    secondary: { main: '#94a3b8' },
    error: { main: '#ef5350' },
    warning: { main: '#ff9800' },
    info: { main: '#03a9f4' },
    success: { main: '#4caf50' },
    background: { default: '#0f0f14', paper: '#1a1a23' },
    text: { primary: '#f8fafc', secondary: '#cbd5e1' },
    divider: '#2d2d3a',
  },
  components: sharedComponents,
});
