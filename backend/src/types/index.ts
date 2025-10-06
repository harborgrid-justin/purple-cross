// Import Prisma namespace and types
import type { Prisma } from '@prisma/client';

// Re-export Prisma namespace for convenience
export { Prisma };

// Service data types
export type CreateData = Record<string, unknown>;
export type UpdateData = Record<string, unknown>;
export type FilterData = Record<string, unknown>;
export type QueryData = Record<string, unknown>;

// API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
}
