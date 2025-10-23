/**
 * WF-COMP-XXX | setupTests.ts - setup Tests
 * Purpose: Test suite for setupTests.ts
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .ts
 */

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
