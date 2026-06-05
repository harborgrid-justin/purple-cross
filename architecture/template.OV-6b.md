# OV-6b: State Transition Description

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-6b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-6b describes the **state machines** for the key operational entities of Purple
Cross — the lifecycle states each entity occupies, the events that trigger
transitions, and the guard rules (from **OV-6a**) that must hold for a transition
to fire. It models the operational behavior over time for **Appointment**,
**Invoice**, **Estimate**, **InsuranceClaim**, and **Waitlist** entries.

> ⚠️ **Honesty note.** These state machines describe operational *intent*
> grounded in the Prisma models and services (~85% real). However,
> auth/RBAC-guarded transitions are **not access-controlled** (auth not wired,
> PLANNED), the Payment-Provider-driven `Paid` transition for card payments is
> **PLANNED** (payments recorded manually), and some transitions are enforced
> only **PARTIALLY** in code. See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Appointment State Machine

```
                     book (BR-01)            confirm
   [ * ] ─────────► Scheduled ─────────────► Confirmed
                       │                         │
                       │ cancel                  │ check-in
                       ▼                         ▼
                   Cancelled               CheckedIn
                       ▲                         │
                       │ no-show                 │ begin exam
            NoShow ◄───┘ (auto/late)             ▼
                                            InProgress
                                                 │ complete visit
                                                 ▼
                                             Completed
```

| From | Event | To | Guard (OV-6a) | Status |
|------|-------|----|---------------|--------|
| (start) | Book | Scheduled | BR-01 no double-book | PARTIAL |
| Scheduled | Confirm | Confirmed | — | REAL |
| Scheduled/Confirmed | Cancel | Cancelled | — | REAL |
| Confirmed | Check-in | CheckedIn | BR-16 slot match | PARTIAL |
| Confirmed/CheckedIn | No-show (no arrival) | NoShow | time threshold | PARTIAL |
| CheckedIn | Begin exam | InProgress | — | REAL |
| InProgress | Complete | Completed | — | REAL |

---

## 3. Invoice State Machine

```
            issue (BR-04)        record partial payment (BR-08)
   Draft ──────────────► Issued ──────────────────────► PartiallyPaid
     │                     │  │                              │
     │ void                │  │ full payment                 │ final payment
     ▼                     │  ▼                              ▼
   Void ◄──────────────────┘ Paid ◄──────────────────────── Paid
                            ▲ │
              past due      │ │ past due
   Issued ─────────────► Overdue ──(payment)──► PartiallyPaid/Paid
```

| From | Event | To | Guard (OV-6a) | Status |
|------|-------|----|---------------|--------|
| (start) | Create | Draft | — | REAL |
| Draft | Issue | Issued | BR-04 references client | REAL |
| Draft/Issued | Void | Void | not yet paid | PARTIAL |
| Issued | Record partial payment | PartiallyPaid | BR-08 ≤ balance | PARTIAL |
| Issued/PartiallyPaid | Record full payment | Paid | BR-08 ≤ balance | PARTIAL |
| Issued/PartiallyPaid | Due date passes | Overdue | unpaid balance | PARTIAL |
| Overdue | Record payment | PartiallyPaid/Paid | BR-08 | PARTIAL |
| Issued/PartiallyPaid | Card settlement | Paid | Payment Provider | **PLANNED** |

---

## 4. Estimate State Machine

```
   Draft ──send──► Sent ──accept (BR-14)──► Accepted
     │              │  │
     │ discard      │  │ decline
     ▼              │  ▼
   (deleted)        │ Declined
                    │ expire (date passed)
                    ▼
                 Expired
```

| From | Event | To | Guard (OV-6a) | Status |
|------|-------|----|---------------|--------|
| (start) | Create | Draft | — | REAL |
| Draft | Send | Sent | — | REAL |
| Sent | Accept | Accepted | BR-14 not expired | PARTIAL |
| Sent | Decline | Declined | — | REAL |
| Sent | Expire (date) | Expired | validity window | PARTIAL |

---

## 5. InsuranceClaim State Machine

```
   Draft ──submit (BR-15)──► Submitted ──insurer responds──► UnderReview
                                                                  │
                              ┌───────────────────────────────────┼──────────────┐
                              ▼                                    ▼              ▼
                          Approved ──pay──► Paid              Partially        Denied
                                                              Approved
```

| From | Event | To | Guard (OV-6a) | Status |
|------|-------|----|---------------|--------|
| (start) | Create | Draft | — | REAL |
| Draft | Submit | Submitted | BR-15 valid invoice ref | PARTIAL |
| Submitted | Insurer acknowledges | UnderReview | — | PARTIAL |
| UnderReview | Adjudicate | Approved/PartiallyApproved/Denied | — | PARTIAL |
| Approved | Payout received | Paid | — | PARTIAL |

---

## 6. Waitlist State Machine

```
   [ * ] ──add──► Waiting ──slot opens (BR-16)──► Offered ──accept──► Scheduled*
                     │                               │
                     │ remove / fulfilled elsewhere  │ decline / timeout
                     ▼                               ▼
                  Removed                          Waiting (re-queued)

   * On accept, hands off to the Appointment state machine (Scheduled).
```

| From | Event | To | Guard (OV-6a) | Status |
|------|-------|----|---------------|--------|
| (start) | Add to waitlist | Waiting | — | REAL |
| Waiting | Matching slot opens | Offered | BR-16 slot match | PARTIAL |
| Offered | Accept | Scheduled (→ Appointment) | BR-01 no double-book | PARTIAL |
| Offered | Decline/timeout | Waiting | — | PARTIAL |
| Waiting/Offered | Remove | Removed | — | REAL |

---

## 7. State Model Summary

| Entity | States | Terminal States | Guarded By | Enforcement |
|--------|-------:|-----------------|------------|-------------|
| Appointment | 7 | Completed, Cancelled, NoShow | BR-01, BR-16 | PARTIAL |
| Invoice | 6 | Paid, Void | BR-04, BR-05, BR-08 | PARTIAL (card PLANNED) |
| Estimate | 5 | Accepted, Declined, Expired | BR-14 | PARTIAL |
| InsuranceClaim | 6 | Paid, Denied | BR-15 | PARTIAL |
| Waitlist | 4 | Scheduled, Removed | BR-16, BR-01 | PARTIAL |

---

## 8. Honesty & Gap Notes

| Transition Area | Reality | Status |
|-----------------|---------|--------|
| Card-settlement → Paid (Invoice) | No Payment Provider integration | PLANNED |
| Auth/role-guarded transitions | No transition is access-controlled | PLANNED |
| No-show automation (Appointment) | Manual/partial detection | PARTIAL |
| Estimate expiry enforcement | Date check partial | PARTIAL |
| Claim adjudication intake | Largely manual | PARTIAL |
| Tenant scoping on state queries | Not enforced | PLANNED |

---

## 9. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-6a | Guards on every transition (BR-*) |
| OV-6c | Event traces drive these transitions |
| OV-5b | Activities that fire transition events |
| OV-3 | Flows (RF-*) that trigger transitions |
| SV-10b | System-level state machines implementing these |
| DIV-2 | Logical data model for these entities |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
