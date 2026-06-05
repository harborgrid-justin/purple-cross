# SvcV-6: Services Resource Flow Matrix

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-6-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-6 Services Resource Flow Matrix** captures the detailed interface
contracts of the Purple Cross platform services — the REST API services exposed
under `/api/v1`. Where SvcV-2 (Services Resource Flow Description) shows the
service nodes and aggregated flows graphically, SvcV-6 decomposes each flow into
concrete, tabular **interface contracts**: representative endpoints, the
request/response payload, the validation applied, the triggering event, and the
downstream effects (Prisma tables written, domain events emitted, external calls
made).

Services in this matrix are the platform's 37 REST modules plus the shared
platform services (cache, domain-events, webhook delivery, workflow engine) and
the consumed external services (SendGrid, Twilio, Payment Provider, External Lab,
Sentry).

> ⚠️ **Honesty note.** Contracts marked **PLANNED / IN PROGRESS** are not yet
> wired. Authentication is **not enforced** on any route (the `auth` module
> exposes 0 mounted routes); `tenantId` is **unscoped**; AuditLog is written by
> only ~7/34 services; field-level crypto is applied to **0** fields (PHI/PII is
> persisted in plaintext); the Payment Provider integration is **aspirational**
> (no Stripe SDK present). These gaps are flagged per-row in the Notes column.

### 1.1 Service Identification Scheme

| Prefix | Meaning | Example |
|--------|---------|---------|
| `SVC-Cnn` | Core service (12) | SVC-C01 patients |
| `SVC-Enn` | Extended service (25) | SVC-E07 estimates |
| `SVC-Pnn` | Shared platform service | SVC-P02 domain-events |
| `SVC-Xnn` | External / consumed service | SVC-X01 SendGrid |
| `RF-nnn` | Resource flow row in this matrix | RF-014 |

---

## 2. Common Interface Conventions

All `/api/v1` service contracts share the conventions below; per-endpoint rows
record only the deltas from these defaults.

| Concern | Convention |
|---------|-----------|
| Base path | `/api/v1/<resource>` (kebab-case plural) |
| Transport | HTTPS, JSON request/response bodies, UTF-8 |
| Validation | Joi via `validate()` / `validateQuery()` / `validateParams()` middleware, **before** controller |
| Success envelope | `{ "status": "success", "data": <object|array>, "meta"?: <pagination> }` |
| Error envelope | `{ "status": "error", "error": { "code": <ERR_CODE>, "message": <string>, "correlationId": <uuid> } }` (AppError) |
| Pagination | `?page` / `?limit` query params; defaults via `PAGINATION` constants; `meta.total`, `meta.page`, `meta.limit` |
| Tracing | `X-Correlation-ID` request/response header on every call |
| API docs | OpenAPI 3.0.3 via swagger-jsdoc served at `/api-docs` |
| AuthZ | **PLANNED** — no JWT verification middleware is mounted on any route today |

---

## 3. Services Resource Flow Matrix — Core Services

Representative endpoints (not exhaustive). Method + path are literal; payload
columns summarize the shape. "DB write" lists primary Prisma model(s); "Events"
lists domain events emitted via `domain-events.service`; "Ext" lists outbound
external service calls.

### 3.1 Patients (SVC-C01) and Clients (SVC-C02)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-001 | `GET /api/v1/patients` | query: `page,limit,search,species,clientId` | `{data:[Patient],meta}` | validateQuery | List view load | — (read) | — | tenantId unscoped (PLANNED) |
| RF-002 | `POST /api/v1/patients` | `{name,species,breed,dob,clientId,...}` | `{data:Patient}` 201 | validate(body) | New patient created | `Patient` | `patient.created` | PHI plaintext (gap) |
| RF-003 | `GET /api/v1/patients/:id` | params: `id` | `{data:Patient}` | validateParams | Detail view | — | — | soft-delete hides rows |
| RF-004 | `PATCH /api/v1/patients/:id` | partial Patient | `{data:Patient}` | validateParams+body | Edit save | `Patient` | `patient.updated` | AuditLog: yes |
| RF-005 | `DELETE /api/v1/patients/:id` | params: `id` | 204 | validateParams | Archive | `Patient.deletedAt` | `patient.deleted` | soft delete |
| RF-006 | `POST /api/v1/clients` | `{firstName,lastName,email,phone,address}` | `{data:Client}` 201 | validate(body) | Registration | `Client` | `client.created` | PII plaintext (gap) |
| RF-007 | `GET /api/v1/clients/:id` | params: `id` | `{data:Client, patients[]}` | validateParams | Client profile | — | — | — |

### 3.2 Appointments (SVC-C03) and Waitlist (SVC-E07-rel)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-010 | `GET /api/v1/appointments` | query: `date,staffId,patientId,status` | `{data:[Appointment],meta}` | validateQuery | Calendar load | — | — | — |
| RF-011 | `POST /api/v1/appointments` | `{patientId,staffId,startTime,endTime,reason}` | `{data:Appointment}` 201 | validate(body) | Booking | `Appointment` | `appointment.booked` → reminder job | enqueues BullMQ reminder |
| RF-012 | `PATCH /api/v1/appointments/:id/status` | `{status}` | `{data:Appointment}` | validateParams+body | Front-office action | `Appointment.status` | `appointment.status_changed` | state machine — see SvcV-10b |
| RF-013 | `POST /api/v1/waitlist` | `{patientId,reason,priority}` | `{data:WaitlistEntry}` 201 | validate(body) | Slot full | `WaitlistEntry` | `waitlist.added` | — |

### 3.3 Medical Records (SVC-C04), Prescriptions (SVC-C05), Lab Tests (SVC-C08)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-020 | `POST /api/v1/medical-records` | `{patientId,visitDate,soap,diagnosis}` | `{data:MedicalRecord}` 201 | validate(body) | Clinician documents visit | `MedicalRecord` | `medical_record.created` | PHI plaintext (gap) |
| RF-021 | `GET /api/v1/medical-records?patientId=` | query | `{data:[MedicalRecord],meta}` | validateQuery | Chart review | — | — | — |
| RF-022 | `POST /api/v1/prescriptions` | `{patientId,drug,dose,frequency,refills}` | `{data:Prescription}` 201 | validate(body) | Rx written | `Prescription` | `prescription.created` | controlled-drug audit (partial) |
| RF-023 | `POST /api/v1/lab-tests` | `{patientId,testType,specimen}` | `{data:LabTest}` 201 | validate(body) | Order lab | `LabTest` | `lab_test.ordered` → External Lab | Ext call PLANNED |
| RF-024 | `POST /api/v1/lab-tests/:id/results` | `{results,reportUrl}` | `{data:LabTest}` | validateParams+body | Result inbound webhook | `LabTest.status,results` | `lab_test.resulted` | webhook ingest — see SvcV-10c |

### 3.4 Invoices (SVC-C07), Inventory (SVC-C06), Staff (SVC-C09)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-030 | `POST /api/v1/invoices` | `{clientId,lineItems[],dueDate}` | `{data:Invoice}` 201 | validate(body) | Charge raised | `Invoice`,`InvoiceLineItem` | `invoice.created` | totals computed server-side |
| RF-031 | `POST /api/v1/invoices/:id/payments` | `{amount,method,reference}` | `{data:Payment}` 201 | validateParams+body | Payment recorded | `Payment`,`Invoice.status` | `invoice.paid` / Payment Provider | **Payment Provider aspirational** |
| RF-032 | `GET /api/v1/inventory` | query: `lowStock,category` | `{data:[InventoryItem],meta}` | validateQuery | Stock check | — | — | — |
| RF-033 | `PATCH /api/v1/inventory/:id/adjust` | `{delta,reason}` | `{data:InventoryItem}` | validateParams+body | Stock movement | `InventoryItem.quantity`,`StockMovement` | `inventory.adjusted` | reorder threshold check |
| RF-034 | `POST /api/v1/staff` | `{name,role,email,licenseNo}` | `{data:Staff}` 201 | validate(body) | Onboarding | `Staff` | `staff.created` | role used by RBAC (PLANNED) |

### 3.5 Communications (SVC-C10), Documents (SVC-C11), Analytics (SVC-C12)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-040 | `POST /api/v1/communications` | `{clientId,channel,template,payload}` | `{data:Communication}` 201 | validate(body) | Send message | `Communication` | SendGrid (email) / Twilio (SMS) | circuit breaker UNUSED |
| RF-041 | `GET /api/v1/communications?clientId=` | query | `{data:[Communication],meta}` | validateQuery | History | — | — | — |
| RF-042 | `POST /api/v1/documents` | multipart: file + `{patientId,type}` | `{data:Document}` 201 | validate(body) | Upload | `Document` | `document.uploaded` | storage abstraction |
| RF-043 | `GET /api/v1/analytics/dashboard` | query: `from,to` | `{data:{kpis}}` | validateQuery | Dashboard load | — (aggregate read) | — | heavy query; cache candidate |

---

## 4. Services Resource Flow Matrix — Extended Services (representative)

| RF ID | Method / Path | Request payload | Response | Validation | Trigger | DB write | Events / Ext | Notes |
|-------|---------------|-----------------|----------|-----------|---------|----------|--------------|-------|
| RF-050 | `POST /api/v1/estimates` | `{patientId,lineItems[]}` | `{data:Estimate}` 201 | validate(body) | Quote prepared | `Estimate` | `estimate.created` | state machine SvcV-10b |
| RF-051 | `POST /api/v1/estimates/:id/send` | params: `id` | `{data:Estimate}` | validateParams | Send to client | `Estimate.status=Sent` | `estimate.sent` / SendGrid | — |
| RF-052 | `POST /api/v1/insurance-claims` | `{patientId,policyNo,amount}` | `{data:InsuranceClaim}` 201 | validate(body) | File claim | `InsuranceClaim` | `claim.created` | state machine SvcV-10b |
| RF-053 | `POST /api/v1/refunds` | `{paymentId,amount,reason}` | `{data:Refund}` 201 | validate(body) | Refund issued | `Refund`,`Payment` | `refund.created` / Payment Provider | aspirational ext |
| RF-054 | `POST /api/v1/payment-plans` | `{invoiceId,installments[]}` | `{data:PaymentPlan}` 201 | validate(body) | Plan setup | `PaymentPlan` | `payment_plan.created` | — |
| RF-055 | `POST /api/v1/purchase-orders` | `{supplierId,items[]}` | `{data:PurchaseOrder}` 201 | validate(body) | Reorder | `PurchaseOrder` | `po.created` | — |
| RF-056 | `POST /api/v1/loyalty-programs/:id/points` | `{clientId,points}` | `{data:LoyaltyAccount}` | validateParams+body | Reward accrual | `LoyaltyAccount` | `loyalty.accrued` | — |
| RF-057 | `POST /api/v1/feedback` | `{clientId,rating,comment}` | `{data:Feedback}` 201 | validate(body) | Survey response | `Feedback` | `feedback.received` | — |
| RF-058 | `POST /api/v1/marketing-campaigns/:id/send` | params: `id` | `{data:Campaign}` | validateParams | Campaign launch | `Campaign` | SendGrid/Twilio batch | rate-limited |
| RF-059 | `GET /api/v1/client-portal/me` | (session) | `{data:ClientView}` | — | Portal login | — | — | **isolation enforced PLANNED** |
| RF-060 | `POST /api/v1/patient-reminders` | `{patientId,type,dueDate}` | `{data:Reminder}` 201 | validate(body) | Recall set | `Reminder` | reminder job (BullMQ) | — |

---

## 5. Services Resource Flow Matrix — Shared Platform Services

| RF ID | Service | Interface (internal) | Inputs | Outputs | Notes |
|-------|---------|----------------------|--------|---------|-------|
| RF-070 | Cache (SVC-P01) `cache.service` | `get(key)` / `set(key,val,ttl)` (Redis) | key, value, TTL | cached value | used opportunistically; not on hot paths |
| RF-071 | Domain Events (SVC-P02) `domain-events.service` | `emit(eventName, payload)` | event name, payload | subscriber invocations | in-process bus; backs reminders/webhooks |
| RF-072 | Webhook Delivery (SVC-P03) `webhook-delivery.service` | dispatch on domain event | event, subscription | HTTPS POST to subscriber | HMAC-signed; retry via BullMQ — SvcV-10b |
| RF-073 | Webhook Events (SVC-P04) `webhook-events.service` | map domain→external event | domain event | webhook event record | catalog of deliverable events |
| RF-074 | Workflow Engine (SVC-P05) `workflow-engine.service` | execute steps | WorkflowExecution | step results, calls to services | orchestrates cross-service — SvcV-10c |
| RF-075 | Workflow Trigger (SVC-P06) `workflow-trigger.service` | subscribe to events | domain event | new WorkflowExecution | event/schedule-driven |
| RF-076 | Job Queue (BullMQ) | `enqueue(job)` (Redis) | job + data | async processing | Bull Board `/admin/queues` **unauthenticated** (gap) |
| RF-077 | Health (SVC-E-health) | `GET /health[/live|/ready|/detailed]` | — | status JSON | liveness/readiness probes |
| RF-078 | Metrics (SVC-E-metrics) | `GET /metrics` | — | in-memory JSON counters | **not Prometheus** (gap) |

---

## 6. Services Resource Flow Matrix — External / Consumed Services

| RF ID | External Service | Direction | Protocol | Triggered by | Payload | Resilience | Status |
|-------|------------------|-----------|----------|--------------|---------|-----------|--------|
| RF-080 | SendGrid (SVC-X01) | Outbound | HTTPS REST (SDK) | RF-040/051/058 | email message | circuit-breaker.ts EXISTS but UNUSED | LIVE (keyed) |
| RF-081 | Twilio (SVC-X02) | Outbound | HTTPS REST (SDK) | RF-040/058 | SMS message | retry.ts EXISTS but UNUSED | LIVE (keyed) |
| RF-082 | Payment Provider (SVC-X03) | Bidirectional | HTTPS REST | RF-031/053 | charge/refund/status | none wired | **ASPIRATIONAL — no SDK** |
| RF-083 | External Lab (SVC-X04) | Bidirectional | HTTPS REST + inbound webhook | RF-023/024 | order out, result in | none wired | **PLANNED** |
| RF-084 | Sentry (SVC-X05) | Outbound | HTTPS | unhandled errors | error events | SDK init | PARTIAL |

---

## 7. Resource Flow Classification Summary

| Class | Example RF rows | Sensitivity | Encryption today |
|-------|-----------------|-------------|------------------|
| Clinical (PHI) | RF-002, RF-020, RF-022, RF-023 | HIGH | transit only; at-rest field crypto = 0 fields (gap) |
| Financial | RF-030, RF-031, RF-053 | HIGH | transit only |
| PII | RF-006, RF-040, RF-059 | HIGH | transit only |
| Operational | RF-010, RF-032, RF-055 | MEDIUM | transit |
| Notification | RF-040, RF-051, RF-058 | MEDIUM | provider TLS |

---

## 8. Gaps and Honest Status

| Gap ID | Description | Affected RF rows | Status |
|--------|-------------|------------------|--------|
| G-01 | No AuthN/Z on any route; `auth` module has 0 mounted routes | ALL | PLANNED (Phase 3) |
| G-02 | `tenantId` unscoped — cross-tenant reads possible | ALL list/read | IN PROGRESS |
| G-03 | AuditLog written by ~7/34 services only | most writes | IN PROGRESS |
| G-04 | Field crypto applied to 0 fields; PHI/PII plaintext at rest | RF-002/006/020/022 | PLANNED |
| G-05 | Payment Provider integration aspirational (no SDK) | RF-031/053/082 | ASPIRATIONAL |
| G-06 | External Lab integration not wired | RF-023/024/083 | PLANNED |
| G-07 | Circuit breaker / retry utilities exist but unused on external calls | RF-080/081/082/083 | IN PROGRESS (Phase 4) |
| G-08 | Bull Board admin queue UI unauthenticated | RF-076 | PLANNED |
| G-09 | `/metrics` in-memory JSON, not Prometheus; no per-service SLO | RF-078 | PLANNED (SvcV-7) |

---

## 9. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-1 | Service context / nodes that own these contracts |
| SvcV-2 | Graphical resource-flow this matrix decomposes |
| SvcV-4 | Service functions invoked by these endpoints |
| SvcV-7 | Measures/SLOs over these flows |
| SvcV-10a | Contract rules (envelope, validation, pagination) governing rows |
| SvcV-10b | State machines for Appointment/Invoice/Estimate/Claim/Webhook |
| SvcV-10c | Event traces for booking, billing, lab, workflow scenarios |
| SV-6 | Underlying systems resource flow matrix |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
