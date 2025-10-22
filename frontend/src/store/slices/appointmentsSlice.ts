import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Appointment {
  id: string;
  patientId: string;
  clientId: string;
  staffId?: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    date?: string;
    status?: string;
    patientId?: string;
    staffId?: string;
  };
}

const initialState: AppointmentsState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (params?: { page?: number; limit?: number; date?: string; status?: string }) => {
    const response = (await api.appointments.getAll(params)) as {
      status: string;
      data: Appointment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
    return response;
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchAppointmentById',
  async (id: string) => {
    const response = (await api.appointments.getById(id)) as {
      status: string;
      data: Appointment;
    };
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (data: Partial<Appointment>) => {
    const response = (await api.appointments.create(data)) as {
      status: string;
      data: Appointment;
    };
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
    const response = (await api.appointments.update(id, data)) as {
      status: string;
      data: Appointment;
    };
    return response.data;
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id: string) => {
    await api.appointments.delete(id);
    return id;
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AppointmentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all appointments
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      });

    // Fetch appointment by ID
    builder
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointment';
      });

    // Create appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create appointment';
      });

    // Update appointment
    builder
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update appointment';
      });

    // Delete appointment
    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
        if (state.selectedAppointment?.id === action.payload) {
          state.selectedAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete appointment';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedAppointment, clearError } =
  appointmentsSlice.actions;

export default appointmentsSlice.reducer;
