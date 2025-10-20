'use strict';
/**
 * Retry Pattern Usage Examples
 * Demonstrates how to use retry logic with exponential backoff
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.fetchWithRetry = fetchWithRetry;
exports.retryableOperation = retryableOperation;
exports.distributedSystemCall = distributedSystemCall;
exports.saveToDatabase = saveToDatabase;
exports.uploadFile = uploadFile;
exports.resilientApiCall = resilientApiCall;
exports.exampleWithCallback = exampleWithCallback;
const retry_1 = require('../src/utils/retry');
const logger_1 = require('../src/config/logger');
// Example 1: Basic Retry for API Calls
async function fetchWithRetry(url) {
  try {
    const result = await (0, retry_1.retry)(
      async () => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        name: 'api-fetch',
      }
    );
    return result;
  } catch (error) {
    logger_1.logger.error({
      message: 'All retry attempts failed',
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
// Example 2: Retry with Specific Error Types
async function retryableOperation() {
  return await (0, retry_1.retry)(
    async () => {
      // Simulated operation that might fail
      const random = Math.random();
      if (random < 0.3) {
        throw new Error('ETIMEDOUT: Connection timeout');
      }
      if (random < 0.5) {
        throw new Error('ECONNREFUSED: Connection refused');
      }
      if (random < 0.6) {
        throw new Error('INVALID_TOKEN: Authentication failed');
      }
      return { success: true };
    },
    {
      maxAttempts: 5,
      initialDelay: 500,
      retryableErrors: ['ETIMEDOUT', 'ECONNREFUSED'], // Only retry these
      name: 'database-connection',
    }
  );
}
// Example 3: Retry with Jitter for Distributed Systems
async function distributedSystemCall() {
  // Use jitter to prevent thundering herd problem
  return await (0, retry_1.retryWithJitter)(
    async () => {
      // Your distributed system call here
      throw new Error('Not implemented');
    },
    {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      name: 'distributed-call',
    }
  );
}
async function saveToDatabase(record) {
  return await (0, retry_1.retry)(
    async () => {
      // Your database save operation
      // await prisma.record.create({ data: record });
      logger_1.logger.info({
        message: 'Database save successful',
        recordId: record.id,
      });
      return record;
    },
    {
      maxAttempts: 3,
      initialDelay: 500,
      maxDelay: 3000,
      backoffMultiplier: 2,
      name: 'database-save',
    }
  );
}
// Example 5: Retry for File Operations
async function uploadFile(filePath, destination) {
  return await (0, retry_1.retryWithJitter)(
    async () => {
      // Simulated file upload
      const random = Math.random();
      if (random < 0.4) {
        throw new Error('Network error during upload');
      }
      logger_1.logger.info({
        message: 'File upload successful',
        filePath,
        destination,
      });
      return { url: `https://cdn.example.com/${destination}` };
    },
    {
      maxAttempts: 5,
      initialDelay: 2000,
      maxDelay: 30000,
      backoffMultiplier: 3,
      name: 'file-upload',
    }
  );
}
// Example 6: Combining Retry with Circuit Breaker
const circuit_breaker_1 = require('../src/utils/circuit-breaker');
const apiBreaker = (0, circuit_breaker_1.createCircuitBreaker)('resilient-api');
async function resilientApiCall(endpoint) {
  // First, check circuit breaker
  return await apiBreaker.execute(async () => {
    // Then, retry on failures
    return await (0, retry_1.retry)(
      async () => {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('API error');
        return await response.json();
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        name: 'resilient-api-call',
      }
    );
  });
}
// Example 7: Custom Retry Logic with Callback
async function retryWithCallback(operation, onRetry) {
  return await (0, retry_1.retry)(
    async () => {
      try {
        return await operation();
      } catch (error) {
        if (onRetry && error instanceof Error) {
          onRetry(1, error); // Would need to track attempt number
        }
        throw error;
      }
    },
    {
      maxAttempts: 3,
      initialDelay: 1000,
      name: 'custom-retry',
    }
  );
}
// Usage example
async function exampleWithCallback() {
  await retryWithCallback(
    async () => {
      // Your operation
      throw new Error('Temporary failure');
    },
    (attempt, error) => {
      logger_1.logger.warn({
        message: 'Retry callback triggered',
        attempt,
        error: error.message,
      });
    }
  );
}
//# sourceMappingURL=retry-example.js.map
