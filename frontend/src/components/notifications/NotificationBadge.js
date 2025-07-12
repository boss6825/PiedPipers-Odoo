import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { selectUnreadCount } from '../../features/notifications/notificationSlice';

const NotificationBadge = ({ onClick }) => {
    const unreadCount = useSelector(selectUnreadCount);

    return (
        <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={onClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
        </Tooltip>
    );
};

export default NotificationBadge; 