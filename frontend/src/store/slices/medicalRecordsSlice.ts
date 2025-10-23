/**
 * WF-COMP-XXX | medicalRecordsSlice.ts - medical Records Slice
 * Purpose: Redux slice for managing medicalRecords state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  veterinarianId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MedicalRecordsState {
  records: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  loading: boolean;
  error: string | null;
  filters: {
    patientId?: string;
  };
}

const initialState: MedicalRecordsState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchMedicalRecords',
  async (params?: { patientId?: string }) => {
    const response = (await api.medicalRecords.getAll(params)) as {
      status: string;
      data: MedicalRecord[];
    };
    return response;
  }
);

export const fetchMedicalRecordById = createAsyncThunk(
  'medicalRecords/fetchMedicalRecordById',
  async (id: string) => {
    const response = (await api.medicalRecords.getById(id)) as {
      status: string;
      data: MedicalRecord;
    };
    return response.data;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'medicalRecords/createMedicalRecord',
  async (data: Partial<MedicalRecord>) => {
    const response = (await api.medicalRecords.create(data)) as {
      status: string;
      data: MedicalRecord;
    };
    return response.data;
  }
);

export const updateMedicalRecord = createAsyncThunk(
  'medicalRecords/updateMedicalRecord',
  async ({ id, data }: { id: string; data: Partial<MedicalRecord> }) => {
    const response = (await api.medicalRecords.update(id, data)) as {
      status: string;
      data: MedicalRecord;
    };
    return response.data;
  }
);

export const deleteMedicalRecord = createAsyncThunk(
  'medicalRecords/deleteMedicalRecord',
  async (id: string) => {
    await api.medicalRecords.delete(id);
    return id;
  }
);

const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MedicalRecordsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedRecord: (state) => {
      state.selectedRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medical records';
      })
      .addCase(fetchMedicalRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
      })
      .addCase(updateMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        if (state.selectedRecord?.id === action.payload.id) {
          state.selectedRecord = action.payload;
        }
      })
      .addCase(deleteMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter((r) => r.id !== action.payload);
        if (state.selectedRecord?.id === action.payload) {
          state.selectedRecord = null;
        }
      });
  },
});

export const { setFilters, clearFilters, clearSelectedRecord, clearError } =
  medicalRecordsSlice.actions;

export default medicalRecordsSlice.reducer;
