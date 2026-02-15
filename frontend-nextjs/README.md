# Purple Cross Next.js Frontend

Modern veterinary practice management system built with Next.js 15, React 19, and TypeScript.

## Technology Stack

- **Next.js 16+** - React framework with App Router
- **React 19+** - Latest React with Server Components
- **TypeScript 5+** - Strict mode enabled
- **Tailwind CSS v4** - Utility-first CSS framework
- **TanStack Query v5** - Powerful data synchronization
- **NextAuth.js v5 (Auth.js)** - Authentication
- **Axios** - HTTP client for API communication

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- npm 9+
- NestJS backend running on port 4000

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your configuration
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Application Info
NEXT_PUBLIC_APP_NAME=Purple Cross
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### Development

```bash
# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend-nextjs/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group (login, register)
│   ├── (dashboard)/         # Dashboard route group (protected)
│   ├── api/auth/            # NextAuth API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── features/            # Feature-specific components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and configurations
├── services/                # API service layer
├── types/                   # TypeScript type definitions
├── constants/               # Centralized constants
└── middleware.ts            # Next.js middleware
```

## Key Features

- NextAuth.js v5 authentication with NestJS backend
- TanStack Query v5 for data fetching and caching
- TypeScript strict mode (zero `any` types)
- Server Components by default
- Protected routes via middleware
- Responsive design with Tailwind CSS v4

## Development Guidelines

### TypeScript

- Always use explicit types
- No `any` types allowed
- Use strict null checks

### React

- Use Server Components by default
- Use Client Components only when needed (`'use client'`)
- Implement proper error boundaries

## Migration Status

- ✅ Phase 1: Application Setup (Complete)
- ✅ Phase 2: Core Infrastructure (Complete)
- ⏳ Phase 3: Core Pages Migration (Pending)

## License

MIT
