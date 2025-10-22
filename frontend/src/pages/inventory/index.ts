/**
 * WF-COMP-INVENTORY-003 | index.ts - Inventory page exports
 * Purpose: Centralized exports for inventory page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as InventoryMain } from './InventoryMain';
export { default as InventoryDetail } from './InventoryDetail';
export { default as InventoryCreate } from './InventoryCreate';
export { default as InventoryEdit } from './InventoryEdit';

// Route exports
export { default as InventoryRoutes } from './routes';
