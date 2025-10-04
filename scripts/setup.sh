#!/bin/bash

# Purple Cross Setup Script
# This script helps you set up the Purple Cross development environment

set -e

echo "🟣 Purple Cross - Setup Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed (support both v1 and v2)
DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js is not installed${NC}"
    echo "Node.js is required for local development."
    echo "You can still use Docker, but we recommend installing Node.js 18+"
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} is installed${NC}"
fi

echo ""
echo "Setting up environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${YELLOW}⚠ backend/.env already exists${NC}"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${YELLOW}⚠ frontend/.env already exists${NC}"
fi

echo ""
echo "Starting Docker containers..."
$DOCKER_COMPOSE_CMD up -d

echo ""
echo "Waiting for PostgreSQL to be ready..."
echo -n "Checking PostgreSQL connection..."
MAX_RETRIES=30
RETRY_COUNT=0
until $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo ""
        echo -e "${RED}✗ PostgreSQL failed to start after ${MAX_RETRIES} attempts${NC}"
        echo "Please check Docker logs: $DOCKER_COMPOSE_CMD logs postgres"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

echo ""
echo "Waiting for Redis to be ready..."
echo -n "Checking Redis connection..."
RETRY_COUNT=0
until $DOCKER_COMPOSE_CMD exec -T redis redis-cli ping > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo ""
        echo -e "${RED}✗ Redis failed to start after ${MAX_RETRIES} attempts${NC}"
        echo "Please check Docker logs: $DOCKER_COMPOSE_CMD logs redis"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""
echo -e "${GREEN}✓ Redis is ready${NC}"

echo ""
echo "Installing dependencies..."
echo "Installing backend dependencies..."
$DOCKER_COMPOSE_CMD exec -T backend npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo "Installing frontend dependencies..."
$DOCKER_COMPOSE_CMD exec -T frontend npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo "Generating Prisma Client..."
$DOCKER_COMPOSE_CMD exec -T backend npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

echo ""
echo "Running database migrations..."
$DOCKER_COMPOSE_CMD exec -T backend npx prisma migrate deploy
echo -e "${GREEN}✓ Database migrations completed${NC}"

echo ""
echo "Verifying setup..."
echo ""

# Verify backend is responding
echo -n "Checking backend health..."
RETRY_COUNT=0
until curl -s http://localhost:3000/health > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge 30 ]; then
        echo ""
        echo -e "${YELLOW}⚠ Backend health check timeout (this is normal on first run)${NC}"
        echo "The backend may still be starting up. Check logs with: $DOCKER_COMPOSE_CMD logs -f backend"
        break
    fi
    echo -n "."
    sleep 2
done
if [ $RETRY_COUNT -lt 30 ]; then
    echo ""
    echo -e "${GREEN}✓ Backend is responding${NC}"
fi

# Verify frontend is responding
echo -n "Checking frontend..."
RETRY_COUNT=0
until curl -s http://localhost:5173 > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge 30 ]; then
        echo ""
        echo -e "${YELLOW}⚠ Frontend health check timeout (this is normal on first run)${NC}"
        echo "The frontend may still be starting up. Check logs with: $DOCKER_COMPOSE_CMD logs -f frontend"
        break
    fi
    echo -n "."
    sleep 2
done
if [ $RETRY_COUNT -lt 30 ]; then
    echo ""
    echo -e "${GREEN}✓ Frontend is responding${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "========================================"
echo ""
echo "🎉 Purple Cross is ready for development!"
echo ""
echo "📍 Access Points:"
echo "  • Frontend:       http://localhost:5173"
echo "  • Backend API:    http://localhost:3000"
echo "  • API Health:     http://localhost:3000/health"
echo "  • Prisma Studio:  npm run prisma:studio"
echo ""
echo "📚 Documentation:"
echo "  • Development:    docs/DEVELOPMENT.md"
echo "  • Contributing:   docs/CONTRIBUTING.md"
echo "  • API Docs:       docs/API.md"
echo ""
echo "🛠️  Useful Commands:"
echo "  • View logs:      $DOCKER_COMPOSE_CMD logs -f"
echo "  • Stop services:  $DOCKER_COMPOSE_CMD down"
echo "  • Restart:        $DOCKER_COMPOSE_CMD restart"
echo "  • Run tests:      npm test"
echo "  • Start dev:      npm run dev"
echo ""
echo "💡 Tip: Run 'make help' to see all available commands"
echo ""
echo "Happy coding! 🚀"
