import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isSuccess: false,
    error: null,
};

// Get user notifications
export const getNotifications = createAsyncThunk(
    'notifications/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(ENDPOINTS.NOTIFICATIONS, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${ENDPOINTS.NOTIFICATIONS}/${id}`, {}, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(ENDPOINTS.NOTIFICATIONS, {}, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = null;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload.notifications || action.payload;
                state.unreadCount = action.payload.unreadCount ||
                    (action.payload.filter ? action.payload.filter(n => !n.read).length : 0);
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.isSuccess = true;
                const index = state.notifications.findIndex(
                    (notification) => notification._id === action.payload._id
                );
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                    if (state.unreadCount > 0) {
                        state.unreadCount -= 1;
                    }
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.isSuccess = true;
                state.notifications = state.notifications.map((notification) => ({
                    ...notification,
                    read: true,
                }));
                state.unreadCount = 0;
            });
    },
});

export const { reset, clearNotifications } = notificationSlice.actions;
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;

export default notificationSlice.reducer; 