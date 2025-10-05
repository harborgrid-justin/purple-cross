/**
 * Circuit Breaker Usage Examples
 * Demonstrates how to use the circuit breaker pattern for resilient external service calls
 */

import { createCircuitBreaker } from '../src/utils/circuitBreaker';
import { logger } from '../src/config/logger';

// Example 1: Basic Circuit Breaker for External API
const externalApiBreaker = createCircuitBreaker('external-api', {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000,
});

async function fetchFromExternalAPI(endpoint: string) {
  try {
    const result = await externalApiBreaker.execute(async () => {
      const response = await fetch(`https://api.example.com${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });

    logger.info({
      message: 'External API call successful',
      endpoint,
      circuitBreakerState: externalApiBreaker.getState(),
    });

    return result;
  } catch (error) {
    logger.error({
      message: 'External API call failed',
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
      circuitBreakerStats: externalApiBreaker.getStats(),
    });
    throw error;
  }
}

// Example 2: Circuit Breaker for Database Operations
const databaseBreaker = createCircuitBreaker('database', {
  failureThreshold: 3,
  successThreshold: 1,
  timeout: 30000,
});

async function queryDatabase(sql: string) {
  return await databaseBreaker.execute(async () => {
    // Your database query here
    // const result = await prisma.$queryRaw(sql);
    // return result;
    throw new Error('Not implemented');
  });
}

// Example 3: Circuit Breaker for Payment Gateway
const paymentBreaker = createCircuitBreaker('payment-gateway', {
  failureThreshold: 2, // More sensitive for payments
  successThreshold: 3, // Require more successes to close
  timeout: 120000, // 2 minutes before retry
});

interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
}

async function processPayment(payment: PaymentRequest) {
  try {
    const result = await paymentBreaker.execute(async () => {
      // Simulated payment gateway call
      const response = await fetch('https://payment-gateway.com/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        throw new Error('Payment gateway error');
      }

      return await response.json();
    });

    logger.info({
      message: 'Payment processed successfully',
      amount: payment.amount,
      customerId: payment.customerId,
    });

    return result;
  } catch (error) {
    logger.error({
      message: 'Payment processing failed',
      amount: payment.amount,
      customerId: payment.customerId,
      circuitBreakerState: paymentBreaker.getState(),
    });

    // Handle payment failure gracefully
    // Maybe queue for retry or notify customer
    throw error;
  }
}

// Example 4: Monitoring Circuit Breaker Health
function monitorCircuitBreakers() {
  const breakers = [externalApiBreaker, databaseBreaker, paymentBreaker];

  breakers.forEach((breaker) => {
    const stats = breaker.getStats();
    
    if (stats.state === 'OPEN') {
      logger.warn({
        message: 'Circuit breaker is OPEN',
        ...stats,
      });
    }
  });
}

// Run monitoring every minute
setInterval(monitorCircuitBreakers, 60000);

// Example 5: Manual Circuit Breaker Reset (for admin operations)
function resetCircuitBreaker(breakerName: string) {
  const breakers: Record<string, any> = {
    'external-api': externalApiBreaker,
    'database': databaseBreaker,
    'payment-gateway': paymentBreaker,
  };

  const breaker = breakers[breakerName];
  if (breaker) {
    breaker.reset();
    logger.info({
      message: 'Circuit breaker manually reset',
      breakerName,
    });
  }
}

export {
  fetchFromExternalAPI,
  queryDatabase,
  processPayment,
  monitorCircuitBreakers,
  resetCircuitBreaker,
};
