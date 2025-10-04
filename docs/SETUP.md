# 🚀 Purple Cross - Complete Setup Guide

This guide provides step-by-step instructions for setting up the Purple Cross veterinary practice management platform for development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Recommended)](#quick-start-recommended)
- [Alternative Setup Methods](#alternative-setup-methods)
- [Verification](#verification)
- [Next Steps](#next-steps)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

- **Node.js 18+** and **npm 9+**
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node -v` and `npm -v`

- **Docker Desktop** (includes Docker Compose)
  - Download from [docker.com](https://docs.docker.com/get-docker/)
  - Verify: `docker -v` and `docker compose version` (or `docker-compose -v`)

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

**Note**: The setup script supports both Docker Compose V1 (`docker-compose`) and V2 (`docker compose`) commands.

### Optional (for local development without Docker)

- **PostgreSQL 14+**
  - Download from [postgresql.org](https://www.postgresql.org/download/)
  
- **Redis 6+**
  - Download from [redis.io](https://redis.io/download)

---

## Quick Start (Recommended)

This is the fastest and most reliable way to get started with Purple Cross development.

### 1. Clone the Repository

```bash
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross
```

### 2. Run the Setup Script

Choose one of the following methods:

#### Option A: Using npm (Recommended)

```bash
npm run setup
```

#### Option B: Using Make

```bash
make setup
```

#### Option C: Direct Script Execution

```bash
bash scripts/setup.sh
```

### 3. Wait for Setup to Complete

The setup script will:
- ✅ Verify Docker and Docker Compose are installed
- ✅ Create environment files (.env) for backend and frontend
- ✅ Start Docker containers (PostgreSQL, Redis, Backend, Frontend)
- ✅ Wait for services to be healthy
- ✅ Install all dependencies
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Verify all services are running

**This process typically takes 3-5 minutes.**

### 4. Access the Application

Once setup is complete, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Prisma Studio**: Run `npm run prisma:studio` in a new terminal

---

## Alternative Setup Methods

### Method 1: Manual Docker Setup

If you prefer to run commands manually:

```bash
# 1. Clone repository
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross

# 2. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start Docker containers
docker-compose up -d

# 4. Wait for PostgreSQL to be ready (about 10 seconds)
sleep 10

# 5. Install dependencies and setup database
docker-compose exec backend npm install
docker-compose exec frontend npm install
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma migrate deploy
```

### Method 2: Local Development (Without Docker)

For development without Docker (requires local PostgreSQL and Redis):

```bash
# 1. Clone repository
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Edit backend/.env with your local database credentials
# DATABASE_URL="postgresql://postgres:password@localhost:5432/purple_cross?schema=public"
# REDIS_URL="redis://localhost:6379"

# 5. Setup database
cd backend
npx prisma generate
npx prisma migrate deploy
cd ..

# 6. Start development servers
npm run dev
```

Or use Make:

```bash
make setup-local
# Then manually start PostgreSQL and Redis
# Then: cd backend && npx prisma migrate deploy && npx prisma generate
make dev
```

---

## Verification

### Verify Setup was Successful

1. **Check Docker Containers**

   ```bash
   docker-compose ps
   ```

   All containers should show "Up" status:
   - purple-cross-postgres
   - purple-cross-redis
   - purple-cross-backend
   - purple-cross-frontend

2. **Check Backend Health**

   ```bash
   curl http://localhost:3000/health
   ```

   Should return a JSON response with status information.

3. **Check Frontend**

   Open http://localhost:5173 in your browser. You should see the Purple Cross application.

4. **Check Database Connection**

   ```bash
   docker-compose exec backend npx prisma studio
   ```

   Prisma Studio should open in your browser at http://localhost:5555

### View Logs

If you encounter issues, check the logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

---

## Next Steps

### Start Development

```bash
# View all available commands
make help

# Start development servers (if not already running)
npm run dev
# or
make dev
```

### Run Tests

```bash
# All tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

### Access Prisma Studio (Database GUI)

```bash
npm run prisma:studio
# or
make prisma-studio
```

### Explore the Codebase

- **Backend API**: `backend/src/`
- **Frontend React App**: `frontend/src/`
- **Database Schema**: `backend/prisma/schema.prisma`
- **Documentation**: `docs/`

### Read Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed development workflow
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [API Documentation](./API.md) - API endpoints and usage
- [Architecture](../ARCHITECTURE.md) - System architecture overview

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Docker is not installed"

**Solution**: Install Docker Desktop from [docker.com](https://docs.docker.com/get-docker/)

#### 2. "Port already in use" (3000, 5173, or 5432)

**Cause**: Another application is using the required port.

**Solution**:

```bash
# Find and kill process on port 3000 (backend)
npx kill-port 3000

# Find and kill process on port 5173 (frontend)
npx kill-port 5173

# Find and kill process on port 5432 (PostgreSQL)
npx kill-port 5432

# Or stop all Docker containers
docker-compose down
```

#### 3. "PostgreSQL connection failed"

**Solution**:

```bash
# Check if PostgreSQL container is running
docker-compose ps postgres

# If not running, start it
docker-compose up -d postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL container
docker-compose restart postgres
```

#### 4. "Prisma Client not generated"

**Solution**:

```bash
# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Or locally
cd backend && npx prisma generate
```

#### 5. "Database migrations failed"

**Solution**:

```bash
# Reset database and rerun migrations
docker-compose exec backend npx prisma migrate reset

# Or deploy migrations
docker-compose exec backend npx prisma migrate deploy
```

#### 6. "Dependencies installation failed"

**Solution**:

```bash
# Clean and reinstall
docker-compose down
rm -rf node_modules backend/node_modules frontend/node_modules
docker-compose up -d
docker-compose exec backend npm install
docker-compose exec frontend npm install
```

#### 7. "Frontend not loading"

**Solution**:

```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Rebuild frontend container
docker-compose build frontend
docker-compose up -d frontend
```

#### 8. "Backend API not responding"

**Solution**:

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check if database is accessible
docker-compose exec backend npx prisma db pull
```

#### 9. Docker container won't start

**Solution**:

```bash
# Clean up everything and start fresh
docker-compose down -v
docker system prune -a --volumes
docker-compose up -d
bash scripts/setup.sh
```

#### 10. Permission denied errors (Linux/Mac)

**Solution**:

```bash
# Make scripts executable
chmod +x scripts/*.sh

# If Docker permission issues
sudo usermod -aG docker $USER
# Then logout and login again
```

### Getting Help

If you're still experiencing issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/harborgrid-justin/purple-cross/issues)
2. **Create a new issue**: Include:
   - Operating system and version
   - Node.js version (`node -v`)
   - Docker version (`docker -v`)
   - Error messages and logs
   - Steps to reproduce
3. **Contact support**: support@purplecross.vet

---

## Clean Up

### Stop Services

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove volumes (removes all data)
docker-compose down -v
```

### Clean Everything

```bash
# Using Make
make clean

# Or manually
rm -rf node_modules backend/node_modules frontend/node_modules
rm -rf backend/dist frontend/dist
docker-compose down -v
```

---

## Environment Variables

### Backend (.env)

Key variables in `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/purple_cross?schema=public"

# Redis
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

Key variables in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Purple Cross
VITE_APP_VERSION=1.0.0
```

**Note**: For Docker setup, the default values in `.env.example` files work out of the box. Only modify if you're running services locally or need custom configuration.

---

## What's Installed?

After running the setup, you'll have:

### Services Running

- **PostgreSQL 15** - Database server (port 5432)
- **Redis 7** - Cache and session store (port 6379)
- **Backend API** - Node.js/Express server (port 3000)
- **Frontend** - React/Vite dev server (port 5173)

### Dependencies Installed

- **Backend**: Express, Prisma, JWT auth, validation, logging
- **Frontend**: React 18, TypeScript, Vite, React Query, Zustand
- **Database**: Full schema with 60+ tables for enterprise features

### Ready to Use

- ✅ Database migrations applied
- ✅ Prisma Client generated
- ✅ Development servers running
- ✅ Hot reload enabled
- ✅ Environment configured
- ✅ All dependencies installed

---

**Congratulations! 🎉** You're now ready to start developing with Purple Cross!

For the next steps, check out the [Development Guide](./DEVELOPMENT.md).
