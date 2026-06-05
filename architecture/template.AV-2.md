# AV-2: Integrated Dictionary

## DoDAF 2.02 All Viewpoint

**Document ID:** PCVPM-AV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

The AV-2 Integrated Dictionary is the single, authoritative glossary for the
Purple Cross architecture description. Every term, data entity, capability,
operational activity, system, and service referenced in any other viewpoint
(AV/CV/DIV/OV/SV/SvcV) is defined here once. When a definition changes, it
changes here and the dependent views inherit it.

> **Maintenance rule:** new acronyms or entities introduced in any view MUST be
> added to this dictionary in the same change set. Treat AV-2 as the contract
> for vocabulary across the architecture.

---

## 2. Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Capability ID | `CAP-<domain>.<sub>` | `CAP-1.0`, `CAP-2.1` |
| Operational Activity ID | `A<n>[.<n>]` | `A3`, `A3.1` |
| System ID | `S<n>` | `S2` (Express API) |
| System Function ID | `SF-<n>` | `SF-12` |
| Service ID | `SVC-<n>` | `SVC-07` |
| Rule ID | `OR-/SR-/SvcR-<n>` | `OR-014` |
| Data entity | Prisma model name (PascalCase) | `Patient`, `Invoice` |
| Status marker | `REAL` / `IN PROGRESS` / `PLANNED` | auth = `PLANNED` |

---

## 3. Architecture & Framework Terms

| Term | Definition | Reference |
|------|------------|-----------|
| DoDAF 2.02 | Department of Defense Architecture Framework v2.02; the viewpoint model used to structure this description | AV-1 |
| Viewpoint | A standardized perspective (AV, CV, DIV, OV, SV, SvcV) on the architecture | README |
| ITTO | Inputs, Tools & Techniques, Outputs — the process companion for each artifact | `*.itto.md` |
| Architecture Baseline | The 1.0.0 snapshot dated 2026-06-05 | AV-1 §1.4 |
| Capability | A high-level ability the platform provides to a veterinary practice | CV-1/CV-2 |
| Operational Activity | A task performed by practice staff/clients, independent of implementing system | OV-5a |
| System | A deployable technical element (SPA, API, database, cache, worker) | SV-1 |
| Service | A REST API capability exposed under `/api/v1` (a backend module) | SvcV-1 |
| Needline | A required exchange of information between operational nodes | OV-2/OV-3 |
| Resource Flow | An exchange of data/resources between systems or services | SV-2/SvcV-2 |

---

## 4. Platform & Technology Terms

| Term | Definition | Status |
|------|------------|--------|
| Backend | Express 4.18 + TypeScript REST API (`backend/`), layered route → controller → service → Prisma | REAL |
| Frontend | React 18 + Vite SPA (`frontend/`) using TanStack Query, React Router 6, Zustand | IN PROGRESS (many placeholder pages) |
| Prisma | ORM (v6.18) mapping TypeScript to PostgreSQL; schema at `backend/prisma/schema.prisma` | REAL |
| PostgreSQL | Primary relational system of record (v15) | REAL |
| Redis | In-memory store (v7) used for caching and the BullMQ job queue | REAL |
| BullMQ | Redis-backed job queue; admin UI Bull Board at `/admin/queues` | REAL (admin UI unauthenticated — risk) |
| Correlation ID | Per-request `X-Correlation-ID` propagated for distributed tracing | REAL |
| Request Context | AsyncLocalStorage carrying correlation ID, IP, and (future) user/tenant | REAL (user/tenant enrichment PLANNED) |
| Circuit Breaker | Resilience utility (`utils/circuit-breaker.ts`) with CLOSED/OPEN/HALF_OPEN states | PLANNED (defined, currently unused) |
| Retry w/ backoff | Resilience utility (`utils/retry.ts`) | PLANNED (defined, currently unused) |
| Health endpoints | `/health`, `/health/live`, `/health/ready`, `/health/detailed` | REAL |
| Metrics endpoint | `/metrics` in-memory JSON counters/latencies | REAL (not Prometheus format; nominally admin-only, unenforced) |
| OpenAPI | OpenAPI 3.0.3 spec via `swagger-jsdoc`, served at `/api-docs` | REAL |
| Winston | Structured JSON logger with PII redaction (`logs/*.log`) | REAL |
| Sentry | Optional error tracking/profiling via `SENTRY_DSN` | REAL (optional) |

---

## 5. Security & Compliance Terms (honest status)

| Term | Definition | Status |
|------|------------|--------|
| Authentication (AuthN) | Verifying identity; `middleware/auth.ts` (JWT) exists | **PLANNED — imported by ZERO routes; frontend hardcodes `isAuthenticated = true`** |
| Authorization (RBAC) | Role-based access; `authorize()` and role constants exist | **PLANNED — defined but unenforced** |
| Multi-Tenancy | Tenant isolation; `tenantId` columns + `prisma-extensions/tenant.ts` exist | **PLANNED — columns present but queries not scoped; single-tenant in practice** |
| Audit Logging | `AuditLog` model + `prisma-extensions/audit.ts` | **IN PROGRESS — written by ~7 of ~34 services** |
| Field Encryption | `utils/field-crypto.ts` + `prisma-extensions/field-crypto.ts` | **PLANNED — applied to ZERO fields; PHI/PII stored plaintext** |
| Input Sanitization | XSS/injection prevention on inputs (`middleware/sanitization.ts`) | REAL |
| Helmet | Security headers | REAL |
| CORS | Cross-origin policy via `CORS_ORIGIN` | REAL |
| Rate Limiting | Per-IP throttling (default 100 req / 15 min) | REAL |
| PHI/PII | Protected Health / Personally Identifiable Information (client + patient data) | Stored plaintext today — see Field Encryption |
| HIPAA-equivalent | Target compliance posture for veterinary client/patient data | PLANNED |

---

## 6. Data Entities (Integrated Data Dictionary)

> Canonical definitions for the Prisma models. Grouped by subject area; see
> **DIV-1/DIV-2/DIV-3** for relationships, attributes, and physical mapping. All
> core entities carry shared columns: `createdAt`, `updatedAt`, `createdBy`,
> `updatedBy`, `version`, `deletedAt` (soft delete), `tenantId` (tenancy —
> defined, not yet enforced).

### 6.1 Clinical

| Entity | Definition |
|--------|------------|
| `Patient` | A pet under care (species, breed, DOB, sex, weight, microchip, insurance) |
| `MedicalRecord` | A clinical visit note (diagnosis, treatment, clinician, notes) |
| `MedicalRecordShare` | Consent-based sharing of a medical record with a staff member |
| `ClinicalTemplate` | Reusable medical-record template |
| `Prescription` | A medication order (dosage, frequency, refills, prescriber) |
| `Medication` | Pharmacy medication reference (ingredient, strength, expiry) |
| `DrugInteraction` | Known interaction between two drugs with severity |
| `ControlledSubstanceLog` | DEA-style audit log of controlled substance handling |
| `CompoundingFormula` | Recipe for a compounded medication |
| `LabTest` | A laboratory order/result for a patient |
| `ExternalLabIntegration` | Configuration for a third-party lab API |
| `QualityControlRecord` | Lab QC / calibration record |
| `BreedInformation` | Breed reference data (characteristics, health risks) |
| `PatientRelationship` | Relationship/household link between patients |
| `PatientReminder` / `AppointmentReminder` | Recurring / appointment-linked reminders |

### 6.2 Client / CRM & Engagement

| Entity | Definition |
|--------|------------|
| `Client` | A pet owner (contact, address, emergency contact) |
| `ClientPortalAccess` | Portal credentials/token for a client (separate auth path) |
| `LoyaltyProgram` / `LoyaltyTransaction` | Loyalty scheme and point ledger |
| `ClientFeedback` / `Survey` / `SurveyResponse` | Feedback and survey capture |
| `ClientSegment` | Marketing segmentation of clients |
| `Communication` | An outbound email/SMS message and its delivery status |

### 6.3 Scheduling

| Entity | Definition |
|--------|------------|
| `Appointment` | A scheduled visit linking client, patient, and staff |
| `Waitlist` | Queue for cancellation/availability slots |
| `TimeBlock` | Staff availability or blocked time |

### 6.4 Billing / Finance

| Entity | Definition |
|--------|------------|
| `Invoice` / `InvoiceLineItem` | Billing document and its line items |
| `Payment` | A payment transaction against an invoice |
| `Estimate` / `EstimateLineItem` | Cost estimate for services |
| `PaymentPlan` / `PaymentPlanInstallment` | Installment agreement and schedule |
| `Refund` | A refund against an invoice |
| `InsuranceClaim` | An insurance submission for a patient |

### 6.5 Inventory / Supply & Assets

| Entity | Definition |
|--------|------------|
| `InventoryItem` | Stock record with reorder level |
| `PurchaseOrder` / `PurchaseOrderItem` | Vendor order and lines |
| `Equipment` / `EquipmentMaintenance` | Medical equipment and maintenance log |

### 6.6 Staff / HR

| Entity | Definition |
|--------|------------|
| `Staff` | An employee record (role, license, schedule) |

### 6.7 Documents / Content & Reporting

| Entity | Definition |
|--------|------------|
| `Document` | An uploaded/managed file |
| `DocumentTemplate` | Template for generated documents |
| `DocumentSignature` | A digital signature on a document |
| `DocumentWorkflow` | Routing/approval flow for a document |
| `ReportTemplate` / `ReportSchedule` | Report layout and scheduled run |

### 6.8 Workflow / Automation & Integration

| Entity | Definition |
|--------|------------|
| `Workflow` / `WorkflowTemplate` | Automation definition / blueprint |
| `WorkflowExecution` / `WorkflowExecutionStep` | Workflow instance and step results |
| `WebhookSubscription` / `WebhookDelivery` | Outbound webhook subscription and delivery attempts |

### 6.9 Compliance / Operations

| Entity | Definition |
|--------|------------|
| `AuditLog` | Change audit trail (entity, action, old/new values, user) |
| `ComplianceIncident` | Recorded incident report |
| `Policy` / `PolicyAcknowledgment` | Policy document and staff sign-off |
| `RegulatoryUpdate` | Regulatory change alert |
| `DataImportJob` | Bulk data import job record |
| `ApiUsageMetric` | API usage metering record |

### 6.10 Security / Tenancy / API Management

| Entity | Definition | Status |
|--------|------------|--------|
| `User` | Staff login identity (email, passwordHash, role, tenantId) | PLANNED (login endpoints not wired) |
| `RefreshToken` | Session refresh token | PLANNED |
| `Tenant` | Tenant boundary (subscription tier) | PLANNED (not enforced) |
| `ApiKey` | API authentication key with permissions | PLANNED |

---

## 7. Operator Roles

| Role | Definition |
|------|------------|
| Veterinarian | Licensed clinician; diagnoses, treats, prescribes |
| Vet Technician | Assists clinical care, runs diagnostics, intake |
| Front Office / Receptionist | Scheduling, check-in, billing, client service |
| Practice Manager | Operations, staffing, reporting, oversight |
| Pet Owner (Client) | External user; self-service via the client portal |
| Platform Team | Engineering/ops building and operating the platform |

---

## 8. Acronyms

| Acronym | Definition |
|---------|------------|
| PIMS | Practice Information Management System |
| EHR | Electronic Health Record |
| RBAC | Role-Based Access Control |
| AuthN / AuthZ | Authentication / Authorization |
| PHI / PII | Protected Health / Personally Identifiable Information |
| ORM | Object-Relational Mapping |
| SPA | Single-Page Application |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| SLA / SLO | Service Level Agreement / Objective |
| RPO / RTO | Recovery Point / Time Objective |
| PI | Program Increment |
| ICOM | Inputs, Controls, Outputs, Mechanisms (IDEF0) |
| CRUD | Create, Read, Update, Delete |
| DEA | Drug Enforcement Administration (controlled substances) |
| ITTO | Inputs, Tools & Techniques, Outputs |

---

## Appendix A: Source References

| Reference | Location |
|-----------|----------|
| Module catalog | [`../CLAUDE.md`](../CLAUDE.md) |
| Data model | [`../backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) |
| Gap analysis | [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md) |
| App composition | [`../backend/src/app.ts`](../backend/src/app.ts) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
