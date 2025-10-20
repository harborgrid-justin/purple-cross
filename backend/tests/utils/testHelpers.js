'use strict';
/**
 * Test Helper Utilities
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.TestDataGenerator = void 0;
class TestDataGenerator {
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
exports.TestDataGenerator = TestDataGenerator;
//# sourceMappingURL=testHelpers.js.map
