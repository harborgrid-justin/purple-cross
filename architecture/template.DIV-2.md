# DIV-2: Logical Data Model

## DoDAF 2.02 Data and Information Viewpoint

**Document ID:** PCVPM-DIV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

DIV-2 elaborates the conceptual model (**DIV-1**) into a **logical data model**:
the **~69 entities** of Purple Cross with their **key attributes**, **primary and
foreign keys**, **cardinalities**, and **normalization** — independent of the
PostgreSQL/Prisma physical realization (which is **DIV-3**). It is grounded in
`backend/prisma/schema.prisma` and uses the model (PascalCase) names; the
physical table names (`@@map`) are given in DIV-3.

The model is **third-normal-form (3NF)** in the operational core, with JSON
columns used pragmatically for semi-structured/variable payloads (vital signs,
results, configuration, metrics). Line-item children are separate entities owned
by their parent via cascade.

> **Honesty note.** A shared **audit / soft-delete / tenancy** column set is
> *defined* on most operational entities (§5) but is **not fully enforced** at
> runtime: the Prisma extensions that populate `createdBy/updatedBy`, filter
> `deletedAt`, and inject `tenantId` depend on an authenticated request context
> that does **not exist yet** (auth is not wired). For unauthenticated/system
> calls, tenant scoping and audit stamping **no-op** (fail-open).

---

## 2. Logical Entities by Subject Area

Notation: **PK** primary key · **FK→** foreign key to entity · attributes listed
are the *significant* ones (not exhaustive). `*` = nullable. Every operational
entity also carries the **shared column set** from §5 unless noted.

### 2.1 Clinical

| Entity | PK | Key Attributes | Foreign Keys | Notes |
|--------|----|----------------|--------------|-------|
| **Patient** | id | name, species, breed*, dateOfBirth, gender, color*, weight*, microchipId* (UQ), insuranceProvider*, insurancePolicy*, status | ownerId FK→Client | Pet; microchipId unique |
| **MedicalRecord** | id | visitDate, chiefComplaint, diagnosis, treatment, notes*, vitalSigns (JSON*), attachments (JSON*) | patientId FK→Patient, veterinarianId FK→Staff | Encrypted free-text (DIV-3 §7) |
| **Prescription** | id | dosage, frequency, duration, instructions*, refillsAllowed, refillsUsed, prescribedDate, expirationDate, status | patientId FK→Patient, medicationId FK→Medication, prescribedBy FK→Staff | |
| **Medication** | id | name, genericName*, category, dosageForm, strength, manufacturer*, ndcCode* (UQ), controlled, controlSchedule* | — | Reference data; not tenant-scoped |
| **LabTest** | id | testType, testName, orderedBy, orderedDate, labType, externalLabName*, status, sampleId*, collectionDate*, results (JSON*), interpretation*, urgency | patientId FK→Patient | External lab name free-text |
| **ClinicalTemplate** | id | name, category, template (JSON), quickTexts (JSON*), specialty*, usageCount, status | — | |
| **MedicalRecordShare** | id | sharedWith, sharedBy, shareType, accessLevel, expiresAt*, status | medicalRecordId (logical FK→MedicalRecord) | Referral sharing |
| **DrugInteraction** | id | medication1Id, medication2Id, severity, description, recommendation* | (logical FK→Medication ×2) | UQ(medication1Id, medication2Id) |
| **ControlledSubstanceLog** | id | action, quantity, unit, performedBy, witnessedBy*, reason*, timestamp | medicationId, prescriptionId*, patientId* (logical) | DEA-style ledger |
| **CompoundingFormula** | id | name, ingredients (JSON), instructions (JSON), stabilityPeriod*, storageConditions* | — | |
| **QualityControlRecord** | id | testType, controlType, controlDate, expectedValue, actualValue, acceptable, performedBy | equipmentId* (logical) | Lab QC |
| **ExternalLabIntegration** | id | labName (UQ), apiEndpoint*, apiKey*, apiSecret*, integrationStatus, supportedTests (JSON*), lastSyncAt* | — | Secrets stored plaintext (gap) |
| **BreedInformation** | id | breed (UQ), species, commonHealthIssues (JSON*), averageLifespan*, temperament* | — | Reference data |
| **PatientRelationship** | id | relationshipType, notes* | patientId, relatedPatientId (logical) | UQ(patientId, relatedPatientId, relationshipType) |
| **PatientReminder** | id | reminderType, reminderDate, description, recurring, frequency*, status, completedAt* | patientId (logical) | |

### 2.2 Client / CRM

| Entity | PK | Key Attributes | Foreign Keys | Notes |
|--------|----|----------------|--------------|-------|
| **Client** | id | firstName, lastName, email (UQ), phone, alternatePhone*, address, city, state, zipCode, emergencyContact*, preferredContact, status | — | Owner; PII |
| **Communication** | id | type (email/sms), direction, subject*, message, sentAt, deliveredAt*, readAt*, status, metadata (JSON*) | clientId FK→Client | |
| **ClientPortalAccess** | id | clientId (UQ), email (UQ), passwordHash, twoFactorEnabled, lastLoginAt*, loginAttempts, lockedUntil*, status | clientId (logical→Client) | Separate from User auth |
| **LoyaltyProgram** | id | clientId (UQ), pointsBalance, tier, lifetimePoints, lifetimeSpending, joinDate | clientId (logical→Client) | |
| **LoyaltyTransaction** | id | transactionType, points, description*, transactionDate | loyaltyProgramId FK→LoyaltyProgram | |
| **ClientFeedback** | id | feedbackType, rating*, comment*, npsScore*, status, reviewedBy*, reviewedAt* | clientId (logical→Client) | |
| **Survey** | id | title, description*, questions (JSON), status, publishedAt*, expiresAt* | — | |
| **SurveyResponse** | id | answers (JSON), submittedAt, clientId* | surveyId FK→Survey | |
| **ClientSegment** | id | name, description*, criteria (JSON), clientCount, lastCalculatedAt*, status | — | |
| **MarketingCampaign** | id | name, campaignType, channel (String[]), targetSegment (JSON*), startDate, endDate*, content (JSON), metrics (JSON*), status | — | |
| **PushSubscription** | id | userId, endpoint, keys (JSON), deviceType*, status | userId (logical) | Web-push |
| **SocialMediaPost** | id | platform, content, mediaUrls (String[]), scheduledFor*, publishedAt*, externalPostId*, metrics (JSON*), status | — | |

### 2.3 Scheduling

| Entity | PK | Key Attributes | Foreign Keys | Notes |
|--------|----|----------------|--------------|-------|
| **Appointment** | id | appointmentType, startTime, endTime, status, reason, notes*, roomId* | patientId FK→Patient, clientId FK→Client, veterinarianId FK→Staff | Core scheduling fact |
| **AppointmentReminder** | id | reminderType, reminderTime, sent, sentAt* | appointmentId FK→Appointment (cascade) | No shared column set |
| **Waitlist** | id | appointmentType, preferredDate*, preferredTime*, priority, urgency, reason, status, notifiedAt*, bookedAt* | patientId, clientId (logical) | |
| **TimeBlock** | id | blockType, title, startTime, endTime, recurring, recurrenceRule*, notes* | staffId (logical→Staff) | Staff availability |

### 2.4 Billing / Finance

| Entity | PK | Key Attributes | Foreign Keys | Notes |
|--------|----|----------------|--------------|-------|
| **Invoice** | id | invoiceNumber (UQ), invoiceDate, dueDate, subtotal, tax, discount, total, status, notes* | clientId FK→Client | |
| **InvoiceLineItem** | id | description, quantity, unitPrice, total, itemType, itemId* | invoiceId FK→Invoice (cascade) | No shared column set |
| **Payment** | id | amount, paymentMethod, paymentDate, transactionId*, status, notes* | invoiceId FK→Invoice | |
| **Estimate** | id | estimateNumber (UQ), title, subtotal, tax, total, validUntil, status, convertedToInvoiceAt*, invoiceId* | clientId, patientId* (logical) | |
| **EstimateLineItem** | id | description, quantity, unitPrice, total, itemType | estimateId FK→Estimate (cascade) | No shared column set |
| **PaymentPlan** | id | totalAmount, downPayment, remainingBalance, installmentAmount, installmentFrequency, numberOfInstallments, interestRate, startDate, nextPaymentDate, status | clientId, invoiceId* (logical) | |
| **PaymentPlanInstallment** | id | installmentNumber, dueDate, amount, paidAmount, paidDate*, status | paymentPlanId FK→PaymentPlan | No shared column set |
| **Refund** | id | refundNumber (UQ), amount, reason, refundMethod, processedBy, status, requestedDate, processedDate* | invoiceId*, paymentId*, clientId (logical) | |
| **InsuranceClaim** | id | claimNumber (UQ), insuranceProvider, policyNumber, claimDate, serviceDate, diagnosisCodes (String[]), procedureCodes (String[]), claimAmount, approvedAmount*, paidAmount*, status | patientId, clientId (logical) | |

### 2.5 Inventory / Supply, Staff / HR, Documents, Workflow, Compliance, Security

| Entity | PK | Key Attributes | Foreign Keys | Area |
|--------|----|----------------|--------------|------|
| **InventoryItem** | id | itemType, name, sku (UQ), category, quantityOnHand, minimumQuantity, reorderPoint, unitCost, sellingPrice, supplier*, expirationDate*, lotNumber*, status | medicationId* FK→Medication | Inventory |
| **PurchaseOrder** | id | poNumber (UQ), vendor, orderDate, expectedDate*, status, subtotal, tax, shipping, total, approvedBy* | — | Inventory |
| **PurchaseOrderItem** | id | itemType, itemId*, description, quantityOrdered, quantityReceived, unitCost, total, status | purchaseOrderId FK→PO (cascade) | Inventory (no shared cols) |
| **Equipment** | id | name, category, manufacturer*, modelNumber*, serialNumber* (UQ), purchaseDate*, warrantyExpiration*, location*, status | — | Inventory |
| **EquipmentMaintenance** | id | maintenanceType, scheduledDate, completedDate*, performedBy*, cost*, nextMaintenanceDate*, status | equipmentId FK→Equipment | Inventory |
| **Staff** | id | firstName, lastName, email (UQ), phone, role, specialization*, licenseNumber*, licenseExpiry*, employmentType, hireDate, status | — | Staff/HR |
| **StaffSchedule** | id | dayOfWeek, startTime, endTime, effectiveFrom, effectiveTo* | staffId FK→Staff | Staff/HR |
| **TimeAttendance** | id | clockIn, clockOut*, breakStart*, totalHours*, overtimeHours*, status | staffId (logical→Staff) | Staff/HR |
| **PerformanceReview** | id | reviewPeriodStart/End, reviewDate, reviewedBy, overallRating*, ratings (JSON), goals (JSON*), status | staffId (logical→Staff) | Staff/HR |
| **ContinuingEducation** | id | courseTitle, provider, courseDate, completionDate*, credits, certificateNumber*, category, status | staffId (logical→Staff) | Staff/HR |
| **Document** | id | title, category, fileUrl, fileName, fileSize, mimeType, relatedType*, relatedId*, uploadedBy, tags (String[]), status | — | Documents |
| **DocumentTemplate** | id | name, category, template (JSON), fields (JSON*), usageCount, status | — | Documents |
| **DocumentSignature** | id | signerId, signerName, signerEmail, signatureData, signedAt, ipAddress*, status | documentId (logical) | Documents |
| **DocumentWorkflow** | id | workflowName, currentStep, totalSteps, steps (JSON), status, completedAt* | documentId (logical) | Documents |
| **ReportTemplate** | id | name, reportType, category, configuration (JSON), isPublic, createdBy, usageCount, status | — | Documents |
| **ReportSchedule** | id | name, frequency, schedule (JSON), recipients (String[]), format, lastRunAt*, nextRunAt*, status | reportTemplateId* (logical) | Documents |
| **WorkflowTemplate** | id | name, category, triggerType, triggerConfig (JSON), actions (JSON), isPublic, isActive, usageCount | — | Workflow |
| **WorkflowExecution** | id | workflowName, triggerType, triggerData (JSON), status, currentActionId*, variables (JSON), startedAt, completedAt*, error* | templateId* FK→WorkflowTemplate | Workflow |
| **WorkflowExecutionStep** | id | actionId, actionType, actionName, actionConfig (JSON), status, output (JSON*), error*, startedAt* | executionId FK→WorkflowExecution (cascade) | Workflow (no shared cols) |
| **WebhookSubscription** | id | name, url, events (String[]), secret, active | — | Workflow |
| **WebhookDelivery** | id | event, payload (JSON), status, statusCode*, attempt, maxAttempts, deliveredAt*, nextRetryAt* | webhookId FK→WebhookSubscription (cascade) | Workflow |
| **DataImportJob** | id | jobType, fileName, fileUrl, totalRecords*, processedRecords, successCount, errorCount, errors (JSON*), status, createdBy | — | Workflow |
| **ApiUsageMetric** | id | apiKeyId*, endpoint, method, statusCode, responseTime, timestamp, ipAddress*, error* | (logical→ApiKey) | Workflow/metrics |
| **AuditLog** | id | userId, action, resource, resourceId*, changes (JSON*), metadata (JSON*), ipAddress*, userAgent*, timestamp, tenantId* | (logical→User/Tenant) | Compliance (append-only) |
| **ComplianceIncident** | id | incidentType, severity, description, dateOccurred, reportedBy, status, investigation (JSON*), resolution (JSON*) | — | Compliance |
| **Policy** | id | title, category, content, version, effectiveDate, reviewDate*, status | — | Compliance |
| **PolicyAcknowledgment** | id | userId, acknowledgedAt, ipAddress* | policyId FK→Policy | Compliance |
| **RegulatoryUpdate** | id | title, category, description, effectiveDate, impact, actionRequired*, status, assignedTo* | — | Compliance |
| **Tenant** | id | name, slug (UQ), status | — | Security (partition root) |
| **User** | id | email (UQ), passwordHash, role (enum Role), status, firstName*, lastName*, lastLoginAt*, loginAttempts, lockedUntil* | staffId* (UQ) FK→Staff, tenantId* FK→Tenant | Security (auth NOT wired) |
| **RefreshToken** | id | tokenHash (UQ), expiresAt, revokedAt*, replacedById*, createdByIp*, userAgent* | userId FK→User (cascade) | Security (rotation chain) |
| **ApiKey** | id | name, key (UQ), permissions (String[]), rateLimit*, expiresAt*, lastUsedAt*, status | — | Security |

---

## 3. Identity, Keys, and Referential Integrity

| Aspect | Logical Rule |
|--------|--------------|
| **Primary keys** | Every entity uses a surrogate **UUID** `id` (string), DB-generated |
| **Natural/unique keys** | `Client.email`, `Patient.microchipId`, `Invoice.invoiceNumber`, `Estimate.estimateNumber`, `Refund.refundNumber`, `PurchaseOrder.poNumber`, `InsuranceClaim.claimNumber`, `Medication.ndcCode`, `Equipment.serialNumber`, `Staff.email`, `User.email`, `Tenant.slug`, `ApiKey.key`, `RefreshToken.tokenHash`, `BreedInformation.breed`, `ExternalLabIntegration.labName` |
| **Composite uniqueness** | `PatientRelationship(patientId, relatedPatientId, relationshipType)`; `DrugInteraction(medication1Id, medication2Id)` |
| **Foreign keys** | Declared relations enforce RI (e.g., `Patient.ownerId → Client.id`) |
| **Cascade deletes** | Owned children cascade: AppointmentReminder, InvoiceLineItem, EstimateLineItem, PurchaseOrderItem, WebhookDelivery, WorkflowExecutionStep, RefreshToken |
| **Soft references** | Some links are *logical only* (no Prisma relation): `MedicalRecordShare.medicalRecordId`, `Waitlist.patientId/clientId`, `Refund.invoiceId`, `Document.relatedId`, `AuditLog.userId` — RI is application-enforced |

---

## 4. Logical Relationship Matrix (Core Entities)

Rows = parent (1), columns = child (N). `1:N` = one-to-many; `1:1` =
one-to-one; blank = no direct relationship.

| Parent ↓ / Child → | Patient | Appointment | MedicalRecord | Prescription | LabTest | Invoice | Payment | Communication |
|--------------------|:-------:|:-----------:|:-------------:|:------------:|:-------:|:-------:|:-------:|:-------------:|
| **Client** | 1:N | 1:N | — | — | — | 1:N | — | 1:N |
| **Patient** | — | 1:N | 1:N | 1:N | 1:N | — | — | — |
| **Staff** | — | 1:N (vet) | 1:N | 1:N (prescriber) | — | — | — | — |
| **Medication** | — | — | — | 1:N | — | — | — | — |
| **Invoice** | — | — | — | — | — | — | 1:N | — |
| **Tenant** | 1:N | 1:N | 1:N | 1:N | 1:N | 1:N | 1:N | 1:N |

> All `Tenant → *` relationships are **defined but not enforced** at runtime.

---

## 5. Shared Cross-Cutting Column Set (Audit / Soft-Delete / Tenancy)

Most **operational** entities (the `OPERATIONAL_MODELS` list in
`backend/src/config/prisma-extensions/models.ts`) carry this shared logical
column set. **Reference**, **child**, and **auth/platform** tables are excluded
(e.g., Medication, BreedInformation, DrugInteraction, line-item children, User,
Tenant, AuditLog, ApiKey).

| Column | Type | Meaning | Enforcement Status |
|--------|------|---------|--------------------|
| `createdAt` | DateTime (default now) | Row creation timestamp | **Enforced** (DB default) |
| `updatedAt` | DateTime (@updatedAt) | Last-modification timestamp | **Enforced** (Prisma) |
| `createdBy` | String* | User who created the row | **Partial** — stamped only when request context carries a userId; null otherwise |
| `updatedBy` | String* | User who last modified the row | **Partial** — same dependency |
| `version` | Int (default 1) | Optimistic-concurrency / row version | **Defined**; not consistently incremented |
| `deletedAt` | DateTime* | Soft-delete tombstone | **Partial** — soft-delete extension filters it *when wired*; hard deletes still possible via raw paths |
| `tenantId` | String* FK→Tenant | Owning clinic/tenant | **Partial** — tenant extension injects/filters **only** under an authenticated context; **no-ops** (fail-open) for unauthenticated/system calls |

**Why partial:** the Prisma client composes `field-crypto → tenant →
soft-delete → audit` extensions (`backend/src/config/database.ts`), but tenant
and audit behavior reads from an AsyncLocalStorage **request context**
(`tenantId`, `userId`). Because **authentication is not yet wired**, that context
is usually empty, so these extensions degrade to no-ops rather than enforcing
isolation/stamping. This is the central honest gap of the logical model.

---

## 6. Normalization and Modeling Decisions

| Decision | Rationale |
|----------|-----------|
| **3NF operational core** | Each fact (appointment, invoice line, payment) is a distinct entity; no repeating groups |
| **Surrogate UUID PKs** | Stable identity, tenant-safe, no business-key churn |
| **JSON columns for variable payloads** | `vitalSigns`, `results`, `configuration`, `criteria`, `metrics`, workflow `actions/steps` — schema-flexible, not queried relationally |
| **String[] arrays** | `tags`, `events`, `recipients`, `diagnosisCodes`, `procedureCodes` — small bounded multi-values |
| **Free-text role/status** | `Staff.role`, `*.status` are strings, not enums (except `User.role`) — flexible but unvalidated at DB level |
| **Separate auth from staff** | `User` (login principal) is distinct from `Staff` (HR record), linked 0..1:1 |

---

## 7. Data Quality and Integrity Rules

| Rule | Type | Logical Statement |
|------|------|-------------------|
| DQ-1 | Uniqueness | A client email and a patient microchip are globally unique |
| DQ-2 | Referential | A Patient must reference an existing Client (owner) |
| DQ-3 | Referential | A Prescription must reference an existing Patient, Medication, and prescriber Staff |
| DQ-4 | Temporal | `Appointment.endTime` ≥ `startTime`; `Prescription.expirationDate` ≥ `prescribedDate` (application-enforced) |
| DQ-5 | Financial | `Invoice.total` = `subtotal` + `tax` − `discount` (application-enforced) |
| DQ-6 | Isolation | Within a tenant, all reads/writes are tenant-scoped (**PLANNED**, not enforced) |

---

## 8. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **DIV-1** Conceptual | These entities are the elaboration of DIV-1 concepts/subject areas |
| **DIV-3** Physical | Realizes these entities as PostgreSQL tables/indexes via Prisma |
| **AV-2** Dictionary | Attribute and entity definitions reconcile to the dictionary |
| **SV** systems views | Services map to these entities (route → controller → service → Prisma) |

---

## Appendix A: Reference Documents

| ID | Title | Location |
|----|-------|----------|
| REF-001 | Prisma Schema | `../backend/prisma/schema.prisma` |
| REF-002 | Extension model lists | `../backend/src/config/prisma-extensions/models.ts` |
| REF-003 | Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` |
| REF-004 | DIV-1 Conceptual Data Model | `template.DIV-1.md` |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
