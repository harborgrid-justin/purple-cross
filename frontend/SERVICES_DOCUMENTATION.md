# Frontend Services Structure Documentation

This document describes the comprehensive frontend services layer implemented in the Purple Cross application based on the Frontend Services Structure Template.

## Overview

The services layer provides a modular, enterprise-grade architecture with:
- **Core infrastructure** for API communication
- **Domain-specific APIs** with type safety and validation
- **Utility services** for common operations
- **Security features** including authentication and CSRF protection
- **Monitoring and resilience** patterns for production reliability

## Directory Structure

```
services/
├── index.ts                           # Main service exports
├── api.ts                            # Legacy API client (backward compatibility)
├── config/
│   └── apiConfig.ts                  # Axios configuration and interceptors
├── core/
│   ├── index.ts                      # Core service exports
│   └── BaseApiService.ts             # Abstract base class for CRUD operations
├── modules/
│   └── patientsApi.ts                # Example domain API service
├── utils/
│   ├── apiUtils.ts                   # HTTP utility functions
│   ├── errorHandlers.ts              # Error handling utilities
│   ├── validators.ts                 # Common validation schemas
│   └── transformers.ts               # Data transformation utilities
├── types/
│   └── index.ts                      # Service type re-exports
├── security/
│   ├── SecureTokenManager.ts         # Token management
│   ├── CsrfProtection.ts             # CSRF protection
│   └── PermissionChecker.ts          # Permission validation
├── cache/
│   ├── ApiCache.ts                   # Response caching
│   └── CacheStrategies.ts            # Caching strategies
├── monitoring/
│   ├── ApiMetrics.ts                 # Performance metrics
│   └── ErrorReporting.ts             # Error tracking
├── resilience/
│   ├── RetryStrategies.ts            # Retry logic
│   └── CircuitBreaker.ts             # Circuit breaker pattern
└── audit/
    └── index.ts                      # Audit service for action tracking
```

## Core Components

### API Configuration (`config/apiConfig.ts`)

The central Axios configuration with:
- Authentication token injection
- Automatic token refresh on 401 errors
- CSRF protection
- Request/response interceptors
- Performance tracking

```typescript
import { apiInstance, tokenUtils } from './services';

// Use the configured axios instance
const response = await apiInstance.get('/patients');

// Check authentication
if (tokenUtils.isAuthenticated()) {
  // User is logged in
}
```

### Base API Service (`core/BaseApiService.ts`)

Abstract base class providing CRUD operations pattern:

```typescript
import { BaseApiService } from './services/core';

class MyApiService extends BaseApiService<MyEntity, CreateDto, UpdateDto> {
  constructor() {
    super(apiInstance, '/my-endpoint', {
      createSchema: myCreateSchema,
      updateSchema: myUpdateSchema,
    });
  }
  
  // Inherit: getAll, getById, create, update, delete
  // Add custom methods as needed
}
```

## Utility Services

### API Utils (`utils/apiUtils.ts`)

Common HTTP utilities:

```typescript
import {
  handleApiError,
  extractApiData,
  buildUrlParams,
  withRetry,
  formatDateForApi,
  apiCache,
  debounce,
} from './services';

// Error handling
try {
  const response = await fetch('/api/data');
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message);
}

// Data extraction
const data = extractApiData(response);

// URL parameters
const params = buildUrlParams({ page: 1, limit: 10, status: 'active' });

// Retry with backoff
const result = await withRetry(() => apiInstance.get('/data'), {
  maxRetries: 3,
  backoffMs: 1000,
});

// Caching
const cachedData = apiCache.get('key');
apiCache.set('key', data, 300000); // 5 minutes TTL
```

### Error Handlers (`utils/errorHandlers.ts`)

Error classification and transformation:

```typescript
import {
  transformError,
  getUserFriendlyMessage,
  isRecoverableError,
  ErrorType,
} from './services';

const appError = transformError(axiosError);

// Get user-friendly message
const message = getUserFriendlyMessage(appError);

// Check if retry makes sense
if (isRecoverableError(appError)) {
  // Can retry this request
}

// Error types
if (appError.type === ErrorType.AUTHENTICATION) {
  // Redirect to login
}
```

### Validators (`utils/validators.ts`)

Zod validation schemas:

```typescript
import {
  emailSchema,
  phoneSchema,
  dateSchema,
  statusSchema,
  paginationSchema,
  requiredString,
  optionalString,
} from './services';

// Use schemas
const createUserSchema = z.object({
  email: emailSchema,
  phone: phoneSchema.optional(),
  name: requiredString({ minLength: 2, maxLength: 100 }),
  bio: optionalString({ maxLength: 500 }),
  status: statusSchema,
});

// Validate data
const validatedData = createUserSchema.parse(formData);
```

### Transformers (`utils/transformers.ts`)

Data transformation utilities:

```typescript
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatPhoneNumber,
  formatAddress,
  getStatusColor,
} from './services';

// Date formatting
const displayDate = formatDate(date); // "12/25/2023"
const displayDateTime = formatDateTime(date); // "12/25/2023 03:30 PM"

// Currency
const price = formatCurrency(1234.56); // "$1,234.56"

// Phone
const phone = formatPhoneNumber('5551234567'); // "(555) 123-4567"

// Status color
const color = getStatusColor('active'); // "green"
```

## Security Layer

### Secure Token Manager (`security/SecureTokenManager.ts`)

JWT token management:

```typescript
import { secureTokenManager } from './services';

// Set tokens
secureTokenManager.setTokens(token, refreshToken, expiresIn);

// Check validity
if (secureTokenManager.hasValidToken()) {
  // Token is valid
}

// Get tokens
const token = secureTokenManager.getToken();
const refreshToken = secureTokenManager.getRefreshToken();

// Clear tokens
secureTokenManager.clearTokens();
```

### CSRF Protection (`security/CsrfProtection.ts`)

Cross-Site Request Forgery protection:

```typescript
import {
  initializeCsrfToken,
  getCsrfToken,
  clearCsrfToken,
} from './services';

// Initialize on app start
initializeCsrfToken();

// Get current token
const csrfToken = getCsrfToken();

// Clear on logout
clearCsrfToken();
```

### Permission Checker (`security/PermissionChecker.ts`)

Role-based access control:

```typescript
import { permissionChecker, Permission } from './services';

// Set current user
permissionChecker.setUser(currentUser);

// Check permissions
if (permissionChecker.hasPermission(Permission.PATIENTS_EDIT)) {
  // User can edit patients
}

// Check multiple permissions
if (permissionChecker.hasAnyPermission([
  Permission.PATIENTS_VIEW,
  Permission.CLIENTS_VIEW,
])) {
  // User can view either
}

// Convenience methods
if (permissionChecker.canEdit('patients')) {
  // User can edit patients
}
```

## Cache Layer

### API Cache (`cache/ApiCache.ts`)

In-memory caching:

```typescript
import { apiCache } from './services';

// Set with TTL
apiCache.set('patients-list', data, 300000); // 5 minutes

// Get cached data
const cached = apiCache.get('patients-list');

// Clear by tag
apiCache.clearByTag('patients');

// Get stats
const stats = apiCache.getStats();
console.log(`Hit rate: ${stats.hitRate * 100}%`);
```

### Cache Strategies (`cache/CacheStrategies.ts`)

Multiple caching strategies:

```typescript
import {
  cacheFirst,
  networkFirst,
  staleWhileRevalidate,
  invalidateRelated,
} from './services';

// Cache-first: Use cache if available
const data1 = await cacheFirst(
  apiCache,
  'key',
  () => apiInstance.get('/data'),
  { ttl: 300000 }
);

// Network-first: Fetch, fallback to cache on error
const data2 = await networkFirst(
  apiCache,
  'key',
  () => apiInstance.get('/data')
);

// Stale-while-revalidate: Return cache, update in background
const data3 = await staleWhileRevalidate(
  apiCache,
  'key',
  () => apiInstance.get('/data')
);

// Invalidate related caches on mutation
invalidateRelated(apiCache, 'patient', 'update');
```

## Monitoring & Resilience

### API Metrics (`monitoring/ApiMetrics.ts`)

Performance tracking:

```typescript
import { apiMetrics } from './services';

// Metrics are automatically recorded by interceptors

// Get summary
const summary = apiMetrics.getSummary();
console.log(`Average duration: ${summary.averageDuration}ms`);
console.log(`Error rate: ${apiMetrics.getErrorRate() * 100}%`);

// Log summary
apiMetrics.logSummary();

// Export metrics
const metricsJson = apiMetrics.exportMetrics();
```

### Error Reporting (`monitoring/ErrorReporting.ts`)

Error tracking:

```typescript
import { errorReporting } from './services';

// Report error
errorReporting.reportError(appError, 'UserProfile');

// Get statistics
const stats = errorReporting.getStats();

// Get errors by type
const networkErrors = errorReporting.getErrorsByType(ErrorType.NETWORK);

// Export errors
const errorsJson = errorReporting.exportErrors();
```

### Circuit Breaker (`resilience/CircuitBreaker.ts`)

Prevent cascading failures:

```typescript
import { circuitBreakerRegistry } from './services';

// Get or create circuit breaker
const breaker = circuitBreakerRegistry.getBreaker('external-api', {
  failureThreshold: 5,
  resetTimeout: 30000,
});

// Use circuit breaker
try {
  const result = await breaker.execute(
    () => apiInstance.get('/external-api')
  );
} catch (error) {
  if (breaker.isOpen()) {
    console.log('Circuit is open, skipping request');
  }
}

// Check state
const stats = breaker.getStats();
console.log(`Circuit state: ${stats.state}`);
```

### Retry Strategies (`resilience/RetryStrategies.ts`)

Multiple retry strategies:

```typescript
import {
  withRetry,
  quickRetry,
  standardRetry,
  aggressiveRetry,
  RetryStrategy,
  createRetryFunction,
} from './services';

// Basic retry
const result1 = await withRetry(
  () => apiInstance.get('/data'),
  { maxRetries: 3, initialDelay: 1000 }
);

// Pre-configured strategies
const result2 = await quickRetry(() => apiInstance.get('/data'));
const result3 = await standardRetry(() => apiInstance.get('/data'));

// Create custom retry function
const customRetry = createRetryFunction(RetryStrategy.FIBONACCI, {
  maxRetries: 5,
  initialDelay: 500,
});
const result4 = await customRetry(() => apiInstance.get('/data'));
```

## Audit System

### Audit Service (`audit/index.ts`)

Track user actions:

```typescript
import { auditService, AuditAction, AuditResourceType, AuditStatus } from './services';

// Set current user
auditService.setUserId(user.id);

// Log action
await auditService.logAction({
  action: AuditAction.UPDATE,
  resourceType: AuditResourceType.PATIENT,
  resourceId: patientId,
  status: AuditStatus.SUCCESS,
  details: { updated: data },
});

// Get audit entries
const entries = auditService.getEntries({
  action: AuditAction.DELETE,
  resourceType: AuditResourceType.PATIENT,
});

// Get recent entries
const recent = auditService.getRecentEntries(10);
```

## Domain API Example

### Patients API (`modules/patientsApi.ts`)

Full-featured domain API:

```typescript
import { patientsApi } from './services';

// Get all patients
const response = await patientsApi.getAll({
  page: 1,
  limit: 10,
  status: ['active'],
  search: 'fluffy',
});

// Get by ID
const patient = await patientsApi.getById(id);

// Create
const newPatient = await patientsApi.create({
  name: 'Fluffy',
  species: 'Cat',
  breed: 'Persian',
  dateOfBirth: '2020-01-15',
  gender: 'female',
  ownerId: 'owner-123',
});

// Update
const updated = await patientsApi.update(id, {
  weight: 4.5,
  notes: 'Very friendly',
});

// Delete
await patientsApi.delete(id);

// Advanced operations
const stats = await patientsApi.getStatistics();
const results = await patientsApi.search('fluffy');
const blob = await patientsApi.export({ status: ['active'] });
```

## Creating New Domain APIs

To create a new domain API:

1. **Create the API file** in `services/modules/`:

```typescript
// services/modules/clientsApi.ts
import { apiInstance } from '../config/apiConfig';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';
import {
  buildUrlParams,
  handleApiError,
  extractApiData,
  withRetry,
} from '../utils/apiUtils';

// Define interfaces
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // ... other fields
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  // ... other fields
}

// Define validation schemas
const createClientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  // ... other fields
});

// Implement API class
class ClientsApiImpl {
  private readonly baseEndpoint = '/clients';
  
  async getAll(filters?: ClientFilters): Promise<PaginatedClientResponse> {
    // Implementation with audit logging
  }
  
  async getById(id: string): Promise<Client> {
    // Implementation with audit logging
  }
  
  // ... other methods
}

// Export singleton
export const clientsApi = new ClientsApiImpl();
```

2. **Export from main index**:

```typescript
// services/index.ts
export { clientsApi } from './modules/clientsApi';
export type { ClientsApi, Client, CreateClientData } from './modules/clientsApi';
```

3. **Use in components**:

```typescript
import { clientsApi } from '../services';

const clients = await clientsApi.getAll({ page: 1, limit: 10 });
```

## Best Practices

1. **Always use the configured apiInstance** for API calls to benefit from interceptors
2. **Validate input data** using Zod schemas before sending to API
3. **Handle errors consistently** using the error utilities
4. **Log important actions** to the audit service
5. **Use caching** for frequently accessed, slowly-changing data
6. **Implement retry logic** for transient failures
7. **Monitor performance** using API metrics
8. **Check permissions** before sensitive operations
9. **Use type safety** throughout - no `any` types
10. **Keep domain APIs focused** - one domain per file

## Migration from Legacy API

The legacy `api.ts` file is preserved for backward compatibility. To migrate:

1. Identify the domain (e.g., patients, clients, appointments)
2. Check if a domain API exists in `services/modules/`
3. If not, create one following the pattern above
4. Update components to use the new domain API
5. Remove legacy API usage once all references are updated

## Testing

All services are designed to be testable:

```typescript
import { vi } from 'vitest';
import { patientsApi } from './services';

// Mock axios instance
vi.mock('./services/config/apiConfig', () => ({
  apiInstance: {
    get: vi.fn(),
    post: vi.fn(),
    // ... other methods
  },
}));

// Test
it('should fetch patients', async () => {
  apiInstance.get.mockResolvedValue({ data: { data: [] } });
  const result = await patientsApi.getAll();
  expect(result).toBeDefined();
});
```

## Performance Considerations

1. **Caching**: Use appropriate TTL values for cached data
2. **Pagination**: Always paginate large datasets
3. **Retry logic**: Configure retry delays appropriately
4. **Circuit breakers**: Set thresholds based on system capacity
5. **Monitoring**: Regularly review metrics to identify bottlenecks

## Security Considerations

1. **Token storage**: Tokens are stored in localStorage with expiry tracking
2. **CSRF protection**: Automatic CSRF token handling for state-changing requests
3. **Permission checks**: Always verify permissions before sensitive operations
4. **Input validation**: All input is validated before sending to backend
5. **Error messages**: Never expose sensitive information in error messages

## Troubleshooting

### "Circuit breaker is OPEN"
The circuit breaker has detected too many failures. Wait for the reset timeout or manually reset:
```typescript
breaker.manualReset();
```

### "Token expired"
The authentication token has expired. The system will automatically attempt to refresh:
```typescript
// Automatic refresh is handled by interceptors
// Manual refresh if needed:
tokenUtils.clearAuth();
// Redirect to login
```

### Cache issues
Clear the cache if stale data is being returned:
```typescript
apiCache.clear(); // Clear all
apiCache.clearByTag('patients'); // Clear specific tag
```

### Performance issues
Check metrics to identify slow endpoints:
```typescript
apiMetrics.logSummary();
const summary = apiMetrics.getSummary();
console.log('Slowest:', summary.slowestRequests);
```

## Support

For questions or issues:
1. Check this documentation
2. Review the example `patientsApi.ts` implementation
3. Check existing tests in `__tests__/services/`
4. Consult the team lead or architecture documentation
