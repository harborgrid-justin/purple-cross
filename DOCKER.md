# Docker Deployment Guide - Purple Cross

> Enterprise-grade veterinary practice management platform - Dockerized for scalable deployment

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
- [Container Management](#container-management)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)
- [Performance Tuning](#performance-tuning)
- [Security Best Practices](#security-best-practices)

## Overview

Purple Cross is containerized using Docker with multi-stage builds, health checks, resource limits, and enterprise-grade security features. The application consists of:

- **Backend API**: Node.js/Express with TypeScript
- **Frontend**: React 18 with Vite, served via Nginx
- **PostgreSQL**: Database with automated backups
- **Redis**: Caching and session management
- **Nginx**: Reverse proxy with SSL termination (production)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                      │
│              (SSL Termination, Load Balancing)              │
└─────────────────────┬────────────────────┬──────────────────┘
                      │                    │
        ┌─────────────▼──────────┐  ┌─────▼────────────┐
        │   Frontend (Nginx)     │  │  Backend API     │
        │   React + Vite         │  │  Node.js/Express │
        └────────────────────────┘  └──────┬───────────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                   ┌────▼─────┐      ┌────▼─────┐     ┌─────▼────┐
                   │ PostgreSQL│      │  Redis   │     │  Backup  │
                   │ Database  │      │  Cache   │     │  Service │
                   └───────────┘      └──────────┘     └──────────┘
```

## Prerequisites

### System Requirements

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended for production)
- **CPU**: 2+ cores recommended
- **Disk**: 20GB+ free space

### Installation

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Quick Start

### Development (Local)

```bash
# Clone the repository
git clone <repository-url>
cd purple-cross

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### Production

```bash
# Copy and configure environment
cp .env.production.example .env.production
nano .env.production  # Update with your values

# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Development Deployment

### Configuration

Development mode uses `docker-compose.yml` with:
- Hot reload for both backend and frontend
- Source code mounted as volumes
- Debug ports exposed
- Verbose logging

### Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Rebuild containers
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend

# Execute commands in containers
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm test
docker-compose exec postgres psql -U postgres -d purple_cross

# Scale backend replicas
docker-compose up -d --scale backend=3
```

### Hot Reload

Both frontend and backend support hot reload in development:

- **Backend**: Uses nodemon to watch for changes in `src/`
- **Frontend**: Uses Vite HMR for instant updates

Changes to the following files will trigger reload:
- `backend/src/**/*.ts`
- `frontend/src/**/*.tsx`
- `backend/prisma/schema.prisma` (requires manual migration)

## Production Deployment

### Prerequisites

1. **Environment Configuration**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with production values
   ```

2. **SSL Certificates** (recommended)
   ```bash
   mkdir -p nginx/ssl
   # Copy your SSL certificates
   cp /path/to/cert.pem nginx/ssl/
   cp /path/to/key.pem nginx/ssl/
   ```

3. **Database Backup Directory**
   ```bash
   mkdir -p backups
   chmod 700 backups
   ```

### Deployment Steps

#### Option 1: Docker Compose (Single Server)

```bash
# 1. Build images
docker-compose -f docker-compose.prod.yml build

# 2. Start services
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify health
docker-compose -f docker-compose.prod.yml ps

# 4. Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Option 2: Docker Swarm (Multi-Server)

```bash
# 1. Initialize swarm
docker swarm init

# 2. Deploy stack
docker stack deploy -c docker-compose.prod.yml purple-cross

# 3. Check services
docker service ls

# 4. Scale services
docker service scale purple-cross_backend=4
```

### Health Checks

All services include health checks:

```bash
# Check all service health
docker-compose -f docker-compose.prod.yml ps

# Manual health check
curl http://localhost/health        # Frontend
curl http://localhost:3000/health   # Backend (internal)
```

### Updates & Rollbacks

```bash
# Pull latest changes
git pull origin main

# Rebuild with new version
VERSION=1.0.1 docker-compose -f docker-compose.prod.yml build

# Rolling update (zero downtime)
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend

# Rollback to previous version
docker-compose -f docker-compose.prod.yml up -d --no-deps backend:1.0.0
```

## Container Management

### Resource Limits

Production configuration includes resource limits:

| Service    | CPU Limit | Memory Limit | CPU Reserve | Memory Reserve |
|------------|-----------|--------------|-------------|----------------|
| PostgreSQL | 4 cores   | 4GB          | 2 cores     | 2GB            |
| Redis      | 2 cores   | 1.5GB        | 0.5 cores   | 1GB            |
| Backend    | 2 cores   | 2GB          | 1 core      | 1GB            |
| Frontend   | 1 core    | 512MB        | 0.25 cores  | 256MB          |

### Monitoring

```bash
# Real-time resource usage
docker stats

# Container details
docker inspect purple-cross-backend

# Service logs
docker-compose -f docker-compose.prod.yml logs --tail=100 backend

# Follow logs from all services
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d purple_cross

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database (development only)
docker-compose exec backend npm run prisma:seed

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

### Redis Management

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# With password (production)
docker-compose -f docker-compose.prod.yml exec redis redis-cli -a YOUR_PASSWORD

# Monitor Redis
docker-compose exec redis redis-cli monitor

# Get info
docker-compose exec redis redis-cli info
```

## Monitoring & Logging

### Log Management

```bash
# View logs with timestamps
docker-compose logs -t -f

# Export logs to file
docker-compose logs > app-logs.txt

# Filter logs by service and time
docker-compose logs --since 1h backend > backend-last-hour.log
```

### Log Rotation

Logs are automatically rotated using Docker's JSON file driver:
- **Max Size**: 10-50MB per file
- **Max Files**: 3-10 files retained
- **Location**: `/var/lib/docker/containers/`

### Health Monitoring

```bash
# Check health status
docker-compose ps

# Continuous health monitoring
watch -n 5 'docker-compose ps'

# Get detailed health info
docker inspect --format='{{json .State.Health}}' purple-cross-backend | jq
```

## Backup & Recovery

### Automated Backups

Production deployment includes automated backup service:
- **Daily backups** at midnight
- **Retention**: 7 days, 4 weeks, 6 months
- **Location**: `./backups/`

```bash
# List backups
ls -lh backups/

# Manually trigger backup
docker-compose -f docker-compose.prod.yml exec backup backup
```

### Manual Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres purple_cross > backup-$(date +%Y%m%d).sql

# Backup with compression
docker-compose exec postgres pg_dump -U postgres purple_cross | gzip > backup-$(date +%Y%m%d).sql.gz

# Backup all volumes
docker run --rm \
  -v purple-cross-postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-data-$(date +%Y%m%d).tar.gz /data
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore database
cat backup-20250124.sql | docker-compose exec -T postgres psql -U postgres -d purple_cross

# Or with compressed backup
gunzip -c backup-20250124.sql.gz | docker-compose exec -T postgres psql -U postgres -d purple_cross

# Restart services
docker-compose up -d
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Recreate container
docker-compose up -d --force-recreate backend
```

#### 2. Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec backend node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected')).catch(e => console.error(e))"
```

#### 3. Out of Memory

```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.prod.yml
# Or reduce number of backend replicas
```

#### 4. Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port
```

#### 5. Permission Denied

```bash
# Fix volume permissions
sudo chown -R $(id -u):$(id -g) ./backend ./frontend

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

### Debug Mode

```bash
# Start with debug logging
LOG_LEVEL=debug docker-compose up

# Enable Node.js inspector (backend)
docker-compose exec backend node --inspect=0.0.0.0:9229 dist/index.js

# Access debugger
# Chrome: chrome://inspect
```

## Performance Tuning

### PostgreSQL Optimization

```bash
# Edit docker-compose.prod.yml
environment:
  POSTGRES_SHARED_BUFFERS: 512MB      # 25% of RAM
  POSTGRES_EFFECTIVE_CACHE_SIZE: 2GB  # 50-75% of RAM
  POSTGRES_WORK_MEM: 32MB             # RAM / max_connections
  POSTGRES_MAINTENANCE_WORK_MEM: 256MB
```

### Redis Optimization

```bash
# Increase maxmemory
command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
```

### Backend Scaling

```bash
# Scale backend replicas
docker-compose -f docker-compose.prod.yml up -d --scale backend=4

# Or edit BACKEND_REPLICAS in .env.production
BACKEND_REPLICAS=4
```

### Nginx Caching

```bash
# Enable caching in nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;
```

## Security Best Practices

### 1. Environment Variables

- ✅ **DO**: Use `.env.production` for sensitive values
- ❌ **DON'T**: Commit secrets to version control
- ✅ **DO**: Use strong random passwords (min 32 characters)
- ✅ **DO**: Rotate credentials regularly

### 2. Network Security

```bash
# Expose only necessary ports
# Backend and database should NOT be exposed to host in production
expose:
  - "3000"  # Internal only
```

### 3. User Permissions

All containers run as non-root users:
- Backend: `nodejs` (UID 1001)
- Frontend: `nginx`
- PostgreSQL: `postgres`

### 4. SSL/TLS

```bash
# Always use HTTPS in production
# Uncomment HSTS in nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 5. Regular Updates

```bash
# Update base images
docker-compose pull
docker-compose up -d --build

# Update Node.js dependencies
docker-compose exec backend npm audit fix
```

### 6. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review application logs for error messages

---

**Last Updated**: January 2025
**Version**: 1.0.0
