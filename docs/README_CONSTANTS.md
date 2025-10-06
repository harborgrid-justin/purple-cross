# 📋 Constants Centralization - README

## 🎯 Quick Start

All constants, variables, URLs, and static elements are now centralized in:

- **Backend**: `backend/src/constants/index.ts` (430+ lines, 200+ constants)
- **Frontend**: `frontend/src/constants/index.ts` (660+ lines, 150+ constants)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [CONSTANTS_QUICK_REFERENCE.md](./CONSTANTS_QUICK_REFERENCE.md) | **START HERE** - Quick lookup and common patterns |
| [docs/CONSTANTS.md](./docs/CONSTANTS.md) | Complete reference with examples |
| [FULL_CONSTANTS_MIGRATION_GUIDE.md](./FULL_CONSTANTS_MIGRATION_GUIDE.md) | Step-by-step migration guide |
| [COMPLETE_CENTRALIZATION_SUMMARY.md](./COMPLETE_CENTRALIZATION_SUMMARY.md) | Full implementation summary |

## 🚀 Usage

### Backend Service Example

```typescript
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS } from '../constants';

async getById(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC },
        take: QUERY_LIMITS.APPOINTMENTS,
      },
    },
  });

  if (!patient) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
  }

  return patient;
}

async getAll(options: { page?: number; limit?: number }) {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
  // ... rest of implementation
}
```

### Backend Controller Example

```typescript
import { HTTP_STATUS } from '../constants';

async create(req: Request, res: Response) {
  const patient = await service.create(req.body);
  res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: patient });
}

async getById(req: Request, res: Response) {
  const patient = await service.getById(req.params.id);
  res.status(HTTP_STATUS.OK).json({ status: 'success', data: patient });
}

async delete(req: Request, res: Response) {
  await service.delete(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).send();
}
```

### Frontend Example

```typescript
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, HTTP_STATUS } from '../constants';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
  }

  // Use endpoint constants
  patients = {
    getAll: (params) => this.get(API_ENDPOINTS.PATIENTS, params),
    getById: (id) => this.get(API_ENDPOINTS.PATIENT_BY_ID(id)),
    create: (data) => this.post(API_ENDPOINTS.PATIENTS, data),
  };

  // Use storage constants
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Use status constants
  handleError(error) {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Handle unauthorized
    }
  }
}
```

## ✅ Completed

- [x] Backend constants file (200+ constants)
- [x] Frontend constants file (150+ constants)
- [x] Helper utilities (`refactor-helper.ts`)
- [x] Core backend files refactored (7 files)
- [x] Frontend API client refactored
- [x] Comprehensive documentation (5 documents)
- [x] Automation scripts (2 scripts)
- [x] Type checking verified ✓

## 📋 Remaining Work

### High Priority (Core Services)
- [ ] medical-record.service.ts
- [ ] prescription.service.ts
- [ ] inventory.service.ts
- [ ] invoice.service.ts
- [ ] lab-test.service.ts
- [ ] staff.service.ts
- [ ] communication.service.ts

### Medium Priority (Extended Services)
- [ ] 20+ additional service files
- [ ] 30 controller files

### Low Priority
- [ ] Frontend components scan
- [ ] Additional UI constants
- [ ] Validation constants

## 🛠️ Migration Tools

### Option 1: Manual (Recommended for learning)
Follow [FULL_CONSTANTS_MIGRATION_GUIDE.md](./FULL_CONSTANTS_MIGRATION_GUIDE.md)

### Option 2: VS Code Find & Replace
Use patterns from [CONSTANTS_QUICK_REFERENCE.md](./CONSTANTS_QUICK_REFERENCE.md)

### Option 3: Automated Scripts
```bash
# Node.js script (requires glob)
npm install -g glob
node scripts/refactor-constants.js

# Bash script (Linux/Mac/WSL)
chmod +x scripts/bulk-refactor-services.sh
./scripts/bulk-refactor-services.sh
```

## 🔍 Quick Lookup

### Most Used Constants

```typescript
// HTTP Status
HTTP_STATUS.OK                    // 200
HTTP_STATUS.CREATED               // 201
HTTP_STATUS.NOT_FOUND             // 404
HTTP_STATUS.BAD_REQUEST           // 400

// Errors
ERROR_MESSAGES.NOT_FOUND('Entity')
ERROR_MESSAGES.ALREADY_EXISTS('Entity')

// Pagination
PAGINATION.DEFAULT_PAGE           // 1
PAGINATION.DEFAULT_LIMIT          // 20

// Sort & Query
SORT_ORDER.DESC                   // 'desc'
SORT_ORDER.ASC                    // 'asc'
QUERY_MODE.INSENSITIVE           // 'insensitive'

// Fields
FIELDS.CREATED_AT                 // 'createdAt'
FIELDS.START_TIME                 // 'startTime'
FIELDS.NAME                       // 'name'

// Status
STATUS.ACTIVE                     // 'active'
STATUS.PENDING                    // 'pending'
STATUS.CANCELLED                  // 'cancelled'
```

### Common Replacements

| Before | After |
|--------|-------|
| `404` | `HTTP_STATUS.NOT_FOUND` |
| `'Patient not found'` | `ERROR_MESSAGES.NOT_FOUND('Patient')` |
| `page = 1, limit = 20` | `page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT` |
| `mode: 'insensitive'` | `mode: QUERY_MODE.INSENSITIVE` |
| `orderBy: { createdAt: 'desc' }` | `orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }` |

## 📊 Statistics

- **Total Constants**: 350+
- **Lines of Code**: 1,090+
- **Files Created**: 6
- **Files Refactored**: 8
- **Files Remaining**: 60+
- **Documentation**: 5 files

## ✨ Benefits

✓ **Maintainable** - Change values in one place
✓ **Type-Safe** - Full TypeScript support
✓ **Consistent** - No duplicate values
✓ **Discoverable** - IDE autocomplete
✓ **Testable** - Easy to mock

## 🔗 Resources

- [Backend Constants](./backend/src/constants/index.ts)
- [Frontend Constants](./frontend/src/constants/index.ts)
- [Helper Utilities](./backend/src/utils/refactor-helper.ts)
- [Migration Scripts](./scripts/)

## 🚦 Verification

```bash
# Backend type check
cd backend && npm run typecheck

# Frontend type check
cd frontend && npm run typecheck

# Run tests
npm test
```

---

**Status**: ✅ Foundation Complete | ⏳ Migration In Progress | 📋 Full Coverage Pending

**Next Step**: Pick a file from the migration guide and start refactoring!
