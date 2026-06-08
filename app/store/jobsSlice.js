'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api';
import { triggerNotification, setModalOpen } from './uiSlice';
import { logout } from './authSlice';

const initialState = {
  jobs: [],
  loading: false,
  submitting: false,
  apiStatus: 'connecting', // 'connected' | 'connecting' | 'error'
  error: null,
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs?source=Admin+Portal&limit=100`);
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
      const minExp = parseInt(formData?.min_experience_years || '0', 10);
      const skillsArray = formData?.skills_required
        ? typeof formData.skills_required === 'string'
          ? formData.skills_required.split(',').map(s => s.trim()).filter(Boolean)
          : formData.skills_required
        : [];
      
      const FALLBACK_THEMES = [
        'bg-indigo-600/30 text-indigo-200 border-indigo-500/30',
        'bg-blue-600/30 text-blue-200 border-blue-500/30',
        'bg-emerald-600/30 text-emerald-200 border-emerald-500/30',
        'bg-cyan-600/30 text-cyan-200 border-cyan-500/30',
        'bg-rose-600/30 text-rose-200 border-rose-500/30',
        'bg-amber-600/30 text-amber-200 border-amber-500/30'
      ];
      const chosenColor = FALLBACK_THEMES[Math.floor(Math.random() * FALLBACK_THEMES.length)];

      const jobPayload = {
        title: formData?.title?.trim(),
        company: formData?.company?.trim(),
        location: formData?.location?.trim() || 'Remote',
        salary: formData?.salary?.trim() || 'Not Disclosed',
        experience_level: formData?.experience_level || 'Mid',
        min_experience_years: minExp,
        skills_required: skillsArray,
        logo_url: formData?.logo_url?.trim() || null,
        logo_color: chosenColor,
        source: 'Admin Portal',
        description: formData?.description?.trim() || 'No description provided.',
        posted_time: 'Just now',
        url: formData?.url?.trim() || ''
      };

      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.session.token}`
        },
        body: JSON.stringify(jobPayload)
      });

      const responseData = await res.json();
      
      if (res.status === 401) {
        dispatch(logout());
        dispatch(triggerNotification('error', 'Unauthorized or expired session. Please log in.'));
        return rejectWithValue('Unauthorized');
      }

      if (!res.ok) throw new Error(responseData?.message || 'Failed to publish job');

      dispatch(triggerNotification('success', 'Job published successfully to API backend!'));
      resetFormCallback();
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
      const minExp = parseInt(formData?.min_experience_years || '0', 10);
      const skillsArray = formData?.skills_required
        ? typeof formData.skills_required === 'string'
          ? formData.skills_required.split(',').map(s => s.trim()).filter(Boolean)
          : formData.skills_required
        : [];

      const jobPayload = {
        title: formData?.title?.trim(),
        company: formData?.company?.trim(),
        location: formData?.location?.trim() || 'Remote',
        salary: formData?.salary?.trim() || 'Not Disclosed',
        experience_level: formData?.experience_level || 'Mid',
        min_experience_years: minExp,
        skills_required: skillsArray,
        logo_url: formData?.logo_url?.trim() || null,
        description: formData?.description?.trim() || 'No description provided.',
        url: formData?.url?.trim() || ''
      };

      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.session.token}`
        },
        body: JSON.stringify(jobPayload)
      });

      const responseData = await res.json();
      
      if (res.status === 401) {
        dispatch(logout());
        dispatch(triggerNotification('error', 'Unauthorized or expired session. Please log in.'));
        return rejectWithValue('Unauthorized');
      }

      if (!res.ok) throw new Error(responseData?.message || 'Failed to update job');

      dispatch(triggerNotification('success', 'Job listing updated successfully!'));
      if (resetFormCallback) resetFormCallback();
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
    if (!jobId || !confirm('Are you sure you want to delete this job listing? This removes it permanently.')) {
      return rejectWithValue('Cancelled');
    }

    const { auth } = getState();
    if (!auth.session?.token) {
      dispatch(triggerNotification('error', 'Authentication session expired. Please sign in.'));
      dispatch(logout());
      return rejectWithValue('No token found');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.session.token}`
        }
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
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.apiStatus = 'connecting';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.apiStatus = 'connected';
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.apiStatus = 'error';
        state.error = action.payload;
      })
      // Publish Job
      .addCase(publishJob.pending, (state) => {
        state.submitting = true;
      })
      .addCase(publishJob.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(publishJob.rejected, (state) => {
        state.submitting = false;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateJob.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateJob.rejected, (state) => {
        state.submitting = false;
      });
  }
});

export default jobsSlice.reducer;
