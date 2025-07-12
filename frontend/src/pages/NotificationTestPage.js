import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Divider,
} from '@mui/material';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { getSocket } from '../utils/socket';

const NotificationTestPage = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('answer');
    const [status, setStatus] = useState('');

    const handleSendTestNotification = async () => {
        if (!isAuthenticated) {
            setStatus('You must be logged in to send test notifications');
            return;
        }

        const socket = getSocket();
        if (!socket || !socket.connected) {
            setStatus('Socket not connected. Please check your connection.');
            return;
        }

        try {
            socket.emit('test_notification', {
                message,
                type,
            });
            setStatus(`Test notification sent: "${message}" (${type})`);
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    const handleSocketCheck = () => {
        const socket = getSocket();
        if (socket) {
            setStatus(`Socket status: ${socket.connected ? 'Connected' : 'Disconnected'}, ID: ${socket.id || 'None'}`);
        } else {
            setStatus('Socket not initialized');
        }
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Notification Test Page
            </Typography>

            <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom>
                    Socket Connection Status
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleSocketCheck}
                    sx={{ mb: 2 }}
                >
                    Check Socket Status
                </Button>
                {status && (
                    <Typography
                        variant="body2"
                        sx={{
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            fontFamily: 'monospace'
                        }}
                    >
                        {status}
                    </Typography>
                )}
            </Paper>

            <Paper sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom>
                    Send Test Notification
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notification Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                            placeholder="Enter a test notification message"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Notification Type</InputLabel>
                            <Select
                                value={type}
                                label="Notification Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value="answer">New Answer</MenuItem>
                                <MenuItem value="accepted_answer">Accepted Answer</MenuItem>
                                <MenuItem value="mention_question">Mention in Question</MenuItem>
                                <MenuItem value="mention_answer">Mention in Answer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendTestNotification}
                            disabled={!message.trim()}
                        >
                            Send Test Notification
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default NotificationTestPage; 