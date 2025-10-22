import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface StaffState {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: [],
  loading: false,
  error: null,
};

export const fetchStaff = createAsyncThunk('staff/fetchStaff', async () => {
  const response = (await api.staff.getAll()) as { status: string; data: StaffMember[] };
  return response;
});

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload.data;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staff';
      });
  },
});

export default staffSlice.reducer;
