import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchWorkers = createAsyncThunk('workers/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await api.get('/workers', { params }); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchWorker = createAsyncThunk('workers/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await api.get(`/workers/${id}`); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchFeatured = createAsyncThunk('workers/featured', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/workers/featured'); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
const workerSlice = createSlice({
  name: 'workers',
  initialState: { list: [], pagination: null, featured: [], selected: null, loading: false, error: null, filters: { skills: [], minRating: '', maxSalary: '', workType: '', verifiedOnly: false } },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { skills: [], minRating: '', maxSalary: '', workType: '', verifiedOnly: false }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => { state.loading = true; })
      .addCase(fetchWorkers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.workers; state.pagination = action.payload.pagination; })
      .addCase(fetchWorkers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchWorker.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; });
  }
});
export const { setFilters, clearFilters } = workerSlice.actions;
export default workerSlice.reducer;
