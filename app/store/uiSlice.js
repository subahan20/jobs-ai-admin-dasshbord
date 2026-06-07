'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  notification: null, // { type: 'success' | 'error', text: '' }
  editingJob: null, // job object or null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
      if (!action.payload) {
        state.editingJob = null; // Reset editing job when closing modal
      }
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setEditingJob: (state, action) => {
      state.editingJob = action.payload;
      if (action.payload) {
        state.isModalOpen = true; // Automatically open modal when editing
      }
    },
    clearEditingJob: (state) => {
      state.editingJob = null;
    }
  }
});

export const { 
  setModalOpen, 
  setNotification, 
  clearNotification, 
  setEditingJob, 
  clearEditingJob 
} = uiSlice.actions;

// Helper to display a notification and auto-dismiss after 5 seconds
export const triggerNotification = (type, text) => (dispatch) => {
  dispatch(setNotification({ type, text }));
  setTimeout(() => {
    dispatch(clearNotification());
  }, 5000);
};

export default uiSlice.reducer;
