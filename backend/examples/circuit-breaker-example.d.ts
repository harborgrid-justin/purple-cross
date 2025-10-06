/**
 * Circuit Breaker Usage Examples
 * Demonstrates how to use the circuit breaker pattern for resilient external service calls
 */
declare function fetchFromExternalAPI(endpoint: string): Promise<any>;
declare function queryDatabase(sql: string): Promise<never>;
interface PaymentRequest {
    amount: number;
    currency: string;
    customerId: string;
}
declare function processPayment(payment: PaymentRequest): Promise<any>;
declare function monitorCircuitBreakers(): void;
declare function resetCircuitBreaker(breakerName: string): void;
export { fetchFromExternalAPI, queryDatabase, processPayment, monitorCircuitBreakers, resetCircuitBreaker, };
//# sourceMappingURL=circuit-breaker-example.d.ts.map