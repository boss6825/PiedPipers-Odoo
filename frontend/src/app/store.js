import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import questionReducer from '../features/questions/questionSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
        notifications: notificationReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
}); 