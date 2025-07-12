import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    QuestionAnswer as AnswerIcon,
    Check as CheckIcon,
    Notifications as NotificationIcon,
    MarkChatRead as ReadIcon,
} from '@mui/icons-material';
import { formatRelativeTime } from '../../utils/helpers';
import { markAsRead } from '../../features/notifications/notificationSlice';

const NotificationItem = ({ notification, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle notification click to navigate and mark as read
    const handleClick = () => {
        // Mark notification as read
        if (!notification.read) {
            dispatch(markAsRead(notification._id));
        }

        // Close notification menu
        if (onClose) {
            onClose();
        }

        // Navigate based on notification type
        if (notification.type === 'answer' || notification.type === 'mention_answer') {
            navigate(`/questions/${notification.question}`);
        } else if (notification.type === 'mention_question') {
            navigate(`/questions/${notification.question}`);
        }
    };

    // Mark as read without navigating
    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        if (!notification.read) {
            dispatch(markAsRead(notification._id));
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'answer':
                return <AnswerIcon />;
            case 'accepted_answer':
                return <CheckIcon />;
            case 'mention_question':
            case 'mention_answer':
                return <NotificationIcon />;
            default:
                return <NotificationIcon />;
        }
    };

    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                borderRadius: 1,
                mb: 0.5,
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.selected',
                },
            }}
            onClick={handleClick}
            secondaryAction={
                !notification.read && (
                    <Tooltip title="Mark as read">
                        <IconButton edge="end" size="small" onClick={handleMarkAsRead}>
                            <ReadIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )
            }
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: notification.read ? 'grey.500' : 'primary.main' }}>
                    {getNotificationIcon()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        variant="subtitle2"
                        component="div"
                        sx={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                            pr: 4,
                        }}
                    >
                        {notification.message}
                    </Typography>
                }
                secondary={
                    <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            component="span"
                        >
                            {formatRelativeTime(notification.createdAt)}
                        </Typography>
                    </Box>
                }
            />
        </ListItem>
    );
};

export default NotificationItem; 