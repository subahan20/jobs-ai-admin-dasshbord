import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchAdminSyncedJobs = createAsyncThunk(
  'adminSync/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.session?.token) throw new Error('No auth token');
      
      const res = await fetch(`${API_BASE_URL}/admin/synced-jobs`, {
        headers: getAuthHeaders(auth.session.token)
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      return data.jobs || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const triggerBulkSync = createAsyncThunk(
  'adminSync/triggerSync',
  async (category, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await fetch(`${API_BASE_URL}/admin/bulk-sync`, {
        method: 'POST',
        headers: getAuthHeaders(auth.session.token),
        body: JSON.stringify({ category })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to trigger sync');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const pollBulkSyncStatus = createAsyncThunk(
  'adminSync/pollStatus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await fetch(`${API_BASE_URL}/admin/bulk-sync/status`, {
        headers: getAuthHeaders(auth.session.token)
      });
      if (!res.ok) throw new Error('Failed to fetch status');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const adminSyncSlice = createSlice({
  name: 'adminSync',
  initialState: {
    jobs: [],
    loading: false,
    syncStatus: 'idle', // 'idle', 'running', 'completed', 'failed'
    logs: [],
    totalSaved: 0,
    error: null,
  },
  reducers: {
    clearAdminSyncError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSyncedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminSyncedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAdminSyncedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(triggerBulkSync.pending, (state) => {
        state.syncStatus = 'running';
        state.error = null;
        state.logs = ['Starting bulk job sync... Please wait.'];
      })
      .addCase(triggerBulkSync.fulfilled, (state) => {
        state.syncStatus = 'running';
        state.error = null;
      })
      .addCase(triggerBulkSync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(pollBulkSyncStatus.fulfilled, (state, action) => {
        state.syncStatus = action.payload.status;
        state.logs = action.payload.logs || [];
        state.totalSaved = action.payload.totalSaved || 0;
      });
  }
});

export const { clearAdminSyncError } = adminSyncSlice.actions;
export default adminSyncSlice.reducer;
