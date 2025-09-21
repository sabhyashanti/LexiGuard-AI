import { createTheme } from '@mui/material/styles';

// Define the "legal" theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1D2B4D', // A deep, trustworthy navy blue
    },
    secondary: {
      main: '#B8860B', // A sophisticated gold/amber accent
    },
    background: {
      default: '#F8F7F4', // A clean, off-white paper color
      paper: '#FFFFFF',
    },
    warning: {
      main: '#FFA726', // A standard warning orange
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontFamily: '"Georgia", "Times New Roman", serif', // A classic serif font for headings
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        // Use the outlined variant for a cleaner look than heavy shadows
        root: {
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default theme;
