// Integration test setup: connect to the real database and verify reachability.
// Intentionally does NOT mock Prisma (unlike tests/setup.ts).
import '../../src/config/env';
import { prisma, connectDatabase, disconnectDatabase } from '../../src/config/database';

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Integration tests require DATABASE_URL to point at a real database');
  }
  await connectDatabase();
  // Fail fast with a clear message if migrations have not been applied.
  await prisma.$queryRawUnsafe('SELECT 1 FROM tenants LIMIT 1').catch(() => {
    throw new Error('Run `prisma migrate deploy` before integration tests (tenants table missing)');
  });
});

afterAll(async () => {
  await disconnectDatabase();
});
