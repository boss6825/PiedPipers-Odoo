import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ size = 40, text = 'Loading...', fullPage = false }) => {
    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
            }}
        >
            <CircularProgress size={size} color="primary" />
            {text && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {text}
                </Typography>
            )}
        </Box>
    );

    if (fullPage) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                }}
            >
                {content}
            </Box>
        );
    }

    return content;
};

export default LoadingSpinner; 