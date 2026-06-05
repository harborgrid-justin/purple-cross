# SV-6: Systems Resource Flow Matrix

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-6-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-6 is the detailed, tabular **Systems Resource Flow Matrix**: it specifies the
discrete data exchanges at the **interface level**, i.e. the representative REST
endpoints exposed by **S2 (Express API)** over interface **I1** (RF-01/RF-02 in
[SV-2](template.SV-2.md)). For each exchange it records the HTTP method + path
(`/api/v1/<resource>`), the triggering event, the request and response payloads
(JSON), and the **PostgreSQL tables touched** in **S3**. This is the most concrete
SV artifact and the bridge to DIV-3 (physical data model).

> ⚠️ **Honesty note.** Endpoints below are mounted under the global `authenticate`
> guard (SF-AUTH, LIVE); **route-level RBAC (SF-AUTHZ) and tenant scoping
> (SF-TENANT) are PLANNED**, so the "Tables" column reflects unscoped access
> today. Payment/lab exchanges are PLANNED. Standard envelope:
> `{ "status": "success", "data": ... }` or an error envelope. All list endpoints
> accept `page`, `limit`, `sortBy`, `sortOrder`, and resource filters
> (Joi-validated). See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Conventions

| Element | Convention |
|---------|------------|
| Base path | `/api/v1` (`env.apiPrefix`) |
| Auth | `Authorization: Bearer <JWT>` (SF-AUTH); client-portal uses own principal |
| List response | `{ status, data: [...], meta: { page, limit, total } }` |
| Item response | `{ status, data: { ... } }` |
| Create/Update body | Joi-validated JSON (SF-VALID) |
| Delete | `204 No Content` |
| Trigger | UI action, scheduled job (S5), or domain event (SF-D2) |

---

## 3. Resource Flow Matrix — Core Modules

| Endpoint (S1→S2, I1) | Trigger | Request Payload | Response Payload | S3 Tables Touched |
|----------------------|---------|-----------------|------------------|-------------------|
| `GET /patients` | Open patient list | query: page/limit/search | `data[] Patient` | Patient (R) |
| `POST /patients` | Register patient | `{name,species,breed,clientId,...}` | `data: Patient` | Patient (W), Client (R) |
| `GET /patients/:id` | Open patient chart | params:id | `data: Patient` (+relations) | Patient, MedicalRecord (R) |
| `PATCH /patients/:id` | Edit patient | partial Patient | `data: Patient` | Patient (W), AuditLog (W*) |
| `DELETE /patients/:id` | Remove patient | params:id | `204` | Patient (W) |
| `GET /clients` | Open client list | query | `data[] Client` | Client (R) |
| `POST /clients` | Add client | `{firstName,lastName,email,phone,...}` | `data: Client` | Client (W) |
| `PATCH /clients/:id` | Edit client | partial Client | `data: Client` | Client (W), AuditLog (W*) |
| `GET /appointments` | Calendar load | query: date range/staffId | `data[] Appointment` | Appointment (R), Patient/Staff (R) |
| `POST /appointments` | Book appointment | `{patientId,staffId,startTime,reason}` | `data: Appointment` | Appointment (W); enqueue reminder (S4) |
| `PATCH /appointments/:id` | Reschedule/status | `{startTime?|status?}` | `data: Appointment` | Appointment (W) |
| `GET /medical-records` | Records list | query: patientId | `data[] MedicalRecord` | MedicalRecord (R) |
| `POST /medical-records` | Document visit | `{patientId,soap,diagnosis,...}` | `data: MedicalRecord` | MedicalRecord (W), Patient (R), AuditLog (W*) |
| `POST /prescriptions` | Write Rx | `{patientId,drug,dose,refills}` | `data: Prescription` | Prescription (W), InventoryItem (R) |
| `GET /prescriptions` | Rx list | query: patientId | `data[] Prescription` | Prescription (R) |
| `POST /lab-tests` | Order lab | `{patientId,panel,sampleType}` | `data: LabTest` | LabTest (W) |
| `PATCH /lab-tests/:id` | Enter result | `{result,status}` | `data: LabTest` | LabTest (W) |
| `GET /inventory` | Stock list | query: lowStock | `data[] InventoryItem` | InventoryItem (R) |
| `PATCH /inventory/:id` | Adjust stock | `{quantity,reorderLevel}` | `data: InventoryItem` | InventoryItem (W) |
| `POST /invoices` | Generate invoice | `{clientId,lineItems[]}` | `data: Invoice` | Invoice (W), LineItem (W), Client (R) |
| `GET /invoices/:id` | Open invoice | params:id | `data: Invoice` (+items) | Invoice, LineItem (R) |
| `POST /invoices/:id/payments` | Record payment | `{amount,method}` | `data: Payment` | Payment (W), Invoice (W) |
| `GET /staff` | Staff directory | query | `data[] Staff` | Staff (R) |
| `POST /communications` | Send/queue message | `{clientId,channel,template,vars}` | `data: Communication` | Communication (W); enqueue send (S4→S5→X1/X2) |
| `GET /documents` | Document list | query: entityId | `data[] Document` | Document (R) |
| `POST /documents` | Upload/attach doc | `{entityType,entityId,fileRef}` | `data: Document` | Document (W) |
| `GET /analytics/summary` | Dashboard load | query: range | `data: {kpis...}` | aggregations (R); cache via S4 |

\* `AuditLog (W*)` = written only where the service implements audit (~7/34 services).

---

## 4. Resource Flow Matrix — Extended Modules (Representative)

| Endpoint | Trigger | Request Payload | Response Payload | S3 Tables Touched |
|----------|---------|-----------------|------------------|-------------------|
| `GET /breed-info` | Breed lookup | query: species | `data[] BreedInfo` | BreedInfo (R) |
| `POST /patient-relationships` | Link patients | `{patientId,relatedId,type}` | `data: PatientRelationship` | PatientRelationship (W) |
| `POST /patient-reminders` | Schedule reminder | `{patientId,dueDate,type}` | `data: PatientReminder` | PatientReminder (W); enqueue (S4) |
| `POST /client-portal/login` | Portal sign-in | `{email,password}` | `data: {token}` | Client (R) — own principal |
| `GET /client-portal/appointments` | Portal view | (portal JWT) | `data[] Appointment` | Appointment (R) |
| `POST /loyalty-programs/:id/points` | Accrue points | `{clientId,points}` | `data: LoyaltyProgram` | LoyaltyProgram (W) |
| `POST /feedback` | Submit feedback | `{clientId,rating,comment}` | `data: Feedback` | Feedback (W) |
| `POST /waitlist` | Add to waitlist | `{patientId,priority}` | `data: WaitlistEntry` | WaitlistEntry (W) |
| `POST /time-blocks` | Block schedule | `{staffId,start,end,reason}` | `data: TimeBlock` | TimeBlock (W) |
| `POST /estimates` | Create estimate | `{clientId,items[]}` | `data: Estimate` | Estimate (W) |
| `POST /payment-plans` | Set up plan | `{invoiceId,installments}` | `data: PaymentPlan` | PaymentPlan (W) — **payment capture PLANNED (X3)** |
| `POST /purchase-orders` | Order supplies | `{vendor,items[]}` | `data: PurchaseOrder` | PurchaseOrder (W) |
| `PATCH /equipment/:id` | Update equipment | `{status,lastService}` | `data: Equipment` | Equipment (W) |
| `POST /insurance-claims` | File claim | `{clientId,invoiceId,insurer}` | `data: InsuranceClaim` | InsuranceClaim (W) |
| `POST /refunds` | Issue refund | `{paymentId,amount,reason}` | `data: Refund` | Refund (W), Payment (R) — **capture PLANNED (X3)** |
| `POST /marketing-campaigns` | Launch campaign | `{segment,template,schedule}` | `data: MarketingCampaign` | MarketingCampaign (W); enqueue sends (S4→S5→X1/X2) |
| `GET /policies` | Policy list | query | `data[] Policy` | Policy (R) |
| `POST /report-templates` | Save report tpl | `{name,definition}` | `data: ReportTemplate` | ReportTemplate (W) |
| `POST /document-templates` | Save doc tpl | `{name,body}` | `data: DocumentTemplate` | DocumentTemplate (W) |
| `POST /webhooks` | Register webhook | `{url,events[],secret}` | `data: Webhook` | Webhook (W) |
| `POST /workflows` | Define workflow | `{trigger,steps[]}` | `data: Workflow` | Workflow (W) |
| `GET /workflow-executions/:id` | Inspect run | params:id | `data: WorkflowExecution` | WorkflowExecution (R) |

---

## 5. Internal & Async Resource Flows (non-I1)

| Exchange | Interface (SV-1) | Trigger | Payload | Effect |
|----------|------------------|---------|---------|--------|
| S2 → S4 cache set/get | I3 / RF-05 | analytics & lookup reads | JSON value | populate/serve `cache.service` |
| S2 → S4 enqueue job | I3 / RF-05 | reminder/comm/webhook/workflow | BullMQ job JSON | defer work to S5 |
| S4 → S5 consume job | I5 / RF-08 | worker poll | job JSON | execute delivery/workflow |
| S5 → S3 write side-effects | I4 / RF-06 | job completion | SQL | status updates, WebhookDelivery, WorkflowExecution rows |
| S5 → X1/X2 send | I6/I7 / RF-07 | communication job | JSON/form | email/SMS dispatch (PARTIAL) |
| S5 → tenant URL | I11 / RF-09 | webhook event | signed JSON | external callback (PARTIAL) |
| Op → `/health/ready` | I12 / RF-13 | LB/k8s probe | — | checks S3 + S4 connectivity |

---

## 6. Ops & Docs Endpoints

| Endpoint | Access | Payload | Notes |
|----------|--------|---------|-------|
| `GET /health`, `/health/live`, `/health/ready`, `/health/detailed` | public | JSON | `/ready` checks PG + Redis (SF-E1) |
| `GET /metrics` | `authenticate`+ADMIN | in-memory JSON | **NOT Prometheus** (SF-E2); RBAC weak |
| `GET /api-docs`, `/api-docs.json` | public (when enabled) | HTML / OpenAPI 3.0.3 | swagger-jsdoc (SF-E3) |
| `GET /admin/queues` | `authenticate`+ADMIN | HTML (Bull Board) | queue dashboard (SF-E4); RBAC weak |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SV-1 | Interface I1 these endpoints traverse |
| SV-2 | Resource flows RF-01..RF-13 detailed here |
| SV-4 | Functions (SF-Bxx/SF-Cxx) realized by these endpoints |
| SV-5a/5b | Activities supported by these exchanges |
| DIV-3 | Physical tables in the "S3 Tables Touched" column |
| SvcV-6 | Service resource flow matrix (complementary) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
