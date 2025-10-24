/**
 * WF-COMP-XXX | setupTests.ts - Test Setup Configuration
 * Purpose: Global test setup for Vitest and React Testing Library
 * Dependencies: @testing-library/react, @testing-library/jest-dom, vitest, msw
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from './test-utils/mocks/server';

// Setup MSW server
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});

// Mock window.matchMedia (used by many UI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (used by lazy loading components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver (used by responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// Extend Vitest's expect with custom matchers if needed
expect.extend({
  toHaveBeenCalledOnceWith(received: any, ...expected: any[]) {
    const pass = received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(expected);

    return {
      pass,
      message: () =>
        pass
          ? `Expected function not to be called once with ${JSON.stringify(expected)}`
          : `Expected function to be called once with ${JSON.stringify(expected)}, but it was called ${received.mock.calls.length} times`,
    };
  },
});
