import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (err) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    workerProfile: null,
    accessToken: localStorage.getItem('accessToken'),
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload }; },
    updateWorkerProfile: (state, action) => { state.workerProfile = { ...state.workerProfile, ...action.payload }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.workerProfile = action.payload.workerProfile;
        state.accessToken = action.payload.accessToken;
        toast.success('Welcome to KaamConnect! 🏠');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.workerProfile = action.payload.workerProfile;
        state.accessToken = action.payload.accessToken;
        toast.success(`Welcome back, ${action.payload.user.name.split(' ')[0]}! 👋`);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.workerProfile = action.payload.workerProfile;
        state.initialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.initialized = true;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.workerProfile = null;
        state.accessToken = null;
        toast.success('Logged out successfully');
      });
  }
});

export const { clearError, updateUser, updateWorkerProfile } = authSlice.actions;
export default authSlice.reducer;
