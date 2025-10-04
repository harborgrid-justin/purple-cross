import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
});
