# CV-2: Capability Taxonomy

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-2 defines the **capability taxonomy** for Purple Cross: the hierarchical
decomposition of the vision (CV-1) into capability domains, capabilities, and
sub-capabilities, each mapped to the real backend modules that implement them.
It is the authoritative source of **CAP-x.y** identifiers used by every other
Capability Viewpoint view (CV-3 phasing, CV-4 dependencies, CV-5 org mapping,
CV-6 activity mapping, CV-7 services mapping).

> ⚠️ **Honesty note.** Sub-capabilities are mapped to the 37 backend modules that
> exist (route→controller→service→Prisma). Backend services are ~85% real; the
> frontend that surfaces them is ~15–20% real. Security sub-capabilities under
> CAP-4.3 (auth, RBAC, tenancy, audit, at-rest crypto) are **PLANNED**.

---

## 2. Taxonomy Tree

```
PURPLE CROSS CAPABILITY TAXONOMY
|
+-- CAP-1.0 Clinical Care Management
|     +-- CAP-1.1 Patient Records (EHR) ........ patients, medical-records, breed-info,
|     |                                          patient-relationships, patient-reminders
|     +-- CAP-1.2 Prescriptions ................. prescriptions
|     +-- CAP-1.3 Laboratory & Diagnostics ...... lab-tests
|
+-- CAP-2.0 Client & Scheduling
|     +-- CAP-2.1 Client Management & Portal .... clients, client-portal, loyalty-programs, feedback
|     +-- CAP-2.2 Appointment Scheduling ........ appointments, waitlist, time-blocks
|     +-- CAP-2.3 Communications & Reminders .... communications, marketing-campaigns
|
+-- CAP-3.0 Business Operations
|     +-- CAP-3.1 Billing & Revenue ............. invoices, estimates, payment-plans,
|     |                                          insurance-claims, refunds
|     +-- CAP-3.2 Inventory & Supply Chain ...... inventory, purchase-orders, equipment
|     +-- CAP-3.3 Workforce ..................... staff
|
+-- CAP-4.0 Platform Services
      +-- CAP-4.1 Analytics & Reporting ......... analytics, report-templates
      +-- CAP-4.2 Documents & Content ........... documents, document-templates, policies
      +-- CAP-4.3 Platform, Automation & Security workflows, workflow-templates,
            (Observability/Resilience/Security)  workflow-executions, webhooks,
                                                 health, metrics, auth*
            * auth module exists but is wired to ZERO routes (PLANNED)
```

---

## 3. Capability Catalog

### 3.1 CAP-1.0 Clinical Care Management

| ID | Capability | Backend Modules | Status |
|----|------------|-----------------|--------|
| CAP-1.1 | Patient Records (EHR) | patients, medical-records, breed-info, patient-relationships, patient-reminders | Backend real (~85%) |
| CAP-1.2 | Prescriptions | prescriptions | Backend real |
| CAP-1.3 | Laboratory & Diagnostics | lab-tests (+ ExternalLabIntegration) | Backend real |

### 3.2 CAP-2.0 Client & Scheduling

| ID | Capability | Backend Modules | Status |
|----|------------|-----------------|--------|
| CAP-2.1 | Client Management & Portal | clients, client-portal, loyalty-programs, feedback | Backend real; portal FE placeholder |
| CAP-2.2 | Appointment Scheduling | appointments, waitlist, time-blocks | Backend real |
| CAP-2.3 | Communications & Reminders | communications, marketing-campaigns | Backend real; depends on SendGrid/Twilio |

### 3.3 CAP-3.0 Business Operations

| ID | Capability | Backend Modules | Status |
|----|------------|-----------------|--------|
| CAP-3.1 | Billing & Revenue | invoices, estimates, payment-plans, insurance-claims, refunds | Backend real; payments aspirational (no Stripe SDK) |
| CAP-3.2 | Inventory & Supply Chain | inventory, purchase-orders, equipment | Backend real |
| CAP-3.3 | Workforce | staff | Backend real |

### 3.4 CAP-4.0 Platform Services

| ID | Capability | Backend Modules | Status |
|----|------------|-----------------|--------|
| CAP-4.1 | Analytics & Reporting | analytics, report-templates | Backend real |
| CAP-4.2 | Documents & Content | documents, document-templates, policies | Backend real |
| CAP-4.3 | Platform, Automation & Security | workflows, workflow-templates, workflow-executions, webhooks, health, metrics, **auth** | Mixed: health/metrics real; **auth/RBAC/tenancy/audit/at-rest crypto PLANNED** |

---

## 4. Module-to-Capability Coverage (all 37 modules)

| # | Module | Capability | # | Module | Capability |
|---|--------|-----------|---|--------|-----------|
| 1 | patients | CAP-1.1 | 20 | waitlist | CAP-2.2 |
| 2 | clients | CAP-2.1 | 21 | time-blocks | CAP-2.2 |
| 3 | appointments | CAP-2.2 | 22 | estimates | CAP-3.1 |
| 4 | medical-records | CAP-1.1 | 23 | payment-plans | CAP-3.1 |
| 5 | prescriptions | CAP-1.2 | 24 | purchase-orders | CAP-3.2 |
| 6 | inventory | CAP-3.2 | 25 | equipment | CAP-3.2 |
| 7 | invoices | CAP-3.1 | 26 | insurance-claims | CAP-3.1 |
| 8 | lab-tests | CAP-1.3 | 27 | refunds | CAP-3.1 |
| 9 | staff | CAP-3.3 | 28 | marketing-campaigns | CAP-2.3 |
| 10 | communications | CAP-2.3 | 29 | policies | CAP-4.2 |
| 11 | documents | CAP-4.2 | 30 | report-templates | CAP-4.1 |
| 12 | analytics | CAP-4.1 | 31 | document-templates | CAP-4.2 |
| 13 | breed-info | CAP-1.1 | 32 | webhooks | CAP-4.3 |
| 14 | patient-relationships | CAP-1.1 | 33 | workflows | CAP-4.3 |
| 15 | patient-reminders | CAP-1.1 | 34 | workflow-templates | CAP-4.3 |
| 16 | client-portal | CAP-2.1 | 35 | workflow-executions | CAP-4.3 |
| 17 | loyalty-programs | CAP-2.1 | 36 | auth | CAP-4.3 (PLANNED) |
| 18 | feedback | CAP-2.1 | 37 | health | CAP-4.3 |
| 19 | estimates | CAP-3.1 | — | metrics | CAP-4.3 |

> Note: `metrics` and `health` are operational/observability endpoints folded
> into CAP-4.3; counting them brings the catalog to 37 named modules.

---

## 5. Taxonomy Summary Matrix

| Domain | Sub-Capabilities | Modules | Lead Phase (CV-3) | Honest Status |
|--------|-----------------:|--------:|-------------------|---------------|
| CAP-1.0 Clinical Care Management | 3 | 7 | PI-1 | Backend real (~85%) |
| CAP-2.0 Client & Scheduling | 3 | 9 | PI-1/PI-2 | Backend real; FE in progress |
| CAP-3.0 Business Operations | 3 | 9 | PI-1 | Backend real; payments aspirational |
| CAP-4.0 Platform Services | 3 | 12 | PI-1/PI-3/PI-4 | Mixed; security PLANNED |
| **TOTAL** | **12** | **37** | — | — |

---

## 6. Taxonomy Governance Rules

| Rule | Description |
|------|-------------|
| Single home | Every module maps to exactly one primary sub-capability (CAP-x.y) |
| Stable IDs | CAP IDs do not change once published; deprecate rather than renumber |
| Honesty | Sub-capabilities backed by PLANNED features are flagged in every view |
| Traceability | CV-3..CV-7 reference these exact CAP IDs |

---

## 7. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-1 Vision** | Source of the pillars this taxonomy decomposes |
| **CV-3 Capability Phasing** | Sequences these CAP IDs across PI-1..PI-4 |
| **CV-4 Capability Dependencies** | Defines dependencies between these CAP IDs |
| **CV-6 / CV-7** | Map these CAP IDs to operational activities and services |
| **SvcV-1** | Service inventory aligned to the same modules |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
