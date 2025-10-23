# Integration Testing Coordinator Agent

## Agent Profile

**Specialization**: Integration Testing, End-to-End Testing, and System Validation  
**Focus Area**: Recommendation 7 - Run comprehensive integration tests  
**SOA Alignment**: Service integration validation and microservice communication testing  
**Priority**: HIGH

## Mission

Design, implement, and execute comprehensive integration tests that validate service interactions, database operations, API contracts, and end-to-end workflows across the entire Purple Cross platform.

## Scope

### Primary Responsibilities

1. **Integration Test Strategy**
   - Define integration test scope
   - Identify critical integration points
   - Plan test data management
   - Design test execution workflow

2. **Service Integration Tests**
   - Test service-to-database interactions
   - Test service-to-service communications
   - Test transaction management
   - Test error propagation

3. **API Integration Tests**
   - Test full request/response cycle
   - Test authentication/authorization
   - Test middleware chain
   - Test error handling

4. **End-to-End Tests**
   - Test complete workflows
   - Test multi-service operations
   - Test data consistency
   - Test business processes

### Test Scope

#### Backend Integration Tests
1. **Database Integration**
   - Prisma client operations
   - Transaction handling
   - Constraint validation
   - Referential integrity

2. **Service Integration**
   - Service method execution
   - Error handling
   - Data transformation
   - Business logic validation

3. **API Integration**
   - Full HTTP request cycle
   - Authentication flow
   - Middleware processing
   - Response formatting

4. **External Integration**
   - Email service (SendGrid)
   - SMS service (Twilio)
   - File storage
   - Third-party APIs

#### Frontend Integration Tests (Optional)
1. **API Client Integration**
2. **State Management**
3. **Component Integration**
4. **User Workflows**

## Integration Testing Patterns

### 1. Database Integration Test

```typescript
// backend/tests/integration/patient.integration.test.ts

import { PrismaClient } from '@prisma/client';
import { PatientService } from '../../src/services/patient.service';

describe('Patient Service Integration', () => {
  let prisma: PrismaClient;
  let patientService: PatientService;
  let testClientId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    patientService = new PatientService();

    // Create test client
    const client = await prisma.client.create({
      data: {
        firstName: 'Test',
        lastName: 'Client',
        email: 'test@example.com',
        phone: '555-0100'
      }
    });
    testClientId = client.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.patient.deleteMany({ where: { clientId: testClientId } });
    await prisma.client.delete({ where: { id: testClientId } });
    await prisma.$disconnect();
  });

  describe('CRUD Operations', () => {
    it('should create, read, update, and delete a patient', async () => {
      // CREATE
      const createData = {
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        dateOfBirth: new Date('2020-01-01'),
        clientId: testClientId,
      };

      const created = await patientService.create(createData);
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Buddy');

      // READ
      const retrieved = await patientService.getById(created.id);
      expect(retrieved).toEqual(created);

      // UPDATE
      const updateData = { weight: 30 };
      const updated = await patientService.update(created.id, updateData);
      expect(updated.weight).toBe(30);

      // DELETE
      await patientService.delete(created.id);
      await expect(patientService.getById(created.id))
        .rejects.toThrow('Patient not found');
    });

    it('should enforce foreign key constraints', async () => {
      const invalidData = {
        name: 'Test',
        species: 'dog',
        breed: 'Test',
        dateOfBirth: new Date(),
        clientId: 'invalid-uuid',
      };

      await expect(patientService.create(invalidData))
        .rejects.toThrow();
    });
  });

  describe('Business Logic', () => {
    it('should prevent duplicate microchip numbers', async () => {
      const data1 = {
        name: 'Patient1',
        species: 'dog',
        breed: 'Test',
        dateOfBirth: new Date(),
        clientId: testClientId,
        microchipNumber: '123456789'
      };

      const data2 = {
        name: 'Patient2',
        species: 'cat',
        breed: 'Test',
        dateOfBirth: new Date(),
        clientId: testClientId,
        microchipNumber: '123456789'  // Duplicate!
      };

      const patient1 = await patientService.create(data1);
      
      await expect(patientService.create(data2))
        .rejects.toThrow();

      // Cleanup
      await patientService.delete(patient1.id);
    });
  });

  describe('Transactions', () => {
    it('should rollback on transaction failure', async () => {
      // Test multi-step operation that should rollback
      // Implementation depends on specific business logic
    });
  });
});
```

### 2. API Integration Test

```typescript
// backend/tests/integration/api/patient.api.test.ts

import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

describe('Patient API Integration', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let testClientId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    // Create test client
    const client = await prisma.client.create({
      data: {
        firstName: 'Test',
        lastName: 'Client',
        email: 'api-test@example.com',
        phone: '555-0200'
      }
    });
    testClientId = client.id;

    // Authenticate to get token
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = authResponse.body.data.token;
  });

  afterAll(async () => {
    await prisma.patient.deleteMany({ where: { clientId: testClientId } });
    await prisma.client.delete({ where: { id: testClientId } });
    await prisma.$disconnect();
  });

  describe('POST /api/patients', () => {
    it('should create a patient with valid data', async () => {
      const patientData = {
        name: 'Rex',
        species: 'dog',
        breed: 'German Shepherd',
        dateOfBirth: '2021-06-15',
        clientId: testClientId,
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toMatchObject({
        name: 'Rex',
        species: 'dog',
        breed: 'German Shepherd',
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '',  // Empty name
        species: 'invalid',  // Invalid species
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/patients')
        .send({ name: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/patients', () => {
    it('should return paginated list of patients', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page');
      expect(response.body.data).toHaveProperty('limit');
      expect(response.body.data).toHaveProperty('totalPages');
    });

    it('should filter patients by species', async () => {
      const response = await request(app)
        .get('/api/patients?species=dog')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toBeInstanceOf(Array);
      response.body.data.items.forEach((patient: any) => {
        expect(patient.species).toBe('dog');
      });
    });
  });

  describe('GET /api/patients/:id', () => {
    let patientId: string;

    beforeEach(async () => {
      const patient = await prisma.patient.create({
        data: {
          name: 'Test Patient',
          species: 'cat',
          breed: 'Persian',
          dateOfBirth: new Date('2022-01-01'),
          clientId: testClientId,
        }
      });
      patientId = patient.id;
    });

    afterEach(async () => {
      await prisma.patient.delete({ where: { id: patientId } });
    });

    it('should return patient by id', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/patients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('not found');
    });
  });
});
```

### 3. End-to-End Workflow Test

```typescript
// backend/tests/e2e/appointment-workflow.e2e.test.ts

describe('Appointment Booking Workflow (E2E)', () => {
  it('should complete full appointment booking process', async () => {
    // 1. Create client
    const clientResponse = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(clientData)
      .expect(201);
    
    const clientId = clientResponse.body.data.id;

    // 2. Create patient
    const patientResponse = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ...patientData, clientId })
      .expect(201);
    
    const patientId = patientResponse.body.data.id;

    // 3. Check available time slots
    const slotsResponse = await request(app)
      .get('/api/appointments/available-slots?date=2025-11-01')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(slotsResponse.body.data.length).toBeGreaterThan(0);
    const timeSlot = slotsResponse.body.data[0];

    // 4. Book appointment
    const appointmentResponse = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        patientId,
        clientId,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        type: 'checkup',
        notes: 'Annual checkup'
      })
      .expect(201);
    
    const appointmentId = appointmentResponse.body.data.id;

    // 5. Verify appointment created
    const verifyResponse = await request(app)
      .get(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(verifyResponse.body.data.status).toBe('scheduled');

    // 6. Cancel appointment
    await request(app)
      .patch(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'cancelled' })
      .expect(200);

    // Cleanup
    await prisma.appointment.delete({ where: { id: appointmentId } });
    await prisma.patient.delete({ where: { id: patientId } });
    await prisma.client.delete({ where: { id: clientId } });
  });
});
```

## Implementation Checklist

### Phase 1: Test Infrastructure Setup
- [ ] Create integration test directory structure
- [ ] Set up test database configuration
- [ ] Create test data factories
- [ ] Set up test utilities and helpers
- [ ] Configure supertest for API testing

### Phase 2: Database Integration Tests
- [ ] Patient service integration tests
- [ ] Appointment service integration tests
- [ ] Medical records service integration tests
- [ ] Billing service integration tests
- [ ] Inventory service integration tests
- [ ] All 30+ services covered

### Phase 3: API Integration Tests
- [ ] Authentication endpoints
- [ ] Patient API endpoints
- [ ] Appointment API endpoints
- [ ] All CRUD operations for all resources
- [ ] Error scenarios

### Phase 4: Service Integration Tests
- [ ] Cross-service interactions
- [ ] Transaction handling
- [ ] Error propagation
- [ ] Data consistency

### Phase 5: End-to-End Workflow Tests
- [ ] Patient registration workflow
- [ ] Appointment booking workflow
- [ ] Medical record creation workflow
- [ ] Billing and payment workflow
- [ ] Inventory management workflow

### Phase 6: Test Execution and Reporting
- [ ] Run all integration tests
- [ ] Generate test reports
- [ ] Document test coverage
- [ ] Fix failing tests
- [ ] Validate all critical paths

## Test Configuration

### Jest Configuration for Integration Tests

```javascript
// jest.integration.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/*.integration.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage/integration',
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  testTimeout: 30000,  // 30 seconds for integration tests
};
```

### Test Database Setup

```typescript
// tests/integration/setup.ts

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST
    }
  }
});

beforeAll(async () => {
  // Reset database schema
  execSync('npx prisma migrate reset --force --skip-seed', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST }
  });

  // Apply migrations
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST }
  });

  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
```

## Validation Criteria

### Success Metrics
- ✅ All critical workflows tested end-to-end
- ✅ All service integrations tested
- ✅ All API endpoints tested
- ✅ Database transactions validated
- ✅ Error scenarios covered

### Quality Gates
1. Integration tests pass: 100%
2. Critical workflow coverage: 100%
3. Service integration coverage: ≥ 80%
4. API endpoint coverage: ≥ 90%
5. Test execution time: < 5 minutes

## Test Categories

### 1. Database Integration (Priority: HIGH)
- CRUD operations for all models
- Referential integrity
- Constraint validation
- Transaction handling

### 2. Service Integration (Priority: HIGH)
- Service method execution
- Business logic validation
- Error handling
- Data transformation

### 3. API Integration (Priority: HIGH)
- HTTP request/response cycle
- Authentication/authorization
- Middleware chain
- Error responses

### 4. End-to-End Workflows (Priority: MEDIUM)
- Patient registration
- Appointment scheduling
- Medical record management
- Billing processes

### 5. External Integration (Priority: LOW)
- Email service
- SMS service
- File storage
- Third-party APIs

## SOA Alignment

### Service Integration Testing
- Test each service independently
- Test service interactions
- Validate service contracts
- Test error handling between services

### Microservice Patterns
- Test service isolation
- Test service communication
- Test data consistency
- Test fault tolerance

## Integration Points

**Works with:**
- Service Layer Validator (validates service behavior)
- API Contract Reviewer (validates API contracts)
- Test Coverage Specialist (ensures comprehensive testing)

## References

- `backend/tests/integration/` - Integration test directory
- `jest.integration.config.js` - Integration test configuration
- `docs/CODE_REVIEW_REPORT.md` - Recommendation 7

---

**Agent Version**: 1.0  
**Last Updated**: 2025-10-23  
**Status**: Active  
**Maintained By**: Development Team
