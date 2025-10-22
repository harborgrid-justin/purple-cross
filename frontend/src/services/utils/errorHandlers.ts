/**
 * WF-COMP-XXX | errorHandlers.ts - Error handling utilities
 * Purpose: Centralized error handling and transformation
 * Dependencies: axios
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosError } from 'axios';
import { HTTP_STATUS } from '../../constants';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  timestamp: number;
}

// ==========================================
// ERROR CLASSIFICATION
// ==========================================

/**
 * Classify error by type
 */
export function classifyError(error: AxiosError): ErrorType {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return ErrorType.TIMEOUT;
    }
    return ErrorType.NETWORK;
  }
  
  const status = error.response.status;
  
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return ErrorType.AUTHENTICATION;
  }
  
  if (status === HTTP_STATUS.FORBIDDEN) {
    return ErrorType.AUTHORIZATION;
  }
  
  if (status === HTTP_STATUS.NOT_FOUND) {
    return ErrorType.NOT_FOUND;
  }
  
  if (status === HTTP_STATUS.BAD_REQUEST) {
    return ErrorType.VALIDATION;
  }
  
  if (status >= 500) {
    return ErrorType.SERVER;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Transform axios error to app error
 */
export function transformError(error: unknown): AppError {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    if (axiosError.isAxiosError) {
      const errorType = classifyError(axiosError);
      
      return {
        type: errorType,
        message: axiosError.response?.data?.message || 
                 axiosError.response?.data?.error || 
                 axiosError.message || 
                 'An error occurred',
        code: axiosError.code,
        status: axiosError.response?.status,
        details: axiosError.response?.data,
        timestamp: Date.now(),
      };
    }
    
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      timestamp: Date.now(),
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unknown error occurred',
    timestamp: Date.now(),
  };
}

// ==========================================
// USER-FRIENDLY MESSAGES
// ==========================================

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection.';
      
    case ErrorType.TIMEOUT:
      return 'Request timed out. Please try again.';
      
    case ErrorType.AUTHENTICATION:
      return 'You need to log in to access this resource.';
      
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
      
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
      
    case ErrorType.VALIDATION:
      return error.message || 'Please check your input and try again.';
      
    case ErrorType.SERVER:
      return 'A server error occurred. Please try again later.';
      
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

// ==========================================
// ERROR LOGGING
// ==========================================

/**
 * Log error to console in development
 */
export function logError(error: AppError, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, {
      type: error.type,
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      timestamp: new Date(error.timestamp).toISOString(),
    });
  }
}

// ==========================================
// ERROR RECOVERY
// ==========================================

/**
 * Determine if error is recoverable
 */
export function isRecoverableError(error: AppError): boolean {
  return [
    ErrorType.NETWORK,
    ErrorType.TIMEOUT,
    ErrorType.SERVER,
  ].includes(error.type);
}

/**
 * Determine if error requires authentication
 */
export function requiresAuthentication(error: AppError): boolean {
  return error.type === ErrorType.AUTHENTICATION;
}

/**
 * Determine if error is a validation error
 */
export function isValidationError(error: AppError): boolean {
  return error.type === ErrorType.VALIDATION;
}
