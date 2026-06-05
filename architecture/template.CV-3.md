# CV-3: Capability Phasing

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-3-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-3 shows **when** each capability (from CV-2) is delivered across the four
Program Increments (PI-1..PI-4 / 2025Q3..2026Q4). It is a capability × increment
matrix with honest **Delivered / In Progress / Planned** status, aligned to the
CV-1 phasing (Phase 1 backend, Phase 2 frontend, Phase 3 AuthN/Z + tenancy,
Phase 4 hardening/scale).

> ⚠️ **Honesty note.** Backend services are ~85% real, so most CAP backend tiers
> are **Delivered** by PI-1. The frontend is ~15–20% real, so UI delivery is
> mostly **In Progress / Planned**. **Auth, RBAC, tenancy, audit, and at-rest
> encryption are Planned for Phase 3/Phase 4** and are NOT delivered.

---

## 2. Phasing Timeline

```
        PI-1            PI-2            PI-3            PI-4
       (2025Q3)        (2025Q4)        (2026Q1-2)      (2026Q3-4)
      Phase 1          Phase 2          Phase 3          Phase 4
      Backend          Frontend         AuthN/Z +        Hardening +
      services         real CRUD        tenancy          scale
  +-------------+  +-------------+  +-------------+  +-------------+
  | CAP-1.* BE  |  | CAP-1.* UI  |  | CAP-4.3     |  | CAP-4.3     |
  | CAP-2.* BE  |  | CAP-2.* UI  |  | auth/RBAC   |  | at-rest enc |
  | CAP-3.* BE  |  | CAP-3.* UI  |  | tenant scope|  | audit 100%  |
  | CAP-4.* BE  |  | (in prog)   |  | audit write |  | perf/scale  |
  | (delivered) |  |             |  | (PLANNED)   |  | (PLANNED)   |
  +-------------+  +-------------+  +-------------+  +-------------+
        |                |                |                |
   We are here  --------/                 |                |
   (2026-06): BE mostly done, FE partial, security NOT started
```

---

## 3. Capability Phasing Matrix (backend tier)

Legend: **D** = Delivered · **IP** = In Progress · **P** = Planned

| Capability | PI-1 (BE) | PI-2 (UI) | PI-3 (Sec) | PI-4 (Scale) |
|------------|:---------:|:---------:|:----------:|:------------:|
| CAP-1.1 Patient Records (EHR) | D | IP | P | P |
| CAP-1.2 Prescriptions | D | P | P | P |
| CAP-1.3 Laboratory & Diagnostics | D | P | P | P |
| CAP-2.1 Client Mgmt & Portal | D | IP | P | P |
| CAP-2.2 Appointment Scheduling | D | IP | P | P |
| CAP-2.3 Communications & Reminders | D | P | P | P |
| CAP-3.1 Billing & Revenue | D | P | P | P |
| CAP-3.2 Inventory & Supply Chain | D | P | P | P |
| CAP-3.3 Workforce | D | P | P | P |
| CAP-4.1 Analytics & Reporting | D | P | P | P |
| CAP-4.2 Documents & Content | D | P | P | P |
| CAP-4.3 Platform & Observability | D* | n/a | — | IP |
| CAP-4.3 **Security (auth/RBAC/tenancy/audit)** | **P** | n/a | **P** | **P** |

> \* CAP-4.3 *observability* (health, metrics, logging) is Delivered. CAP-4.3
> *security* is a separate line and is **Planned** — the `auth.ts` middleware
> exists but is imported by zero routes; `authorize()` is unenforced; tenant
> scoping and audit writes are not applied.

---

## 4. Increment Goals and Exit Criteria

| PI | Phase | Goal | Exit Criteria | Status |
|----|-------|------|---------------|--------|
| PI-1 | Backend services | All 37 module services on Prisma, REST `/api/v1`, validation, observability | Services callable & validated; ~85% real | **Mostly Delivered** |
| PI-2 | Frontend real CRUD | Replace placeholder pages with real list/create/edit | Core workflows usable in SPA | **In Progress (~15–20%)** |
| PI-3 | AuthN/Z + tenancy | JWT wired on all routes, RBAC enforced, tenant-scoped queries, audit writes | 100% routes authenticated/scoped | **Planned** |
| PI-4 | Hardening + scale | At-rest crypto, audit 100%, 500+ users/tenant, p95 < 300 ms, 99.9% uptime | Load + security audit pass | **Planned** |

---

## 5. Phasing of Cross-Cutting Platform Concerns

| Concern | Artifact in Code | Today | Target Phase |
|---------|------------------|-------|--------------|
| Authentication | `middleware/auth.ts` | Exists, wired to **0 routes** | PI-3 |
| Authorization (RBAC) | `authorize()` | Defined, **unenforced** | PI-3 |
| Multi-tenancy | `tenantId` columns | Present, queries **not scoped** | PI-3 |
| Audit logging | `AuditLog` model | ~7 of 34 services write | PI-3→PI-4 |
| At-rest encryption | `field-crypto` util | Applied to **0 fields** (PHI/PII plaintext) | PI-4 |
| Resilience | `circuit-breaker.ts`, `retry.ts` | Present, **currently unused** | PI-4 |
| Job queue | BullMQ/Redis | Present | PI-2→PI-4 |
| Frontend auth gate | `ProtectedRoute` | Hardcodes `isAuthenticated=true` | PI-3 |

---

## 6. Phasing Risks

| Risk ID | Risk | Phase Impacted | Mitigation |
|---------|------|----------------|------------|
| PR-1 | Security slips past PI-3 → no production launch | PI-3/PI-4 | Treat AuthN/Z as P0 gate (see CV-4) |
| PR-2 | Frontend CRUD backlog larger than estimated | PI-2 | Prioritize core clinical + scheduling pages first |
| PR-3 | At-rest encryption retrofit on existing rows | PI-4 | Plan migration + key management early |
| PR-4 | Audit coverage gap blocks compliance sign-off | PI-3 | Add audit writes to all 34 services |

---

## 7. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-1 Vision** | Source of the PI goals sequenced here |
| **CV-2 Capability Taxonomy** | Source of the CAP IDs phased here |
| **CV-4 Capability Dependencies** | Explains why security gates production |
| **SV-8 / SvcV-8** | Systems/services evolution that realizes this phasing |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
