import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  patientId?: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async () => {
  const response = (await api.documents.getAll()) as { status: string; data: Document[] };
  return response;
});

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      });
  },
});

export default documentsSlice.reducer;
