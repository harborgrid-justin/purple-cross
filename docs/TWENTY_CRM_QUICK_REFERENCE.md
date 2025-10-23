# Twenty CRM Quick Reference Guide

## Purpose
Quick lookup guide for developers implementing features identified from Twenty CRM analysis. Each section provides essential information for rapid implementation.

---

## 🔥 Top Priority Features (Start Here)

### 1. Sentry Error Tracking
```bash
# Install
npm install @sentry/node @sentry/profiling-node  # Backend
npm install @sentry/react                         # Frontend

# Environment Variables
SENTRY_DSN=your_dsn_here
NODE_ENV=production
```

**Key Files**:
- `backend/src/config/sentry.config.ts`
- `frontend/src/config/sentry.config.ts`
- `backend/src/app.ts` (middleware setup)

**Initialization**:
```typescript
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**Usage**:
```typescript
Sentry.captureException(error, {
  tags: { section: 'appointments' },
  extra: { appointmentId: '123' },
});
```

---

### 2. BullMQ Job Queue
```bash
# Install
npm install bullmq ioredis

# Start Worker
npm run worker

# Environment Variables
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
```

**Key Files**:
- `backend/src/config/queue.config.ts`
- `backend/src/jobs/*.job.ts`
- `backend/src/worker.ts`

**Queue Email**:
```typescript
import { emailQueue } from '@/config/queue.config';

await emailQueue.add('send-email', {
  to: 'user@example.com',
  subject: 'Test',
  template: 'welcome',
  context: { name: 'John' },
});
```

**Create Worker**:
```typescript
import { Worker } from 'bullmq';

const worker = new Worker('email-queue', async (job) => {
  await sendEmail(job.data);
}, { connection: queueConnection });
```

---

### 3. Storybook Setup
```bash
# Install
npx storybook@latest init

# Run
npm run storybook

# Build
npm run build-storybook
```

**Story Template**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta: Meta<typeof Component> = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prop1: 'value1',
  },
};
```

---

### 4. Redis Caching
```typescript
// Get/Set Pattern
import { redis } from '@/config/redis';

// Cache with 1-hour TTL
const cacheKey = `patients:${id}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await fetchFromDB(id);
await redis.setex(cacheKey, 3600, JSON.stringify(data));
return data;

// Invalidate Cache
await redis.del(cacheKey);

// Invalidate Pattern
await redis.eval(`
  for _,k in ipairs(redis.call('keys', ARGV[1])) do
    redis.call('del', k)
  end
`, 0, 'patients:*');
```

---

## 📊 Data Grid Component

### Installation
```bash
npm install @tanstack/react-table react-virtual
```

### Basic Usage
```typescript
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Patient>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'species', header: 'Species' },
];

const table = useReactTable({
  data: patients,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

### Features Checklist
- [ ] Sorting (`getSortedRowModel`)
- [ ] Filtering (`getFilteredRowModel`)
- [ ] Pagination (`getPaginationRowModel`)
- [ ] Grouping (`getGroupedRowModel`)
- [ ] Virtual scrolling (`@tanstack/react-virtual`)
- [ ] Column resizing (`columnResizeMode`)
- [ ] Column pinning (`state.columnPinning`)

---

## 🎯 Kanban Board

### Dependencies
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

### Basic Structure
```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

function KanbanBoard() {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // Update item status
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {/* Kanban columns */}
      </SortableContext>
    </DndContext>
  );
}
```

---

## 🔐 Advanced Permissions

### Permission Check Pattern
```typescript
// Define permissions
enum Permission {
  READ_PATIENT = 'read:patient',
  WRITE_PATIENT = 'write:patient',
  DELETE_PATIENT = 'delete:patient',
}

// Check permission
function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

// Guard decorator (NestJS style)
@RequirePermission(Permission.WRITE_PATIENT)
async updatePatient(id: string, data: UpdatePatientDto) {
  // Implementation
}

// Frontend guard
if (hasPermission(user, Permission.WRITE_PATIENT)) {
  return <EditButton />;
}
```

---

## 🔗 Webhook System

### Webhook Event Structure
```typescript
interface WebhookEvent {
  id: string;
  type: string;
  timestamp: Date;
  data: unknown;
  signature: string;
}

// Event types
enum WebhookEventType {
  APPOINTMENT_CREATED = 'appointment.created',
  APPOINTMENT_UPDATED = 'appointment.updated',
  PATIENT_CREATED = 'patient.created',
  INVOICE_PAID = 'invoice.paid',
}
```

### Webhook Delivery
```typescript
async function deliverWebhook(
  url: string,
  event: WebhookEvent,
  secret: string
): Promise<void> {
  const signature = createHmac('sha256', secret)
    .update(JSON.stringify(event))
    .digest('hex');

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    },
    body: JSON.stringify(event),
  });
}
```

---

## 🤖 Workflow Engine Basics

### Workflow Structure
```typescript
interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'webhook';
  event?: string;
  schedule?: string; // cron expression
}

interface WorkflowAction {
  type: 'email' | 'sms' | 'webhook' | 'task';
  config: Record<string, unknown>;
}
```

### Example Workflow
```typescript
const reminderWorkflow: Workflow = {
  id: 'reminder-1',
  name: 'Appointment Reminder',
  trigger: {
    type: 'schedule',
    schedule: '0 9 * * *', // 9 AM daily
  },
  conditions: [
    {
      field: 'appointment.startTime',
      operator: 'equals',
      value: 'tomorrow',
    },
  ],
  actions: [
    {
      type: 'email',
      config: {
        template: 'appointment-reminder',
        to: '{{ appointment.client.email }}',
      },
    },
  ],
  enabled: true,
};
```

---

## ⚡ Command Palette

### Implementation Pattern
```typescript
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  // Command search and execution logic
}
```

### Command Structure
```typescript
interface Command {
  id: string;
  label: string;
  keywords: string[];
  icon?: ReactNode;
  action: () => void | Promise<void>;
  shortcut?: string;
}

const commands: Command[] = [
  {
    id: 'new-patient',
    label: 'New Patient',
    keywords: ['create', 'add', 'patient'],
    action: () => navigate('/patients/new'),
    shortcut: 'Ctrl+P',
  },
  {
    id: 'new-appointment',
    label: 'New Appointment',
    keywords: ['create', 'schedule', 'appointment'],
    action: () => navigate('/appointments/new'),
    shortcut: 'Ctrl+A',
  },
];
```

---

## 🧪 Testing Patterns

### Storybook Test
```typescript
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

export const TestInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await userEvent.click(button);
    
    await expect(canvas.getByText('Clicked')).toBeInTheDocument();
  },
};
```

### Playwright E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('create patient', async ({ page }) => {
  await page.goto('/patients/new');
  
  await page.fill('[name="name"]', 'Fluffy');
  await page.fill('[name="species"]', 'Cat');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/patients\/\d+/);
});
```

---

## 🔍 Useful Code Snippets

### Debounced Search
```typescript
import { useDeferredValue, useMemo } from 'react';

function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(() => {
    return searchData(deferredQuery);
  }, [deferredQuery]);
  
  return <ResultsList results={results} />;
}
```

### Optimistic Updates
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePatient,
    onMutate: async (newPatient) => {
      await queryClient.cancelQueries(['patients', newPatient.id]);
      
      const previous = queryClient.getQueryData(['patients', newPatient.id]);
      
      queryClient.setQueryData(['patients', newPatient.id], newPatient);
      
      return { previous };
    },
    onError: (err, newPatient, context) => {
      queryClient.setQueryData(['patients', newPatient.id], context?.previous);
    },
  });
}
```

### Virtual List
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📦 Package Recommendations

### Backend
- `bullmq` - Job queue
- `ioredis` - Redis client
- `@sentry/node` - Error tracking
- `@nestjs/bull` - If using NestJS
- `agenda` - Alternative to BullMQ

### Frontend
- `@tanstack/react-table` - Data grids
- `@tanstack/react-virtual` - Virtual scrolling
- `@dnd-kit/core` - Drag and drop
- `@sentry/react` - Error tracking
- `react-hotkeys-hook` - Keyboard shortcuts
- `framer-motion` - Animations

### Testing
- `@playwright/test` - E2E testing
- `@storybook/react-vite` - Component development
- `msw` - API mocking
- `@testing-library/react` - Component testing

### DevOps
- `nx` - Monorepo management
- `@sentry/webpack-plugin` - Source maps
- `patch-package` - Package patches

---

## 🎨 UI Patterns from Twenty

### Theme Configuration
```typescript
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};
```

### Consistent Spacing
```typescript
const Box = styled.div<{ p?: string; m?: string }>`
  padding: ${({ p, theme }) => p ? theme.spacing[p] : 0};
  margin: ${({ m, theme }) => m ? theme.spacing[m] : 0};
`;

// Usage
<Box p="md" m="lg">Content</Box>
```

---

## 🔧 Configuration Examples

### Environment Variables Template
```env
# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret

# BullMQ
BULLMQ_CONCURRENCY=5
BULLMQ_MAX_RETRIES=3

# Webhooks
WEBHOOK_SECRET=your_secret_key
WEBHOOK_TIMEOUT=5000
```

### TypeScript Config Additions
```json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/config/*": ["src/config/*"]
    }
  }
}
```

---

## 🚀 Performance Tips

### Lazy Loading Routes
```typescript
import { lazy, Suspense } from 'react';

const PatientList = lazy(() => import('./pages/PatientList'));
const AppointmentCalendar = lazy(() => import('./pages/AppointmentCalendar'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/patients" element={<PatientList />} />
        <Route path="/appointments" element={<AppointmentCalendar />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const PatientCard = memo(({ patient }: { patient: Patient }) => {
  return <div>{patient.name}</div>;
});

function PatientList({ patients }: { patients: Patient[] }) {
  const sortedPatients = useMemo(
    () => patients.sort((a, b) => a.name.localeCompare(b.name)),
    [patients]
  );
  
  const handleClick = useCallback((id: string) => {
    navigate(`/patients/${id}`);
  }, [navigate]);
  
  return sortedPatients.map((patient) => (
    <PatientCard key={patient.id} patient={patient} onClick={handleClick} />
  ));
}
```

---

## 📚 Resources

- [Twenty CRM Repository](https://github.com/twentyhq/twenty)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Sentry Documentation](https://docs.sentry.io/)
- [TanStack Table](https://tanstack.com/table/v8)
- [Storybook](https://storybook.js.org/)
- [Playwright](https://playwright.dev/)

---

## 🆘 Common Issues

### BullMQ Connection Issues
```typescript
// Issue: Worker not connecting to Redis
// Solution: Ensure maxRetriesPerRequest is null
connection: {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}
```

### Sentry Not Capturing Errors
```typescript
// Issue: Errors not appearing in Sentry
// Solution: Ensure DSN is set and Sentry is initialized before app
initSentry(); // Must be first
const app = express();
```

### Storybook Build Fails
```bash
# Issue: Storybook build errors
# Solution: Clear cache
rm -rf node_modules/.cache
npm run build-storybook
```

---

**Last Updated**: January 2025  
**Maintained by**: Engineering Team  
**Related Docs**: 
- `TWENTY_CRM_FEATURE_ANALYSIS.md`
- `TWENTY_CRM_IMPLEMENTATION_GUIDE.md`
- `EXECUTIVE_SUMMARY_TWENTY_ANALYSIS.md`
