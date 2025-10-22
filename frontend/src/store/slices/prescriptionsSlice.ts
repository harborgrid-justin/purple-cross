import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  prescribedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionsState {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionsState = {
  prescriptions: [],
  selectedPrescription: null,
  loading: false,
  error: null,
};

export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchPrescriptions',
  async (params?: { patientId?: string }) => {
    const response = (await api.prescriptions.getAll(params)) as {
      status: string;
      data: Prescription[];
    };
    return response;
  }
);

export const fetchPrescriptionById = createAsyncThunk(
  'prescriptions/fetchPrescriptionById',
  async (id: string) => {
    const response = (await api.prescriptions.getById(id)) as {
      status: string;
      data: Prescription;
    };
    return response.data;
  }
);

export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (data: Partial<Prescription>) => {
    const response = (await api.prescriptions.create(data)) as {
      status: string;
      data: Prescription;
    };
    return response.data;
  }
);

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload.data;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch prescriptions';
      })
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.selectedPrescription = action.payload;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.prescriptions.unshift(action.payload);
      });
  },
});

export const { clearError } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer;
