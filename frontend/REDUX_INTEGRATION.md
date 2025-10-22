# Redux Toolkit Integration Guide

## Overview

This document describes the Redux Toolkit integration in the Purple Cross frontend application. The integration follows a hybrid approach that leverages both Redux Toolkit for client-side state management and TanStack Query (React Query) for server-state synchronization.

## Architecture

### Store Structure

The Redux store is configured in `src/store/index.ts` with the following slices:

```
src/
├── store/
│   ├── index.ts                    # Store configuration and typed hooks
│   └── slices/
│       ├── analyticsSlice.ts       # Dashboard analytics state
│       ├── appointmentsSlice.ts    # Appointment management
│       ├── clientsSlice.ts         # Client management
│       ├── communicationsSlice.ts  # Communications state
│       ├── documentsSlice.ts       # Document management
│       ├── inventorySlice.ts       # Inventory tracking
│       ├── invoicesSlice.ts        # Invoice state
│       ├── labTestsSlice.ts        # Lab test results
│       ├── medicalRecordsSlice.ts  # Medical records
│       ├── patientsSlice.ts        # Patient management
│       ├── prescriptionsSlice.ts   # Prescription tracking
│       ├── staffSlice.ts           # Staff management
│       └── uiSlice.ts              # UI state (modals, notifications, theme)
```

### Components Directory

The expanded components directory provides reusable UI components:

```
src/
├── components/
│   ├── index.ts            # Component exports
│   ├── Alert.tsx           # Alert/notification component
│   ├── Button.tsx          # Reusable button with variants
│   ├── Card.tsx            # Card container component
│   ├── Input.tsx           # Form input with validation
│   ├── Layout.tsx          # Main layout (existing)
│   ├── Modal.tsx           # Modal dialog component
│   ├── Spinner.tsx         # Loading spinner
│   └── Table.tsx           # Reusable table component
```

## Usage

### Using the Store

#### 1. Import Typed Hooks

Always use the pre-typed hooks from the store:

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
```

#### 2. Select State

```typescript
const { patients, loading, error } = useAppSelector((state) => state.patients);
```

#### 3. Dispatch Actions

```typescript
const dispatch = useAppDispatch();

// Async thunks
dispatch(fetchPatients({ page: 1, limit: 50 }));

// Synchronous actions
dispatch(setFilters({ search: 'labrador' }));
```

### Slice Structure

Each slice follows a consistent pattern:

```typescript
interface SliceState {
  items: Item[];              // Main data array
  selectedItem: Item | null;  // Currently selected item
  loading: boolean;           // Loading state
  error: string | null;       // Error message
  pagination?: {...};         // Optional pagination
  filters?: {...};            // Optional filters
}
```

### Async Thunks

Each slice provides async thunks for CRUD operations:

```typescript
// Fetch all items
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params) => {
    const response = await api.patients.getAll(params);
    return response;
  }
);

// Fetch single item
export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async (id: string) => {
    const response = await api.patients.getById(id);
    return response.data;
  }
);

// Create, Update, Delete follow similar patterns
```

### Enhanced Hooks

Hooks in `src/hooks/` are enhanced to work with Redux:

```typescript
// Using Redux-integrated hook
export const usePatients = (params?) => {
  const dispatch = useAppDispatch();
  const { patients, loading, error, pagination } = useAppSelector(
    (state) => state.patients
  );

  useEffect(() => {
    dispatch(fetchPatients(params));
  }, [dispatch, params]);

  return { data: patients, isLoading: loading, error, pagination };
};

// Backward-compatible React Query hook
export const usePatientsQuery = (params?) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => api.patients.getAll(params),
  });
};
```

### Component Integration

#### Example: Using Redux in a Page Component

```typescript
import { usePatients } from '../hooks/usePatients';

const PatientsList = () => {
  const { data: patients, isLoading: loading } = usePatients({
    limit: 50,
  });

  if (loading) return <Spinner />;

  return (
    <Table
      columns={columns}
      data={patients}
      keyExtractor={(p) => p.id}
    />
  );
};
```

#### Example: Using UI Slice

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { addNotification, openModal } from '@/store/slices/uiSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { notifications, modals } = useAppSelector((state) => state.ui);

  const handleSuccess = () => {
    dispatch(addNotification({
      type: 'success',
      message: 'Operation completed successfully',
      duration: 3000,
    }));
  };

  const handleOpenModal = () => {
    dispatch(openModal({
      type: 'confirmDialog',
      props: { title: 'Confirm Action' },
    }));
  };

  // ...
};
```

## Reusable Components

### Button Component

```typescript
import { Button } from '@/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="danger" loading={isLoading}>
  Delete
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean

### Card Component

```typescript
import { Card } from '@/components';

<Card
  title="Patient Details"
  subtitle="View and edit patient information"
  actions={<Button>Edit</Button>}
>
  {/* Card content */}
</Card>
```

### Modal Component

```typescript
import { Modal } from '@/components';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit Patient"
  size="lg"
  footer={
    <>
      <Button onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  {/* Modal content */}
</Modal>
```

### Input Component

```typescript
import { Input } from '@/components';

<Input
  label="Patient Name"
  placeholder="Enter patient name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
  required
  fullWidth
/>
```

### Table Component

```typescript
import { Table } from '@/components';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'species', header: 'Species' },
  {
    key: 'actions',
    header: 'Actions',
    render: (item) => <Button onClick={() => handleEdit(item)}>Edit</Button>
  },
];

<Table
  columns={columns}
  data={patients}
  keyExtractor={(p) => p.id}
  onRowClick={handleRowClick}
  loading={loading}
  emptyMessage="No patients found"
/>
```

### Alert Component

```typescript
import { Alert } from '@/components';

<Alert type="success" onClose={handleClose}>
  Patient saved successfully!
</Alert>

<Alert type="error">
  Failed to save patient. Please try again.
</Alert>
```

### Spinner Component

```typescript
import { Spinner } from '@/components';

<Spinner size="lg" label="Loading patients..." />
```

## State Management Strategy

### When to Use Redux vs React Query

**Use Redux for:**
- Client-side UI state (modals, notifications, theme)
- Filters and search criteria
- Multi-step form state
- Cross-component state sharing
- Optimistic updates

**Use React Query for:**
- Server data fetching
- Real-time updates
- Cache management
- Background refetching
- Automatic retry logic

**Use Both (Hybrid Approach):**
- Fetch with React Query, sync to Redux for local state
- Use Redux for immediate UI updates, React Query for server sync
- Example: The enhanced `usePatients` hook uses both

## TypeScript Integration

### Typed Hooks

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Slice Type Safety

All slices are fully typed with TypeScript:

```typescript
interface Patient {
  id: string;
  name: string;
  species: string;
  // ... more fields
}

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  // ...
}
```

## Best Practices

1. **Always use typed hooks** (`useAppDispatch`, `useAppSelector`) instead of raw Redux hooks
2. **Keep slices focused** - Each slice manages a single domain
3. **Use async thunks** for all API calls within Redux
4. **Normalize state** when dealing with relational data
5. **Avoid duplicating server state** - Use React Query for server state
6. **Use selectors** for derived state and memoization
7. **Handle errors gracefully** - Store errors in slice state
8. **Keep UI state in the UI slice** - Centralize modal, notification, and theme state

## Testing

### Testing Components with Redux

```typescript
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';

const mockStore = configureStore({
  reducer: {
    patients: patientsReducer,
    // ... other reducers
  },
  preloadedState: {
    patients: {
      patients: mockPatients,
      loading: false,
      error: null,
    },
  },
});

const { getByText } = render(
  <Provider store={mockStore}>
    <PatientsList />
  </Provider>
);
```

### Testing Async Thunks

```typescript
import { fetchPatients } from '@/store/slices/patientsSlice';

it('should fetch patients successfully', async () => {
  const dispatch = jest.fn();
  const thunk = fetchPatients({ page: 1 });
  
  await thunk(dispatch, () => ({}), undefined);
  
  expect(dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'patients/fetchPatients/fulfilled' })
  );
});
```

## Migration Guide

### Migrating Existing Pages

1. **Replace local state with Redux:**
   ```typescript
   // Before
   const [patients, setPatients] = useState([]);
   
   // After
   const { data: patients } = usePatients();
   ```

2. **Use enhanced hooks:**
   ```typescript
   // Before
   const { data, isLoading } = useQuery(...);
   
   // After
   const { data, isLoading } = usePatients(params);
   ```

3. **Replace raw API calls:**
   ```typescript
   // Before
   const response = await api.patients.getAll();
   
   // After
   dispatch(fetchPatients());
   ```

## Performance Considerations

1. **Memoize selectors** for expensive computations
2. **Use pagination** for large datasets
3. **Normalize nested data** to avoid duplication
4. **Split large slices** if they grow too complex
5. **Use Redux DevTools** for debugging and time-travel

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [TypeScript with Redux](https://redux.js.org/usage/usage-with-typescript)
- [TanStack Query](https://tanstack.com/query/latest)

## Support

For questions or issues with the Redux integration:
1. Check this documentation
2. Review example implementations in `src/pages/Patients.tsx` and `src/pages/Dashboard.tsx`
3. Examine slice implementations in `src/store/slices/`
4. Refer to hook implementations in `src/hooks/`
