import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workerReducer from './slices/workerSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workers: workerReducer,
    bookings: bookingReducer,
    ui: uiReducer,
    chat: chatReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
