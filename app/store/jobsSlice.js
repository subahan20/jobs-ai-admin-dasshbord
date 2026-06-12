'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api';
import { buildJobPayload } from './jobPayload';
import { triggerNotification, setModalOpen } from './uiSlice';
import { logout } from './authSlice';

const initialState = {
  jobs: [],
  loading: false,
  submitting: false,
  error: null,
};

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs?limit=200&source=Admin`);
      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      const data = await res.json();
      return data?.jobs || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch jobs');
    }
  }
);

export const publishJob = createAsyncThunk(
  'jobs/publish',
  async ({ formData, resetFormCallback }, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.session?.token) {
      dispatch(triggerNotification('error', 'Authentication session expired. Please sign in.'));
      dispatch(logout());
      return rejectWithValue('No token found');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(auth.session.token),
        body: JSON.stringify(buildJobPayload(formData)),
      });

      const responseData = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        dispatch(triggerNotification('error', 'Unauthorized or expired session. Please log in.'));
        return rejectWithValue('Unauthorized');
      }

      if (!res.ok) throw new Error(responseData?.message || 'Failed to publish job');

      dispatch(triggerNotification('success', 'Job published successfully!'));
      resetFormCallback?.();
      dispatch(setModalOpen(false));
      dispatch(fetchJobs());
      return responseData;
    } catch (err) {
      dispatch(triggerNotification('error', `Failed to publish job: ${err?.message || err}`));
      return rejectWithValue(err.message || 'Failed to publish job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ jobId, formData, resetFormCallback }, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.session?.token) {
      dispatch(triggerNotification('error', 'Authentication session expired. Please sign in.'));
      dispatch(logout());
      return rejectWithValue('No token found');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(auth.session.token),
        body: JSON.stringify(buildJobPayload(formData, { includeLogoColor: false })),
      });

      const responseData = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        dispatch(triggerNotification('error', 'Unauthorized or expired session. Please log in.'));
        return rejectWithValue('Unauthorized');
      }

      if (!res.ok) throw new Error(responseData?.message || 'Failed to update job');

      dispatch(triggerNotification('success', 'Job listing updated successfully!'));
      resetFormCallback?.();
      dispatch(setModalOpen(false));
      dispatch(fetchJobs());
      return responseData;
    } catch (err) {
      dispatch(triggerNotification('error', `Failed to update job: ${err?.message || err}`));
      return rejectWithValue(err.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (jobId, { getState, dispatch, rejectWithValue }) => {
    if (!jobId) return rejectWithValue('Cancelled');

    const { auth } = getState();
    if (!auth.session?.token) {
      dispatch(triggerNotification('error', 'Authentication session expired. Please sign in.'));
      dispatch(logout());
      return rejectWithValue('No token found');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.session.token}` },
      });
      const responseData = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        dispatch(triggerNotification('error', 'Unauthorized or expired session. Please log in.'));
        return rejectWithValue('Unauthorized');
      }

      if (!res.ok) throw new Error(responseData?.message || 'Failed to delete listing');

      dispatch(triggerNotification('success', 'Job listing removed successfully.'));
      dispatch(fetchJobs());
      return jobId;
    } catch (err) {
      dispatch(triggerNotification('error', `Failed to delete listing: ${err?.message || err}`));
      return rejectWithValue(err.message || 'Failed to delete listing');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(publishJob.pending, (state) => {
        state.submitting = true;
      })
      .addCase(publishJob.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(publishJob.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateJob.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateJob.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateJob.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export default jobsSlice.reducer;
