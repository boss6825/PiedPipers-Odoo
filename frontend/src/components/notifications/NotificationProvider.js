import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { initSocket, disconnectSocket } from '../../utils/socket';
import {
  getNotifications,
  addNotification
} from '../../features/notifications/notificationSlice';
import { selectUser, selectIsAuthenticated } from '../../features/auth/authSlice';

const NotificationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Show browser notification
  const showNotification = useCallback((notification) => {
    // Check if browser notifications are supported and permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('StackIt', {
        body: notification.message,
        icon: '/logo192.png',
      });
    }

    // Show in-app notification with snackbar
    const action = (key) => (
      <Button
        onClick={() => closeSnackbar(key)}
        color="inherit"
        size="small"
      >
        Dismiss
      </Button>
    );

    enqueueSnackbar(notification.message, {
      variant: 'info',
      autoHideDuration: 5000,
      action,
    });
  }, [enqueueSnackbar, closeSnackbar]);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      // Initialize socket connection
      const socket = initSocket(user.token);

      // Listen for new notifications
      socket.on('notification', (notification) => {
        // Show notification
        showNotification(notification);

        // Add notification to state
        dispatch(addNotification(notification));
      });

      // Fetch initial notifications
      dispatch(getNotifications());

      // Clean up on unmount
      return () => {
        disconnectSocket();
      };
    } else {
      // Disconnect socket when user logs out
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch, showNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return children;
};

export default NotificationProvider; 