# Data Fetching and State Management Implementation

## Overview

This document outlines the comprehensive data fetching and state management solution implemented across all 15 modules of the Purple Cross veterinary practice management platform.

## Architecture

### Technology Stack

- **React Query (@tanstack/react-query)**: Primary data fetching and caching library
- **Axios**: HTTP client for API communication
- **Custom Hooks Pattern**: Reusable data fetching logic encapsulated in hooks
- **TypeScript**: Type safety across all components

### Key Components

1. **API Client** (`frontend/src/services/api.ts`)
   - Centralized Axios instance with interceptors
   - Authentication token management
   - Error handling and request/response transformation
   - Organized endpoints for all 15 modules

2. **Custom Hooks** (`frontend/src/hooks/`)
   - `usePatients.ts` - Patient data management
   - `useClients.ts` - Client data management
   - `useAppointments.ts` - Appointment scheduling
   - `useMedicalRecords.ts` - Medical records management
   - `usePrescriptions.ts` - Prescription management
   - `useInventory.ts` - Inventory and supply chain
   - `useInvoices.ts` - Billing and invoicing
   - `useLabTests.ts` - Laboratory test management
   - `useStaff.ts` - Staff and user management
   - `useCommunications.ts` - Communication and messaging
   - `useDocuments.ts` - Document management
   - `useAnalytics.ts` - Reporting and analytics

3. **Query Client Configuration** (`frontend/src/main.tsx`)
   - Configured with optimal defaults
   - Retry logic: 1 retry on failure
   - Window focus refetch: Disabled for better UX
   - Provides context to entire application

## Implementation Pattern

### Standard Hook Structure

Each custom hook follows this consistent pattern:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// List query
export const useResources = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => api.resources.getAll(params),
  });
};

// Single item query
export const useResource = (id: string) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => api.resources.getById(id),
    enabled: !!id,
  });
};

// Create mutation
export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.resources.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Update mutation
export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.resources.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Delete mutation
export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.resources.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
```

### Component Integration

Modules are updated to use hooks with proper loading and error states:

```typescript
const ModuleName: React.FC = () => {
  const { data, isLoading, error } = useResources();

  return (
    <div className="module-container">
      {/* Loading State */}
      {isLoading && <div className="loading">Loading...</div>}

      {/* Error State */}
      {error && (
        <div className="error">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {/* Data Display */}
      {data && data.data && data.data.length > 0 ? (
        <DataTable data={data.data} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
```

## Module Updates

### Modules with Data Fetching

1. **Patient Management** (`PatientManagement.tsx`)
   - Replaced hardcoded patient data with `usePatients` hook
   - Displays real-time patient information
   - Shows loading and error states

2. **Client Management** (`ClientManagement.tsx`)
   - Replaced hardcoded client data with `useClients` hook
   - Displays client list with pet count
   - Graceful error handling

3. **Appointment Scheduling** (`AppointmentScheduling.tsx`)
   - Replaced hardcoded appointments with `useAppointments` hook
   - Displays appointment calendar data
   - Date/time formatting

4. **Billing & Payment** (`BillingPayment.tsx`)
   - Added `useInvoices` hook for invoice data
   - Shows invoice table when data available
   - Falls back to informational cards when empty

5. **Inventory Management** (`InventoryManagement.tsx`)
   - Added `useInventory` hook for stock data
   - Displays stock levels and alerts
   - Low stock badge indicators

6. **Medical Records** (`MedicalRecords.tsx`)
   - Added `useMedicalRecords` hook
   - Displays patient medical history
   - Diagnosis and treatment information

7. **Prescription Management** (`PrescriptionManagement.tsx`)
   - Added `usePrescriptions` hook
   - Displays prescription history
   - Medication and dosage information

8. **Laboratory Management** (`LaboratoryManagement.tsx`)
   - Added `useLabTests` hook
   - Shows lab test orders and results
   - Status indicators for test completion

9. **Staff Management** (`StaffManagement.tsx`)
   - Added `useStaff` hook
   - Displays employee roster
   - Role and status information

10. **Communication & Messaging** (`CommunicationMessaging.tsx`)
    - Added `useCommunications` hook
    - Shows communication history
    - Multi-channel message display

11. **Document Management** (`DocumentManagement.tsx`)
    - Added `useDocuments` hook
    - Displays document repository
    - File type and size information

12. **Reporting & Analytics** (`ReportingAnalytics.tsx`)
    - Added `useDashboardAnalytics` hook
    - Shows key performance metrics
    - Real-time statistics display

### Informational Modules

These modules maintain informational content as they don't require data fetching:

- **Compliance & Regulatory** - Policy and compliance information
- **Integration & API** - Integration options and API documentation
- **Mobile & Remote Access** - Mobile app features and capabilities

## Benefits

### 1. Consistent Data Management

- Unified approach across all modules
- Predictable data flow and state updates
- Standardized error handling

### 2. Performance Optimization

- Automatic request caching
- Background refetching
- Request deduplication
- Stale-while-revalidate pattern

### 3. Developer Experience

- Type-safe hooks with TypeScript
- Reusable custom hooks
- Minimal boilerplate code
- Easy to test and maintain

### 4. User Experience

- Loading indicators for better feedback
- Graceful error handling
- Optimistic updates capability
- Automatic background refetching

### 5. Maintainability

- Centralized API client configuration
- Single source of truth for data fetching logic
- Easy to extend with new endpoints
- Consistent patterns across codebase

## Query Key Strategy

Query keys are structured hierarchically for optimal cache management:

```typescript
// List queries
['patients'][('patients', { page: 1 })][('patients', { search: 'Max' })][ // All patients // Patients page 1 // Filtered patients
  // Detail queries
  ('patient', '123')
][ // Single patient by ID
  // Nested queries
  ('appointments', { date: '2024-01-15' })
]; // Date-filtered appointments
```

## Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
onSuccess: () => {
  // Invalidate all patient queries
  queryClient.invalidateQueries({ queryKey: ['patients'] });

  // Optionally invalidate specific queries
  queryClient.invalidateQueries({ queryKey: ['patient', id] });
};
```

## Error Handling

Errors are handled at multiple levels:

1. **API Client Level**: Global error interceptor
2. **Hook Level**: Query error state
3. **Component Level**: Error UI rendering

```typescript
// Global error handling in API client
this.client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Component level error display
{error && (
  <div className="error">
    Error: {error instanceof Error ? error.message : 'Unknown error'}
  </div>
)}
```

## Future Enhancements

1. **Optimistic Updates**: Implement optimistic UI updates for mutations
2. **Pagination**: Add pagination helpers for large data sets
3. **Infinite Queries**: Implement infinite scroll for lists
4. **Prefetching**: Add intelligent prefetching for anticipated user actions
5. **Offline Support**: Implement offline-first capabilities with service workers
6. **Real-time Updates**: Add WebSocket support for live data updates

## Testing Considerations

Custom hooks can be tested using React Query's testing utilities:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients } from './usePatients';

test('fetches patients successfully', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => usePatients(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## Conclusion

The implementation provides a robust, scalable, and maintainable data fetching solution across all modules. The consistent use of React Query and custom hooks ensures:

- Reliable data synchronization
- Optimal performance through intelligent caching
- Excellent developer experience
- Superior user experience with proper loading and error states

This foundation supports the platform's growth and makes it easy to add new features or modules in the future.
