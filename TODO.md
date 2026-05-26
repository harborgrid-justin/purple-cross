# Purple Cross — Production Hardening TODO

_Last updated: 2026-05-26_

Status of the multi-phase production-hardening effort on branch
`claude/enterprise-gap-analysis-plan-VT9Sx`. See `docs/PRODUCTION_GAP_ANALYSIS.md`
for the original assessment.

## Done & validated
- **Phase 0** — single-stack consolidation (NestJS/Next.js forks removed); gap-analysis report.
- **Phase 1** — real JWT auth + rotating refresh tokens + RBAC (global guard); frontend AuthContext/login/ProtectedRoute. Validated over HTTP.
- **Phase 2 (core)** — request context (ALS), audit trail, createdBy/updatedBy stamping, optimistic-locking `version`, soft-delete, field-level PHI encryption, multi-tenant isolation (fail-closed), PII log/Sentry redaction, circuit breaker on webhooks. Validated against real PostgreSQL (19-check harness + integration tests).
- **Phase 2 (rollout)** — `tenantId` + lifecycle columns extended across **52 operational models** (`backend/src/config/prisma-extensions/models.ts` → `OPERATIONAL_MODELS`); migration `*_extend_tenancy_audit_all_models` also creates 4 tables the monolithic init migration never created (`webhook_deliveries`, `workflow_templates`, `workflow_executions`, `workflow_execution_steps`), fixing pre-existing schema/migration drift. Applies cleanly; integration tests 10/10.
- **Phase 3 (backend docs)** — OpenAPI/Swagger at `/api-docs`; auth + 7 route modules annotated.
- **Phase 3 (frontend)** — shared `useZodForm`/`FormField` layer; real CRUD (list+create+edit) for **patients, clients, appointments, medical-records, prescriptions, inventory, billing** + laboratory create.
- **Phase 4** — real-DB integration test harness wired into CI (auth + extensions, 10 tests).
- **Phase 5** — Prometheus `/metrics` (ADMIN-protected).
- **Phase 6** — Kustomize K8s manifests + CD workflow.
- **Phase 7** — `SECURITY.md`, Dependabot, CI dependency audit.

## Remaining

### Phase 2 — finish enterprise data hardening
- [ ] `NOT NULL` contract migration for `tenantId` (after verifying all write paths set it), once all services run inside tenant context.
- [ ] Tenant-scoped / partial unique indexes (e.g. `@@unique([tenantId, email])`, soft-delete-aware uniques) — currently uniques remain global.
- [ ] Backfill existing rows on the newly-tenanted tables to the default tenant (migration currently adds nullable columns only).
- [ ] Extend field-level encryption beyond `MedicalRecord` to other PHI columns; add a key-version-aware rotation path.
- [ ] Optional Postgres RLS as defense-in-depth on the most sensitive tables.

### Phase 3 — finish breadth
- [ ] Backend: add `@openapi` annotations to the remaining ~28 route modules (pattern in `auth.routes.ts`; 7 done).
- [ ] Frontend: convert the remaining placeholder pages to real CRUD using the established `useZodForm`/`FormField` + TanStack Query pattern (staff, communications, documents, compliance, integrations sub-pages, and all extended modules).
- [ ] Audit Joi validation coverage across all 36 backend route files.

### Phase 4 — testing depth
- [ ] Frontend: real RTL render/interaction tests + MSW; consolidate Cypress↔Playwright to one E2E tool; golden-path specs.
- [ ] Backend: more service/HTTP integration tests (per module); fix the ~58 pre-existing frontend + ~44 backend `tsc` errors (mostly Prisma JSON typing + test-util typings).
- [ ] Raise coverage gates against the now-real suites.

### Phase 5 — observability depth
- [ ] OpenTelemetry tracing; ship logs to an aggregator (ELK/Loki/Datadog); Sentry release tracking.

### Phase 6 — deploy hardening
- [ ] Wire a real cluster (`KUBE_CONFIG`); PgBouncer connection pooling; tested backup/restore runbook; branch protection.

### Phase 7 — launch
- [ ] Load/performance test; third-party security/pen test sign-off.

## Known issues / notes
- The original `init` migration is missing tables for models added later; the new
  rollout migration reconciles 4 of them — audit the schema vs. migrations for any
  others before a production deploy.
- Lockfiles are gitignored (non-reproducible installs) — consider committing them.
- Backend/frontend each carry pre-existing `tsc` errors (44 / 58) unrelated to this
  work; tracked under Phase 4.
