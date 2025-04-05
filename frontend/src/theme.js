import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Modern blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#4CAF50', // Fresh green
    },
    background: {
      default: '#f5f7fa', // Light gray background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2d3436',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2d3436',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  },
});

export default theme;