# OV-6c: Event-Trace Description

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-6c-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-6c provides **event-trace (sequence) descriptions** for representative Purple
Cross operational scenarios. Each trace shows the ordered exchange of events
between organizational roles (**OV-4**), operational nodes/external providers
(**OV-1/OV-2**), and the platform, realizing the resource flows (**OV-3**) and
driving the state transitions (**OV-6b**) under the rules (**OV-6a**). Three
scenarios are traced: (1) appointment booking + reminder; (2) clinical visit →
medical record → prescription; (3) invoice → payment → receipt.

> ⚠️ **Honesty note.** These traces show operational *intent* grounded in the
> codebase. Steps that depend on **authentication** (PLANNED — not wired), the
> **Payment Provider** (PLANNED — no Stripe SDK), or full **audit logging**
> (PARTIAL — ~7/34 services) are annotated inline. The client portal path is
> **IN PROGRESS** (FE placeholder). See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Notation

```
   Vertical bars (|) are lifelines.  ──►  message/event   ◄──  response/return
   [BR-xx] = governing rule (OV-6a)   {State→State} = transition (OV-6b)
   (PLANNED) / (PARTIAL) = honesty annotation
```

---

## 3. Scenario 1 — Appointment Booking + Reminder

**Actors/Nodes:** Pet Owner (ORG-6), Front Office (ORG-5), Platform (`appointments`),
Reminder Engine (`patient-reminders`), SendGrid (ON-EXT-1) / Twilio (ON-EXT-2).

```
 Owner        Front Office     Platform/appts      ReminderEngine     SendGrid/Twilio
   │               │                 │                   │                   │
   │ request slot  │                 │                   │                   │
   ├──────────────►│                 │                   │                   │
   │  (RF-01)      │ create appt     │                   │                   │
   │               ├────────────────►│ [BR-01 no dbl-book]│                  │
   │               │                 │ {*, →Scheduled}    │                  │
   │               │   appt id       │◄──── (PARTIAL)     │                  │
   │               │◄────────────────┤                   │                   │
   │  confirmation │                 │ confirm           │                   │
   │◄──────────────┤────────────────►│ {Scheduled→Confirmed}                 │
   │               │                 │  schedule reminder │                  │
   │               │                 ├───────────────────►│                  │
   │               │                 │                   │ dispatch (RF-24/25)│
   │               │                 │                   ├──────────────────►│
   │ reminder (email/SMS) RF-26      │                   │                   │ send
   │◄────────────────────────────────────────────────────────────────────────┤
   │               │                 │                   │                   │
   * Auth gate (BR-12) would precede every Platform call — PLANNED, not enforced.
```

| Seq | Event | From → To | Flow | Rule/State |
|----:|-------|-----------|------|------------|
| 1 | Request slot | Owner → Front Office | RF-01 | — |
| 2 | Create appointment | Front Office → Platform | — | BR-01; {→Scheduled} |
| 3 | Confirm | Front Office → Platform | — | {Scheduled→Confirmed} |
| 4 | Schedule reminder | Platform → Reminder Engine | — | — |
| 5 | Dispatch | Reminder Engine → SendGrid/Twilio | RF-24/25 | — |
| 6 | Deliver reminder | Provider → Owner | RF-26 | (PARTIAL) |

---

## 4. Scenario 2 — Clinical Visit → Medical Record → Prescription

**Actors/Nodes:** Front Office (ORG-5), Vet Tech (ORG-4), Veterinarian (ORG-3),
Platform (`medical-records`, `prescriptions`), Pharmacy (ON-4), Inventory.

```
 FrontOffice   VetTech     Veterinarian    Platform/records   Pharmacy/Rx    Inventory
     │            │             │                │                 │              │
     │ check-in   │             │                │                 │              │
     ├────────────────────────►│ {Confirmed→CheckedIn} (RF-04)     │              │
     │            │ vitals      │                │                 │              │
     │            ├────────────►│ record vitals  │                 │              │
     │            │   (RF-07)   ├───────────────►│ create record   │              │
     │            │             │ {→InProgress}  │ (RF-29)         │              │
     │            │  exam +     │                │                 │              │
     │            │  diagnosis  ├───────────────►│ append plan     │              │
     │            │             │                │ [BR-09 append]  │              │
     │            │  write Rx   │                │                 │              │
     │            │             ├──────────────────────────────────►│            │
     │            │             │ [BR-02 prescriber][BR-06 interaction check]     │
     │            │             │                │                 │ [BR-03 CS log]│
     │            │             │                │                 │ (PARTIAL)    │
     │            │             │                │                 │ dispense ───►│ decrement
     │            │             │                │                 │  (RF-08)     │ (RF-10)
     │            │             │ complete visit │                │              │
     │            │             ├───────────────►│ {InProgress→Completed}        │
```

| Seq | Event | From → To | Flow | Rule/State |
|----:|-------|-----------|------|------------|
| 1 | Check-in | Front Office → Platform | RF-04 | {Confirmed→CheckedIn} |
| 2 | Record vitals | Vet Tech → Platform | RF-07 | {→InProgress} |
| 3 | Create medical record | Veterinarian → Platform | RF-29 | BR-09 append |
| 4 | Write prescription | Veterinarian → Pharmacy | RF-08 | BR-02, BR-06 |
| 5 | Log controlled substance | Pharmacy → CS Log | — | BR-03 (PARTIAL) |
| 6 | Dispense / decrement stock | Pharmacy → Inventory | RF-10 | — |
| 7 | Complete visit | Veterinarian → Platform | — | {InProgress→Completed} |

---

## 5. Scenario 3 — Invoice → Payment → Receipt

**Actors/Nodes:** Front Office (ORG-5), Billing (ON-6), Pet Owner (ORG-6),
Payment Provider (ON-EXT-3, **PLANNED**), Loyalty (`loyalty-programs`), SendGrid.

```
 FrontOffice    Billing/invoices    Owner       PaymentProvider     Loyalty    SendGrid
     │                 │              │                │                │          │
     │ visit complete  │              │                │                │          │
     ├────────────────►│ issue invoice│                │                │          │
     │   (RF-15)       │ [BR-04 client ref]            │                │          │
     │                 │ {Draft→Issued}│               │                │          │
     │                 │  statement    │               │                │          │
     │                 ├─────────────►│               │                │          │
     │                 │              │ pay (RF-17)    │                │          │
     │                 │◄─────────────┤               │                │          │
     │                 │ charge card  │               │                │          │
     │                 ├──────────────────────────────►│ (RF-18 PLANNED)│         │
     │                 │ settlement    │               │                │          │
     │                 │◄──────────────────────────────┤ (RF-19 PLANNED)│         │
     │                 │ [BR-08 ≤ balance]             │                │          │
     │                 │ {Issued→Paid} (manual today)  │                │          │
     │                 │ accrue points │               │                │          │
     │                 ├──────────────────────────────────────────────►│ (RF-21) │
     │                 │ send receipt  │               │                │          │
     │                 ├──────────────────────────────────────────────────────────►│
     │ receipt (RF-20) │              │               │                │          │ send
     │◄────────────────────────────────┤              │                │          │
```

| Seq | Event | From → To | Flow | Rule/State |
|----:|-------|-----------|------|------------|
| 1 | Issue invoice | Front Office → Billing | RF-15 | BR-04; {Draft→Issued} |
| 2 | Deliver statement | Billing → Owner | — | — |
| 3 | Pay | Owner → Billing | RF-17 | — |
| 4 | Charge card | Billing → Payment Provider | RF-18 | **PLANNED** |
| 5 | Settlement | Payment Provider → Billing | RF-19 | **PLANNED** |
| 6 | Mark paid | Billing | — | BR-08; {Issued→Paid} (manual today) |
| 7 | Accrue loyalty | Billing → Loyalty | RF-21 | — |
| 8 | Send receipt | Billing → SendGrid → Owner | RF-20 | — |

---

## 6. Cross-Scenario Event Summary

| Scenario | Entities Transitioned | Providers Involved | Honesty Flags |
|----------|-----------------------|--------------------|---------------|
| 1 Booking + Reminder | Appointment | SendGrid, Twilio | Auth PLANNED; reminder PARTIAL |
| 2 Visit → Record → Rx | Appointment, Prescription, Inventory | External Lab (if ordered) | CS log PARTIAL; audit PARTIAL |
| 3 Invoice → Payment | Invoice | Payment Provider (PLANNED), SendGrid | Card settle PLANNED; paid manual |

---

## 7. Honesty & Gap Notes

| Trace Element | Reality | Status |
|---------------|---------|--------|
| Auth gate before each platform call | Not enforced (no route uses middleware) | PLANNED |
| Payment Provider charge/settlement (Sc.3) | No Stripe SDK; payments recorded manually | PLANNED |
| Controlled-substance log step (Sc.2) | `ControlledSubstanceLog` exists; partial | PARTIAL |
| Reminder delivery (Sc.1) | Provider-config dependent | PARTIAL |
| Audit event emission across traces | `AuditLog` from ~7/34 services | PARTIAL |
| Owner steps via client portal | FE placeholder; API exists | IN PROGRESS |

---

## 8. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-1 | Scenarios elaborate the operational thread |
| OV-2 / OV-3 | Messages realize needlines/flows (NL-*/RF-*) |
| OV-4 | Actors are organizational roles (ORG-*) |
| OV-5b | Traces sequence the care-to-cash activity flow |
| OV-6a | Inline [BR-*] guards from the rules model |
| OV-6b | {State→State} transitions driven by these events |
| SV-10c | System-level event traces implementing these |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
