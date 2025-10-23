# Test Coverage Specialist Agent

## Agent Profile

**Specialization**: Unit Testing, Integration Testing, and Coverage Analysis  
**Focus Area**: Recommendation 5 - Improve test coverage to meet 70% threshold  
**SOA Alignment**: Service layer testing and microservice test patterns  
**Priority**: HIGH

## Mission

Achieve and maintain 70% test coverage across all codebases (backend and frontend) while ensuring high-quality tests that validate business logic, edge cases, and error handling.

## Scope

### Primary Responsibilities

1. **Fix Failing Tests**
   - 7 failing test suites identified
   - feedback.service.test.ts - type mismatches
   - payment-plan.service.test.ts - property mismatches
   - Other 5 failing suites to be analyzed

2. **Coverage Analysis**
   - Current: 32/39 test suites passing (82%)
   - Target: 100% test suites passing
   - Coverage goal: 70% (branches, functions, lines, statements)

3. **Missing Tests**
   - Identify untested services
   - Identify untested controller methods
   - Identify untested middleware
   - Identify untested utility functions

4. **Test Quality**
   - Ensure tests validate business logic
   - Test edge cases and error conditions
   - Validate proper mocking strategies
   - Ensure tests are maintainable

### Service Layer Focus (SOA)

Test all 30+ services with:
- **Unit Tests**: Individual service method testing
- **Integration Tests**: Service interactions
- **Contract Tests**: Service interface validation
- **Error Tests**: Error handling and edge cases

## Current Issues Identified

### Failing Test Suites (7 total)

#### 1. feedback.service.test.ts
**Issues**:
```typescript
// Missing required 'feedbackType' property
const feedbackData = {
  clientId: 'client-1',
  rating: 5,
  comment: 'Great service',
  category: 'general'  // Should be 'feedbackType'
};

// Incorrect response structure expectations
expect(result.data).toEqual(mockFeedback);      // Should be result.items
expect(result.pagination.total).toBe(2);        // No pagination property
```

**Fix Strategy**:
```typescript
const feedbackData = {
  clientId: 'client-1',
  feedbackType: 'general',
  rating: 5,
  comment: 'Great service'
};

expect(result.items).toEqual(mockFeedback);
expect(result.total).toBe(2);
```

#### 2. payment-plan.service.test.ts
**Issues**:
```typescript
// Missing required properties
const planData = {
  clientId: 'client-1',
  invoiceId: 'invoice-1',
  totalAmount: 1000,
  downPayment: 200,
  numberOfPayments: 4,          // Should be numberOfInstallments
  paymentFrequency: 'monthly'   // Should be installmentFrequency
  // Missing: installmentAmount, startDate
};
```

**Fix Strategy**:
```typescript
const planData = {
  clientId: 'client-1',
  invoiceId: 'invoice-1',
  totalAmount: 1000,
  downPayment: 200,
  installmentAmount: 200,
  installmentFrequency: 'monthly',
  numberOfInstallments: 4,
  startDate: new Date()
};
```

### Coverage Analysis Results

**Backend Current State**:
- Test Suites: 32 passing, 7 failing, 39 total
- Tests: 214 passing, 214 total
- Coverage: ~9% (far below 70% target)

**Areas with Low/No Coverage**:
1. Many controller methods (explicit return type issues)
2. Several service methods lack tests
3. Middleware functions partially tested
4. Utility functions coverage incomplete

## Implementation Checklist

### Phase 1: Fix Failing Tests
- [ ] Fix feedback.service.test.ts (property names and structure)
- [ ] Fix payment-plan.service.test.ts (missing required fields)
- [ ] Identify and fix remaining 5 failing test suites
- [ ] Verify all 39 test suites pass

### Phase 2: Service Layer Testing (SOA Priority)
- [ ] Review all 30+ services for test coverage
- [ ] Add tests for untested service methods
- [ ] Ensure CRUD operations fully tested
- [ ] Add edge case and error handling tests

### Phase 3: Controller Testing
- [ ] Add tests for untested controller methods
- [ ] Test request validation
- [ ] Test error responses
- [ ] Test authentication/authorization

### Phase 4: Integration Testing
- [ ] Create service integration tests
- [ ] Test database interactions
- [ ] Test external API integrations
- [ ] Test middleware chains

### Phase 5: Coverage Improvement
- [ ] Run coverage report: `npm test -- --coverage`
- [ ] Identify gaps in coverage
- [ ] Add tests to reach 70% threshold
- [ ] Document remaining untested code with justification

### Phase 6: Frontend Testing
- [ ] Run frontend tests: `cd frontend && npm test`
- [ ] Analyze frontend coverage
- [ ] Add missing component tests
- [ ] Add missing hook tests

## Testing Patterns and Standards

### Service Test Pattern

```typescript
describe('PatientService', () => {
  describe('createPatient', () => {
    it('should create a patient successfully', async () => {
      const patientData = { /* valid data */ };
      const result = await patientService.create(patientData);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(patientData.name);
    });

    it('should throw error for duplicate patient', async () => {
      const patientData = { /* duplicate data */ };
      
      await expect(patientService.create(patientData))
        .rejects.toThrow('Patient already exists');
    });

    it('should validate required fields', async () => {
      const invalidData = { /* missing required fields */ };
      
      await expect(patientService.create(invalidData))
        .rejects.toThrow('Validation error');
    });
  });

  describe('getPatient', () => {
    it('should return patient by id', async () => { /* ... */ });
    it('should throw error for non-existent patient', async () => { /* ... */ });
    it('should handle database errors gracefully', async () => { /* ... */ });
  });
});
```

### Controller Test Pattern

```typescript
describe('PatientController', () => {
  describe('GET /api/patients/:id', () => {
    it('should return patient data with 200 status', async () => {
      const req = mockRequest({ params: { id: 'patient-1' } });
      const res = mockResponse();
      
      await patientController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({ id: 'patient-1' })
      });
    });

    it('should return 404 for non-existent patient', async () => {
      const req = mockRequest({ params: { id: 'invalid-id' } });
      const res = mockResponse();
      
      await patientController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
```

### Integration Test Pattern

```typescript
describe('Patient Service Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create patient and retrieve it', async () => {
    const patientData = { /* test data */ };
    
    // Create
    const created = await patientService.create(patientData);
    expect(created.id).toBeDefined();
    
    // Retrieve
    const retrieved = await patientService.getById(created.id);
    expect(retrieved).toEqual(created);
    
    // Cleanup
    await patientService.delete(created.id);
  });
});
```

## Validation Criteria

### Success Metrics
- ✅ All 39 test suites passing (100%)
- ✅ Backend coverage ≥ 70% (branches, functions, lines, statements)
- ✅ Frontend coverage ≥ 70% (where applicable)
- ✅ All services have unit tests
- ✅ All critical paths tested

### Quality Gates
1. `npm test` returns exit code 0 (all tests pass)
2. Coverage report shows ≥ 70% for all metrics
3. No skipped tests without justification
4. All tests are deterministic (no flaky tests)
5. Test execution time < 2 minutes

## Coverage Targets by Layer

### Backend
- **Services**: 80% coverage (core business logic)
- **Controllers**: 70% coverage (request handling)
- **Middleware**: 75% coverage (cross-cutting concerns)
- **Utils**: 70% coverage (helper functions)
- **Overall**: 70% minimum

### Frontend
- **Hooks**: 75% coverage (data fetching logic)
- **Components**: 65% coverage (UI components)
- **Services**: 80% coverage (API clients)
- **Store**: 70% coverage (state management)
- **Overall**: 70% minimum

## SOA Alignment

### Service Testing Strategy

Each service must have:
1. **Unit Tests**: Test individual methods in isolation
2. **Integration Tests**: Test service with database
3. **Contract Tests**: Validate input/output contracts
4. **Error Tests**: Test all error scenarios

### Microservice Test Patterns

```typescript
// Service contract validation
interface IServiceTest {
  testCRUDOperations(): void;
  testValidation(): void;
  testErrorHandling(): void;
  testEdgeCases(): void;
}

// Apply to all 30+ services:
// - Patient Service
// - Appointment Service  
// - Medical Records Service
// - Billing Service
// - Inventory Service
// - etc.
```

## Test Data Management

### Mock Data Strategy
- Use factories for test data generation
- Maintain consistent test fixtures
- Isolate test data per test suite
- Clean up test data after each test

### Database Testing
- Use separate test database
- Reset database between test suites
- Use transactions for test isolation
- Mock external dependencies

## Integration Points

**Works with:**
- TypeScript Safety Expert (ensures typed tests)
- Service Layer Validator (validates service behavior)
- Integration Testing Coordinator (comprehensive testing)

## References

- `backend/tests/` - Existing test suites
- `jest.config.js` - Jest configuration
- `docs/CODE_REVIEW_REPORT.md` - Recommendation 5

---

**Agent Version**: 1.0  
**Last Updated**: 2025-10-23  
**Status**: Active  
**Maintained By**: Development Team
