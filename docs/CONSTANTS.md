# Constants Architecture

This document describes the centralized constants architecture in the Purple Cross application.

## Overview

All hardcoded values, magic numbers, URLs, and static strings have been centralized into constant files to:

- **Improve maintainability**: Change values in one place
- **Ensure consistency**: Use the same values across the application
- **Prevent typos**: TypeScript autocomplete and type checking
- **Enhance readability**: Named constants are self-documenting
- **Simplify testing**: Easy to mock and override constants

## Location

### Backend
`backend/src/constants/index.ts` - All backend constants

### Frontend
`frontend/src/constants/index.ts` - All frontend constants

## Structure

Both backend and frontend constants follow similar organizational patterns:

### HTTP Status Codes
```typescript
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  // ... etc
} as const;
```

Usage:
```typescript
res.status(HTTP_STATUS.NOT_FOUND).json({ ... });
```

### Entity Status Values
All possible status values for different entities (appointments, invoices, orders, etc.):

```typescript
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  // ... etc
} as const;
```

Usage:
```typescript
where: {
  status: { not: STATUS.CANCELLED }
}
```

### Pagination
Default pagination values:

```typescript
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
```

Usage:
```typescript
const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
```

### Time Constants
All time-related values in milliseconds:

```typescript
export const TIME = {
  DEFAULT_REQUEST_TIMEOUT: 30000, // 30 seconds
  AUTH_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
} as const;
```

### Error Messages
Standardized error messages (some are functions for dynamic messages):

```typescript
export const ERROR_MESSAGES = {
  NOT_FOUND: (entity: string) => `${entity} not found`,
  RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later.',
  TIME_SLOT_BOOKED: 'Time slot already booked',
} as const;
```

Usage:
```typescript
throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
```

### API Endpoints (Frontend Only)

All API endpoint paths and URL builders:

```typescript
export const API_ENDPOINTS = {
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,
  // ... etc
} as const;
```

Usage:
```typescript
this.get(API_ENDPOINTS.PATIENT_BY_ID(id));
```

### Routes (Frontend Only)

All application route paths:

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
} as const;
```

### Storage Keys (Frontend Only)

LocalStorage and SessionStorage keys:

```typescript
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;
```

## Backend-Specific Constants

### Circuit Breaker Configuration
```typescript
export const CIRCUIT_BREAKER_DEFAULTS = {
  FAILURE_THRESHOLD: 5,
  SUCCESS_THRESHOLD: 2,
  TIMEOUT: 60000,
} as const;
```

### Health Check Paths
```typescript
export const HEALTH_PATHS = {
  HEALTH: '/health',
  READY: '/health/ready',
  LIVE: '/health/live',
} as const;
```

### Default Environment Values
```typescript
export const DEFAULT_ENV = {
  NODE_ENV: 'development',
  PORT: 3000,
  API_PREFIX: '/api/v1',
  CORS_ORIGIN: 'http://localhost:5173',
} as const;
```

## Frontend-Specific Constants

### API Configuration
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
} as const;
```

### HTTP Headers
```typescript
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  BEARER_PREFIX: 'Bearer',
} as const;
```

### Query Keys (for React Query)
```typescript
export const QUERY_KEYS = {
  PATIENTS: 'patients',
  PATIENT: 'patient',
  APPOINTMENTS: 'appointments',
} as const;
```

## Domain-Specific Constants

### Staff Roles
```typescript
export const STAFF_ROLE = {
  VETERINARIAN: 'veterinarian',
  TECHNICIAN: 'technician',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin',
} as const;
```

### Appointment Types
```typescript
export const APPOINTMENT_TYPE = {
  CONSULTATION: 'consultation',
  SURGERY: 'surgery',
  VACCINATION: 'vaccination',
  CHECKUP: 'checkup',
  EMERGENCY: 'emergency',
} as const;
```

### Species
```typescript
export const SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  REPTILE: 'reptile',
} as const;
```

### Loyalty Tiers
```typescript
export const LOYALTY_TIER = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;
```

## Usage Examples

### Backend Example

**Before:**
```typescript
const patient = await prisma.patient.findUnique({
  where: { id },
  include: {
    medicalRecords: {
      orderBy: { visitDate: 'desc' },
      take: 10,
    },
  },
});

if (!patient) {
  throw new AppError('Patient not found', 404);
}
```

**After:**
```typescript
import { HTTP_STATUS, ERROR_MESSAGES, QUERY_LIMITS, SORT_ORDER, FIELDS } from '../constants';

const patient = await prisma.patient.findUnique({
  where: { id },
  include: {
    medicalRecords: {
      orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC },
      take: QUERY_LIMITS.MEDICAL_RECORDS,
    },
  },
});

if (!patient) {
  throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
}
```

### Frontend Example

**Before:**
```typescript
const API_BASE_URL = 'http://localhost:3000/api/v1';

this.client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Later in code
const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// API calls
this.get('/patients', params)
this.get(`/patients/${id}`)
```

**After:**
```typescript
import { API_CONFIG, HTTP_HEADERS, CONTENT_TYPE, STORAGE_KEYS, API_ENDPOINTS } from '../constants';

this.client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
  },
});

// Later in code
const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
if (token) {
  config.headers.Authorization = `${HTTP_HEADERS.BEARER_PREFIX} ${token}`;
}

// API calls
this.get(API_ENDPOINTS.PATIENTS, params)
this.get(API_ENDPOINTS.PATIENT_BY_ID(id))
```

## Benefits

### 1. Type Safety
Using `as const` assertions ensures TypeScript treats these as literal types:
```typescript
const status: 'active' | 'inactive' = STATUS.ACTIVE; // ✓ Type-safe
```

### 2. Autocomplete
IDE provides autocomplete for all available constants:
```typescript
HTTP_STATUS. // Shows all available status codes
```

### 3. Refactoring
Change a value in one place:
```typescript
// Need to change timeout from 30s to 60s?
// Just update TIME.DEFAULT_REQUEST_TIMEOUT
```

### 4. No Magic Numbers
Code is self-documenting:
```typescript
// Before
setTimeout(callback, 30000);

// After
setTimeout(callback, TIME.DEFAULT_REQUEST_TIMEOUT);
```

### 5. Testing
Easy to override constants in tests:
```typescript
jest.mock('../constants', () => ({
  ...jest.requireActual('../constants'),
  TIME: { DEFAULT_REQUEST_TIMEOUT: 100 }
}));
```

## Migration Guide

When adding new hardcoded values:

1. **Identify the constant type**: Is it a status, timeout, URL, error message?
2. **Add to appropriate section**: Place in the relevant constant group
3. **Use descriptive names**: `AUTH_RATE_LIMIT_WINDOW` not `TIME1`
4. **Add JSDoc if needed**: Complex constants benefit from documentation
5. **Update usage**: Replace all hardcoded instances with the constant

## Best Practices

1. **Always use constants over magic values**
   - ✓ `HTTP_STATUS.NOT_FOUND`
   - ✗ `404`

2. **Group related constants together**
   - All status values in `STATUS`
   - All time values in `TIME`

3. **Use functions for dynamic values**
   ```typescript
   ERROR_MESSAGES.NOT_FOUND: (entity: string) => `${entity} not found`
   ```

4. **Use `as const` for type safety**
   ```typescript
   export const STATUS = { ... } as const;
   ```

5. **Document non-obvious values**
   ```typescript
   export const TIME = {
     AUTH_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
   } as const;
   ```

6. **Keep constants DRY**
   - Don't duplicate between backend/frontend if they must match
   - Consider shared constants package for larger projects

## Files Updated

### Backend
- `backend/src/config/env.ts` - Environment configuration
- `backend/src/middleware/rate-limiter.ts` - Rate limiting
- `backend/src/middleware/timeout.ts` - Request timeouts
- `backend/src/app.ts` - Express app configuration
- `backend/src/services/patient.service.ts` - Patient service
- `backend/src/services/appointment.service.ts` - Appointment service

### Frontend
- `frontend/src/services/api.ts` - API client

## Future Enhancements

1. **Shared Constants Package**: Extract common constants to `@purple-cross/shared-constants`
2. **Validation Constants**: Move Joi schemas to constants
3. **Feature Flags**: Centralize feature flag configuration
4. **Environment-Specific**: Different constants for dev/staging/production
