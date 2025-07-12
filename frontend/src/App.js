import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { selectIsAuthenticated } from './features/auth/authSlice';

// Pages
import HomePage from './pages/HomePage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ImageUploadGuidePage from './pages/ImageUploadGuidePage';

// Layout components
import Layout from './components/layout/Layout';

// Test components
import ImageUploadTest from './components/editor/ImageUploadTest';

function App() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Request notification permission when user logs in
    useEffect(() => {
        if (isAuthenticated && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [isAuthenticated]);

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default
        }}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="questions">
                        <Route index element={<HomePage />} />
                        <Route path="ask" element={<AskQuestionPage />} />
                        <Route path=":questionId" element={<QuestionDetailPage />} />
                    </Route>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="test/image-upload" element={<ImageUploadTest />} />
                    <Route path="guide/image-upload" element={<ImageUploadGuidePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Box>
    );
}

export default App; 