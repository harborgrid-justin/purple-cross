# CV-7: Capability to Services Mapping

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-7-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-7 maps each capability (from CV-2) to the **REST API services / Express
modules** that implement it, cross-referenced to the **Services Viewpoint
(SvcV)**. Each capability is traced to one or more `route → controller → service
→ Prisma` modules exposed under `/api/v1`, documented via OpenAPI 3.0.3
(swagger-jsdoc at `/api-docs`).

> ⚠️ **Honesty note.** The mapped services are ~85% real Prisma-backed code.
> The `auth` service exists but is wired to **zero routes**; circuit-breaker and
> retry utilities exist but are **unused**; only ~7/34 services write to
> `AuditLog`. CAP-4.3 Security is therefore mapped to a service that is **present
> but PLANNED for enforcement**.

---

## 2. Service Realization Overview

```
   CAPABILITY (CV-2)            SERVICE TIER (Express /api/v1)
   +-------------------+        +------------------------------------------+
   | CAP-1.0 Clinical  | -----> | patients, medical-records, prescriptions,|
   |                   |        | lab-tests, breed-info, patient-*         |
   +-------------------+        +------------------------------------------+
   | CAP-2.0 Client &  | -----> | clients, appointments, waitlist,         |
   | Scheduling        |        | time-blocks, communications, client-     |
   |                   |        | portal, loyalty-programs, feedback,      |
   |                   |        | marketing-campaigns                      |
   +-------------------+        +------------------------------------------+
   | CAP-3.0 Business  | -----> | invoices, estimates, payment-plans,      |
   | Operations        |        | insurance-claims, refunds, inventory,    |
   |                   |        | purchase-orders, equipment, staff        |
   +-------------------+        +------------------------------------------+
   | CAP-4.0 Platform  | -----> | analytics, report-templates, documents,  |
   | Services          |        | document-templates, policies, workflows*,|
   |                   |        | webhooks, health, metrics, auth(PLANNED) |
   +-------------------+        +------------------------------------------+
   All requests: Joi validation -> service -> Prisma -> PostgreSQL
   Cross-cutting: correlation-id, sanitization, rate-limit, Winston logging
```

---

## 3. Capability → Service Mapping

| Capability | Implementing Service Module(s) (`/api/v1/...`) | Realization Status |
|------------|-----------------------------------------------|--------------------|
| CAP-1.1 Patient Records | `patients`, `medical-records`, `breed-info`, `patient-relationships`, `patient-reminders` | Real (~85%) |
| CAP-1.2 Prescriptions | `prescriptions` | Real |
| CAP-1.3 Laboratory | `lab-tests` (+ ExternalLabIntegration) | Real |
| CAP-2.1 Client Mgmt & Portal | `clients`, `client-portal`, `loyalty-programs`, `feedback` | Real backend; portal FE placeholder |
| CAP-2.2 Appointments | `appointments`, `waitlist`, `time-blocks` | Real |
| CAP-2.3 Communications | `communications`, `marketing-campaigns` (SendGrid/Twilio, BullMQ) | Real |
| CAP-3.1 Billing & Revenue | `invoices`, `estimates`, `payment-plans`, `insurance-claims`, `refunds` | Real; charge automation absent |
| CAP-3.2 Inventory | `inventory`, `purchase-orders`, `equipment` | Real |
| CAP-3.3 Workforce | `staff` | Real |
| CAP-4.1 Analytics | `analytics`, `report-templates` | Real |
| CAP-4.2 Documents | `documents`, `document-templates`, `policies` | Real |
| CAP-4.3 Platform & Automation | `workflows`, `workflow-templates`, `workflow-executions`, `webhooks`, `health`, `metrics` | Mostly real; resilience utils unused |
| CAP-4.3 **Security** | `auth` (+ `auth.ts` middleware, `authorize()`, tenant scoping, `field-crypto`) | **Present but PLANNED — wired to 0 routes** |

---

## 4. Service Implementation Attributes

| Attribute | Value | Applies To |
|-----------|-------|------------|
| Protocol | REST/JSON over HTTPS | All services |
| Base path | `/api/v1` | All services |
| Validation | Joi schemas (`validate`, `validateQuery`, `validateParams`) | All services |
| Contract | OpenAPI 3.0.3 via swagger-jsdoc (`/api-docs`) | All services |
| Persistence | Prisma 6.18 → PostgreSQL 15 | All services |
| Async | BullMQ on Redis 7 | CAP-2.3, CAP-4.1, CAP-4.3 |
| Observability | correlation-id, Winston JSON logs, `/metrics`, Sentry | All services |
| AuthN/Z | JWT + RBAC | **CAP-4.3 — PLANNED (unenforced today)** |
| Tenancy | `tenantId` scoping | **PLANNED — queries not scoped** |

---

## 5. Service Gaps and Caveats

| Service Concern | Reality Today | Target Phase (CV-3) |
|-----------------|---------------|---------------------|
| `auth` enforcement | Middleware imported by 0 routes | PI-3 |
| RBAC `authorize()` | Defined, unenforced | PI-3 |
| Tenant scoping | `tenantId` columns unused in queries | PI-3 |
| Audit logging | ~7 of 34 services write `AuditLog` | PI-3→PI-4 |
| Field encryption | `field-crypto` applied to 0 fields | PI-4 |
| Circuit breakers / retry | `circuit-breaker.ts`, `retry.ts` present, unused | PI-4 |
| Payments | No Stripe SDK; billing internal-only | Future |

---

## 6. Capability-to-Service Coverage Summary

| Capability Domain | # Service Modules | Backend Real? | Notable Caveat |
|-------------------|------------------:|---------------|----------------|
| CAP-1.0 Clinical | 7 | Yes (~85%) | UI in progress |
| CAP-2.0 Client & Scheduling | 9 | Yes | Portal/comms FE placeholder |
| CAP-3.0 Business Operations | 9 | Yes | Payments aspirational |
| CAP-4.0 Platform Services | 12 | Mixed | Security service PLANNED, resilience unused |
| **TOTAL** | **37** | — | — |

---

## 7. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-2 Taxonomy** | Source of capabilities mapped to services |
| **CV-4 Dependencies** | Service-level dependencies behind capability dependencies |
| **CV-6 Activity Mapping** | Activities these services execute |
| **SvcV-1 Services Context** | Authoritative service inventory aligned here |
| **SvcV-4 / SvcV-5** | Service functionality & activity-to-service traceability |
| **SV-1** | Systems interfaces exposing these services |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
