# Twenty CRM Feature Implementation Guide

## Overview

This guide provides detailed, actionable implementation steps for integrating the top-priority features identified from the Twenty CRM analysis into Purple Cross. Each feature includes code examples, architectural considerations, and step-by-step migration paths.

---

## Feature 1: BullMQ Background Job Processing

### Why This Matters
Currently, Purple Cross has no dedicated job queue system. This means long-running tasks (emails, reports, data imports) block request threads and can cause timeouts.

### Technical Details

**Twenty's Implementation**:
- Uses BullMQ with Redis for job queuing
- Separate worker process (`twenty-server:worker`)
- Job persistence and retries
- Job scheduling and delayed execution
- Job progress tracking

### Implementation Steps

#### Step 1: Install Dependencies

```bash
cd backend
npm install bullmq ioredis
npm install --save-dev @types/ioredis
```

#### Step 2: Create Queue Configuration

Create `backend/src/config/queue.config.ts`:

```typescript
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Queue, QueueOptions } from 'bullmq';
import { REDIS_URL } from './environment';

// Queue names
export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  REPORTS: 'reports-queue',
  REMINDERS: 'reminders-queue',
  NOTIFICATIONS: 'notifications-queue',
} as const;

// Connection configuration
export const queueConnection: QueueOptions['connection'] = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Create queues
export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600, // 24 hours
    },
    removeOnFail: {
      count: 500,
    },
  },
});

export const reportsQueue = new Queue(QUEUE_NAMES.REPORTS, {
  connection: queueConnection,
});

export const remindersQueue = new Queue(QUEUE_NAMES.REMINDERS, {
  connection: queueConnection,
});

export const notificationsQueue = new Queue(QUEUE_NAMES.NOTIFICATIONS, {
  connection: queueConnection,
});

// Bull Board for monitoring (optional but recommended)
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(reportsQueue),
    new BullMQAdapter(remindersQueue),
    new BullMQAdapter(notificationsQueue),
  ],
  serverAdapter,
});

export { serverAdapter };
```

#### Step 3: Create Job Definitions

Create `backend/src/jobs/email.job.ts`:

```typescript
import { Job } from 'bullmq';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import logger from '../config/logger';
import { sendEmail } from '../services/email.service';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  priority?: number;
}

export async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const { to, subject, template, context } = job.data;
  
  logger.info('Processing email job', {
    jobId: job.id,
    to,
    template,
  });

  try {
    await job.updateProgress(10);
    
    // Send email
    await sendEmail({
      to,
      subject,
      template,
      context,
    });
    
    await job.updateProgress(100);
    
    logger.info('Email sent successfully', {
      jobId: job.id,
      to,
    });
  } catch (error) {
    logger.error('Failed to send email', {
      jobId: job.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw new AppError(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

// Add to queue helper
export async function queueEmail(data: EmailJobData): Promise<string> {
  const { emailQueue } = await import('../config/queue.config');
  
  const job = await emailQueue.add('send-email', data, {
    priority: data.priority || 5,
  });
  
  return job.id!;
}
```

#### Step 4: Create Worker Process

Create `backend/src/worker.ts`:

```typescript
import { Worker } from 'bullmq';
import { queueConnection, QUEUE_NAMES } from './config/queue.config';
import { processEmailJob } from './jobs/email.job';
import logger from './config/logger';

// Email worker
const emailWorker = new Worker(
  QUEUE_NAMES.EMAIL,
  async (job) => {
    await processEmailJob(job);
  },
  {
    connection: queueConnection,
    concurrency: 5, // Process 5 jobs concurrently
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed`, {
    error: err.message,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing workers...');
  await emailWorker.close();
  process.exit(0);
});

logger.info('Worker started');
```

#### Step 5: Update Package Scripts

Update `backend/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "worker": "nodemon --exec ts-node src/worker.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run worker\""
  }
}
```

#### Step 6: Integrate into Services

Update existing email service to use queue:

```typescript
// backend/src/services/email.service.ts
import { queueEmail } from '../jobs/email.job';

export class EmailService {
  async sendAppointmentReminder(appointmentId: string): Promise<void> {
    const appointment = await this.getAppointment(appointmentId);
    
    // Queue the email instead of sending directly
    await queueEmail({
      to: appointment.client.email,
      subject: 'Appointment Reminder',
      template: 'appointment-reminder',
      context: {
        clientName: appointment.client.name,
        appointmentTime: appointment.startTime,
        petName: appointment.patient.name,
      },
      priority: 3, // Higher priority
    });
  }
}
```

### Testing

Create `backend/tests/unit/jobs/email.job.test.ts`:

```typescript
import { Job } from 'bullmq';
import { processEmailJob } from '../../../src/jobs/email.job';
import { sendEmail } from '../../../src/services/email.service';

jest.mock('../../../src/services/email.service');

describe('Email Job', () => {
  it('should process email job successfully', async () => {
    const mockJob = {
      id: 'test-job-1',
      data: {
        to: 'test@example.com',
        subject: 'Test',
        template: 'test-template',
        context: { name: 'Test User' },
      },
      updateProgress: jest.fn(),
    } as unknown as Job;

    await processEmailJob(mockJob);

    expect(sendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test',
      template: 'test-template',
      context: { name: 'Test User' },
    });
    expect(mockJob.updateProgress).toHaveBeenCalledWith(100);
  });
});
```

### Benefits
- ✅ Non-blocking email sending
- ✅ Automatic retries on failure
- ✅ Job prioritization
- ✅ Progress tracking
- ✅ Scheduled jobs (reminders)
- ✅ Job monitoring dashboard

---

## Feature 2: Sentry Error Tracking Integration

### Why This Matters
Production errors are currently invisible unless users report them. Sentry provides real-time error tracking, aggregation, and alerting.

### Implementation Steps

#### Step 1: Install Sentry

```bash
cd backend
npm install @sentry/node @sentry/profiling-node

cd ../frontend
npm install @sentry/react
```

#### Step 2: Backend Configuration

Create `backend/src/config/sentry.config.ts`:

```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NODE_ENV } from './environment';

export function initSentry(): void {
  if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: NODE_ENV,
      integrations: [
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,
      
      beforeSend(event, hint) {
        // Don't send sensitive data
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers.authorization;
          }
        }
        return event;
      },
    });
  }
}

export { Sentry };
```

#### Step 3: Update Express App

Update `backend/src/app.ts`:

```typescript
import express from 'express';
import { initSentry, Sentry } from './config/sentry.config';

// Initialize Sentry FIRST
initSentry();

const app = express();

// Sentry request handler must be first middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... your other middleware and routes ...

// Sentry error handler must be before other error handlers
app.use(Sentry.Handlers.errorHandler());

// Your error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Error already captured by Sentry
  // Your error handling logic
});

export default app;
```

#### Step 4: Frontend Configuration

Create `frontend/src/config/sentry.config.ts`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry(): void {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        new BrowserTracing(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      beforeSend(event) {
        // Filter out irrelevant errors
        if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
          return null;
        }
        return event;
      },
    });
  }
}
```

Update `frontend/src/main.tsx`:

```typescript
import { initSentry } from './config/sentry.config';

initSentry();

// Rest of your app initialization
```

#### Step 5: Custom Error Boundaries

Create `frontend/src/components/ErrorBoundary.tsx`:

```typescript
import * as Sentry from '@sentry/react';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Step 6: Manual Error Capture

```typescript
import { Sentry } from '@sentry/react';

try {
  // Risky operation
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'appointments',
      action: 'create',
    },
    extra: {
      appointmentData: sanitizedData,
    },
  });
  throw error;
}
```

### Benefits
- ✅ Real-time error notifications
- ✅ Error aggregation and trends
- ✅ Performance monitoring
- ✅ Session replay
- ✅ Source map support
- ✅ User impact tracking

---

## Feature 3: Advanced Data Grid Component

### Why This Matters
Current tables lack advanced filtering, sorting, grouping, and inline editing. Twenty's data grid provides enterprise-level features.

### Implementation Approach

Rather than copying Twenty's implementation directly (AGPL license), we'll create our own inspired by their patterns.

#### Step 1: Install Dependencies

```bash
cd frontend
npm install @tanstack/react-table react-window react-virtual
```

#### Step 2: Create Data Grid Hook

Create `frontend/src/hooks/useDataGrid.ts`:

```typescript
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseDataGridOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enableGrouping?: boolean;
}

export function useDataGrid<TData>({
  data,
  columns,
  enableFiltering = true,
  enableSorting = true,
}: UseDataGridOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
  });

  return {
    table,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
  };
}
```

#### Step 3: Create Data Grid Component

Create `frontend/src/components/DataGrid/DataGrid.tsx`:

```typescript
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface DataGridProps<TData> {
  table: TableType<TData>;
  height?: string;
}

export function DataGrid<TData>({ table, height = '600px' }: DataGridProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const rows = table.getRowModel().rows;
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div
      ref={tableContainerRef}
      style={{
        height,
        overflow: 'auto',
      }}
      className="data-grid-container"
    >
      <table className="data-grid">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

#### Step 4: Usage Example

```typescript
// In your component
import { useDataGrid } from '@/hooks/useDataGrid';
import { DataGrid } from '@/components/DataGrid/DataGrid';
import { ColumnDef } from '@tanstack/react-table';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
}

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'species',
    header: 'Species',
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: (info) => `${info.getValue()} years`,
  },
];

export function PatientList() {
  const { data: patients } = usePatients();
  const { table } = useDataGrid({
    data: patients || [],
    columns,
  });

  return (
    <div>
      <DataGrid table={table} />
    </div>
  );
}
```

### Benefits
- ✅ Virtual scrolling for large datasets
- ✅ Sortable columns
- ✅ Filtering capabilities
- ✅ Column resizing
- ✅ Performance optimized
- ✅ Extensible architecture

---

## Feature 4: Storybook Component Development

### Why This Matters
Component isolation and documentation are crucial for maintaining a scalable UI. Storybook provides this infrastructure.

### Implementation Steps

#### Step 1: Install Storybook

```bash
cd frontend
npx storybook@latest init
```

#### Step 2: Configure for Vite

Update `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

#### Step 3: Create Component Story

Create `frontend/src/components/Button/Button.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>💾</span>
        Save
      </>
    ),
  },
};
```

#### Step 4: Add Scripts

Update `frontend/package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### Benefits
- ✅ Component documentation
- ✅ Isolated development
- ✅ Visual testing
- ✅ Design system reference
- ✅ Accessibility testing

---

## Next Steps

1. **Review and prioritize** these implementations based on current business needs
2. **Create tickets** for each feature with acceptance criteria
3. **Set up development branches** for each feature
4. **Test thoroughly** in staging before production
5. **Monitor** new features with Sentry after deployment

## Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Sentry Node.js Documentation](https://docs.sentry.io/platforms/node/)
- [TanStack Table Documentation](https://tanstack.com/table/v8)
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)

---

**Note**: All implementations should follow Purple Cross's existing TypeScript guidelines and coding standards as documented in `docs/TYPESCRIPT_GUIDELINES.md`.
