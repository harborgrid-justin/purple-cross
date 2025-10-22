# Redux Store Quick Reference

## Store Structure

```
store/
├── index.ts              # Store config + typed hooks
└── slices/
    ├── analyticsSlice.ts      # Dashboard stats
    ├── appointmentsSlice.ts   # Appointments
    ├── clientsSlice.ts        # Clients
    ├── communicationsSlice.ts # Communications
    ├── documentsSlice.ts      # Documents
    ├── inventorySlice.ts      # Inventory
    ├── invoicesSlice.ts       # Invoices
    ├── labTestsSlice.ts       # Lab tests
    ├── medicalRecordsSlice.ts # Medical records
    ├── patientsSlice.ts       # Patients
    ├── prescriptionsSlice.ts  # Prescriptions
    ├── staffSlice.ts          # Staff
    └── uiSlice.ts             # UI state
```

## Quick Import Reference

```typescript
// Store and hooks
import { store, useAppDispatch, useAppSelector, RootState, AppDispatch } from '@/store';

// Slices - Actions and Thunks
import {
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  setFilters,
  clearFilters,
} from '@/store/slices/patientsSlice';

// Components
import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  Spinner,
  Table,
} from '@/components';
```

## Common Patterns

### Using Redux State

```typescript
const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.patients);
  
  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);
  
  return <div>...</div>;
};
```

### Async Actions

```typescript
// Fetch all
dispatch(fetchPatients({ page: 1, limit: 50 }));

// Fetch by ID
dispatch(fetchPatientById('patient-123'));

// Create
dispatch(createPatient({ name: 'Buddy', species: 'Dog' }));

// Update
dispatch(updatePatient({ id: '123', data: { name: 'Max' } }));

// Delete
dispatch(deletePatient('123'));
```

### Filters

```typescript
// Set filters
dispatch(setFilters({ search: 'labrador', species: 'dog' }));

// Clear filters
dispatch(clearFilters());
```

### UI State

```typescript
import { addNotification, openModal, toggleSidebar } from '@/store/slices/uiSlice';

// Notifications
dispatch(addNotification({
  type: 'success',
  message: 'Saved successfully',
}));

// Modals
dispatch(openModal({ type: 'confirmDialog', props: { title: 'Confirm' } }));
dispatch(closeModal('modal-id'));

// Sidebar
dispatch(toggleSidebar());
dispatch(setSidebarOpen(false));
```

## Component Cheat Sheet

### Button

```tsx
<Button variant="primary|secondary|danger|success" size="sm|md|lg" loading={bool}>
  Click Me
</Button>
```

### Input

```tsx
<Input
  label="Name"
  value={value}
  onChange={handleChange}
  error="Error message"
  helperText="Help text"
  required
  fullWidth
/>
```

### Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Title"
  size="sm|md|lg|xl"
  footer={<Button>Save</Button>}
>
  Content
</Modal>
```

### Card

```tsx
<Card
  title="Title"
  subtitle="Subtitle"
  actions={<Button>Action</Button>}
>
  Content
</Card>
```

### Table

```tsx
<Table
  columns={[{ key: 'name', header: 'Name' }]}
  data={items}
  keyExtractor={(item) => item.id}
  onRowClick={handleClick}
  loading={loading}
/>
```

### Alert

```tsx
<Alert type="success|error|warning|info" onClose={handleClose}>
  Message
</Alert>
```

## Slice State Structure

```typescript
interface SliceState {
  items: T[];              // Main data
  selectedItem: T | null;  // Selected item
  loading: boolean;        // Loading state
  error: string | null;    // Error message
  pagination?: {...};      // Optional pagination
  filters?: {...};         // Optional filters
}
```

## Available Thunks by Slice

### Patients
- `fetchPatients(params)`
- `fetchPatientById(id)`
- `createPatient(data)`
- `updatePatient({ id, data })`
- `deletePatient(id)`

### Clients
- `fetchClients(params)`
- `fetchClientById(id)`
- `createClient(data)`
- `updateClient({ id, data })`
- `deleteClient(id)`

### Appointments
- `fetchAppointments(params)`
- `fetchAppointmentById(id)`
- `createAppointment(data)`
- `updateAppointment({ id, data })`
- `deleteAppointment(id)`

### Medical Records
- `fetchMedicalRecords(params)`
- `fetchMedicalRecordById(id)`
- `createMedicalRecord(data)`
- `updateMedicalRecord({ id, data })`
- `deleteMedicalRecord(id)`

### Analytics
- `fetchDashboardStats()`

### And more for: Prescriptions, Inventory, Invoices, Lab Tests, Staff, Communications, Documents

## State Selection Examples

```typescript
// Single slice
const patients = useAppSelector((state) => state.patients.patients);

// Multiple properties
const { loading, error } = useAppSelector((state) => state.patients);

// Derived state
const patientCount = useAppSelector((state) => state.patients.patients.length);

// Multiple slices
const data = useAppSelector((state) => ({
  patients: state.patients.patients,
  clients: state.clients.clients,
}));
```

## Accessing State Outside Components

```typescript
import { store } from '@/store';

// Get current state
const state = store.getState();
const patients = state.patients.patients;

// Dispatch action
store.dispatch(fetchPatients());
```

## TypeScript Types

```typescript
// State type
type RootState = ReturnType<typeof store.getState>;

// Dispatch type
type AppDispatch = typeof store.dispatch;

// Use in component
const MyComponent: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const state: RootState = useAppSelector((state) => state);
};
```

## Redux DevTools

Available actions:
- Time-travel debugging
- Action replay
- State inspection
- Action filtering
- State diffing

Access via browser extension in development mode.

## Common Gotchas

1. ❌ `useSelector` → ✅ `useAppSelector` (use typed version)
2. ❌ `useDispatch` → ✅ `useAppDispatch` (use typed version)
3. ❌ Mutating state directly → ✅ Use Immer via Redux Toolkit
4. ❌ Storing functions in state → ✅ Only serializable data
5. ❌ Large objects in state → ✅ Normalize and paginate

## Performance Tips

1. Use `useMemo` for expensive selector computations
2. Split selectors to prevent unnecessary re-renders
3. Use `createSelector` from reselect for memoization
4. Keep slices normalized (avoid nested objects)
5. Use pagination for large datasets
