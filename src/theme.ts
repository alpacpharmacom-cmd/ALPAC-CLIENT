import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D4B38', // Deep forest green
      light: '#4A6B41',
      dark: '#1A2E1F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B8956A', // Earthy gold / tan
      light: '#D4B896',
      dark: '#96724E',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FDFCFB', // Ultra clean off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#111111', // Obsidian for absolute contrast
      secondary: '#444444',
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", -apple-system, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '5rem', // Larger for immersive feel
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '3.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: '0.95rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1.05rem', // Slightly larger for premium readability
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.7,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.8rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.12em',
      fontSize: '0.8rem',
    },
  },
  shape: {
    borderRadius: 16, // Softer, more modern rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 32px',
          boxShadow: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 700,
          borderRadius: 12,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 12px 32px rgba(45,75,56,0.18)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            bgcolor: 'rgba(45,75,56,0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          borderRadius: 20,
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.12)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontFamily: '"DM Sans", sans-serif',
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,0,0,0.2)',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.9rem',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.8)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
          padding: 8,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

export default theme;

