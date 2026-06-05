# SV-10b: Systems State Transition Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-10b-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-10b describes the **state machines** governing system-internal behaviors of
the Purple Cross platform — not the operational/business states in OV-6b, but the
runtime states of **system mechanisms**: the resilience circuit breaker, the HTTP
request lifecycle, the BullMQ async job, workflow execution, and outbound webhook
delivery. Each machine is given a state diagram plus a transition table with
triggers, guards, and side-effects.

> ⚠️ **Honesty note.** The **Circuit Breaker** state machine reflects the design
> in `utils/circuit-breaker.ts`, but that utility is **currently unused (dead
> code)** — its activation is **PLANNED for SV-8 Phase 4**. It is documented here
> so the intended behavior is captured, not to imply it is active. The request,
> job, workflow, and webhook machines reflect live mechanisms (BullMQ + Express)
> except where a state depends on PLANNED features (e.g., auth gates).

---

## 2. Circuit Breaker (PLANNED — utility unused today)

```
                 failures >= threshold
   +---------+ ----------------------------> +--------+
   | CLOSED  |                                |  OPEN  |
   | (pass)  | <---------------------------+  | (fail  |
   +---------+      success (reset count)  |  |  fast) |
        ^                                  |  +--------+
        |                                  |       |
        | success: close                   |       | cooldown elapsed
        |                                  |       v
        |                            +-----------------+
        +----------------------------| HALF_OPEN       |
              trial fails: re-open    | (limited probe) |
                                      +-----------------+
```

| From | To | Trigger | Guard | Side-Effect |
|------|----|---------|-------|-------------|
| CLOSED | OPEN | call failure | failures ≥ threshold | start cooldown timer; fail-fast subsequent calls |
| CLOSED | CLOSED | call success | — | reset failure counter |
| OPEN | HALF_OPEN | timer expiry | cooldown elapsed | allow limited trial call |
| HALF_OPEN | CLOSED | trial success | — | reset; resume normal pass-through |
| HALF_OPEN | OPEN | trial failure | — | restart cooldown |

> **Status:** PLANNED. No code path constructs/consumes the breaker today;
> measures SM-17/18 (SV-7) are therefore not observable yet.

---

## 3. HTTP Request Lifecycle

```
  RECEIVED --> VALIDATED --> PROCESSING --> RESPONDED
     |             |             |
     |             |             +--> FAILED   (AppError thrown)
     |             |             +--> TIMED_OUT (>30s, SR-04)
     |             +--> REJECTED (Joi/sanitize/rate-limit fail)
     +--> REJECTED (malformed / body-limit)
```

| From | To | Trigger | Guard | Side-Effect |
|------|----|---------|-------|-------------|
| RECEIVED | VALIDATED | passes sanitize + Joi | SR-08, SR-10 ok | correlation ID assigned (SR-01) |
| RECEIVED | REJECTED | body-limit / malformed | SR-07 violated | 4xx AppError |
| VALIDATED | PROCESSING | routed to controller/service | — | metrics timer running (SR-03) |
| VALIDATED | REJECTED | rate limit / validation fail | SR-09/SR-10 | 429 / 400 |
| PROCESSING | RESPONDED | handler returns | — | response flushed; metrics recorded |
| PROCESSING | FAILED | exception | — | error-handler → AppError JSON (SR-12); Sentry (SR-14) |
| PROCESSING | TIMED_OUT | 30s elapsed | SR-04 | timeout response; logged |

> Note: an **authentication** state (AUTHENTICATED/UNAUTHORIZED) belongs between
> VALIDATED and PROCESSING but is **PLANNED** (SR-18/19 not wired).

---

## 4. BullMQ Job

```
  WAITING --> ACTIVE --> COMPLETED
     ^           |
     |           +--> FAILED --> RETRYING --(backoff)--> WAITING
     |                              |
     |                              +--> FAILED (attempts exhausted -> dead)
```

| From | To | Trigger | Guard | Side-Effect |
|------|----|---------|-------|-------------|
| (enqueue) | WAITING | `queue.add()` | — | job persisted in Redis (S3) |
| WAITING | ACTIVE | worker picks up | concurrency slot free | handler runs (S4) |
| ACTIVE | COMPLETED | handler resolves | — | result stored; events emitted |
| ACTIVE | FAILED | handler throws | — | error recorded; failure event |
| FAILED | RETRYING | attempts remain | attempts < max | schedule with backoff |
| RETRYING | WAITING | backoff elapsed | — | re-queued |
| FAILED | (dead) | attempts exhausted | attempts = max | moved to failed set; visible in Bull Board |

---

## 5. WorkflowExecution

```
  PENDING --> RUNNING --> COMPLETED
                 |
                 +--> FAILED
```

| From | To | Trigger | Guard | Side-Effect |
|------|----|---------|-------|-------------|
| PENDING | RUNNING | execution started | prerequisites met | status persisted; steps dispatched |
| RUNNING | COMPLETED | all steps succeed | — | final state recorded |
| RUNNING | FAILED | a step errors | no recoverable retry | failure recorded; (audit PLANNED, SR-21) |

---

## 6. WebhookDelivery

```
  PENDING --> DELIVERED
     |
     +--> FAILED --> RETRY --(backoff)--> PENDING
                       |
                       +--> FAILED (max attempts -> abandoned)
```

| From | To | Trigger | Guard | Side-Effect |
|------|----|---------|-------|-------------|
| (create) | PENDING | delivery queued | — | payload + target persisted |
| PENDING | DELIVERED | 2xx from target | — | mark delivered; record timestamp |
| PENDING | FAILED | non-2xx / network error | — | record error |
| FAILED | RETRY | attempts remain | attempts < max | schedule backoff |
| RETRY | PENDING | backoff elapsed | — | re-attempt |
| FAILED | (abandoned) | attempts exhausted | attempts = max | stop; flag for review |

> When SR-23 (circuit-breaker/retry) is activated (Phase 4), webhook + provider
> retries will route through the breaker in §2.

---

## 7. State-Machine Summary

| Machine | States | Live? | Notes |
|---------|--------|-------|-------|
| Circuit Breaker | CLOSED, OPEN, HALF_OPEN | **No (PLANNED)** | `circuit-breaker.ts` unused |
| Request Lifecycle | RECEIVED, VALIDATED, PROCESSING, RESPONDED, FAILED, TIMED_OUT, REJECTED | Yes | auth state PLANNED |
| BullMQ Job | WAITING, ACTIVE, COMPLETED, FAILED, RETRYING | Yes | Redis-backed |
| WorkflowExecution | PENDING, RUNNING, COMPLETED, FAILED | Yes | audit on fail PLANNED |
| WebhookDelivery | PENDING, DELIVERED, FAILED, RETRY | Yes | breaker integration PLANNED |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SV-10a | Rules (SR-04/12/23) that gate these transitions |
| SV-10c | Event traces showing these machines exchanging messages |
| SV-7 | Measures fed by states (SM-08 queue depth, SM-17 breaker trips) |
| SV-8 | Phase 4 activation of the circuit breaker |
| OV-6b | Operational/business state machines (this is the system counterpart) |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
