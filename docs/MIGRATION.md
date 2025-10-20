# Migration Guide

This document explains the changes in the new project structure and how to migrate from the old structure.

## What Changed?

The project has been reorganized from a flat structure to a proper monorepo with separate backend and frontend directories following Google engineering best practices.

### Old Structure

```
purple-cross/
├── src/
│   ├── models/           # TypeScript models
│   ├── frontend/         # React components
│   └── index.ts          # Main entry
├── tsconfig.json
└── package.json
```

### New Structure

```
purple-cross/
├── backend/              # Complete backend API
│   ├── prisma/          # Database schema and migrations
│   ├── src/             # Backend source code
│   └── tests/           # Backend tests
├── frontend/            # Complete frontend app
│   ├── src/             # Frontend source code
│   └── public/          # Static assets
├── shared/              # Shared types
├── docs/                # Documentation
└── .github/             # CI/CD workflows
```

## Key Changes

### 1. TypeScript Models → Prisma Schema

**Old:** TypeScript interfaces in `src/models/`

```typescript
// src/models/PatientManagement.ts
export interface Patient {
  id: string;
  name: string;
  species: string;
}
```

**New:** Prisma schema in `backend/prisma/schema.prisma`

```prisma
model Patient {
  id        String   @id @default(uuid())
  name      String
  species   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("patients")
}
```

The TypeScript models are still available in `src/models/` for reference, but the source of truth is now the Prisma schema.

### 2. Frontend Structure

**Old:** Legacy components (removed)

- Basic React components in `src/frontend/` (deprecated and removed)
- No proper routing
- Direct file compilation with TSC

**New:** Complete app in `frontend/`

- Vite build tool for fast development
- React Router for navigation
- Custom hooks for data fetching
- Proper component organization
- Production-ready build process

### 3. Backend API

**Old:** No backend implementation, only type definitions

**New:** Complete Express.js API in `backend/`

- RESTful endpoints
- Authentication & authorization
- Request validation
- Error handling
- Database integration with Prisma
- Comprehensive testing

### 4. Development Workflow

**Old:**

```bash
npm install
npm run build
npm run build:frontend
```

**New:**

```bash
# Using Docker (recommended)
docker-compose up

# Or locally
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Migration Steps

### For Developers

1. **Install dependencies**

   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Set up environment**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run database migrations**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. **Start development servers**

   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

### Using Your Old TypeScript Models

The old TypeScript models in `src/models/` are preserved for reference. However:

1. **Backend Development:** Use Prisma schema and generated Prisma Client
2. **Frontend Development:** Import types from `@/types` or use API response types
3. **Shared Types:** Use types from `shared/types/` for consistency

### API Integration

Old components that used mock data should now connect to the real API:

```typescript
// Old (mock data)
const patients = [
  { id: 1, name: 'Max', species: 'Dog' }
];

// New (real API)
import { usePatients } from '@/hooks/usePatients';

function PatientList() {
  const { data, isLoading } = usePatients();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
```

## Breaking Changes

### 1. Import Paths

**Old:**

```typescript
import { Patient } from '../src/models/PatientManagement';
```

**New:**

```typescript
// Backend
import { Patient } from '@prisma/client';

// Frontend
import { Patient } from '@/types';
```

### 2. Database Access

**Old:** Direct TypeScript types (no database)

**New:** Prisma Client

```typescript
import { prisma } from './config/database';

const patients = await prisma.patient.findMany();
```

### 3. Build Process

**Old:**

```bash
npm run build        # TSC compilation
npm run build:frontend
```

**New:**

```bash
cd backend && npm run build    # Backend build
cd frontend && npm run build   # Frontend build
```

## Preserved Files

These files from the old structure are preserved but may be deprecated:

- `src/models/*` - TypeScript model definitions (reference only, consider migrating to `shared/types`)
- `src/index.ts` - Old main entry point (deprecated)
- `example.ts` - Example usage file (reference only)

**Note:** The old `src/frontend/*` directory has been removed. Use `frontend/src/` for all frontend code.

## New Features

1. **Database Integration** - PostgreSQL with Prisma ORM
2. **API Endpoints** - Complete RESTful API
3. **Authentication** - JWT-based auth
4. **Docker Support** - Containerized development
5. **CI/CD** - GitHub Actions workflows
6. **Testing** - Jest for backend, Vitest for frontend
7. **Type Safety** - End-to-end TypeScript
8. **Documentation** - Comprehensive guides

## Support

If you encounter issues during migration:

1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
3. Open an issue on GitHub
4. Check the old structure in git history if needed

## Rollback

If you need to use the old structure temporarily:

```bash
git checkout <commit-before-restructure>
```

However, we recommend migrating to the new structure for better maintainability and scalability.
