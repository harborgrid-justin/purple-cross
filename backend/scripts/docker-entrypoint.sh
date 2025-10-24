#!/bin/sh
set -e

echo "========================================="
echo "Purple Cross Backend - Starting..."
echo "========================================="

# Function to wait for database
wait_for_db() {
  echo "Waiting for PostgreSQL to be ready..."

  max_attempts=30
  attempt=0

  until node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect()
      .then(() => { client.end(); process.exit(0); })
      .catch(() => process.exit(1));
  " || [ $attempt -eq $max_attempts ]; do
    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts: PostgreSQL is unavailable - sleeping"
    sleep 2
  done

  if [ $attempt -eq $max_attempts ]; then
    echo "Failed to connect to PostgreSQL after $max_attempts attempts"
    exit 1
  fi

  echo "PostgreSQL is ready!"
}

# Function to wait for Redis
wait_for_redis() {
  if [ -n "$REDIS_URL" ]; then
    echo "Waiting for Redis to be ready..."

    max_attempts=30
    attempt=0

    until node -e "
      const redis = require('redis');
      const client = redis.createClient({ url: process.env.REDIS_URL });
      client.connect()
        .then(() => { client.disconnect(); process.exit(0); })
        .catch(() => process.exit(1));
    " || [ $attempt -eq $max_attempts ]; do
      attempt=$((attempt + 1))
      echo "Attempt $attempt/$max_attempts: Redis is unavailable - sleeping"
      sleep 2
    done

    if [ $attempt -eq $max_attempts ]; then
      echo "Warning: Failed to connect to Redis after $max_attempts attempts"
      echo "Continuing without Redis..."
    else
      echo "Redis is ready!"
    fi
  fi
}

# Function to run migrations
run_migrations() {
  if [ "$SKIP_MIGRATIONS" = "true" ]; then
    echo "Skipping database migrations (SKIP_MIGRATIONS=true)"
    return
  fi

  echo "Running database migrations..."
  npx prisma migrate deploy
  echo "Migrations completed successfully!"
}

# Function to seed database (only in development)
seed_database() {
  if [ "$NODE_ENV" = "development" ] && [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database with initial data..."
    npm run prisma:seed
    echo "Database seeding completed!"
  fi
}

# Main execution
main() {
  # Wait for dependencies
  wait_for_db
  wait_for_redis

  # Run migrations
  run_migrations

  # Seed database if needed
  seed_database

  echo "========================================="
  echo "Starting application server..."
  echo "Environment: ${NODE_ENV:-production}"
  echo "Port: ${PORT:-3000}"
  echo "========================================="

  # Start the application
  exec node dist/index.js
}

# Run main function
main
