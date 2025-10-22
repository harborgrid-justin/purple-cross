import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Invoice {
  id: string;
  clientId: string;
  patientId?: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoicesState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices', async () => {
  const response = (await api.invoices.getAll()) as { status: string; data: Invoice[] };
  return response;
});

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      });
  },
});

export default invoicesSlice.reducer;
