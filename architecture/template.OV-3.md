# OV-3: Operational Resource Flow Matrix

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-3-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-3 presents the **Operational Resource Flow Matrix** — a tabular decomposition
of every resource flow between Purple Cross operational nodes. It refines the
needlines of **OV-2** into discrete, individually identified flows (RF-*), each
characterized by producer, consumer, the resource/information exchanged, the
triggering event, frequency, and media. This matrix is the authoritative
flow-by-flow register used to validate interfaces (SV-6) and traceability
(SV-5a/5b).

> ⚠️ **Honesty note.** Each flow describes operational *intent* grounded in the
> codebase. Flows are **not access-controlled** (auth not wired), **not
> tenant-scoped**, and the Payment Provider settlement flows (RF-18/RF-19) are
> **PLANNED** (no Stripe SDK). PHI-bearing flows are **plaintext at rest**. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Matrix Conventions

| Column | Meaning |
|--------|---------|
| **RF ID** | Unique resource-flow identifier |
| **NL** | Parent needline from OV-2 §4 |
| **Producer** | Originating operational node (ON-*) |
| **Consumer** | Receiving operational node (ON-*) |
| **Resource / Information** | What is exchanged |
| **Trigger** | Event/condition that initiates the flow |
| **Frequency** | Expected cadence |
| **Media** | Carrier mechanism |
| **Status** | REAL / PARTIAL / PLANNED |

Media legend: **REST** = `/api/v1` JSON over HTTPS; **DB** = Prisma/PostgreSQL
persisted; **Email** = SendGrid; **SMS** = Twilio; **Ext-REST** = third-party API;
**Manual** = human/clerical action recorded in system.

---

## 3. Operational Resource Flow Matrix

| RF ID | NL | Producer | Consumer | Resource / Information | Trigger | Frequency | Media | Status |
|-------|----|----------|----------|------------------------|---------|-----------|-------|--------|
| RF-01 | NL-01 | ON-7 Owner | ON-1 Front Office | Booking request (date, reason, patient) | Owner requests appointment | Per booking | REST/Manual | PARTIAL |
| RF-02 | NL-01 | ON-7 Owner | ON-1 Front Office | Client + patient demographics | New client / update | Per intake | REST/DB | REAL |
| RF-03 | NL-02 | ON-8 Practice Mgr | ON-1 Front Office | Time blocks / availability rules | Schedule policy change | Weekly | DB | REAL |
| RF-04 | NL-03 | ON-1 Front Office | ON-2 Veterinarian | Check-in event + appointment context | Patient arrives | Per visit | REST/DB | REAL |
| RF-05 | NL-03 | ON-1 Front Office | ON-2 Veterinarian | Patient history / prior records | Exam start | Per visit | REST/DB | REAL |
| RF-06 | NL-05 | ON-2 Veterinarian | ON-3 Vet Tech | Vitals/sample task orders | Exam in progress | Per visit | REST/DB | REAL |
| RF-07 | NL-05 | ON-3 Vet Tech | ON-2 Veterinarian | Recorded vitals / observations | Task completed | Per visit | REST/DB | REAL |
| RF-08 | NL-06 | ON-2 Veterinarian | ON-4 Pharmacy | Prescription order (drug, dose, qty) | Rx written | Per Rx | REST/DB | REAL |
| RF-09 | NL-06 | ON-2 Veterinarian | ON-4 Pharmacy | Controlled-substance flag + schedule | CS drug prescribed | Per CS Rx | DB | PARTIAL |
| RF-10 | NL-09 | ON-4 Pharmacy | Inventory | Stock decrement on dispense | Rx fulfilled | Per dispense | REST/DB | REAL |
| RF-11 | NL-09 | ON-4 Pharmacy | ON-2 Veterinarian | Drug-interaction warning | Rx validation | Per Rx | DB | PARTIAL |
| RF-12 | NL-07 | ON-2 Veterinarian | ON-5 Laboratory | Lab order (panel, specimen type) | Diagnostics needed | Per order | REST/DB | REAL |
| RF-13 | NL-08 | ON-3 Vet Tech | ON-EXT-4 External Lab | Specimen + requisition | External panel required | Per order | Ext-REST/Manual | PARTIAL |
| RF-14 | NL-07b | ON-5 / ON-EXT-4 | ON-2 Veterinarian | Lab results + reference ranges | Result available | Per order | REST/Ext-REST | PARTIAL |
| RF-15 | NL-04 | ON-1 Front Office | ON-6 Billing | Invoice request + charge lines | Visit/services complete | Per visit | REST/DB | REAL |
| RF-16 | NL-04 | ON-6 Billing | ON-7 Owner | Estimate (pre-treatment) | Estimate requested | Per estimate | REST/DB | REAL |
| RF-17 | NL-11 | ON-7 Owner | ON-6 Billing | Payment tender / plan election | Invoice issued | Per payment | Manual/REST | PARTIAL |
| RF-18 | NL-10 | ON-6 Billing | ON-EXT-3 Payment Provider | Charge request | Card payment attempt | Per charge | Ext-REST | PLANNED |
| RF-19 | NL-10 | ON-EXT-3 Payment Provider | ON-6 Billing | Settlement / decline status | Charge processed | Per charge | Ext-REST | PLANNED |
| RF-20 | NL-12 | ON-6 Billing | ON-7 Owner | Receipt / statement | Payment recorded | Per payment | Email/REST | PARTIAL |
| RF-21 | NL-12 | ON-6 Billing | ON-7 Owner | Loyalty points accrual | Qualifying payment | Per payment | DB | REAL |
| RF-22 | NL-15 | ON-6 Billing | Insurer (ext) | Insurance claim submission | Claim filed | Per claim | Ext-REST/Manual | PARTIAL |
| RF-23 | NL-15 | Insurer (ext) | ON-6 Billing | Claim status / adjudication | Insurer responds | Per claim | Manual/REST | PARTIAL |
| RF-24 | NL-16 | ON-1/ON-6 | ON-EXT-1 SendGrid | Email dispatch payload | Reminder/receipt due | Continuous | Ext-REST | REAL |
| RF-25 | NL-16 | ON-1/ON-6 | ON-EXT-2 Twilio | SMS dispatch payload | Reminder/alert due | Continuous | Ext-REST | REAL |
| RF-26 | NL-14 | ON-EXT-1/2 | ON-7 Owner | Reminder / dunning / recheck notice | Schedule or overdue | Daily batch | Email/SMS | PARTIAL |
| RF-27 | NL-13 | Clinical/Billing | ON-8 Practice Mgr | Operational + financial metrics | Report run | On demand/scheduled | REST/DB | PARTIAL |
| RF-28 | NL-13 | ON-8 Practice Mgr | ON-1 Front Office | Approved schedule / supply decisions | Review cycle | Periodic | DB | REAL |
| RF-29 | NL-06 | ON-2 Veterinarian | ON-2 (record) | Medical record entry (diagnosis/plan) | Exam documented | Per visit | REST/DB | REAL |
| RF-30 | NL-14 | ON-6 Billing | ON-7 Owner | Refund notice (≤ paid amount) | Refund approved | Per refund | Email/DB | PARTIAL |

---

## 4. Flow Summary by Class

| Class | RF IDs | Count | Predominant Media | Notes |
|-------|--------|------:|-------------------|-------|
| Clinical (PHI) | RF-04..RF-14, RF-29 | 12 | REST/DB | Plaintext at rest (PLANNED encryption) |
| Financial | RF-15..RF-23, RF-30 | 11 | REST/Ext-REST/Manual | Settlement RF-18/19 PLANNED |
| Client/PII | RF-01, RF-02 | 2 | REST/DB | No tenant scoping enforced |
| Operational | RF-03, RF-27, RF-28 | 3 | DB/REST | Management flows |
| Notification | RF-20, RF-24, RF-25, RF-26 | 4 | Email/SMS | External via SendGrid/Twilio |

---

## 5. Trigger & Frequency Profile

| Profile | Flows | Implication |
|---------|-------|-------------|
| Per-visit synchronous | RF-04..RF-08, RF-15, RF-29 | Latency-sensitive; in exam-room workflow |
| Per-event asynchronous | RF-12..RF-14, RF-18..RF-23 | Tolerant of provider latency; circuit-breaker protected |
| Batch / scheduled | RF-26, RF-27 | Reminder engine + reporting cadence |
| Continuous dispatch | RF-24, RF-25 | Outbound messaging queue to providers |

---

## 6. Honesty & Gap Notes

| Matrix Element | Reality | Status |
|----------------|---------|--------|
| RF-18 / RF-19 Payment Provider settlement | No Stripe SDK; not implemented | PLANNED |
| RF-09 / RF-11 CS + interaction enforcement | Models exist; enforcement partial | PARTIAL |
| Access control on all RF-* | Auth middleware unused on routes | PLANNED |
| Tenant scoping on RF-* | Fields exist, not applied | PLANNED |
| RF-26 reminder delivery | Engine partial; depends on provider config | PARTIAL |
| Audit of RF-* events | `AuditLog` from ~7/34 services | PARTIAL |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-2 | Needlines (NL-*) decomposed into these RF-* rows |
| OV-1 | Node IDs and operational thread |
| OV-5b | Activities producing/consuming each flow (ICOM) |
| OV-6c | Event traces sequencing these flows |
| SV-6 | System resource flow matrix implementing RF-* |
| SV-5a/5b | Activity-to-function/system traceability |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
