'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { triggerNotification } from './uiSlice';

const initialState = {
  session: null,
  checkingAuth: true,
  loading: false,
  error: null,
};

const buildSessionPayload = (session) => {
  if (!session) return null;
  return {
    token: session.access_token,
    user: session.user,
    expiresAt: Date.now() + (session.expires_in || 3600) * 1000,
  };
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      const sessionPayload = buildSessionPayload(data.session);
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        return rejectWithValue(error.message);
      }

      if (data?.session) {
        const sessionPayload = buildSessionPayload(data.session);
        dispatch(triggerNotification('success', 'Account created successfully.'));
        return sessionPayload;
      }

      return {
        needsConfirmation: true,
        message: 'Check your email to confirm your account.',
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error occurred');
    }
  }
);

export const loadSession = createAsyncThunk(
  'auth/loadSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return rejectWithValue(error.message);
      
      if (data?.session) {
        return buildSessionPayload(data.session);
      }
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return rejectWithValue(error.message);
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSession.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.session = action.payload;
      })
      .addCase(loadSession.rejected, (state) => {
        state.checkingAuth = false;
        state.session = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
      })
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
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.token) {
          state.session = action.payload;
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      });
  }
});

export default authSlice.reducer;
