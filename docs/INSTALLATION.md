# Purple Cross - Installation Guide

## 🎯 Objective

This guide will get Purple Cross running on your machine in **5 minutes or less**.

## 📋 Quick Reference

| What                | Where                                                            |
| ------------------- | ---------------------------------------------------------------- |
| **Quick Start**     | [QUICK_START.md](./QUICK_START.md) - 5-minute guide              |
| **Complete Setup**  | [docs/SETUP.md](./docs/SETUP.md) - Detailed instructions         |
| **Development**     | [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Dev workflow      |
| **Troubleshooting** | [docs/SETUP.md#troubleshooting](./docs/SETUP.md#troubleshooting) |

## ⚡ Super Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- Git

### Installation

```bash
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross
npm run setup
```

**That's it!** Access at http://localhost:5173

## 📖 What Does `npm run setup` Do?

The automated setup script:

1. ✅ Verifies Docker and Docker Compose are installed
2. ✅ Checks Node.js version (optional warning if missing)
3. ✅ Creates backend/.env and frontend/.env from examples
4. ✅ Starts Docker containers (PostgreSQL, Redis, Backend, Frontend)
5. ✅ Waits for PostgreSQL to be ready (robust retry logic)
6. ✅ Waits for Redis to be ready (robust retry logic)
7. ✅ Installs backend dependencies (npm install)
8. ✅ Installs frontend dependencies (npm install)
9. ✅ Generates Prisma Client
10. ✅ Runs database migrations
11. ✅ Verifies backend health endpoint
12. ✅ Verifies frontend is accessible
13. ✅ Displays success message with all access points

**Typical duration:** 3-5 minutes (depending on internet speed)

## 🐳 What's Running After Setup?

| Service                         | Port | URL                   |
| ------------------------------- | ---- | --------------------- |
| Frontend (React + Vite)         | 5173 | http://localhost:5173 |
| Backend API (Node.js + Express) | 3000 | http://localhost:3000 |
| PostgreSQL Database             | 5432 | localhost:5432        |
| Redis Cache                     | 6379 | localhost:6379        |

### Access Points

- **Frontend App**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Prisma Studio** (Database GUI): Run `npm run prisma:studio`

## 🔧 Alternative Installation Methods

### Method 1: Using Make

```bash
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross
make setup
```

### Method 2: Direct Script

```bash
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross
bash scripts/setup.sh
```

### Method 3: Manual Setup

For complete manual setup instructions, see [docs/SETUP.md](./docs/SETUP.md#method-1-manual-docker-setup)

### Method 4: Local Development (No Docker)

For local development without Docker, see [docs/SETUP.md](./docs/SETUP.md#method-2-local-development-without-docker)

## ✅ Verify Installation

### 1. Check Containers

```bash
docker ps
```

Should show 4 running containers:

- purple-cross-postgres
- purple-cross-redis
- purple-cross-backend
- purple-cross-frontend

### 2. Check Backend

```bash
curl http://localhost:3000/health
```

Should return JSON with status information

### 3. Check Frontend

Open http://localhost:5173 in your browser

### 4. Check Database

```bash
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555

## 🛠️ Post-Installation

### View All Available Commands

```bash
make help
```

### Start Development

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### View Logs

```bash
docker compose logs -f         # All services
docker compose logs -f backend # Backend only
```

### Stop Services

```bash
docker compose down
```

### Restart Services

```bash
docker compose restart
```

## ❌ Common Installation Issues

### Issue 1: Port Already in Use

**Symptoms:** Error message about port 3000, 5173, or 5432 already in use

**Solution:**

```bash
docker compose down
npx kill-port 3000 5173 5432
npm run setup
```

### Issue 2: Docker Not Running

**Symptoms:** "Cannot connect to Docker daemon"

**Solution:**

1. Start Docker Desktop
2. Wait for it to fully start (green icon)
3. Run `npm run setup` again

### Issue 3: PostgreSQL Connection Failed

**Symptoms:** Setup fails during database migration step

**Solution:**

```bash
docker compose restart postgres
# Wait 10 seconds
npm run setup
```

### Issue 4: Dependencies Installation Failed

**Symptoms:** npm install errors

**Solution:**

```bash
docker compose down -v
rm -rf node_modules backend/node_modules frontend/node_modules
npm run setup
```

### More Issues?

See the complete [Troubleshooting Guide](./docs/SETUP.md#troubleshooting) with 10+ solutions

## 📚 Additional Documentation

- **[Quick Start Guide](./QUICK_START.md)** - 5-minute quick reference
- **[Complete Setup Guide](./docs/SETUP.md)** - Detailed setup with troubleshooting
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow and best practices
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute
- **[API Documentation](./docs/API.md)** - API endpoints reference
- **[Architecture](./ARCHITECTURE.md)** - System architecture overview

## 🆘 Getting Help

1. **Check Documentation**: See links above
2. **Search Issues**: [GitHub Issues](https://github.com/harborgrid-justin/purple-cross/issues)
3. **Ask Question**: Open a new issue with:
   - Your OS and versions (Node.js, Docker)
   - Complete error message
   - Steps you tried
4. **Email Support**: support@purplecross.vet

## 🧹 Clean Up / Uninstall

### Stop Services (Keep Data)

```bash
docker compose down
```

### Remove Everything (Including Data)

```bash
docker compose down -v
rm -rf node_modules backend/node_modules frontend/node_modules
rm -rf backend/dist frontend/dist
```

## 🎓 Next Steps After Installation

1. ✅ Explore the running application at http://localhost:5173
2. ✅ Review the [Project Structure](./QUICK_START.md#project-structure)
3. ✅ Read the [Development Guide](./docs/DEVELOPMENT.md)
4. ✅ Check out the [API Documentation](./docs/API.md)
5. ✅ Make your first code change and see hot reload!
6. ✅ Run the test suite: `npm test`
7. ✅ Review [Contributing Guidelines](./docs/CONTRIBUTING.md) if you want to contribute

## 🌟 Summary

Purple Cross provides a **fully automated, one-command setup** that:

- ✅ Works on Windows, Mac, and Linux
- ✅ Supports Docker Compose V1 and V2
- ✅ Handles all dependencies automatically
- ✅ Includes robust error handling
- ✅ Verifies successful installation
- ✅ Provides clear feedback throughout

**Installation Time**: 3-5 minutes
**Commands Required**: 2 (clone + setup)
**Manual Configuration**: 0

---

**Ready to code?** Run `npm run setup` and start building! 🚀
