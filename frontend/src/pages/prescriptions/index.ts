/**
 * WF-COMP-PRESCRIPTIONS-003 | index.ts - Prescriptions page exports
 * Purpose: Centralized exports for prescriptions page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as PrescriptionsMain } from './PrescriptionsMain';
export { default as PrescriptionsDetail } from './PrescriptionsDetail';
export { default as PrescriptionsCreate } from './PrescriptionsCreate';
export { default as PrescriptionsEdit } from './PrescriptionsEdit';

// Route exports
export { default as PrescriptionsRoutes } from './routes';
