import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/bookings', data); toast.success('Booking request sent! 🎉'); return res.data.data; }
  catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); return rejectWithValue(err.response?.data?.message); }
});
export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (params, { rejectWithValue }) => {
  try { const res = await api.get('/bookings/my', { params }); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const respondBooking = createAsyncThunk('bookings/respond', async ({ id, action, reason }, { rejectWithValue }) => {
  try { const res = await api.patch(`/bookings/${id}/respond`, { action, reason }); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], selected: null, loading: false, pagination: null },
  reducers: {
    setSelected: (state, action) => { state.selected = action.payload; },
    addBooking: (state, action) => { state.list.unshift(action.payload); },
    updateBookingStatus: (state, action) => {
      const idx = state.list.findIndex(b => b._id === action.payload.id);
      if (idx !== -1) state.list[idx].status = action.payload.status;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.bookings; state.pagination = action.payload.pagination; })
      .addCase(fetchMyBookings.rejected, (state) => { state.loading = false; })
      .addCase(respondBooking.fulfilled, (state, action) => { const idx = state.list.findIndex(b => b._id === action.payload._id); if (idx !== -1) state.list[idx] = action.payload; });
  }
});
export const { setSelected, addBooking, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
