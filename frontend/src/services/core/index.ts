/**
 * WF-IDX-XXX | core/index.ts - Core service exports
 * Purpose: Centralized exports for core service modules
 * Last Updated: 2025-10-22 | File Type: .ts
 */

export * from './BaseApiService';
export { BaseApiService } from './BaseApiService';
export type {
  BaseEntity,
  PaginationParams,
  FilterParams,
  CrudOperations
} from './BaseApiService';
