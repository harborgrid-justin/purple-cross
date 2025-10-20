# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Purple Cross is an enterprise-grade veterinary practice management platform built with TypeScript, featuring 15 core modules covering everything from patient management to compliance tracking. The codebase emphasizes type safety, production-ready architecture, and Google-level engineering practices.

## Architecture

### Monorepo Structure

- **backend/** - Express API with Prisma ORM, PostgreSQL database
- **frontend/** - React 18 with Vite, TanStack Query for data fetching
- **Root package.json** - Workspace management with scripts for both modules

### Backend Architecture (backend/src/)

**Layered Architecture:**

- **routes/** - Express route definitions for all 15+ modules
- **controllers/** - Request/response handling, delegates to services
- **services/** - Business logic layer
- **middleware/** - Custom middleware stack (correlation IDs, sanitization, metrics, rate limiting, circuit breakers)
- **config/** - Environment configuration, database connection, Winston logger
- **utils/** - Circuit breaker and retry logic for resilience

**Key Patterns:**

- All requests flow through correlation ID middleware (backend/src/middleware/correlation-id.ts) - correlation IDs are tracked throughout request lifecycle for distributed tracing
- Circuit breakers (backend/src/utils/circuit-breaker.ts) prevent cascading failures
- Joi validation middleware (backend/src/middleware/validation.ts) with `validate()`, `validateQuery()`, and `validateParams()` helpers
- Structured error handling via AppError class with error codes
- Express async errors are handled via 'express-async-errors' package

### Frontend Architecture (frontend/src/)

**Structure:**

- **pages/** - Route components organized by feature (appointments/, billing/, clients/, etc.)
- **components/** - Reusable UI components
- **services/** - API client layer
- **hooks/** - Custom React hooks
- **types/** - TypeScript type definitions

**State Management:**

- TanStack Query (React Query) for server state
- Zustand for client state (if needed)
- React Router 6 for routing

### Database (backend/prisma/)

Prisma ORM with PostgreSQL:

- **schema.prisma** - Complete database schema with 15+ models (Patient, Client, Appointment, MedicalRecord, Prescription, Invoice, LabTest, Staff, etc.)
- Relationships managed via Prisma relations
- Migrations in prisma/migrations/

## Common Development Commands

### Setup & Installation

```bash
npm run setup              # Automated setup (runs bash script)
npm run install:all        # Install all dependencies (root + backend + frontend)
```

### Development

```bash
npm run dev                # Run both backend and frontend concurrently
npm run dev:backend        # Backend only (nodemon with ts-node)
npm run dev:frontend       # Frontend only (Vite dev server)

cd backend && npm run dev  # Backend dev server on port 3000
cd frontend && npm run dev # Frontend dev server on port 5173
```

### Testing

**Backend:**

```bash
cd backend
npm test                   # Run all tests with coverage (Jest + ts-jest)
npm run test:watch         # Watch mode
npm run test:e2e          # End-to-end tests (jest.e2e.config.js)
```

**Frontend:**

```bash
cd frontend
npm test                   # Run tests (Vitest)
npm run test:coverage      # With coverage report
```

**All tests:**

```bash
npm test                   # Run backend and frontend tests from root
```

### Code Quality

```bash
npm run lint               # Lint backend + frontend (ESLint)
npm run lint:fix           # Auto-fix linting issues
npm run format             # Format with Prettier
npm run format:check       # Check formatting
npm run typecheck          # TypeScript type checking for both modules
npm run typecheck:backend  # Backend only
npm run typecheck:frontend # Frontend only
```

### Database (Prisma)

```bash
cd backend
npm run prisma:studio      # Open Prisma Studio GUI
npm run prisma:migrate     # Create and apply migration (interactive)
npm run prisma:generate    # Generate Prisma Client
npm run prisma:seed        # Seed database with test data
```

Or from root:

```bash
npm run prisma:studio
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

### Build & Production

```bash
npm run build              # Build both backend and frontend
npm run build:backend      # Backend only (tsc)
npm run build:frontend     # Frontend only (Vite build)

cd backend && npm start    # Run built backend (node dist/index.js)
```

### Docker

```bash
npm run docker:up          # Start all services (PostgreSQL, Redis, backend, frontend)
npm run docker:down        # Stop all services
npm run docker:build       # Rebuild containers
```

## TypeScript Standards

### Strict Mode Enforcement

**Critical:** This project maintains 100% TypeScript compliance with strict mode enabled. See `docs/TYPESCRIPT_GUIDELINES.md` for complete guidelines.

**Key Rules:**

- **Zero `any` types** - Always use explicit types or proper generics
- **Explicit function signatures** - All parameters and return types must be typed
- **Null safety** - Use optional chaining (`?.`) and nullish coalescing (`??`)
- **No type assertions** - Prefer type guards and union types
- ESLint enforces these rules with `@typescript-eslint/no-explicit-any: error`

**When adding new code:**

1. Define interfaces/types first
2. Use strict typing throughout
3. Run `npm run typecheck` before committing
4. Lint with `npm run lint` to catch `any` usage

## Testing Patterns

### Backend Testing

**Location:** `backend/tests/`

- `unit/` - Unit tests for services, utils, middleware
- `integration/` - Integration tests with database
- `e2e/` - End-to-end API tests

**Setup:**

- Jest with ts-jest preset
- `tests/setup.ts` - Global test setup
- `tests/utils/testHelpers.ts` - Shared test utilities
- Coverage threshold: 70% (branches, functions, lines, statements)

**Running individual tests:**

```bash
cd backend
npm test -- patient.service.test.ts           # Single test file
npm test -- --testPathPattern=validation      # Pattern matching
```

### Frontend Testing

**Setup:**

- Vitest for testing
- Tests in `frontend/src/__tests__/`
- Component tests use React Testing Library patterns

## Enterprise Features

### Observability

- **Correlation IDs:** Every request gets a unique ID (X-Correlation-ID header) for distributed tracing
- **Structured Logging:** Winston logger with JSON output, includes correlation IDs
- **Health Endpoints:** `/health`, `/health/live`, `/health/ready`, `/health/detailed`
- **Metrics:** `/metrics` endpoint for monitoring

### Resilience

- **Circuit Breakers:** Prevent cascading failures (backend/src/utils/circuit-breaker.ts)
- **Retry Logic:** Exponential backoff with jitter (backend/src/utils/retry.ts)
- **Timeouts:** 30-second request timeout middleware
- **Rate Limiting:** Per-IP throttling (backend/src/middleware/rate-limiter.ts)

### Security

- **Input Sanitization:** XSS and injection prevention (backend/src/middleware/sanitization.ts)
- **Helmet.js:** Security headers
- **CORS:** Configured via CORS_ORIGIN env var
- **JWT Authentication:** Token-based auth (7-day expiry default)

## Environment Configuration

### Backend (.env)

Copy `backend/.env.example` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - Change in production!
- `CORS_ORIGIN` - Frontend URL
- Email/SMS provider credentials (SendGrid, Twilio)

### Frontend (.env)

Copy `frontend/.env.example` for frontend-specific config.

## Common Workflows

### Adding a New API Endpoint

1. **Define route** in `backend/src/routes/[module].routes.ts`
2. **Create controller** method in `backend/src/controllers/[module].controller.ts`
3. **Implement service** logic in `backend/src/services/[module].service.ts`
4. **Add validation** schema using Joi in the route
5. **Update Prisma schema** if needed, then run `npm run prisma:migrate`
6. **Write tests** in `backend/tests/unit/` or `backend/tests/integration/`
7. **Type check:** `npm run typecheck:backend`

### Adding a New Frontend Page

1. **Create page component** in `frontend/src/pages/[module]/[PageName].tsx`
2. **Add route** in `frontend/src/App.tsx`
3. **Create API service** function in `frontend/src/services/`
4. **Use TanStack Query** for data fetching (see existing patterns)
5. **Type check:** `npm run typecheck:frontend`

### Database Changes

1. **Modify** `backend/prisma/schema.prisma`
2. **Create migration:** `cd backend && npm run prisma:migrate -- --name descriptive_name`
3. **Generate client:** `npm run prisma:generate` (or restart dev server)
4. **Update services/controllers** to use new schema
5. **Update seed data** if needed in `prisma/seeds/index.ts`

## Module Structure

The application has 15+ enterprise modules, each following the same pattern:

**Core Modules:**

- Patient Management (patients)
- Client Management (clients)
- Appointments (appointments)
- Medical Records (medical-records)
- Prescriptions (prescriptions)
- Inventory (inventory)
- Billing/Invoices (invoices)
- Laboratory (lab-tests)
- Staff Management (staff)
- Communications (communications)
- Documents (documents)
- Analytics (analytics)

**Extended Modules:**

- Breed Information, Patient Relationships, Patient Reminders
- Client Portal, Loyalty Programs, Feedback
- Waitlist, Time Blocks, Estimates
- Payment Plans, Purchase Orders, Equipment
- Insurance Claims, Refunds, Marketing Campaigns
- Policies, Report Templates, Document Templates

Each module has:

- Route file (routes/[module].routes.ts)
- Controller (controllers/[module].controller.ts)
- Service (services/[module].service.ts)
- Prisma model (schema.prisma)

## Production Deployment

The application is Docker-ready:

- `docker-compose.yml` orchestrates PostgreSQL, Redis, backend, and frontend
- Backend runs on port 3000
- Frontend runs on port 5173 (dev) or served via Nginx (production)
- Database runs on port 5432
- Redis runs on port 6379

For production deployment, ensure:

- Environment variables are properly set
- `NODE_ENV=production`
- Database migrations are applied (`prisma:migrate:deploy`)
- Build artifacts are generated (`npm run build`)

## Constants Centralization

**All hardcoded values, URLs, and static elements are centralized:**

### Backend Constants

- **Location**: `backend/src/constants/index.ts` (430+ lines, 200+ constants)
- **Import**: `import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS } from '../constants';`

**Categories**:

- HTTP Status Codes (`HTTP_STATUS.OK`, `HTTP_STATUS.NOT_FOUND`, etc.)
- Error Messages (`ERROR_MESSAGES.NOT_FOUND('Entity')`, `ERROR_MESSAGES.ALREADY_EXISTS('Entity')`)
- Pagination (`PAGINATION.DEFAULT_PAGE`, `PAGINATION.DEFAULT_LIMIT`)
- Query Modes (`QUERY_MODE.INSENSITIVE`)
- Sort Orders (`SORT_ORDER.DESC`, `SORT_ORDER.ASC`)
- Field Names (`FIELDS.CREATED_AT`, `FIELDS.START_TIME`, `FIELDS.VISIT_DATE`)
- Query Limits (`QUERY_LIMITS.RECENT_ITEMS`, `QUERY_LIMITS.APPOINTMENTS`)
- Entity Statuses (`STATUS.ACTIVE`, `STATUS.PENDING`, `STATUS.CANCELLED`)
- Time Constants (`TIME.DEFAULT_REQUEST_TIMEOUT`, `TIME.AUTH_RATE_LIMIT_WINDOW`)

**Usage Examples**:

```typescript
// Services
if (!patient) {
  throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
}

const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;

orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }
mode: QUERY_MODE.INSENSITIVE

// Controllers
res.status(HTTP_STATUS.CREATED).json({ status: 'success', data });
res.status(HTTP_STATUS.OK).json({ status: 'success', data });
res.status(HTTP_STATUS.NO_CONTENT).send();
```

### Frontend Constants

- **Location**: `frontend/src/constants/index.ts` (660+ lines, 150+ constants)
- **Import**: `import { API_CONFIG, API_ENDPOINTS, ROUTES, STORAGE_KEYS, HTTP_STATUS } from '../constants';`

**Categories**:

- API Configuration (`API_CONFIG.BASE_URL`, `API_CONFIG.TIMEOUT`)
- API Endpoints (`API_ENDPOINTS.PATIENTS`, `API_ENDPOINTS.PATIENT_BY_ID(id)`)
- Routes (`ROUTES.LOGIN`, `ROUTES.DASHBOARD`, `ROUTES.PATIENTS`)
- Storage Keys (`STORAGE_KEYS.TOKEN`, `STORAGE_KEYS.USER`)
- Query Keys for React Query (`QUERY_KEYS.PATIENTS`, `QUERY_KEYS.APPOINTMENTS`)
- All HTTP Status Codes and Entity Statuses (same as backend)

**Usage Examples**:

```typescript
// API Client
this.client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Endpoints
this.get(API_ENDPOINTS.PATIENTS, params);
this.get(API_ENDPOINTS.PATIENT_BY_ID(id));

// Storage
localStorage.getItem(STORAGE_KEYS.TOKEN);

// Navigation
window.location.href = ROUTES.LOGIN;
```

### Helper Utilities

**Location**: `backend/src/utils/refactor-helper.ts`

```typescript
// ServiceHelper
ServiceHelper.notFound('Patient'); // Throws 404
ServiceHelper.alreadyExists('Client'); // Throws 400
ServiceHelper.getPagination(options); // Returns defaults
ServiceHelper.buildPaginationResponse(page, limit, total, data);

// ControllerHelper
ControllerHelper.success(res, data); // 200 response
ControllerHelper.created(res, data); // 201 response
ControllerHelper.noContent(res); // 204 response
```

### Documentation

- **README_CONSTANTS.md** - Quick start guide
- **CONSTANTS_QUICK_REFERENCE.md** - Quick lookup and patterns
- **docs/CONSTANTS.md** - Complete reference
- **FULL_CONSTANTS_MIGRATION_GUIDE.md** - Detailed migration guide

## Key Files to Reference

- **docs/TYPESCRIPT_GUIDELINES.md** - Complete TypeScript standards (31KB+ documentation)
- **docs/CONSTANTS.md** - Constants architecture and usage
- **ARCHITECTURE.md** - System architecture details
- **ENTERPRISE_CAPABILITIES.md** - Production features and patterns
- **backend/src/app.ts** - Express app setup and middleware stack
- **backend/src/constants/index.ts** - All backend constants
- **frontend/src/constants/index.ts** - All frontend constants
- **backend/prisma/schema.prisma** - Complete database schema
- **frontend/src/main.tsx** - React app entry point
