/**
 * WF-COMP-XXX | server.ts - MSW Server Setup
 * Purpose: Configure Mock Service Worker for Node.js test environment
 * Dependencies: msw
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Create MSW server instance with default handlers
 * This server will intercept HTTP requests during tests
 */
export const server = setupServer(...handlers);

/**
 * Setup MSW server lifecycle hooks
 * Import this in setupTests.ts to enable for all tests
 */
export const setupMockServer = (): void => {
  // Start server before all tests
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  // Reset handlers after each test to ensure test isolation
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests
  afterAll(() => {
    server.close();
  });
};

/**
 * Helper to override handlers for specific tests
 * @example
 * ```ts
 * it('handles error', () => {
 *   server.use(
 *     http.get('/api/patients', () => {
 *       return HttpResponse.error()
 *     })
 *   )
 *   // test error handling
 * })
 * ```
 */
export { server as mockServer };
