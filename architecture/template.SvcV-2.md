# SvcV-2: Services Resource Flow Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-2 describes the **resource flows** (data/control exchanges) between Purple
Cross services and their consumers, between services and other services, and
between services and the external/consumed providers in domain **D6**. It refines
the SvcV-1 context into named flows with producer, consumer, resource payload,
protocol, and trigger. The `SVC-x` identifiers are inherited from SvcV-1; flow
identifiers (`SF-x`) are introduced here and reused by SvcV-3b and SvcV-6.

> ⚠️ **Honesty note.** All in-platform REST flows traverse the single Express
> process (S2) and are real and exercised. Outbound flows to **SendGrid (SVC-31)**
> and **Twilio (SVC-32)** are real provider calls (subject to circuit breakers).
> Outbound flows to the **Payment Provider (SVC-33)** are **aspirational** — there
> is no Stripe SDK; payments are recorded manually, so SF-21/SF-22 describe the
> *intended* contract, not a wired integration. Inbound webhook flows are real but
> **unauthenticated at the staff API**; auth (SVC-25) gates **0 routes**. PHI/PII
> in flow payloads is **plaintext** (field-crypto applied to 0 fields).

---

## 2. Flow Classes

| Class | Description | Protocol | Examples |
|-------|-------------|----------|----------|
| **C1 Consumer↔Service** | SPA / portal request-response against `/api/v1` | HTTPS REST / JSON | SF-01..03 |
| **C2 Service↔Service (in-proc)** | One service calls another via service layer | In-process call | SF-10..15 |
| **C3 Service→Event Bus** | Service emits a domain event | In-process pub/sub | SF-16..18 |
| **C4 Service↔Data/Cache** | Service reads/writes Prisma / Redis | TCP (Prisma / ioredis) | SF-30..31 |
| **C5 Service→External (outbound)** | Service calls a D6 provider | HTTPS REST / JSON | SF-19..24 |
| **C6 External→Service (inbound)** | Provider/subscriber callback into platform | HTTPS REST / JSON | SF-25..27 |
| **C7 Service→Queue / Worker** | Async job handoff to BullMQ worker (S5) | Redis (BullMQ) | SF-28..29 |

---

## 3. Services Resource Flow Diagram

```
                  PURPLE CROSS — SERVICES RESOURCE FLOWS (SvcV-2)

  CONSUMERS                 EXPRESS API (S2) — domain services            EXTERNAL (D6)
 ┌──────────┐  SF-01 REST  ┌───────────────────────────────────────┐
 │ Staff SPA│─────────────►│ SVC-07 Appointments                   │
 │  (S1)    │◄─────────────│   │ emits appointment.booked  (SF-16) │
 └──────────┘  JSON resp   │   ▼                                   │
 ┌──────────┐  SF-02 REST  │ SVC-11 Communications ───SF-19 email─►│──► SendGrid (SVC-31)
 │ Client   │─────────────►│   reminder/receipt    ───SF-20 sms───►│──► Twilio   (SVC-32)
 │ Portal   │◄─────────────│                                       │
 └──────────┘              │ SVC-13 Invoices ──SF-21 charge(PLAN)─►│··► Payment  (SVC-33)
 ┌──────────┐  SF-03 REST  │ SVC-16 Refunds  ──SF-22 refund(PLAN)─►│··► (aspirational)
 │ Webhook  │◄─SF-25 deliver SVC-26 Webhooks ◄─SF-16/17/18 events │
 │ Subs(ext)│──SF-26 cfg──►│ SVC-27 Workflows ◄──── triggers       │
 └──────────┘              │ SVC-04 Lab Tests ─SF-23 order────────►│──► External Lab (SVC-34)
                           │                  ◄SF-27 result callback│◄── (inbound)
                           │ all services ────SF-24 error──────────►│──► Sentry (SVC-35)
                           │                                       │
                           │ SVC-12 Reminders ─SF-28 enqueue──────►│ BullMQ → Worker (S5)
                           │ SVC-29 Wf Exec   ─SF-29 enqueue──────►│        │ SF-28 dispatch
                           │ SVC-30 Cache ◄─SF-31─ all svcs        │        ▼ back via SVC-11
                           └───────────────┬───────────────────────┘
                                           │ SF-30 Prisma
                                           ▼
                              ┌──────────────────────────┐
                              │ PostgreSQL (S3) · Redis(S4)│
                              └──────────────────────────┘
```

> Solid arrows = wired/real flows; dotted (`··►`) = aspirational Payment flows.
> Event flows (SF-16..18) fan in to Webhooks (SVC-26) and Workflows (SVC-27) via
> the in-process domain-events bus (SVC-38).

---

## 4. Resource Flow Catalog

| Flow ID | Producer | Consumer | Resource (payload) | Class | Protocol | Trigger | Status |
|---------|----------|----------|--------------------|-------|----------|---------|--------|
| SF-01 | Staff SPA (S1) | SVC-01..45 | Entity CRUD requests/responses | C1 | REST/JSON | User action | Real |
| SF-02 | Client Portal | SVC-06/07/10/13/15/43 | Self-service requests | C1 | REST/JSON | Pet-owner action | IN PROGRESS |
| SF-03 | Webhook subscriber | SVC-26 | Subscription config (URL, secret, events) | C1 | REST/JSON | Admin setup | Real |
| SF-10 | SVC-07 Appointments | SVC-08 Waitlist | Slot freed → promote candidate | C2 | in-proc | Cancel/no-show | Real |
| SF-11 | SVC-03 Prescriptions | SVC-19 Inventory | Medication decrement / stock check | C2 | in-proc | Rx dispensed | Real |
| SF-12 | SVC-13 Invoices | SVC-16 Refunds | Invoice ref for refund | C2 | in-proc | Refund issued | Real |
| SF-13 | SVC-13 Invoices | SVC-15 Payment Plans | Balance → installment schedule | C2 | in-proc | Plan created | Real |
| SF-14 | SVC-20 Purchase Orders | SVC-19 Inventory | Received qty → stock increment | C2 | in-proc | PO received | Real |
| SF-15 | SVC-04 Lab Tests | SVC-02 Medical Records | Result attached to record | C2 | in-proc | Result filed | Real |
| SF-16 | SVC-07 Appointments | SVC-38 Domain Events | `appointment.booked/cancelled` | C3 | in-proc pub | State change | Real |
| SF-17 | SVC-13 Invoices | SVC-38 Domain Events | `invoice.issued/paid` | C3 | in-proc pub | State change | Real |
| SF-18 | SVC-01..45 (various) | SVC-38 Domain Events | Generic domain events | C3 | in-proc pub | Entity lifecycle | Real (partial coverage) |
| SF-19 | SVC-11 Communications | SVC-31 SendGrid | Email message (reminder/receipt) | C5 | REST/JSON | Reminder/notify | Real (circuit-broken) |
| SF-20 | SVC-11 Communications | SVC-32 Twilio | SMS message | C5 | REST/JSON | Reminder/alert | Real (circuit-broken) |
| SF-21 | SVC-13 Invoices | SVC-33 Payment Provider | Charge request | C5 | REST/JSON | Payment capture | **Aspirational** |
| SF-22 | SVC-16 Refunds | SVC-33 Payment Provider | Refund request | C5 | REST/JSON | Refund settle | **Aspirational** |
| SF-23 | SVC-04 Lab Tests | SVC-34 External Lab | Test order | C5 | REST/JSON | Order placed | Real (interface) |
| SF-24 | All services | SVC-35 Sentry | Error/exception event | C5 | REST/JSON | Unhandled error | Real |
| SF-25 | SVC-26 Webhooks | Webhook subscriber | Event delivery (signed) | C6→out | REST/JSON | Domain event | Real |
| SF-26 | Webhook subscriber | SVC-26 Webhooks | Delivery ack / retry | C6 | REST/JSON | Delivery attempt | Real |
| SF-27 | SVC-34 External Lab | SVC-04 Lab Tests | Result callback | C6 | REST/JSON | Lab completes | PLANNED (no inbound auth) |
| SF-28 | SVC-12 Reminders | SVC-39 Job Queue → S5 | Reminder job | C7 | BullMQ/Redis | Schedule due | Real |
| SF-29 | SVC-29 Wf Executions | SVC-39 Job Queue → S5 | Workflow step job | C7 | BullMQ/Redis | Workflow tick | Real |
| SF-30 | All services | PostgreSQL (S3) | SQL via Prisma | C4 | Prisma/TCP | Any read/write | Real |
| SF-31 | All services | SVC-30 Cache (Redis S4) | Cache get/set/invalidate | C4 | ioredis/TCP | Read-through | Real |

---

## 5. External Provider Flows (D6 Detail)

| External Service | Inbound/Outbound | Flows | Resilience | Reality |
|------------------|------------------|-------|------------|---------|
| SendGrid (SVC-31) | Outbound | SF-19 | Circuit breaker + retry (exp backoff) | Real |
| Twilio (SVC-32) | Outbound | SF-20 | Circuit breaker + retry | Real |
| Payment Provider (SVC-33) | Outbound | SF-21, SF-22 | N/A — not wired | **Aspirational (no SDK)** |
| External Lab (SVC-34) | Out + In | SF-23, SF-27 | Outbound real; inbound callback PLANNED | Partial |
| Sentry (SVC-35) | Outbound | SF-24 | Best-effort | Real |

---

## 6. Honesty & Gap Notes

| Flow Element | Reality | Status |
|--------------|---------|--------|
| SF-21 / SF-22 Payment charge/refund | No gateway; payments/refunds recorded in DB only | Aspirational |
| SF-27 Lab result callback | No authenticated inbound endpoint yet | PLANNED |
| SF-25 Webhook delivery auth | Signed payload; subscriber side trust assumed | PARTIAL |
| SF-01/02 payload protection | PHI/PII flows in plaintext (field-crypto 0 fields) | PLANNED |
| C1 flows authorization | No auth/RBAC enforced (SVC-25 unwired) | PLANNED |
| SF-18 event coverage | Only ~part of services emit domain events | PARTIAL |
| Tenant scoping in flows | `tenantId` carried but not enforced | PLANNED |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SvcV-1 | Service catalog and consumers that anchor these flows |
| SvcV-3a | Which systems realize producer/consumer endpoints |
| SvcV-3b | Service-to-service dependencies abstracted from SF-10..18 |
| SvcV-6 | Tabular services resource flow matrix (extends `SF-x`) |
| SV-2 | Underlying systems resource flows |
| OV-2 / OV-3 | Operational resource flows these realize |
| CV-7 | Capabilities served by these flows |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
