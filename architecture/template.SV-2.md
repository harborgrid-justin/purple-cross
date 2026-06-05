# SV-2: Systems Resource Flow Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-2-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-2 describes the **resource flows** (data and control) that traverse the
interfaces identified in [SV-1](template.SV-1.md). Where SV-1 names the systems
(S1–S5, X1–X5) and interfaces (I1–I12), SV-2 details **what moves** across each
interface: protocol, port, payload format, direction, triggering condition, and
the security applied (or not applied) to the resource in transit and at rest.
SV-3 then tabulates the system-to-system adjacency, and SV-6 drills into the
endpoint-level exchanges.

> ⚠️ **Honesty note.** Grounded in `backend/src/app.ts`, `docker-compose.yml`,
> the cache/queue services, and the 37 route modules. Flows that are aspirational
> (Payment Provider charges, External Lab interchange) or partially implemented
> (webhook delivery, SendGrid/Twilio sends) are flagged. **TLS is applied in
> transit; field-level encryption is applied to 0 fields, so PHI/PII rest
> plaintext in S3.** `tenantId` columns exist but flows are **not tenant-scoped**.
> See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Resource Flow Diagram

```
                  PURPLE CROSS — SYSTEMS RESOURCE FLOW DESCRIPTION (SV-2)
+--------------------------------------------------------------------------------------------+
|  S1 React/Vite SPA (browser)                                                                |
|        |  RF-01  HTTPS/REST JSON  (Bearer JWT)   ^  RF-02  HTTPS JSON (200/4xx/5xx)         |
|        v   /api/v1/*  :443(prod nginx)/:3000(dev) |  result sets / error envelope           |
|  +-----------------------------------------------------------------------------------+      |
|  |                         S2 Express API Server (Node 20 / TS)                       |      |
|  |   ingress: correlation-id → request-context → metrics → timeout(30s) → helmet     |      |
|  |   → cors → body-parse → sanitization → compression → morgan → rate-limiter        |      |
|  |   → authenticate(global) → routes → error-handler                                 |      |
|  +----+--------------------+----------------------+-----------------------+----------+      |
|       | RF-03 TCP/Prisma    | RF-05 TCP/RESP       | RF-07 HTTPS/REST       | RF-10 HTTPS    |
|       | :5432 SQL           | :6379 cache+jobs     | :443 JSON (email/SMS)  | :443 Sentry    |
|       v                     v                      v                        v                |
|  +----------+        +-------------+        +-------------------------+   +-----------+      |
|  | S3 PG 15 |<------->| S4 Redis 7  |        | X1 SendGrid / X2 Twilio |   | X5 Sentry |      |
|  | (record) | RF-04  | cache+BullMQ|        | X3 Payment(PLANNED)     |   +-----------+      |
|  +----+-----+        +------+------+        | X4 Ext Lab (PLANNED)    |                      |
|       ^ RF-06 SQL           ^ RF-08 consume +-------------------------+                      |
|       |                     |  jobs (RESP/JSON)        ^ RF-09 HTTPS signed webhook          |
|  +----+---------------------+----+                     |  (to tenant URLs)                   |
|  |   S5 Worker / Job Processor    |---------------------+                                    |
|  |   (BullMQ consumers, Node 20)  |                                                          |
|  +--------------------------------+                                                          |
+--------------------------------------------------------------------------------------------+
```

---

## 3. Resource Flow Catalog

| RF ID | Source → Dest | Interface (SV-1) | Protocol / Transport | Port | Payload / Format | Direction | Security (transit / rest) | Status |
|-------|---------------|------------------|----------------------|------|------------------|-----------|---------------------------|--------|
| **RF-01** | S1 SPA → S2 API | I1 | HTTPS / REST (`/api/v1`) | 443 (prod) / 3000 (dev) | Request JSON + `Authorization: Bearer` | Request | TLS; JWT verify; CORS allow-list; Helmet; **RBAC partial (PLANNED)** | LIVE |
| **RF-02** | S2 API → S1 SPA | I1 | HTTPS / REST | 443 / 3000 | Response JSON (`{status,data}` or error envelope) | Response | TLS; correlation-id header | LIVE |
| **RF-03** | S2 API → S3 PostgreSQL | I2 | TCP / Prisma (PG wire) | 5432 | Parameterized SQL (DML/DQL) | Request | TLS-capable; `DATABASE_URL` creds; **no field encryption — PHI/PII plaintext** | LIVE |
| **RF-04** | S3 PostgreSQL → S2 API | I2 | TCP / Prisma | 5432 | Row sets / typed records | Response | Same as RF-03 | LIVE |
| **RF-05** | S2 API → S4 Redis | I3 | TCP / RESP | 6379 | Cache SET/GET (JSON values); BullMQ `add` (job JSON) | Request | Network-isolated; `REDIS_URL` AUTH if set | LIVE |
| **RF-06** | S5 Worker ⇄ S3 PostgreSQL | I4 | TCP / Prisma | 5432 | SQL (job side-effects: status writes, audit) | Bidirectional | Same as RF-03 | LIVE |
| **RF-07** | S2 API → X1 SendGrid / X2 Twilio | I6 / I7 | HTTPS / REST | 443 | JSON (email) / form (SMS) | Request | TLS; API key / SID+token | PARTIAL |
| **RF-08** | S4 Redis → S5 Worker | I5 | TCP / RESP (BullMQ consume) | 6379 | Job payload JSON (webhook, workflow, reminder) | Pull | Same as RF-05 | LIVE |
| **RF-09** | S5 Worker → X (tenant webhook URLs) | I11 | HTTPS / REST | 443 | JSON event (HMAC-signed) | Request | TLS; HMAC signature header | PARTIAL |
| **RF-10** | S2 / S5 → X5 Sentry | I10 | HTTPS | 443 | JSON error envelope | Request | TLS; `SENTRY_DSN` | OPTIONAL |
| **RF-11** | S2 API ⇄ X3 Payment Provider | I8 | HTTPS / REST | 443 | JSON charge/refund | Bidirectional | TLS; provider key | **PLANNED** |
| **RF-12** | S2 API ⇄ X4 External Lab | I9 | HTTPS / REST | 443 | JSON / HL7-ish order+result | Bidirectional | TLS; lab creds | **PLANNED** |
| **RF-13** | Operator → S2 `/health`,`/metrics`,`/api-docs`,`/admin/queues` | I12 | HTTPS / REST | 443 / 3000 | JSON / HTML | Bidirectional | `/health` public; `/metrics`+`/admin/queues` `authenticate`+ADMIN (RBAC weak — **PARTIAL**) | LIVE |

---

## 4. Resource (Data Object) Inventory

The principal **resources** flowing across these interfaces map to Prisma models
and event payloads:

| Resource | Carried On | Format | Notes |
|----------|-----------|--------|-------|
| Clinical/operational entities (Patient, Client, Appointment, MedicalRecord, Prescription, Invoice, LabTest, etc.) | RF-01/02/03/04 | JSON ⇄ SQL rows | 37 modules; system of record is S3 |
| Cache entries | RF-05 | JSON-serialized values | `cache.service` keyed reads (analytics, lookups) |
| Domain events / jobs | RF-05/08 | JSON job data | `domain-events.service`, webhook-delivery, workflow-engine via BullMQ |
| Notifications (email/SMS) | RF-07 | JSON / form | reminders, receipts, alerts via `communications` |
| Webhook deliveries | RF-09 | JSON (HMAC signed) | `webhook-delivery` to tenant-registered URLs |
| Telemetry | RF-10 | JSON envelope | Sentry errors; Winston JSON logs to `logs/*.log` (PII-redacted) |
| Payments / lab results | RF-11/12 | JSON | **PLANNED** — recorded manually today |

---

## 5. Security & Quality-of-Service Annotations

| Concern | Applied | Gap |
|---------|---------|-----|
| Transit encryption (TLS) | All HTTPS flows (RF-01/02/07/09/10/11/12); PG/Redis TLS-capable | Internal PG/Redis often plaintext on isolated network |
| AuthN on RF-01 | `authenticate` global guard verifies JWT | Frontend `ProtectedRoute` hardcodes `isAuthenticated=true` (GAP) |
| AuthZ / RBAC | `authorize()` exists | Enforced on few routes (PLANNED) |
| Tenant isolation | `tenantId` columns present | Flows not scoped by tenant (PLANNED) |
| At-rest encryption | `field-crypto` util exists | Applied to **0** fields — PHI/PII plaintext (PLANNED) |
| Audit | `AuditLog` model | Written by ~7 of 34 services (PARTIAL) |
| Rate limiting | `apiRateLimiter` per-IP | LIVE |
| Timeout | 30s request timeout middleware | LIVE |
| Resilience (circuit breaker/retry on RF-07/09/11) | utilities exist | **UNUSED (dead code)** — flows not wrapped |

---

## 6. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SV-1 | Systems and interfaces these flows traverse |
| SV-3 | System-to-system adjacency derived from these flows |
| SV-4 | Functions that produce/consume each resource |
| SV-6 | Endpoint-level resource flow detail (REST exchanges) |
| OV-2 / OV-3 | Operational resource flows realized by RF-01..RF-13 |
| DIV-3 | Physical schema for resources persisted in S3 |
| SvcV-2 | Service resource flows hosted on S2 |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
