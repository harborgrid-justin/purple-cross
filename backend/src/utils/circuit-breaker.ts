import { logger } from '../config/logger';

/**
 * Circuit breaker states
 */
enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Failures detected, reject requests
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

/**
 * Circuit breaker configuration
 */
interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  successThreshold: number; // Number of successes to close circuit from half-open
  timeout: number; // Time in ms before attempting to close circuit
  name: string; // Name for logging
}

/**
 * Circuit breaker implementation following the Circuit Breaker pattern
 * Prevents cascading failures in distributed systems
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private nextAttempt: number = Date.now();
  private readonly config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        const error = new Error(`Circuit breaker is OPEN for ${this.config.name}`);
        logger.warn({
          message: 'Circuit breaker prevented request',
          circuitBreaker: this.config.name,
          state: this.state,
        });
        throw error;
      }
      // Try to recover
      this.state = CircuitState.HALF_OPEN;
      logger.info({
        message: 'Circuit breaker entering HALF_OPEN state',
        circuitBreaker: this.config.name,
      });
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        logger.info({
          message: 'Circuit breaker closed after successful recovery',
          circuitBreaker: this.config.name,
        });
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.config.timeout;

      logger.error({
        message: 'Circuit breaker opened due to failures',
        circuitBreaker: this.config.name,
        failureCount: this.failureCount,
        nextAttemptIn: `${this.config.timeout}ms`,
      });
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get circuit breaker statistics
   */
  getStats() {
    return {
      name: this.config.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt:
        this.state === CircuitState.OPEN ? new Date(this.nextAttempt).toISOString() : null,
    };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();

    logger.info({
      message: 'Circuit breaker manually reset',
      circuitBreaker: this.config.name,
    });
  }
}

/**
 * Create a circuit breaker with default configuration
 */
export function createCircuitBreaker(
  name: string,
  partialConfig?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  const config: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000, // 1 minute
    name,
    ...partialConfig,
  };

  return new CircuitBreaker(config);
}
