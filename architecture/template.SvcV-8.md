# SvcV-8: Services Evolution Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-8-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-8 Services Evolution Description** lays out the planned maturation of
the Purple Cross platform services across the four program increments (PI-1
through PI-4 / Phase 1–4). It tracks how the REST API services under `/api/v1`,
the shared platform services, and the external integrations move from the
current baseline toward production readiness — and, crucially, **when** the
honest gaps (unwired auth, unscoped tenancy, plaintext PHI/PII, aspirational
payments, inactive circuit breakers, in-memory metrics) are closed.

> ⚠️ **Honesty note.** The **baseline (PI-1, today)** is: backend services
> ~**85% real**; the **auth service is NOT wired** (0 mounted routes); RBAC and
> `tenantId` scoping are absent; PHI/PII is plaintext; the **Payment Provider
> integration is aspirational** (no SDK); circuit-breaker/retry utilities exist
> but are **unused**; `/metrics` is in-memory JSON; the frontend is mostly
> placeholder. This document is the roadmap, not a claim of completion.

---

## 2. Evolution Timeline

```
            PI-1 (2025 Q3)   PI-2 (2025 Q4)   PI-3 (2026 Q1-2)   PI-4 (2026 Q3-4)
            BASELINE         FRONTEND         SECURITY            HARDEN & SCALE
                |                |                 |                   |
  Services ~85% real      FE consumes ALL    Wire auth/RBAC/      /api/v2 versioning
  backend, no auth        services (real      tenancy across       per-service SLOs
                          CRUD vs /api/v1)    services; real        contract testing
                                              payment provider      activate circuit
                                              integration           breakers; OTel
                |                |                 |                   |
                v                v                 v                   v
        +-------------+  +-------------+   +-------------+     +-------------+
        | Backend     |  | UI-complete |   | Secure,     |     | Production- |
        | service tier|  | service     |   | tenant-     |     | grade,      |
        | exists      |  | consumption |   | isolated    |     | observable  |
        +-------------+  +-------------+   +-------------+     +-------------+
```

---

## 3. Baseline (PI-1) — Current Service Maturity

| Service group | Reality today | Maturity |
|---------------|---------------|----------|
| Core CRUD services (12) | Route→controller→service→Prisma real; Joi validation; envelopes | ~85% real |
| Extended services (25) | Mostly real CRUD; some thin | ~80% real |
| auth (SVC-25) | **0 mounted routes — NOT wired** | PLANNED |
| Shared: domain-events, webhook, workflow | Real in-process bus + BullMQ delivery/engine | Functional |
| Cache (Redis) | Used opportunistically, not on hot paths | Partial |
| Observability | `/metrics` in-memory JSON, `/health`, Winston, Sentry (partial) | Basic |
| External: SendGrid/Twilio | LIVE (SDK + keys) but circuit breaker unused | Live, unguarded |
| External: Payment Provider | **Aspirational — no SDK** | Not started |
| External: External Lab | **PLANNED — not wired** | Not started |
| Frontend consumption | Mostly placeholder pages | Early |

---

## 4. Service Evolution by Phase

### 4.1 Phase 2 (PI-2) — Frontend Consumption of Services

| Theme | Change | Affected services |
|-------|--------|-------------------|
| Real CRUD UI | Replace placeholder pages with TanStack Query calls to `/api/v1` | All core + key extended |
| Contract stabilization | Freeze request/response envelopes consumed by FE | All `/api/v1` |
| OpenAPI as source | Keep swagger-jsdoc `/api-docs` in lockstep with FE client | All |
| Pagination/normalization | FE relies on `meta` pagination defaults from constants | List endpoints |

**Exit criteria:** every core service has a real consuming UI screen; no
placeholder for P0 modules.

### 4.2 Phase 3 (PI-3) — Security Cutover

| Theme | Change | Affected services |
|-------|--------|-------------------|
| AuthN | Wire `auth` service (login/refresh), JWT verification middleware on routes | ALL |
| AuthZ / RBAC | Enforce role checks (Staff.role) per endpoint | ALL |
| Tenancy | Scope every query by `tenantId`; close cross-tenant reads | ALL |
| Portal isolation | Enforce client-portal data isolation | client-portal |
| PHI/PII crypto | Apply field-crypto to sensitive fields (currently 0) | patients, clients, medical-records, prescriptions |
| Audit | Extend AuditLog from ~7/34 to all mutating services | ALL writes |
| Payments | Integrate real Payment Provider SDK (charges/refunds/status) | invoices, refunds, payment-plans |

**Exit criteria:** no unauthenticated mutating route; tenant isolation verified;
PHI/PII encrypted at rest; real payment capture.

### 4.3 Phase 4 (PI-4) — Hardening, Versioning & Scale

| Theme | Change | Affected services |
|-------|--------|-------------------|
| API versioning | Introduce `/api/v2` strategy; deprecation policy for `/api/v1` | ALL |
| Per-service SLOs | Histograms + SLO alerting (SvcV-7 targets become enforced) | ALL |
| Contract testing | Consumer-driven contract tests in CI (FE↔API, webhook consumers) | ALL + webhooks |
| Resilience activation | Activate `circuit-breaker.ts` / `retry.ts` on external calls | SendGrid, Twilio, Payment, Lab |
| Observability | OpenTelemetry tracing; replace in-memory `/metrics` with Prometheus | ALL |
| Async hardening | Authenticate Bull Board; DLQ + retry policy review | jobs, webhooks |

**Exit criteria:** SLOs enforced; external calls protected by breakers; tracing
end-to-end; `/api/v2` path established.

---

## 5. Service Maturity by Phase (matrix)

Legend: ❌ none · ◐ partial / in progress · ✅ done

| Service / Concern | PI-1 (now) | PI-2 | PI-3 | PI-4 |
|-------------------|:----------:|:----:|:----:|:----:|
| Core CRUD services | ✅ ~85% | ✅ | ✅ | ✅ |
| Frontend consumption | ❌ | ✅ | ✅ | ✅ |
| AuthN (auth wired) | ❌ | ❌ | ✅ | ✅ |
| RBAC enforcement | ❌ | ❌ | ✅ | ✅ |
| Tenant isolation | ❌ | ❌ | ✅ | ✅ |
| PHI/PII at-rest crypto | ❌ | ❌ | ✅ | ✅ |
| AuditLog coverage | ◐ ~7/34 | ◐ | ✅ | ✅ |
| Payment Provider | ❌ aspirational | ❌ | ✅ | ✅ |
| External Lab | ❌ planned | ❌ | ◐ | ✅ |
| Circuit breakers active | ❌ unused | ❌ | ◐ | ✅ |
| Per-service SLO monitoring | ❌ | ❌ | ◐ | ✅ |
| Prometheus/OTel | ❌ in-mem | ❌ | ◐ | ✅ |
| API versioning (/api/v2) | ❌ | ❌ | ❌ | ✅ |
| Contract testing | ❌ | ◐ | ◐ | ✅ |

---

## 6. Service Decommission / Deprecation

| Item | Action | Phase | Rationale |
|------|--------|-------|-----------|
| Unauthenticated `/api/v1` access | Deprecate | PI-3 | Replaced by JWT-gated access |
| Unauthenticated Bull Board | Deprecate | PI-4 | Secure admin UI |
| In-memory `/metrics` JSON | Replace | PI-4 | Prometheus/OTel |
| `/api/v1` (long-term) | Deprecate after `/api/v2` GA | post-PI-4 | Versioning policy |

> No service modules are removed; evolution is additive/hardening. (The earlier
> NestJS/Next.js forks were already removed before this baseline — see AV-1.)

---

## 7. Dependencies and Risks

| ID | Dependency / Risk | Impacts | Mitigation |
|----|-------------------|---------|------------|
| EV-R1 | Auth cutover touches every route | PI-3 schedule | Centralize middleware; feature-flag rollout |
| EV-R2 | Tenancy retrofit on existing data | PI-3 | Backfill `tenantId`; migration + tests |
| EV-R3 | Payment Provider vendor selection pending | PI-3 payments | Abstract payment interface now |
| EV-R4 | Activating breakers may change error semantics | PI-4 | Contract tests before enabling |
| EV-R5 | Prometheus migration changes `/metrics` shape | PI-4 dashboards | Run both during transition |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-1 | Service catalog whose maturity evolves |
| SvcV-6 | Resource-flow contracts stabilized in PI-2 |
| SvcV-7 | Measures that become enforced SLOs in PI-4 |
| SvcV-9 | Technology/skills forecast enabling each phase |
| SvcV-10a | Rules (auth-required, tenancy) activated in PI-3 |
| SV-8 | Underlying systems evolution description |
| CV-3 | Capability phasing this service roadmap supports |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
