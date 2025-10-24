# Purple Cross Frontend Testing - Quick Start Guide

## Quick Commands

```bash
# Run all tests
cd frontend && npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Button.test

# Update snapshots
npm test -- -u

# Watch mode
npm test

# With UI
npm test -- --ui
```

---

## Import Test Utilities

```typescript
import {
  render,                    // Custom render with providers
  renderWithoutRouter,       // Render without router
  screen,                    // Query the DOM
  waitFor,                   // Wait for async operations
  createUser,                // User event setup
  mockPatient,               // Mock data fixtures
  mockData,                  // MSW mock data
  server,                    // MSW server for custom handlers
} from '@/test-utils';
```

---

## Writing a Basic Component Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithoutRouter(<MyComponent />);
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('should handle clicks', async () => {
    const handleClick = vi.fn();
    const user = createUser();
    const { getByRole } = renderWithoutRouter(
      <MyComponent onClick={handleClick} />
    );

    await user.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    const { getByRole } = renderWithoutRouter(<MyComponent />);
    expect(getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Query Priorities (Use in Order)

1. **getByRole** - Most accessible
   ```typescript
   getByRole('button', { name: /submit/i })
   getByRole('heading', { level: 2 })
   getByRole('textbox')
   ```

2. **getByLabelText** - Forms
   ```typescript
   getByLabelText('Email')
   getByLabelText(/password/i)
   ```

3. **getByText** - Content
   ```typescript
   getByText('Hello World')
   getByText(/success/i)
   ```

4. **container.querySelector** - Structure/classes only
   ```typescript
   container.querySelector('.modal-header')
   ```

---

## Testing User Interactions

```typescript
// Setup user events
const user = createUser();

// Typing
await user.type(input, 'Hello');

// Clicking
await user.click(button);

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard(' '); // Space
await user.tab();

// Clear input
await user.clear(input);
```

---

## Testing Async Operations

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Find queries (built-in async)
const element = await screen.findByText('Async Content');

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
```

---

## Mocking API Calls

### Use Default Mocks (Automatic)
```typescript
// MSW is set up globally - just render and test
const { getByText } = render(<PatientList />);
await waitFor(() => {
  expect(getByText('Buddy')).toBeInTheDocument();
});
```

### Override for Specific Test
```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/test-utils';

it('handles errors', async () => {
  server.use(
    http.get('/api/v1/patients', () => {
      return HttpResponse.error();
    })
  );

  const { getByText } = render(<PatientList />);
  await waitFor(() => {
    expect(getByText('Error loading patients')).toBeInTheDocument();
  });
});
```

---

## Testing Accessibility

```typescript
it('should be accessible', () => {
  const { getByRole } = renderWithoutRouter(<Button>Click me</Button>);

  // Check role
  expect(getByRole('button')).toBeInTheDocument();

  // Check aria attributes
  expect(getByRole('button')).toHaveAttribute('aria-label', 'Close');

  // Check keyboard navigation
  await user.tab();
  expect(getByRole('button')).toHaveFocus();
});
```

---

## Common Test Patterns

### 1. Rendering Tests
```typescript
it('should render with props', () => {
  const { getByText } = renderWithoutRouter(
    <Alert type="success">Success message</Alert>
  );
  expect(getByText('Success message')).toBeInTheDocument();
});
```

### 2. Interaction Tests
```typescript
it('should call handler on click', async () => {
  const handleClick = vi.fn();
  const user = createUser();
  const { getByRole } = renderWithoutRouter(
    <Button onClick={handleClick}>Click</Button>
  );

  await user.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. Conditional Rendering
```typescript
it('should show error when error prop is provided', () => {
  const { getByRole } = renderWithoutRouter(
    <Input label="Email" error="Invalid email" />
  );
  expect(getByRole('alert')).toHaveTextContent('Invalid email');
});
```

### 4. Form Testing
```typescript
it('should handle form submission', async () => {
  const handleSubmit = vi.fn();
  const user = createUser();
  const { getByLabelText, getByRole } = renderWithoutRouter(
    <Form onSubmit={handleSubmit} />
  );

  await user.type(getByLabelText('Name'), 'John Doe');
  await user.click(getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

### 5. Snapshot Testing
```typescript
it('should match snapshot', () => {
  const { container } = renderWithoutRouter(<Button>Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});
```

---

## Available Test Helpers

### User Interaction
- `createUser()` - Setup user events
- `waitForAsync()` - Custom timeout waits
- `delay(ms)` - Promise-based delay

### Mocking
- `mockScrollTo()` - Mock window.scrollTo
- `mockLocalStorage()` - Mock localStorage
- `spyOnConsole()` - Spy on console methods

### File Testing
- `createMockFile(name, content, type)` - Mock file
- `createMockImageFile(name, size)` - Mock image

### Assertions
- `expectToHaveClass(element, className)`
- `expectNotToHaveClass(element, className)`
- `getComputedStyleValue(element, property)`

---

## Available Mock Data

```typescript
import {
  mockPatient,
  mockPatients,
  mockClient,
  mockClients,
  mockAppointment,
  mockAppointments,
  mockMedicalRecord,
  mockPrescription,
  mockStaff,
  mockInvoice,
  mockInventoryItem,
  mockLabTest,
  mockDocument,
  mockUser,
} from '@/test-utils';
```

---

## Test File Structure

```typescript
/**
 * ComponentName.test.tsx - Component Tests
 * Purpose: Comprehensive tests for ComponentName
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      // Test rendering
    });
  });

  describe('User Interactions', () => {
    it('should handle clicks', async () => {
      // Test interactions
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      // Test accessibility
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      // Test edge cases
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot', () => {
      // Snapshot tests
    });
  });
});
```

---

## Coverage Report

```bash
npm run test:coverage

# View HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

---

## Best Practices

### ✅ DO
- Test user behavior, not implementation
- Use accessible queries (getByRole)
- Test error states and edge cases
- Keep tests independent
- Use descriptive test names
- Mock external dependencies
- Test accessibility

### ❌ DON'T
- Test implementation details
- Use getByTestId primarily
- Create flaky tests
- Ignore accessibility
- Skip edge cases
- Couple tests together
- Use setTimeout in tests

---

## Example Test Suite (Button)

```typescript
describe('Button Component', () => {
  // Rendering
  it('renders with default props')
  it('renders children correctly')
  it('renders with custom className')

  // Variants
  it('renders primary variant')
  it('renders danger variant')

  // Sizes
  it('renders small size')
  it('renders large size')

  // States
  it('renders loading state')
  it('renders disabled state')

  // Interactions
  it('calls onClick when clicked')
  it('supports keyboard navigation')

  // Accessibility
  it('has proper role')
  it('is keyboard accessible')

  // Edge Cases
  it('handles empty children')
  it('handles very long text')

  // Snapshots
  it('matches snapshot')
});
```

---

## Need Help?

- See full examples in `/frontend/src/components/__tests__/`
- Read detailed report: `/TEST_INFRASTRUCTURE_REPORT.md`
- Check test utilities: `/frontend/src/test-utils/`

---

**Status:** ✅ 266 tests passing | 100% component coverage
