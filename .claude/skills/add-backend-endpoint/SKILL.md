---
name: add-backend-endpoint
description: Add or extend a backend API endpoint/module in the Express + Prisma backend following the repo's layered pattern (route → controller → service → Prisma), with Joi validation, tenancy/audit, OpenAPI docs, and an integration test. Use when adding endpoints, controllers, services, or a new module under backend/src.
---

# Add a backend endpoint / module

Follow the established layered architecture. Reuse existing patterns — do not invent new ones.

## Steps
1. **Route** — `backend/src/routes/<module>.routes.ts`. Define routes with inline
   Joi schemas via `validate()` / `validateParams()` / `validateQuery()`
   (`backend/src/middleware/validation.ts`). Pattern: `patient.routes.ts`.
2. **Controller** — `backend/src/controllers/<module>.controller.ts`. Thin; read
   `req.body`/`req.params`, call the service, respond with `HTTP_STATUS` +
   `{ status: 'success', data }`. Pattern: `patient.controller.ts`.
3. **Service** — `backend/src/services/<module>.service.ts`. Business logic via
   `prisma` (`backend/src/config/database.ts`). Throw `AppError` with
   `ERROR_MESSAGES` + `HTTP_STATUS`. Use `constants/` (PAGINATION, SORT_ORDER,
   FIELDS, QUERY_MODE). Pattern: `patient.service.ts`.
4. **Mount** in `backend/src/app.ts` under `env.apiPrefix`. It is **already behind
   the global `authenticate` guard** — only add public routers before the guard,
   and add `authorize(ROLES.X)` to sensitive (delete/financial/medical) endpoints.
5. **Schema/tenancy** — if adding a Prisma model, see the `add-prisma-model`
   workflow / `database-architect`. Operational models are tenant-scoped + audited
   automatically by the client extensions (`backend/src/config/prisma-extensions/`)
   when listed in `models.ts` (`OPERATIONAL_MODELS`). Create a migration; never
   hand-edit applied migrations.
6. **OpenAPI** — add an `@openapi` JSDoc block to the route file (pattern:
   `auth.routes.ts`); public endpoints set `security: []`.
7. **Test** — add a real-DB integration test under
   `backend/tests/integration/*.itest.ts` (wrap tenant-scoped work in
   `runWithContext({ userId, tenantId }, ...)`); run `npm run test:integration`.

## Verify
- `cd backend && npm run typecheck` (no new errors vs baseline).
- `npm run test:integration` passes against a running PostgreSQL.
- Boot + curl: `POST /api/v1/auth/login` → use the token on the new endpoint;
  confirm 401 without a token.

See `docs/LLM_ENGINEERING_GUIDE.md` and root `CLAUDE.md` ("Adding a New API Endpoint").
