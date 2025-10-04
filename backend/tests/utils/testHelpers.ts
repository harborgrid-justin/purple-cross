/**
 * Test Helper Utilities
 */

export class TestDataGenerator {
  static mockPatient(overrides = {}) {
    return {
      id: 'patient-test-123',
      name: 'Test Patient',
      species: 'Dog',
      ...overrides,
    };
  }

  static mockClient(overrides = {}) {
    return {
      id: 'client-test-123',
      firstName: 'John',
      lastName: 'Doe',
      ...overrides,
    };
  }
}
