# Purple Cross - Deployment Guide

Complete guide for deploying the Purple Cross veterinary practice management platform to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Build & Test](#build--test)
4. [Deployment Options](#deployment-options)
5. [Production Checklist](#production-checklist)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Docker**: v24.x or higher (for containerized deployment)
- **Docker Compose**: v2.x or higher
- **Git**: v2.x or higher

### Optional Tools

- **Nginx**: For reverse proxy (if not using Docker)
- **PM2**: For process management (Node.js deployments)
- **AWS CLI**: For AWS deployments
- **kubectl**: For Kubernetes deployments

### Access Requirements

- [ ] Production server SSH access
- [ ] Docker Hub or container registry credentials
- [ ] Domain DNS management access
- [ ] SSL certificate (or Let's Encrypt setup)
- [ ] Environment secrets and API keys

---

## Environment Configuration

### Frontend Environment Variables

Create `.env.production` in the `frontend/` directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.purplecross.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Third-Party Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-google-analytics-id

# Build Configuration
NODE_ENV=production
```

### Backend Environment Variables

Create `.env.production` in the `backend/` directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/purplecross

# Server
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://app.purplecross.com

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@purplecross.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

---

## Build & Test

### 1. Pre-Deployment Testing

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Type check
npm run typecheck

# Lint code
npm run lint

# Check formatting
npm run format:check
```

### 2. Build Frontend

```bash
cd frontend

# Install production dependencies
npm ci --production=false

# Build with performance config
npm run build

# Verify build
ls -la dist/
du -sh dist/

# Expected output: dist/ directory with optimized assets
```

### 3. Build Backend

```bash
cd backend

# Install production dependencies
npm ci --production=false

# Build TypeScript
npm run build

# Verify build
ls -la dist/
```

### 4. Run Production Build Locally

```bash
# Frontend (preview production build)
cd frontend
npm run preview

# Backend
cd backend
npm start

# Access: http://localhost:4173 (frontend) and http://localhost:3000 (backend)
```

---

## Deployment Options

### Option 1: Docker Compose (Recommended)

**Best for:** Small to medium deployments, development servers

```bash
# 1. Clone repository on server
git clone https://github.com/your-org/purple-cross.git
cd purple-cross

# 2. Create production environment files
cp frontend/.env.example frontend/.env.production
cp backend/.env.example backend/.env.production

# 3. Edit environment variables
nano frontend/.env.production
nano backend/.env.production

# 4. Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Verify services are running
docker-compose -f docker-compose.prod.yml ps

# 6. Check logs
docker-compose -f docker-compose.prod.yml logs -f

# 7. Access application
# Frontend: http://your-domain.com
# Backend API: http://your-domain.com/api
```

**docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: purplecross
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER}']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    restart: unless-stopped
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    env_file:
      - backend/.env.production
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@database:5432/purplecross
      REDIS_URL: redis://redis:6379
    ports:
      - '3000:3000'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
      args:
        VITE_API_BASE_URL: http://backend:3000
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - '80:80'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
    ports:
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    healthcheck:
      test: ['CMD', 'nginx', '-t']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

### Option 2: Manual Deployment

**Best for:** Custom server setups, legacy infrastructure

#### Backend Deployment

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 globally
sudo npm install -g pm2

# 4. Clone repository
git clone https://github.com/your-org/purple-cross.git
cd purple-cross/backend

# 5. Install dependencies
npm ci --production

# 6. Set up environment
cp .env.example .env.production
nano .env.production

# 7. Run database migrations
npx prisma migrate deploy

# 8. Build application
npm run build

# 9. Start with PM2
pm2 start dist/index.js --name purplecross-api -i max

# 10. Save PM2 process list
pm2 save

# 11. Set up PM2 startup
pm2 startup
```

#### Frontend Deployment

```bash
# 1. Build frontend locally
cd frontend
npm ci
npm run build

# 2. Upload to server
rsync -avz --delete dist/ user@your-server:/var/www/purplecross/

# 3. Configure Nginx on server
sudo nano /etc/nginx/sites-available/purplecross

# Add configuration:
server {
    listen 80;
    server_name app.purplecross.com;

    root /var/www/purplecross;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 4. Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/purplecross /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Vercel (Frontend Only)

**Best for:** Static frontend hosting with serverless functions

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from frontend directory
cd frontend
vercel --prod

# 4. Configure environment variables in Vercel dashboard
# - VITE_API_BASE_URL
# - VITE_SENTRY_DSN
# - etc.
```

### Option 4: AWS (Advanced)

**Best for:** Enterprise deployments, high scalability

```bash
# 1. Frontend: Deploy to S3 + CloudFront
cd frontend
npm run build

aws s3 sync dist/ s3://purplecross-frontend --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# 2. Backend: Deploy to ECS/EKS
# Build and push Docker image
docker build -t purplecross-api:latest ./backend
docker tag purplecross-api:latest YOUR_ECR_REPO/purplecross-api:latest
docker push YOUR_ECR_REPO/purplecross-api:latest

# Update ECS service
aws ecs update-service --cluster purplecross --service api --force-new-deployment
```

---

## Production Checklist

### Pre-Deployment

- [ ] All tests passing (unit, integration, E2E)
- [ ] TypeScript compilation successful
- [ ] No linting errors
- [ ] Code formatting verified
- [ ] Bundle size optimized (< 500KB initial load)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Monitoring and logging set up

### Security

- [ ] JWT secret changed from default
- [ ] Database credentials secured
- [ ] API keys stored in environment variables
- [ ] CORS origins configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation and sanitization
- [ ] Helmet.js security headers
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS prevention
- [ ] CSRF protection

### Performance

- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured (if applicable)
- [ ] Caching headers set
- [ ] Database indexes optimized
- [ ] API response times < 500ms
- [ ] Lighthouse score > 90

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Application logs configured (Winston)
- [ ] Health check endpoints working
- [ ] Uptime monitoring set up
- [ ] Performance monitoring enabled
- [ ] Database monitoring active
- [ ] Alert thresholds configured

---

## Monitoring & Maintenance

### Health Checks

```bash
# Frontend health
curl https://app.purplecross.com/health

# Backend health
curl https://api.purplecross.com/health

# Detailed health check
curl https://api.purplecross.com/health/detailed
```

### Logs

```bash
# Docker Compose logs
docker-compose -f docker-compose.prod.yml logs -f

# PM2 logs
pm2 logs purplecross-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgresql"
mkdir -p $BACKUP_DIR

# Backup database
docker exec purplecross_database pg_dump -U purplecross > "$BACKUP_DIR/backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://purplecross-backups/
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.prod.yml up -d --build

# Or with PM2
pm2 reload purplecross-api
```

---

## Rollback Procedures

### Docker Deployment

```bash
# 1. Check previous image tags
docker images | grep purplecross

# 2. Update docker-compose.yml to use previous version
# Change:
#   image: purplecross/frontend:main-abc123
# To:
#   image: purplecross/frontend:main-xyz789

# 3. Restart services
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify rollback
docker-compose -f docker-compose.prod.yml ps
```

### PM2 Deployment

```bash
# 1. Checkout previous Git commit
git log --oneline
git checkout <commit-hash>

# 2. Rebuild application
npm run build

# 3. Reload PM2
pm2 reload purplecross-api

# 4. Verify
pm2 status
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Restore from backup
psql -U purplecross purplecross < /backups/backup_20240315.sql
```

---

## Troubleshooting

### Frontend Issues

**Problem:** White screen / blank page

```bash
# Check console for errors
# Verify environment variables are set
echo $VITE_API_BASE_URL

# Check build output
ls -la dist/
cat dist/index.html

# Test locally
npm run preview
```

**Problem:** API calls failing

```bash
# Check CORS configuration
# Verify API URL in environment
# Check network tab in DevTools
# Verify backend is running
curl http://localhost:3000/health
```

### Backend Issues

**Problem:** Server not starting

```bash
# Check logs
pm2 logs purplecross-api

# Verify environment variables
pm2 env purplecross-api

# Check port availability
sudo netstat -tulpn | grep 3000

# Test database connection
npx prisma db pull
```

**Problem:** Database connection errors

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U purplecross -h localhost -d purplecross

# Check migrations
npx prisma migrate status
```

### Performance Issues

**Problem:** Slow page loads

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://app.purplecross.com --view

# Check bundle size
npm run build
ls -lh dist/assets/

# Enable gzip compression in Nginx
# Add to nginx.conf:
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Problem:** High memory usage

```bash
# Check PM2 metrics
pm2 monit

# Increase memory limit
pm2 start dist/index.js --max-memory-restart 1G

# Check for memory leaks
node --inspect dist/index.js
```

---

## Support

For deployment assistance:

- **Documentation**: https://docs.purplecross.com
- **GitHub Issues**: https://github.com/your-org/purple-cross/issues
- **Email**: support@purplecross.com

---

## Version History

- **v1.0.0** (2024-02-15): Initial production deployment
