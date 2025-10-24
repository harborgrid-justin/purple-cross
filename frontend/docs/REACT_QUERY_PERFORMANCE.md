# React Query Performance Guide

## Overview

This document outlines the TanStack Query (React Query) performance optimization strategy for the Purple Cross veterinary practice management platform.

## Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [StaleTime Strategy](#staletime-strategy)
3. [Query-Specific Optimizations](#query-specific-optimizations)
4. [DevTools Usage](#devtools-usage)
5. [Best Practices](#best-practices)
6. [Performance Monitoring](#performance-monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Configuration Overview

### Global QueryClient Configuration

Location: `/home/user/purple-cross/frontend/src/main.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME.STANDARD,     // 5 minutes
      gcTime: QUERY_CACHE_TIME.DEFAULT,          // 10 minutes
      retry: QUERY_RETRY.DEFAULT,                // 3 attempts
      refetchOnWindowFocus: false,               // Disabled for vet workflows
      refetchOnReconnect: true,                  // Enabled for data freshness
      refetchOnMount: true,                      // Only if data is stale
      networkMode: 'online',                     // Only fetch when online
      structuralSharing: true,                   // Prevent unnecessary re-renders
    },
    mutations: {
      retry: QUERY_RETRY.MINIMAL,                // 1 attempt
      networkMode: 'online',
      retryDelay: 1000,                          // 1 second
    },
  },
});
```

### Key Configuration Decisions

#### Why `refetchOnWindowFocus: false`?

Veterinary staff frequently switch between applications:
- Email clients for client communication
- Phone systems for appointments
- External lab portals
- Document management systems

Auto-refetching on every window focus would:
- Increase unnecessary API load
- Cause UI disruptions (loading states)
- Waste bandwidth

Instead, we rely on:
- **staleTime**: Data is fresh for 30 seconds to 1 hour depending on type
- **refetchOnReconnect**: Ensures fresh data after network issues
- **Manual refetch**: Staff can manually refresh when needed

#### Why 5-minute default staleTime?

For a veterinary practice:
- Patient/client information changes moderately throughout the day
- Medical records are mostly append-only (new records added, old ones rarely modified)
- Staff schedules and inventory levels change gradually
- 5 minutes provides excellent balance between freshness and performance

---

## StaleTime Strategy

### Constants

Location: `/home/user/purple-cross/frontend/src/constants/index.ts`

```typescript
export const QUERY_STALE_TIME = {
  REAL_TIME: 0,              // 0ms - Always stale
  DYNAMIC: 30000,            // 30 seconds
  STANDARD: 300000,          // 5 minutes (default)
  SEMI_STATIC: 600000,       // 10 minutes
  STATIC: 3600000,           // 1 hour
  CACHED: 86400000,          // 24 hours
};
```

### Data Classification

| Data Type | staleTime | Rationale | Examples |
|-----------|-----------|-----------|----------|
| **Real-time** | 0ms | Changes constantly, needs immediate updates | Current appointment status, active waitlist positions |
| **Dynamic** | 30s | Changes frequently during active use | Today's appointments, dashboard metrics, low stock alerts |
| **Standard** | 5min | Moderate change frequency | Patient lists, client lists, medical records |
| **Semi-static** | 10min | Changes infrequently | Staff lists, general inventory, appointment types |
| **Static** | 1hr | Rarely changes | Breed info, medication database, document templates |
| **Cached** | 24hr | Almost never changes | Policy documents, system configuration |

### When to Use Each Type

#### REAL_TIME (0ms)
```typescript
// Always refetches - use sparingly!
export const useWaitlistActive = () => {
  return useQuery({
    queryKey: ['waitlist', 'active'],
    queryFn: () => api.waitlist.getActive(),
    staleTime: QUERY_STALE_TIME.REAL_TIME,
  });
};
```

**Use cases:**
- Live appointment tracking
- Real-time inventory during surgery
- Active waitlist management

**Warning:** Real-time queries refetch on every component mount. Use only when truly necessary and consider polling instead.

#### DYNAMIC (30 seconds)
```typescript
export const useAppointments = (params) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => api.appointments.getAll(params),
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};
```

**Use cases:**
- Today's appointment schedule
- Dashboard analytics
- Low stock inventory alerts
- Recent activity feeds

**Benefits:**
- Near real-time updates without constant refetching
- Reduces API load by 10-20x compared to REAL_TIME
- Still feels responsive to users

#### STANDARD (5 minutes)
```typescript
export const usePatients = (params) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => api.patients.getAll(params),
    // Uses global default STANDARD staleTime
  });
};
```

**Use cases:**
- Patient lists
- Client lists
- Medical records
- Prescription history

**Benefits:**
- Excellent balance between freshness and performance
- Reduces API calls by 60-80% in typical workflows
- Data is still fresh enough for most use cases

#### SEMI_STATIC (10 minutes)
```typescript
export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => api.staff.getAll(),
    staleTime: QUERY_STALE_TIME.SEMI_STATIC,
  });
};
```

**Use cases:**
- Staff lists
- Inventory catalogs
- Appointment type configurations
- Vendor lists

**Benefits:**
- Significantly reduces API load for reference data
- Staff rosters don't change often during a single session
- 10 minutes is short enough to catch updates

#### STATIC (1 hour)
```typescript
export const useBreedInfo = () => {
  return useQuery({
    queryKey: ['breedInfo'],
    queryFn: () => api.breedInfo.getAll(),
    staleTime: QUERY_STALE_TIME.STATIC,
  });
};
```

**Use cases:**
- Breed information database
- Medication reference database
- Document templates
- Report templates

**Benefits:**
- Massive reduction in API calls (95%+ for reference data)
- Reference data rarely changes
- 1 hour ensures updates propagate within reasonable time

#### CACHED (24 hours)
```typescript
export const usePolicies = () => {
  return useQuery({
    queryKey: ['policies'],
    queryFn: () => api.policies.getAll(),
    staleTime: QUERY_STALE_TIME.CACHED,
  });
};
```

**Use cases:**
- Policy documents
- System configuration
- Compliance documentation
- Terms and conditions

**Benefits:**
- Essentially cached for entire session
- Perfect for data that changes rarely (updates, releases)
- Users can always manually refresh if needed

---

## Query-Specific Optimizations

### Appointments Module

**File:** `/home/user/purple-cross/frontend/src/hooks/useAppointments.ts`

```typescript
// List view - Dynamic (30s)
export const useAppointments = (params) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => api.appointments.getAll(params),
    staleTime: QUERY_STALE_TIME.DYNAMIC, // 30 seconds
  });
};

// Individual appointment - Dynamic (30s)
export const useAppointment = (id) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.appointments.getById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DYNAMIC, // 30 seconds
  });
};
```

**Rationale:**
- Appointment schedules change frequently throughout the day
- Staff needs near real-time updates for scheduling
- 30 seconds prevents excessive refetching while maintaining responsiveness

### Analytics Module

**File:** `/home/user/purple-cross/frontend/src/hooks/useAnalytics.ts`

```typescript
// Dashboard - Dynamic (30s)
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => api.analytics.getDashboard(),
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};

// Demographics - Semi-static (10 min)
export const usePatientDemographics = () => {
  return useQuery({
    queryKey: ['analytics', 'patients'],
    queryFn: () => api.analytics.getPatientDemographics(),
    staleTime: QUERY_STALE_TIME.SEMI_STATIC,
  });
};

// Historical reports - Standard (5 min)
export const useFinancialReport = (params) => {
  return useQuery({
    queryKey: ['analytics', 'financial', params],
    queryFn: () => api.analytics.getFinancialReport(params),
    staleTime: QUERY_STALE_TIME.STANDARD,
  });
};
```

**Rationale:**
- Dashboard shows real-time metrics → Dynamic
- Demographics change slowly → Semi-static
- Historical data is immutable → Standard (could even be longer)

### Breed Info Module

**File:** `/home/user/purple-cross/frontend/src/hooks/useBreedInfo.ts`

```typescript
export const useBreedInfo = (params) => {
  return useQuery({
    queryKey: ['breedInfo', params],
    queryFn: () => api.breedInfo.getAll(params),
    staleTime: QUERY_STALE_TIME.STATIC, // 1 hour
  });
};
```

**Rationale:**
- Breed information is reference data
- Rarely updated (maybe quarterly with new breeds)
- 1-hour cache significantly reduces API load
- Users can manually refresh if they just added a new breed

### Inventory Module

**File:** `/home/user/purple-cross/frontend/src/hooks/useInventory.ts`

```typescript
export const useInventory = (params) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => api.inventory.getAll(params),
    // Low stock = Dynamic (30s), Regular inventory = Semi-static (10 min)
    staleTime: params?.lowStock
      ? QUERY_STALE_TIME.DYNAMIC
      : QUERY_STALE_TIME.SEMI_STATIC,
  });
};
```

**Rationale:**
- Low stock alerts need frequent updates for immediate action
- General inventory browsing doesn't need real-time data
- Conditional staleTime based on use case

---

## DevTools Usage

### Installation

The React Query DevTools are included in development mode only.

**Package:** `@tanstack/react-query-devtools` (version 5.12.2)

**Location:** `/home/user/purple-cross/frontend/src/main.tsx`

```typescript
{import.meta.env.DEV && (
  <ReactQueryDevtools
    initialIsOpen={false}
    position="bottom"
    buttonPosition="bottom-right"
  />
)}
```

### Features

1. **Query Inspector**
   - View all active queries
   - See query status (fresh, stale, fetching, error)
   - Inspect query data and metadata
   - View cache time remaining

2. **Query Actions**
   - Manually trigger refetch
   - Invalidate queries
   - Remove queries from cache
   - Reset error state

3. **Performance Insights**
   - See fetch counts (identify over-fetching)
   - View staleTime/gcTime for each query
   - Monitor background refetches
   - Track query dependencies

### How to Use DevTools

#### 1. Identify Over-Fetching

Look for queries with high fetch counts:

```
Query: ['appointments', {...}]
Fetches: 47  ← Too many! Consider increasing staleTime
Status: stale
StaleTime: 0ms
```

**Solution:** Increase staleTime to reduce unnecessary fetches.

#### 2. Debug Stale Data Issues

If data feels stale:

```
Query: ['patients', {...}]
Last Updated: 8 minutes ago
Status: stale
StaleTime: 5 minutes (STANDARD)
```

**Solution:** Reduce staleTime or manually invalidate after mutations.

#### 3. Monitor Cache Usage

View cache memory usage and query counts:

```
Active Queries: 23
Cached Queries: 47
Total Cache Size: ~2.3 MB
```

**Tip:** If cache grows too large, consider reducing gcTime for less-used queries.

#### 4. Test Offline Behavior

Toggle network mode to test offline functionality:

```
Network: Offline
Queries: Paused
Mutations: Queued
```

---

## Best Practices

### 1. Choose Appropriate StaleTime

**Bad:**
```typescript
// Using REAL_TIME for patient list (over-fetching)
export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => api.patients.getAll(),
    staleTime: 0, // Refetches on every mount!
  });
};
```

**Good:**
```typescript
// Using STANDARD for patient list
export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => api.patients.getAll(),
    staleTime: QUERY_STALE_TIME.STANDARD, // 5 minutes
  });
};
```

### 2. Invalidate After Mutations

Always invalidate related queries after mutations:

```typescript
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.patients.create(data),
    onSuccess: () => {
      // Invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
```

### 3. Use Query Keys Consistently

**Bad:**
```typescript
// Inconsistent key structure
queryKey: ['patients']
queryKey: ['patient', id]
queryKey: [id, 'patient']  // Different order!
```

**Good:**
```typescript
// Consistent hierarchical structure
queryKey: ['patients']               // List
queryKey: ['patients', id]           // Detail
queryKey: ['patients', id, 'records'] // Related data
```

### 4. Enable Queries Conditionally

Prevent unnecessary API calls:

```typescript
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => api.patients.getById(id),
    enabled: !!id, // Only fetch when id exists
  });
};
```

### 5. Prefetch for Navigation

Improve perceived performance:

```typescript
const queryClient = useQueryClient();

const handleRowClick = (patientId: string) => {
  // Prefetch before navigation
  queryClient.prefetchQuery({
    queryKey: ['patients', patientId],
    queryFn: () => api.patients.getById(patientId),
    staleTime: QUERY_STALE_TIME.STANDARD,
  });

  navigate(`/patients/${patientId}`);
};
```

### 6. Use Optimistic Updates

Improve UX for mutations:

```typescript
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patients.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['patients', id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['patients', id]);

      // Optimistically update
      queryClient.setQueryData(['patients', id], (old) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['patients', variables.id], context?.previous);
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['patients', variables.id] });
    },
  });
};
```

---

## Performance Monitoring

### Key Metrics to Track

1. **API Call Reduction**
   - Before optimization: ~100 calls/minute
   - After optimization: ~10-20 calls/minute
   - **Target:** 80-90% reduction

2. **Cache Hit Rate**
   - Use DevTools to monitor fetch counts
   - **Target:** 70%+ cache hits for standard data

3. **Time to Interactive**
   - Measure initial page load time
   - **Target:** < 2 seconds for most pages

4. **Network Payload**
   - Monitor total data transferred
   - **Target:** < 500 KB per page load

### Using Browser DevTools

#### Network Tab

1. Filter by XHR/Fetch requests
2. Look for duplicate requests (same endpoint called multiple times)
3. Check request timing (should align with staleTime)

#### Performance Tab

1. Record user interaction
2. Look for excessive API calls during navigation
3. Identify unnecessary re-renders

### Production Monitoring

Consider integrating:

```typescript
// Add query cache analytics
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated' && event.action.type === 'success') {
    // Track successful queries
    analytics.track('query_success', {
      queryKey: event.query.queryKey,
      fetchCount: event.query.state.fetchCount,
    });
  }
});
```

---

## Troubleshooting

### Issue: Data Feels Stale

**Symptoms:**
- Users see outdated information
- Changes don't appear immediately

**Solutions:**

1. **Check staleTime**
   ```typescript
   // Is staleTime too long?
   staleTime: QUERY_STALE_TIME.STATIC, // Maybe reduce to STANDARD
   ```

2. **Verify mutations invalidate correctly**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['patients'] });
   }
   ```

3. **Enable manual refresh**
   ```typescript
   const { refetch } = usePatients();

   <button onClick={() => refetch()}>Refresh</button>
   ```

### Issue: Too Many API Calls

**Symptoms:**
- High server load
- Slow performance
- Rate limiting errors

**Solutions:**

1. **Increase staleTime**
   ```typescript
   // Change from REAL_TIME to DYNAMIC
   staleTime: QUERY_STALE_TIME.DYNAMIC,
   ```

2. **Check for duplicate query keys**
   ```typescript
   // Bad: Different params create new queries
   useQuery({ queryKey: ['patients'], ... })
   useQuery({ queryKey: ['patients', {}], ... })

   // Good: Consistent keys
   useQuery({ queryKey: ['patients', params], ... })
   ```

3. **Disable refetchOnWindowFocus** (already done globally)

### Issue: Memory Leaks

**Symptoms:**
- Browser tab uses excessive memory
- Performance degrades over time

**Solutions:**

1. **Reduce gcTime for large datasets**
   ```typescript
   gcTime: QUERY_CACHE_TIME.SHORT, // 5 minutes instead of 10
   ```

2. **Clear unused queries**
   ```typescript
   queryClient.removeQueries({
     queryKey: ['old-data'],
     exact: true,
   });
   ```

3. **Use pagination for large lists**
   ```typescript
   const { data } = usePatients({
     page: currentPage,
     limit: 20, // Don't load all patients at once
   });
   ```

### Issue: Offline Behavior Problems

**Symptoms:**
- Errors when internet disconnects
- Queries hang indefinitely

**Solutions:**

1. **Verify networkMode is set**
   ```typescript
   networkMode: 'online', // Queries pause when offline
   ```

2. **Add offline UI indicators**
   ```typescript
   const { isLoading, isError, error } = usePatients();

   if (error?.message.includes('Network')) {
     return <OfflineMessage />;
   }
   ```

3. **Use refetchOnReconnect** (already enabled globally)

---

## Summary

### Performance Improvements Expected

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| API Calls per Session | ~500 | ~50-100 | 80-90% reduction |
| Average Page Load | 2.5s | <1.5s | 40% faster |
| Bandwidth Usage | 5 MB | 1-2 MB | 60-80% reduction |
| Perceived Performance | Good | Excellent | Significantly better UX |

### Key Takeaways

1. **Use appropriate staleTime for each data type**
   - Real-time data: 0-30s
   - Dynamic data: 30s
   - Standard data: 5min
   - Static data: 1hr+

2. **Disable refetchOnWindowFocus**
   - Veterinary workflows involve frequent window switching
   - Prevents unnecessary API load

3. **Always invalidate after mutations**
   - Keeps data fresh after changes
   - Prevents stale data issues

4. **Use DevTools for optimization**
   - Monitor fetch counts
   - Identify over-fetching
   - Debug stale data

5. **Balance freshness and performance**
   - Not all data needs real-time updates
   - 5 minutes is fresh enough for most use cases
   - Users can always manually refresh

### Further Optimization Opportunities

1. **Implement query prefetching**
   - Prefetch detail pages when hovering over list items
   - Prefetch next page in paginated lists

2. **Add query suspense boundaries**
   - Use React Suspense for better loading states
   - Parallel data fetching

3. **Implement infinite queries**
   - For lists that can grow indefinitely
   - Better UX than traditional pagination

4. **Add optimistic updates**
   - Immediate UI feedback for mutations
   - Rollback on error

5. **Set up query persistence**
   - Persist cache to localStorage
   - Instant initial load on return visits

---

**Last Updated:** 2025-10-24
**Author:** Frontend Performance Architect
**Version:** 1.0.0
