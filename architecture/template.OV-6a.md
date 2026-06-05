# OV-6a: Operational Rules Model

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-6a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-6a captures the **business rules** that constrain Purple Cross operational
activities — the conditions and obligations that must hold for the practice to
operate correctly and compliantly. Each rule is stated declaratively with a
rationale and an **enforcement point** (where in the stack the rule is, or will
be, applied). Rules act as the **Controls** in the OV-5b ICOM model and gate the
state transitions in OV-6b.

> ⚠️ **Honesty note.** Many rules below are **policy intent** that is only
> partially enforced today. Authorization-style rules cannot be enforced because
> **authentication is not wired** (PLANNED). Where a rule's enforcement is not yet
> in code, the table marks the enforcement point **PLANNED** or **PARTIAL**. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Rule Classification

| Class | Description | Example Rules |
|-------|-------------|---------------|
| **Structural** | Referential integrity / required associations | BR-02, BR-04 |
| **Scheduling** | Time/resource conflict avoidance | BR-01 |
| **Clinical/Safety** | Prescribing and controlled-substance safety | BR-03, BR-06 |
| **Financial** | Billing, refund, and payment integrity | BR-05, BR-08 |
| **Data Lifecycle** | Soft-delete visibility, immutability | BR-07, BR-09 |
| **Access/Tenancy** | Authorization and tenant isolation (PLANNED) | BR-10, BR-11 |

---

## 3. Operational Rules

| Rule ID | Statement | Rationale | Activity (OV-5a) | Enforcement Point | Status |
|---------|-----------|-----------|------------------|-------------------|--------|
| BR-01 | An appointment **cannot be double-booked** for the same staff member at the same time slot. | Prevents impossible scheduling and clinician conflicts. | A2 | `appointments` service availability check + DB constraint | PARTIAL |
| BR-02 | A **prescription requires a prescriber** (a veterinarian) and a target patient. | Legal/clinical: only authorized prescribers may prescribe. | A4 | `prescriptions` service validation; *role check PLANNED* | PARTIAL |
| BR-03 | **Controlled substances must be logged** to `ControlledSubstanceLog` on prescribe/dispense. | Regulatory compliance (DEA-equivalent custody trail). | A4 | `controlled-substance-log` write on CS Rx | PARTIAL |
| BR-04 | An **invoice must reference a client** (and the patient/visit it bills). | Financial traceability; no orphan charges. | A5 | `invoices` service FK validation | REAL |
| BR-05 | A **refund cannot exceed the invoice's paid amount**. | Prevents over-refunding / negative balances. | A5 | `refunds` service amount check against paid total | REAL |
| BR-06 | A prescription **must be checked for drug interactions** before finalizing. | Patient safety. | A4 | `drug-interaction` lookup at Rx creation | PARTIAL |
| BR-07 | **Soft-deleted records are hidden** from normal queries (filtered by `deletedAt`). | Reversible deletion; data retention. | A8 | Prisma query filters on `deletedAt` | PARTIAL |
| BR-08 | A **payment cannot exceed the invoice balance** (no over-payment without credit). | Billing integrity. | A5 | `invoices`/`payment-plans` balance check | PARTIAL |
| BR-09 | A **finalized medical record amendment is appended, not overwritten** (audit-preserving). | Clinical record integrity. | A3/A8 | `medical-records` + `audit-log` | PARTIAL |
| BR-10 | A user **may only perform actions permitted by their RBAC role** (`admin`/`vet`/`tech`/`front-office`). | Least privilege. | A9 | RBAC middleware at routes | **PLANNED** (defined, unenforced) |
| BR-11 | All data access **must be scoped to the user's practice tenant**. | Multi-tenant isolation; prevents cross-practice leakage. | A9 | Tenant-scoped query filter | **PLANNED** (fields exist, unscoped) |
| BR-12 | A **request must pass authentication** before any privileged operation. | Identity establishment. | A9 | Auth middleware on routes | **PLANNED** (middleware unused) |
| BR-13 | All inbound payloads **must pass Joi validation** before service execution. | Input integrity / injection resistance. | A1–A9 | `validate()`/`validateQuery()`/`validateParams()` | REAL |
| BR-14 | An **estimate that is expired cannot be accepted** (must be re-issued). | Pricing integrity. | A5 | `estimates` service date check | PARTIAL |
| BR-15 | An **insurance claim must reference a paid or issued invoice** line. | Claim validity. | A5 | `insurance-claims` service FK/status check | PARTIAL |
| BR-16 | A **waitlist entry is promoted only when a matching slot opens**. | Fair, conflict-free fill. | A2 | `waitlist`/`appointments` coordination | PARTIAL |

---

## 4. Rule-to-State Mapping (OV-6b)

| Rule | Governs State Transition | Entity |
|------|--------------------------|--------|
| BR-01, BR-16 | Scheduled → Confirmed → CheckedIn | Appointment |
| BR-04, BR-08 | Draft → Issued → PartiallyPaid → Paid | Invoice |
| BR-05 | (any) → Refund issued | Invoice/Refund |
| BR-14 | Sent → Accepted/Expired | Estimate |
| BR-15 | Draft → Submitted → Adjudicated | InsuranceClaim |
| BR-02, BR-03, BR-06 | Rx draft → active/dispensed | Prescription |

---

## 5. Enforcement Reality Summary

| Enforcement State | Rules | Meaning |
|-------------------|-------|---------|
| **REAL** | BR-04, BR-05, BR-13 | Enforced in service/middleware today |
| **PARTIAL** | BR-01, BR-02, BR-03, BR-06, BR-07, BR-08, BR-09, BR-14, BR-15, BR-16 | Logic exists but incomplete / not uniformly applied |
| **PLANNED** | BR-10, BR-11, BR-12 | Cannot be enforced until auth/tenancy wired |

---

## 6. Honesty & Gap Notes

| Rule Area | Reality | Status |
|-----------|---------|--------|
| Authorization (BR-10) | RBAC roles in constants, no route checks | PLANNED |
| Tenant isolation (BR-11) | Tenant fields exist, queries unscoped | PLANNED |
| Authentication gate (BR-12) | Middleware exists, 0 routes use it | PLANNED |
| Controlled-substance logging (BR-03) | `ControlledSubstanceLog` model exists | PARTIAL |
| Soft-delete filtering (BR-07) | Applied inconsistently across services | PARTIAL |
| Amendment audit (BR-09) | `AuditLog` from ~7/34 services | PARTIAL |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-5a / OV-5b | Rules are Controls on these activities |
| OV-6b | Rules gate the state transitions |
| OV-6c | Rule violations alter event traces |
| OV-4 | Access rules reference organizational roles |
| SV-10a | System-level rules implementing these business rules |
| CV-6 | Capability context for rule coverage |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
