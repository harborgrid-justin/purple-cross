/**
 * WF-COMP-XXX | clientsSlice.ts - clients Slice
 * Purpose: Redux slice for managing clients state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
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
  };
}

const initialState: ClientsState = {
  clients: [],
  selectedClient: null,
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
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = (await api.clients.getAll(params)) as {
      status: string;
      data: Client[];
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

export const fetchClientById = createAsyncThunk('clients/fetchClientById', async (id: string) => {
  const response = (await api.clients.getById(id)) as {
    status: string;
    data: Client;
  };
  return response.data;
});

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (data: Partial<Client>) => {
    const response = (await api.clients.create(data)) as {
      status: string;
      data: Client;
    };
    return response.data;
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }: { id: string; data: Partial<Client> }) => {
    const response = (await api.clients.update(id, data)) as {
      status: string;
      data: Client;
    };
    return response.data;
  }
);

export const deleteClient = createAsyncThunk('clients/deleteClient', async (id: string) => {
  await api.clients.delete(id);
  return id;
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ClientsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      });

    // Fetch client by ID
    builder
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch client';
      });

    // Create client
    builder
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create client';
      });

    // Update client
    builder
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.selectedClient?.id === action.payload.id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update client';
      });

    // Delete client
    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((c) => c.id !== action.payload);
        if (state.selectedClient?.id === action.payload) {
          state.selectedClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete client';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedClient, clearError } = clientsSlice.actions;

export default clientsSlice.reducer;
