# SV-8: Systems Evolution Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-8-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-8 describes the **planned evolution** of the Purple Cross systems from their
**current baseline** to a **production-ready target state**, sequenced across the
program increments **PI-1 … PI-4 (2025 Q3 → 2026 Q4)**. It captures how the
Express API (S1), PostgreSQL (S2), Redis (S3), BullMQ worker (S4), and external
provider integrations (S5) mature over time, and which **technical-debt** items
are retired in each phase. SV-8 consumes the honest gap summary from **SV-7**,
aligns with capability phasing in **CV-3**, and forecasts the enabling
technology in **SV-9**.

> ⚠️ **Honesty note.** The baseline is deliberately conservative: backend
> services are **~85% real**, but **authentication is not wired (0 routes
> enforced)**, RBAC is unenforced, `tenantId` is unscoped, audit logging covers
> only ~7/34 services, field-level encryption is applied to **0 fields** (PHI/PII
> at rest is plaintext), tests mock Prisma, `/metrics` is in-memory JSON, and the
> `circuit-breaker.ts` / `retry.ts` utilities exist but are **unused**. Each
> future-state claim below is therefore marked **PLANNED / IN PROGRESS** until
> the gating phase delivers it.

---

## 2. Evolution Timeline

```
   PI-1            PI-2            PI-3              PI-4
  (2025 Q3)       (2025 Q4)       (2026 Q1-Q2)      (2026 Q3-Q4)
     |               |                |                  |
     v               v                v                  v
+-----------+   +-----------+   +--------------+   +-----------------+
| Phase 1   |   | Phase 2   |   | Phase 3      |   | Phase 4         |
| Backend   |-->| Frontend  |-->| AuthN/Z +    |-->| Harden + scale  |
| services  |   | real CRUD |   | RBAC +       |   | (crypto, real-DB|
| (~85%)    |   |           |   | multi-tenancy|   | tests, metrics, |
| + consol- |   |           |   | enforcement  |   | resilience, K8s)|
| idation   |   |           |   |              |   |                 |
+-----------+   +-----------+   +--------------+   +-----------------+
     |               |                |                  |
     v               v                v                  v
 Services real   Pages live      Security cutover   Production-ready
 Forks removed   (in progress)   (gating item)      (RTO/RPO proven)

  Legend: [DONE] PI-1 mostly complete  [IN PROGRESS] PI-2  [PLANNED] PI-3/PI-4
```

---

## 3. Current Baseline (As-Is, 2026-06)

| Element | System | State | Evidence |
|---------|--------|-------|----------|
| Layered services (route→controller→service→Prisma) | S1 | ~85% real | `backend/src/services/*` |
| PostgreSQL schema (15+ models) | S2 | real | `backend/prisma/schema.prisma` |
| Redis cache / BullMQ broker | S3/S4 | wired | `config/redis.ts`, `worker.ts` |
| Cross-cutting middleware (correlation, sanitize, rate-limit, metrics, timeout) | S1 | live | `app.ts` |
| Authentication / authorization | S1 | **NOT wired** (0 routes) | `middleware/auth.ts` defined, unused |
| RBAC enforcement | S1 | **PLANNED** | `authorize()` not applied |
| Multi-tenant isolation (`tenantId`) | S1/S2 | **unscoped** | Prisma extension PLANNED |
| Audit logging | S1 | partial (~7/34 services) | `utils/audit-logger.ts` |
| Field-level encryption (PHI/PII) | S2 | **0 fields** (plaintext) | `utils/field-crypto.ts` unused |
| Tests | S1 | mocked Prisma | `jest.config.js` |
| Metrics | S1 | in-memory JSON | `middleware/metrics.ts`, `/metrics` |
| Circuit breaker / retry | S1 | **dead code (unused)** | `utils/circuit-breaker.ts`, `retry.ts` |
| Legacy NestJS / Next.js forks | — | **REMOVED (consolidated)** | single Express+Vite stack |

---

## 4. Target State (To-Be, end PI-4)

| Element | Target State | Phase |
|---------|--------------|-------|
| AuthN/Z + RBAC | JWT auth enforced on all routes; role-based authorization | Phase 3 |
| Multi-tenancy | `tenantId` scoped via Prisma extension on every query | Phase 3 |
| Audit logging | All mutating services emit `AuditLog` entries | Phase 3→4 |
| Field encryption | PHI/PII fields encrypted at rest via `field-crypto` extension | Phase 4 |
| Testing | Real-DB integration tests (testcontainers / ephemeral PG) | Phase 4 |
| Metrics | Prometheus exporter + Grafana dashboards; OpenTelemetry traces | Phase 4 |
| Resilience | `circuit-breaker` + `retry` activated on external calls (S5) | Phase 4 |
| Deployment | Kubernetes + Helm; tested backup/restore (RTO/RPO proven) | Phase 4 |
| Frontend | All placeholder pages replaced with real CRUD | Phase 2 |

---

## 5. Capability-by-Phase Matrix

| Capability / System Feature | PI-1 (P1) | PI-2 (P2) | PI-3 (P3) | PI-4 (P4) |
|-----------------------------|-----------|-----------|-----------|-----------|
| Backend module services (CRUD) | ✅ ~85% | ✅ hardened | ✅ | ✅ |
| Stack consolidation (drop NestJS/Next.js) | ✅ done | — | — | — |
| Frontend real CRUD pages | ⬚ placeholder | 🔄 in progress | ✅ | ✅ |
| JWT authentication enforced | ⬚ | ⬚ | 🔄→✅ | ✅ |
| RBAC authorization | ⬚ | ⬚ | 🔄→✅ | ✅ |
| Tenant isolation (`tenantId` scoping) | ⬚ | ⬚ | 🔄→✅ | ✅ |
| Audit logging (all services) | ⬚ ~7/34 | ⬚ | 🔄 | ✅ |
| At-rest field encryption (PHI/PII) | ⬚ 0 fields | ⬚ | ⬚ | 🔄→✅ |
| Real-DB integration tests | ⬚ mocked | ⬚ | 🔄 | ✅ |
| Prometheus / Grafana / OTel | ⬚ JSON | ⬚ | ⬚ | 🔄→✅ |
| Circuit-breaker / retry activation | ⬚ unused | ⬚ | ⬚ | 🔄→✅ |
| Kubernetes / Helm + backup/restore | ⬚ compose | ⬚ | ⬚ | 🔄→✅ |

> Legend: ✅ delivered · 🔄 in progress · ⬚ not started / placeholder

---

## 6. Technical-Debt Retirement Schedule

| Debt ID | Description | Current Risk | Retired In | Resolution |
|---------|-------------|--------------|------------|------------|
| TD-01 | Authentication not wired (0 routes) | HIGH | Phase 3 | Apply `authenticate` to all `/api/v1` routers |
| TD-02 | RBAC unenforced | HIGH | Phase 3 | Apply `authorize(role)` per route |
| TD-03 | `tenantId` unscoped (cross-tenant exposure) | HIGH | Phase 3 | Prisma client extension scoping every query |
| TD-04 | PHI/PII plaintext at rest | HIGH | Phase 4 | Activate `field-crypto` on flagged fields |
| TD-05 | Audit logging partial (~7/34) | MEDIUM | Phase 3→4 | Service-layer audit wrapper for all mutations |
| TD-06 | Mocked-DB tests overstate coverage | MEDIUM | Phase 4 | Ephemeral PostgreSQL integration tests |
| TD-07 | `/metrics` in-memory JSON, not Prometheus | MEDIUM | Phase 4 | `prom-client` exporter + scrape path |
| TD-08 | Circuit-breaker / retry unused (dead code) | MEDIUM | Phase 4 | Wrap S5 calls; emit SM-17/18 |
| TD-09 | Bull Board admin-guarded only by ad-hoc check | LOW | Phase 3 | Move behind enforced RBAC |
| TD-10 | Single-node compose; no tested DR | MEDIUM | Phase 4 | K8s/Helm + backup/restore drills |

---

## 7. Migration / Sequencing Constraints

| Constraint ID | Constraint | Rationale |
|---------------|------------|-----------|
| SEQ-01 | Auth (TD-01/02) must precede tenant scoping (TD-03) | Principal identity required to scope queries |
| SEQ-02 | Tenant scoping must precede public launch | Prevent cross-tenant data exposure |
| SEQ-03 | Real-DB tests (TD-06) should precede crypto rollout (TD-04) | Validate migrations against real engine |
| SEQ-04 | Prometheus (TD-07) precedes alerting thresholds (SV-7 §6) | Need scrapable series first |
| SEQ-05 | Resilience activation (TD-08) precedes K8s autoscaling | Avoid retry storms during scale events |

---

## 8. Completed Consolidation (Already Retired)

| Item | Former State | Action | Outcome |
|------|--------------|--------|---------|
| NestJS backend fork | Parallel migration target | **Removed** | Single Express backend |
| Next.js frontend fork | Parallel migration target | **Removed** | Single Vite/React frontend |
| Duplicate constants | Scattered literals | Centralized | `constants/index.ts` (both modules) |

---

## 9. Cross-References

| View | Relationship |
|------|--------------|
| SV-7 | Supplies the measurement gaps this roadmap retires |
| SV-9 | Forecasts the technology/skills enabling each phase |
| SV-10a | Rules whose enforcement status flips as phases land |
| SV-10b | State machines (circuit breaker) activated in Phase 4 |
| CV-3 | Capability phasing aligned to PI-1…PI-4 |
| AV-1 | §6 risks/recommendations these phases mitigate |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
