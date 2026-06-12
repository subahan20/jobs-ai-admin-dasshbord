import { createSlice } from '@reduxjs/toolkit';
import { fetchAiSearchJobs, runAiSearch } from './aiSearchActions';

const initialState = {
  jobs: [],
  byPlatform: {},
  isSearching: false,
  isLoadingCache: false,
  searchLogs: [],
  searchProgress: 0,
  hasSearched: false,
  error: null,
};

const aiSearchSlice = createSlice({
  name: 'aiSearch',
  initialState,
  reducers: {
    clearAiSearchError(state) {
      state.error = null;
    },
    setAiSearchProgress(state, { payload }) {
      state.searchProgress = payload?.progress ?? state.searchProgress;
      if (Array.isArray(payload?.logs)) {
        state.searchLogs = payload.logs;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiSearchJobs.pending, (state) => {
        state.isLoadingCache = true;
        state.error = null;
      })
      .addCase(fetchAiSearchJobs.fulfilled, (state, { payload }) => {
        state.isLoadingCache = false;
        state.jobs = payload?.jobs || [];
        state.byPlatform = payload?.byPlatform || {};
        if (state.jobs.length > 0) {
          state.hasSearched = true;
        }
      })
      .addCase(fetchAiSearchJobs.rejected, (state, { payload }) => {
        state.isLoadingCache = false;
        state.error = payload;
      })
      .addCase(runAiSearch.pending, (state) => {
        state.isSearching = true;
        state.searchProgress = 0;
        state.searchLogs = [];
        state.error = null;
        state.hasSearched = true;
      })
      .addCase(runAiSearch.fulfilled, (state, { payload }) => {
        state.isSearching = false;
        state.searchProgress = 100;
        state.jobs = payload?.jobs || [];
        state.byPlatform = payload?.byPlatform || {};
        state.searchLogs = payload?.logs || [];
      })
      .addCase(runAiSearch.rejected, (state, { payload }) => {
        state.isSearching = false;
        state.searchProgress = 100;
        state.error = payload;
        state.jobs = [];
        state.byPlatform = {};
      });
  },
});

export const { clearAiSearchError, setAiSearchProgress } = aiSearchSlice.actions;
export default aiSearchSlice.reducer;
