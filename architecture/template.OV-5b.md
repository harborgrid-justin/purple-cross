# OV-5b: Operational Activity Model

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-5b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-5b models the **behavior** of the key operational activities decomposed in
**OV-5a**, using the **IDEF0 ICOM** convention — each activity is characterized by
its **I**nputs, **C**ontrols, **O**utputs, and **M**echanisms. It then composes
the activities into the end-to-end **care-to-cash** activity flow, showing how
outputs of one activity become inputs/triggers of the next. ICOM mechanisms tie
back to the organizational roles of **OV-4** and the platform services of SV.

> ⚠️ **Honesty note.** The ICOM mechanisms reflect the real layered stack
> (Express → service → Prisma/PostgreSQL). However, the **AuthN/Z control is not
> applied** to any activity (PLANNED), **tenant scoping is absent**, the
> **Payment Provider mechanism is missing** (A5 collect is manual), and several
> activities have **placeholder UI**. See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. IDEF0 Notation

```
                 Controls (rules, policy, validation, auth*)
                              │
                              ▼
        Inputs  ───────►  ┌─────────────┐  ───────►  Outputs
                          │  ACTIVITY   │
                          │   A.x       │
                          └─────────────┘
                              ▲
                              │
                 Mechanisms (roles, modules, Prisma, providers)

   * AuthN/Z control is PLANNED — not currently enforced on any activity.
```

---

## 3. ICOM Tables — Key Activities

### A2 — Schedule & Intake

| ICOM | Elements |
|------|----------|
| **Inputs** | Booking request (RF-01), client/patient demographics (RF-02), availability rules (RF-03) |
| **Controls** | No-double-booking rule (OV-6a BR-01), time-block policy, Joi validation, *auth (PLANNED)* |
| **Outputs** | Confirmed appointment, check-in event (RF-04), waitlist entry |
| **Mechanisms** | ORG-5 Front Office; `appointments`/`waitlist`/`time-blocks` services; Prisma; SendGrid/Twilio (confirmations) |

### A3 — Deliver Clinical Care

| ICOM | Elements |
|------|----------|
| **Inputs** | Check-in context (RF-04), patient history (RF-05), vitals (RF-07) |
| **Controls** | Record-author rule, amendment policy, *auth/role (PLANNED)* |
| **Outputs** | Medical record (RF-29), treatment plan, task orders (RF-06) |
| **Mechanisms** | ORG-3 Vet, ORG-4 Tech; `medical-records` service; Prisma; documents module |

### A4 — Diagnostics & Pharmacy

| ICOM | Elements |
|------|----------|
| **Inputs** | Treatment plan, lab order (RF-12), Rx order (RF-08) |
| **Controls** | Prescriber-required rule (BR-02), interaction check (BR-06), CS logging (BR-03) |
| **Outputs** | Lab order to lab (RF-12/13), prescription, dispense + stock decrement (RF-10), CS log entry |
| **Mechanisms** | ORG-3 Vet, ORG-4 Tech, ON-4 Pharmacy; `prescriptions`/`lab-tests`/`inventory`; External Lab; `controlled-substance-log` (PARTIAL) |

### A5 — Billing & Revenue

| ICOM | Elements |
|------|----------|
| **Inputs** | Charge lines (RF-15), estimate (RF-16), payment tender (RF-17) |
| **Controls** | Invoice-references-client rule (BR-04), refund ≤ paid rule (BR-05), payment-plan terms |
| **Outputs** | Invoice, receipt (RF-20), loyalty accrual (RF-21), claim (RF-22), refund (RF-30) |
| **Mechanisms** | ORG-5 Front Office, ON-6 Billing; `invoices`/`estimates`/`payment-plans`/`refunds`/`insurance-claims`; Payment Provider (**PLANNED**) |

### A7 — Communications & Engagement

| ICOM | Elements |
|------|----------|
| **Inputs** | Reminder/recheck triggers, overdue invoices, campaign definitions |
| **Controls** | Consent/opt-out policy, provider rate limits, circuit breakers |
| **Outputs** | Reminders/dunning (RF-26), receipts (RF-20), campaign sends, feedback capture |
| **Mechanisms** | ON-1/ON-6; `communications`/`patient-reminders`/`marketing-campaigns`/`feedback`; SendGrid; Twilio |

---

## 4. Care-to-Cash Activity Flow (IDEF0)

```
        availability rules        no-double-book*        prescriber-req*       invoice→client*
              │                        │                      │                    │
              ▼                        ▼                      ▼                    ▼
 booking ─►┌──────┐ confirmed ─►┌──────┐ record ─►┌──────┐ Rx/order ─►┌──────┐ invoice ─►┌──────┐ receipt
 RF-01     │  A2  │ appt        │  A3  │  RF-29   │  A4  │  RF-08/12  │  A5  │  RF-15    │  A7  │  RF-20/26
 ─────────►│Sched │────────────►│Care  │─────────►│Dx/Rx │───────────►│Bill  │──────────►│Comms │────────►
           │&Intk │             │      │          │      │            │      │           │      │  Owner
           └──┬───┘             └──┬───┘          └──┬───┘            └──┬───┘           └──┬───┘
              │ ON-5/Front         │ ON-3 Vet         │ ON-4 Pharm        │ ON-6 Billing     │ SendGrid/Twilio
              ▼                    ▼ ON-4 Tech         ▼ External Lab      ▼ Payment(PLANNED) ▼
          mechanisms           mechanisms          mechanisms          mechanisms         mechanisms

   * = Control is a business rule (OV-6a); auth/role control is PLANNED across all activities.
   Supporting activity A6 Inventory feeds A4 (stock); A8 Compliance & A9 Platform are cross-cutting.
```

---

## 5. Activity Dependency Summary

| Activity | Depends On (input/trigger) | Enables (output) | Cross-cutting Support |
|----------|----------------------------|------------------|-----------------------|
| A2 Schedule & Intake | A1 (client/patient exist) | A3 (check-in) | A8 policy, A9 platform |
| A3 Clinical Care | A2 (checked-in patient) | A4 (orders), A5 (charge lines) | A8 records, A9 platform |
| A4 Diagnostics & Pharmacy | A3 (plan), A6 (stock) | A5 (charges), A3 (results) | A6 inventory, A8 CS log |
| A5 Billing & Revenue | A3/A4 (services), A1 (client) | A7 (receipt), revenue | A9 analytics |
| A7 Comms & Engagement | A2/A5 (events), A1 (contact) | Owner outreach (RF-26) | providers (SendGrid/Twilio) |

---

## 6. Mechanism Inventory (ICOM "M")

| Mechanism | Type | Realizes Activities | Status |
|-----------|------|---------------------|--------|
| ORG-3 Vet / ORG-4 Tech | Human role | A3, A4 | Operational |
| ORG-5 Front Office | Human role | A2, A5 | Operational |
| Express services + Prisma/PostgreSQL | Platform | A1–A9 | Real (~85%) |
| Joi validation middleware | Control mechanism | A1–A9 inputs | Real |
| Auth/RBAC middleware | Control mechanism | (intended A1–A9) | PLANNED (unused) |
| SendGrid / Twilio | External provider | A7 | Real |
| Payment Provider | External provider | A5 collect/settle | PLANNED |
| External Lab | External provider | A4 diagnostics | PARTIAL |

---

## 7. Honesty & Gap Notes

| ICOM Element | Reality | Status |
|--------------|---------|--------|
| AuthN/Z control on activities | Middleware exists, unused | PLANNED |
| Payment Provider mechanism (A5) | Absent; manual recording | PLANNED |
| CS-log / interaction controls (A4) | Models exist; partial enforcement | PARTIAL |
| Audit mechanism (A8) | `AuditLog` from ~7/34 services | PARTIAL |
| Tenant-scope control | Not applied | PLANNED |
| Frontend mechanism for several activities | Placeholder pages | IN PROGRESS |

---

## 8. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-5a | Activity decomposition elaborated here |
| OV-2 / OV-3 | Inputs/Outputs correspond to needlines/flows |
| OV-4 | Mechanisms = organizational roles |
| OV-6a | Controls = business rules |
| OV-6c | Event traces realize this flow over time |
| SV-4 / SV-5a | System functions implementing activities |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
