import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { store } from './app/store';
import { getThemeSettings } from './styles/theme';
import { getThemeMode } from './utils/helpers';
import NotificationProvider from './components/notifications/NotificationProvider';

// Create a ThemeWrapper component to handle theme changes
const ThemeWrapper = ({ children }) => {
    // Get the initial theme mode from localStorage
    const initialMode = getThemeMode();

    // Subscribe to store changes to update the theme when it changes
    const [mode, setMode] = React.useState(initialMode);

    React.useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentMode = store.getState().theme.mode;
            if (currentMode !== mode) {
                setMode(currentMode);
            }
        });

        return () => unsubscribe();
    }, [mode]);

    // Create the theme based on the current mode
    const theme = useMemo(() => createTheme(getThemeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeWrapper>
                    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                        <NotificationProvider>
                            <App />
                        </NotificationProvider>
                    </SnackbarProvider>
                </ThemeWrapper>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
); 