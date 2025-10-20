# Complete Constants Migration Guide

## Overview

This guide provides a systematic approach to centralize ALL constants, variables, URLs, and static elements across the Purple Cross application.

## Phase 1: Already Completed ✓

### Files Created

- `backend/src/constants/index.ts` - Backend constants
- `frontend/src/constants/index.ts` - Frontend constants
- `backend/src/utils/refactor-helper.ts` - Helper utilities for using constants

### Files Refactored

- `backend/src/config/env.ts`
- `backend/src/middleware/rate-limiter.ts`
- `backend/src/middleware/timeout.ts`
- `backend/src/app.ts`
- `backend/src/services/patient.service.ts`
- `backend/src/services/appointment.service.ts`
- `backend/src/services/client.service.ts`
- `frontend/src/services/api.ts`

## Phase 2: Remaining Files to Refactor

### Backend Services (23 files remaining)

**Pattern to Follow:**

```typescript
// OLD
import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';

async getById(id: string) {
  const entity = await prisma.entity.findUnique({ where: { id } });
  if (!entity) {
    throw new AppError('Entity not found', 404);
  }
  return entity;
}

async getAll(options: { page?: number; limit?: number }) {
  const { page = 1, limit = 20 } = options;
  // ...
  orderBy: { createdAt: 'desc' }
  take: 10
}

// NEW
import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS } from '../constants';

async getById(id: string) {
  const entity = await prisma.entity.findUnique({ where: { id } });
  if (!entity) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND('Entity'), HTTP_STATUS.NOT_FOUND);
  }
  return entity;
}

async getAll(options: { page?: number; limit?: number }) {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
  // ...
  orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }
  take: QUERY_LIMITS.RECENT_ITEMS
}
```

**Files to Refactor:**

1. ✓ `services/patient.service.ts` - DONE
2. ✓ `services/appointment.service.ts` - DONE
3. ✓ `services/client.service.ts` - DONE
4. `services/medical-record.service.ts`
5. `services/prescription.service.ts`
6. `services/inventory.service.ts`
7. `services/invoice.service.ts`
8. `services/lab-test.service.ts`
9. `services/staff.service.ts`
10. `services/communication.service.ts`
11. `services/document.service.ts`
12. `services/analytics.service.ts`
13. `services/breed-info.service.ts`
14. `services/patient-relationship.service.ts`
15. `services/patient-reminder.service.ts`
16. `services/client-portal.service.ts`
17. `services/loyalty-program.service.ts`
18. `services/feedback.service.ts`
19. `services/waitlist.service.ts`
20. `services/time-block.service.ts`
21. `services/estimate.service.ts`
22. `services/payment-plan.service.ts`
23. `services/purchase-order.service.ts`
24. `services/equipment.service.ts`
25. `services/insurance-claim.service.ts`
26. `services/refund.service.ts`
27. `services/marketing-campaign.service.ts`
28. `services/policy.service.ts`
29. `services/report-template.service.ts`
30. `services/document-template.service.ts`

### Backend Controllers (30 files)

**Pattern to Follow:**

```typescript
// OLD
import { Request, Response } from 'express';

async create(req: Request, res: Response) {
  const entity = await service.create(req.body);
  res.status(201).json({ status: 'success', data: entity });
}

async getById(req: Request, res: Response) {
  const entity = await service.getById(req.params.id);
  res.status(200).json({ status: 'success', data: entity });
}

async delete(req: Request, res: Response) {
  await service.delete(req.params.id);
  res.status(204).send();
}

// NEW
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';

async create(req: Request, res: Response) {
  const entity = await service.create(req.body);
  res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: entity });
}

async getById(req: Request, res: Response) {
  const entity = await service.getById(req.params.id);
  res.status(HTTP_STATUS.OK).json({ status: 'success', data: entity });
}

async delete(req: Request, res: Response) {
  await service.delete(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).send();
}
```

**OR use the helper:**

```typescript
import { Request, Response } from 'express';
import { ControllerHelper } from '../utils/refactor-helper';

async create(req: Request, res: Response) {
  const entity = await service.create(req.body);
  ControllerHelper.created(res, entity);
}

async getById(req: Request, res: Response) {
  const entity = await service.getById(req.params.id);
  ControllerHelper.success(res, entity);
}

async delete(req: Request, res: Response) {
  await service.delete(req.params.id);
  ControllerHelper.noContent(res);
}
```

**Files to Refactor:**

1. `controllers/patient.controller.ts`
2. `controllers/client.controller.ts`
3. `controllers/appointment.controller.ts`
4. `controllers/medical-record.controller.ts`
5. `controllers/prescription.controller.ts`
6. `controllers/inventory.controller.ts`
7. `controllers/invoice.controller.ts`
8. `controllers/lab-test.controller.ts`
9. `controllers/staff.controller.ts`
10. `controllers/communication.controller.ts`
11. `controllers/document.controller.ts`
12. `controllers/analytics.controller.ts`
13. `controllers/breed-info.controller.ts`
14. `controllers/patient-relationship.controller.ts`
15. `controllers/patient-reminder.controller.ts`
16. `controllers/client-portal.controller.ts`
17. `controllers/loyalty-program.controller.ts`
18. `controllers/feedback.controller.ts`
19. `controllers/waitlist.controller.ts`
20. `controllers/time-block.controller.ts`
21. `controllers/estimate.controller.ts`
22. `controllers/payment-plan.controller.ts`
23. `controllers/purchase-order.controller.ts`
24. `controllers/equipment.controller.ts`
25. `controllers/insurance-claim.controller.ts`
26. `controllers/refund.controller.ts`
27. `controllers/marketing-campaign.controller.ts`
28. `controllers/policy.controller.ts`
29. `controllers/report-template.controller.ts`
30. `controllers/document-template.controller.ts`

### Frontend Components (Scan needed)

1. Check all React components for hardcoded values
2. Look for inline status checks, magic numbers
3. Centralize UI constants (colors, sizes, etc.)

## Search & Replace Patterns

### Services - Find & Replace in VS Code

1. **Status Code 404:**
   - Find: `throw new AppError\('([^']+) not found', 404\)`
   - Replace: `throw new AppError(ERROR_MESSAGES.NOT_FOUND('$1'), HTTP_STATUS.NOT_FOUND)`

2. **Status Code 400 (Already Exists):**
   - Find: `throw new AppError\('([^']+) already exists', 400\)`
   - Replace: `throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('$1'), HTTP_STATUS.BAD_REQUEST)`

3. **Pagination Defaults:**
   - Find: `page = 1, limit = 20`
   - Replace: `page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT`

4. **Query Mode Insensitive:**
   - Find: `mode: 'insensitive'`
   - Replace: `mode: QUERY_MODE.INSENSITIVE`

5. **Order By Created At Desc:**
   - Find: `orderBy: \{ createdAt: 'desc' \}`
   - Replace: `orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }`

6. **Order By Visit Date Desc:**
   - Find: `orderBy: \{ visitDate: 'desc' \}`
   - Replace: `orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }`

7. **Order By Start Time Desc:**
   - Find: `orderBy: \{ startTime: 'desc' \}`
   - Replace: `orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }`

8. **Order By Name Asc:**
   - Find: `orderBy: \{ name: 'asc' \}`
   - Replace: `orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }`

9. **Take 10:**
   - Find: `take: 10`
   - Replace: `take: QUERY_LIMITS.RECENT_ITEMS`

10. **Take 5:**
    - Find: `take: 5`
    - Replace: `take: QUERY_LIMITS.APPOINTMENTS`

### Controllers - Find & Replace

1. **Status 201:**
   - Find: `res.status\(201\)`
   - Replace: `res.status(HTTP_STATUS.CREATED)`

2. **Status 200:**
   - Find: `res.status\(200\)`
   - Replace: `res.status(HTTP_STATUS.OK)`

3. **Status 204:**
   - Find: `res.status\(204\)`
   - Replace: `res.status(HTTP_STATUS.NO_CONTENT)`

4. **Status 400:**
   - Find: `res.status\(400\)`
   - Replace: `res.status(HTTP_STATUS.BAD_REQUEST)`

5. **Status 404:**
   - Find: `res.status\(404\)`
   - Replace: `res.status(HTTP_STATUS.NOT_FOUND)`

### Add Imports

After replacing, add this import at the top of each file:

**For Services:**

```typescript
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  QUERY_MODE,
  SORT_ORDER,
  FIELDS,
  QUERY_LIMITS,
  STATUS,
} from '../constants';
```

**For Controllers:**

```typescript
import { HTTP_STATUS } from '../constants';
```

## Manual Refactoring Checklist

For each service file:

- [ ] Add constants import
- [ ] Replace all `404` errors with `HTTP_STATUS.NOT_FOUND` and `ERROR_MESSAGES.NOT_FOUND()`
- [ ] Replace all `400` errors with `HTTP_STATUS.BAD_REQUEST` and `ERROR_MESSAGES.ALREADY_EXISTS()`
- [ ] Replace `page = 1, limit = 20` with `PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_LIMIT`
- [ ] Replace `mode: 'insensitive'` with `QUERY_MODE.INSENSITIVE`
- [ ] Replace `orderBy: { createdAt: 'desc' }` with `{ [FIELDS.CREATED_AT]: SORT_ORDER.DESC }`
- [ ] Replace `orderBy: { visitDate: 'desc' }` with `{ [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }`
- [ ] Replace `orderBy: { startTime: 'desc' }` with `{ [FIELDS.START_TIME]: SORT_ORDER.DESC }`
- [ ] Replace `orderBy: { name: 'asc' }` with `{ [FIELDS.NAME]: SORT_ORDER.ASC }`
- [ ] Replace `take: 10` with `QUERY_LIMITS.RECENT_ITEMS`
- [ ] Replace `take: 5` with `QUERY_LIMITS.APPOINTMENTS`
- [ ] Replace any hardcoded status strings with `STATUS.*` constants
- [ ] Run type check: `npm run typecheck`

For each controller file:

- [ ] Add HTTP_STATUS import
- [ ] Replace `res.status(201)` with `HTTP_STATUS.CREATED`
- [ ] Replace `res.status(200)` with `HTTP_STATUS.OK`
- [ ] Replace `res.status(204)` with `HTTP_STATUS.NO_CONTENT`
- [ ] Replace `res.status(400)` with `HTTP_STATUS.BAD_REQUEST`
- [ ] Replace `res.status(404)` with `HTTP_STATUS.NOT_FOUND`
- [ ] Run type check: `npm run typecheck`

## Automated Refactoring (Optional)

A Node.js script has been created at `scripts/refactor-constants.js` (requires `glob` package):

```bash
npm install -g glob
node scripts/refactor-constants.js
```

This will automatically refactor common patterns across all services and controllers.

## Verification Steps

After refactoring each file or batch:

1. **Type Check:**

   ```bash
   cd backend
   npm run typecheck
   ```

2. **Lint:**

   ```bash
   npm run lint
   ```

3. **Run Tests:**

   ```bash
   npm test
   ```

4. **Manual Review:**
   - Check that all constants are imported correctly
   - Verify no hardcoded values remain
   - Ensure error messages are using the correct entity names

## Additional Constants to Add

### Backend Constants

Add to `backend/src/constants/index.ts` as needed:

```typescript
// Response Status Strings
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAIL: 'fail',
} as const;

// Common Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID: (field: string) => `${field} is invalid`,
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must be at most ${max} characters`,
} as const;

// Email Templates
export const EMAIL_TEMPLATES = {
  APPOINTMENT_CONFIRMATION: 'appointment_confirmation',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  INVOICE: 'invoice',
  PRESCRIPTION_READY: 'prescription_ready',
} as const;

// File Types
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
  DOCUMENT: ['pdf', 'doc', 'docx'],
  SPREADSHEET: ['xls', 'xlsx', 'csv'],
} as const;
```

### Frontend Constants

Add to `frontend/src/constants/index.ts` as needed:

```typescript
// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 250,
  HEADER_HEIGHT: 64,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
} as const;

// Colors (if not using CSS variables)
export const COLORS = {
  PRIMARY: '#6366F1',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
} as const;

// Table/List Configuration
export const TABLE = {
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_PAGE_SIZE: 20,
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
} as const;
```

## Progress Tracking

### Backend Services

- [x] patient.service.ts
- [x] appointment.service.ts
- [x] client.service.ts
- [ ] medical-record.service.ts
- [ ] prescription.service.ts
- [ ] inventory.service.ts
- [ ] invoice.service.ts
- [ ] lab-test.service.ts
- [ ] staff.service.ts
- [ ] communication.service.ts
- [ ] document.service.ts
- [ ] analytics.service.ts
- [ ] breed-info.service.ts
- [ ] patient-relationship.service.ts
- [ ] patient-reminder.service.ts
- [ ] client-portal.service.ts
- [ ] loyalty-program.service.ts
- [ ] feedback.service.ts
- [ ] waitlist.service.ts
- [ ] time-block.service.ts
- [ ] estimate.service.ts
- [ ] payment-plan.service.ts
- [ ] purchase-order.service.ts
- [ ] equipment.service.ts
- [ ] insurance-claim.service.ts
- [ ] refund.service.ts
- [ ] marketing-campaign.service.ts
- [ ] policy.service.ts
- [ ] report-template.service.ts
- [ ] document-template.service.ts

### Backend Controllers

- [ ] All 30 controller files (see list above)

### Frontend

- [x] services/api.ts
- [ ] All components (scan needed)
- [ ] All pages (scan needed)
- [ ] All hooks (scan needed)

## Final Steps

1. **Complete all refactoring** using this guide
2. **Run full test suite**: `npm test` in both backend and frontend
3. **Verify type checking**: `npm run typecheck` in both
4. **Update documentation**: Add any new constants to `docs/CONSTANTS.md`
5. **Create PR** with comprehensive changelist
6. **Code review** to ensure all constants are properly centralized

## Benefits Achieved

✓ **Maintainability**: Single source of truth for all values
✓ **Type Safety**: TypeScript autocomplete and checking
✓ **Consistency**: Same values used everywhere
✓ **Discoverability**: Easy to find available constants
✓ **Refactoring**: Change once, apply everywhere
✓ **Testing**: Easy to mock and override values
✓ **Documentation**: Self-documenting code

---

**Note**: This is a comprehensive migration. Consider doing it in batches:

- Batch 1: Core services (patient, client, appointment, medical-record, invoice)
- Batch 2: Extended services
- Batch 3: All controllers
- Batch 4: Frontend components
