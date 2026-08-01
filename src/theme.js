import { createTheme } from '@mui/material/styles';

const baseTheme = {
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 16px 45px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#14b8a6' },
    background: { default: '#f3f7fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' },
    secondary: { main: '#34d399' },
    background: { default: '#020617', paper: '#111827' },
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
  },
});

export const theme = lightTheme;
