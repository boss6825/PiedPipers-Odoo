import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
                textAlign: 'center',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    borderRadius: '12px',
                    maxWidth: '500px',
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Oops! Page not found.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/"
                    sx={{
                        mt: 2,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1,
                    }}
                >
                    Back to Home
                </Button>
            </Paper>
        </Box>
    );
};

export default NotFoundPage; 