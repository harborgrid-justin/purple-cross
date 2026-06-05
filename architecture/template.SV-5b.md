# SV-5b: Operational Activity to Systems Traceability Matrix

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-5b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-5b traces **operational activities** (OV-5a, A1–A9) to the **systems and
implementing modules** that perform them. Where [SV-5a](template.SV-5a.md) maps
activities to *functions* (SF-x), SV-5b maps the same activities to the concrete
**backend modules** and the **systems** (S1–S5 from [SV-1](template.SV-1.md)) that
host them. This shows, per activity, "what is deployed to do this."

> ⚠️ **Honesty note.** Every activity is realized by **S2** (Express API) backed
> by **S3** (PostgreSQL); S1 provides the UI (many pages still placeholders), S4
> caches/queues, and S5 runs async work. External systems used by an activity are
> flagged PARTIAL/PLANNED. See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Activity → Implementing Module Matrix

`●` = primary module `○` = supporting module

| Backend Module | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 |
|----------------|----|----|----|----|----|----|----|----|----|
| patients | ● | ○ | ○ | ○ | · | · | · | ○ | · |
| clients | ● | ○ | · | · | ○ | · | ○ | ○ | · |
| breed-info / patient-relationships / patient-reminders | ● | ○ | ○ | · | · | · | ○ | · | · |
| appointments / waitlist / time-blocks | · | ● | ○ | · | · | · | ○ | · | · |
| medical-records | ○ | · | ● | ○ | · | · | · | ● | · |
| prescriptions | · | · | ○ | ● | ○ | ○ | · | ○ | · |
| lab-tests | · | · | ○ | ● | ○ | · | · | ○ | · |
| equipment | · | · | ○ | ○ | · | ● | · | ○ | · |
| invoices / estimates | · | ○ | · | ○ | ● | · | ○ | ○ | · |
| payment-plans / refunds / insurance-claims | · | · | · | · | ● | · | · | ○ | · |
| inventory / purchase-orders | · | · | ○ | ○ | ○ | ● | · | · | · |
| communications | · | ○ | · | · | ○ | · | ● | · | · |
| client-portal / loyalty-programs / feedback / marketing-campaigns | ○ | ○ | · | · | ○ | · | ● | · | · |
| documents / report-templates / document-templates | ○ | · | ○ | ○ | ○ | · | ○ | ● | · |
| policies | · | · | · | · | · | · | · | ● | ○ |
| staff | · | ○ | ○ | · | · | · | · | ○ | ○ |
| analytics | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ |
| webhooks / workflows / workflow-templates / workflow-executions | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ | ● |
| health / metrics (ops) | · | · | · | · | · | · | · | ○ | ● |

---

## 3. Activity → System Matrix (S1–S5 + Externals)

`●` = required system `○` = supporting `(P)` = PLANNED/PARTIAL external

| System (SV-1) | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 |
|---------------|----|----|----|----|----|----|----|----|----|
| **S1** React/Vite SPA | ● | ● | ● | ● | ● | ● | ● | ● | ○ |
| **S2** Express API | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| **S3** PostgreSQL 15 | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| **S4** Redis 7 (cache+queue) | ○ | ● | ○ | ○ | ○ | ○ | ● | ○ | ● |
| **S5** Worker/Job Processor | · | ● | · | ○ | ○ | ○ | ● | · | ● |
| **X1** SendGrid (email) | · | ○(P) | · | · | ○(P) | · | ●(P) | · | · |
| **X2** Twilio (SMS) | · | ○(P) | · | · | · | · | ●(P) | · | · |
| **X3** Payment Provider | · | · | · | · | ●(P) | · | · | · | · |
| **X4** External Lab | · | · | · | ●(P) | · | · | · | · | · |
| **X5** Sentry | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● |

> S2 + S3 are required by **every** activity (universal). S4/S5 are required wherever
> caching or asynchronous work applies (scheduling reminders, communications,
> workflows, platform ops). External systems carry the gating PLANNED/PARTIAL gaps.

---

## 4. Per-Activity System Realization

| Activity | Required Systems | Implementing Modules (primary) | Honest Gap |
|----------|------------------|--------------------------------|------------|
| A1 Manage Clients & Patients | S1, S2, S3 | patients, clients, breed-info, patient-relationships/reminders | Tenant scoping & RBAC PLANNED |
| A2 Schedule & Intake | S1, S2, S3, S4, S5 | appointments, waitlist, time-blocks (+ reminders via S5) | FE pages partly placeholder |
| A3 Deliver Clinical Care | S1, S2, S3 | medical-records, prescriptions, lab-tests | PHI at-rest encryption PLANNED |
| A4 Diagnostics & Pharmacy | S1, S2, S3, (X4) | lab-tests, prescriptions, equipment | External Lab interchange PLANNED |
| A5 Billing & Revenue | S1, S2, S3, (X3) | invoices, estimates, payment-plans, refunds, insurance-claims | Payment Provider PLANNED (manual) |
| A6 Inventory & Supply | S1, S2, S3 | inventory, purchase-orders, equipment | — |
| A7 Communications & Engagement | S1, S2, S3, S4, S5, (X1/X2) | communications, client-portal, loyalty, marketing, workflows | Email/SMS send PARTIAL |
| A8 Compliance & Records | S1, S2, S3 | medical-records, documents, policies, report/doc templates | Audit PARTIAL (~7/34 svcs) |
| A9 Platform Operations | S2, S3, S4, S5, X5 | health, metrics, webhooks, workflow-executions | /metrics in-memory; queue dash RBAC weak |

---

## 5. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-5a / OV-5b | Source of operational activities A1–A9 |
| SV-1 | Source of systems S1–S5 / X1–X5 |
| SV-4 | Functions hosted on the systems mapped here |
| SV-5a | Same activities → system functions (SF-x) |
| SV-6 | Endpoint realization per module |
| SvcV-5 | Activity → services traceability (complementary) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
