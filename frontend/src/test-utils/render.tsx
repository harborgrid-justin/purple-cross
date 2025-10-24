/**
 * WF-COMP-XXX | render.tsx - Custom Test Render Function
 * Purpose: Custom render with all providers for testing (React Query only, no Redux)
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Options for customizing the render function
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial route for MemoryRouter
   */
  initialRoute?: string;

  /**
   * Initial route entries for MemoryRouter (for more complex routing scenarios)
   */
  initialEntries?: string[];

  /**
   * Whether to use MemoryRouter (default) or BrowserRouter
   * MemoryRouter is better for tests as it doesn't affect browser history
   */
  useMemoryRouter?: boolean;

  /**
   * Custom QueryClient for specific test scenarios
   */
  queryClient?: QueryClient;
}

/**
 * Create a test QueryClient with optimized settings for tests
 */
export const createTestQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: Infinity, // Keep data in cache for entire test
        staleTime: Infinity, // Data never becomes stale in tests
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
};

/**
 * Custom render function that wraps components with all necessary providers
 *
 * @example
 * ```tsx
 * // Basic usage
 * render(<MyComponent />);
 *
 * // With initial route
 * render(<MyComponent />, {
 *   initialRoute: '/patients/123'
 * });
 *
 * // With custom QueryClient
 * render(<MyComponent />, {
 *   queryClient: customQueryClient
 * });
 * ```
 */
export const customRender = (
  ui: ReactElement,
  {
    initialRoute = '/',
    initialEntries = [initialRoute],
    useMemoryRouter = true,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
  const routerProps = useMemoryRouter ? { initialEntries, initialIndex: 0 } : {};

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Router {...routerProps}>{children}</Router>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

/**
 * Simple render without router (for components that don't use routing)
 */
export const renderWithoutRouter = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: Omit<CustomRenderOptions, 'initialRoute' | 'initialEntries' | 'useMemoryRouter'> = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

/**
 * Render with only QueryClient (alias for renderWithoutRouter)
 * Useful for simple API-dependent components
 */
export const renderWithQueryClient = renderWithoutRouter;

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the default render with our custom one
export { customRender as render };
