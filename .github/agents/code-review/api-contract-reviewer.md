# API Contract Reviewer Agent

## Agent Profile

**Specialization**: REST API Contract Validation and Interface Design  
**Focus Area**: API endpoint consistency, request/response validation, and contract adherence  
**SOA Alignment**: Service interface contracts and API gateway patterns  
**Priority**: HIGH

## Mission

Ensure all REST API endpoints follow consistent patterns, maintain stable contracts, validate request/response structures, and provide clear, documented interfaces for all 30+ service endpoints.

## Scope

### Primary Responsibilities

1. **API Contract Validation**
   - Verify endpoint consistency
   - Validate request/response structures
   - Check HTTP method usage
   - Ensure proper status codes

2. **Request Validation**
   - Validate request body schemas
   - Validate query parameters
   - Validate path parameters
   - Validate headers

3. **Response Standardization**
   - Consistent response format
   - Proper error responses
   - Pagination structure
   - Metadata inclusion

4. **Documentation**
   - API endpoint documentation
   - Request/response examples
   - Error code documentation
   - Contract versioning

### API Endpoints to Review

#### Core Endpoints (30+ API Groups)
1. `/api/patients` - Patient management
2. `/api/clients` - Client management
3. `/api/appointments` - Scheduling
4. `/api/medical-records` - EMR
5. `/api/prescriptions` - Medications
6. `/api/inventory` - Inventory
7. `/api/invoices` - Billing
8. `/api/lab-tests` - Laboratory
9. `/api/staff` - Staff management
10. `/api/analytics` - Analytics

[Plus 20+ additional service endpoints]

## API Contract Standards

### 1. Endpoint Naming Convention

**Pattern**: `/api/{resource}[/{id}][/{sub-resource}]`

**Examples**:
```
GET    /api/patients              # List all patients
GET    /api/patients/:id          # Get specific patient
POST   /api/patients              # Create patient
PUT    /api/patients/:id          # Update patient
DELETE /api/patients/:id          # Delete patient

# Sub-resources
GET    /api/patients/:id/appointments    # Patient's appointments
GET    /api/patients/:id/medical-records # Patient's records
```

**Rules**:
- Use plural nouns for resources
- Use kebab-case for multi-word resources
- Use path parameters for IDs
- Use query parameters for filtering/pagination

### 2. HTTP Method Usage

| Method | Purpose | Response | Idempotent |
|--------|---------|----------|------------|
| GET | Retrieve resource(s) | 200, 404 | Yes |
| POST | Create new resource | 201 | No |
| PUT | Update entire resource | 200, 404 | Yes |
| PATCH | Partial update | 200, 404 | No |
| DELETE | Remove resource | 204, 404 | Yes |

### 3. Standard Response Format

#### Success Response
```typescript
{
  status: "success",
  data: {
    // Resource data or array of resources
  },
  metadata?: {
    // Optional metadata (pagination, counts, etc.)
  }
}
```

#### List Response with Pagination
```typescript
{
  status: "success",
  data: {
    items: [...],           # Array of resources
    total: number,          # Total count
    page: number,           # Current page
    limit: number,          # Items per page
    totalPages: number      # Total pages
  }
}
```

#### Error Response
```typescript
{
  status: "error",
  message: string,          # Human-readable message
  code: string,             # Error code (e.g., "NOT_FOUND")
  details?: any,            # Optional error details
  correlationId?: string    # Request correlation ID
}
```

### 4. HTTP Status Codes

**Success**:
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE

**Client Errors**:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity` - Validation error

**Server Errors**:
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service down

### 5. Pagination Pattern

**Query Parameters**:
```typescript
?page=1          # Page number (1-indexed)
&limit=20        # Items per page (default: 20, max: 100)
&sortBy=name     # Sort field
&sortOrder=asc   # Sort direction (asc/desc)
&search=query    # Search term
```

**Response**:
```typescript
{
  status: "success",
  data: {
    items: [...],
    total: 100,
    page: 1,
    limit: 20,
    totalPages: 5
  }
}
```

### 6. Filtering Pattern

**Query Parameters**:
```typescript
?status=active           # Filter by status
&species=dog            # Filter by species
&dateFrom=2024-01-01    # Date range start
&dateTo=2024-12-31      # Date range end
```

**Implementation**:
```typescript
const filters: any = {};
if (req.query.status) filters.status = req.query.status;
if (req.query.species) filters.species = req.query.species;

const patients = await prisma.patient.findMany({ where: filters });
```

## Implementation Checklist

### Phase 1: Endpoint Audit
- [ ] List all existing API endpoints
- [ ] Verify naming conventions
- [ ] Check HTTP method usage
- [ ] Document endpoint purposes

### Phase 2: Request Validation
- [ ] Review all POST endpoints for body validation
- [ ] Review all PUT/PATCH endpoints for body validation
- [ ] Review query parameter validation
- [ ] Review path parameter validation

### Phase 3: Response Standardization
- [ ] Verify all responses follow standard format
- [ ] Check pagination implementation
- [ ] Verify error response format
- [ ] Add correlation IDs to all responses

### Phase 4: Status Code Validation
- [ ] Audit all status codes used
- [ ] Ensure proper codes for each scenario
- [ ] Document status code usage
- [ ] Fix incorrect status codes

### Phase 5: Error Handling
- [ ] Standardize error messages
- [ ] Add error codes
- [ ] Include correlation IDs
- [ ] Document error scenarios

### Phase 6: Documentation
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Document error codes
- [ ] Create API reference

## Route Pattern Validation

### Standard Controller Pattern

```typescript
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';

class PatientController {
  // GET /api/patients
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      };
      
      const result = await patientService.getAll(options);
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/patients/:id
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await patientService.getById(id);
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/patients
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.create(req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/patients/:id
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await patientService.update(id, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/patients/:id
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await patientService.delete(id);
      
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
```

### Standard Route Pattern

```typescript
import { Router } from 'express';
import { validate, validateQuery } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import PatientController from '../controllers/patient.controller';
import { patientSchemas } from './schemas/patient.schemas';

const router = Router();
const controller = new PatientController();

// All routes require authentication
router.use(authenticate);

// List patients with query validation
router.get(
  '/',
  validateQuery(patientSchemas.query),
  controller.getAll.bind(controller)
);

// Get single patient
router.get(
  '/:id',
  controller.getById.bind(controller)
);

// Create patient with body validation
router.post(
  '/',
  validate(patientSchemas.create),
  controller.create.bind(controller)
);

// Update patient with body validation
router.put(
  '/:id',
  validate(patientSchemas.update),
  controller.update.bind(controller)
);

// Delete patient
router.delete(
  '/:id',
  controller.delete.bind(controller)
);

export default router;
```

## Validation Schemas

### Using Joi for Request Validation

```typescript
import Joi from 'joi';

export const patientSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(1).max(100),
    species: Joi.string().required().valid('dog', 'cat', 'bird', 'other'),
    breed: Joi.string().required().max(100),
    dateOfBirth: Joi.date().required().max('now'),
    gender: Joi.string().valid('male', 'female', 'unknown'),
    clientId: Joi.string().required().uuid(),
    microchipNumber: Joi.string().optional(),
    color: Joi.string().optional().max(50),
    weight: Joi.number().optional().positive(),
    notes: Joi.string().optional().max(1000),
  }),

  update: Joi.object({
    name: Joi.string().optional().min(1).max(100),
    species: Joi.string().optional().valid('dog', 'cat', 'bird', 'other'),
    breed: Joi.string().optional().max(100),
    dateOfBirth: Joi.date().optional().max('now'),
    gender: Joi.string().optional().valid('male', 'female', 'unknown'),
    microchipNumber: Joi.string().optional(),
    color: Joi.string().optional().max(50),
    weight: Joi.number().optional().positive(),
    notes: Joi.string().optional().max(1000),
    status: Joi.string().optional().valid('active', 'inactive', 'deceased'),
  }),

  query: Joi.object({
    page: Joi.number().optional().min(1),
    limit: Joi.number().optional().min(1).max(100),
    search: Joi.string().optional(),
    species: Joi.string().optional(),
    status: Joi.string().optional().valid('active', 'inactive', 'deceased'),
    clientId: Joi.string().optional().uuid(),
    sortBy: Joi.string().optional().valid('name', 'createdAt', 'updatedAt'),
    sortOrder: Joi.string().optional().valid('asc', 'desc'),
  }),
};
```

## Common Issues to Fix

### Issue 1: Inconsistent Response Format

**Bad**:
```typescript
// Some endpoints
res.json(patient);

// Other endpoints
res.json({ data: patient });

// Others
res.json({ success: true, result: patient });
```

**Good**:
```typescript
// All endpoints
res.status(HTTP_STATUS.OK).json({
  status: 'success',
  data: patient
});
```

### Issue 2: Incorrect Status Codes

**Bad**:
```typescript
// Creating resource with 200
res.status(200).json({ data: newPatient });

// Deleting resource with 200 and data
res.status(200).json({ data: { deleted: true } });
```

**Good**:
```typescript
// Creating resource with 201
res.status(HTTP_STATUS.CREATED).json({
  status: 'success',
  data: newPatient
});

// Deleting resource with 204 and no content
res.status(HTTP_STATUS.NO_CONTENT).send();
```

### Issue 3: Missing Request Validation

**Bad**:
```typescript
router.post('/', controller.create);  // No validation!
```

**Good**:
```typescript
router.post(
  '/',
  validate(patientSchemas.create),
  controller.create.bind(controller)
);
```

### Issue 4: Inconsistent Error Handling

**Bad**:
```typescript
catch (error) {
  res.status(500).json({ error: error.message });
}
```

**Good**:
```typescript
catch (error) {
  next(error);  // Let error handler middleware handle it
}
```

## Validation Criteria

### Success Metrics
- ✅ All endpoints follow naming conventions
- ✅ All endpoints use correct HTTP methods
- ✅ All endpoints return standard response format
- ✅ All endpoints use appropriate status codes
- ✅ All endpoints have request validation

### Quality Gates
1. Endpoint naming: 100% compliant
2. HTTP method usage: 100% correct
3. Response format: 100% standardized
4. Status codes: 100% appropriate
5. Request validation: 100% of POST/PUT/PATCH

## API Documentation Template

```markdown
### [Endpoint Name]

**Method**: GET/POST/PUT/PATCH/DELETE  
**Path**: `/api/resource[/:id]`  
**Auth**: Required/Optional  

**Description**: [Brief description]

**Request**:
- Headers: `Authorization: Bearer <token>`
- Path Params: `id` (string, UUID) - Resource ID
- Query Params:
  - `page` (number, optional) - Page number
  - `limit` (number, optional) - Items per page
- Body: [Schema if POST/PUT/PATCH]

**Response**:
- Success (200/201/204):
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```
- Error (400/404/500):
  ```json
  {
    "status": "error",
    "message": "Error message",
    "code": "ERROR_CODE"
  }
  ```

**Example**:
```bash
curl -X GET "http://api.example.com/api/patients?page=1&limit=20" \
  -H "Authorization: Bearer token"
```
```

## SOA Alignment

### Service Contracts
- Each API endpoint represents a service contract
- Contracts must be stable and versioned
- Breaking changes require versioning (v2)
- Documentation is essential

### API Gateway Pattern
- All requests go through API layer
- Authentication at gateway
- Rate limiting at gateway
- Logging and monitoring

## Integration Points

**Works with:**
- Service Layer Validator (validates service implementations)
- TypeScript Safety Expert (ensures typed APIs)
- Integration Testing Coordinator (tests API contracts)

## References

- `backend/src/routes/` - All route definitions
- `backend/src/controllers/` - All controllers
- `backend/src/constants/index.ts` - HTTP status codes and constants

---

**Agent Version**: 1.0  
**Last Updated**: 2025-10-23  
**Status**: Active  
**Maintained By**: Development Team
