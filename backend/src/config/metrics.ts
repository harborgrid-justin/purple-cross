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
