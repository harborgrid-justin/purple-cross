import { prisma } from '../src/config/database';

// Setup function runs before all tests
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Teardown function runs after all tests
afterAll(async () => {
  // Clean up and disconnect
  await prisma.$disconnect();
});

// Clean database between tests
beforeEach(async () => {
  // Optionally truncate tables between tests
  // await prisma.$executeRaw`TRUNCATE TABLE patients CASCADE`;
});
