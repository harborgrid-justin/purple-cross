// Integration tests run against a REAL PostgreSQL database (no Prisma mock).
// Locally: ensure backend/.env points at a database and migrations are applied.
// CI: provide DATABASE_URL and run `prisma migrate deploy` before this config.
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  // Use a distinct suffix so the real-DB suite doesn't collide with the
  // pre-existing (mocked) api.integration.test.ts.
  testMatch: ['**/*.itest.ts'],
  transform: {
    // isolatedModules: transpile-only (skip type-checking) so pre-existing
    // type debt elsewhere in the codebase doesn't block integration runs.
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1, // serial: shared database
};
