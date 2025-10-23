/**
 * WF-COMP-XXX | communicationsSlice.ts - communications Slice
 * Purpose: Redux slice for managing communications state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Communication {
  id: string;
  clientId: string;
  type: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CommunicationsState {
  communications: Communication[];
  loading: boolean;
  error: string | null;
}

const initialState: CommunicationsState = {
  communications: [],
  loading: false,
  error: null,
};

export const fetchCommunications = createAsyncThunk(
  'communications/fetchCommunications',
  async () => {
    const response = (await api.communications.getAll()) as {
      status: string;
      data: Communication[];
    };
    return response;
  }
);

const communicationsSlice = createSlice({
  name: 'communications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunications.fulfilled, (state, action) => {
        state.loading = false;
        state.communications = action.payload.data;
      })
      .addCase(fetchCommunications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch communications';
      });
  },
});

export default communicationsSlice.reducer;
