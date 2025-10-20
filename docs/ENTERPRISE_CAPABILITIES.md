# Enterprise Capabilities Guide

This document describes the production-grade enterprise capabilities implemented in Purple Cross to match Google-level engineering standards.

## Table of Contents

1. [Observability](#observability)
2. [Health Checks](#health-checks)
3. [Resilience Patterns](#resilience-patterns)
4. [Security](#security)
5. [Configuration](#configuration)

---

## Observability

### Correlation IDs

Every request is assigned a unique correlation ID for distributed tracing.

**Features:**

- Accepts existing correlation IDs from `X-Correlation-ID` or `X-Request-ID` headers
- Generates UUID v4 if no ID is provided
- Returns correlation ID in response headers
- Includes correlation ID in all logs and error responses

**Usage:**

```typescript
// Middleware automatically adds req.correlationId to every request
app.use(correlationIdMiddleware);

// Access in your code
console.log(req.correlationId); // e.g., "550e8400-e29b-41d4-a716-446655440000"
```

**Example Request:**

```bash
curl -H "X-Correlation-ID: my-custom-id" http://localhost:3000/api/v1/patients
# Response includes: X-Correlation-ID: my-custom-id
```

### Metrics Collection

Real-time application metrics for monitoring and observability.

**Metrics Tracked:**

- Total requests
- Requests by HTTP method
- Requests by status code
- Requests by path
- Average response time
- System uptime
- Memory usage
- CPU usage

**Endpoints:**

- `GET /metrics` - Returns JSON metrics

**Example Response:**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metrics": {
    "requests": {
      "totalRequests": 1234,
      "requestsByMethod": {
        "GET": 800,
        "POST": 300,
        "PUT": 100,
        "DELETE": 34
      },
      "requestsByStatus": {
        "200": 1000,
        "201": 150,
        "400": 50,
        "404": 20,
        "500": 14
      },
      "averageResponseTime": 125.5,
      "uptimeSeconds": 86400
    },
    "system": {
      "memory": {
        "heapUsed": 45.2,
        "heapTotal": 100.5,
        "heapUsedPercentage": 45.0
      }
    }
  }
}
```

### Structured Logging

Enhanced Winston logging with correlation IDs and structured data.

**Features:**

- JSON structured logs
- Correlation ID in all log entries
- Log rotation (10MB max, 5 files)
- Separate error and exception logs
- Environment and version metadata

**Log Files:**

- `logs/combined.log` - All logs
- `logs/error.log` - Error level and above
- `logs/exceptions.log` - Unhandled exceptions
- `logs/rejections.log` - Unhandled promise rejections

**Example Log Entry:**

```json
{
  "level": "info",
  "message": "Request completed",
  "method": "GET",
  "path": "/api/v1/patients",
  "statusCode": 200,
  "duration": "125ms",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "service": "purple-cross-api",
  "environment": "production",
  "version": "1.0.0",
  "timestamp": "2024-01-15 10:30:00"
}
```

---

## Health Checks

Kubernetes-ready health check endpoints for orchestration and monitoring.

### Endpoints

#### Basic Health Check

```bash
GET /health
```

Returns simple uptime status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400
}
```

#### Liveness Probe

```bash
GET /health/live
```

Indicates if the application is running (used by Kubernetes liveness probe).

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Readiness Probe

```bash
GET /health/ready
```

Indicates if the application is ready to serve traffic (checks dependencies).

**Checks:**

- Database connectivity

**Success Response (200):**

```json
{
  "status": "ready",
  "checks": {
    "database": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Failure Response (503):**

```json
{
  "status": "not_ready",
  "checks": {
    "database": false,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "error": "Database connection failed"
}
```

#### Detailed Health Check

```bash
GET /health/detailed
```

Returns comprehensive system information.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400,
  "environment": "production",
  "version": "1.0.0",
  "node_version": "v18.17.0",
  "memory": {
    "rss": "150MB",
    "heapTotal": "100MB",
    "heapUsed": "45MB",
    "external": "5MB"
  },
  "cpu": {
    "user": 1234567,
    "system": 234567
  },
  "database": {
    "status": "connected"
  }
}
```

### Kubernetes Configuration

Example Kubernetes deployment with health checks:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purple-cross-api
spec:
  template:
    spec:
      containers:
        - name: api
          image: purple-cross:latest
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

---

## Resilience Patterns

### Circuit Breaker

Prevents cascading failures when external services are down.

**Features:**

- Three states: CLOSED, OPEN, HALF_OPEN
- Configurable failure threshold
- Automatic recovery attempts
- Detailed logging and statistics

**Usage:**

```typescript
import { createCircuitBreaker } from '@/utils/circuitBreaker';

// Create a circuit breaker for an external service
const externalApiBreaker = createCircuitBreaker('external-api', {
  failureThreshold: 5, // Open after 5 failures
  successThreshold: 2, // Close after 2 successes in HALF_OPEN
  timeout: 60000, // Try to close after 60 seconds
});

// Use the circuit breaker
try {
  const result = await externalApiBreaker.execute(async () => {
    return await fetch('https://external-api.com/data');
  });
  console.log('Success:', result);
} catch (error) {
  console.error('Circuit breaker prevented call or call failed:', error);
}

// Check circuit breaker status
const stats = externalApiBreaker.getStats();
console.log(stats);
// {
//   name: 'external-api',
//   state: 'CLOSED',
//   failureCount: 0,
//   successCount: 0,
//   nextAttempt: null
// }
```

### Retry with Exponential Backoff

Handles transient failures with intelligent retry logic.

**Features:**

- Exponential backoff with configurable multiplier
- Maximum delay cap
- Retryable error filtering
- Optional jitter to prevent thundering herd

**Usage:**

```typescript
import { retry, retryWithJitter } from '@/utils/retry';

// Basic retry
try {
  const result = await retry(async () => await fetch('https://api.example.com/data'), {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds max
    backoffMultiplier: 2, // Double delay each time
    name: 'external-api-call',
  });
} catch (error) {
  console.error('All retry attempts failed:', error);
}

// Retry with jitter (recommended for distributed systems)
const result = await retryWithJitter(async () => await databaseQuery(), {
  maxAttempts: 5,
  initialDelay: 500,
  maxDelay: 5000,
  name: 'database-query',
});
```

### Request Timeout

Prevents hung requests from consuming resources.

**Configuration:**

```typescript
// Default timeout: 30 seconds
app.use(timeoutMiddleware(30000));

// Custom timeout for specific routes
app.use('/api/v1/long-running', timeoutMiddleware(120000)); // 2 minutes
```

**Timeout Response:**

```json
{
  "status": "error",
  "statusCode": 408,
  "message": "Request timeout",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Security

### Rate Limiting

Protects against abuse and DDoS attacks.

**Configuration:**

```typescript
// General API rate limit (from env vars)
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # 100 requests per window

// Automatic rate limiting on all API routes
// Excludes: /health, /health/ready, /health/live, /metrics
```

**Features:**

- Per-IP rate limiting
- Standard rate limit headers
- Separate stricter limits for authentication endpoints
- Graceful error responses

**Rate Limit Headers:**

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1610723400
```

**Rate Limit Response (429):**

```json
{
  "status": "error",
  "statusCode": 429,
  "message": "Too many requests from this IP, please try again later."
}
```

### Input Sanitization

Multi-layer protection against injection attacks.

**Features:**

- HTML entity escaping (XSS prevention)
- Null byte removal
- SQL injection pattern detection
- NoSQL injection pattern detection
- Applied to body, query params, and route params

**Usage:**

```typescript
// Automatically applied to all requests
app.use(sanitizationMiddleware);

// Manual sanitization check
import { containsSQLInjection, containsNoSQLInjection } from '@/middleware/sanitization';

if (containsSQLInjection(userInput)) {
  throw new AppError('Invalid input detected', 400, 'INVALID_INPUT');
}
```

**Protected Patterns:**

- SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `--`, `/*`, etc.
- NoSQL: `$where`, `$ne`, `$gt`, `$lt`, `$regex`, etc.

### Enhanced Error Handling

Structured error responses with security in mind.

**Features:**

- Error codes for easy tracking
- Correlation IDs for tracing
- Stack traces only in development
- No sensitive data leakage

**Error Response Format:**

```json
{
  "status": "error",
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Invalid input provided",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Using AppError:**

```typescript
import { AppError } from '@/middleware/errorHandler';

// With custom error code
throw new AppError('Resource not found', 404, 'RESOURCE_NOT_FOUND');

// Auto-generated error code
throw new AppError('Invalid request', 400);
// Error code will be 'BAD_REQUEST'
```

**Standard Error Codes:**

- `BAD_REQUEST` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `VALIDATION_ERROR` (422)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_SERVER_ERROR` (500)
- `SERVICE_UNAVAILABLE` (503)

---

## Configuration

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/purple_cross

# JWT
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # requests per window

# File Upload
MAX_FILE_SIZE=10485760           # 10MB
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=info                   # error, warn, info, debug
LOG_FILE_PATH=./logs

# Feature Flags
ENABLE_SWAGGER=false
ENABLE_API_DOCS=false
```

### Middleware Order

The middleware is applied in a specific order for optimal security and performance:

```typescript
app.use(correlationIdMiddleware); // 1. Track request
app.use(metricsMiddleware); // 2. Collect metrics
app.use(timeoutMiddleware); // 3. Set timeout
app.use(helmet()); // 4. Security headers
app.use(cors()); // 5. CORS
app.use(express.json()); // 6. Parse body
app.use(sanitizationMiddleware); // 7. Sanitize input
app.use(compression()); // 8. Compress response
app.use(morgan()); // 9. HTTP logging
app.use('/health', healthRoutes); // 10. Health checks (before rate limit)
app.use('/metrics', metricsRoutes); // 11. Metrics (before rate limit)
app.use(apiRateLimiter); // 12. Rate limiting
app.use('/api/v1', routes); // 13. Application routes
app.use(notFoundHandler); // 14. 404 handler
app.use(errorHandler); // 15. Error handler
```

---

## Best Practices

### For Developers

1. **Always use correlation IDs in logs:**

   ```typescript
   logger.info({
     message: 'Processing request',
     userId: user.id,
     correlationId: req.correlationId,
   });
   ```

2. **Use circuit breakers for external services:**

   ```typescript
   const breaker = createCircuitBreaker('payment-gateway');
   await breaker.execute(() => paymentGateway.charge(amount));
   ```

3. **Add retry logic for transient failures:**

   ```typescript
   await retry(() => database.query(sql), {
     maxAttempts: 3,
     name: 'database-query',
   });
   ```

4. **Use custom error codes:**
   ```typescript
   throw new AppError('Duplicate email', 409, 'DUPLICATE_EMAIL');
   ```

### For Operations

1. **Monitor health endpoints:**
   - Set up alerts on `/health/ready` returning 503
   - Monitor `/metrics` for anomalies

2. **Configure rate limits appropriately:**
   - Adjust based on traffic patterns
   - Set stricter limits for expensive operations

3. **Review logs regularly:**
   - Check for circuit breaker openings
   - Monitor slow requests (>1s)
   - Review rate limit violations

4. **Set up distributed tracing:**
   - Use correlation IDs to trace requests across services
   - Implement log aggregation (ELK, Splunk, etc.)

---

## Monitoring Dashboard Recommendations

### Key Metrics to Monitor

1. **Request Metrics:**
   - Request rate (requests/second)
   - Error rate (percentage of 5xx responses)
   - Response time (p50, p95, p99)

2. **Health Metrics:**
   - Liveness check success rate
   - Readiness check success rate
   - Database connection status

3. **Resilience Metrics:**
   - Circuit breaker states
   - Retry attempt counts
   - Timeout occurrences

4. **Security Metrics:**
   - Rate limit violations
   - Input sanitization triggers
   - Authentication failures

### Recommended Tools

- **Metrics Collection:** Prometheus + Grafana
- **Log Aggregation:** ELK Stack or Splunk
- **Distributed Tracing:** Jaeger or Zipkin
- **Alerting:** PagerDuty or OpsGenie
- **APM:** New Relic or Datadog

---

## Migration Guide

### Updating Existing Code

1. **Update error throwing:**

   ```typescript
   // Before
   throw new AppError('Not found', 404);

   // After
   throw new AppError('Not found', 404, 'RESOURCE_NOT_FOUND');
   ```

2. **Add correlation IDs to logs:**

   ```typescript
   // Before
   logger.error('Database error', { error });

   // After
   logger.error({
     message: 'Database error',
     error: error.message,
     correlationId: req.correlationId,
   });
   ```

3. **Wrap external calls with circuit breakers:**

   ```typescript
   // Before
   const data = await externalAPI.getData();

   // After
   const breaker = createCircuitBreaker('external-api');
   const data = await breaker.execute(() => externalAPI.getData());
   ```

---

## Support

For questions or issues related to enterprise capabilities:

1. Check this documentation first
2. Review logs for correlation IDs and error details
3. Check health endpoints for service status
4. Review metrics for anomalies
5. Contact the development team with specific correlation IDs

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Maintained by:** Purple Cross Development Team
