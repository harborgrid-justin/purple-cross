/**
 * WF-COMP-030 | index.ts - Appointments store exports
 * Purpose: Centralized exports for appointments store module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Re-export from the main store slice
export {
  default as appointmentsReducer,
  fetchAppointments,
  fetchAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  setFilters,
  clearFilters,
  clearSelectedAppointment,
  clearError,
} from '../../../store/slices/appointmentsSlice';
