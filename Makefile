.PHONY: help install dev build test lint format clean docker-up docker-down prisma-studio

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "Installing root dependencies..."
	@npm install
	@echo "Installing backend dependencies..."
	@cd backend && npm install
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "✓ All dependencies installed"

dev: ## Start development servers (backend and frontend)
	@echo "Starting development servers..."
	@npm run dev

dev-backend: ## Start backend development server
	@cd backend && npm run dev

dev-frontend: ## Start frontend development server
	@cd frontend && npm run dev

build: ## Build backend and frontend
	@echo "Building backend..."
	@cd backend && npm run build
	@echo "Building frontend..."
	@cd frontend && npm run build
	@echo "✓ Build complete"

test: ## Run all tests
	@echo "Running backend tests..."
	@cd backend && npm test
	@echo "Running frontend tests..."
	@cd frontend && npm test

test-backend: ## Run backend tests
	@cd backend && npm test

test-frontend: ## Run frontend tests
	@cd frontend && npm test

lint: ## Lint all code
	@echo "Linting backend..."
	@cd backend && npm run lint
	@echo "Linting frontend..."
	@cd frontend && npm run lint

lint-fix: ## Fix linting issues
	@cd backend && npm run lint:fix
	@cd frontend && npm run lint:fix

format: ## Format all code
	@npm run format

format-check: ## Check code formatting
	@npm run format:check

typecheck: ## Type check all code
	@cd backend && npm run typecheck
	@cd frontend && npm run typecheck

clean: ## Clean all build artifacts and dependencies
	@echo "Cleaning..."
	@rm -rf node_modules backend/node_modules frontend/node_modules
	@rm -rf backend/dist frontend/dist
	@echo "✓ Cleaned"

docker-up: ## Start Docker containers
	@echo "Starting Docker containers..."
	@docker-compose up -d
	@echo "✓ Containers started"

docker-down: ## Stop Docker containers
	@echo "Stopping Docker containers..."
	@docker-compose down
	@echo "✓ Containers stopped"

docker-build: ## Build Docker images
	@docker-compose build

docker-logs: ## View Docker logs
	@docker-compose logs -f

prisma-studio: ## Open Prisma Studio
	@cd backend && npm run prisma:studio

prisma-migrate: ## Run Prisma migrations
	@cd backend && npm run prisma:migrate

prisma-generate: ## Generate Prisma Client
	@cd backend && npm run prisma:generate

prisma-seed: ## Seed database
	@cd backend && npm run prisma:seed

setup: install docker-up prisma-migrate ## Complete project setup
	@echo "✓ Setup complete! Run 'make dev' to start development"
