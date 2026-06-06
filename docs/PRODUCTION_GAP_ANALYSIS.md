# Purple Cross — Production Gap Analysis

**Date:** 2026-05-26
**Scope:** Full platform review (backend, frontend, infrastructure) against the
"enterprise-grade" claims in the project documentation.
**Method:** Code-grounded audit — services, routes, middleware, schema, frontend
pages/hooks, CI/CD, Docker, and configuration were read directly (not inferred
from docs). File paths are cited so findings are reproducible.

> **Bottom line:** Purple Cross is a **well-architected scaffold whose marketing
> claims substantially exceed its implementation**. Foundations are genuinely
> good; the production-critical layers — authentication, security/compliance,
> real feature completeness, real tests, and deployment automation — are missing
> or are facades. Honest completeness: **~65% backend / ~15–20% frontend**.
> **Not production-ready as-is.**

---

## 0. Progress Update (2026-06)

> This section records work completed since the 2026-05-26 audit below. The
> original findings are preserved unedited for traceability; where a gap has been
> closed it is annotated here.

**Closed since the audit:**

- **Authentication / RBAC (was P0 §3.1):** `User`, `RefreshToken`, `Tenant`,
  `ApiKey`, and `AuditLog` models now exist (`backend/prisma/schema.prisma`);
  `authenticate` is mounted globally in `backend/src/app.ts` (every `/api`
  route requires a valid token), `/metrics` and `/admin/queues` are guarded by
  `authorize(ROLES.ADMIN)`, and the frontend has a real `AuthContext`/login
  flow with silent token refresh (`frontend/src/services/api.ts`).
- **Data architecture & compliance (was §4/§6/§7):** Prisma client extensions
  provide soft-delete (`deletedAt`), multi-tenancy (`tenantId`),
  `createdBy/updatedBy` stamping, and **field-level encryption**
  (`backend/src/config/prisma-extensions/field-crypto.ts`); models carry
  `deletedAt`/`tenantId` indexes.
- **Frontend feature completeness (was P0 §3.3):** the ~150 placeholder
  sub-pages across all 15 modules have been replaced with **real, data-driven
  pages** wired to the backend via the per-module TanStack Query hooks and the
  shared `useZodForm` + `FormField` form layer. All production frontend code
  typechecks clean (`tsc --noEmit`); zero `any`, no leftover info-card stubs.

**Still open (enterprise-hardening tail):**

- **Test integrity (§3.4):** integration tests against ephemeral Postgres and
  RTL/MSW component tests are still in progress; ~32 pre-existing **test-infra**
  type errors remain (vitest globals / jest-dom matcher typings) — production
  code is clean.
- **Observability (§8):** Prometheus metrics / OpenTelemetry tracing / log
  shipping not yet done.
- **Deployment / CD / IaC (§9):** K8s/Helm + real CD pipeline + tested
  restore not yet done.

Updated scorecard deltas: **Authentication/RBAC → Ready**; **Frontend feature
completeness → ~90% (Ready for core flows)**; **Data model (soft-delete/audit/
tenant/encryption) → Ready**. Other rows unchanged from §5.

---

## 1. Decisions Driving the Plan

| Decision | Choice |
| --- | --- |
| Production stack | **Express `backend/` + Vite/React `frontend/`** (PostgreSQL) |
| Abandoned | **NestJS `backend-nestjs/`** + **Next.js `frontend-nextjs/`** forks (removed) |
| Ambition | **Full enterprise hardening** |
| Feature breadth | **All 15+ modules** completed end-to-end |

Rationale: the original Express + Vite stack is by far the most complete (21k +
50k LOC, PostgreSQL, full CI). The NestJS fork (10.5k LOC) silently switched to
**SQLite**; the Next.js fork is a ~1.9k-LOC skeleton despite "all 5 phases
complete" claims. Consolidating on the mature stack is the lowest-risk path.

---

## 2. What Is Genuinely Real (Keep & Build On)

- **Backend modules** — 36 route groups; services are **~85% real Prisma
  queries** (patients, appointments, invoices, prescriptions, lab-tests,
  insurance-claims, payment-plans, loyalty, …). Very few true stubs.
- **Middleware** (`backend/src/app.ts`) — correlation IDs, in-memory metrics,
  request timeout, helmet, CORS, input sanitization, compression, Winston
  structured logging, Sentry, health checks, rate limiting, centralized error
  handler. All wired and functional.
- **Schema** (`backend/prisma/schema.prisma`) — 69 models, 134 indexes, broad
  domain coverage; one init migration `20251020144226_init`.
- **Frontend infrastructure** — strong axios client + interceptors
  (`frontend/src/services/api.ts`), 30+ TanStack Query hooks (e.g.
  `frontend/src/hooks/usePatients.ts`), code-split routing, accessible
  hand-rolled component library, Storybook.
- **Docker** — multi-stage Dockerfiles (non-root, healthchecks), dev compose +
  hardened `docker-compose.prod.yml` (daily backups, replicas, internal-only
  DB/Redis).
- **CI** (`.github/workflows/ci.yml`) — real Postgres service, `prisma migrate
  deploy`, lint, typecheck, coverage upload, Docker build on PR.

---

## 3. Critical Gaps (P0 — Block Production)

### 3.1 Authentication is non-functional end-to-end
- `backend/src/middleware/auth.ts` exports `authenticate` / `authorize` but is
  imported by **zero** of the 36 route files — every API endpoint is open.
- **No `User` model**, no login/register/refresh endpoints, no token issuing.
- Frontend `frontend/src/App.tsx` mounts all 16 routes **without**
  `ProtectedRoute`; `frontend/src/routes/ProtectedRoute.tsx` itself hardcodes
  `const isAuthenticated = true`. No auth context, no login page, no token
  lifecycle.
- Weak default secret: `JWT_SECRET || 'change-me-in-production'`
  (`backend/src/config/env.ts` + `backend/src/constants/index.ts`), enforced only
  in `NODE_ENV=production`.

### 3.2 Architecture fragmentation
- Four overlapping stacks plus orphaned root `src/models/` (3.8k LOC, imported by
  nothing) and `shared/`. The NestJS fork switched the database to **SQLite**.

### 3.3 Frontend is mostly placeholder
- ~198 of 216 page files are info-card stubs; only ~18 (patients, clients,
  appointments + the integrations/workflow pages) have real CRUD wired to the API.
  Several "main" pages (e.g. `Billing.tsx`) render hardcoded mock data.

### 3.4 Tests are illusory
- Backend 70% coverage threshold is met with a **fully-mocked Prisma client**
  (`backend/tests/setup.ts`) — no real DB interaction.
- Frontend tests (15 files) assert on mock arrays/utility functions, not rendered
  components. Cypress **and** Playwright are both configured with no real specs.

---

## 4. High-Priority Gaps (Enterprise Hardening)

| # | Area | Finding |
| --- | --- | --- |
| 5 | Resilience | `utils/circuit-breaker.ts` + `utils/retry.ts` are real but imported nowhere (dead code). |
| 6 | Data model | No soft deletes, no `tenantId` (single-tenant), no `createdBy/updatedBy`, no optimistic-locking `version`. `AuditLog` model exists but **nothing writes to it** (domain events cover only 7/34 write services). |
| 7 | Security/compliance | `/metrics` and `/admin/queues` (Bull Board) unauthenticated; permissive CSP (`unsafe-inline` in `frontend/nginx.conf`); no env-schema validation; no backend `npm audit`/secret scanning; **no HIPAA/PII controls** (no encryption at rest, no PII log masking) despite medical data. |
| 8 | Observability | Metrics are JSON, not Prometheus; no distributed tracing; logs not shipped off-box. |
| 9 | Deployment | CI builds images but the deploy step is a stub; no Kubernetes/IaC; no tested restore. |
| 10 | Docs vs reality | ~108 markdown files (63 root + ~45 `docs/`), many auto-generated "completion/verification" reports that overstate maturity. |
| 11 | TypeScript debt | `tsc --noEmit` reports **57 backend / 58 frontend pre-existing errors** (null-safety, Prisma JSON input types, missing test typings). The "100% TypeScript compliance / zero `any`" claim is false; lockfiles are also gitignored (non-reproducible installs). |

---

## 5. Production-Readiness Scorecard

| Area | Status | Severity |
| --- | --- | --- |
| Core backend CRUD | Ready | — |
| Middleware / logging / error handling | Ready | — |
| Docker packaging | Ready | — |
| CI (build/test) | Partial (tests mocked) | Medium |
| **Authentication / RBAC** | **Missing / facade** | **Critical** |
| **Architecture coherence** | **Fragmented** | **Critical** |
| **Frontend feature completeness** | **~15–20%** | **Critical** |
| **Test integrity** | **Illusory** | **High** |
| Resilience (CB/retry) | Coded, unused | High |
| Data model (soft delete/audit/tenant) | Missing | High |
| Security / HIPAA / PII | Missing | High |
| Observability (metrics/tracing/logs) | Partial | Medium |
| Deployment / CD / IaC | Missing | High |
| Config validation / secrets | Missing / weak | High |
| Docs accuracy | Overstated | Medium |

---

## 6. Roadmap (Summary)

Detailed, code-grounded design lives alongside this report; phases are executed on
branch `claude/enterprise-gap-analysis-plan-VT9Sx` in reviewable increments.

- **Phase 0 — Consolidation & hygiene:** remove the NestJS/Next.js forks +
  orphaned root `src/`/`shared/`; fix root workspaces/scripts; correct
  `CLAUDE.md`; consolidate docs.
- **Phase 1 — Security & Auth foundation (P0):** zod config validation (remove
  weak JWT default); `User`/`RefreshToken` models; login/register/refresh with
  rotation; global `authenticate` guard + RBAC; frontend `AuthContext`, login
  pages, token refresh, real `ProtectedRoute`; CI security scanning.
- **Phase 2 — Data architecture & compliance:** Prisma Client Extensions composed
  in `config/database.ts` + `AsyncLocalStorage` context for soft delete, audit +
  `createdBy/updatedBy` + optimistic locking, multi-tenancy, and field-level
  encryption + PII log masking; activate circuit breaker/retry on external calls.
- **Phase 3 — Feature completeness:** finish all 15+ modules end-to-end (replace
  ~198 stub pages) with a shared `react-hook-form` + `zod` form layer; full Joi
  coverage; OpenAPI/Swagger.
- **Phase 4 — Real testing:** integration tests against ephemeral Postgres,
  RTL/hook tests, MSW, one consolidated E2E suite; enforce coverage on real tests.
- **Phase 5 — Observability:** Prometheus metrics, OpenTelemetry tracing, log
  shipping, Sentry releases.
- **Phase 6 — Deployment & CD:** K8s/Helm, real CD, migration job, secret
  manager, PgBouncer, tested backup/restore, branch protection.
- **Phase 7 — Launch readiness:** checklist sign-off, load test, security/pen
  test, `SECURITY.md`.
