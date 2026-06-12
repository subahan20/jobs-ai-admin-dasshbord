import { createAsyncThunk } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../config/api';
import { mapAiSearchResponse } from '../lib/mapAiSearchJob';
import { pollAiSearchStatus } from '../lib/pollAiSearchStatus';
import { setAiSearchProgress } from './aiSearchSlice';

const AI_SEARCH_URL = `${BACKEND_URL}/ai-search`;

export const fetchAiSearchJobs = createAsyncThunk(
  'aiSearch/fetchAiSearchJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.session?.token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const response = await fetch(AI_SEARCH_URL, { headers });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to load AI search jobs');
      }

      return mapAiSearchResponse(result);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load AI search jobs');
    }
  }
);

export const runAiSearch = createAsyncThunk(
  'aiSearch/runAiSearch',
  async ({ role, skills = '', experience = 0, location = '' }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      const token = auth.session?.token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const triggerRes = await fetch(AI_SEARCH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ role, skills, experience, location }),
      });

      const triggerData = await triggerRes.json();
      if (!triggerRes.ok || !triggerData?.success || !triggerData?.searchId) {
        throw new Error(triggerData?.message || 'Failed to start AI search');
      }

      return pollAiSearchStatus({
        searchId: triggerData.searchId,
        headers,
        aiSearchUrl: AI_SEARCH_URL,
        onProgress: (payload) => dispatch(setAiSearchProgress(payload)),
      });
    } catch (error) {
      return rejectWithValue(error?.message || 'AI search failed');
    }
  }
);
