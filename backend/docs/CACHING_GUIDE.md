# Caching Guide

## Overview

This guide covers caching patterns and best practices for the Purple Cross backend API using Redis.

## Cache Service

### Basic Operations

```typescript
import { cacheService } from './services/cache.service';
import { CACHE_TTL } from './config/redis';

// Get from cache
const user = await cacheService.get<User>('user:123');

// Set in cache with TTL
await cacheService.set('user:123', userData, CACHE_TTL.MEDIUM);

// Get-or-Set pattern (recommended)
const patient = await cacheService.getOrSet(
  `patient:${patientId}`,
  async () => await prisma.patient.findUnique({ where: { id: patientId } }),
  CACHE_TTL.LONG
);
```

### Cache Middleware

```typescript
import { cacheMiddleware } from '../middleware/cache';

// Cache all GET requests to this route
router.get('/patients', cacheMiddleware(), patientController.getAll);

// Custom TTL
router.get('/appointments', 
  cacheMiddleware({ ttl: CACHE_TTL.SHORT }), 
  appointmentController.getAll
);
```

### Cache Invalidation

```typescript
import { cacheInvalidation } from './services/cache.service';

// After updating a patient
await cacheInvalidation.patient(patientId);

// Pattern-based invalidation
await cacheService.delPattern(`patient:${patientId}:*`);
```

## Best Practices

1. **Use prefixes** - Always use `CACHE_PREFIXES` constants
2. **Choose appropriate TTL** - Balance freshness vs performance
3. **Invalidate on mutations** - Clear cache after CREATE/UPDATE/DELETE
4. **Use get-or-set** - Simplifies cache logic
5. **Handle failures gracefully** - Cache service returns null on errors

See full documentation for detailed patterns and examples.
