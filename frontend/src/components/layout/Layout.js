import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout; 