# SvcV-10b: Services State Transition Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-10b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-10b Services State Transition Description** models the **lifecycle
state machines** of the resources managed through the Purple Cross REST API
services. Each state machine shows the legal states, the transitions between
them, and — critically for the Services Viewpoint — **which service operation
(endpoint) triggers each transition** and which domain event it emits.

In scope: Appointment, Invoice, Estimate, InsuranceClaim, WorkflowExecution, and
WebhookDelivery. These correspond to the stateful flows in SvcV-6 and are
governed by the rules in SvcV-10a (e.g., SvcR-21 domain events).

> ⚠️ **Honesty note.** The transitions are driven by service operations that
> exist today, but the **actor** behind them is not yet authenticated/authorized
> (SvcR-08/09 PLANNED), and transitions are not tenant-scoped (SvcR-10 PLANNED).
> The Payment-Provider-dependent transitions on Invoice (e.g., `Paid` via real
> charge capture) are **aspirational** until PI-3.

### 1.1 Notation

- `[*]` = initial pseudo-state; terminal states are labeled (final).
- Each transition is annotated `event / service operation`.
- States map to a status enum/string on the corresponding Prisma model.

---

## 2. Appointment State Machine

Triggered through `appointments` service (SVC-C03), endpoint
`PATCH /api/v1/appointments/:id/status` (RF-012) and booking (RF-011).

```
                 book / POST /appointments (RF-011)
        [*] ------------------------------> ( Scheduled )
                                                 |
                  confirm / PATCH :id/status     |
                 +-------------------------------+------------------+
                 v                                                  |
          ( Confirmed )                                             |
                 | check-in / PATCH :id/status                     |
                 v                                                  |
          ( CheckedIn )                                             |
                 | begin / PATCH :id/status                        |
                 v                                                  |
          ( InProgress )                                            |
                 | complete / PATCH :id/status                     |
                 v                                                  |
          ( Completed ) (final)                                    |
                                                                    |
   cancel / PATCH :id/status  -------> ( Cancelled ) (final) <------+
   no-show / PATCH :id/status -------> ( NoShow ) (final)
```

| From | To | Service operation | Event |
|------|----|-------------------|-------|
| — | Scheduled | `POST /appointments` | `appointment.booked` |
| Scheduled | Confirmed | `PATCH /appointments/:id/status` | `appointment.status_changed` |
| Confirmed | CheckedIn | `PATCH /appointments/:id/status` | `appointment.status_changed` |
| CheckedIn | InProgress | `PATCH /appointments/:id/status` | `appointment.status_changed` |
| InProgress | Completed | `PATCH /appointments/:id/status` | `appointment.completed` |
| Scheduled/Confirmed | Cancelled | `PATCH /appointments/:id/status` | `appointment.cancelled` |
| Scheduled/Confirmed | NoShow | `PATCH /appointments/:id/status` | `appointment.no_show` |

---

## 3. Invoice State Machine

Triggered through `invoices` service (SVC-C07): create (RF-030), record payment
(RF-031). `PartiallyPaid`/`Paid` depend on payment records; real capture via
Payment Provider is **aspirational** (SvcR-07/SM-X05).

```
        create / POST /invoices (RF-030)
   [*] ----------------------------> ( Draft )
                                        | issue / POST :id/issue
                                        v
                                   ( Issued )
                  payment < total / POST :id/payments (RF-031)
                       +----------------+----------------+
                       v                                 |
               ( PartiallyPaid )                         | payment == total
                       | payment == total                v
                       +-----------------------> ( Paid ) (final)
                                                 ^
   due date passed, unpaid / (job) ----> ( Overdue ) ---+ (pay later)
   void / POST :id/void --------------> ( Void ) (final)
```

| From | To | Service operation | Event |
|------|----|-------------------|-------|
| — | Draft | `POST /invoices` | `invoice.created` |
| Draft | Issued | `POST /invoices/:id/issue` | `invoice.issued` |
| Issued/PartiallyPaid | PartiallyPaid | `POST /invoices/:id/payments` (partial) | `invoice.payment_recorded` |
| Issued/PartiallyPaid | Paid | `POST /invoices/:id/payments` (full) | `invoice.paid` |
| Issued | Overdue | scheduled job (due-date check) | `invoice.overdue` |
| Draft/Issued | Void | `POST /invoices/:id/void` | `invoice.voided` |

---

## 4. Estimate State Machine

Triggered through `estimates` service (SVC-E): create (RF-050), send (RF-051).

```
   create / POST /estimates (RF-050)
   [*] ----------------------> ( Draft )
                                  | send / POST :id/send (RF-051)
                                  v
                              ( Sent ) --------------------------+
                              /     \                            |
        accept / POST :id/accept   decline / POST :id/decline   | expiry / (job)
            v                          v                        v
      ( Accepted ) (final)       ( Declined ) (final)      ( Expired ) (final)
```

| From | To | Service operation | Event |
|------|----|-------------------|-------|
| — | Draft | `POST /estimates` | `estimate.created` |
| Draft | Sent | `POST /estimates/:id/send` | `estimate.sent` (+ SendGrid) |
| Sent | Accepted | `POST /estimates/:id/accept` | `estimate.accepted` |
| Sent | Declined | `POST /estimates/:id/decline` | `estimate.declined` |
| Sent | Expired | scheduled job (expiry) | `estimate.expired` |

---

## 5. InsuranceClaim State Machine

Triggered through `insurance-claims` service (SVC-E): create (RF-052) and
review/decision endpoints.

```
   create / POST /insurance-claims (RF-052)
   [*] -------------------------> ( Draft )
                                     | submit / POST :id/submit
                                     v
                                ( Submitted )
                                     | begin review / PATCH :id/status
                                     v
                                ( UnderReview )
                          +----------+----------+
          approve / PATCH :id/status   deny / PATCH :id/status
                 v                              v
           ( Approved )                   ( Denied ) (final)
                 | pay / POST :id/payment
                 v
            ( Paid ) (final)
```

| From | To | Service operation | Event |
|------|----|-------------------|-------|
| — | Draft | `POST /insurance-claims` | `claim.created` |
| Draft | Submitted | `POST /insurance-claims/:id/submit` | `claim.submitted` |
| Submitted | UnderReview | `PATCH /insurance-claims/:id/status` | `claim.under_review` |
| UnderReview | Approved | `PATCH /insurance-claims/:id/status` | `claim.approved` |
| UnderReview | Denied | `PATCH /insurance-claims/:id/status` | `claim.denied` |
| Approved | Paid | `POST /insurance-claims/:id/payment` | `claim.paid` |

---

## 6. WorkflowExecution State Machine

Managed by `workflow-engine.service` (SVC-P05), triggered by
`workflow-trigger.service` (SVC-P06) on a domain event or schedule.

```
   trigger / event or schedule
   [*] ----------------> ( Pending )
                            | engine picks up
                            v
                        ( Running ) ---- step fails (terminal) ----> ( Failed ) (final)
                            |                                              ^
        all steps succeed   |        step retryable fail / backoff --------+
                            v
                       ( Completed ) (final)
                            |
        cancel / API or rule|
                            v
                       ( Cancelled ) (final)
```

| From | To | Trigger / operation | Event |
|------|----|---------------------|-------|
| — | Pending | `workflow-trigger` (event/schedule) | `workflow.execution_created` |
| Pending | Running | engine dequeue | `workflow.started` |
| Running | Completed | all steps succeed | `workflow.completed` |
| Running | Failed | non-retryable step error | `workflow.failed` |
| Running | Cancelled | cancel request/rule | `workflow.cancelled` |

---

## 7. WebhookDelivery State Machine

Managed by `webhook-delivery.service` (SVC-P03) over BullMQ with retry/backoff
(SvcR-17 signing enforced).

```
   domain event matches subscription
   [*] ----------------> ( Queued )
                            | worker attempts HTTPS POST (signed)
                            v
                       ( Sending )
            2xx response    |        non-2xx / timeout
              +-------------+-------------+
              v                           v
        ( Delivered ) (final)        ( Retrying ) --- attempts exhausted ---> ( Failed ) (final)
                                          ^   |
                                          +---+ backoff, re-attempt
```

| From | To | Trigger / operation | Notes |
|------|----|---------------------|-------|
| — | Queued | matching domain event | enqueue BullMQ job |
| Queued | Sending | worker dequeue | HMAC-signed POST |
| Sending | Delivered | 2xx from subscriber | success |
| Sending | Retrying | non-2xx / timeout | backoff schedule |
| Retrying | Delivered | later 2xx | recovered |
| Retrying | Failed | max attempts reached | dead-letter (PLANNED DLQ review) |

---

## 8. State Persistence and Status Fields

| Resource | Prisma model | Status field | Soft-delete (SvcR-18) |
|----------|--------------|--------------|-----------------------|
| Appointment | `Appointment` | `status` | yes (`deletedAt`) |
| Invoice | `Invoice` | `status` | yes |
| Estimate | `Estimate` | `status` | yes |
| InsuranceClaim | `InsuranceClaim` | `status` | yes |
| WorkflowExecution | `WorkflowExecution` | `status` | n/a (lifecycle record) |
| WebhookDelivery | delivery record | `status`/attempt | n/a |

---

## 9. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-6 | Endpoints (`RF-nnn`) that trigger these transitions |
| SvcV-10a | Rules (SvcR-21 events, SvcR-17 webhook signing) governing transitions |
| SvcV-10c | Event traces that exercise these state changes end-to-end |
| SvcV-7 | Measures (job/webhook latency, success) over async transitions |
| SV-10b | Underlying systems state transitions |
| OV-6b | Operational state model these services realize |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
