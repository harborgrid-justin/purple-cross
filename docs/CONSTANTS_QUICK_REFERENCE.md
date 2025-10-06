# Constants Quick Reference

Quick lookup for centralized constants in Purple Cross.

## Import Statements

### Backend Services
```typescript
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS, STATUS } from '../constants';
```

### Backend Controllers
```typescript
import { HTTP_STATUS } from '../constants';
```

### Frontend
```typescript
import { API_CONFIG, HTTP_STATUS, STORAGE_KEYS, ROUTES, API_ENDPOINTS, PAGINATION, STATUS } from '../constants';
```

## Common Constants

### HTTP Status Codes
```typescript
HTTP_STATUS.OK                    // 200
HTTP_STATUS.CREATED               // 201
HTTP_STATUS.NO_CONTENT            // 204
HTTP_STATUS.BAD_REQUEST           // 400
HTTP_STATUS.UNAUTHORIZED          // 401
HTTP_STATUS.FORBIDDEN             // 403
HTTP_STATUS.NOT_FOUND             // 404
HTTP_STATUS.CONFLICT              // 409
HTTP_STATUS.REQUEST_TIMEOUT       // 408
HTTP_STATUS.TOO_MANY_REQUESTS     // 429
HTTP_STATUS.INTERNAL_SERVER_ERROR // 500
HTTP_STATUS.SERVICE_UNAVAILABLE   // 503
```

### Error Messages
```typescript
ERROR_MESSAGES.NOT_FOUND('Patient')                    // "Patient not found"
ERROR_MESSAGES.ALREADY_EXISTS('Client')                // "Client already exists"
ERROR_MESSAGES.TIME_SLOT_BOOKED                        // "Time slot already booked"
ERROR_MESSAGES.RATE_LIMIT_EXCEEDED                     // "Too many requests..."
ERROR_MESSAGES.AUTH_RATE_LIMIT_EXCEEDED               // "Too many auth attempts..."
ERROR_MESSAGES.REQUEST_TIMEOUT                         // "Request timeout"
ERROR_MESSAGES.MISSING_ENV_VARS(['DB_URL'])           // "Missing required env vars..."
ERROR_MESSAGES.CIRCUIT_BREAKER_OPEN('ServiceName')    // "Circuit breaker is open..."
```

### Pagination
```typescript
PAGINATION.DEFAULT_PAGE    // 1
PAGINATION.DEFAULT_LIMIT   // 20
PAGINATION.MAX_LIMIT       // 100
PAGINATION.MIN_LIMIT       // 1
```

### Query Limits
```typescript
QUERY_LIMITS.MEDICAL_RECORDS  // 10
QUERY_LIMITS.APPOINTMENTS     // 5
QUERY_LIMITS.INVOICES         // 10
QUERY_LIMITS.RECENT_ITEMS     // 10
QUERY_LIMITS.PATIENTS         // 5
```

### Sort & Query
```typescript
SORT_ORDER.ASC         // 'asc'
SORT_ORDER.DESC        // 'desc'
QUERY_MODE.INSENSITIVE // 'insensitive'
QUERY_MODE.SENSITIVE   // 'sensitive'
```

### Field Names
```typescript
FIELDS.ID            // 'id'
FIELDS.CREATED_AT    // 'createdAt'
FIELDS.UPDATED_AT    // 'updatedAt'
FIELDS.START_TIME    // 'startTime'
FIELDS.VISIT_DATE    // 'visitDate'
FIELDS.INVOICE_DATE  // 'invoiceDate'
FIELDS.NAME          // 'name'
FIELDS.STATUS        // 'status'
```

### Status Values
```typescript
STATUS.ACTIVE       // 'active'
STATUS.INACTIVE     // 'inactive'
STATUS.PENDING      // 'pending'
STATUS.COMPLETED    // 'completed'
STATUS.CANCELLED    // 'cancelled'
STATUS.SCHEDULED    // 'scheduled'
STATUS.CONFIRMED    // 'confirmed'
STATUS.PAID         // 'paid'
STATUS.UNPAID       // 'unpaid'
STATUS.DRAFT        // 'draft'
STATUS.APPROVED     // 'approved'
STATUS.REJECTED     // 'rejected'
```

### Time Constants
```typescript
TIME.DEFAULT_REQUEST_TIMEOUT    // 30000 (30 seconds)
TIME.GRACEFUL_SHUTDOWN_TIMEOUT  // 10000 (10 seconds)
TIME.API_TIMEOUT                // 10000 (10 seconds)
TIME.AUTH_RATE_LIMIT_WINDOW     // 900000 (15 minutes)
TIME.MIN_RETRY_DELAY            // 100 (100ms)
TIME.MAX_RETRY_DELAY            // 5000 (5 seconds)
```

## Common Patterns

### Service - Not Found Error
```typescript
// Instead of:
if (!patient) throw new AppError('Patient not found', 404);

// Use:
if (!patient) throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
```

### Service - Already Exists Error
```typescript
// Instead of:
if (exists) throw new AppError('Client already exists', 400);

// Use:
if (exists) throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('Client'), HTTP_STATUS.BAD_REQUEST);
```

### Service - Pagination
```typescript
// Instead of:
const { page = 1, limit = 20 } = options;

// Use:
const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
```

### Service - Query Mode
```typescript
// Instead of:
{ firstName: { contains: search, mode: 'insensitive' } }

// Use:
{ firstName: { contains: search, mode: QUERY_MODE.INSENSITIVE } }
```

### Service - Order By
```typescript
// Instead of:
orderBy: { createdAt: 'desc' }

// Use:
orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }

// Other examples:
orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }
orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }
orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }
orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }
```

### Service - Take Limits
```typescript
// Instead of:
appointments: { take: 5 }
medicalRecords: { take: 10 }

// Use:
appointments: { take: QUERY_LIMITS.APPOINTMENTS }
medicalRecords: { take: QUERY_LIMITS.MEDICAL_RECORDS }
```

### Controller - Response Status
```typescript
// Instead of:
res.status(201).json({ status: 'success', data });
res.status(200).json({ status: 'success', data });
res.status(204).send();

// Use:
res.status(HTTP_STATUS.CREATED).json({ status: 'success', data });
res.status(HTTP_STATUS.OK).json({ status: 'success', data });
res.status(HTTP_STATUS.NO_CONTENT).send();
```

### Frontend - API Endpoints
```typescript
// Instead of:
this.get('/patients')
this.get(`/patients/${id}`)
this.post('/patients', data)

// Use:
this.get(API_ENDPOINTS.PATIENTS)
this.get(API_ENDPOINTS.PATIENT_BY_ID(id))
this.post(API_ENDPOINTS.PATIENTS, data)
```

### Frontend - Routes
```typescript
// Instead of:
window.location.href = '/login'

// Use:
window.location.href = ROUTES.LOGIN
```

### Frontend - Storage Keys
```typescript
// Instead of:
localStorage.getItem('token')
localStorage.setItem('user', JSON.stringify(user))

// Use:
localStorage.getItem(STORAGE_KEYS.TOKEN)
localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
```

## Helper Functions (Optional)

### ServiceHelper
```typescript
import { ServiceHelper } from '../utils/refactor-helper';

// Not found error
ServiceHelper.notFound('Patient');

// Already exists error
ServiceHelper.alreadyExists('Client');

// Pagination defaults
const { page, limit } = ServiceHelper.getPagination(options);

// Build paginated response
return ServiceHelper.buildPaginationResponse(page, limit, total, data);
```

### ControllerHelper
```typescript
import { ControllerHelper } from '../utils/refactor-helper';

// Success response (200)
ControllerHelper.success(res, data);

// Created response (201)
ControllerHelper.created(res, data);

// No content (204)
ControllerHelper.noContent(res);

// Success with pagination
ControllerHelper.successWithPagination(res, result);
```

## File Locations

- **Backend Constants**: `backend/src/constants/index.ts`
- **Frontend Constants**: `frontend/src/constants/index.ts`
- **Helper Utilities**: `backend/src/utils/refactor-helper.ts`
- **Full Documentation**: `docs/CONSTANTS.md`
- **Migration Guide**: `FULL_CONSTANTS_MIGRATION_GUIDE.md`

## VS Code Snippets (Optional)

Add to `.vscode/typescript.json`:

```json
{
  "Service Not Found": {
    "prefix": "svcnf",
    "body": [
      "if (!${1:entity}) {",
      "  throw new AppError(ERROR_MESSAGES.NOT_FOUND('${2:Entity}'), HTTP_STATUS.NOT_FOUND);",
      "}"
    ]
  },
  "Service Pagination": {
    "prefix": "svcpg",
    "body": [
      "const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;"
    ]
  },
  "Controller Success": {
    "prefix": "ctrlok",
    "body": [
      "res.status(HTTP_STATUS.OK).json({ status: 'success', data: ${1:data} });"
    ]
  }
}
```

## Search & Replace Regex

For mass refactoring in VS Code:

| Find | Replace |
|------|---------|
| `throw new AppError\('([^']+) not found', 404\)` | `throw new AppError(ERROR_MESSAGES.NOT_FOUND('$1'), HTTP_STATUS.NOT_FOUND)` |
| `page = 1, limit = 20` | `page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT` |
| `mode: 'insensitive'` | `mode: QUERY_MODE.INSENSITIVE` |
| `orderBy: \{ createdAt: 'desc' \}` | `orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }` |
| `res\.status\(201\)` | `res.status(HTTP_STATUS.CREATED)` |
| `res\.status\(200\)` | `res.status(HTTP_STATUS.OK)` |
| `res\.status\(204\)` | `res.status(HTTP_STATUS.NO_CONTENT)` |

---

**Quick Tip**: Always add the constants import after making replacements!
