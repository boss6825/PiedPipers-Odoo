import { createTheme } from '@mui/material/styles';

// Common theme settings
export const getThemeSettings = (mode) => {
    return {
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // Light mode colors
                    primary: {
                        main: '#3f51b5',
                        light: '#6573c3',
                        dark: '#2c387e',
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#f50057',
                        light: '#f73378',
                        dark: '#ab003c',
                        contrastText: '#fff',
                    },
                    background: {
                        default: '#f5f7fa',
                        paper: '#ffffff',
                        card: '#ffffff',
                    },
                    text: {
                        primary: '#2d3748',
                        secondary: '#718096',
                    },
                    divider: 'rgba(0, 0, 0, 0.12)',
                }
                : {
                    // Dark mode colors
                    primary: {
                        main: '#5c6bc0',
                        light: '#8e99f3',
                        dark: '#26418f',
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#ff4081',
                        light: '#ff79b0',
                        dark: '#c60055',
                        contrastText: '#fff',
                    },
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                        card: '#252525',
                    },
                    text: {
                        primary: '#e2e8f0',
                        secondary: '#a0aec0',
                    },
                    divider: 'rgba(255, 255, 255, 0.12)',
                }),
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem',
            },
            h2: {
                fontWeight: 600,
                fontSize: '2rem',
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.75rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.5rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h6: {
                fontWeight: 600,
                fontSize: '1rem',
            },
            body1: {
                fontSize: '1rem',
            },
            body2: {
                fontSize: '0.875rem',
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 16px',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: mode === 'light'
                            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                            : '0 2px 8px rgba(0, 0, 0, 0.25)',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    },
                },
            },
        },
    };
};

// Default theme
const theme = createTheme(getThemeSettings('light'));

export default theme; 