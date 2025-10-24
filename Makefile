# =============================================================================
# Purple Cross - Docker Management Makefile
# =============================================================================
# Simplifies Docker commands for development and production deployment
# =============================================================================

.PHONY: help dev-up dev-down dev-build dev-logs dev-clean prod-up prod-down prod-build prod-logs prod-clean db-migrate db-seed backup restore test lint

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# =============================================================================
# Help
# =============================================================================
help: ## Show this help message
	@echo "$(BLUE)Purple Cross - Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Development Commands:$(NC)"
	@grep -E '^dev-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Production Commands:$(NC)"
	@grep -E '^prod-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Database Commands:$(NC)"
	@grep -E '^db-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Utility Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -v '^dev-' | grep -v '^prod-' | grep -v '^db-' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# =============================================================================
# Development Commands
# =============================================================================
dev-up: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:5173$(NC)"
	@echo "$(BLUE)Backend: http://localhost:3000$(NC)"

dev-down: ## Stop development environment
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker-compose down
	@echo "$(GREEN)Development environment stopped!$(NC)"

dev-build: ## Build development images
	@echo "$(GREEN)Building development images...$(NC)"
	docker-compose build --parallel
	@echo "$(GREEN)Build complete!$(NC)"

dev-rebuild: ## Rebuild and restart development environment
	@echo "$(GREEN)Rebuilding development environment...$(NC)"
	docker-compose up -d --build
	@echo "$(GREEN)Rebuild complete!$(NC)"

dev-logs: ## Show development logs (all services)
	docker-compose logs -f

dev-logs-backend: ## Show backend logs only
	docker-compose logs -f backend

dev-logs-frontend: ## Show frontend logs only
	docker-compose logs -f frontend

dev-clean: ## Stop and remove all development containers, volumes, and images
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v --rmi all; \
		echo "$(GREEN)Development environment cleaned!$(NC)"; \
	fi

dev-ps: ## Show development container status
	docker-compose ps

dev-restart: ## Restart development services
	@echo "$(GREEN)Restarting development services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)Services restarted!$(NC)"

dev-shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

dev-shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

# =============================================================================
# Production Commands
# =============================================================================
prod-up: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	@if [ ! -f .env.production ]; then \
		echo "$(RED)ERROR: .env.production not found!$(NC)"; \
		echo "$(YELLOW)Copy .env.production.example to .env.production and configure it.$(NC)"; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Production environment started!$(NC)"

prod-down: ## Stop production environment
	@echo "$(YELLOW)Stopping production environment...$(NC)"
	docker-compose -f docker-compose.prod.yml down
	@echo "$(GREEN)Production environment stopped!$(NC)"

prod-build: ## Build production images
	@echo "$(GREEN)Building production images...$(NC)"
	docker-compose -f docker-compose.prod.yml build --parallel
	@echo "$(GREEN)Build complete!$(NC)"

prod-rebuild: ## Rebuild and restart production environment
	@echo "$(GREEN)Rebuilding production environment...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d --build
	@echo "$(GREEN)Rebuild complete!$(NC)"

prod-logs: ## Show production logs (all services)
	docker-compose -f docker-compose.prod.yml logs -f

prod-logs-backend: ## Show backend logs only (production)
	docker-compose -f docker-compose.prod.yml logs -f backend

prod-logs-frontend: ## Show frontend logs only (production)
	docker-compose -f docker-compose.prod.yml logs -f frontend

prod-clean: ## Stop and remove all production containers and volumes
	@echo "$(RED)WARNING: This will delete all production data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f docker-compose.prod.yml down -v; \
		echo "$(GREEN)Production environment cleaned!$(NC)"; \
	fi

prod-ps: ## Show production container status
	docker-compose -f docker-compose.prod.yml ps

prod-restart: ## Restart production services
	@echo "$(GREEN)Restarting production services...$(NC)"
	docker-compose -f docker-compose.prod.yml restart
	@echo "$(GREEN)Services restarted!$(NC)"

prod-scale-backend: ## Scale backend replicas (usage: make prod-scale-backend REPLICAS=4)
	@if [ -z "$(REPLICAS)" ]; then \
		echo "$(RED)ERROR: REPLICAS not specified!$(NC)"; \
		echo "$(YELLOW)Usage: make prod-scale-backend REPLICAS=4$(NC)"; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml up -d --scale backend=$(REPLICAS)
	@echo "$(GREEN)Backend scaled to $(REPLICAS) replicas!$(NC)"

# =============================================================================
# Database Commands
# =============================================================================
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker-compose exec backend npx prisma migrate deploy
	@echo "$(GREEN)Migrations complete!$(NC)"

db-migrate-dev: ## Create and apply development migration
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)ERROR: Migration NAME not specified!$(NC)"; \
		echo "$(YELLOW)Usage: make db-migrate-dev NAME=add_user_table$(NC)"; \
		exit 1; \
	fi
	docker-compose exec backend npx prisma migrate dev --name $(NAME)

db-seed: ## Seed database with test data
	@echo "$(GREEN)Seeding database...$(NC)"
	docker-compose exec backend npm run prisma:seed
	@echo "$(GREEN)Database seeded!$(NC)"

db-reset: ## Reset database (drop and recreate)
	@echo "$(RED)WARNING: This will delete all database data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec backend npx prisma migrate reset --force; \
		echo "$(GREEN)Database reset complete!$(NC)"; \
	fi

db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	@echo "$(BLUE)Access at: http://localhost:5555$(NC)"
	docker-compose exec backend npx prisma studio

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d purple_cross

# =============================================================================
# Backup & Restore Commands
# =============================================================================
backup: ## Create database backup
	@echo "$(GREEN)Creating database backup...$(NC)"
	@mkdir -p backups
	@BACKUP_FILE="backups/backup-$$(date +%Y%m%d-%H%M%S).sql.gz"; \
	docker-compose exec -T postgres pg_dump -U postgres purple_cross | gzip > $$BACKUP_FILE; \
	echo "$(GREEN)Backup created: $$BACKUP_FILE$(NC)"

restore: ## Restore database from backup (usage: make restore FILE=backups/backup-20250124.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)ERROR: Backup FILE not specified!$(NC)"; \
		echo "$(YELLOW)Usage: make restore FILE=backups/backup-20250124.sql.gz$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(FILE)...$(NC)"
	@gunzip -c $(FILE) | docker-compose exec -T postgres psql -U postgres -d purple_cross
	@echo "$(GREEN)Database restored!$(NC)"

# =============================================================================
# Testing & Quality Commands
# =============================================================================
test: ## Run tests in backend container
	@echo "$(GREEN)Running tests...$(NC)"
	docker-compose exec backend npm test

test-watch: ## Run tests in watch mode
	docker-compose exec backend npm run test:watch

test-coverage: ## Run tests with coverage
	docker-compose exec backend npm test -- --coverage

lint: ## Run linting
	@echo "$(GREEN)Running linters...$(NC)"
	docker-compose exec backend npm run lint
	docker-compose exec frontend npm run lint

format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	docker-compose exec backend npm run format
	docker-compose exec frontend npm run format

typecheck: ## Run TypeScript type checking
	@echo "$(GREEN)Running type checks...$(NC)"
	docker-compose exec backend npm run typecheck
	docker-compose exec frontend npm run typecheck

# =============================================================================
# Monitoring Commands
# =============================================================================
stats: ## Show container resource usage
	docker stats

health: ## Check health of all services
	@echo "$(GREEN)Checking service health...$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)Backend Health:$(NC)"
	@curl -f http://localhost:3000/health 2>/dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo ""
	@echo "$(BLUE)Frontend Health:$(NC)"
	@curl -f http://localhost:5173 2>/dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"

# =============================================================================
# Utility Commands
# =============================================================================
clean-images: ## Remove unused Docker images
	@echo "$(YELLOW)Removing unused Docker images...$(NC)"
	docker image prune -f
	@echo "$(GREEN)Unused images removed!$(NC)"

clean-volumes: ## Remove unused Docker volumes
	@echo "$(YELLOW)Removing unused Docker volumes...$(NC)"
	docker volume prune -f
	@echo "$(GREEN)Unused volumes removed!$(NC)"

clean-all: ## Remove all unused Docker resources
	@echo "$(YELLOW)Removing all unused Docker resources...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)Cleanup complete!$(NC)"

update: ## Pull latest images and restart
	@echo "$(GREEN)Pulling latest images...$(NC)"
	docker-compose pull
	docker-compose up -d --build
	@echo "$(GREEN)Update complete!$(NC)"

version: ## Show Docker and Docker Compose versions
	@echo "$(BLUE)Docker Version:$(NC)"
	@docker --version
	@echo ""
	@echo "$(BLUE)Docker Compose Version:$(NC)"
	@docker-compose --version
