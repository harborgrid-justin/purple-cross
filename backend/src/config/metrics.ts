import client from 'prom-client';

/**
 * Prometheus metrics registry. Exposes Node.js default metrics (process/heap/
 * event-loop) plus HTTP request instruments. Scraped at GET /metrics.
 */
export const register = new client.Registry();
register.setDefaultLabels({ app: 'purple-cross-api' });
client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

/**
 * Outbound integration calls (email/SMS/payment/webhook providers). `outcome`
 * is one of `success` | `failure` | `rejected` (circuit breaker open). These
 * back the resilience dashboards for the external-provider layer.
 */
export const externalRequestsTotal = new client.Counter({
  name: 'external_requests_total',
  help: 'Total number of outbound integration provider calls',
  labelNames: ['provider', 'operation', 'outcome'],
  registers: [register],
});

export const externalRequestDuration = new client.Histogram({
  name: 'external_request_duration_seconds',
  help: 'Duration of outbound integration provider calls in seconds',
  labelNames: ['provider', 'operation', 'outcome'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
  registers: [register],
});

/**
 * Circuit breaker state per named breaker, exposed as a gauge (0=closed,
 * 1=half-open, 2=open) so operators can alert on tripped breakers.
 */
export const circuitBreakerState = new client.Gauge({
  name: 'circuit_breaker_state',
  help: 'Circuit breaker state: 0=closed, 1=half_open, 2=open',
  labelNames: ['breaker'],
  registers: [register],
});
