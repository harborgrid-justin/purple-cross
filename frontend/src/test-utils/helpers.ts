/**
 * WF-COMP-XXX | helpers.ts - Test Helper Functions
 * Purpose: Common utilities for testing
 * Dependencies: @testing-library/react
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Create a user event instance for simulating user interactions
 * This should be called at the beginning of each test
 *
 * @example
 * ```tsx
 * const user = createUser();
 * await user.click(button);
 * await user.type(input, 'text');
 * ```
 */
export const createUser = () => {
  return userEvent.setup();
};

/**
 * Wait for an async operation to complete with custom timeout
 */
export const waitForAsync = async (
  callback: () => void | Promise<void>,
  timeout = 3000
): Promise<void> => {
  await waitFor(callback, { timeout });
};

/**
 * Wait for loading states to complete
 * Useful for components that show loading spinners
 */
export const waitForLoadingToFinish = async (
  getByText: (text: string | RegExp) => HTMLElement,
  timeout = 3000
): Promise<void> => {
  await waitFor(
    () => {
      expect(getByText(/loading/i)).not.toBeInTheDocument();
    },
    { timeout }
  );
};

/**
 * Mock window.scrollTo (not implemented in jsdom)
 */
export const mockScrollTo = (): void => {
  window.scrollTo = vi.fn();
};

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = (): {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
} => {
  const storage: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }),
  };
};

/**
 * Mock sessionStorage for testing
 */
export const mockSessionStorage = mockLocalStorage;

/**
 * Delay execution for a specified time (in milliseconds)
 * Useful for testing loading states or debounced functions
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Create a mock file for file upload testing
 */
export const createMockFile = (
  name: string,
  content: string,
  type: string
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

/**
 * Create a mock image file for image upload testing
 */
export const createMockImageFile = (
  name = 'test-image.png',
  size = 1024
): File => {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type: 'image/png' });
  return new File([blob], name, { type: 'image/png' });
};

/**
 * Assert that an element has a specific class
 */
export const expectToHaveClass = (
  element: HTMLElement,
  className: string
): void => {
  expect(element.classList.contains(className)).toBe(true);
};

/**
 * Assert that an element does not have a specific class
 */
export const expectNotToHaveClass = (
  element: HTMLElement,
  className: string
): void => {
  expect(element.classList.contains(className)).toBe(false);
};

/**
 * Get computed style of an element
 */
export const getComputedStyleValue = (
  element: HTMLElement,
  property: string
): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Simulate a network delay for testing loading states
 */
export const simulateNetworkDelay = async (ms = 500): Promise<void> => {
  await delay(ms);
};

/**
 * Create a spy for console methods (useful for testing error handling)
 */
export const spyOnConsole = (): {
  log: ReturnType<typeof vi.spyOn>;
  warn: ReturnType<typeof vi.spyOn>;
  error: ReturnType<typeof vi.spyOn>;
} => {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  };
};

/**
 * Assert that a function was called with specific arguments
 */
export const expectCalledWith = <T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): void => {
  expect(fn).toHaveBeenCalledWith(...args);
};

/**
 * Wait for a specific number of milliseconds in tests
 * Uses vi.advanceTimersByTime if fake timers are enabled
 */
export const advanceTime = async (ms: number): Promise<void> => {
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(ms);
  } else {
    await delay(ms);
  }
};

/**
 * Type assertion helper for better type inference in tests
 */
export const assertType = <T>(_value: T): void => {
  // Type assertion helper - no runtime behavior
};
