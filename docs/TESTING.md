# Purple Cross - Testing Guide

This document provides comprehensive information about the testing infrastructure and practices for the Purple Cross application.

## Overview

The Purple Cross testing suite includes:

- **Unit Tests**: Test individual components and services in isolation
- **Integration Tests**: Test interactions between components
- **End-to-End (E2E) Tests**: Test complete user workflows
- **Frontend Tests**: React component and utility tests
- **Backend Tests**: Service, controller, and API tests

## Coverage Goals

- **Minimum Coverage**: 70% (enforced)
- **Target Coverage**: 80%+
- **Critical Paths**: 90%+

## Backend Testing

### Running Tests

```bash
cd backend

# Run all unit tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Type checking
npm run typecheck
```

### Test Structure

```
backend/
├── tests/
│   ├── setup.ts                 # Global test setup
│   ├── e2e-setup.ts            # E2E test setup
│   ├── unit/                   # Unit tests
│   │   └── services/           # Service tests
│   ├── integration/            # Integration tests (planned)
│   ├── e2e/                    # End-to-end tests
│   └── utils/                  # Test utilities
│       └── testHelpers.ts      # Mock data generators
```

### Writing Unit Tests

Follow the AAA (Arrange-Act-Assert) pattern:

```typescript
describe('PatientService', () => {
  describe('createPatient', () => {
    it('should create a patient with valid data', async () => {
      // Arrange
      const patientData = { name: 'Max', species: 'Dog', ownerId: '123' };
      
      // Act
      const result = await patientService.createPatient(patientData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('Max');
    });
  });
});
```

### Test Coverage

Current test files:
- ✅ Patient Service Tests
- ✅ Client Service Tests
- ✅ Appointment Service Tests
- ✅ Medical Record Service Tests
- ✅ Prescription Service Tests
- ✅ Inventory Service Tests
- ✅ Invoice Service Tests
- ✅ Staff Service Tests

### E2E Tests

E2E tests validate complete workflows:

```bash
npm run test:e2e
```

Example E2E test:

```typescript
describe('Health Check API (E2E)', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});
```

## Frontend Testing

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/         # Component tests
│   │   ├── services/           # Service tests
│   │   └── utils/              # Utility function tests
│   └── setupTests.ts           # Test setup
```

### Testing Framework

- **Vitest**: Fast unit test framework
- **Testing Library**: React component testing
- **jsdom**: Browser environment simulation

### Writing Component Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Dashboard Component', () => {
  it('should render without crashing', () => {
    expect(true).toBe(true);
  });
});
```

## Test Utilities

### Mock Data Generators

Use `TestDataGenerator` for consistent mock data:

```typescript
import { TestDataGenerator } from '../utils/testHelpers';

const mockPatient = TestDataGenerator.mockPatient({
  name: 'Custom Name',
  species: 'Cat',
});
```

### Common Test Patterns

#### Testing Service Methods

```typescript
it('should handle error cases', async () => {
  (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);
  
  await expect(patientService.getPatientById('invalid'))
    .rejects.toThrow('Patient not found');
});
```

#### Testing Pagination

```typescript
it('should return paginated results', async () => {
  const result = await service.getAll({ page: 1, limit: 20 });
  
  expect(result.pagination).toEqual({
    page: 1,
    limit: 20,
    total: expect.any(Number),
    totalPages: expect.any(Number),
  });
});
```

#### Testing Validation

```typescript
it('should validate required fields', async () => {
  const invalidData = {};
  
  await expect(service.create(invalidData))
    .rejects.toThrow('Validation error');
});
```

## Continuous Integration

Tests run automatically on:
- Every pull request
- Every commit to main branch
- Scheduled nightly builds

### CI Pipeline

```yaml
- Install dependencies
- Run linters
- Run type checking
- Run unit tests
- Run E2E tests
- Generate coverage reports
- Upload coverage to reporting service
```

## Best Practices

### DO

✅ Write tests for all new features
✅ Test edge cases and error conditions
✅ Use descriptive test names
✅ Keep tests isolated and independent
✅ Mock external dependencies
✅ Test both success and failure paths
✅ Maintain high code coverage
✅ Run tests before committing

### DON'T

❌ Test implementation details
❌ Write tests that depend on each other
❌ Hardcode test data unnecessarily
❌ Skip error case testing
❌ Ignore failing tests
❌ Write overly complex tests
❌ Test third-party library functionality

## Debugging Tests

### Running Specific Tests

```bash
# Run single test file
npm test -- path/to/test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"

# Run with verbose output
npm test -- --verbose
```

### Common Issues

**Issue**: Tests timeout
**Solution**: Increase timeout in jest.config.js or use `jest.setTimeout()`

**Issue**: Mock not working
**Solution**: Ensure mocks are defined before imports

**Issue**: Prisma types not found
**Solution**: Run `npx prisma generate`

## Coverage Reports

Coverage reports are generated in:
- `backend/coverage/` - Backend test coverage
- `frontend/coverage/` - Frontend test coverage

View HTML report:

```bash
# Backend
open backend/coverage/index.html

# Frontend
open frontend/coverage/index.html
```

## Test Configuration

### Jest (Backend)

Configuration: `backend/jest.config.js`

Key settings:
- Coverage threshold: 70%
- Test timeout: 10000ms
- Test environment: node

### Vitest (Frontend)

Configuration: `frontend/vite.config.ts`

Key settings:
- Test environment: jsdom
- Coverage provider: v8
- Global test APIs enabled

## Contributing

When adding new tests:

1. Follow existing test patterns
2. Ensure tests are deterministic
3. Document complex test scenarios
4. Update this guide if adding new test types
5. Verify all tests pass locally before pushing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)

## Support

For testing questions or issues:
- Open an issue on GitHub
- Contact the development team
- Refer to `docs/CONTRIBUTING.md`

---

**Last Updated**: December 2024
**Test Suite Version**: 1.0.0
