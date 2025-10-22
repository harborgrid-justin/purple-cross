/**
 * WF-COMP-016 | index.ts - Patients page exports
 * Purpose: Centralized exports for patients page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as PatientsMain } from './PatientsMain';
export { default as PatientsDetail } from './PatientsDetail';
export { default as PatientsCreate } from './PatientsCreate';
export { default as PatientsEdit } from './PatientsEdit';

// Route exports
export { default as PatientsRoutes } from './routes';
