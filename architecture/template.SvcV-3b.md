# SvcV-3b: Services-Services Matrix

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-3b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-3b is the **N×N services-to-services dependency matrix**: it records, for each
ordered pair of Purple Cross services (`SVC-x` from SvcV-1), whether and how the
**row service depends on the column service**. Dependencies are abstracted from the
SvcV-2 resource flows (`SF-x`) into three types — **calls**, **emits-event**, and
**shares-data** — so the platform's coupling and blast radius can be reasoned about.

> ⚠️ **Honesty note.** The largest dependency is **aspirational/planned**: every
> service *should* depend on **auth (SVC-25)**, but **0 routes enforce it**, so the
> "all → auth" column is marked **P (planned)** throughout. Billing → **Payment
> Provider (SVC-33)** dependencies are **aspirational** (no SDK). Event coverage is
> **partial** — only some services emit to the domain-events bus (SVC-38). The
> cache (SVC-30) dependency is real and near-universal.

---

## 2. Dependency Type Legend

| Symbol | Type | Meaning | Flow source |
|--------|------|---------|-------------|
| **▸** | **calls** | Row service synchronously invokes column service (in-proc or REST) | SF-10..15, SF-19..24 |
| **◇** | **emits-event** | Row service emits an event the column service subscribes to | SF-16..18 |
| **▪** | **shares-data** | Services read/write the same entities / foreign keys | SF-15, SF-30 |
| **P** | **planned** | Dependency intended but not wired | auth, payment |
| (blank) | none | No direct dependency |

> A pair may carry more than one symbol. Cache (SVC-30) and auth (SVC-25, planned)
> are factored out of the grid as near-universal dependencies (see §4) to keep the
> matrix legible.

---

## 3. Core Services-Services Dependency Matrix

> Read **row depends on column**. Columns abbreviated by SVC number. Near-universal
> dependencies (→SVC-30 cache real, →SVC-25 auth planned, →SVC-35 Sentry, →SVC-38
> events) are summarized in §4 rather than repeated in every row.

| Row ↓ \ Col → | 01 Pat | 02 MR | 03 Rx | 04 Lab | 06 Cli | 07 Apt | 08 Wl | 11 Com | 13 Inv | 15 PP | 16 Ref | 19 Inv | 20 PO | 27 Wf |
|---------------|:------:|:-----:|:-----:|:------:|:------:|:------:|:-----:|:------:|:------:|:-----:|:------:|:------:|:-----:|:-----:|
| **01 Patients** | — | | | | ▪ | | | | | | | | | |
| **02 Medical Records** | ▪ | — | ▪ | ▪ | | | | | | | | | | |
| **03 Prescriptions** | ▪ | ▪ | — | | | | | | | | | ▸▪ | | |
| **04 Lab Tests** | ▪ | ▸ | | — | | | | | | | | | | |
| **06 Clients** | ▪ | | | | — | | | | | | | | | |
| **07 Appointments** | ▪ | | | | ▪ | — | ▸◇ | ◇ | | | | | | ◇ |
| **08 Waitlist** | ▪ | | | | ▪ | ▪ | — | ◇ | | | | | | |
| **11 Communications** | | | | | ▪ | | | — | | | | | | ◇ |
| **13 Invoices** | ▪ | | | | ▪ | ▪ | | ◇ | — | ▸ | ▸▪ | | | ◇ |
| **15 Payment Plans** | | | | | ▪ | | | | ▸▪ | — | | | | |
| **16 Refunds** | | | | | | | | | ▸▪ | | — | | | |
| **17 Insurance Claims** | ▪ | ▪ | | | ▪ | | | | ▸▪ | | | | | |
| **19 Inventory** | | | | | | | | | | | | — | ◇ | |
| **20 Purchase Orders** | | | | | | | | | | | | ▸◇ | — | |
| **12 Reminders** | ▪ | | | | ▪ | ▸ | | ▸ | | | | | | ◇ |
| **27 Workflows** | ▸ | ▸ | ▸ | ▸ | ▸ | ▸ | ▸ | ▸ | ▸ | | | ▸ | ▸ | — |

> Legend recap: ▸ calls · ◇ emits-event (consumed by col) · ▪ shares-data · P planned.
> SVC-27 Workflows can orchestrate nearly any service (engine-driven `calls`), so its
> row is broadly populated.

---

## 4. Near-Universal Dependencies (factored out of the grid)

| From (rows) | To (column service) | Type | Reality |
|-------------|---------------------|------|---------|
| ~all stateful services | **SVC-30 Cache** | ▸ calls (read-through/invalidate) | **Real** |
| **all `/api/v1` services** | **SVC-25 Auth** | ▸ calls (authn/authz) | **P — PLANNED (0 routes enforce)** |
| ~all services | **SVC-35 Sentry** | ▸ calls (error report) | Real (best-effort) |
| event-emitting services | **SVC-38 Domain Events** | ◇ emits-event | Real (partial coverage) |
| **SVC-26 Webhooks**, **SVC-27 Workflows** | **SVC-38 Domain Events** | ▸ subscribes | Real |
| **SVC-12 Reminders**, **SVC-29 Wf Exec**, **SVC-44 Marketing** | **SVC-39 Job Queue** | ▸ calls (enqueue) | Real |
| ~all services | **SVC-30/S3** AuditLog write | ▪ shares-data | **PARTIAL (~7/34 services)** |

---

## 5. Key Dependency Chains

| Chain | Services | Type sequence | Notes |
|-------|----------|---------------|-------|
| **Billing settle** | SVC-13 → SVC-15/16 → SVC-33 | calls → calls → calls(P) | Payment leg aspirational |
| **Reminders** | SVC-07 → SVC-12 → SVC-39 → SVC-11 → SVC-31/32 | event → enqueue → call → external | Real end-to-end (providers external) |
| **Booking/waitlist** | SVC-07 ↔ SVC-08 → SVC-11 | calls/event → notify | Real |
| **Pharmacy stock** | SVC-03 → SVC-19 → SVC-20 | calls/shares → reorder | Real |
| **Diagnostics** | SVC-04 → SVC-34; SVC-04 → SVC-02 | call(ext) / shares | Inbound result callback PLANNED |
| **Automation fan-out** | SVC-27 → many | calls (engine) | Real; broad blast radius |
| **Event distribution** | (many) → SVC-38 → SVC-26/27 | emit → subscribe | Real, partial emitter coverage |

---

## 6. Honesty & Gap Notes

| Dependency | Reality | Status |
|------------|---------|--------|
| all → SVC-25 Auth | Intended universal dependency; **enforced nowhere** | PLANNED |
| SVC-13/15/16 → SVC-33 Payment | Charge/refund calls not wired (no SDK) | Aspirational |
| SVC-04 ← SVC-34 result callback | Inbound dependency not yet authenticated | PLANNED |
| (many) → SVC-38 events | Only part of services emit events | PARTIAL |
| services → AuditLog | Written by ~7/34 services | PARTIAL |
| RBAC between services | No role-aware authorization | PLANNED |
| Tenant scoping | `tenantId` not enforced across dependencies | PLANNED |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SvcV-1 | Service catalog (`SVC-x`) defining the matrix axes |
| SvcV-2 | `SF-x` flows abstracted into these dependencies |
| SvcV-3a | Systems that host the depending/depended services |
| SvcV-4 | Operations within each service that issue the calls/events |
| SV-3 | Systems-systems matrix at the runtime layer |
| CV-7 | Capability-to-services mapping (coupling per capability) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
