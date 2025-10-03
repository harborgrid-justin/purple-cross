#!/bin/bash

# Purple Cross Development Script
# Quick start for local development without Docker

set -e

echo "🟣 Purple Cross - Development Mode"
echo "==================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✓ Dependencies installed"
echo ""

# Check for .env files
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found, creating from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "🚀 Starting development servers..."
echo ""
echo "Backend will start on http://localhost:3000"
echo "Frontend will start on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Use npm's concurrently to run both servers
npm run dev
