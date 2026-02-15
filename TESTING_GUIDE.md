
# Purple Cross - Comprehensive Testing Guide

Complete guide for testing the Purple Cross application with Vitest, Playwright, and Cypress.

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Running Tests](#running-tests)
4. [Unit Testing with Vitest](#unit-testing-with-vitest)
5. [E2E Testing with Playwright](#e2e-testing-with-playwright)
6. [E2E Testing with Cypress](#e2e-testing-with-cypress)
7. [Test Coverage](#test-coverage)
8. [Best Practices](#best-practices)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Purple Cross uses a comprehensive testing strategy following the testing pyramid:

```
        /\
       /E2E\         10% - End-to-End Tests (Playwright, Cypress)
      /------\
     /  INT   \      20% - Integration Tests (Vitest + MSW)
    /----------\
   /    UNIT    \    70% - Unit Tests (Vitest)
  /--------------\
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: 70%+ coverage for API integration
- **E2E Tests**: Critical user journeys (login, CRUD operations)

---

## Testing Stack

### Unit & Integration Testing

- **Vitest**: Fast unit test runner (Vite-native)
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/jest-dom**: Custom matchers

### E2E Testing

- **Playwright**: Modern cross-browser E2E testing
- **Cypress**: Alternative E2E testing framework
- **Page Object Model**: Maintainable E2E tests

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

---

## Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run all tests from root
npm run test

# Run specific test suites
npm run test:frontend
npm run test:backend

# Run E2E tests
npm run test:e2e          # Cypress headless
npm run test:e2e:open     # Cypress interactive
npx playwright test       # Playwright headless
npx playwright test --ui  # Playwright UI mode
```

### Frontend Tests

```bash
cd frontend

# Unit tests
npm test                    # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
npm run test:ui            # Vitest UI

# E2E tests (Playwright)
npx playwright test                     # All tests
npx playwright test auth.spec.ts        # Specific file
npx playwright test --ui                # UI mode
npx playwright test --debug             # Debug mode
npx playwright show-report             # View report

# E2E tests (Cypress)
npm run test:e2e                       # Headless
npm run test:e2e:open                  # Interactive
npx cypress run --spec "cypress/e2e/patients.cy.ts"
```

### Backend Tests

```bash
cd backend

# Unit tests
npm test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## Unit Testing with Vitest

### Configuration

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts'],
    },
  },
});
```

### Writing Unit Tests

**Example: Component Test**

```typescript
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Example: Hook Test**

```typescript
// src/__tests__/hooks/usePatients.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients } from '@/hooks/usePatients';
import { mockPatients } from '@/test-utils/fixtures';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('usePatients', () => {
  it('fetches patients successfully', async () => {
    const { result } = renderHook(() => usePatients(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPatients);
  });

  it('handles errors', async () => {
    // Mock API error response
    const { result } = renderHook(() => usePatients(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

### Test Utilities

**Custom Render Function:**

```typescript
// src/test-utils/render.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

### API Mocking with MSW

**Setup MSW Handlers:**

```typescript
// src/test-utils/mocks/handlers.ts
import { rest } from 'msw';
import { mockPatients, mockApiResponse } from '../fixtures';

export const handlers = [
  rest.get('/api/patients', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockApiResponse(mockPatients)));
  }),

  rest.post('/api/patients', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(201), ctx.json(mockApiResponse(body)));
  }),

  rest.get('/api/patients/:id', (req, res, ctx) => {
    const { id } = req.params;
    const patient = mockPatients.find((p) => p.id === id);

    if (!patient) {
      return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    }

    return res(ctx.status(200), ctx.json(mockApiResponse(patient)));
  }),
];
```

---

## E2E Testing with Playwright

### Configuration

**playwright.config.ts:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Writing E2E Tests

**Example: Authentication Flow**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify user menu is visible
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await loginPage.expectError(/Invalid credentials/i);
  });
});
```

**Page Object Model:**

```typescript
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string | RegExp) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Running Playwright Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test auth.spec.ts

# Run in UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium

# Generate report
npx playwright show-report
```

---

## E2E Testing with Cypress

### Configuration

**cypress.config.ts:**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

### Writing Cypress Tests

**Example: Patient CRUD**

```typescript
// cypress/e2e/patients.cy.ts
describe('Patient Management', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('test@example.com', 'password123');
  });

  it('should display patient list', () => {
    cy.visit('/patients');
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('should create new patient', () => {
    cy.visit('/patients/new');

    cy.get('[name="name"]').type('Buddy');
    cy.get('[name="species"]').select('Dog');
    cy.get('[name="breed"]').type('Golden Retriever');
    cy.get('[name="weight"]').type('30');

    cy.get('button[type="submit"]').click();

    cy.url().should('match', /\/patients\/[a-z0-9-]+$/);
    cy.contains('Buddy').should('be.visible');
  });

  it('should search for patients', () => {
    cy.visit('/patients');

    cy.get('[type="search"]').type('Buddy');
    cy.get('tbody tr').should('have.length', 1);
    cy.contains('Buddy').should('be.visible');
  });
});
```

**Custom Commands:**

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});
```

---

## Test Coverage

### Generating Coverage Reports

```bash
# Frontend
cd frontend
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Thresholds

**vitest.config.ts:**

```typescript
export default defineConfig({
  test: {
    coverage: {
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80,
    },
  },
});
```

### CI/CD Coverage Upload

```bash
# Upload to Codecov
npm install -D codecov
npx codecov
```

---

## Best Practices

### Unit Tests

✅ **DO:**

- Test user behavior, not implementation
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Keep tests isolated and independent

❌ **DON'T:**

- Test implementation details
- Rely on global state
- Use `getByTestId` as primary selector
- Write brittle tests
- Test library code

### E2E Tests

✅ **DO:**

- Use Page Object Model
- Test critical user journeys
- Use accessible selectors (role, label)
- Clean up test data
- Use retry mechanisms

❌ **DON'T:**

- Test every edge case
- Create flaky tests
- Couple tests together
- Hard-code wait times
- Ignore test failures

### Code Coverage

✅ **DO:**

- Aim for 80%+ coverage
- Focus on critical paths
- Test edge cases and error states
- Use coverage as a guide, not a goal

❌ **DON'T:**

- Chase 100% coverage
- Write tests just for coverage
- Ignore uncovered critical code

---

## CI/CD Integration

Tests run automatically on:

- Every push to `main` and `develop`
- Every pull request
- Scheduled nightly runs

### GitHub Actions Workflow

See `.github/workflows/frontend-ci.yml` for complete configuration.

**Key Steps:**

1. Lint and format check
2. TypeScript type check
3. Unit tests with coverage
4. E2E tests (Playwright & Cypress)
5. Build verification
6. Lighthouse performance audit

---

## Troubleshooting

### Common Issues

**Problem: Tests timing out**

```typescript
// Increase timeout
test('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

**Problem: Flaky E2E tests**

```typescript
// Use waitFor instead of fixed waits
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Playwright auto-waiting
await page.locator('button').click(); // Waits automatically
```

**Problem: Test isolation issues**

```typescript
// Clean up after each test
afterEach(() => {
  cleanup();
  queryClient.clear();
  localStorage.clear();
});
```

**Problem: MSW handlers not working**

```bash
# Verify MSW setup
1. Check setupTests.ts imports server
2. Verify handlers are registered
3. Check network tab in browser DevTools
```

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Cypress Documentation](https://docs.cypress.io)
- [MSW Documentation](https://mswjs.io)

---

**Last Updated:** 2024-02-15
