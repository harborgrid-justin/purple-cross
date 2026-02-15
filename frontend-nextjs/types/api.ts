/**
 * API Response Types
 * Standardized response formats from the NestJS backend API
 */

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T = unknown> {
  status: 'success';
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: ApiError[];
}

/**
 * Type guard to check if response is an API error
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    (response as ApiErrorResponse).status === 'error'
  );
}

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is Required<ApiResponse<T>> {
  return response.status === 'success' && 'data' in response;
}

/**
 * Type guard to check if response is paginated
 */
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as PaginatedResponse<T>).data)
  );
}
