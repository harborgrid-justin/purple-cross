# SV-5a: Operational Activity to Systems Function Traceability Matrix

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-5a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-5a traces **operational activities** (from OV-5a, A1–A9) to the **system
functions** (from [SV-4](template.SV-4.md), SF-x) that support them. It answers
"which functions implement which activities," closing the loop between the
Operational and Systems viewpoints. SV-5b complements this by tracing the same
activities to the implementing **systems/modules**.

> ⚠️ **Honesty note.** A cell marks that a function *supports* an activity in the
> shipped backend. Cross-cutting functions that are **unenforced/unused**
> (SF-AUTHZ RBAC, SF-TENANT, SF-CRYPTO, SF-RESIL) are shown as **(P)** PLANNED so
> the matrix does not imply complete coverage. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Operational Activities (OV-5a)

| Activity ID | Operational Activity |
|-------------|----------------------|
| **A1** | Manage Clients & Patients |
| **A2** | Schedule & Intake |
| **A3** | Deliver Clinical Care |
| **A4** | Diagnostics & Pharmacy |
| **A5** | Billing & Revenue |
| **A6** | Inventory & Supply |
| **A7** | Communications & Engagement |
| **A8** | Compliance & Records |
| **A9** | Platform Operations |

---

## 3. Activity → Module Function Matrix (SF-B / SF-C)

`●` = primary supporting function `○` = secondary/supporting `·` = n/a

| Function (SV-4) | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 |
|-----------------|----|----|----|----|----|----|----|----|----|
| SF-B01 Patients | ● | ○ | ○ | ○ | · | · | · | ○ | · |
| SF-B02 Clients | ● | ○ | · | · | ○ | · | ○ | ○ | · |
| SF-B03 Appointments | · | ● | ○ | · | · | · | ○ | · | · |
| SF-B04 Medical Records | ○ | · | ● | ○ | · | · | · | ● | · |
| SF-B05 Prescriptions | · | · | ○ | ● | ○ | ○ | · | ○ | · |
| SF-B06 Inventory | · | · | ○ | ○ | ○ | ● | · | · | · |
| SF-B07 Invoices | · | · | · | · | ● | · | ○ | ○ | · |
| SF-B08 Lab Tests | · | · | ○ | ● | ○ | · | · | ○ | · |
| SF-B09 Staff | · | ○ | ○ | · | · | · | · | ○ | ○ |
| SF-B10 Communications | · | ○ | · | · | ○ | · | ● | · | · |
| SF-B11 Documents | ○ | · | ○ | ○ | ○ | · | · | ● | · |
| SF-B12 Analytics | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ |
| SF-C01 Breed Info | ● | · | ○ | · | · | · | · | · | · |
| SF-C02/03 Relationships/Reminders | ● | ○ | · | · | · | · | ● | · | · |
| SF-C04 Client Portal | ○ | ○ | · | · | ○ | · | ● | · | · |
| SF-C05/06 Loyalty/Feedback | ○ | · | · | · | ○ | · | ● | · | · |
| SF-C07/08 Waitlist/Time Blocks | · | ● | · | · | · | · | ○ | · | · |
| SF-C09 Estimates | · | ○ | · | ○ | ● | · | · | · | · |
| SF-C10/14 Payment Plans/Refunds | · | · | · | · | ● | · | · | ○ | · |
| SF-C11 Purchase Orders | · | · | · | · | ○ | ● | · | · | · |
| SF-C12 Equipment | · | · | ○ | ○ | · | ● | · | ○ | · |
| SF-C13 Insurance Claims | · | · | · | · | ● | · | · | ○ | · |
| SF-C15 Marketing Campaigns | ○ | · | · | · | · | · | ● | · | · |
| SF-C16 Policies | · | · | · | · | · | · | · | ● | ○ |
| SF-C17/18 Report/Doc Templates | ○ | · | ○ | ○ | ○ | · | ○ | ● | · |
| SF-C19 Webhooks | · | · | · | · | · | · | ○ | · | ● |
| SF-C20/21/22 Workflows | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ | ● |

---

## 4. Activity → Cross-Cutting / Platform Function Matrix (SF-A / SF-D / SF-E)

These functions support **all** activities horizontally; the matrix records the
posture rather than per-activity selectivity. `●`=applies `(P)`=PLANNED/unenforced.

| Function (SV-4) | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 |
|-----------------|----|----|----|----|----|----|----|----|----|
| SF-VALID Validation (Joi) | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SF-A8 Sanitization | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SF-A11 Rate Limiting | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SF-AUTH Authentication | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SF-AUTHZ Authorization (RBAC) | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) |
| SF-TENANT Tenant Scoping | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) |
| SF-CRYPTO Field Encryption | (P) | · | (P) | (P) | (P) | · | · | (P) | · |
| SF-AUDIT Audit Logging | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ |
| SF-RESIL Circuit Breaker/Retry | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) | (P) |
| SF-D1 Caching | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ | ● |
| SF-D3 Job Queue (BullMQ) | · | ● | · | ○ | ○ | ○ | ● | · | ● |
| SF-D4 Webhook Delivery | · | · | · | · | · | · | ○ | · | ● |
| SF-D5 Workflow Engine | ○ | ● | ○ | ○ | ○ | ○ | ● | ○ | ● |
| SF-D6 Integration Adapters (email/SMS) | · | ○ | · | · | ○ | · | ● | · | · |
| SF-E1 Health | · | · | · | · | · | · | · | · | ● |
| SF-E2 Metrics | · | · | · | · | · | · | · | ○ | ● |
| SF-E5 Logging | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SF-E6 Error Telemetry | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● |

---

## 5. Coverage Summary

| Activity | Primary Functions | Coverage Note |
|----------|-------------------|---------------|
| A1 Manage Clients & Patients | SF-B01/B02, SF-C01/C02/C03 | Strong; tenancy/RBAC PLANNED |
| A2 Schedule & Intake | SF-B03, SF-C07/C08, SF-D5 | Strong; reminders via SF-D3 |
| A3 Deliver Clinical Care | SF-B04, SF-B05, SF-B08 | Strong; SF-CRYPTO on PHI PLANNED |
| A4 Diagnostics & Pharmacy | SF-B05, SF-B08, SF-C09 | Backend real; External Lab PLANNED |
| A5 Billing & Revenue | SF-B07, SF-C09/C10/C13/C14 | CRUD real; Payment Provider PLANNED |
| A6 Inventory & Supply | SF-B06, SF-C11/C12 | Strong |
| A7 Communications & Engagement | SF-B10, SF-C04/C05/C15, SF-D4/D5/D6 | External send PARTIAL |
| A8 Compliance & Records | SF-B04/B11, SF-C16/C17/C18, SF-AUDIT | Audit PARTIAL (~7/34 svcs) |
| A9 Platform Operations | SF-E1..E6, SF-C19/C20-22, SF-D3/D4 | Observability live; metrics in-memory |

---

## 6. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-5a / OV-5b | Source of operational activities A1–A9 |
| SV-4 | Source of system functions SF-x |
| SV-5b | Same activities → implementing systems/modules |
| SV-6 | Endpoint realization supporting these mappings |
| SvcV-5 | Activity → services traceability (complementary) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
