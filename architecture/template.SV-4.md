# SV-4: Systems Functionality Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-4-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-4 decomposes the **system functions** hosted by the Purple Cross platform —
overwhelmingly inside **S2 (Express API Server)** — into a function hierarchy and
a catalog with stable IDs (**SF-x**). Each function maps to a real implementing
artifact (route → controller → service → Prisma, or a cross-cutting middleware).
SV-5a traces these functions to operational activities, and SV-5b traces the
activities to the implementing systems/modules.

> ⚠️ **Honesty note.** Grounded in `backend/src/app.ts` and the 37 route modules.
> Cross-cutting functions reflect the **real middleware order**. Functions that
> exist but are unenforced or unused are flagged: **SF-AUTHZ (RBAC)** is largely
> unenforced, **SF-TENANT** scoping is absent, **SF-CRYPTO** (field encryption)
> touches 0 fields, **SF-RESIL** (circuit breaker/retry) is **dead code**, and
> **SF-AUDIT** runs in ~7 of 34 services. See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. System Function Hierarchy

```
SF-0  PURPLE CROSS SYSTEM FUNCTIONS (hosted on S2; async on S5)
|
+-- SF-A  Request-Processing (cross-cutting middleware pipeline)   [app.ts order]
|     SF-A1 correlation-id        SF-A2 request-context (AsyncLocalStorage)
|     SF-A3 metrics (in-memory)   SF-A4 timeout (30s)
|     SF-A5 helmet (sec headers)  SF-A6 cors (allow-list)
|     SF-A7 body-parse            SF-A8 sanitization (XSS/injection)
|     SF-A9 compression           SF-A10 morgan (HTTP logging)
|     SF-A11 rate-limiter (per-IP)
|     SF-AUTH authenticate (JWT verify, global /api/v1 guard)   [LIVE]
|     SF-AUTHZ authorize (RBAC)                                  [PLANNED — few routes]
|     SF-VALID Joi validate / validateQuery / validateParams
|     SF-ERR  error-handler (+ Sentry handler, notFound)
|
+-- SF-B  Core Module Functions (12)   [route→controller→service→Prisma]
|     SF-B01 Patients        SF-B02 Clients        SF-B03 Appointments
|     SF-B04 Medical Records SF-B05 Prescriptions  SF-B06 Inventory
|     SF-B07 Invoices        SF-B08 Lab Tests      SF-B09 Staff
|     SF-B10 Communications  SF-B11 Documents      SF-B12 Analytics
|
+-- SF-C  Extended Module Functions (22 route modules)
|     SF-C01 Breed Info            SF-C02 Patient Relationships
|     SF-C03 Patient Reminders     SF-C04 Client Portal (own principal)
|     SF-C05 Loyalty Programs      SF-C06 Feedback
|     SF-C07 Waitlist              SF-C08 Time Blocks
|     SF-C09 Estimates             SF-C10 Payment Plans
|     SF-C11 Purchase Orders       SF-C12 Equipment
|     SF-C13 Insurance Claims      SF-C14 Refunds
|     SF-C15 Marketing Campaigns   SF-C16 Policies
|     SF-C17 Report Templates      SF-C18 Document Templates
|     SF-C19 Webhooks              SF-C20 Workflows
|     SF-C21 Workflow Templates    SF-C22 Workflow Executions
|
+-- SF-D  Platform / Utility Functions
|     SF-D1 Caching (cache.service → S4)
|     SF-D2 Domain Events (domain-events.service)
|     SF-D3 Job Queue (BullMQ producer/consumer; S4↔S5)
|     SF-D4 Webhook Delivery (webhook-delivery / webhook-events → tenant URLs)
|     SF-D5 Workflow Engine (workflow-engine / workflow-trigger)
|     SF-D6 Integration Adapters (email→X1, SMS→X2)
|
+-- SF-E  Observability & Operations
      SF-E1 Health (/health,/live,/ready[PG+Redis],/detailed)
      SF-E2 Metrics endpoint (/metrics, in-memory JSON — NOT Prometheus)
      SF-E3 Swagger / OpenAPI 3.0.3 (/api-docs, /api-docs.json)
      SF-E4 Bull Board (/admin/queues)
      SF-E5 Structured Logging (Winston JSON → logs/*.log, PII redaction)
      SF-E6 Error Telemetry (Sentry → X5, optional)
```

---

## 3. System Function Catalog — Cross-Cutting (SF-A / SF-E)

| Function ID | Name | Implementing Artifact | Description | Status |
|-------------|------|-----------------------|-------------|--------|
| SF-A1 | Correlation ID | `middleware/correlation-id.ts` | Assigns/propagates `X-Correlation-ID` | LIVE |
| SF-A2 | Request Context | `middleware/request-context.ts` | AsyncLocalStorage (correlation/ip/UA/principal) | LIVE |
| SF-A3 | Metrics Collection | `middleware/metrics.ts` | In-memory request counters/latency | LIVE |
| SF-A4 | Timeout | `middleware/timeout.ts` | 30s request timeout | LIVE |
| SF-A5 | Security Headers | `helmet()` in `app.ts` | HTTP security headers | LIVE |
| SF-A6 | CORS | `cors()` in `app.ts` | Allow-list via `CORS_ORIGIN` | LIVE |
| SF-A7 | Body Parse | `express.json/urlencoded` | JSON/form parsing, size limit | LIVE |
| SF-A8 | Sanitization | `middleware/sanitization.ts` | XSS/injection input cleansing | LIVE |
| SF-A9 | Compression | `compression()` | Response gzip | LIVE |
| SF-A10 | HTTP Logging | `morgan` → Winston | Access log lines | LIVE |
| SF-A11 | Rate Limiting | `middleware/rate-limiter.ts` | Per-IP throttle | LIVE |
| SF-AUTH | Authentication | `middleware/auth.ts` `authenticate` | JWT verify, global `/api/v1` guard | LIVE |
| SF-AUTHZ | Authorization (RBAC) | `middleware/auth.ts` `authorize` | Role checks | **PLANNED** (few routes) |
| SF-VALID | Validation | `middleware/validation.ts` | Joi `validate/validateQuery/validateParams` | LIVE |
| SF-TENANT | Tenant Scoping | (none) | `tenantId` columns exist; queries unscoped | **PLANNED** |
| SF-CRYPTO | Field Encryption | `utils/field-crypto*` | At-rest PHI/PII encryption | **PLANNED** (0 fields) |
| SF-AUDIT | Audit Logging | `AuditLog` writes | Mutation audit trail | **PARTIAL** (~7/34 svcs) |
| SF-RESIL | Resilience | `utils/circuit-breaker.ts`, `utils/retry.ts` | Breaker + backoff | **DEAD CODE** (unused) |
| SF-ERR | Error Handling | `middleware/error-handler.ts` + Sentry | AppError → envelope; notFound | LIVE |
| SF-E1 | Health | `routes/health.routes.ts` | `/health`,`/live`,`/ready`(PG+Redis),`/detailed` | LIVE |
| SF-E2 | Metrics Endpoint | `routes/metrics.routes.ts` | `/metrics` in-memory JSON (admin-guarded) | LIVE (◐ RBAC) |
| SF-E3 | API Docs | `config/swagger.ts` | OpenAPI 3.0.3 `/api-docs`(.json) | LIVE |
| SF-E4 | Queue Dashboard | `config/bull-board.ts` | `/admin/queues` (admin-guarded) | LIVE (◐ RBAC) |
| SF-E5 | Structured Logging | `config/logger.ts` (Winston) | JSON logs, PII redaction | LIVE |
| SF-E6 | Error Telemetry | `config/sentry.ts` | Sentry export | OPTIONAL |

---

## 4. System Function Catalog — Modules (SF-B / SF-C)

Each module function is realized by the **same layered pattern**:
`routes/<m>.routes.ts → controllers/<m>.controller.ts → services/<m>.service.ts → Prisma`,
with Joi validation per route and OpenAPI annotations. Mounted under `/api/v1/<resource>`.

| Function ID | Module / Resource | Mount (`/api/v1/...`) | Primary Prisma Model(s) | Status |
|-------------|-------------------|-----------------------|-------------------------|--------|
| SF-B01 | Patients | `/patients` | Patient | LIVE (~85% real) |
| SF-B02 | Clients | `/clients` | Client | LIVE |
| SF-B03 | Appointments | `/appointments` | Appointment | LIVE |
| SF-B04 | Medical Records | `/medical-records` | MedicalRecord | LIVE |
| SF-B05 | Prescriptions | `/prescriptions` | Prescription | LIVE |
| SF-B06 | Inventory | `/inventory` | InventoryItem | LIVE |
| SF-B07 | Invoices | `/invoices` | Invoice / LineItem | LIVE |
| SF-B08 | Lab Tests | `/lab-tests` | LabTest | LIVE |
| SF-B09 | Staff | `/staff` | Staff | LIVE |
| SF-B10 | Communications | `/communications` | Communication | LIVE (◐ external send) |
| SF-B11 | Documents | `/documents` | Document | LIVE |
| SF-B12 | Analytics | `/analytics` | (aggregations) | LIVE |
| SF-C01 | Breed Info | `/breed-info` | BreedInfo | LIVE |
| SF-C02 | Patient Relationships | `/patient-relationships` | PatientRelationship | LIVE |
| SF-C03 | Patient Reminders | `/patient-reminders` | PatientReminder | LIVE |
| SF-C04 | Client Portal | `/client-portal` | Client (own principal) | LIVE (separate auth) |
| SF-C05 | Loyalty Programs | `/loyalty-programs` | LoyaltyProgram | LIVE |
| SF-C06 | Feedback | `/feedback` | Feedback | LIVE |
| SF-C07 | Waitlist | `/waitlist` | WaitlistEntry | LIVE |
| SF-C08 | Time Blocks | `/time-blocks` | TimeBlock | LIVE |
| SF-C09 | Estimates | `/estimates` | Estimate | LIVE |
| SF-C10 | Payment Plans | `/payment-plans` | PaymentPlan | LIVE (◐ payments manual) |
| SF-C11 | Purchase Orders | `/purchase-orders` | PurchaseOrder | LIVE |
| SF-C12 | Equipment | `/equipment` | Equipment | LIVE |
| SF-C13 | Insurance Claims | `/insurance-claims` | InsuranceClaim | LIVE |
| SF-C14 | Refunds | `/refunds` | Refund | LIVE (◐ payments manual) |
| SF-C15 | Marketing Campaigns | `/marketing-campaigns` | MarketingCampaign | LIVE |
| SF-C16 | Policies | `/policies` | Policy | LIVE |
| SF-C17 | Report Templates | `/report-templates` | ReportTemplate | LIVE |
| SF-C18 | Document Templates | `/document-templates` | DocumentTemplate | LIVE |
| SF-C19 | Webhooks | `/webhooks` | Webhook / WebhookDelivery | LIVE (◐ delivery) |
| SF-C20 | Workflows | `/workflows` | Workflow | LIVE |
| SF-C21 | Workflow Templates | `/workflow-templates` | WorkflowTemplate | LIVE |
| SF-C22 | Workflow Executions | `/workflow-executions` | WorkflowExecution | LIVE |

---

## 5. Utility / Platform Function Catalog (SF-D)

| Function ID | Name | Implementing Artifact | Description | Status |
|-------------|------|-----------------------|-------------|--------|
| SF-D1 | Caching | `services/cache.service.ts` | Redis-backed read cache (S4) | LIVE |
| SF-D2 | Domain Events | `services/domain-events.service.ts` | Emits domain events to trigger workflows/webhooks | LIVE |
| SF-D3 | Job Queue | BullMQ producers/consumers (S4↔S5) | Async work (reminders, deliveries, executions) | LIVE |
| SF-D4 | Webhook Delivery | `services/webhook-delivery*`, `webhook-events*` | Signed HTTPS delivery to tenant URLs | PARTIAL |
| SF-D5 | Workflow Engine | `services/workflow-engine*`, `workflow-trigger*` | Evaluate triggers, execute workflow steps | LIVE |
| SF-D6 | Integration Adapters | communications email/SMS paths | Outbound to X1 SendGrid / X2 Twilio | PARTIAL |

---

## 6. Function Behavior Notes

- **Pipeline determinism:** Every request to `/api/v1/*` passes SF-A1→SF-A11
  then SF-AUTH before reaching a module function (SF-Bxx/SF-Cxx). `/api/v1/auth`
  and `/api/v1/client-portal` are mounted **before** the global SF-AUTH guard.
- **Async offload:** Module functions enqueue to SF-D3; SF-D4/SF-D5 execute on S5.
- **Honesty:** SF-AUTHZ, SF-TENANT, SF-CRYPTO, SF-AUDIT, SF-RESIL are the gating
  gaps for production; they appear here so traceability matrices (SV-5a) do not
  over-claim coverage.

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SV-1 | S2 subsystem decomposition these functions populate |
| SV-2 | Resources each function produces/consumes |
| SV-5a | Operational activity → SF-x traceability |
| SV-5b | Operational activity → implementing system/module |
| SV-6 | Endpoint-level realization of SF-Bxx/SF-Cxx |
| SvcV-4 | Service functionality description (complementary) |
| OV-5a/OV-5b | Operational activities these functions support |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
