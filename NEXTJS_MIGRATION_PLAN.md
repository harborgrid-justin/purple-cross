# Next.js Migration Plan - Purple Cross

## Executive Summary

This plan outlines a comprehensive 30-point strategy to migrate the Purple Cross frontend from React 18 + Vite to Next.js 15 while transitioning the backend from Express to NestJS and migrating the database from PostgreSQL to SQLite.

**Current State:**
- Frontend: React 18 + Vite + TanStack Query + React Router
- Backend: Express + Prisma ORM + PostgreSQL
- Database: PostgreSQL

**Target State:**
- Frontend: Next.js 15 (App Router) + Server Components + TanStack Query
- Backend: NestJS (already exists in `backend-nestjs/`)
- Database: SQLite with Prisma ORM

---

## Phase 1: Pre-Migration Assessment & Setup (Points 1-5)

### 1. Create Feature Inventory & Dependency Analysis
**Action:** Audit current frontend codebase to document all features, routes, components, and external dependencies.

**Tasks:**
- Generate complete route inventory from `frontend/src/pages/`
- Document all React components and their dependencies
- List all TanStack Query hooks and API integrations
- Identify shared components and utilities
- Document state management patterns (Zustand stores)
- Map all environment variables and configuration

**Deliverables:**
- `FRONTEND_INVENTORY.md` - Complete feature list
- `DEPENDENCIES_MATRIX.md` - External dependencies and compatibility
- `ROUTES_MAPPING.md` - Current routes → Next.js routes mapping

---

### 2. Set Up Next.js Project Structure
**Action:** Create new Next.js 15 application with App Router and TypeScript.

**Tasks:**
```bash
# Create Next.js app alongside existing frontend
npx create-next-app@latest frontend-nextjs --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**Configuration:**
- Enable TypeScript strict mode
- Configure path aliases matching current structure
- Set up ESLint + Prettier (match existing standards)
- Configure `next.config.js` for API proxy during migration
- Set up environment variable management (.env.local)

**Directory Structure:**
```
frontend-nextjs/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/         # Auth route group
│   │   ├── (dashboard)/    # Dashboard route group
│   │   └── api/            # API routes (if needed)
│   ├── components/         # Migrated from frontend/src/components
│   ├── services/           # API client layer
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── lib/                # Utilities and helpers
│   └── constants/          # Migrated from frontend/src/constants
```

---

### 3. Configure NestJS Backend for Production
**Action:** Prepare the existing NestJS backend for production use.

**Tasks:**
- Review `backend-nestjs/src/` structure and completeness
- Ensure all Express endpoints are migrated to NestJS controllers
- Configure CORS for Next.js frontend (port 3000 for Next.js)
- Update environment variables (.env for NestJS)
- Set up Swagger/OpenAPI documentation
- Configure health check endpoints
- Implement proper error handling and validation (class-validator)
- Set up logging with Winston/nest-winston

**Validation:**
```bash
cd backend-nestjs
npm install
npm run start:dev  # Verify backend starts successfully
```

---

### 4. Migrate Database from PostgreSQL to SQLite
**Action:** Update Prisma schema and migrate data to SQLite.

**Tasks:**

**4.1. Update Prisma Schema:**
```prisma
// backend-nestjs/prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

// Review all models for SQLite compatibility:
// - Remove @db.Uuid → Use String @default(uuid())
// - Replace @db.Text → Use String
// - Change DateTime precision if needed
// - Update unique constraints for SQLite
// - Remove PostgreSQL-specific features (enums → strings)
```

**4.2. Create SQLite Database:**
```bash
cd backend-nestjs

# Update .env
echo "DATABASE_URL=\"file:./dev.db\"" > .env

# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate dev --name migrate_to_sqlite

# Seed initial data
npm run prisma:seed
```

**4.3. Data Migration Strategy:**
- Export production data from PostgreSQL (if exists): `pg_dump` or Prisma export script
- Transform data for SQLite compatibility
- Import into SQLite using Prisma seed script
- Validate data integrity

**Considerations:**
- SQLite doesn't support some PostgreSQL features (ENUM, array types, full-text search)
- Replace ENUM types with string constants + validation
- Document schema changes in `SCHEMA_MIGRATION.md`

---

### 5. Set Up Parallel Development Environment
**Action:** Configure monorepo to run both old and new frontends simultaneously.

**Update Root `package.json`:**
```json
{
  "scripts": {
    "dev:old": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:new": "concurrently \"npm run dev:nestjs\" \"npm run dev:nextjs\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:nestjs": "cd backend-nestjs && npm run start:dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:nextjs": "cd frontend-nextjs && npm run dev",
    "install:nextjs": "cd frontend-nextjs && npm install",
    "install:all": "npm install && npm run install:nextjs && cd backend && npm install && cd ../backend-nestjs && npm install && cd ../frontend && npm install"
  }
}
```

**Port Configuration:**
- NestJS Backend: Port 4000
- Next.js Frontend: Port 3000
- Old Vite Frontend: Port 5173 (keep running during migration)
- Old Express Backend: Port 3001 (backup)

---

## Phase 2: Core Infrastructure Migration (Points 6-12)

### 6. Set Up Next.js API Integration Layer
**Action:** Create API client for communicating with NestJS backend.

**Create `src/lib/api-client.ts`:**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth tokens
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token'); // or use cookies
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401, 403, etc.
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // ... put, patch, delete methods
}

export const apiClient = new ApiClient();
```

**Migrate Constants:**
- Copy `frontend/src/constants/index.ts` → `frontend-nextjs/src/constants/index.ts`
- Update API endpoints to match NestJS routes
- Update `API_CONFIG.BASE_URL` to point to NestJS (port 4000)

---

### 7. Implement Authentication & Session Management
**Action:** Set up Next.js authentication with JWT from NestJS.

**Options:**
1. **NextAuth.js (Recommended)** - Industry standard for Next.js
2. **Custom JWT handling** - Direct integration with NestJS JWT

**With NextAuth.js:**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/api-client';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.token) {
          return { ...response.user, token: response.token };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Alternative: Custom JWT Middleware**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/patients/:path*', '/appointments/:path*'],
};
```

---

### 8. Set Up State Management Strategy
**Action:** Configure TanStack Query v5 for server state and determine client state strategy.

**Install Dependencies:**
```bash
cd frontend-nextjs
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand # For client state (if needed)
```

**Create Query Provider:**
```typescript
// src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Update Root Layout:**
```typescript
// src/app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Strategy:**
- Use TanStack Query for all server state (API data)
- Use Zustand only for UI state (modals, filters, preferences)
- Leverage Next.js Server Components for initial data loading
- Use Client Components with `useQuery` for interactive features

---

### 9. Migrate TypeScript Types & Interfaces
**Action:** Copy and update all TypeScript definitions for Next.js compatibility.

**Tasks:**
- Copy `frontend/src/types/` → `frontend-nextjs/src/types/`
- Review all type definitions for Next.js compatibility
- Add Next.js-specific types (Metadata, PageProps, etc.)
- Ensure types match NestJS DTOs from backend

**Example Type Updates:**
```typescript
// src/types/patient.ts
export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: string;
  color?: string;
  weight?: number;
  microchipId?: string;
  insuranceProvider?: string;
  insurancePolicy?: string;
  status: 'active' | 'inactive' | 'deceased';
  ownerId: string;
  owner?: Client;
  createdAt: Date;
  updatedAt: Date;
}

// Next.js Page Props
export interface PatientPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
```

**Generate Types from Backend:**
- Consider using Prisma Client types directly
- Or use OpenAPI/Swagger generator from NestJS
- Ensure type safety across frontend-backend boundary

---

### 10. Create Shared Component Library
**Action:** Migrate reusable UI components to Next.js with Server/Client Component distinction.

**Tasks:**

**10.1. Identify Component Types:**
- **Server Components** (default): Static layouts, data fetching, read-only views
- **Client Components** (`'use client'`): Interactive forms, event handlers, hooks

**10.2. Migration Strategy:**
```typescript
// Server Component (default)
// src/components/PatientCard.tsx
import { Patient } from '@/types';

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="patient-card">
      <h3>{patient.name}</h3>
      <p>{patient.species} - {patient.breed}</p>
    </div>
  );
}

// Client Component (interactive)
// src/components/PatientForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function PatientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... form logic
}
```

**10.3. Component Migration Checklist:**
- [ ] Copy component from `frontend/src/components/`
- [ ] Add `'use client'` directive if needed (uses hooks, event handlers, browser APIs)
- [ ] Update imports to use Next.js path aliases
- [ ] Replace React Router navigation with Next.js `<Link>` and `useRouter`
- [ ] Update styling (CSS modules or Tailwind)
- [ ] Add proper TypeScript types

**Priority Components to Migrate:**
1. Layout components (Header, Sidebar, Footer)
2. Form components (Input, Select, DatePicker)
3. Table components (DataTable with TanStack Table)
4. Modal/Dialog components
5. Navigation components
6. Card/List components

---

### 11. Configure Routing & Navigation
**Action:** Map React Router routes to Next.js App Router structure.

**Route Mapping:**

**Current (React Router):**
```
/login                    → Login page
/dashboard               → Dashboard
/patients                → Patient list
/patients/:id            → Patient detail
/patients/new            → New patient
/appointments            → Appointments
/billing                 → Billing
```

**Next.js App Router Structure:**
```
src/app/
├── layout.tsx                          # Root layout
├── page.tsx                            # Home page (redirect to /dashboard)
├── (auth)/                             # Auth route group (no layout)
│   ├── login/
│   │   └── page.tsx                    # /login
│   └── register/
│       └── page.tsx                    # /register
├── (dashboard)/                        # Dashboard route group (shared layout)
│   ├── layout.tsx                      # Dashboard layout (sidebar, header)
│   ├── dashboard/
│   │   └── page.tsx                    # /dashboard
│   ├── patients/
│   │   ├── page.tsx                    # /patients (list)
│   │   ├── new/
│   │   │   └── page.tsx                # /patients/new
│   │   └── [id]/
│   │       ├── page.tsx                # /patients/:id (detail)
│   │       └── edit/
│   │           └── page.tsx            # /patients/:id/edit
│   ├── appointments/
│   │   ├── page.tsx                    # /appointments
│   │   └── [id]/
│   │       └── page.tsx                # /appointments/:id
│   ├── billing/
│   │   └── page.tsx                    # /billing
│   ├── clients/
│   │   └── page.tsx                    # /clients
│   └── medical-records/
│       └── page.tsx                    # /medical-records
└── api/                                # API routes (if needed)
    └── health/
        └── route.ts                    # /api/health
```

**Navigation Updates:**
```typescript
// Replace React Router
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/patients/123');

// With Next.js
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/patients/123');

// Links
import { Link } from 'react-router-dom';
<Link to="/patients">Patients</Link>

// Next.js
import Link from 'next/link';
<Link href="/patients">Patients</Link>
```

---

### 12. Implement Data Fetching Patterns
**Action:** Establish patterns for Server Components, Client Components, and hybrid approaches.

**Pattern 1: Server Component with Initial Data**
```typescript
// src/app/(dashboard)/patients/page.tsx
import { apiClient } from '@/lib/api-client';
import { PatientList } from '@/components/PatientList';

async function getPatients() {
  // Fetch on server during build/request
  const response = await fetch('http://localhost:4000/api/patients', {
    cache: 'no-store', // or { next: { revalidate: 60 } }
  });
  return response.json();
}

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div>
      <h1>Patients</h1>
      <PatientList initialData={patients} />
    </div>
  );
}
```

**Pattern 2: Client Component with TanStack Query**
```typescript
// src/components/PatientList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function PatientList({ initialData }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: () => apiClient.get('/api/patients'),
    initialData, // Hydrate from server
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  return (
    <ul>
      {data.map((patient) => (
        <li key={patient.id}>{patient.name}</li>
      ))}
    </ul>
  );
}
```

**Pattern 3: Server Actions for Mutations**
```typescript
// src/app/actions/patients.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPatient(formData: FormData) {
  const data = {
    name: formData.get('name'),
    species: formData.get('species'),
    // ... other fields
  };

  const response = await fetch('http://localhost:4000/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create patient');
  }

  revalidatePath('/patients'); // Revalidate cache
  return response.json();
}
```

---

## Phase 3: Feature Migration (Points 13-22)

### 13. Migrate Patient Management Module
**Action:** Migrate all patient-related pages and components.

**Pages to Migrate:**
- [ ] `/patients` - Patient list with search, filters, pagination
- [ ] `/patients/new` - Create new patient form
- [ ] `/patients/[id]` - Patient detail view
- [ ] `/patients/[id]/edit` - Edit patient form
- [ ] `/patients/[id]/medical-records` - Patient medical history

**Components:**
- [ ] `PatientList` - Table with search and filters
- [ ] `PatientCard` - Patient summary card
- [ ] `PatientForm` - Create/edit form
- [ ] `PatientDetail` - Detail view
- [ ] `MedicalRecordList` - Medical records table

**API Integration:**
```typescript
// src/services/patients.ts
import { apiClient } from '@/lib/api-client';
import { Patient } from '@/types';

export const patientsService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<Patient[]>('/api/patients', { params }),

  getById: (id: string) =>
    apiClient.get<Patient>(`/api/patients/${id}`),

  create: (data: Partial<Patient>) =>
    apiClient.post<Patient>('/api/patients', data),

  update: (id: string, data: Partial<Patient>) =>
    apiClient.put<Patient>(`/api/patients/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/patients/${id}`),
};
```

**Hooks:**
```typescript
// src/hooks/usePatients.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsService } from '@/services/patients';

export function usePatients(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsService.getAll(params),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
```

---

### 14. Migrate Appointment Scheduling Module
**Action:** Migrate appointment scheduling with calendar view.

**Pages:**
- [ ] `/appointments` - Calendar view with day/week/month views
- [ ] `/appointments/new` - Book new appointment
- [ ] `/appointments/[id]` - Appointment details
- [ ] `/appointments/[id]/edit` - Reschedule appointment

**Special Considerations:**
- Calendar component may need client-side library (react-big-calendar, FullCalendar)
- Real-time updates (consider WebSocket or polling)
- Time zone handling
- Recurring appointments

**Example:**
```typescript
// src/app/(dashboard)/appointments/page.tsx
'use client';

import { Calendar } from '@/components/Calendar';
import { useAppointments } from '@/hooks/useAppointments';

export default function AppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();

  if (isLoading) return <div>Loading calendar...</div>;

  return (
    <div>
      <h1>Appointments</h1>
      <Calendar appointments={appointments} />
    </div>
  );
}
```

---

### 15. Migrate Client Management Module
**Action:** Migrate client (pet owner) management functionality.

**Pages:**
- [ ] `/clients` - Client list with search
- [ ] `/clients/new` - Add new client
- [ ] `/clients/[id]` - Client details with pets list
- [ ] `/clients/[id]/edit` - Edit client

**Key Features:**
- Client-to-Patient relationships
- Contact information management
- Communication history
- Billing history

---

### 16. Migrate Medical Records Module
**Action:** Migrate medical records and prescription management.

**Pages:**
- [ ] `/medical-records` - All medical records
- [ ] `/medical-records/[id]` - Record details
- [ ] `/prescriptions` - Prescription list
- [ ] `/prescriptions/[id]` - Prescription details

**Features:**
- PDF generation for medical records
- Prescription printing
- Medical history timeline
- File attachments (images, PDFs)

**File Upload Handling:**
```typescript
// Next.js API Route for file uploads
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Upload to storage (local, S3, etc.)
  // Return URL

  return NextResponse.json({ url: '/uploads/...' });
}
```

---

### 17. Migrate Billing & Invoicing Module
**Action:** Migrate billing, invoicing, and payment processing.

**Pages:**
- [ ] `/billing` - Invoice list
- [ ] `/billing/invoices/new` - Create invoice
- [ ] `/billing/invoices/[id]` - Invoice details
- [ ] `/billing/payments` - Payment history
- [ ] `/billing/estimates` - Estimates

**Features:**
- Invoice PDF generation
- Payment processing integration
- Revenue reports
- Outstanding balances

---

### 18. Migrate Laboratory & Diagnostics Module
**Action:** Migrate lab test management.

**Pages:**
- [ ] `/lab-tests` - Lab test list
- [ ] `/lab-tests/new` - Request lab test
- [ ] `/lab-tests/[id]` - Test results

**Features:**
- Test result uploads
- Reference ranges
- Integration with external labs (if applicable)

---

### 19. Migrate Staff Management Module
**Action:** Migrate staff, roles, and scheduling.

**Pages:**
- [ ] `/staff` - Staff directory
- [ ] `/staff/[id]` - Staff profile
- [ ] `/staff/schedule` - Staff scheduling

**Features:**
- Role-based access control (RBAC)
- Staff availability
- Time tracking

---

### 20. Migrate Inventory Management Module
**Action:** Migrate inventory tracking and stock management.

**Pages:**
- [ ] `/inventory` - Inventory list
- [ ] `/inventory/[id]` - Item details
- [ ] `/inventory/orders` - Purchase orders

**Features:**
- Low stock alerts
- Automatic reordering
- Supplier management

---

### 21. Migrate Communications Module
**Action:** Migrate email/SMS communications.

**Pages:**
- [ ] `/communications` - Message history
- [ ] `/communications/new` - Send message
- [ ] `/communications/templates` - Message templates

**Features:**
- Email sending (via NestJS backend)
- SMS integration (Twilio)
- Template management
- Bulk messaging

---

### 22. Migrate Analytics & Reporting Module
**Action:** Migrate dashboards and reports.

**Pages:**
- [ ] `/dashboard` - Main analytics dashboard
- [ ] `/reports` - Report builder
- [ ] `/reports/[type]` - Specific reports

**Features:**
- Charts and graphs (use recharts, Chart.js)
- Export to PDF/Excel
- Scheduled reports
- Custom metrics

**Example Dashboard:**
```typescript
// src/app/(dashboard)/dashboard/page.tsx
import { StatsCard } from '@/components/StatsCard';
import { RevenueChart } from '@/components/RevenueChart';

async function getDashboardStats() {
  const res = await fetch('http://localhost:4000/api/analytics/dashboard', {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });
  return res.json();
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatsCard title="Total Patients" value={stats.totalPatients} />
        <StatsCard title="Appointments Today" value={stats.appointmentsToday} />
        <StatsCard title="Revenue (Month)" value={stats.monthlyRevenue} />
      </div>
      <RevenueChart data={stats.revenueData} />
    </div>
  );
}
```

---

## Phase 4: Advanced Features & Optimization (Points 23-27)

### 23. Implement Image Optimization
**Action:** Leverage Next.js Image component for optimized image loading.

**Replace:**
```typescript
<img src="/images/patient.jpg" alt="Patient" />
```

**With:**
```typescript
import Image from 'next/image';

<Image
  src="/images/patient.jpg"
  alt="Patient"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

**Configuration:**
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

**Benefits:**
- Automatic image optimization
- Lazy loading by default
- Responsive images
- AVIF/WebP format support

---

### 24. Configure Caching & Revalidation Strategy
**Action:** Implement optimal caching for performance.

**Strategies:**

**1. Static Generation (SSG):**
```typescript
// For rarely changing pages
export default async function AboutPage() {
  return <div>About Us</div>;
}
// Built at build time
```

**2. Incremental Static Regeneration (ISR):**
```typescript
// Revalidate every hour
async function getData() {
  const res = await fetch('http://localhost:4000/api/stats', {
    next: { revalidate: 3600 }, // 1 hour
  });
  return res.json();
}
```

**3. Server-Side Rendering (SSR):**
```typescript
// Always fresh data
async function getData() {
  const res = await fetch('http://localhost:4000/api/appointments', {
    cache: 'no-store',
  });
  return res.json();
}
```

**4. Client-Side Fetching:**
```typescript
// For user-specific or real-time data
'use client';
import { useQuery } from '@tanstack/react-query';
```

**Caching Recommendations:**
- Patient/Client lists: ISR (5-10 minutes)
- Appointments: No cache (real-time)
- Medical records: ISR (1 hour)
- Analytics dashboard: ISR (5 minutes)
- Static pages: SSG

---

### 25. Implement SEO & Metadata
**Action:** Configure SEO metadata for all pages.

**Root Metadata:**
```typescript
// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Purple Cross - Veterinary Practice Management',
    template: '%s | Purple Cross',
  },
  description: 'Enterprise-grade veterinary practice management platform',
  keywords: ['veterinary', 'practice management', 'pet care'],
  authors: [{ name: 'Purple Cross' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://purplecross.com',
    siteName: 'Purple Cross',
  },
};
```

**Page-Specific Metadata:**
```typescript
// src/app/(dashboard)/patients/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const patient = await getPatient(params.id);

  return {
    title: `${patient.name} - Patient Details`,
    description: `Medical records and information for ${patient.name}`,
  };
}
```

**Robots & Sitemap:**
```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://purplecross.com/sitemap.xml',
  };
}

// src/app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://purplecross.com',
      lastModified: new Date(),
    },
    {
      url: 'https://purplecross.com/login',
      lastModified: new Date(),
    },
  ];
}
```

---

### 26. Set Up Error Handling & Loading States
**Action:** Implement error boundaries and loading UI.

**Error Handling:**
```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
```

**Loading States:**
```typescript
// src/app/(dashboard)/patients/loading.tsx
export default function Loading() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
    </div>
  );
}
```

**Global Error Boundary:**
```typescript
// src/app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Critical Error</h2>
        <p>Something went wrong at the application level.</p>
        <button onClick={() => reset()}>Reset</button>
      </body>
    </html>
  );
}
```

---

### 27. Implement Logging & Monitoring
**Action:** Set up client-side and server-side monitoring.

**Client-Side Error Tracking:**
```bash
npm install @sentry/nextjs
```

**Configuration:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Performance Monitoring:**
```typescript
// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
};

// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    console.log('Server instrumentation loaded');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
  }
}
```

**Analytics:**
```typescript
// src/lib/analytics.ts
export const pageview = (url: string) => {
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// src/app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

---

## Phase 5: Testing, Deployment & Cutover (Points 28-30)

### 28. Comprehensive Testing
**Action:** Test all migrated features and ensure parity with old frontend.

**Testing Strategy:**

**Unit Tests (Vitest):**
```bash
cd frontend-nextjs
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Component Tests:**
```typescript
// src/components/__tests__/PatientCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PatientCard } from '../PatientCard';

test('renders patient information', () => {
  const patient = {
    id: '1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
  };

  render(<PatientCard patient={patient} />);

  expect(screen.getByText('Buddy')).toBeInTheDocument();
  expect(screen.getByText('Dog - Golden Retriever')).toBeInTheDocument();
});
```

**E2E Tests (Playwright):**
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// tests/e2e/patients.spec.ts
import { test, expect } from '@playwright/test';

test('can create a new patient', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Login
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to patients
  await page.goto('http://localhost:3000/patients/new');

  // Fill form
  await page.fill('[name="name"]', 'Max');
  await page.selectOption('[name="species"]', 'Dog');
  await page.fill('[name="breed"]', 'Labrador');

  // Submit
  await page.click('button[type="submit"]');

  // Verify redirect
  await expect(page).toHaveURL(/\/patients\/[0-9a-f-]+/);
});
```

**Integration Tests:**
- Test API integration with NestJS backend
- Test authentication flow
- Test data mutations (create, update, delete)
- Test form validations

**Manual Testing Checklist:**
- [ ] User authentication (login, logout, password reset)
- [ ] Patient CRUD operations
- [ ] Appointment booking and management
- [ ] Billing and invoicing
- [ ] Medical records access
- [ ] Search functionality
- [ ] Filters and sorting
- [ ] Pagination
- [ ] File uploads
- [ ] PDF generation
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

### 29. Performance Optimization & Production Build
**Action:** Optimize bundle size, performance, and prepare for production.

**Bundle Analysis:**
```bash
npm install -D @next/bundle-analyzer
```

```typescript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

Run analysis:
```bash
ANALYZE=true npm run build
```

**Optimization Checklist:**

**Code Splitting:**
- Use dynamic imports for large components
```typescript
const Calendar = dynamic(() => import('@/components/Calendar'), {
  loading: () => <p>Loading calendar...</p>,
});
```

**Tree Shaking:**
- Import only needed modules
```typescript
// Bad
import _ from 'lodash';

// Good
import debounce from 'lodash/debounce';
```

**Lazy Loading:**
- Lazy load images with Next.js Image
- Lazy load routes below the fold
- Defer non-critical scripts

**Font Optimization:**
```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Production Build:**
```bash
cd frontend-nextjs
npm run build

# Test production build locally
npm run start
```

**Performance Targets:**
- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- Total Blocking Time (TBT): < 200ms

---

### 30. Deployment & Cutover Strategy
**Action:** Deploy Next.js application and perform cutover from old frontend.

**Deployment Options:**

**Option 1: Vercel (Recommended for Next.js)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend-nextjs
vercel --prod
```

**Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.purplecross.com"
  }
}
```

**Option 2: Docker + Self-Hosted**
```dockerfile
# frontend-nextjs/Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Update docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend-nestjs
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: file:/app/data/purple-cross.db
    volumes:
      - ./data:/app/data

  frontend:
    build: ./frontend-nextjs
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

**Cutover Strategy:**

**Phase 1: Soft Launch (1-2 weeks)**
- Deploy Next.js app to staging environment
- Run parallel with old frontend
- Beta testing with internal users
- Monitor errors and performance

**Phase 2: Gradual Rollout (1 week)**
- Route 10% of traffic to Next.js (via nginx or load balancer)
- Monitor metrics (error rates, performance, user engagement)
- Increase to 25%, 50%, 75% progressively
- Keep old frontend running as fallback

**Phase 3: Full Cutover**
- Route 100% traffic to Next.js
- Keep old frontend running for 1 week as backup
- Monitor closely for issues

**Phase 4: Deprecation**
- After 1-2 weeks of stable Next.js operation
- Archive old frontend repository
- Update documentation
- Remove old frontend from production

**Rollback Plan:**
- Nginx configuration to switch traffic back to old frontend
- Keep database compatible with both frontends during transition
- Document rollback procedure

**Post-Deployment Checklist:**
- [ ] SSL certificates configured
- [ ] Environment variables set correctly
- [ ] Database connection verified
- [ ] Authentication working
- [ ] All features functional
- [ ] Error tracking active (Sentry)
- [ ] Analytics tracking active
- [ ] Performance monitoring active
- [ ] Backups configured
- [ ] CI/CD pipeline updated
- [ ] Documentation updated
- [ ] Team trained on new stack

---

## Migration Timeline

**Total Estimated Duration: 8-12 weeks**

| Phase | Points | Duration | Key Deliverables |
|-------|--------|----------|------------------|
| Phase 1: Pre-Migration | 1-5 | 1-2 weeks | Setup, NestJS ready, SQLite migrated |
| Phase 2: Core Infrastructure | 6-12 | 2-3 weeks | Auth, routing, API layer, data fetching |
| Phase 3: Feature Migration | 13-22 | 4-5 weeks | All modules migrated and tested |
| Phase 4: Advanced Features | 23-27 | 1-2 weeks | Optimization, SEO, monitoring |
| Phase 5: Testing & Deployment | 28-30 | 1-2 weeks | Testing, production deployment, cutover |

---

## Success Metrics

### Technical Metrics
- ✅ Zero TypeScript errors (`npm run typecheck` passes)
- ✅ All tests passing (unit, integration, E2E)
- ✅ Lighthouse score 90+ across all categories
- ✅ Bundle size < 500KB initial load
- ✅ API response times < 500ms (p95)
- ✅ Error rate < 0.1%

### Business Metrics
- ✅ Feature parity with old frontend (100% features migrated)
- ✅ Zero data loss during migration
- ✅ User adoption rate > 95%
- ✅ User satisfaction maintained or improved
- ✅ Page load time improved by 30%+

---

## Risk Mitigation

### High-Risk Areas
1. **Database Migration (PostgreSQL → SQLite)**
   - Mitigation: Thorough testing, data validation scripts, rollback plan

2. **Authentication/Session Management**
   - Mitigation: Comprehensive auth testing, gradual rollout

3. **File Upload Functionality**
   - Mitigation: Test with production-like file sizes, backup storage

4. **Real-time Features (Appointments)**
   - Mitigation: Load testing, WebSocket fallback

5. **Performance Regression**
   - Mitigation: Continuous performance monitoring, bundle size tracking

---

## Key Resources

### Documentation
- Next.js Docs: https://nextjs.org/docs
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs
- TanStack Query: https://tanstack.com/query/latest

### Tools
- Next.js Bundle Analyzer
- Lighthouse CI
- Playwright for E2E testing
- Sentry for error tracking
- Vercel Analytics

---

## Conclusion

This 30-point migration plan provides a comprehensive roadmap for transitioning Purple Cross from React/Vite to Next.js while adopting NestJS and SQLite. The phased approach minimizes risk while ensuring feature parity and improved performance.

**Next Steps:**
1. Review and approve this plan
2. Set up development environment (Points 1-5)
3. Begin core infrastructure migration (Points 6-12)
4. Execute feature migration in priority order
5. Rigorous testing and optimization
6. Gradual deployment and cutover

**Estimated Completion:** 8-12 weeks with dedicated team
