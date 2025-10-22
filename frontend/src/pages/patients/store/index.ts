/**
 * WF-COMP-010 | index.ts - Patients store exports
 * Purpose: Centralized exports for patients store module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Re-export from the main store slice
export {
  default as patientsReducer,
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  setFilters,
  clearFilters,
  clearSelectedPatient,
  clearError,
} from '../../../store/slices/patientsSlice';
