# SV-1: Systems Interface Description

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-1 identifies the **systems and subsystems** that compose the Purple Cross
veterinary practice management platform and the **interfaces** between them. It
is the structural anchor of the Systems Viewpoint: SV-2 adds the resource flows
that traverse these interfaces, SV-3 cross-tabulates which systems touch which,
and SV-4 decomposes the functions hosted inside the Express API system. The
systems named here (S1–S5 plus external systems) are reused verbatim across the
rest of the SV series.

> ⚠️ **Honesty note.** This view is grounded in the current codebase
> (`backend/src/app.ts`, `docker-compose.yml`, the 37 route modules). It is
> honest about gaps: the `authenticate` middleware **is** wired as a global
> guard in `app.ts`, but route-level **RBAC is largely unenforced**,
> **tenantId columns exist but are not scoped** in queries, **field-level
> encryption is applied to 0 fields** (PHI/PII at rest is plaintext), the
> **frontend `ProtectedRoute` hardcodes `isAuthenticated = true`**, and the
> **circuit-breaker / retry utilities exist but are unused (dead code)**. The
> **Payment Provider** integration is aspirational. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. System Interface Diagram

```
                       PURPLE CROSS — SYSTEMS INTERFACE DESCRIPTION (SV-1)
+--------------------------------------------------------------------------------------------+
|                                  EXTERNAL SYSTEMS                                            |
|  +-----------+   +-----------+   +------------------+   +-------------+   +--------------+   |
|  | SendGrid  |   | Twilio    |   | Payment Provider |   | External Lab|   | Sentry       |   |
|  | (X1 Email)|   | (X2 SMS)  |   | (X3, PLANNED)    |   | (X4)        |   | (X5 errors)  |   |
|  +-----+-----+   +-----+-----+   +--------+---------+   +------+------+   +------+-------+   |
+--------|---------------|------------------|-------------------|-----------------|-----------+
         | HTTPS/REST    | HTTPS/REST       | HTTPS/REST        | HTTPS/REST      | HTTPS
         v               v                  v                   v                 v
+--------------------------------------------------------------------------------------------+
|                                                                                             |
|   +--------------+        I1: HTTPS / REST (/api/v1, JSON)        +----------------------+  |
|   | S1 React/Vite| <===========================================> | S2 Express API Server|  |
|   | SPA (browser)|     (nginx reverse proxy in prod, :80/:443)   |  Node 20 / TypeScript|  |
|   +--------------+                                                |  route→controller→   |  |
|                                                                   |  service→Prisma +    |  |
|                                                                   |  middleware stack    |  |
|                                                                   +----+----------+------+  |
|                                                                        |          |         |
|                                              I2: TCP 5432 /            |          | I3: TCP  |
|                                              Prisma (SQL, TLS)         |          | 6379 /   |
|                                                                        v          | RESP     |
|                                                          +-------------------+    v          |
|                                                          | S3 PostgreSQL 15  | +-----------+ |
|                                                          | (system of record)| | S4 Redis 7| |
|                                                          +---------+---------+ | cache +   | |
|                                                                    ^           | BullMQ    | |
|                                              I4: TCP 5432 /        |           +-----+-----+ |
|                                              Prisma (SQL)          |                 ^       |
|                                                          +---------+---------+       |       |
|                                                          | S5 Worker / Job   |<------+       |
|                                                          | Processor (BullMQ)| I5: TCP 6379  |
|                                                          +-------------------+ (job consume) |
+--------------------------------------------------------------------------------------------+
```

> In production a **nginx** reverse proxy terminates TLS on :80/:443 and fronts
> S1 (static SPA bundle) and S2 (`/api/v1`, `/health`, `/api-docs`). In
> development the Vite dev server (:5173) proxies to the API (:3000).

---

## 3. Systems Catalog

| System ID | System | Type | Runtime / Image | Listens / Port | Description |
|-----------|--------|------|-----------------|----------------|-------------|
| **S1** | React/Vite SPA | Client subsystem | Browser; Vite build, served by nginx (prod) / Vite (:5173 dev) | n/a (browser) | TanStack Query + React Router 6 single-page app; consumes `/api/v1` over HTTPS |
| **S2** | Express API Server | Application subsystem | Node 20, TypeScript, `express` (`backend/`) | TCP **3000** | Layered route→controller→service→Prisma tier plus the cross-cutting middleware stack; hosts all 37 module functions, health, metrics, swagger, Bull Board |
| **S3** | PostgreSQL 15 | Data subsystem | `postgres:15` | TCP **5432** | Relational system of record; accessed exclusively via Prisma ORM |
| **S4** | Redis 7 | Cache / queue subsystem | `redis:7` | TCP **6379** | Response/data cache (`cache.service`) and BullMQ job broker |
| **S5** | Worker / Job Processor | Async subsystem | Node 20 (same image as S2, worker entrypoint) | n/a (consumer) | BullMQ workers: webhook delivery, workflow execution, scheduled reminders; consumes from S4, writes to S3 |
| **X1** | SendGrid | External system | SaaS | HTTPS 443 | Transactional email (reminders, receipts) |
| **X2** | Twilio | External system | SaaS | HTTPS 443 | SMS (reminders, alerts) |
| **X3** | Payment Provider | External system (**PLANNED**) | SaaS | HTTPS 443 | Charge / refund processing — no SDK wired yet |
| **X4** | External Lab | External system | SaaS / interchange | HTTPS 443 | Reference-lab diagnostics order/result interchange |
| **X5** | Sentry | External system (optional) | SaaS | HTTPS 443 | Error/exception telemetry; enabled via `SENTRY_DSN` |

---

## 4. Subsystem Decomposition of S2 (Express API Server)

The API server is a single deployable process composed of internal subsystems
that align with the middleware stack and layered architecture:

```
S2 Express API Server
|
+-- S2.1 Middleware Pipeline (request ingress)
|     correlation-id → request-context (AsyncLocalStorage) → metrics → timeout(30s)
|     → helmet → cors → body-parse → sanitization → compression → morgan
|     → [public: /health, /metrics(admin), /admin/queues(admin)] → rate-limiter
|     → [/api/v1/auth, /api/v1/client-portal] → authenticate (global guard)
|     → module routes → notFound → Sentry error handler → error-handler
|
+-- S2.2 Routing & Controller Layer  (routes/*.routes.ts, controllers/*.controller.ts)
|     Joi validate() / validateQuery() / validateParams() per route
|
+-- S2.3 Service Layer               (services/*.service.ts — business logic)
|
+-- S2.4 Data Access (Prisma Client) (→ S3 PostgreSQL)
|
+-- S2.5 Cache & Queue Adapters      (cache.service → S4; BullMQ producers → S4)
|
+-- S2.6 Integration Adapters        (communications → X1/X2; webhook-delivery → tenant URLs)
|
+-- S2.7 Observability               (Winston JSON logs → logs/*.log; Sentry → X5; /metrics in-memory)
```

---

## 5. Interface Catalog

| IF ID | Endpoints (Source ⇄ Dest) | Protocol / Transport | Port | Payload Format | Security | Status |
|-------|---------------------------|----------------------|------|----------------|----------|--------|
| **I1** | S1 SPA ⇄ S2 API | HTTPS / REST (`/api/v1`) | 443 (prod via nginx) / 3000 dev | JSON | TLS in transit; `Authorization: Bearer <JWT>`; CORS allow-listed; Helmet headers. **RBAC unenforced at route level (PLANNED)** | LIVE (auth verify wired; authz partial) |
| **I2** | S2 API ⇄ S3 PostgreSQL | TCP / Prisma (PG wire protocol) | 5432 | SQL / row sets | TLS-capable; credentials via `DATABASE_URL`. **No field-level encryption (PHI/PII plaintext)** | LIVE |
| **I3** | S2 API ⇄ S4 Redis | TCP / RESP | 6379 | RESP (cache values, job payloads JSON) | Network-isolated; AUTH via `REDIS_URL` if set | LIVE |
| **I4** | S5 Worker ⇄ S3 PostgreSQL | TCP / Prisma | 5432 | SQL / row sets | Same as I2 | LIVE |
| **I5** | S5 Worker ⇄ S4 Redis | TCP / RESP (BullMQ consume) | 6379 | RESP / JSON job data | Same as I3 | LIVE |
| **I6** | S2 API → X1 SendGrid | HTTPS / REST | 443 | JSON | TLS; API key | PARTIAL |
| **I7** | S2 API → X2 Twilio | HTTPS / REST | 443 | JSON / form | TLS; account SID + token | PARTIAL |
| **I8** | S2 API ⇄ X3 Payment Provider | HTTPS / REST | 443 | JSON | TLS; provider key | **PLANNED** |
| **I9** | S2 API ⇄ X4 External Lab | HTTPS / REST | 443 | JSON / HL7-ish | TLS; lab credentials | PLANNED |
| **I10** | S2/S5 → X5 Sentry | HTTPS | 443 | JSON envelope | TLS; `SENTRY_DSN` | OPTIONAL |
| **I11** | S2 API → tenant Webhook URLs | HTTPS / REST | 443 | JSON (signed) | TLS; HMAC signature; delivered via S5 | PARTIAL |
| **I12** | Operator/browser → S2 `/api-docs`, `/health`, `/metrics`, `/admin/queues` | HTTPS / REST | 443/3000 | HTML / JSON | `/health` public; `/metrics` & `/admin/queues` guarded by `authenticate`+ADMIN in `app.ts` (RBAC enforcement weak — treat as **PARTIAL**) | LIVE |

---

## 6. Interface Standards

| Concern | Standard / Mechanism | Location |
|---------|----------------------|----------|
| API contract | OpenAPI 3.0.3 via `swagger-jsdoc`; served at `/api-docs` and `/api-docs.json` | `backend/src/config/swagger.ts` |
| Request validation | Joi (`validate`, `validateQuery`, `validateParams`) | `backend/src/middleware/validation.ts` |
| Tracing | Correlation ID (`X-Correlation-ID`) + AsyncLocalStorage request context | `middleware/correlation-id.ts`, `context/request-context.ts` |
| Security headers | Helmet defaults | `app.ts` |
| Cross-origin | CORS allow-list via `CORS_ORIGIN` | `app.ts` |
| Auth token | JWT (HS256), 7-day default expiry; verified by `authenticate` | `middleware/auth.ts`, `utils/jwt.ts` |
| Health probes | `/health`, `/health/live`, `/health/ready` (checks S3+S4), `/health/detailed` | `routes/health.routes.ts` |
| Metrics | In-memory JSON at `/metrics` (**NOT** Prometheus format) | `routes/metrics.routes.ts` |

---

## 7. Deployment / Physical View

```
docker-compose.yml
  ┌─────────────────────────────────────────────────────────────┐
  │ nginx (prod) :80/:443  ── TLS term, proxies SPA + /api/v1    │
  │   ├── frontend  :5173 (dev) / static bundle (prod)   → S1    │
  │   └── backend   :3000                                 → S2    │
  │        ├── postgres :5432                             → S3    │
  │        ├── redis    :6379                             → S4    │
  │        └── worker (backend image, worker entry)      → S5    │
  └─────────────────────────────────────────────────────────────┘
```

---

## 8. Honesty & Gap Notes

| Interface / System Aspect | Reality | Status |
|---------------------------|---------|--------|
| I1 authentication | `authenticate` verifies JWT and is mounted as a global `/api/v1` guard | LIVE |
| I1 authorization (RBAC) | `authorize()` exists but applied to few routes; roles largely unenforced | PLANNED |
| I1 frontend gate | `ProtectedRoute` hardcodes `isAuthenticated = true` | GAP |
| I2 at-rest encryption | `field-crypto` util exists; applied to **0** fields | PLANNED |
| Multi-tenant isolation | `tenantId` columns exist; queries not scoped by tenant | PLANNED |
| Audit trail | `AuditLog` written by ~7 of 34 services | PARTIAL |
| Resilience (circuit breaker/retry) | `circuit-breaker.ts` / `retry.ts` exist but **unused** | DEAD CODE |
| I8 Payment Provider | No SDK present; payments recorded manually | PLANNED |
| `/metrics`, `/admin/queues` | Guarded in `app.ts` but RBAC weak; effectively low-assurance | PARTIAL |

---

## 9. Cross-References

| Related View | Relationship |
|--------------|--------------|
| AV-1 | System context and scope this view structures |
| SV-2 | Resource flows traversing interfaces I1–I12 |
| SV-3 | Systems-Systems matrix (which Sx interfaces with which) |
| SV-4 | Functional decomposition of S2 (system functions SF-x) |
| SV-5a / SV-5b | Activity → function / activity → system traceability |
| SV-6 | Endpoint-level resource flow matrix |
| OV-2 | Operational resource flows realized by these systems |
| SvcV-1 / SvcV-2 | Service context / resource flows hosted on S2 |
| DIV-3 | Physical data model behind S3 |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
