# SvcV-5: Operational Activity to Services Traceability Matrix

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-5-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-5 traces **OV-5a operational activities** (what the practice does) to the
**services** (`SVC-x` from SvcV-1) that **realize** them. It closes the loop from
the Operational Viewpoint to the Services Viewpoint, showing that every activity is
supported by at least one service and surfacing where realization is **PLANNED**
(notably Platform Operations, which depends on the unwired auth service).

> ⚠️ **Honesty note.** Activity coverage by services is broad and **mostly real on
> the backend (~85%)**, but several traces are **conditional**: **A9 Platform
> Operations** depends on **auth (SVC-25), which is unwired**; **A5 Billing &
> Revenue** settlement depends on the **aspirational Payment Provider (SVC-33)**;
> and **A7/A8** audit/compliance realization is **partial** (AuditLog in ~7/34
> services, field-crypto 0 fields). Client-facing realization through the portal
> (SVC-10) is **IN PROGRESS**.

---

## 2. Operational Activity Legend (from OV-5a)

| Activity ID | Operational Activity | Description |
|-------------|----------------------|-------------|
| **A1** | Manage Clients & Patients | Register/maintain client and patient records |
| **A2** | Schedule & Intake | Book, waitlist, check-in, manage availability |
| **A3** | Deliver Clinical Care | Document visits, medical records, treatment |
| **A4** | Diagnostics & Pharmacy | Order labs, results, prescriptions, dispense |
| **A5** | Billing & Revenue | Estimates, invoices, payments, plans, refunds, claims |
| **A6** | Inventory & Supply | Stock, purchasing, equipment, reorder |
| **A7** | Communications & Engagement | Reminders, messaging, loyalty, feedback, marketing, portal |
| **A8** | Compliance & Records | Documents, policies, audit, controlled-substance logs |
| **A9** | Platform Operations | Auth, health, metrics, workflows, webhooks, cache, queue |

## 3. Realization Legend

| Symbol | Meaning |
|--------|---------|
| **●** | **Primary** realizing service for the activity |
| **○** | **Supporting** service (contributes) |
| **P** | Realization **PLANNED / unwired** |
| **A** | Realization **aspirational** (no integration) |
| (blank) | No realization role |

---

## 4. Operational Activity → Services Traceability Matrix

> Read **activity (row) realized by service (column)**. Columns abbreviated by SVC
> number; near-universal platform services (cache SVC-30, events SVC-38, queue
> SVC-39) and the planned auth SVC-25 are summarized in §5.

| Activity ↓ \ Service → | 01 | 02 | 03 | 04 | 06 | 07 | 08 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 26 | 27 | 42 | 43 | 44 | 10 |
|------------------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **A1 Clients & Patients** | ● | ○ | | | ● | | | | | | | | | | | | | | | | | | | | | | ○ |
| **A2 Schedule & Intake** | ○ | | | | ○ | ● | ● | ○ | ○ | | | | | | | | | | ○ | | | | ○ | | | | ○ |
| **A3 Clinical Care** | ○ | ● | ● | ○ | | ○ | | | | | | | | | | ○ | | | ○ | ○ | | | | | | | |
| **A4 Diagnostics & Pharmacy** | ○ | ○ | ● | ● | | | | | | | | | | | | ○ | | | | | | | | | | | |
| **A5 Billing & Revenue** | ○ | | | | ○ | ○ | | | | ● | ● | ● | ●A | ● | ○ | | | | | | ○ | | ○ | | | | ○ |
| **A6 Inventory & Supply** | | | ○ | | | | | | | | | | | | | ● | ● | ● | ○ | | | | | | | | |
| **A7 Comms & Engagement** | ○ | | | | ○ | ○ | ○ | ● | ● | | | | | | ● | | | | | | | ○ | ○ | | ● | ● | ● |
| **A8 Compliance & Records** | ○ | ●P | ○ | ○ | ○ | | | | | | | | | ○ | | | | ○ | ○ | ● | ○ | ○ | ○ | ● | | | |
| **A9 Platform Operations** | | | | | | | | | | | | | | | | | | | | | ○ | ● | ● | | | | |

> `●A` (A5 / SVC-16 settle) = aspirational payment settlement. `●P` (A8 / SVC-02
> PHI) = compliant records realization planned (encryption/audit gaps). A9's
> primary auth dependency is captured in §5.

---

## 5. Near-Universal & Planned Realizations (factored out)

| Service | Realizes (activities) | Role | Reality |
|---------|------------------------|------|---------|
| **SVC-25 Auth** | A9 (and gating A1–A8) | Primary platform control | **P — PLANNED (unwired)** |
| **SVC-30 Cache** | A1–A9 (performance) | Supporting | Real |
| **SVC-36 Health** | A9 | Supporting (ops) | Real |
| **SVC-37 Metrics** | A9 | Supporting (ops) | PARTIAL (in-memory) |
| **SVC-38 Domain Events** | A2, A5, A7, A9 | Supporting (eventing) | Real (partial emitters) |
| **SVC-39 Job Queue** | A7 (reminders), A9 (workflows) | Supporting (async) | Real |
| **SVC-33 Payment Provider** | A5 (settlement) | Primary (intended) | **A — Aspirational** |
| **SVC-34 External Lab** | A4 (diagnostics) | Supporting (external) | Real (callback PLANNED) |
| **SVC-31/32 Email/SMS** | A7 (outreach) | Supporting (external) | Real |

---

## 6. Activity Realization Summary

| Activity | Primary Services | Supporting | Realization Status |
|----------|------------------|------------|--------------------|
| A1 Clients & Patients | SVC-01, SVC-06 | SVC-02, SVC-10 | Real |
| A2 Schedule & Intake | SVC-07, SVC-08 | SVC-09, SVC-11, SVC-12, SVC-10 | Real (portal IN PROGRESS) |
| A3 Clinical Care | SVC-02, SVC-03 | SVC-01, SVC-04, SVC-23 | Real (PHI plaintext) |
| A4 Diagnostics & Pharmacy | SVC-03, SVC-04 | SVC-19, SVC-34 | Real (lab callback PLANNED) |
| A5 Billing & Revenue | SVC-13/14/15/16/17 | SVC-18, SVC-24, SVC-33 | Real (settlement aspirational) |
| A6 Inventory & Supply | SVC-19, SVC-20, SVC-21 | SVC-03, SVC-22 | Real |
| A7 Comms & Engagement | SVC-11, SVC-12, SVC-18, SVC-43, SVC-44, SVC-10 | SVC-26, SVC-27 | Real (portal IN PROGRESS) |
| A8 Compliance & Records | SVC-23, SVC-42 | SVC-02, SVC-26, audit | PARTIAL (audit ~7/34, crypto 0) |
| A9 Platform Operations | SVC-25, SVC-26, SVC-27 | SVC-30/36/37/38/39 | Auth PLANNED; rest Real/Partial |

---

## 7. Honesty & Gap Notes

| Trace | Reality | Status |
|-------|---------|--------|
| A9 ← SVC-25 Auth (primary) | Auth unwired; enforces 0 routes | PLANNED |
| All activities gated by auth | No access control on any activity | PLANNED |
| A5 ← SVC-33 settlement | No payment gateway; manual records | Aspirational |
| A4 ← SVC-34 result intake | Inbound callback unauthenticated | PLANNED |
| A8 audit/crypto realization | AuditLog ~7/34 services; crypto 0 fields | PARTIAL |
| A1/A2/A7 ← SVC-10 portal | Endpoints exist; FE largely placeholder | IN PROGRESS |
| Multi-tenant scoping | `tenantId` unenforced across all activities | PLANNED |

---

## 8. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-5a | Source of operational activities A1–A9 |
| OV-5b | Activity model detail for these activities |
| SvcV-1 | Service catalog (`SVC-x`) realizing the activities |
| SvcV-4 | Service operations (`SFN-x`) that perform the activities |
| SV-5a / SV-5b | Operational activity → systems traceability |
| CV-6 / CV-7 | Capability ↔ activity ↔ services mappings |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
