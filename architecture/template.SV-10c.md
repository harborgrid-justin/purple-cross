# SV-10c: Systems Event-Trace Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-10c-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-10c provides **system-internal event traces** (sequence diagrams) showing how
the Purple Cross systems exchange messages over time to satisfy key scenarios.
These traces are the dynamic counterpart to the static interfaces in SV-1 and the
state machines in SV-10b. Four traces are documented: (1) an HTTP request through
the full middleware chain; (2) an async job via BullMQ; (3) an outbound webhook
delivery with retry; (4) a communication send via SendGrid/Twilio.

> ⚠️ **Honesty note.** The middleware chain shown is real, but the
> **authentication / authorization** step is **PLANNED (not wired)** and appears
> as a dashed, skipped step. Circuit-breaker/retry wrapping of external calls is
> **PLANNED**; today the provider call is direct.

### System Lifelines (reused across SV)

| ID | System | Notes |
|----|--------|-------|
| S1 | Express API (`backend/`) | middleware chain + controllers/services |
| S2 | PostgreSQL 15 | via Prisma 6.18 |
| S3 | Redis 7 | cache + BullMQ broker |
| S4 | BullMQ Worker (`worker.ts`) | async processing |
| S5 | External Providers | SendGrid, Twilio, Payment, Lab, Sentry |

---

## 2. Trace 1 — HTTP Request Through the Middleware Chain

```
Client    S1:correlation  S1:reqContext  S1:mw-chain     S1:route/ctrl  S1:service  S2:Postgres
  |            |               |              |                |             |            |
  |--HTTP req->|               |              |                |             |            |
  |            |--assign CID-->|              |                |             |            |
  |            |               |--open ALS--->|                |             |            |
  |            |               |   (metrics start, timeout 30s armed)        |            |
  |            |               |              |--helmet/cors/compression----->|            |
  |            |               |              |--sanitize input (SR-08)------>|            |
  |            |               |              |--rate-limit 100/15min (SR-09)>|            |
  |            |               |  - - auth/authz (SR-18/19) PLANNED: SKIPPED - - |          |
  |            |               |              |--Joi validate (SR-10)-------->|            |
  |            |               |              |                |--call------->|            |
  |            |               |              |                |             |--Prisma--->|
  |            |               |              |                |             |   query    |
  |            |               |              |                |             |<--rows-----|
  |            |               |              |                |<--result----|            |
  |            |               |              |<--JSON---------|             |            |
  |<--200 JSON-|               |              |                |             |            |
  |            |   [side-effects: Winston JSON log (PII-redacted, SR-15); metrics histogram (SM-01)] |
  |            |   [on throw: error-handler -> AppError JSON (SR-12); Sentry capture (SR-14)]        |
```

Middleware order (per `app.ts`): correlation-id → request-context (AsyncLocalStorage)
→ metrics → timeout(30s) → helmet → cors → body-parse(limit) → sanitization →
compression → morgan → rate-limiter(100/15min) → **[auth defined, NOT enforced]**
→ routes → error-handler (Sentry handler before error-handler).

| Seq | From → To | Message | Notes |
|-----|-----------|---------|-------|
| 1 | Client → S1 | HTTP request | enters chain |
| 2 | S1 → S1 | assign correlation ID | SR-01 |
| 3 | S1 → S1 | open request context (ALS) | SR-02 |
| 4 | S1 → S1 | sanitize + rate-limit + Joi | SR-08/09/10 |
| 5 | — | auth/authz | **PLANNED — skipped** |
| 6 | S1 → S2 | Prisma query (soft-delete filtered) | SR-11 |
| 7 | S2 → S1 | rows | — |
| 8 | S1 → Client | JSON response | metrics + log side-effects |

---

## 3. Trace 2 — Async Job via BullMQ

```
S1:service     S3:Redis(queue)     S4:Worker        S1/S4:service     S2:Postgres
   |                |                  |                  |                |
   |--queue.add()-->|                  |                  |                |
   |                |--job persisted-->|                  |                |
   |                |   (WAITING)      |                  |                |
   |                |<--pick up--------|  (ACTIVE)        |                |
   |                |                  |--run handler---->|                |
   |                |                  |                  |--Prisma write->|
   |                |                  |                  |<--ok-----------|
   |                |                  |<--resolve--------|                |
   |                |<--COMPLETED------|                  |                |
   |                |   (on throw: FAILED -> RETRYING w/ backoff -> WAITING)            |
```

| Seq | From → To | Message | State (SV-10b) |
|-----|-----------|---------|----------------|
| 1 | S1 → S3 | `queue.add(job)` | WAITING |
| 2 | S3 → S4 | worker picks up | ACTIVE |
| 3 | S4 → service → S2 | handler does DB work | — |
| 4 | S4 → S3 | resolve | COMPLETED |
| 5 | S4 → S3 | throw (alt) | FAILED → RETRYING |

> Bull Board at `/admin/queues` observes states (admin-guarded; SR-25 PARTIAL).

---

## 4. Trace 3 — Outbound Webhook Delivery with Retry

```
S1:service     S3:Redis(queue)    S4:Worker        S5:Webhook target
   |                |                 |                   |
   |--enqueue------>|  (PENDING)      |                   |
   |                |--deliver job--->|                   |
   |                |                 |--POST payload---->|
   |                |                 |<--2xx-------------|   => DELIVERED
   |                |                 |                   |
   |                |                 |--POST payload---->|   (alt path)
   |                |                 |<--5xx / timeout---|   => FAILED
   |                |<--reschedule----|  (RETRY, backoff) |
   |                |--deliver (retry)->|                 |
   |                |                 |  ...attempts < max -> PENDING again  |
   |                |                 |  ...attempts = max -> ABANDONED      |
```

| Seq | From → To | Message | State (SV-10b §6) |
|-----|-----------|---------|-------------------|
| 1 | S1 → S3 | enqueue delivery | PENDING |
| 2 | S4 → S5 | POST payload | — |
| 3 | S5 → S4 | 2xx | DELIVERED |
| 4 | S5 → S4 | 5xx/timeout | FAILED → RETRY |
| 5 | S4 → S3 | backoff reschedule | PENDING |

> When SR-23 activates (Phase 4), step 2 routes through the circuit breaker
> (SV-10b §2); today the POST is direct.

---

## 5. Trace 4 — Communication Send via SendGrid / Twilio

```
Client   S1:ctrl/service   S3:Redis(queue)   S4:Worker   S5:SendGrid/Twilio   S2:Postgres
  |           |                 |                |              |                  |
  |--send---->|                 |                |              |                  |
  |           |--validate(SR-10)|                |              |                  |
  |           |--enqueue comms->|  (WAITING)     |              |                  |
  |<--202 ----|                 |                |              |                  |
  |  accepted |                 |--deliver job-->|              |                  |
  |           |                 |                |--API call--->| (email or SMS)   |
  |           |                 |                |<--accepted---|                  |
  |           |                 |                |--update status------------------>|
  |           |                 |<--COMPLETED----|              |                  |
  |   [side-effects: Winston log (PII-redacted, SR-15); metrics (SM-19 provider latency)] |
```

| Seq | From → To | Message | Notes |
|-----|-----------|---------|-------|
| 1 | Client → S1 | send request | validated (SR-10) |
| 2 | S1 → S3 | enqueue comms job | async; returns 202 |
| 3 | S4 → S5 | provider API call | SendGrid/Twilio |
| 4 | S5 → S4 | accepted/rejected | provider response |
| 5 | S4 → S2 | persist delivery status | record outcome |

> Provider call latency is captured as SM-19 (SV-7, PLANNED baselining). Auth on
> the inbound send (step 1) is PLANNED (SR-18).

---

## 6. Trace Index

| Trace | Scenario | Primary Systems | Related State Machine (SV-10b) |
|-------|----------|-----------------|--------------------------------|
| T1 | HTTP request middleware chain | S1, S2 | Request Lifecycle |
| T2 | Async job processing | S1, S3, S4, S2 | BullMQ Job |
| T3 | Outbound webhook + retry | S1, S3, S4, S5 | WebhookDelivery |
| T4 | Communication send | S1, S3, S4, S5, S2 | BullMQ Job |

---

## 7. Cross-References

| View | Relationship |
|------|--------------|
| SV-1 | Static interfaces these traces exercise |
| SV-10a | Rules (SR-*) enforced at each step |
| SV-10b | State machines whose transitions these traces drive |
| SV-7 | Measures (SM-01/08/19) emitted as side-effects |
| OV-6c | Operational event traces (this is the system counterpart) |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
