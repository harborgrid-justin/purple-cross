/**
 * WF-COMP-MEDICALRECORDS-001 | index.ts - MedicalRecords store exports
 * Purpose: Centralized exports for medical-records store module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Re-export from the main store slice
export {
  default as medicalRecordsReducer,
  fetchMedicalRecords,
  fetchMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  setFilters,
  clearFilters,
  clearSelectedRecord,
  clearError,
} from '../../../store/slices/medicalRecordsSlice';
