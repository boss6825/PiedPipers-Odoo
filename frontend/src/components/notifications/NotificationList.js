import React from 'react';
import { useDispatch } from 'react-redux';
import {
    List,
    Typography,
    Box,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';
import { DoneAll as DoneAllIcon } from '@mui/icons-material';
import NotificationItem from './NotificationItem';
import { markAllAsRead } from '../../features/notifications/notificationSlice';

const NotificationList = ({ notifications, loading, onClose }) => {
    const dispatch = useDispatch();

    // Handle mark all as read
    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    // If loading, show loading spinner
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    // If no notifications, show empty message
    if (!notifications || notifications.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    No notifications yet
                </Typography>
            </Box>
        );
    }

    // Check if there are any unread notifications
    const hasUnread = notifications.some(notification => !notification.read);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, px: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Notifications
                </Typography>
                {hasUnread && (
                    <Button
                        size="small"
                        startIcon={<DoneAllIcon />}
                        onClick={handleMarkAllAsRead}
                        sx={{ textTransform: 'none' }}
                    >
                        Mark all as read
                    </Button>
                )}
            </Box>
            <Divider />
            <List sx={{ width: '100%', maxHeight: '300px', overflow: 'auto', p: 1 }}>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onClose={onClose}
                    />
                ))}
            </List>
        </>
    );
};

export default NotificationList; 