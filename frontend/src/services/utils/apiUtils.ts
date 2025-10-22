/**
 * WF-COMP-XXX | apiUtils.ts - API utility functions
 * Purpose: Common utility functions for API operations
 * Dependencies: axios, moment
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
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

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface RetryOptions {
  maxRetries?: number;
  backoffMs?: number;
  shouldRetry?: (error: AxiosError) => boolean;
}

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    if (axiosError.response) {
      // Server responded with error
      return {
        message:
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          'An error occurred',
        code: axiosError.code,
        status: axiosError.response.status,
        details: axiosError.response.data,
      };
    }

    if (axiosError.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        code: axiosError.code,
      };
    }

    // Error setting up request
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }

  return {
    message: 'An unknown error occurred',
  };
}

// ==========================================
// DATA EXTRACTION
// ==========================================

/**
 * Extract data from API response
 */
export function extractApiData<T>(response: AxiosResponse): T {
  // Handle different response formats
  if (response.data?.data !== undefined) {
    return response.data.data as T;
  }

  return response.data as T;
}

/**
 * Extract data from API response with null safety
 */
export function extractApiDataOptional<T>(response: AxiosResponse): T | null {
  try {
    return extractApiData<T>(response);
  } catch {
    return null;
  }
}

// ==========================================
// URL BUILDING
// ==========================================

/**
 * Build URL parameters from object
 */
export function buildUrlParams(params?: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (!params) return searchParams;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams;
}

/**
 * Build pagination parameters
 */
export function buildPaginationParams(options?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}): Record<string, unknown> {
  return {
    page: options?.page || 1,
    limit: options?.limit || 10,
    ...(options?.sort && { sort: options.sort }),
    ...(options?.order && { order: options.order }),
  };
}

// ==========================================
// DATE UTILITIES
// ==========================================

/**
 * Format date for API
 */
export function formatDateForApi(date: Date | string): string {
  return moment(date).format('YYYY-MM-DD');
}

/**
 * Parse date from API
 */
export function parseDateFromApi(dateString: string): Date {
  return moment(dateString).toDate();
}

// ==========================================
// RETRY LOGIC
// ==========================================

/**
 * Retry a promise-returning function with exponential backoff
 */
export async function withRetry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
  const maxRetries = options?.maxRetries || 3;
  const backoffMs = options?.backoffMs || 1000;
  const shouldRetry =
    options?.shouldRetry ||
    ((error: AxiosError) => {
      // Retry on network errors or 5xx server errors
      return !error.response || (error.response.status >= 500 && error.response.status < 600);
    });

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      const isAxiosError = (error as AxiosError).isAxiosError;
      if (!isAxiosError || !shouldRetry(error as AxiosError) || attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff with jitter)
      const delay = backoffMs * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed with unknown error');
}

// ==========================================
// FORM DATA
// ==========================================

/**
 * Create FormData from object
 */
export function createFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, String(item));
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Check if response is an API response
 */
export function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  return typeof data === 'object' && data !== null && 'success' in data && 'data' in data;
}

/**
 * Check if response is paginated
 */
export function isPaginatedResponse<T>(data: unknown): data is PaginatedResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'pagination' in data &&
    Array.isArray((data as { data: unknown }).data)
  );
}

// ==========================================
// CACHING
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const apiCache = new SimpleCache();

/**
 * Wrap a function with caching
 */
export function withCache<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = apiCache.get<T>(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fn().then((data) => {
    apiCache.set(key, data, ttl);
    return data;
  });
}

// ==========================================
// DEBOUNCING
// ==========================================

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
