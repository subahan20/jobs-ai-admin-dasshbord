'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobsReducer from './jobsSlice';
import uiReducer from './uiSlice';
import aiSearchReducer from './aiSearchSlice';
import adminSyncReducer from './adminSyncSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    ui: uiReducer,
    aiSearch: aiSearchReducer,
    adminSync: adminSyncReducer,
  },
});
