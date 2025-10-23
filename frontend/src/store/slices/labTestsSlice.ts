/**
 * WF-COMP-XXX | labTestsSlice.ts - lab Tests Slice
 * Purpose: Redux slice for managing labTests state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface LabTest {
  id: string;
  patientId: string;
  testType: string;
  status: string;
  results?: string;
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface LabTestsState {
  labTests: LabTest[];
  loading: boolean;
  error: string | null;
}

const initialState: LabTestsState = {
  labTests: [],
  loading: false,
  error: null,
};

export const fetchLabTests = createAsyncThunk('labTests/fetchLabTests', async () => {
  const response = (await api.labTests.getAll()) as { status: string; data: LabTest[] };
  return response;
});

const labTestsSlice = createSlice({
  name: 'labTests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests = action.payload.data;
      })
      .addCase(fetchLabTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lab tests';
      });
  },
});

export default labTestsSlice.reducer;
