/**
 * WF-COMP-XXX | inventorySlice.ts - inventory Slice
 * Purpose: Redux slice for managing inventory state
 * Dependencies: @reduxjs/toolkit
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

export const fetchInventoryItems = createAsyncThunk(
  'inventory/fetchInventoryItems',
  async (params?: { category?: string }) => {
    const response = (await api.inventory.getAll(params)) as {
      status: string;
      data: InventoryItem[];
    };
    return response;
  }
);

export const fetchInventoryItemById = createAsyncThunk(
  'inventory/fetchInventoryItemById',
  async (id: string) => {
    const response = (await api.inventory.getById(id)) as {
      status: string;
      data: InventoryItem;
    };
    return response.data;
  }
);

export const createInventoryItem = createAsyncThunk(
  'inventory/createInventoryItem',
  async (data: Partial<InventoryItem>) => {
    const response = (await api.inventory.create(data)) as {
      status: string;
      data: InventoryItem;
    };
    return response.data;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inventory items';
      })
      .addCase(fetchInventoryItemById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
