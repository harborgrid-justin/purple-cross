# SV-10a: Systems Rules Model

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-10a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-10a captures the **system-level rules and constraints** that govern the
Purple Cross systems — *technical* invariants enforced (or intended to be
enforced) by the platform itself, as distinct from business/operational rules in
**OV-6a**. Each rule has a stable **SR-*** identifier, a statement, a rule type,
the **enforcement point** (concrete file/middleware), and an **enforcement
status**. The rules describe how requests are processed, validated, traced,
bounded, and protected.

> ⚠️ **Honesty note.** Several security and tenancy rules are **defined but not
> yet enforced**: authentication is not wired (0 routes), RBAC is not applied,
> `tenantId` scoping is absent, audit logging covers ~7/34 services, and
> field-level encryption is applied to 0 fields. These appear below with status
> **PLANNED / PARTIAL** rather than ENFORCED. The Prisma extensions for
> soft-delete/tenant/audit/encryption are written but only soft-delete is
> consistently active.

---

## 2. Rule Categories

```
SYSTEM RULES (SV-10a)
|
+-- A. Request-Processing Rules   (correlation, context, timeout, pipeline order)
+-- B. Validation & Sanitization  (Joi validate, input sanitization)
+-- C. Resource-Bounding Rules    (rate limit, body size, request timeout)
+-- D. Data-Access Rules          (soft-delete filter, tenant scoping, audit)
+-- E. Security Rules             (authn, authz/RBAC, field encryption, headers)
+-- F. Code-Quality Rules         (strict TS zero-any, centralized constants)
+-- G. Error-Handling Rules       (AppError JSON shape, notFound, Sentry order)
```

---

## 3. Systems Rules Matrix

| Rule ID | Statement | Type | Enforcement Point (file) | Status |
|---------|-----------|------|--------------------------|--------|
| SR-01 | Every inbound request is assigned a correlation ID (`X-Correlation-ID`), tracked for its lifecycle | Request | `middleware/correlation-id.ts` | ENFORCED |
| SR-02 | A request context (correlation id, IP, UA) is opened in `AsyncLocalStorage` for the request duration | Request | `middleware/request-context.ts` | ENFORCED |
| SR-03 | Every request is timed and counted into in-memory metrics | Request | `middleware/metrics.ts` | ENFORCED |
| SR-04 | Requests exceeding the 30s timeout are terminated with a timeout response | Bounding | `middleware/timeout.ts` (default 30s) | ENFORCED |
| SR-05 | Security headers (Helmet) are applied to every response | Security | `app.ts` (`helmet()`) | ENFORCED |
| SR-06 | CORS is restricted to the configured `CORS_ORIGIN` | Security | `app.ts` (`cors`) | ENFORCED |
| SR-07 | Request bodies are size-limited (`FILE_UPLOAD.BODY_LIMIT`) | Bounding | `app.ts` (`express.json/urlencoded`) | ENFORCED |
| SR-08 | All input is sanitized (XSS/injection prevention) before reaching controllers | Validation | `middleware/sanitization.ts` | ENFORCED |
| SR-09 | Per-IP rate limit of 100 requests / 15 min applies to the API | Bounding | `middleware/rate-limiter.ts` | ENFORCED |
| SR-10 | Request payloads/params/queries are Joi-validated before controller logic runs | Validation | `middleware/validation.ts` (`validate*`) | ENFORCED |
| SR-11 | Soft-deleted records are filtered out of normal queries | Data-Access | Prisma extension (soft-delete) | ENFORCED |
| SR-12 | Errors are returned as `AppError` JSON with an error code and correlation ID | Error | `middleware/error-handler.ts` | ENFORCED |
| SR-13 | Unmatched routes return a structured 404 (notFound handler) | Error | `middleware/error-handler.ts` (`notFoundHandler`) | ENFORCED |
| SR-14 | Sentry error capture runs before the application error handler | Error | `app.ts` (Sentry init + handler order) | ENFORCED |
| SR-15 | Logs are JSON-structured with known PII fields redacted | Security | `config/logger.ts`, `utils/pii-redact.ts` | ENFORCED |
| SR-16 | Code must be strict TypeScript with zero `any` (lint-blocking) | Quality | `tsconfig`, ESLint `no-explicit-any: error` | ENFORCED |
| SR-17 | Hardcoded values/URLs/statuses come from centralized constants | Quality | `constants/index.ts` (both modules) | ENFORCED |
| SR-18 | All API routes require a valid JWT (authentication) | Security | `middleware/auth.ts` (`authenticate`) | **PLANNED** (0 routes wired) |
| SR-19 | Authorization is role-based per route (RBAC) | Security | `middleware/auth.ts` (`authorize`) | **PLANNED** (unenforced) |
| SR-20 | Every query is scoped to the caller's `tenantId` (multi-tenant isolation) | Data-Access | Prisma tenant extension | **PLANNED** (unscoped) |
| SR-21 | All mutating operations write an `AuditLog` entry | Data-Access | `utils/audit-logger.ts` | **PARTIAL** (~7/34 services) |
| SR-22 | PHI/PII fields are encrypted at rest | Security | `utils/field-crypto.ts` Prisma extension | **PLANNED** (0 fields) |
| SR-23 | External-provider calls are wrapped in circuit-breaker + retry | Resilience | `utils/circuit-breaker.ts`, `retry.ts` | **PLANNED** (utilities unused) |
| SR-24 | Health readiness reflects PostgreSQL + Redis reachability | Operational | `routes/health.routes.ts` (`/ready`,`/detailed`) | ENFORCED |
| SR-25 | `/metrics` and `/admin/queues` require ADMIN privilege | Security | `app.ts` admin guard | **PARTIAL** (ad-hoc; pending RBAC) |

---

## 4. Rule Enforcement Pipeline (Order Matters)

```
inbound request
   |
   v
[SR-01 correlation-id] -> [SR-02 request-context] -> [SR-03 metrics]
   |
   v
[SR-04 timeout 30s] -> [SR-05 helmet] -> [SR-06 cors] -> [SR-07 body-limit]
   |
   v
[SR-08 sanitization] -> [SR-09 rate-limiter 100/15min]
   |
   v
[SR-18/19 authN/authZ  *** PLANNED, NOT WIRED ***]
   |
   v
[SR-10 Joi validation] -> route -> controller -> service
   |
   v
[SR-11 soft-delete] [SR-20 tenant *PLANNED*] [SR-21 audit *PARTIAL*] [SR-22 crypto *PLANNED*]
   |
   v
Prisma -> PostgreSQL
   |
   v
[SR-12 AppError JSON] [SR-14 Sentry-before-handler] [SR-15 PII-redacted logs]
```

---

## 5. Rule Conflict / Dependency Notes

| Note ID | Description |
|---------|-------------|
| RD-01 | SR-20 (tenant scoping) **depends on** SR-18/19 (auth) — the principal must be known to scope queries. |
| RD-02 | SR-25 (admin-only metrics/queues) **depends on** SR-19 (RBAC); today's guard is ad-hoc. |
| RD-03 | SR-22 (field encryption) depends on a secrets-manager (SV-9 FT-08) before production keys. |
| RD-04 | SR-23 (resilience) must activate carefully to avoid retry storms under SR-09 limits. |
| RD-05 | SR-10 (validation) runs **after** SR-08 (sanitization) so validators see cleaned input. |

---

## 6. Honest Gap Summary

| Gap (Rule) | Risk | Retired In (SV-8) |
|------------|------|-------------------|
| SR-18/19 auth + RBAC unenforced | HIGH | Phase 3 |
| SR-20 tenant scoping absent | HIGH | Phase 3 |
| SR-22 PHI/PII plaintext | HIGH | Phase 4 |
| SR-21 audit partial (~7/34) | MEDIUM | Phase 3→4 |
| SR-23 resilience unused | MEDIUM | Phase 4 |
| SR-25 admin guard ad-hoc | LOW | Phase 3 |

---

## 7. Cross-References

| View | Relationship |
|------|--------------|
| OV-6a | Business/operational rules (this doc is the *system* counterpart) |
| SV-4 | System functions whose behavior these rules constrain |
| SV-10b | State machines (circuit breaker, request lifecycle) governed by rules |
| SV-10c | Event traces showing the SR-* pipeline in action |
| SV-8 | Roadmap that flips PLANNED rules to ENFORCED |
| SV-9 | Technology (auth, crypto, secrets) enabling enforcement |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
