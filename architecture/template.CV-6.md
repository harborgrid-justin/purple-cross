# CV-6: Capability to Operational Activities Mapping

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-6-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-6 maps each capability (from CV-2) to the **operational activities** it
enables, cross-referenced to the **OV-5a Operational Activity Decomposition
Tree**. It answers "which capability is exercised when staff perform a given
activity?" — providing the capability ↔ activity traceability that connects the
Capability and Operational viewpoints.

> ⚠️ **Honesty note.** Activities are supported by backend services that are
> ~85% real; the *user-facing* execution of many activities is still gated by
> frontend completion (PI-2) and by the missing AuthN/Z that should govern who
> may perform each activity (CAP-4.3 Security, PLANNED).

---

## 2. Operational Activity Reference (from OV-5a)

```
A0 RUN VETERINARY PRACTICE
|
+-- A1 Manage Clients & Patients
|     +-- A1.1 Register Client / Patient
|     +-- A1.2 Maintain Patient Record
+-- A2 Schedule & Intake
|     +-- A2.1 Book Appointment
|     +-- A2.2 Manage Waitlist / Time Blocks
+-- A3 Deliver Clinical Care
|     +-- A3.1 Document Visit (medical record)
|     +-- A3.2 Prescribe Medication
|     +-- A3.3 Order Lab / Diagnostics
+-- A4 Bill & Collect
|     +-- A4.1 Create Estimate / Invoice
|     +-- A4.2 Collect Payment / Plan
|     +-- A4.3 Process Refund / Insurance Claim
+-- A5 Manage Supply & Workforce
|     +-- A5.1 Manage Inventory / Purchase Orders
|     +-- A5.2 Manage Staff / Equipment
+-- A6 Engage & Report
      +-- A6.1 Communicate / Remind (email/SMS)
      +-- A6.2 Run Analytics / Reports
      +-- A6.3 Manage Documents / Templates
```

---

## 3. Capability → Operational Activity Matrix

**X** = capability primarily enables the activity · **(x)** = supporting role

| Capability \ Activity | A1.1 | A1.2 | A2.1 | A2.2 | A3.1 | A3.2 | A3.3 | A4.1 | A4.2 | A4.3 | A5.1 | A5.2 | A6.1 | A6.2 | A6.3 |
|-----------------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| CAP-1.1 Patient Records | X | X | | | X | (x) | (x) | | | | | | | (x) | |
| CAP-1.2 Prescriptions | | | | | (x) | X | | | | | | | | | |
| CAP-1.3 Laboratory | | | | | (x) | | X | | | | | | | | |
| CAP-2.1 Client Mgmt & Portal | X | (x) | (x) | | | | | | (x) | | | | (x) | | |
| CAP-2.2 Appointments | | | X | X | | | | | | | | | (x) | | |
| CAP-2.3 Communications | | | (x) | | | | | | | | | | X | | |
| CAP-3.1 Billing & Revenue | | | | | | | | X | X | X | | | | (x) | |
| CAP-3.2 Inventory | | | | | | (x) | (x) | | | | X | | | | |
| CAP-3.3 Workforce | | | (x) | (x) | | | | | | | | X | | | |
| CAP-4.1 Analytics | | | | | | | | | | | | | | X | |
| CAP-4.2 Documents | | (x) | | | (x) | | | (x) | | | | | | | X |
| CAP-4.3 Security (PLANNED) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) | (x) |

> CAP-4.3 Security is a *supporting* (x) across **every** activity: in the target
> state, no activity executes without authentication, authorization, and tenant
> scoping. Today that control is **absent (PLANNED)**.

---

## 4. Activity Narratives

| Activity | Enabling Capability | Notes / Honesty |
|----------|---------------------|-----------------|
| A2.1 Book Appointment | CAP-2.2 (+ CAP-1.1, CAP-2.1) | Requires patient + client context |
| A3.1 Document Visit | CAP-1.1 | Medical-records service; real backend |
| A3.2 Prescribe | CAP-1.2 | Prescriptions service; real backend |
| A3.3 Order Lab | CAP-1.3 | Uses ExternalLabIntegration |
| A4.1 Create Invoice/Estimate | CAP-3.1 (+ CAP-1.1, CAP-2.1, CAP-2.2) | Depends on patient/client/appointment |
| A4.2 Collect Payment / Plan | CAP-3.1 | Payment-plans real; charge automation absent (no Stripe) |
| A4.3 Refund / Insurance Claim | CAP-3.1 | refunds, insurance-claims services |
| A5.1 Manage Inventory / PO | CAP-3.2 | inventory, purchase-orders, equipment |
| A6.1 Communicate / Remind | CAP-2.3 | SendGrid/Twilio; async via BullMQ |
| A6.2 Run Analytics | CAP-4.1 | Reads across transactional capabilities |
| A6.3 Manage Documents | CAP-4.2 | documents, document-templates, policies |

---

## 5. Coverage Summary

| Activity Area | Capabilities Involved | Backend Status | UI Status |
|---------------|-----------------------|----------------|-----------|
| A1 Clients & Patients | CAP-1.1, CAP-2.1 | Real (~85%) | In Progress |
| A2 Schedule & Intake | CAP-2.2 | Real | In Progress |
| A3 Clinical Care | CAP-1.1/1.2/1.3 | Real | Placeholder |
| A4 Bill & Collect | CAP-3.1 | Real (payments aspirational) | Placeholder |
| A5 Supply & Workforce | CAP-3.2, CAP-3.3 | Real | Placeholder |
| A6 Engage & Report | CAP-2.3, CAP-4.1, CAP-4.2 | Real | Placeholder |
| (All) Access Control | CAP-4.3 Security | **PLANNED** | **PLANNED** |

---

## 6. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-2 Taxonomy** | Source of capabilities mapped to activities |
| **OV-5a Activity Tree** | Source of the operational activities (A1..A6) |
| **OV-5b Activity Model** | Activity inputs/outputs underlying this mapping |
| **CV-7 Services Mapping** | Services that implement these activity-capabilities |
| **SV-5a / SvcV-5** | Activity-to-function / activity-to-service traceability |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
