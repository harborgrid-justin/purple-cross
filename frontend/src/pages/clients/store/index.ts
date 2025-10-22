/**
 * WF-COMP-Clients-001 | index.ts - Clients store exports
 * Purpose: Centralized exports for clients store module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Re-export from the main store slice
export {
  default as clientsReducer,
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  setFilters,
  clearFilters,
  clearSelectedClient,
  clearError,
} from '../../../store/slices/clientsSlice';
