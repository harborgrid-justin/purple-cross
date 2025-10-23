/**
 * WF-COMP-XXX | patientsSlice.ts - patients Slice
 * Purpose: Redux slice for managing patients state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  microchipId?: string;
  ownerId: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    species?: string;
    ownerId?: string;
  };
}

const initialState: PatientsState = {
  patients: [],
  selectedPatient: null,
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
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params?: { page?: number; limit?: number; search?: string; ownerId?: string }) => {
    const response = (await api.patients.getAll(params)) as {
      status: string;
      data: Patient[];
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

export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async (id: string) => {
    const response = (await api.patients.getById(id)) as {
      status: string;
      data: Patient;
    };
    return response.data;
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (data: Partial<Patient>) => {
    const response = (await api.patients.create(data)) as {
      status: string;
      data: Patient;
    };
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }: { id: string; data: Partial<Patient> }) => {
    const response = (await api.patients.update(id, data)) as {
      status: string;
      data: Patient;
    };
    return response.data;
  }
);

export const deletePatient = createAsyncThunk('patients/deletePatient', async (id: string) => {
  await api.patients.delete(id);
  return id;
});

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PatientsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      });

    // Fetch patient by ID
    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient';
      });

    // Create patient
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients.unshift(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create patient';
      });

    // Update patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patients.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update patient';
      });

    // Delete patient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter((p) => p.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete patient';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedPatient, clearError } = patientsSlice.actions;

export default patientsSlice.reducer;
