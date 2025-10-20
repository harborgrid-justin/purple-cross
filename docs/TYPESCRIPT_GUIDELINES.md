# TypeScript Guidelines - Purple Cross

## Overview

This document outlines TypeScript best practices and guidelines for the Purple Cross project, ensuring 100% compliance with enterprise TypeScript standards.

## Table of Contents

1. [Type Safety & Strictness](#type-safety--strictness)
2. [Code Organization & Modularity](#code-organization--modularity)
3. [Error Handling & Null Safety](#error-handling--null-safety)
4. [Best Practices](#best-practices)
5. [Documentation & Maintainability](#documentation--maintainability)
6. [Configuration & Tooling](#configuration--tooling)

## Type Safety & Strictness

### 1. Strict Mode Configuration

All TypeScript projects must have strict mode enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. Avoid `any` Type

The `any` type should be avoided except in rare, well-documented cases.

❌ **Bad:**

```typescript
function processData(data: any) {
  return data.value;
}
```

✅ **Good:**

```typescript
interface DataType {
  value: string;
  timestamp: Date;
}

function processData(data: DataType): string {
  return data.value;
}
```

**Exception Cases** (must be documented):

- Working with truly dynamic JSON from external APIs
- Migrating legacy JavaScript code incrementally
- Third-party libraries without type definitions

### 3. Explicit Type Annotations

Always provide explicit type annotations for function parameters and return types.

❌ **Bad:**

```typescript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

✅ **Good:**

```typescript
interface Item {
  price: number;
  name: string;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum: number, item: Item) => sum + item.price, 0);
}
```

### 4. Use Union Types and Type Guards

Prefer union types and type guards over type assertions.

❌ **Bad:**

```typescript
function getUser(id: string) {
  const user = fetchUser(id);
  return user as User;
}
```

✅ **Good:**

```typescript
function getUser(id: string): User | null {
  const user = fetchUser(id);
  return user && isUser(user) ? user : null;
}

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'email' in obj;
}
```

### 5. Define Interfaces for All Object Shapes

Every object shape should have an interface or type definition.

❌ **Bad:**

```typescript
function createAppointment(data: { patientId: string; date: Date; type: string }) {
  // ...
}
```

✅ **Good:**

```typescript
interface AppointmentData {
  patientId: string;
  date: Date;
  type: AppointmentType;
}

type AppointmentType = 'checkup' | 'surgery' | 'emergency';

function createAppointment(data: AppointmentData): Promise<Appointment> {
  // ...
}
```

## Code Organization & Modularity

### 6. Naming Conventions

Follow consistent naming conventions throughout the codebase:

- **Interfaces/Types/Classes**: PascalCase

  ```typescript
  interface PatientRecord {}
  type AppointmentStatus = 'scheduled' | 'completed';
  class PatientService {}
  ```

- **Variables/Functions**: camelCase

  ```typescript
  const patientName = 'Max';
  function calculateDosage(weight: number): number {}
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_RETRY_ATTEMPTS = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

### 7. Export Control

Only export what needs to be public; keep internal implementation details private.

❌ **Bad:**

```typescript
// Everything exported
export function helperFunction() {}
export function anotherHelper() {}
export function publicApi() {}
```

✅ **Good:**

```typescript
// Internal helpers
function helperFunction() {}
function anotherHelper() {}

// Public API
export function publicApi() {
  helperFunction();
  return anotherHelper();
}
```

### 8. Single Responsibility

Organize code into logical modules with clear single responsibilities.

```
services/
  ├── patient.service.ts      # Patient CRUD operations
  ├── appointment.service.ts  # Appointment management
  └── notification.service.ts # Notification handling
```

### 9. Barrel Exports

Use barrel exports (`index.ts`) to simplify imports.

```typescript
// services/index.ts
export { PatientService } from './patient.service';
export { AppointmentService } from './appointment.service';
export { NotificationService } from './notification.service';

// Usage
import { PatientService, AppointmentService } from '@/services';
```

## Error Handling & Null Safety

### 10. Handle Null/Undefined Explicitly

Use optional chaining (`?.`) and nullish coalescing (`??`) operators.

❌ **Bad:**

```typescript
const ownerName = patient && patient.owner && patient.owner.name;
```

✅ **Good:**

```typescript
const ownerName = patient?.owner?.name ?? 'Unknown';
```

### 11. Discriminated Unions

Use discriminated unions for mutually exclusive states.

✅ **Good:**

```typescript
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 'success':
      console.log(response.data);
      break;
    case 'error':
      console.error(response.error);
      break;
    case 'loading':
      console.log('Loading...');
      break;
  }
}
```

### 12. Avoid Non-Null Assertion

Use non-null assertion operator (`!`) only when you have absolute certainty, and document why.

❌ **Bad:**

```typescript
const patient = patients.find((p) => p.id === id)!;
```

✅ **Good:**

```typescript
const patient = patients.find((p) => p.id === id);
if (!patient) {
  throw new AppError('Patient not found', 404);
}
// Now TypeScript knows patient is defined
```

## Best Practices

### 13. Prefer Readonly and Const

Use readonly properties and const assertions for immutability.

✅ **Good:**

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const APPOINTMENT_TYPES = ['checkup', 'surgery', 'emergency'] as const;
type AppointmentType = (typeof APPOINTMENT_TYPES)[number];
```

### 14. String Literal Unions Over Enums

Prefer string literal unions for better type narrowing.

❌ **Acceptable but less flexible:**

```typescript
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
```

✅ **Better:**

```typescript
type Status = 'active' | 'inactive';

// Or with const object for runtime access
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

### 15. Generic Types

Implement generic types for reusable, type-safe utilities.

✅ **Good:**

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Usage with type safety
const patients = await fetchData<Patient[]>('/api/patients');
```

### 16. Utility Types

Use utility types to transform existing types.

✅ **Good:**

```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Create a partial update type
type PatientUpdate = Partial<Omit<Patient, 'id'>>;

// Pick specific fields
type PatientSummary = Pick<Patient, 'id' | 'name'>;

// Make all fields readonly
type ReadonlyPatient = Readonly<Patient>;
```

## Documentation & Maintainability

### 17. JSDoc Comments

Add JSDoc comments for public APIs, complex types, and non-obvious business logic.

✅ **Good:**

````typescript
/**
 * Calculates the appropriate medication dosage for a patient based on weight and species.
 *
 * @param weight - Patient weight in kilograms
 * @param species - Animal species (affects dosage calculation)
 * @param medication - Medication identifier
 * @returns Recommended dosage in milligrams
 * @throws {AppError} When medication is not approved for the species
 *
 * @example
 * ```typescript
 * const dosage = calculateDosage(5.2, 'cat', 'AMOX-500');
 * // Returns: 52 (mg)
 * ```
 */
export function calculateDosage(weight: number, species: Species, medication: string): number {
  // Implementation
}
````

### 18. Keep TypeScript Up to Date

Regularly update TypeScript to leverage the latest features and improvements.

```bash
npm update typescript
```

## Configuration & Tooling

### 19. Path Aliases

Configure path aliases in `tsconfig.json` for cleaner imports.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

Usage:

```typescript
// Instead of: import { PatientService } from '../../../../services/patient.service';
import { PatientService } from '@/services/patient.service';
```

### 20. ESLint with TypeScript

Set up ESLint with TypeScript plugins and enforce consistent code style.

**`.eslintrc.js`:**

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
  },
};
```

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)

## Checklist for Code Review

Use this checklist when reviewing TypeScript code:

- [ ] All functions have explicit return types
- [ ] No use of `any` without documentation justifying it
- [ ] Interfaces/types defined for all object shapes
- [ ] Proper use of union types instead of type assertions
- [ ] Null/undefined handled explicitly
- [ ] Naming conventions followed (PascalCase, camelCase, UPPER_SNAKE_CASE)
- [ ] Public APIs documented with JSDoc
- [ ] No unused variables or parameters
- [ ] Optional chaining (`?.`) used where appropriate
- [ ] Readonly/const used for immutable data
- [ ] Generic types used for reusable components
- [ ] Utility types used instead of duplicating definitions

## Enforcement

These guidelines are enforced through:

1. **TypeScript Compiler** - Strict mode configuration catches type errors
2. **ESLint** - Automated linting enforces style and best practices
3. **Code Review** - Manual review ensures adherence to guidelines
4. **CI/CD Pipeline** - Automated checks prevent non-compliant code from merging

---

_Last Updated: October 2024_
_Version: 1.0.0_
