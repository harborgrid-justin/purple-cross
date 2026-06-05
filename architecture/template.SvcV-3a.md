# SvcV-3a: Systems-Services Matrix

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-3a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-3a maps **systems** (the SV-1 nodes S1–S5 plus the external D6 providers) to
the **services** (`SVC-x` from SvcV-1) they **host/realize** or **consume**. It
answers: *which system provides the runtime for each service, which system uses
it, and which data/cache/queue systems back it?* This is the bridge between the
Services Viewpoint and the Systems Viewpoint (SV-1/SV-3).

> ⚠️ **Honesty note.** Every in-scope REST service is **realized in the single
> Express process (S2)** — there is no per-service deployment isolation. The
> **auth service (SVC-25) is hosted but consumed by 0 routes** (the SPA hardcodes
> `isAuthenticated=true`). The **Payment Provider (SVC-33)** column is
> **aspirational** (no SDK wired). `/metrics` (SVC-37) is in-memory in S2, and the
> Bull Board UI on S5/S2 (`/admin/queues`) is **unauthenticated**.

---

## 2. System Legend

| System ID | System | Role | Reference |
|-----------|--------|------|-----------|
| **S1** | React/Vite SPA | Service consumer (staff + portal UI) | SV-1 |
| **S2** | Express API (Node/TS) | Primary service **host/realizer** + gateway | SV-1 |
| **S3** | PostgreSQL 15 (Prisma 6.18) | System of record (backing store) | SV-1 |
| **S4** | Redis 7 | Cache / queue broker (backing store) | SV-1 |
| **S5** | BullMQ worker | Async job executor (background host) | SV-1 |
| **X-SG** | SendGrid | External email provider (D6) | SvcV-1 |
| **X-TW** | Twilio | External SMS provider (D6) | SvcV-1 |
| **X-PAY** | Payment Provider | External payment provider (D6) — aspirational | SvcV-1 |
| **X-LAB** | External Lab | External diagnostics provider (D6) | SvcV-1 |
| **X-SEN** | Sentry | External error telemetry (D6) | SvcV-1 |

## 3. Relationship Legend

| Symbol | Meaning |
|--------|---------|
| **H** | **Hosts / realizes** the service runtime |
| **C** | **Consumes** the service (calls it) |
| **B** | **Backs** the service (data / cache / queue store) |
| **X** | **External realizer** (service is provided by a remote system) |
| **P** | **Planned** relationship (not yet wired) |
| (blank) | No relationship |

---

## 4. Systems-Services Matrix

> Columns are systems; rows are services. Read each row as: *who hosts it, who
> consumes it, what backs it.* External services (SVC-31..35) are realized by their
> remote system (X-*) and consumed by an internal service.

| Service (SVC-x) | S1 SPA | S2 API | S3 PG | S4 Redis | S5 Worker | External |
|-----------------|:------:|:------:|:-----:|:--------:|:---------:|:---------|
| SVC-01 Patients | C | H | B | B | | |
| SVC-02 Medical Records | C | H | B | B | | |
| SVC-03 Prescriptions | C | H | B | B | | |
| SVC-04 Lab Tests | C | H | B | B | | C→X-LAB |
| SVC-05 Breed Info | C | H | B | B | | |
| SVC-06 Clients | C | H | B | B | | |
| SVC-07 Appointments | C | H | B | B | C | |
| SVC-08 Waitlist | C | H | B | B | | |
| SVC-09 Time Blocks | C | H | B | B | | |
| SVC-10 Client Portal | C(P) | H | B | B | | |
| SVC-11 Communications | C | H | B | B | C | C→X-SG, C→X-TW |
| SVC-12 Patient Reminders | C | H | B | B | C | |
| SVC-13 Invoices | C | H | B | B | | C→X-PAY (P) |
| SVC-14 Estimates | C | H | B | B | | |
| SVC-15 Payment Plans | C | H | B | B | | C→X-PAY (P) |
| SVC-16 Refunds | C | H | B | B | | C→X-PAY (P) |
| SVC-17 Insurance Claims | C | H | B | B | | |
| SVC-18 Loyalty Programs | C | H | B | B | | |
| SVC-19 Inventory | C | H | B | B | | |
| SVC-20 Purchase Orders | C | H | B | B | | |
| SVC-21 Equipment | C | H | B | B | | |
| SVC-22 Staff | C | H | B | B | | |
| SVC-23 Documents | C | H | B | B | | |
| SVC-24 Analytics | C | H | B | B | | |
| SVC-25 Auth | C(P) | H | B | B | | **P (0 routes consume)** |
| SVC-26 Webhooks | C | H | B | B | C | C→ext subscribers |
| SVC-27 Workflows | C | H | B | B | C | |
| SVC-28 Workflow Templates | C | H | B | B | | |
| SVC-29 Workflow Executions | C | H | B | B | C | |
| SVC-30 Cache | | C/H | | B/H | C | |
| SVC-31 Email (SendGrid) | | C | | | | X (X-SG) |
| SVC-32 SMS (Twilio) | | C | | | | X (X-TW) |
| SVC-33 Payment Provider | | C(P) | | | | X (X-PAY, aspirational) |
| SVC-34 External Lab | | C | | | | X (X-LAB) |
| SVC-35 Sentry | (C) | C | | | C | X (X-SEN) |
| SVC-36 Health | | H | B(probe) | B(probe) | | |
| SVC-37 Metrics | | H | | | | (in-memory in S2) |
| SVC-38 Domain Events | | C/H | | | C | |
| SVC-39 Job Queue (BullMQ) | | C | | B | H | |
| SVC-40 Document Templates | C | H | B | B | | |
| SVC-41 Report Templates | C | H | B | B | | |
| SVC-42 Policies | C | H | B | B | | |
| SVC-43 Feedback | C | H | B | B | | |
| SVC-44 Marketing Campaigns | C | H | B | B | C | |
| SVC-45 Patient Relationships | C | H | B | B | | |

---

## 5. System Hosting Summary

| System | Hosts (H) | Consumes (C) | Backs (B) | Notes |
|--------|----------:|-------------:|----------:|-------|
| **S1 SPA** | 0 | ~40 (REST) | 0 | Pure consumer; portal consumption IN PROGRESS |
| **S2 API** | ~39 | several (orchestration, external calls) | — | Single realizer of all in-scope services |
| **S3 PostgreSQL** | 0 | 0 | ~39 | Backing store for all stateful services |
| **S4 Redis** | (SVC-30 co-host) | — | cache + queue for all | Cache (SVC-30) + queue (SVC-39) backing |
| **S5 Worker** | SVC-39 | SVC-07/11/12/26/27/29/44 | — | Background execution host |
| **External (X-*)** | SVC-31..35 | — | — | Remote realizers; X-PAY aspirational |

---

## 6. Honesty & Gap Notes

| Matrix Cell | Reality | Status |
|-------------|---------|--------|
| SVC-25 Auth consumption | Hosted in S2 but **0 routes consume** it | PLANNED |
| SVC-33 Payment realizer | X-PAY column is intent only; no SDK in S2 | Aspirational |
| Per-service isolation | All services co-hosted in one S2 process | By design (monolith) |
| SVC-37 Metrics backing | In-memory in S2; not persisted to S3/S4 | PARTIAL |
| SVC-39 Bull Board | Queue UI on S2/S5 unauthenticated | PARTIAL |
| Tenant isolation in S3 | `tenantId` present, not enforced in queries | PLANNED |
| SVC-10 portal consumer (S1) | FE largely placeholder | IN PROGRESS |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SvcV-1 | Source of the `SVC-x` registry rows |
| SvcV-3b | Service-to-service dependencies (NxN) |
| SvcV-2 | Resource flows realized across these systems |
| SV-1 | System interface description (S1–S5 + external) |
| SV-3 | Systems-systems matrix (system pairings) |
| SV-4 | System functions realizing service functionality |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
