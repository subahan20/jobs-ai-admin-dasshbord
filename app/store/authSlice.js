'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api';
import { triggerNotification } from './uiSlice';

const initialState = {
  session: null,
  checkingAuth: true,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || 'Authentication failed');
      }
      const sessionPayload = {
        token: data?.session?.access_token,
        user: data?.user,
        expiresAt: Date.now() + (data?.session?.expires_in || 3600) * 1000,
      };
      localStorage.setItem('admin_session', JSON.stringify(sessionPayload));
      dispatch(triggerNotification('success', 'Logged in successfully.'));
      return sessionPayload;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error occurred');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      dispatch(triggerNotification('success', 'Registration successful! If verification is enabled, confirm your email.'));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadSession: (state) => {
      try {
        const stored = localStorage.getItem('admin_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
            state.session = parsed;
          } else {
            localStorage.removeItem('admin_session');
            state.session = null;
          }
        }
      } catch (err) {
        console.error('Error parsing session:', err);
      } finally {
        state.checkingAuth = false;
      }
    },
    logout: (state) => {
      localStorage.removeItem('admin_session');
      state.session = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Authentication failed';
      });
  }
});

export const { loadSession, logout } = authSlice.actions;
export default authSlice.reducer;
