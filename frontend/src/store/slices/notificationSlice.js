import { createSlice } from '@reduxjs/toolkit';
const notifSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unread: 0 },
  reducers: {
    setNotifications: (state, action) => { state.list = action.payload.notifications; state.unread = action.payload.unread; },
    addNotification: (state, action) => { state.list.unshift(action.payload); state.unread += 1; },
    markAllRead: (state) => { state.unread = 0; state.list.forEach(n => { n.isRead = true; }); },
  }
});
export const { setNotifications, addNotification, markAllRead } = notifSlice.actions;
export default notifSlice.reducer;
