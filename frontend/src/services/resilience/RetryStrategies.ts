/**
 * WF-COMP-XXX | RetryStrategies.ts - Retry logic
 * Purpose: Various retry strategies for failed requests
 * Dependencies: axios
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosError } from 'axios';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  multiplier?: number;
  jitter?: boolean;
  shouldRetry?: (error: AxiosError, attemptNumber: number) => boolean;
  onRetry?: (error: AxiosError, attemptNumber: number, delay: number) => void;
}

export interface RetryStats {
  attempts: number;
  totalDelay: number;
  success: boolean;
  error?: Error;
}

// ==========================================
// RETRY STRATEGY TYPES
// ==========================================

export enum RetryStrategy {
  EXPONENTIAL_BACKOFF = 'EXPONENTIAL_BACKOFF',
  LINEAR_BACKOFF = 'LINEAR_BACKOFF',
  FIXED_DELAY = 'FIXED_DELAY',
  FIBONACCI = 'FIBONACCI',
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Add jitter to delay
 */
function addJitter(delay: number): number {
  return delay + Math.random() * 1000;
}

/**
 * Cap delay at maximum
 */
function capDelay(delay: number, maxDelay: number): number {
  return Math.min(delay, maxDelay);
}

/**
 * Default retry condition
 */
function defaultShouldRetry(error: AxiosError): boolean {
  // Don't retry on client errors (4xx) except timeout
  if (error.response) {
    const status = error.response.status;
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return false;
    }
  }
  
  // Retry on network errors, timeouts, and 5xx errors
  return !error.response || 
         error.code === 'ECONNABORTED' || 
         error.response.status >= 500;
}

// ==========================================
// DELAY CALCULATORS
// ==========================================

/**
 * Calculate exponential backoff delay
 */
export function calculateExponentialBackoff(
  attempt: number,
  initialDelay: number,
  multiplier: number,
  maxDelay: number,
  jitter: boolean
): number {
  let delay = initialDelay * Math.pow(multiplier, attempt);
  delay = capDelay(delay, maxDelay);
  
  if (jitter) {
    delay = addJitter(delay);
  }
  
  return delay;
}

/**
 * Calculate linear backoff delay
 */
export function calculateLinearBackoff(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  jitter: boolean
): number {
  let delay = initialDelay * (attempt + 1);
  delay = capDelay(delay, maxDelay);
  
  if (jitter) {
    delay = addJitter(delay);
  }
  
  return delay;
}

/**
 * Calculate fibonacci backoff delay
 */
export function calculateFibonacciBackoff(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  jitter: boolean
): number {
  const fib = (n: number): number => {
    if (n <= 1) return 1;
    return fib(n - 1) + fib(n - 2);
  };
  
  let delay = initialDelay * fib(attempt);
  delay = capDelay(delay, maxDelay);
  
  if (jitter) {
    delay = addJitter(delay);
  }
  
  return delay;
}

// ==========================================
// RETRY EXECUTOR
// ==========================================

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    multiplier = 2,
    jitter = true,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = config;
  
  let lastError: Error;
  let totalDelay = 0;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const axiosError = error as AxiosError;
      
      // Check if we should retry
      if (attempt < maxRetries && (!axiosError.isAxiosError || shouldRetry(axiosError, attempt))) {
        // Calculate delay
        const delay = calculateExponentialBackoff(attempt, initialDelay, multiplier, maxDelay, jitter);
        totalDelay += delay;
        
        // Call retry callback
        if (onRetry) {
          onRetry(axiosError, attempt + 1, delay);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Log retry in development
        if (import.meta.env.DEV) {
          console.warn(`[RetryStrategies] Retrying request (attempt ${attempt + 2}/${maxRetries + 1}) after ${delay}ms`);
        }
      } else {
        throw error;
      }
    }
  }
  
  throw lastError!;
}

/**
 * Create a retry function with specific strategy
 */
export function createRetryFunction(strategy: RetryStrategy, config: RetryConfig = {}) {
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      multiplier = 2,
      jitter = true,
      shouldRetry = defaultShouldRetry,
      onRetry,
    } = config;
    
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        const axiosError = error as AxiosError;
        
        if (attempt < maxRetries && (!axiosError.isAxiosError || shouldRetry(axiosError, attempt))) {
          let delay: number;
          
          switch (strategy) {
            case RetryStrategy.LINEAR_BACKOFF:
              delay = calculateLinearBackoff(attempt, initialDelay, maxDelay, jitter);
              break;
            case RetryStrategy.FIXED_DELAY:
              delay = jitter ? addJitter(initialDelay) : initialDelay;
              break;
            case RetryStrategy.FIBONACCI:
              delay = calculateFibonacciBackoff(attempt, initialDelay, maxDelay, jitter);
              break;
            case RetryStrategy.EXPONENTIAL_BACKOFF:
            default:
              delay = calculateExponentialBackoff(attempt, initialDelay, multiplier, maxDelay, jitter);
              break;
          }
          
          if (onRetry) {
            onRetry(axiosError, attempt + 1, delay);
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    
    throw lastError!;
  };
}

// ==========================================
// PRE-CONFIGURED RETRY FUNCTIONS
// ==========================================

/**
 * Quick retry (3 attempts, 1s delay)
 */
export const quickRetry = createRetryFunction(RetryStrategy.EXPONENTIAL_BACKOFF, {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
});

/**
 * Standard retry (5 attempts, 2s delay)
 */
export const standardRetry = createRetryFunction(RetryStrategy.EXPONENTIAL_BACKOFF, {
  maxRetries: 5,
  initialDelay: 2000,
  maxDelay: 30000,
});

/**
 * Aggressive retry (10 attempts, 500ms delay)
 */
export const aggressiveRetry = createRetryFunction(RetryStrategy.EXPONENTIAL_BACKOFF, {
  maxRetries: 10,
  initialDelay: 500,
  maxDelay: 10000,
});
