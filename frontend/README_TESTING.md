# Frontend Testing - Quick Reference

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npm run install:playwright

# Run all unit tests
npm test

# Run E2E tests
npm run test:playwright          # Playwright (recommended)
npm run test:e2e                 # Cypress
```

## Test Commands

### Unit & Integration Tests (Vitest)

```bash
npm test                    # Run once
npm run test:watch         # Watch mode
npm run test:ui            # Interactive UI
npm run test:coverage      # With coverage report
```

### E2E Tests (Playwright)

```bash
npm run test:playwright              # Run all tests
npm run test:playwright:ui           # Interactive UI mode
npm run test:playwright:debug        # Debug mode
npm run test:playwright:report       # View HTML report

# Run specific tests
npx playwright test auth.spec.ts
npx playwright test --grep "login"

# Run specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### E2E Tests (Cypress)

```bash
npm run test:e2e                    # Headless mode
npm run test:e2e:open               # Interactive mode

# Run specific spec
npx cypress run --spec "cypress/e2e/patients.cy.ts"
```

## Test Structure

```
frontend/
├── src/
│   ├── __tests__/                  # Unit tests
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── test-utils/                 # Test utilities
│       ├── render.tsx              # Custom render with providers
│       ├── fixtures.ts             # Mock data
│       └── mocks/
│           ├── server.ts           # MSW server
│           └── handlers.ts         # API handlers
├── tests/                          # Playwright E2E tests
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   └── patients.spec.ts
│   ├── pages/                      # Page Object Models
│   │   ├── LoginPage.ts
│   │   └── PatientListPage.ts
│   └── utils/
│       └── test-helpers.ts
└── cypress/                        # Cypress E2E tests
    ├── e2e/
    ├── fixtures/
    └── support/
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils/render';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders and handles click', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Playwright E2E Test Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');

  await expect(page).toHaveURL(/\/dashboard/);
});
```

### Cypress E2E Test Example

```typescript
describe('Patient Management', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password');
  });

  it('creates a new patient', () => {
    cy.visit('/patients/new');
    cy.get('[name="name"]').type('Buddy');
    cy.get('[name="species"]').select('Dog');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/patients/');
    cy.contains('Buddy').should('be.visible');
  });
});
```

## Test Utilities

### Custom Render

```typescript
import { render } from '@/test-utils/render';

// Automatically wraps with QueryClient and Router
render(<MyComponent />);
```

### Mock Data

```typescript
import { mockPatient, mockPatients } from '@/test-utils/fixtures';

// Use in tests
expect(data).toEqual(mockPatient);
```

### API Mocking (MSW)

```typescript
import { server } from '@/test-utils/mocks/server';
import { rest } from 'msw';

// Override handler for specific test
server.use(
  rest.get('/api/patients', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Server error' }));
  })
);
```

## Coverage

### View Coverage Report

```bash
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Thresholds

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Debugging

### Vitest Debugging

```bash
# Run with UI
npm run test:ui

# Run specific test
npm test -- PatientForm.test.tsx

# Debug in VS Code
# Add breakpoint and use "Debug: JavaScript Debug Terminal"
```

### Playwright Debugging

```bash
# Debug mode (opens inspector)
npm run test:playwright:debug

# Debug specific test
npx playwright test --debug auth.spec.ts

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slow-mo=1000
```

### Cypress Debugging

```bash
# Interactive mode
npm run test:e2e:open

# Debug logs
Cypress.log({ message: 'Custom log' });

# Pause execution
cy.pause();
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Scheduled nightly builds

See `.github/workflows/frontend-ci.yml` for full configuration.

## Best Practices

### Unit Tests

- Test user behavior, not implementation
- Use accessible queries (`getByRole`, `getByLabelText`)
- Keep tests independent
- Mock external dependencies
- Use descriptive test names

### E2E Tests

- Use Page Object Model
- Test critical user paths
- Clean up test data
- Avoid hard-coded waits
- Use data attributes for test selectors

### General

- Write tests before or alongside features
- Maintain test coverage above 70%
- Fix flaky tests immediately
- Review test output in CI
- Update tests when refactoring

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout
test('slow test', async () => {
  // ...
}, 10000); // 10 seconds
```

### Flaky Tests

```typescript
// Use waitFor instead of fixed delays
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### MSW Not Working

```bash
# Verify setup
1. Check src/setupTests.ts imports server
2. Verify handlers are registered
3. Check browser console for MSW messages
```

## Resources

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev)
- [Cypress Docs](https://docs.cypress.io)
- [MSW Docs](https://mswjs.io)

## Support

- Full guide: See `/TESTING_GUIDE.md`
- Issues: Create GitHub issue
- Questions: Ask in team chat
