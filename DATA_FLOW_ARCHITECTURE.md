# Data Flow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Purple Cross Frontend                    │
│                    Enterprise Veterinary Platform                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────┐
│   User Action    │
│  (Click, Input)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      React Component                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  const { data, isLoading, error } = usePatients()      │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      Custom Hook Layer                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  usePatients() {                                       │  │
│  │    return useQuery({                                   │  │
│  │      queryKey: ['patients'],                           │  │
│  │      queryFn: () => api.patients.getAll()              │  │
│  │    })                                                   │  │
│  │  }                                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                     React Query Layer                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Cache Management                                    │  │
│  │  • Request Deduplication                               │  │
│  │  • Background Refetching                               │  │
│  │  • Optimistic Updates                                  │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      API Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  api.patients.getAll() {                               │  │
│  │    this.client.get('/patients')                        │  │
│  │  }                                                      │  │
│  │                                                         │  │
│  │  Interceptors:                                         │  │
│  │  • Add Authorization Token                             │  │
│  │  • Handle 401 Errors                                   │  │
│  │  • Transform Responses                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      HTTP Request (Axios)                     │
│  GET https://api.example.com/api/v1/patients                 │
│  Headers: { Authorization: "Bearer <token>" }                │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      Backend API Server                       │
│  • Process Request                                            │
│  • Query Database                                             │
│  • Return Response                                            │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼ (Response flows back up)
┌──────────────────────────────────────────────────────────────┐
│                      React Query Cache                        │
│  Cache Key: ['patients']                                      │
│  Status: success                                              │
│  Data: { data: [...], pagination: {...} }                    │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      Component Re-render                      │
│  • data is available                                          │
│  • isLoading = false                                          │
│  • error = null                                               │
│  → Display data in UI                                         │
└──────────────────────────────────────────────────────────────┘
```

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    15 Module Categories                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Patient    │  │    Client    │  │ Appointment  │     │
│  │  Management  │  │  Management  │  │  Scheduling  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Medical    │  │ Prescription │  │  Inventory   │     │
│  │   Records    │  │  Management  │  │  Management  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Billing    │  │  Laboratory  │  │    Staff     │     │
│  │   Payment    │  │  Management  │  │  Management  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Communication │  │   Document   │  │  Reporting   │     │
│  │  & Messaging │  │  Management  │  │  & Analytics │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Compliance  │  │ Integration  │  │    Mobile    │     │
│  │  Regulatory  │  │  & API Mgmt  │  │ Remote Access│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│                           ▼                                 │
│         ┌──────────────────────────────────┐               │
│         │    11 Custom React Query Hooks   │               │
│         └──────────────────────────────────┘               │
│                           ▼                                 │
│         ┌──────────────────────────────────┐               │
│         │      Centralized API Client      │               │
│         └──────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Custom Hooks Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Custom Hooks (11 Total - 656 LOC)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  usePatients           → Patient Management                 │
│  useClients            → Client Management                  │
│  useAppointments       → Appointment Scheduling             │
│  useMedicalRecords     → Medical Records & History          │
│  usePrescriptions      → Prescription Management            │
│  useInventory          → Inventory & Supply Chain           │
│  useInvoices           → Billing & Payment Processing       │
│  useLabTests           → Laboratory Management              │
│  useStaff              → Staff & User Management            │
│  useCommunications     → Communication & Messaging          │
│  useDocuments          → Document Management                │
│  useAnalytics          → Reporting & Analytics              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    State Management Flow                     │
└─────────────────────────────────────────────────────────────┘

  Initial Load
  ────────────
  Component → Hook → React Query → API → Backend
                         │
                         ▼
                   [Cache Empty]
                         │
                         ▼
                   Fetch Data
                         │
                         ▼
                   Cache Result
                         │
                         ▼
                  Return to Component


  Subsequent Loads (Cached)
  ─────────────────────────
  Component → Hook → React Query
                         │
                         ▼
                   [Cache Hit]
                         │
                         ▼
                  Return Cached Data
                         │
                         ▼
              (Optional Background Refetch)


  Mutation (Create/Update/Delete)
  ──────────────────────────────
  User Action → Mutation Hook → API → Backend
                     │
                     ▼
              onSuccess Callback
                     │
                     ▼
           Invalidate Query Cache
                     │
                     ▼
          Automatic Refetch Triggered
                     │
                     ▼
              UI Updates with Fresh Data
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Error Handling Layers                      │
└─────────────────────────────────────────────────────────────┘

  Layer 1: API Client Interceptor
  ────────────────────────────────
  • Catches 401 (Unauthorized) → Redirect to login
  • Logs errors globally
  • Transforms error responses


  Layer 2: React Query Error State
  ─────────────────────────────────
  • Stores error in query state
  • Provides error object to component
  • Automatic retry (configured: 1 retry)


  Layer 3: Component UI
  ─────────────────────
  • Displays error message to user
  • Provides fallback UI
  • Option to retry
```

## Cache Invalidation Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Cache Invalidation Patterns                 │
└─────────────────────────────────────────────────────────────┘

  Create Operation
  ────────────────
  Create Patient → Success → Invalidate ['patients']
                                    │
                                    ▼
                              All patient queries refetch
                              (list, filters, pagination)


  Update Operation
  ────────────────
  Update Patient → Success → Invalidate ['patients']
                         └─→ Invalidate ['patient', id]
                                    │
                                    ▼
                              Specific patient + list refetch


  Delete Operation
  ────────────────
  Delete Patient → Success → Invalidate ['patients']
                                    │
                                    ▼
                              List refetches without deleted item
```

## Loading State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Loading State Flow                        │
└─────────────────────────────────────────────────────────────┘

  Initial Request
  ───────────────
  isLoading: true  ─┐
  data: undefined   │ → Display: Loading Spinner
  error: null      ─┘


  Success State
  ─────────────
  isLoading: false ─┐
  data: {...}       │ → Display: Data Table/List
  error: null      ─┘


  Error State
  ───────────
  isLoading: false ─┐
  data: undefined   │ → Display: Error Message
  error: {...}     ─┘


  Refetching (Background)
  ───────────────────────
  isLoading: false      ─┐
  isFetching: true       │ → Display: Data + Subtle Indicator
  data: {...} (stale)    │
  error: null           ─┘
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Features                        │
└─────────────────────────────────────────────────────────────┘

  1. Request Deduplication
     ────────────────────
     Multiple components requesting same data
     → Only one API call made
     → All components share result


  2. Stale-While-Revalidate
     ──────────────────────
     Return cached data immediately
     → Fetch fresh data in background
     → Update UI when new data arrives


  3. Automatic Background Refetching
     ────────────────────────────────
     On window focus (disabled by default)
     On network reconnect
     On configurable intervals


  4. Smart Cache Invalidation
     ────────────────────────
     Only invalidate affected queries
     Automatic refetch of visible queries
     Garbage collection of unused cache


  5. Optimistic Updates (ready to implement)
     ────────────────────────────────────────
     Update UI immediately
     → API call in background
     → Rollback if fails
```

## Type Safety Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      TypeScript Safety                       │
└─────────────────────────────────────────────────────────────┘

  API Response Type
  ─────────────────
  interface PatientsResponse {
    status: string;
    data: Patient[];
    pagination: Pagination;
  }


  Hook Return Type
  ────────────────
  usePatients() returns:
    UseQueryResult<PatientsResponse>
      ├─ data: PatientsResponse | undefined
      ├─ isLoading: boolean
      ├─ error: Error | null
      └─ ... (other React Query properties)


  Component Usage
  ───────────────
  const { data, isLoading, error } = usePatients();
  //    ^      ^          ^
  //    |      |          └─ Error | null
  //    |      └──────────── boolean
  //    └─────────────────── PatientsResponse | undefined

  // Type-safe access
  data?.data.map(patient => patient.name)
              //^patient is typed as Patient
```

This architecture provides a robust, scalable, and maintainable foundation for the entire Purple Cross platform!
