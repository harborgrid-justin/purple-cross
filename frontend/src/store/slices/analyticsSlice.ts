/**
 * WF-COMP-XXX | analyticsSlice.ts - analytics Slice
 * Purpose: Redux slice for managing analytics state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface DashboardStats {
  totalPatients: number;
  totalClients: number;
  totalAppointments: number;
  activePatients: number;
  todayAppointments: number;
  pendingInvoices: number;
}

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk('analytics/fetchDashboardStats', async () => {
  const response = (await api.analytics.getDashboard()) as {
    status: string;
    data: DashboardStats;
  };
  return response.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
