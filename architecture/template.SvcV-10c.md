# SvcV-10c: Services Event-Trace Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-10c-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-10c Services Event-Trace Description** provides **sequence (event-trace)
diagrams** showing how the Purple Cross platform services interact over time to
satisfy concrete scenarios. Lifelines are the **services** (REST API services,
shared platform services) and the **external providers** (SendGrid, Twilio,
Payment Provider, External Lab). Each trace references the resource-flow rows
(`RF-nnn`) of SvcV-6 and the state transitions of SvcV-10b.

Scenarios:
1. Book appointment → emit domain event → schedule reminder (Comms → SendGrid/Twilio)
2. Create invoice → record payment (Payment Provider) → issue receipt
3. Order lab test → External Lab → inbound result webhook → update LabTest
4. Workflow trigger → workflow-engine executes steps across services

> ⚠️ **Honesty note.** Steps shown against **Payment Provider** (Scenario 2) and
> **External Lab** (Scenario 3) are **aspirational / PLANNED** — those
> integrations are not wired today (no Payment SDK; External Lab not connected).
> Outbound calls are **not yet wrapped** by circuit breakers (SvcR-20 PLANNED).
> Actor authentication is **not enforced** (SvcR-08 PLANNED). Such steps are
> marked `[PLANNED]` in the traces.

### 1.1 Notation

```
A ->> B   : synchronous request/call from A to B
A -->> B  : asynchronous message / event / enqueue
B -->> A  : response/return
[PLANNED] : step depends on an unwired integration or control
```

Lifelines abbreviations: **SPA** (browser), **API** (Express `/api/v1` service),
**SVC** (named domain service), **DE** (domain-events.service), **JQ** (BullMQ
job queue), **WD** (webhook-delivery), **WE** (workflow-engine), **DB**
(PostgreSQL via Prisma), plus external providers by name.

---

## 2. Scenario 1 — Book Appointment → Event → Schedule Reminder

References: RF-011 (book), RF-040 (send comms); SvcV-10b Appointment machine.

```
 SPA        API(appointments)     DB        DE        JQ        Comms(SVC-C10)   SendGrid   Twilio
  |               |               |         |          |              |              |          |
  | POST /api/v1/appointments     |         |          |              |              |          |
  |-- RF-011 ---->|               |         |          |              |              |          |
  |               | validate(Joi) |         |          |              |              |          |
  |               | create Appt   |         |          |              |              |          |
  |               |-------------->|         |          |              |              |          |
  |               |<-- Appointment|         |          |              |              |          |
  |               | emit appointment.booked |          |              |              |          |
  |               |------------------------>|          |              |              |          |
  |               |               |         | enqueue reminder job    |              |          |
  |               |               |         |--------->|              |              |          |
  |  201 {Appointment}            |         |          |              |              |          |
  |<--------------|               |         |          |              |              |          |
  |               |               |         |          | (at due time) worker runs   |          |
  |               |               |         |          |------------->|              |          |
  |               |               |         |          |              | POST /communications     |
  |               |               |         |          |              | (RF-040)     |          |
  |               |               |         |          |              |-- email ---->|          |
  |               |               |         |          |              |<-- 202 ------|          |
  |               |               |         |          |              |-- SMS ------------------>|
  |               |               |         |          |              |<-- queued ---------------|
  |               |               |         |          |              | persist Communication    |
  |               |               |         |          |              |--> DB                    |
```

Notes: email/SMS dispatch is **not** wrapped by circuit breaker today (SvcR-20
PLANNED). Reminder timing handled by BullMQ delayed job.

---

## 3. Scenario 2 — Create Invoice → Record Payment → Issue Receipt

References: RF-030 (create invoice), RF-031 (record payment); SvcV-10b Invoice machine.

```
 SPA      API(invoices)     DB        Payment Provider      DE        Comms      SendGrid
  |            |            |               |                |          |           |
  | POST /api/v1/invoices (RF-030)          |                |          |           |
  |----------->| validate   |               |                |          |           |
  |            | compute totals server-side (SvcR-19)        |          |           |
  |            | create Invoice + LineItems  |               |          |           |
  |            |----------->|               |                |          |           |
  |            |<-- Invoice |               |                |          |           |
  |            | emit invoice.created ----------------------->|         |           |
  |  201 {Invoice}          |               |                |          |           |
  |<-----------|            |               |                |          |           |
  |            |            |               |                |          |           |
  | POST /api/v1/invoices/:id/payments (RF-031)              |          |           |
  |----------->| validate   |               |                |          |           |
  |            | charge [PLANNED] ---------->|                |          |           |
  |            |            |   (no SDK — aspirational)       |          |           |
  |            |<-- charge result [PLANNED] -|                |          |           |
  |            | create Payment; update Invoice.status        |          |           |
  |            |----------->|               |                |          |           |
  |            | emit invoice.paid / payment_recorded ------->|         |           |
  |            |            |               |                | enqueue receipt        |
  |            |            |               |                |--------->| POST /communications  |
  |            |            |               |                |          |-- email -->|          |
  |  201 {Payment}          |               |                |          |<-- 202 ----|          |
  |<-----------|            |               |                |          |           |
```

Notes: the charge step against Payment Provider is **aspirational** — today a
payment is recorded as a `Payment` row without an external capture (SM-X05).
Invoice transitions Draft→Issued→PartiallyPaid/Paid per SvcV-10b.

---

## 4. Scenario 3 — Order Lab Test → External Lab → Inbound Result Webhook → Update LabTest

References: RF-023 (order), RF-024 (result inbound); SvcV-10b not a formal machine but status-bearing.

```
 SPA    API(lab-tests)    DB     External Lab         (inbound)        API(lab-tests)   DE
  |          |            |          |                                      |            |
  | POST /api/v1/lab-tests (RF-023)  |                                      |            |
  |--------->| validate   |          |                                      |            |
  |          | create LabTest(status=Ordered)                               |            |
  |          |----------->|          |                                      |            |
  |          | order out [PLANNED] -->|                                      |            |
  |          |            |   (External Lab not wired)                      |            |
  |  201 {LabTest}        |          |                                      |            |
  |<---------|            |          |                                      |            |
  |          |            |          |  ... lab processes specimen ...      |            |
  |          |            |          |                                      |            |
  |          |            |          |  POST /api/v1/lab-tests/:id/results (RF-024)      |
  |          |            |          |  (inbound webhook, signed) [PLANNED] |            |
  |          |            |          |------------------------------------->|            |
  |          |            |          |                       verify signature (SvcR-17)  |
  |          |            |          |                       update LabTest.status=Resulted
  |          |            |          |                                      |--> DB      |
  |          |            |          |                       emit lab_test.resulted ---->|
  |          |            |          |                                      |  -> reminder/notify (DE)
  |          |            |          |<-- 200 ------------------------------|            |
```

Notes: both the outbound order and inbound result paths are **PLANNED** (External
Lab not connected). Inbound webhook verification follows SvcR-17 once wired.

---

## 5. Scenario 4 — Workflow Trigger → Engine Executes Steps Across Services

References: SvcV-6 RF-074/075 (workflow engine/trigger); SvcV-10b WorkflowExecution machine.

```
 DE        WorkflowTrigger(SVC-P06)   WE(SVC-P05)   API(varies)    DE        Comms     SendGrid
  |               |                       |             |          |          |          |
  | domain event (e.g., patient.created)  |             |          |          |          |
  |-------------->| match workflow def     |             |          |          |          |
  |               | create WorkflowExecution(Pending)    |          |          |          |
  |               |---------------------->|              |          |          |          |
  |               |                       | dequeue; status=Running |          |          |
  |               |                       |  Step 1: call service A |          |          |
  |               |                       |------------>|           |          |          |
  |               |                       |<-- result --|           |          |          |
  |               |                       |  Step 2: call service B |          |          |
  |               |                       |------------>|           |          |          |
  |               |                       |<-- result --|           |          |          |
  |               |                       |  Step 3: notify         |          |          |
  |               |                       |----------------------------------->| email -->|
  |               |                       |                         |          |<-- 202 ---|
  |               |                       | all steps ok -> status=Completed   |          |
  |               |                       | emit workflow.completed ---------->|          |
  |               |                       |  (on step error -> status=Failed, backoff/retry)
```

Notes: the engine orchestrates calls across multiple `/api/v1` services and the
Comms service; failures transition the execution to `Failed` with retry/backoff
per SvcV-10b. Domain-events bus (DE) is in-process today.

---

## 6. Cross-Cutting Trace Concerns

| Concern | Behavior in every trace | Rule |
|---------|-------------------------|------|
| Correlation | `X-Correlation-ID` propagated through all hops and logs | SvcR-05 |
| Validation | Joi validates before any service logic | SvcR-02 |
| Envelope | Responses use `{status,data}` / errors `{error,...,correlationId}` | SvcR-03/04 |
| Auth | Actor **not** authenticated yet | SvcR-08 **PLANNED** |
| Tenancy | Calls **not** tenant-scoped yet | SvcR-10 **PLANNED** |
| Resilience | External calls **not** breaker-wrapped yet | SvcR-20 **PLANNED** |
| Events | State changes emit domain events | SvcR-21 |
| Webhook trust | Inbound webhooks verified by HMAC | SvcR-17 |

---

## 7. Scenario-to-Reference Map

| Scenario | RF rows | State machine (SvcV-10b) | External (SvcV-6 §6) |
|----------|---------|--------------------------|----------------------|
| 1 Book + reminder | RF-011, RF-040 | Appointment | SendGrid (RF-080), Twilio (RF-081) |
| 2 Invoice + payment | RF-030, RF-031 | Invoice | Payment Provider (RF-082) [PLANNED] |
| 3 Lab order + result | RF-023, RF-024 | LabTest (status) | External Lab (RF-083) [PLANNED] |
| 4 Workflow execution | RF-074, RF-075 | WorkflowExecution | SendGrid (RF-080) |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-6 | Resource-flow rows (`RF-nnn`) exercised by each trace |
| SvcV-10a | Rules (correlation, validation, events, webhook signing) applied per hop |
| SvcV-10b | State transitions advanced during each trace |
| SvcV-7 | Measures (latency, success, job/webhook) observed along traces |
| SV-10c | Underlying systems event traces |
| OV-6c | Operational event-trace scenarios these services realize |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
