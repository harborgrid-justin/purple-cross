# DIV-1: Conceptual Data Model

## DoDAF 2.02 Data and Information Viewpoint

**Document ID:** PCVPM-DIV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

DIV-1 expresses the **business-level information concepts** of the Purple Cross
veterinary practice management platform and the relationships among them. It is
the highest level of the Data and Information Viewpoint: it names the *things the
business cares about* (subject areas and the entities within them) and how they
relate, **without** attributes, keys, data types, or physical detail. Those are
elaborated in **DIV-2** (logical) and **DIV-3** (physical).

The model is grounded in the live `backend/prisma/schema.prisma` — **~69 Prisma
models** — but deliberately abstracts them into a smaller set of conceptual
entities organized into **ten subject areas**. Reference, line-item child, and
platform/auth tables are folded into their parent concept here and surfaced in
full at the logical level.

> **Honesty note.** Several concepts (Security/Tenancy, Compliance/Audit) exist
> in the schema but are **not yet fully enforced** at runtime — authentication is
> not wired, so tenant and audit context is frequently absent. The conceptual
> model shows the *intended* information landscape; DIV-2/DIV-3 mark the gaps.

---

## 2. Conceptual Subject Areas

The information landscape decomposes into ten subject areas. Each groups a set of
business concepts that share an owner, a lifecycle, and a stewardship boundary.

| # | Subject Area | Business Question Answered | Core Concepts | Representative Models |
|---|--------------|----------------------------|---------------|-----------------------|
| 1 | **Clinical** | What care has a patient received? | Patient, MedicalRecord, Prescription, LabTest, Medication | Patient, MedicalRecord, Prescription, Medication, LabTest, ClinicalTemplate, MedicalRecordShare, DrugInteraction, ControlledSubstanceLog, CompoundingFormula, QualityControlRecord, ExternalLabIntegration, BreedInformation, PatientRelationship, PatientReminder |
| 2 | **Client / CRM** | Who owns the patient and how do we engage them? | Client, Communication, Feedback, Loyalty | Client, Communication, ClientPortalAccess, LoyaltyProgram, LoyaltyTransaction, ClientFeedback, Survey, SurveyResponse, ClientSegment, MarketingCampaign, SocialMediaPost, PushSubscription |
| 3 | **Scheduling** | When and with whom is care delivered? | Appointment, Waitlist, TimeBlock | Appointment, AppointmentReminder, Waitlist, TimeBlock |
| 4 | **Billing / Finance** | What is owed, paid, refunded, or claimed? | Invoice, Payment, Estimate, Claim | Invoice, InvoiceLineItem, Payment, Estimate, EstimateLineItem, PaymentPlan, PaymentPlanInstallment, Refund, InsuranceClaim |
| 5 | **Inventory / Supply** | What stock and equipment do we hold? | InventoryItem, PurchaseOrder, Equipment | InventoryItem, PurchaseOrder, PurchaseOrderItem, Equipment, EquipmentMaintenance |
| 6 | **Staff / HR** | Who works here and are they qualified? | Staff, Schedule, Credential | Staff, StaffSchedule, TimeAttendance, PerformanceReview, ContinuingEducation |
| 7 | **Documents / Content** | What files, templates, and reports exist? | Document, Template, Report | Document, DocumentTemplate, DocumentSignature, DocumentWorkflow, ReportTemplate, ReportSchedule |
| 8 | **Workflow / Automation** | What runs automatically and via integrations? | Workflow, Webhook, ImportJob | WorkflowTemplate, WorkflowExecution, WorkflowExecutionStep, WebhookSubscription, WebhookDelivery, DataImportJob, ApiUsageMetric |
| 9 | **Compliance / Audit** | Is the practice meeting its obligations? | AuditLog, Policy, Incident | AuditLog, ComplianceIncident, Policy, PolicyAcknowledgment, RegulatoryUpdate |
| 10 | **Security / Tenancy** | Who may access which clinic's data? | Tenant, User, Credential | Tenant, User, RefreshToken, ApiKey |

**Subject-area sizing (approximate model counts):** Clinical ≈ 15, Client/CRM ≈
12, Scheduling ≈ 4, Billing/Finance ≈ 9, Inventory/Supply ≈ 5, Staff/HR ≈ 5,
Documents/Content ≈ 6, Workflow/Automation ≈ 7, Compliance/Audit ≈ 5,
Security/Tenancy ≈ 4 — totaling the ~69 models in the schema (the remainder are
reference data such as `Medication`/`BreedInformation` and integration config).

---

## 3. Core Conceptual Entity-Relationship Model

The core of the business revolves around the **Client → Patient → Care → Money**
spine. Everything else hangs off this backbone.

```
                                +-----------+
                                |  TENANT   |  (clinic / org boundary)
                                +-----+-----+
                                      | scopes (intended; not yet enforced)
            +-------------------------+--------------------------+
            |                         |                          |
            v                         v                          v
       +---------+   owns   +-----------+   books     +-------------+
       | CLIENT  |--------->|  PATIENT  |<------------| APPOINTMENT |
       +----+----+  1     * +-----+-----+  1       *  +------+------+
            |                     |                          |
   billed to|                     | has                      | involves
            v                     v                          v
       +---------+        +----------------+           +-----------+
       | INVOICE |        | MEDICAL RECORD |           |   STAFF   |
       +----+----+        +-------+--------+           +-----+-----+
            |  has              | documented by              |  performs
   +--------+--------+          +---------------+------------+
   |        |        |                          |
   v        v        v                          v
+------+ +-------+ +-----------+       +------------------+
| LINE | | PAY-  | | ESTIMATE/ |       |  PRESCRIPTION    |
| ITEM | | MENT  | | CLAIM/    |       |  (-> MEDICATION) |
+------+ +-------+ | REFUND    |       +------------------+
                   +-----------+
            +-----------------------------+
            |   PATIENT also has ...       |
            v             v                v
       +---------+  +-----------+   +-----------------+
       | LAB     |  | REMINDER  |   | RELATIONSHIP    |
       | TEST    |  |           |   | (patient<->pet) |
       +---------+  +-----------+   +-----------------+
```

### 3.1 Core Relationship Narrative

- A **Client** (pet owner) **owns** one or more **Patients** (pets); a Patient
  belongs to exactly one Client.
- A **Patient** accumulates **MedicalRecords**, **Prescriptions**, **LabTests**,
  and **Appointments** over its lifetime.
- An **Appointment** is **booked for** a Patient/Client pair and **involves** a
  **Staff** member (veterinarian) at a time/room.
- A **MedicalRecord** is **documented by** a Staff clinician; a **Prescription**
  is **written by** a Staff prescriber and **references** a **Medication**.
- **Invoices** are **billed to** a Client, decompose into **LineItems**, and are
  settled by **Payments**; **Estimates**, **InsuranceClaims**, **Refunds**, and
  **PaymentPlans** orbit the same financial concept.
- A **Tenant** **scopes** all of the above to a single clinic — *conceptually*.
  At runtime this isolation is **not yet enforced** (see DIV-2 §5, DIV-3 §7).

---

## 4. Subject-Area Context Diagrams

### 4.1 Clinical Subject Area

```
   PATIENT ---<-- MEDICAL RECORD --->-- STAFF (clinician)
     |  \                |
     |   \               +--- MEDICAL RECORD SHARE (external referral)
     |    \
     |     +--- PRESCRIPTION --->-- MEDICATION ---<-- DRUG INTERACTION
     |     |                            |
     |     |                            +--- CONTROLLED SUBSTANCE LOG
     |     |                            +--- COMPOUNDING FORMULA
     |     +--- LAB TEST --->-- EXTERNAL LAB INTEGRATION
     |     |                       \--- QUALITY CONTROL RECORD
     |     +--- PATIENT REMINDER
     +--------- PATIENT RELATIONSHIP (pet <-> pet)
   BREED INFORMATION ..... (reference, by species/breed)
```

### 4.2 Client / CRM Subject Area

```
   CLIENT ---<-- COMMUNICATION (email / sms, in/out)
     |  \---- CLIENT PORTAL ACCESS (self-service login)
     |  \---- LOYALTY PROGRAM ---<-- LOYALTY TRANSACTION
     |  \---- CLIENT FEEDBACK / NPS
     |  \---- SURVEY RESPONSE -->-- SURVEY
     +------- CLIENT SEGMENT (membership via criteria)
   MARKETING CAMPAIGN -> targets SEGMENTS via CHANNELS (email/sms/social)
```

### 4.3 Billing / Finance Subject Area

```
   CLIENT ---<-- INVOICE ---<-- INVOICE LINE ITEM
                   |  \-------- PAYMENT
                   |   \------- REFUND
                   +----------- PAYMENT PLAN ---<-- INSTALLMENT
   CLIENT ---<-- ESTIMATE ---<-- ESTIMATE LINE ITEM  (-> converts to INVOICE)
   PATIENT/CLIENT ---<-- INSURANCE CLAIM
```

---

## 5. Information Concept Definitions

| Concept | Definition (business meaning) | Subject Area |
|---------|-------------------------------|--------------|
| **Patient** | An animal (pet) under the practice's care | Clinical |
| **Client** | The owner/guardian responsible for one or more patients | Client/CRM |
| **Appointment** | A scheduled care encounter for a patient with staff | Scheduling |
| **Medical Record** | A documented clinical visit (complaint, diagnosis, treatment) | Clinical |
| **Prescription** | An authorized medication order for a patient | Clinical |
| **Medication** | A drug reference (catalog) that prescriptions draw on | Clinical |
| **Lab Test** | A diagnostic order and its results for a patient | Clinical |
| **Invoice** | A demand for payment issued to a client | Billing/Finance |
| **Payment** | A settlement applied against an invoice | Billing/Finance |
| **Estimate / Claim / Refund** | Pre-bill quote, insurer claim, and money returned | Billing/Finance |
| **Staff** | A practice employee (vet, tech, receptionist, admin) | Staff/HR |
| **Communication** | An outbound/inbound message to/from a client | Client/CRM |
| **Inventory Item** | A stocked product or supply (may map to a medication) | Inventory/Supply |
| **Document** | A stored file (record, consent, report) | Documents/Content |
| **Workflow** | An automated multi-step process and its executions | Workflow/Automation |
| **Audit Log** | An immutable record of who changed what, when | Compliance/Audit |
| **Tenant** | The clinic/organization boundary for data isolation | Security/Tenancy |
| **User** | An authentication principal (links to a Staff record) | Security/Tenancy |

---

## 6. Cross-Subject-Area Relationships

| From Concept | Relationship | To Concept | Cardinality | Cross-Area? |
|--------------|--------------|------------|-------------|-------------|
| Client | owns | Patient | 1 : N | within Clinical/CRM |
| Patient | has | MedicalRecord | 1 : N | Clinical |
| Patient | has | Prescription | 1 : N | Clinical |
| Patient | has | LabTest | 1 : N | Clinical |
| Client / Patient | scheduled in | Appointment | 1 : N | CRM ↔ Scheduling |
| Staff | performs | Appointment | 1 : N | Staff ↔ Scheduling |
| Staff | documents | MedicalRecord | 1 : N | Staff ↔ Clinical |
| Staff | prescribes | Prescription | 1 : N | Staff ↔ Clinical |
| Medication | dispensed via | Prescription | 1 : N | Clinical (reference) |
| Medication | stocked as | InventoryItem | 1 : 0..N | Clinical ↔ Inventory |
| Client | billed via | Invoice | 1 : N | CRM ↔ Billing |
| Invoice | settled by | Payment | 1 : N | Billing |
| Client | engaged via | Communication | 1 : N | CRM |
| Tenant | scopes | (all operational concepts) | 1 : N | Security ↔ all (PLANNED) |
| User | authenticates as | Staff | 1 : 0..1 | Security ↔ Staff (PLANNED) |

---

## 7. Data Governance and Stewardship

| Subject Area | Data Steward | Sensitivity | Notes |
|--------------|-------------|-------------|-------|
| Clinical | Lead Veterinarian / Data Architect | **PHI-equivalent** | Medical records, Rx, controlled-substance logs |
| Client / CRM | Practice Manager | **PII** | Names, contact, portal credentials |
| Billing / Finance | Practice Manager / Finance | **PII + financial** | Invoices, claims, payment references |
| Staff / HR | Practice Owner | **PII (employee)** | Licenses, reviews, attendance |
| Compliance / Audit | Compliance Officer | High | Audit trail, incidents, policy acks |
| Security / Tenancy | Security Architect | Critical | Tenant isolation, credentials |

> **Gap:** PHI/PII sensitivity is recognized conceptually, but at-rest field
> encryption currently covers **only** four `MedicalRecord` free-text columns;
> all other PII/PHI is stored plaintext (see DIV-3 §7). Tenant-level isolation
> is defined but not enforced without an authenticated request context.

---

## 8. Constraints and Assumptions

| ID | Type | Statement |
|----|------|-----------|
| C-1 | Constraint | The conceptual model derives from a single source of truth: `schema.prisma` |
| C-2 | Constraint | Reference/child/auth tables are folded into parent concepts at this level |
| A-1 | Assumption | Tenant scoping will become the universal partition once auth is wired |
| A-2 | Assumption | One Client : many Patients (no shared ownership modeled today) |
| A-3 | Assumption | Staff and authentication User are distinct concepts linked 0..1 : 1 |

---

## 9. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **AV-2** Integrated Dictionary | Authoritative definitions of every concept/term used here |
| **DIV-2** Logical Data Model | Elaborates these concepts into 69 entities with attributes and keys |
| **DIV-3** Physical Data Model | Realizes the logical model in PostgreSQL via Prisma |
| **OV-2 / OV-3** | Operational resource flows that move this information |
| **SV-11** (where applicable) | Physical schema cross-checks for the systems viewpoint |

---

## Appendix A: Reference Documents

| ID | Title | Location |
|----|-------|----------|
| REF-001 | Prisma Schema (source of truth) | `../backend/prisma/schema.prisma` |
| REF-002 | Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` |
| REF-003 | Data Flow Architecture | `../docs/DATA_FLOW_ARCHITECTURE.md` |
| REF-004 | AV-2 Integrated Dictionary | `template.AV-2.md` |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
