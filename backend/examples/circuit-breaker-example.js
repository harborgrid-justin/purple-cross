"use strict";
/**
 * Circuit Breaker Usage Examples
 * Demonstrates how to use the circuit breaker pattern for resilient external service calls
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFromExternalAPI = fetchFromExternalAPI;
exports.queryDatabase = queryDatabase;
exports.processPayment = processPayment;
exports.monitorCircuitBreakers = monitorCircuitBreakers;
exports.resetCircuitBreaker = resetCircuitBreaker;
const circuit_breaker_1 = require("../src/utils/circuit-breaker");
const logger_1 = require("../src/config/logger");
// Example 1: Basic Circuit Breaker for External API
const externalApiBreaker = (0, circuit_breaker_1.createCircuitBreaker)('external-api', {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
});
async function fetchFromExternalAPI(endpoint) {
    try {
        const result = await externalApiBreaker.execute(async () => {
            const response = await fetch(`https://api.example.com${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        });
        logger_1.logger.info({
            message: 'External API call successful',
            endpoint,
            circuitBreakerState: externalApiBreaker.getState(),
        });
        return result;
    }
    catch (error) {
        logger_1.logger.error({
            message: 'External API call failed',
            endpoint,
            error: error instanceof Error ? error.message : 'Unknown error',
            circuitBreakerStats: externalApiBreaker.getStats(),
        });
        throw error;
    }
}
// Example 2: Circuit Breaker for Database Operations
const databaseBreaker = (0, circuit_breaker_1.createCircuitBreaker)('database', {
    failureThreshold: 3,
    successThreshold: 1,
    timeout: 30000,
});
async function queryDatabase(sql) {
    return await databaseBreaker.execute(async () => {
        // Your database query here
        // const result = await prisma.$queryRaw(sql);
        // return result;
        throw new Error('Not implemented');
    });
}
// Example 3: Circuit Breaker for Payment Gateway
const paymentBreaker = (0, circuit_breaker_1.createCircuitBreaker)('payment-gateway', {
    failureThreshold: 2, // More sensitive for payments
    successThreshold: 3, // Require more successes to close
    timeout: 120000, // 2 minutes before retry
});
async function processPayment(payment) {
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
        logger_1.logger.info({
            message: 'Payment processed successfully',
            amount: payment.amount,
            customerId: payment.customerId,
        });
        return result;
    }
    catch (error) {
        logger_1.logger.error({
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
            logger_1.logger.warn({
                message: 'Circuit breaker is OPEN',
                ...stats,
            });
        }
    });
}
// Run monitoring every minute
setInterval(monitorCircuitBreakers, 60000);
// Example 5: Manual Circuit Breaker Reset (for admin operations)
function resetCircuitBreaker(breakerName) {
    const breakers = {
        'external-api': externalApiBreaker,
        database: databaseBreaker,
        'payment-gateway': paymentBreaker,
    };
    const breaker = breakers[breakerName];
    if (breaker) {
        breaker.reset();
        logger_1.logger.info({
            message: 'Circuit breaker manually reset',
            breakerName,
        });
    }
}
//# sourceMappingURL=circuit-breaker-example.js.map