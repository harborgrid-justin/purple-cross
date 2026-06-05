# OV-1: High-Level Operational Concept Graphic

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-1 provides a **high-level graphical and narrative description** of the
operational concept for the Purple Cross veterinary practice management platform.
It shows *who* participates in practice operations (clinical staff, front office,
pet owners, external providers), *what* the core operational thread is
(book → check-in → treat → prescribe → order lab → invoice → collect →
follow-up), and *how* the platform mediates the information that flows between
them. It is the orienting picture for the rest of the Operational Viewpoint
(OV-2 resource flows, OV-5 activities, OV-6 rules/states/events).

> ⚠️ **Honesty note.** This concept describes the operational *intent* grounded
> in the current codebase. Backend services are ~85% real (Prisma-backed); many
> frontend pages are still placeholders. **Authentication is not wired** (auth
> middleware exists but 0 routes consume it; the frontend hardcodes
> `isAuthenticated = true`), **RBAC roles are defined but unenforced**, and the
> **Payment Provider integration is aspirational** (no Stripe SDK present). See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Operational Context Diagram

```
                          PURPLE CROSS — OPERATIONAL CONCEPT (OV-1)
+--------------------------------------------------------------------------------------------+
|                                  EXTERNAL ENVIRONMENT                                        |
|   +--------------+   +--------------+   +------------------+   +------------------+          |
|   | SendGrid     |   | Twilio       |   | Payment Provider |   | External Lab     |          |
|   | (Email)      |   | (SMS)        |   | (PLANNED)        |   | (Diagnostics)    |          |
|   +------+-------+   +------+-------+   +--------+---------+   +--------+---------+          |
|          ^ reminders        ^ alerts            ^ charges              ^ orders / v results  |
+----------|-----------------|-------------------|----------------------|--------------------+
           |                 |                   |                      |
           v                 v                   v                      v
+--------------------------------------------------------------------------------------------+
|                          PURPLE CROSS PLATFORM (Express /api/v1 + Prisma/PostgreSQL)         |
|                                                                                             |
|   BOOK ──► CHECK-IN ──► TREAT ──► PRESCRIBE ──► ORDER LAB ──► INVOICE ──► COLLECT ──► FOLLOW-UP
|    |          |           |          |             |            |           |           |    |
|    v          v           v          v             v            v           v           v    |
|  appts     appts      medical-     prescriptions  lab-tests   invoices   payment-    patient-|
|  waitlist  patients   records      controlled-sub           estimates   plans       reminders|
|                                                                                             |
+--------------------------------------------------------------------------------------------+
       ^             ^                ^                 ^                 ^             ^
       |             |                |                 |                 |             |
  +---------+  +-----------+   +--------------+  +--------------+  +-----------+  +-----------+
  | Front   |  | Pet Owner |   | Veterinarian |  | Vet Tech     |  | Practice  |  | Practice  |
  | Office  |  | (Client)  |   | (Clinician)  |  | (Clinical    |  | Manager   |  | Owner     |
  | / Recep |  | (external)|   |              |  |  support)    |  |           |  |           |
  +---------+  +-----------+   +--------------+  +--------------+  +-----------+  +-----------+
                    |
              (Client Portal: self-service booking, records, payments — FE placeholder)
```

---

## 3. Operational Nodes

Operational nodes are the role-based participants and external actors in practice
operations. They are elaborated as resource-flow nodes in **OV-2** and mapped to
organizational roles in **OV-4**.

| Node ID | Operational Node | Type | Description | Primary Modules |
|---------|------------------|------|-------------|-----------------|
| ON-1 | Front Office / Receptionist | Internal role | Booking, check-in, client intake, payment capture | appointments, clients, waitlist, invoices |
| ON-2 | Exam Room / Veterinarian | Internal role | Clinical assessment, diagnosis, treatment, prescribing | medical-records, prescriptions, patients |
| ON-3 | Vet Tech | Internal role | Clinical support, sample collection, vitals, lab prep | medical-records, lab-tests, inventory |
| ON-4 | Pharmacy / Dispensing | Internal function | Rx fulfillment, controlled-substance logging | prescriptions, controlled-substance-log, inventory |
| ON-5 | Laboratory / Diagnostics | Internal + external | Lab order, sample handling, result capture | lab-tests |
| ON-6 | Billing / Revenue | Internal function | Invoice, estimate, payment plan, refund, claim | invoices, estimates, payment-plans, refunds, insurance-claims |
| ON-7 | Pet Owner (Client) | External actor | Receives care for pet; books, pays, gets reminders | client-portal, communications, patient-reminders |
| ON-8 | Practice Manager | Internal role | Oversight, scheduling policy, reporting, supply | analytics, staff, purchase-orders, time-blocks |
| ON-EXT-1 | SendGrid | External system | Email delivery (reminders, receipts) | communications |
| ON-EXT-2 | Twilio | External system | SMS delivery (reminders, alerts) | communications |
| ON-EXT-3 | Payment Provider | External system (**PLANNED**) | Charge/refund processing | invoices, refunds |
| ON-EXT-4 | External Lab | External system | Reference-lab diagnostics interchange | lab-tests |

---

## 4. Operational Scenarios

### 4.1 Scenario A — Routine Wellness Visit

```
Owner ──books──► Front Office ──schedules──► Appointment (Scheduled→Confirmed)
   │                                              │
   │◄── reminder (SendGrid/Twilio) ──────────────┘
   │
   └─arrives─► Front Office check-in ─► Vet Tech vitals ─► Veterinarian exam
                                                              │
                       Medical Record created ◄──────────────┘
                                                              │
                            Prescription (if needed) ◄────────┘
                                                              │
                Invoice issued ─► Front Office collects payment ─► Receipt
                                                              │
                       Patient Reminder scheduled (next wellness / vaccine due)
```

A pet owner books a wellness visit; the platform confirms and sends a reminder.
On arrival, front office checks the appointment in, a vet tech records vitals,
the veterinarian documents the exam in a medical record and writes any
prescriptions. Billing issues an invoice; the front office collects payment and
the platform schedules the next reminder.

### 4.2 Scenario B — Urgent / Walk-in

```
Owner ──walk-in──► Front Office ──► Waitlist (no open slot)
                                       │
                 Time block / triage ──┘
                                       │
            Veterinarian seen ─► Medical Record (urgent) ─► Lab order ──► External Lab
                                       │                                      │
                                       │◄──────────── results attached ───────┘
                                       │
                       Prescription (incl. controlled substance ─► ControlledSubstanceLog)
                                       │
                              Invoice ─► Estimate-on-file? ─► Collect / Payment Plan
```

A walk-in with no open slot is placed on the **waitlist**; triage and time-block
logic find a gap. The clinician documents urgent care, may order diagnostics
(External Lab) and prescribe (controlled substances logged to
`ControlledSubstanceLog`). Billing resolves against any estimate and offers a
payment plan if needed.

### 4.3 Scenario C — Billing & Reminder Cycle

```
Invoice (Issued) ──unpaid past due──► Overdue ──► Communications dunning (email/SMS)
       │                                              │
       │◄──── partial payment ───────────────────────┘
       │
   PartiallyPaid ──final payment──► Paid ──► Receipt + Loyalty points
       │
   Patient Reminder engine ──► due vaccinations / recheck ──► SendGrid/Twilio ──► Owner
```

Outstanding invoices age into **Overdue** and trigger communications; partial and
final payments transition invoice state; the reminder engine drives recurring
client outreach.

---

## 5. Operational Activities Summary

The OV-1 thread decomposes into the activity tree detailed in **OV-5a**:

| Activity | Name | OV-5a Ref |
|----------|------|-----------|
| A1 | Manage Clients & Patients | OV-5a §A1 |
| A2 | Schedule & Intake | OV-5a §A2 |
| A3 | Deliver Clinical Care | OV-5a §A3 |
| A4 | Diagnostics & Pharmacy | OV-5a §A4 |
| A5 | Billing & Revenue | OV-5a §A5 |
| A6 | Inventory & Supply | OV-5a §A6 |
| A7 | Communications & Engagement | OV-5a §A7 |
| A8 | Compliance & Records | OV-5a §A8 |
| A9 | Platform Operations | OV-5a §A9 |

---

## 6. Operational Modes

| Mode | Description | Concept Impact |
|------|-------------|----------------|
| **Normal Operations** | Standard scheduled day | Full book→follow-up thread active |
| **Emergency / Walk-in** | Urgent surge | Intake + clinical + Rx prioritized (Scenario B) |
| **Degraded** | External provider outage | Circuit breakers shed email/SMS/payment; core CRUD continues |
| **Maintenance** | Scheduled window | Read-only; no clinical/billing writes |

---

## 7. Stakeholder Value

| Stakeholder | Operational Value |
|-------------|-------------------|
| Veterinarian | Fast, structured clinical documentation; safe prescribing |
| Vet Tech | Streamlined vitals, sample, and inventory workflow |
| Front Office | One-screen booking, check-in, and payment capture |
| Practice Manager | Visibility into schedule, revenue, and supply |
| Pet Owner | Reminders, transparency, self-service (portal **IN PROGRESS**) |

---

## 8. Honesty & Gap Notes

| Concept Element | Reality | Status |
|-----------------|---------|--------|
| Role-based access at each node | Roles in constants only; **not enforced** | PLANNED |
| Client Portal self-service | Backend endpoints exist; FE largely placeholder | IN PROGRESS |
| Payment Provider collect step | No Stripe SDK; manual/recorded payment only | PLANNED |
| Controlled-substance logging | `ControlledSubstanceLog` + `DrugInteraction` models exist | PARTIAL |
| Audit of who-touched-what | `AuditLog` written by only ~7/34 services | PARTIAL |
| Multi-tenant isolation per practice | Tenant fields exist but **not scoped** in queries | PLANNED |

---

## 9. Cross-References

| Related View | Relationship |
|--------------|--------------|
| AV-1 | High-level operational concept summary (this view elaborates it) |
| OV-2 | Resource flows between the OV-1 nodes |
| OV-4 | Organizational roles behind the internal nodes |
| OV-5a / OV-5b | Activity decomposition / ICOM model of the thread |
| OV-6a/6b/6c | Rules, state machines, and event traces for the thread |
| CV-6 | Capability-to-operational-activity mapping |
| SV-5a / SV-5b | Activity-to-system-function/system traceability |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
