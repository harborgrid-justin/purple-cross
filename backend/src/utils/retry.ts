import { logger } from '../config/logger';

/**
 * Retry configuration
 */
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
  name?: string;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  name: 'operation',
};

/**
 * Retry a function with exponential backoff
 * Implements resilient retry pattern for transient failures
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  let delay = finalConfig.initialDelay;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      const result = await fn();

      if (attempt > 1) {
        logger.info({
          message: 'Retry succeeded',
          operation: finalConfig.name,
          attempt,
          totalAttempts: finalConfig.maxAttempts,
        });
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (finalConfig.retryableErrors && finalConfig.retryableErrors.length > 0) {
        const isRetryable = finalConfig.retryableErrors.some((retryableError) =>
          lastError?.message.includes(retryableError)
        );

        if (!isRetryable) {
          logger.warn({
            message: 'Non-retryable error encountered',
            operation: finalConfig.name,
            error: lastError.message,
            attempt,
          });
          throw lastError;
        }
      }

      if (attempt < finalConfig.maxAttempts) {
        logger.warn({
          message: 'Retry attempt failed, will retry',
          operation: finalConfig.name,
          attempt,
          maxAttempts: finalConfig.maxAttempts,
          nextRetryIn: `${delay}ms`,
          error: lastError.message,
        });

        // Wait with exponential backoff
        await sleep(delay);

        // Calculate next delay with exponential backoff
        delay = Math.min(delay * finalConfig.backoffMultiplier, finalConfig.maxDelay);
      } else {
        logger.error({
          message: 'All retry attempts failed',
          operation: finalConfig.name,
          attempts: attempt,
          error: lastError.message,
        });
      }
    }
  }

  throw lastError || new Error('Retry failed without error');
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with jitter to prevent thundering herd problem
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  let baseDelay = finalConfig.initialDelay;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      const result = await fn();

      if (attempt > 1) {
        logger.info({
          message: 'Retry with jitter succeeded',
          operation: finalConfig.name,
          attempt,
        });
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < finalConfig.maxAttempts) {
        // Add jitter (random value between 0 and baseDelay)
        const jitter = Math.random() * baseDelay;
        const delay = Math.min(baseDelay + jitter, finalConfig.maxDelay);

        logger.warn({
          message: 'Retry with jitter attempt failed',
          operation: finalConfig.name,
          attempt,
          nextRetryIn: `${Math.round(delay)}ms`,
          error: lastError.message,
        });

        await sleep(delay);
        baseDelay = Math.min(baseDelay * finalConfig.backoffMultiplier, finalConfig.maxDelay);
      }
    }
  }

  throw lastError || new Error('Retry with jitter failed');
}
