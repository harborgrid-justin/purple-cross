# SvcV-9: Services Technology & Skills Forecast

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-9-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-9 Services Technology & Skills Forecast** identifies the technologies
that enable the Purple Cross platform services today, projects their evolution
across the program increments, and forecasts the **skills** the team needs to
build, integrate, secure, and operate those services. Scope covers the
service-enabling stack: HTTP/routing, validation, API documentation, data
access, async/jobs, outbound integration SDKs, and the observability/resilience
tooling that will harden the service tier (SvcV-7, SvcV-8).

> ⚠️ **Honesty note.** Several forecast technologies (OpenTelemetry, Prometheus,
> an API gateway, contract-testing tooling, a real Payment Provider SDK) are
> **not yet adopted**. The resilience utilities (`circuit-breaker.ts`,
> `retry.ts`) **exist but are unused**. This forecast distinguishes *current* vs
> *target* state explicitly.

---

## 2. Current Service-Enabling Technology Baseline

| Tech ID | Technology | Version (current) | Role in service tier | Status |
|---------|-----------|-------------------|----------------------|--------|
| ST-01 | Node.js | 18+ LTS | Runtime for all services | Live |
| ST-02 | Express | 4.18 | HTTP routing, middleware stack | Live |
| ST-03 | TypeScript | strict, zero-`any` | Type-safe service code | Live |
| ST-04 | Joi | current | Request validation (`validate/validateQuery/validateParams`) | Live |
| ST-05 | swagger-jsdoc | OpenAPI 3.0.3 | API docs at `/api-docs` | Live |
| ST-06 | Prisma ORM | 6.18 | Data access to PostgreSQL | Live |
| ST-07 | PostgreSQL | 15+ | Relational system of record | Live |
| ST-08 | Redis | current | Cache + BullMQ backing | Live |
| ST-09 | BullMQ | current | Async jobs (reminders, webhook retry) | Live |
| ST-10 | Axios | current | Outbound HTTP to external services | Live |
| ST-11 | SendGrid SDK | current | Email delivery | Live (keyed) |
| ST-12 | Twilio SDK | current | SMS delivery | Live (keyed) |
| ST-13 | Helmet / CORS | current | Security headers, origin control | Live |
| ST-14 | Winston | current | Structured JSON logging + correlation IDs | Live |
| ST-15 | Sentry SDK | current | Error tracking | Partial |
| ST-16 | `circuit-breaker.ts` / `retry.ts` | in-repo | Resilience for outbound calls | **Exists, UNUSED** |
| ST-17 | `/metrics` (custom) | in-memory JSON | Counters | **Not Prometheus** |
| ST-18 | JWT (jsonwebtoken) | present in deps | Token auth | **NOT wired to routes** |
| ST-19 | Payment Provider SDK | — | Charges/refunds | **Absent — aspirational** |

---

## 3. Technology Forecast (target state by phase)

| Tech ID | Technology | Current | Forecast / Target | Phase |
|---------|-----------|---------|-------------------|-------|
| FT-01 | Auth middleware (JWT verify) | JWT dep present, unwired | Mounted on all routes; refresh tokens | PI-3 |
| FT-02 | RBAC layer | none | Role checks from `Staff.role` | PI-3 |
| FT-03 | Tenancy scoping | none | `tenantId` filter in all queries | PI-3 |
| FT-04 | Field-level crypto | 0 fields | Encrypt PHI/PII columns | PI-3 |
| FT-05 | Payment Provider SDK | absent | Real charge/refund/status integration | PI-3 |
| FT-06 | OpenTelemetry tracing | none | Distributed traces (extends correlation IDs) | PI-4 |
| FT-07 | Prometheus / metrics exporter | in-memory JSON | Histograms + scrape endpoint | PI-4 |
| FT-08 | API gateway | direct Express | Gateway (auth/rate-limit/routing offload) — evaluate | PI-4 |
| FT-09 | API versioning | `/api/v1` only | `/api/v2` + deprecation policy | PI-4 |
| FT-10 | Contract testing | none | Consumer-driven contracts (e.g., Pact) in CI | PI-4 |
| FT-11 | Resilience activation | utils unused | Wire `circuit-breaker.ts`/`retry.ts` on ST-10/11/12/19 | PI-4 |
| FT-12 | Event streaming / gRPC | in-process bus | Evaluate durable event bus (Kafka/NATS) or gRPC for inter-service | PI-4+ (option) |
| FT-13 | Bull Board auth | unauthenticated | Gate admin queue UI behind auth | PI-4 |

---

## 4. Technology Adoption Roadmap

```
   PI-1 (now)        PI-2            PI-3                PI-4
   Express/Joi/      Stabilize       Auth+RBAC+tenancy   OTel + Prometheus
   Prisma/BullMQ     contracts,      field-crypto,       API gateway?, /api/v2
   SendGrid/Twilio   OpenAPI sync    Payment SDK         contract tests,
   (live)            (FE consumes)   (security cutover)  activate breakers
       |                 |                |                   |
       +--- ST-01..15 ---+--- FT-01..05 --+--- FT-06..13 -----+
       (baseline live)    (consumption)    (secure)            (hardened)
```

---

## 5. Skills Forecast

### 5.1 Current vs Required Skills

| Skill ID | Skill area | Current level | Required level | Phase of need |
|----------|-----------|---------------|----------------|---------------|
| SK-01 | REST / API design (Express, layered) | Strong | Strong | ongoing |
| SK-02 | OpenAPI 3.0.3 authoring | Moderate | Strong | PI-2 |
| SK-03 | TypeScript strict typing | Strong | Strong | ongoing |
| SK-04 | Prisma / SQL data modeling | Strong | Strong | ongoing |
| SK-05 | Integration engineering (SendGrid/Twilio/Payment/Lab) | Moderate | Strong | PI-3 |
| SK-06 | Security / OAuth / JWT / RBAC | **Gap** | Strong | PI-3 (critical) |
| SK-07 | Multi-tenancy / data isolation | **Gap** | Strong | PI-3 |
| SK-08 | Applied cryptography (field encryption, key mgmt) | **Gap** | Moderate | PI-3 |
| SK-09 | SRE / observability (OTel, Prometheus, SLOs) | **Gap** | Strong | PI-4 |
| SK-10 | Resilience patterns (circuit breaker, retry, backoff) | Moderate | Strong | PI-4 |
| SK-11 | Contract testing (Pact-style) | **Gap** | Moderate | PI-4 |
| SK-12 | Async/queue engineering (BullMQ, DLQ) | Moderate | Strong | PI-4 |
| SK-13 | API gateway / event streaming (gateway, Kafka/gRPC) | **Gap** | Moderate | PI-4+ (option) |

### 5.2 Skills Acquisition Strategy

| Strategy | Targets | Phase |
|----------|---------|-------|
| Hire / contract security engineer | SK-06, SK-07, SK-08 | PI-3 |
| SRE upskilling + tooling onboarding | SK-09, SK-10 | PI-4 |
| Internal enablement on OpenAPI/contract testing | SK-02, SK-11 | PI-2/PI-4 |
| Vendor enablement (Payment Provider) | SK-05 | PI-3 |

---

## 6. Technology Risks and Constraints

| ID | Risk / Constraint | Affected tech | Mitigation |
|----|-------------------|---------------|------------|
| TR-1 | Auth retrofit across all routes is broad | FT-01..03 | Centralized middleware; phased flags |
| TR-2 | Prometheus/OTel changes metrics shape | FT-06/07, ST-17 | Dual-run; deprecate in-memory `/metrics` |
| TR-3 | Payment vendor not selected | FT-05 | Abstract payment interface; defer SDK |
| TR-4 | Activating breakers alters error semantics | FT-11, ST-16 | Contract tests precede activation |
| TR-5 | Event-streaming/gRPC adds operational load | FT-12 | Keep optional; in-process bus suffices near-term |
| TR-6 | Security skill gap is the critical path | SK-06/07/08 | Prioritize hiring early in PI-3 |

---

## 7. Standards Alignment

| Standard | Applies to | Status |
|----------|-----------|--------|
| OpenAPI 3.0.3 | All `/api/v1` contracts (swagger-jsdoc) | Adopted |
| OAuth 2.0 / JWT (RFC 7519) | Auth (FT-01) | PLANNED (PI-3) |
| OpenTelemetry | Tracing (FT-06) | PLANNED (PI-4) |
| W3C Trace Context | Correlation/trace propagation | Partial (correlation IDs today) |
| TLS 1.2+ | All transport | Adopted |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-4 | Service functions the technology enables |
| SvcV-6 | Resource-flow contracts (Joi/OpenAPI) |
| SvcV-7 | Measures whose tooling (OTel/Prometheus) is forecast here |
| SvcV-8 | Evolution phases this technology adoption supports |
| SvcV-10a | Rules (auth, validation) realized by these technologies |
| SV-9 | Underlying systems technology & skills forecast |
| AV-2 | Integrated dictionary / standards references |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
