// Mock Prisma before importing it
jest.mock('../src/config/database', () => ({
  prisma: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

// Setup function runs before all tests
beforeAll(async () => {
  // Tests use mocked database
});

// Teardown function runs after all tests
afterAll(async () => {
  // Clean up
});

// Clean mocks between tests
beforeEach(async () => {
  jest.clearAllMocks();
});
