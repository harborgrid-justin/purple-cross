/**
 * Global Error Handler
 * Purpose: Centralized error handling and logging for production
 */

import { AxiosError } from 'axios';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  CLIENT = 'CLIENT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Error logging service interface
 * Can be implemented with Sentry, LogRocket, etc.
 */
interface ErrorLogger {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void;
}

/**
 * Console-based error logger (development)
 */
class ConsoleErrorLogger implements ErrorLogger {
  captureException(error: Error, context?: Record<string, unknown>): void {
    console.error('[Error]', error.message, {
      error,
      context,
      stack: error.stack,
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void {
    const logFn = console[level] || console.log;
    logFn(`[${level.toUpperCase()}]`, message);
  }
}

/**
 * Sentry error logger (production)
 * Uncomment and configure when Sentry is set up
 */
/*
import * as Sentry from '@sentry/react';

class SentryErrorLogger implements ErrorLogger {
  captureException(error: Error, context?: Record<string, unknown>): void {
    Sentry.captureException(error, {
      extra: context,
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void {
    Sentry.captureMessage(message, level);
  }
}
*/

/**
 * Get appropriate error logger based on environment
 */
function getErrorLogger(): ErrorLogger {
  // In production, use Sentry or other service
  // return new SentryErrorLogger();

  // For now, use console logger
  return new ConsoleErrorLogger();
}

const errorLogger = getErrorLogger();

/**
 * Categorize error by type
 */
export function categorizeError(error: unknown): ErrorType {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;

    if (!statusCode) {
      return ErrorType.NETWORK;
    }

    if (statusCode === 401) {
      return ErrorType.AUTHENTICATION;
    }

    if (statusCode === 403) {
      return ErrorType.AUTHORIZATION;
    }

    if (statusCode === 404) {
      return ErrorType.NOT_FOUND;
    }

    if (statusCode >= 400 && statusCode < 500) {
      return ErrorType.CLIENT;
    }

    if (statusCode >= 500) {
      return ErrorType.SERVER;
    }
  }

  return ErrorType.UNKNOWN;
}

/**
 * Extract user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // API error response
    const message = error.response?.data?.message || error.response?.data?.error;
    if (message) {
      return String(message);
    }

    // Network error
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Generic HTTP error
    const statusCode = error.response?.status;
    if (statusCode) {
      return `Request failed with status ${statusCode}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle and log error
 */
export function handleError(error: unknown, context?: Record<string, unknown>): void {
  const errorType = categorizeError(error);
  const message = getErrorMessage(error);

  // Log to error tracking service
  if (error instanceof Error) {
    errorLogger.captureException(error, {
      type: errorType,
      message,
      ...context,
    });
  } else {
    errorLogger.captureMessage(`${errorType}: ${message}`, 'error');
  }

  // Don't show error UI for certain types
  if (errorType === ErrorType.AUTHENTICATION) {
    // Redirect to login handled by axios interceptor
    return;
  }

  // Additional error-specific handling
  switch (errorType) {
    case ErrorType.NETWORK:
      // Show network error toast/notification
      break;
    case ErrorType.VALIDATION:
      // Form validation errors are handled in components
      break;
    default:
      // Show generic error notification
      break;
  }
}

/**
 * Global error boundary error handler
 */
export function handleGlobalError(error: Error, errorInfo: React.ErrorInfo): void {
  errorLogger.captureException(error, {
    componentStack: errorInfo.componentStack,
    type: ErrorType.CLIENT,
  });
}

/**
 * Unhandled promise rejection handler
 */
export function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const error = event.reason;
  handleError(error, {
    type: 'unhandled_rejection',
    promise: event.promise,
  });
}

/**
 * Global error event handler
 */
export function handleGlobalErrorEvent(event: ErrorEvent): void {
  handleError(event.error || new Error(event.message), {
    type: 'global_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
}

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers(): void {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Global errors
  window.addEventListener('error', handleGlobalErrorEvent);
}

/**
 * Cleanup global error handlers
 */
export function cleanupGlobalErrorHandlers(): void {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  window.removeEventListener('error', handleGlobalErrorEvent);
}

/**
 * Utility to wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error; // Re-throw so caller can handle it too
    }
  }) as T;
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error instanceof AxiosError && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      // Calculate backoff delay
      const delay = initialDelay * Math.pow(2, attempt);

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * delay * 0.1;
      const totalDelay = delay + jitter;

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, totalDelay));

      errorLogger.captureMessage(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${totalDelay}ms`,
        'info'
      );
    }
  }

  throw lastError;
}
