/**
 * WF-COMP-MEDICALRECORDS-003 | index.ts - MedicalRecords page exports
 * Purpose: Centralized exports for medical-records page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as MedicalRecordsMain } from './MedicalRecordsMain';
export { default as MedicalRecordsDetail } from './MedicalRecordsDetail';
export { default as MedicalRecordsCreate } from './MedicalRecordsCreate';
export { default as MedicalRecordsEdit } from './MedicalRecordsEdit';

// Route exports
export { default as MedicalRecordsRoutes } from './routes';
