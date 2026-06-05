# OV-2: Operational Resource Flow Description

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-2 describes the **operational nodes** of the Purple Cross veterinary practice
and the **resource flows (needlines)** that connect them. Where OV-1 draws the
orienting picture, OV-2 makes the *who-exchanges-what-with-whom* explicit: the
information and material resources that move between the front office, the
clinical team, pharmacy, lab, billing, the pet owner, and external providers.
Each needline aggregates one or more resource flows, which are enumerated in
tabular form here and fully matrixed in **OV-3**.

> ⚠️ **Honesty note.** Flows describe operational *intent* grounded in the
> codebase. Backend services that carry these flows are ~85% real (Prisma).
> **Authentication is not wired** (no flow is access-controlled yet),
> **RBAC is unenforced**, the **Payment Provider** flow is **PLANNED** (no
> Stripe SDK), and several owner-facing flows traverse a **placeholder** client
> portal. Tenant scoping fields exist but are **not enforced** on these flows.
> See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Operational Nodes

Node IDs are reused verbatim from **OV-1 §3** and **OV-4** for traceability.

| Node ID | Operational Node | Type | Role in Resource Flows |
|---------|------------------|------|------------------------|
| ON-1 | Front Office / Receptionist | Internal | Booking, check-in, client intake, payment capture |
| ON-2 | Exam Room / Veterinarian | Internal | Clinical assessment, diagnosis, prescribing, lab ordering |
| ON-3 | Vet Tech | Internal | Vitals, sample collection, lab prep, inventory pulls |
| ON-4 | Pharmacy / Dispensing | Internal | Rx fulfillment, controlled-substance logging |
| ON-5 | Laboratory / Diagnostics | Internal+External | Lab order intake, result capture |
| ON-6 | Billing / Revenue | Internal | Invoice, estimate, payment plan, refund, claim |
| ON-7 | Pet Owner (Client) | External | Booking requests, payments, reminder receipt |
| ON-8 | Practice Manager | Internal | Scheduling policy, reporting, supply approval |
| ON-EXT-1 | SendGrid | External | Email delivery (reminders, receipts) |
| ON-EXT-2 | Twilio | External | SMS delivery (reminders, alerts) |
| ON-EXT-3 | Payment Provider (**PLANNED**) | External | Charge/refund settlement |
| ON-EXT-4 | External Lab | External | Reference diagnostics interchange |

---

## 3. Node–Needline Diagram

```
                       PURPLE CROSS — OPERATIONAL RESOURCE FLOWS (OV-2)
                                (needlines NL-xx, see §4)

   ON-7 Pet Owner ──NL-01 booking req──►┌───────────────────┐
        ▲   ▲                           │  ON-1 Front Office │◄──NL-02 schedule policy── ON-8
        │   └──NL-14 reminder───────────┤   / Receptionist  │       Practice Manager
        │                               └───┬─────────┬─────┘            ▲
        │                          NL-03    │         │ NL-04            │ NL-13 reports
        │                          check-in │         │ invoice req      │
        │                                   ▼         ▼                  │
        │                       ┌────────────────┐  ┌──────────────────┐ │
        │  NL-12 receipt ◄──────┤ ON-2 Vet /     │  │ ON-6 Billing /   ├─┘
        │  NL-11 payment ──────►│  Exam Room     │  │  Revenue         │
        │                       └──┬───┬────┬────┘  └───┬─────────┬────┘
        │                  NL-05   │   │NL-06│ NL-07     │NL-10    │ NL-15
        │                  vitals  │   │ Rx  │ lab order │ charge  │ claim
        │                         ▼    ▼     ▼           ▼         ▼
        │            ┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────────────┐ ┌────────────┐
        │            │ ON-3 Vet │ │ ON-4   │ │ ON-5    │ │ ON-EXT-3     │ │ Insurer    │
        │            │  Tech    │ │Pharmacy│ │ Lab     │ │ Payment      │ │ (ext)      │
        │            └────┬─────┘ └───┬────┘ └────┬────┘ │ Provider     │ └────────────┘
        │           NL-08 │       NL-09│      NL-07b│     │ (PLANNED)    │
        │           sample│       drug │       result    └──────────────┘
        │                 ▼           ▼            ▼
        │            ┌──────────────────────────────────┐
        │            │  ON-EXT-4 External Lab (results)  │
        │            └──────────────────────────────────┘
        │
        └──NL-14 reminder◄── ON-EXT-1 SendGrid / ON-EXT-2 Twilio ◄──NL-16 dispatch── ON-1/ON-6
```

> Diagram is logical (needlines), not a deployment topology. A single needline
> may carry several resource flows; OV-3 decomposes each into discrete rows.

---

## 4. Needline Catalog

| Needline | From (Producer) | To (Consumer) | Aggregated Resource Flows | Carrier Module(s) |
|----------|-----------------|---------------|---------------------------|-------------------|
| NL-01 | ON-7 Pet Owner | ON-1 Front Office | Booking request, client/patient demographics | appointments, clients, client-portal |
| NL-02 | ON-8 Practice Mgr | ON-1 Front Office | Schedule policy, time blocks, availability rules | time-blocks, staff |
| NL-03 | ON-1 Front Office | ON-2 Veterinarian | Check-in event, appointment context, history | appointments, patients, medical-records |
| NL-04 | ON-1 Front Office | ON-6 Billing | Invoice request, charge lines, client ref | invoices, estimates |
| NL-05 | ON-2 Veterinarian | ON-3 Vet Tech | Vitals/sample orders, treatment tasks | medical-records |
| NL-06 | ON-2 Veterinarian | ON-4 Pharmacy | Prescription order, controlled-substance flag | prescriptions, controlled-substance-log |
| NL-07 | ON-2 Veterinarian | ON-5 Laboratory | Lab order (panel, specimen) | lab-tests |
| NL-07b | ON-5 / ON-EXT-4 | ON-2 Veterinarian | Lab results, reference ranges | lab-tests |
| NL-08 | ON-3 Vet Tech | ON-EXT-4 External Lab | Specimen handoff, requisition | lab-tests |
| NL-09 | ON-4 Pharmacy | ON-3/Inventory | Dispense event, stock decrement, interaction check | prescriptions, inventory, drug-interaction |
| NL-10 | ON-6 Billing | ON-EXT-3 Payment Provider | Charge request (**PLANNED**) | invoices, refunds |
| NL-11 | ON-7 Pet Owner | ON-6 Billing | Payment tender, payment-plan election | invoices, payment-plans |
| NL-12 | ON-6 Billing | ON-7 Pet Owner | Receipt, statement, loyalty accrual | invoices, communications, loyalty-programs |
| NL-13 | ON-1/ON-6/Clinical | ON-8 Practice Mgr | Operational metrics, financial & clinical reports | analytics, report-templates |
| NL-14 | ON-1/ON-6 | ON-7 Pet Owner | Reminders, dunning, recheck notices | communications, patient-reminders |
| NL-15 | ON-6 Billing | Insurer (ext) | Insurance claim submission, status | insurance-claims |
| NL-16 | ON-1/ON-6 | ON-EXT-1/2 (SendGrid/Twilio) | Message dispatch (email/SMS) | communications |

---

## 5. Resource Flow Classification

| Flow Class | Examples | Sensitivity | Notes |
|------------|----------|-------------|-------|
| **Clinical (PHI)** | Vitals, diagnosis, Rx, lab results (NL-03/05/06/07/07b) | HIGH | Stored **plaintext** at rest (PLANNED encryption) |
| **Financial** | Invoice, payment, claim, refund (NL-04/10/11/12/15) | HIGH | Payment Provider settlement **PLANNED** |
| **Client/PII** | Demographics, contact, booking (NL-01) | MEDIUM | No tenant scoping enforced |
| **Operational** | Schedule policy, metrics (NL-02/13) | LOW | Internal management flows |
| **Notification** | Reminders, receipts, dunning (NL-14/16) | MEDIUM | External via SendGrid/Twilio |

---

## 6. Node Responsibilities (Resource Perspective)

| Node | Produces | Consumes | Stewards (system of record) |
|------|----------|----------|-----------------------------|
| ON-1 Front Office | Bookings, check-ins, invoice requests | Schedule policy, reminders status | appointments, clients |
| ON-2 Veterinarian | Medical records, Rx, lab orders | Check-in context, lab results | medical-records, prescriptions |
| ON-3 Vet Tech | Vitals, specimens, stock pulls | Treatment tasks | (contributes to medical-records) |
| ON-4 Pharmacy | Dispense events, CS logs | Rx orders | controlled-substance-log |
| ON-5 Laboratory | Results | Lab orders, specimens | lab-tests |
| ON-6 Billing | Invoices, claims, receipts | Charge lines, payments | invoices, insurance-claims |
| ON-7 Pet Owner | Booking requests, payments | Receipts, reminders | (external) |
| ON-8 Practice Mgr | Policy, approvals | Reports/metrics | analytics |

---

## 7. Honesty & Gap Notes

| Flow Element | Reality | Status |
|--------------|---------|--------|
| NL-10 charge to Payment Provider | No Stripe SDK; payments recorded manually | PLANNED |
| Access control on every needline | Auth middleware exists, 0 routes use it | PLANNED |
| Tenant isolation on flows | Fields present, not scoped in queries | PLANNED |
| PHI encryption on clinical flows | Plaintext at rest | PLANNED |
| Owner flows via client portal (NL-01/11/12) | Endpoints exist; FE largely placeholder | IN PROGRESS |
| Audit trail of flow events | `AuditLog` written by ~7/34 services | PARTIAL |

---

## 8. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-1 | Source of node IDs and operational thread |
| OV-3 | Tabular matrix decomposing every needline into flows |
| OV-4 | Organizational roles behind internal nodes |
| OV-5a/5b | Activities that produce/consume these flows |
| OV-6c | Event traces realizing the needlines over time |
| SV-2 / SV-6 | System resource flows implementing these needlines |
| CV-6 | Capability-to-activity mapping for flow owners |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
