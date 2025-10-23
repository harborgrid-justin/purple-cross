/**
 * WF-COMP-INTEGRATIONS-003 | index.ts - Integrations page exports
 * Purpose: Centralized exports for integrations page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as IntegrationsMain } from './IntegrationsMain';
export { default as IntegrationsDetail } from './IntegrationsDetail';
export { default as IntegrationsCreate } from './IntegrationsCreate';
export { default as IntegrationsEdit } from './IntegrationsEdit';
export { default as WorkflowBuilder } from './WorkflowBuilder';
export { default as WorkflowTemplates } from './WorkflowTemplates';

// Route exports
export { default as IntegrationsRoutes } from './routes';
