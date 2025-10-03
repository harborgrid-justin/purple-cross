# Development Guide

## Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for local development)
- PostgreSQL 14+ (if running without Docker)
- Redis 6+ (optional, for caching)

## Project Structure

```
purple-cross/
├── backend/                    # Backend API (Node.js + Express + Prisma)
│   ├── prisma/                # Database schema and migrations
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript types
│   └── tests/                # Test files
├── frontend/                  # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API clients
│   │   ├── utils/            # Utility functions
│   │   ├── types/            # TypeScript types
│   │   ├── assets/           # Static assets
│   │   └── styles/           # CSS files
│   └── public/               # Public assets
├── shared/                    # Shared code between frontend and backend
│   └── types/                # Shared TypeScript types
├── docs/                      # Documentation
└── .github/                   # GitHub workflows and configs

```

## Getting Started

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/harborgrid-justin/purple-cross.git
   cd purple-cross
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

   This will start:
   - PostgreSQL on port 5432
   - Redis on port 6379
   - Backend API on port 3000
   - Frontend dev server on port 5173

3. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Quality

#### Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

#### Formatting

```bash
# Backend
cd backend
npm run format
npm run format:check

# Frontend
cd frontend
npm run format
npm run format:check
```

#### Type Checking

```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
npm run typecheck
```

### Testing

#### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage
npm run test -- --coverage
```

#### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Coverage
npm run test:coverage
```

### Database Management

#### Prisma Studio (Database GUI)

```bash
cd backend
npm run prisma:studio
```

#### Create a new migration

```bash
cd backend
npm run prisma:migrate -- --name add_new_feature
```

#### Reset database

```bash
cd backend
npx prisma migrate reset
```

#### Seed database

```bash
cd backend
npm run prisma:seed
```

## API Development

### Adding a New Endpoint

1. **Define types** in `backend/src/types/`
2. **Create service** in `backend/src/services/`
3. **Create controller** in `backend/src/controllers/`
4. **Add validation schemas** in controller or middleware
5. **Create routes** in `backend/src/routes/`
6. **Register routes** in `backend/src/app.ts`
7. **Add tests** in `backend/tests/`

### Example:

```typescript
// 1. Service (backend/src/services/example.service.ts)
export class ExampleService {
  async create(data: CreateData) {
    return prisma.example.create({ data });
  }
}

// 2. Controller (backend/src/controllers/example.controller.ts)
export class ExampleController {
  async create(req: Request, res: Response) {
    const result = await exampleService.create(req.body);
    res.status(201).json({ status: 'success', data: result });
  }
}

// 3. Routes (backend/src/routes/example.routes.ts)
const router = Router();
router.post('/', validate(schema), exampleController.create);
export default router;

// 4. Register in app.ts
app.use(`${env.apiPrefix}/examples`, exampleRoutes);
```

## Frontend Development

### Adding a New Page

1. **Create page component** in `frontend/src/pages/`
2. **Add route** in `frontend/src/App.tsx`
3. **Add navigation link** in `frontend/src/components/Layout.tsx`
4. **Create styles** if needed

### State Management

We use Zustand for state management. Example:

```typescript
import create from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### API Calls

We use React Query for data fetching:

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.patients.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## Debugging

### Backend Debugging

Add this configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "cwd": "${workspaceFolder}/backend",
  "skipFiles": ["<node_internals>/**"]
}
```

### Frontend Debugging

Use React DevTools browser extension and check console logs.

## Common Issues

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5173
npx kill-port 5173
```

### Database connection issues

1. Check if PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Check if migrations are up to date

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Best Practices

1. **Always run linter before committing**
2. **Write tests for new features**
3. **Use TypeScript strictly - no `any` types**
4. **Follow existing code style**
5. **Keep components small and focused**
6. **Use meaningful variable and function names**
7. **Document complex logic**
8. **Handle errors properly**
9. **Validate all inputs**
10. **Use environment variables for configuration**

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
