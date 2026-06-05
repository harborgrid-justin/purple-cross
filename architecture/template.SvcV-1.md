# SvcV-1: Services Context Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-1 describes the **services landscape** of the Purple Cross platform: the set
of REST API services exposed under `/api/v1`, the shared platform services that
support them, the external/consumed services they depend on, and the **service
consumers** (staff SPA, client portal, external webhook subscribers) that reach
them through the Express API gateway. Purple Cross is modeled here as a
**service-oriented API platform**: each backend module is a route → controller →
service → Prisma unit exposing a versioned, Joi-validated, OpenAPI-described
contract.

> ⚠️ **Honesty note.** Service contracts are real and exercised, but several
> cross-cutting service behaviors are **not yet wired**. The **auth service
> exists but enforces 0 routes** (the SPA hardcodes `isAuthenticated=true`), the
> **client portal has a separate, partial auth path**, **RBAC is unenforced**,
> **multi-tenancy `tenantId` is unscoped**, **field-crypto is applied to 0
> fields** (PHI/PII plaintext), and **`AuditLog` is written by ~7/34 services**.
> Backend services are **~85% real Prisma**; the **frontend is ~15–20% real**;
> the **Payment Provider** integration is **aspirational** (no Stripe SDK).
> `/metrics` is in-memory JSON and Bull Board `/admin/queues` is unauthenticated.
> See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Service Domains

Services are grouped into six domains that organize the catalog (§4) and recur
across SvcV-3a/3b, SvcV-4, and SvcV-5.

| Domain | Description | Representative Services |
|--------|-------------|-------------------------|
| **D1 Clinical** | Patient care, records, diagnostics, pharmacy | patients, medical-records, prescriptions, lab-tests, breed-info |
| **D2 Client/Scheduling** | Client identity, booking, intake, engagement | clients, appointments, waitlist, time-blocks, client-portal, communications, patient-reminders |
| **D3 Billing/Finance** | Charges, revenue, claims, plans | invoices, estimates, payment-plans, refunds, insurance-claims, loyalty-programs |
| **D4 Inventory/Operations** | Supply, purchasing, assets, workforce | inventory, purchase-orders, equipment, staff |
| **D5 Platform/Shared** | Cross-cutting platform capabilities | auth, health, metrics, cache, domain-events, webhooks, workflows, documents, analytics |
| **D6 External/Consumed** | Third-party services the platform calls | SendGrid, Twilio, Payment Provider, External Lab, Sentry |

---

## 3. Services Context Diagram

```
                      PURPLE CROSS — SERVICES CONTEXT (SvcV-1)

   SERVICE CONSUMERS                 API GATEWAY                  EXTERNAL / CONSUMED (D6)
  ┌──────────────────┐        ┌────────────────────────┐        ┌───────────────────────┐
  │ Staff SPA        │        │   Express API (S2)      │        │ SendGrid (SVC-31)     │
  │ (React/Vite, S1) ├──REST─►│   /api/v1  +  /api-docs │──REST─►│ Twilio   (SVC-32)     │
  └──────────────────┘        │   Joi validate · CORS   │        │ Payment  (SVC-33,PLAN)│
  ┌──────────────────┐        │   Helmet · correlation  │        │ Ext Lab  (SVC-34)     │
  │ Client Portal    ├──REST─►│   rate-limit · sanitize │        │ Sentry   (SVC-35)     │
  │ (sep. auth path) │        └─────────┬──────────────┘        └───────────▲───────────┘
  └──────────────────┘                  │                                   │ outbound
  ┌──────────────────┐                  │ routes to domain services          │
  │ Webhook          │◄──deliver────────┤                                   │
  │ Subscribers (ext)│   (SVC-26)       │                                   │
  └──────────────────┘                  ▼                                   │
                 ┌──────────────────────────────────────────────┐          │
   D1 CLINICAL   │ patients · medical-records · prescriptions ·  │          │
                 │ lab-tests · breed-info        (SVC-01..05)    │──────────┘ (lab, alerts)
                 ├──────────────────────────────────────────────┤
   D2 CLIENT/    │ clients · appointments · waitlist · time-     │
   SCHEDULING    │ blocks · client-portal · communications ·     │──► SendGrid/Twilio
                 │ patient-reminders             (SVC-06..12)    │
                 ├──────────────────────────────────────────────┤
   D3 BILLING/   │ invoices · estimates · payment-plans ·        │
   FINANCE       │ refunds · insurance-claims · loyalty          │──► Payment (PLANNED)
                 │                               (SVC-13..18)    │
                 ├──────────────────────────────────────────────┤
   D4 INVENTORY/ │ inventory · purchase-orders · equipment ·     │
   OPERATIONS    │ staff                         (SVC-19..22)    │
                 ├──────────────────────────────────────────────┤
   D5 PLATFORM/  │ auth[PLANNED-unwired] · health · metrics ·    │
   SHARED        │ cache · domain-events · webhooks · workflows ·│
                 │ documents · analytics · templates · policies ·│
                 │ feedback · marketing      (SVC-23..30, 36..)  │
                 └─────────────────┬────────────────────────────┘
                                   │ Prisma
                                   ▼
                      ┌───────────────────────────┐
                      │ PostgreSQL (S3) · Redis(S4)│  BullMQ worker (S5)
                      └───────────────────────────┘
```

> Logical service context, not a deployment topology. All in-scope services are
> realized inside the single Express process (S2); D6 services are remote.

---

## 4. Service Catalog

Service IDs (`SVC-x`) are the stable identifiers used across the Services
Viewpoint. "Module/file" points to the route + service unit. "Status" is honest
about real Prisma backing vs. placeholder/planned behavior.

| SVC ID | Service | Domain | Module / File | Endpoint Prefix | Primary Consumers | Status |
|--------|---------|--------|---------------|-----------------|-------------------|--------|
| SVC-01 | Patients | D1 | `patient.*` | `/api/v1/patients` | SPA, portal | Real |
| SVC-02 | Medical Records | D1 | `medical-record.*` | `/api/v1/medical-records` | SPA | Real (PHI plaintext) |
| SVC-03 | Prescriptions | D1 | `prescription.*` | `/api/v1/prescriptions` | SPA | Real |
| SVC-04 | Lab Tests | D1 | `lab-test.*` | `/api/v1/lab-tests` | SPA, Ext Lab | Real |
| SVC-05 | Breed Info | D1 | `breed-info.*` | `/api/v1/breed-info` | SPA | Real (reference) |
| SVC-06 | Clients | D2 | `client.*` | `/api/v1/clients` | SPA, portal | Real (PII plaintext) |
| SVC-07 | Appointments | D2 | `appointment.*` | `/api/v1/appointments` | SPA, portal | Real |
| SVC-08 | Waitlist | D2 | `waitlist.*` | `/api/v1/waitlist` | SPA | Real |
| SVC-09 | Time Blocks | D2 | `time-block.*` | `/api/v1/time-blocks` | SPA | Real |
| SVC-10 | Client Portal | D2 | `client-portal.*` | `/api/v1/portal` | Pet owner | IN PROGRESS (sep. auth, FE placeholder) |
| SVC-11 | Communications | D2 | `communication.*` | `/api/v1/communications` | SPA, system | Real (calls SendGrid/Twilio) |
| SVC-12 | Patient Reminders | D2 | `patient-reminder.*` | `/api/v1/patient-reminders` | SPA, worker | Real |
| SVC-13 | Invoices | D3 | `invoice.*` | `/api/v1/invoices` | SPA, portal | Real (manual payment) |
| SVC-14 | Estimates | D3 | `estimate.*` | `/api/v1/estimates` | SPA | Real |
| SVC-15 | Payment Plans | D3 | `payment-plan.*` | `/api/v1/payment-plans` | SPA, portal | Real |
| SVC-16 | Refunds | D3 | `refund.*` | `/api/v1/refunds` | SPA | Real (no gateway settle) |
| SVC-17 | Insurance Claims | D3 | `insurance-claim.*` | `/api/v1/insurance-claims` | SPA | Real |
| SVC-18 | Loyalty Programs | D3 | `loyalty-program.*` | `/api/v1/loyalty-programs` | SPA, portal | Real |
| SVC-19 | Inventory | D4 | `inventory.*` | `/api/v1/inventory` | SPA | Real |
| SVC-20 | Purchase Orders | D4 | `purchase-order.*` | `/api/v1/purchase-orders` | SPA | Real |
| SVC-21 | Equipment | D4 | `equipment.*` | `/api/v1/equipment` | SPA | Real |
| SVC-22 | Staff | D4 | `staff.*` | `/api/v1/staff` | SPA | Real |
| SVC-23 | Documents | D5 | `document.*` | `/api/v1/documents` | SPA | Real |
| SVC-24 | Analytics | D5 | `analytics.*` | `/api/v1/analytics` | SPA | Real (read aggregates) |
| SVC-25 | Auth | D5 | `auth.*` | `/api/v1/auth` | SPA, portal | **PLANNED (unwired, 0 routes enforce)** |
| SVC-26 | Webhooks | D5 | `webhook.*`, `webhook-delivery`, `webhook-events` | `/api/v1/webhooks` | Ext subscribers | Real |
| SVC-27 | Workflows | D5 | `workflow.*`, `workflow-engine`, `workflow-trigger` | `/api/v1/workflows` | SPA, system | Real |
| SVC-28 | Workflow Templates | D5 | `workflow-template.*` | `/api/v1/workflow-templates` | SPA | Real |
| SVC-29 | Workflow Executions | D5 | `workflow-execution.*` | `/api/v1/workflow-executions` | SPA, worker | Real |
| SVC-30 | Cache | D5 | `cache.service` (Redis) | (internal) | All services | Real |
| SVC-31 | Email (SendGrid) | D6 | external | (external REST) | Communications | External |
| SVC-32 | SMS (Twilio) | D6 | external | (external REST) | Communications | External |
| SVC-33 | Payment Provider | D6 | external | (external REST) | Invoices/Refunds | **Aspirational (no SDK)** |
| SVC-34 | External Lab | D6 | external | (external REST) | Lab Tests | External |
| SVC-35 | Sentry | D6 | external | (external REST) | Platform errors | External |
| SVC-36 | Health | D5 | `health.*` | `/health*` | Ops, LB probes | Real |
| SVC-37 | Metrics | D5 | `metrics.*` | `/metrics` | Ops | Real (in-memory JSON) |
| SVC-38 | Domain Events | D5 | `domain-events.service` | (internal bus) | Webhooks, workflows | Real |
| SVC-39 | Job Queue (BullMQ) | D5 | worker (S5) + `/admin/queues` | (internal) | Reminders, workflows | Real (Bull Board unauth) |
| SVC-40 | Document Templates | D5 | `document-template.*` | `/api/v1/document-templates` | SPA, documents | Real |
| SVC-41 | Report Templates | D5 | `report-template.*` | `/api/v1/report-templates` | SPA, analytics | Real |
| SVC-42 | Policies | D5 | `policy.*` | `/api/v1/policies` | SPA | Real |
| SVC-43 | Feedback | D5 | `feedback.*` | `/api/v1/feedback` | SPA, portal | Real |
| SVC-44 | Marketing Campaigns | D5 | `marketing-campaign.*` | `/api/v1/marketing-campaigns` | SPA | Real |
| SVC-45 | Patient Relationships | D1 | `patient-relationship.*` | `/api/v1/patient-relationships` | SPA | Real |

> 37 HTTP-exposed modules + shared/utility services (cache, domain-events,
> webhook-delivery/events, workflow-engine/trigger) + 5 external services. The
> `/api/v1` gateway, Joi validation, and OpenAPI 3.0.3 (`swagger-jsdoc` at
> `/api-docs`) are shared by every in-scope service.

---

## 5. Service Consumers

| Consumer | Type | Reaches Services Via | Auth Reality |
|----------|------|----------------------|--------------|
| Staff SPA (S1) | Internal | `/api/v1/*` (Axios) | `isAuthenticated=true` hardcoded — **no real auth** |
| Client Portal | External (pet owner) | `/api/v1/portal/*` | Separate, partial portal auth path — **IN PROGRESS** |
| Webhook subscribers | External | Inbound config; outbound delivery from SVC-26 | Signature/secret per subscription |
| Ops / LB probes | Internal | `/health*`, `/metrics`, `/admin/queues` | **Unauthenticated** |
| BullMQ worker (S5) | Internal | In-process service calls / queue | N/A (trusted) |

---

## 6. Honesty & Gap Notes

| Context Element | Reality | Status |
|-----------------|---------|--------|
| SVC-25 Auth enforcement | Service implemented; **0 routes apply it** | PLANNED |
| RBAC across services | No role checks at route layer | PLANNED |
| Tenant isolation | `tenantId` present, not scoped in queries | PLANNED |
| PHI/PII encryption (SVC-02/06) | `field-crypto` applied to 0 fields | PLANNED |
| SVC-33 Payment Provider | No Stripe SDK; payments recorded manually | Aspirational |
| Audit trail | `AuditLog` written by ~7/34 services | PARTIAL |
| SVC-10 Client Portal | Endpoints exist; FE largely placeholder | IN PROGRESS |
| SVC-37 Metrics / SVC-39 Bull Board | In-memory JSON; queue UI unauthenticated | PARTIAL |
| Frontend consumers | ~15–20% real pages; rest placeholder | IN PROGRESS |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SV-1 | Systems that host/realize these services (S1–S5, external) |
| SV-4 | System functions underpinning service functionality |
| SvcV-2 | Resource flows between these services and consumers |
| SvcV-3a | Systems-to-services hosting/consumption matrix |
| SvcV-3b | Service-to-service dependency matrix |
| SvcV-4 | Functional decomposition of each SVC-x |
| SvcV-5 | OV-5a operational activity → service traceability |
| OV-5a | Operational activities these services realize |
| CV-7 | Capability-to-services mapping |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
