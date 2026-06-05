# SvcV-10a: Services Rules Model

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-10a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-10a Services Rules Model** captures the **service-contract rules** that
constrain how the Purple Cross platform services behave and interoperate — the
invariants every REST API service under `/api/v1` is expected to honor
(versioning, validation order, response/error envelope shape, pagination,
idempotency, rate limiting, authentication, tenancy, webhook signing,
soft-delete). Each rule records its **scope**, **enforcement point**, and honest
**status** (Enforced / Partial / PLANNED).

> ⚠️ **Honesty note.** Several rules are **specified but not yet enforced**.
> Authentication (SvcR-08) and authorization (SvcR-09) are **PLANNED** — no JWT
> middleware is mounted on any route. Tenancy isolation (SvcR-10) is **PLANNED**
> (`tenantId` unscoped). PHI/PII-at-rest protection (SvcR-15) is **PLANNED**
> (0 encrypted fields). Audit (SvcR-13) is **Partial** (~7/34 services). These
> are intent-of-contract rules whose enforcement arrives in PI-3/PI-4 (SvcV-8).

### 1.1 Rule Identification Scheme

| Prefix | Meaning |
|--------|---------|
| `SvcR-nn` | A service-contract rule |
| Status: **Enforced** | Code actively enforces the rule today |
| Status: **Partial** | Enforced by some services / for some paths |
| Status: **PLANNED** | Specified; enforcement not yet wired |

---

## 2. Services Rules Model — Contract Rules

| Rule ID | Rule statement | Scope | Enforcement point | Status |
|---------|----------------|-------|-------------------|--------|
| SvcR-01 | All public services are exposed under the versioned base path `/api/v1/<resource>`. | All services | `app.ts` route mounting | Enforced |
| SvcR-02 | Every request body/query/params is validated by Joi **before** the controller executes. | All endpoints | `validate()/validateQuery()/validateParams()` middleware | Enforced |
| SvcR-03 | Successful responses use the envelope `{ status: "success", data, meta? }`. | All endpoints | Controllers / `ControllerHelper` | Enforced |
| SvcR-04 | Errors use `{ status:"error", error:{ code, message, correlationId } }` (AppError). | All endpoints | error-handler middleware + `AppError` | Enforced |
| SvcR-05 | Every request carries an `X-Correlation-ID`; it is logged and echoed in responses. | All endpoints | correlation-id middleware | Enforced |
| SvcR-06 | List endpoints paginate via `?page`/`?limit` with defaults from `PAGINATION` constants; `meta.total/page/limit` returned. | List endpoints | service layer + constants | Enforced |
| SvcR-07 | Mutating operations should be idempotent where a natural key/idempotency key exists (e.g., re-POST of same payment reference must not double-charge). | Payments, webhooks | service logic | Partial (PLANNED for payments) |
| SvcR-08 | All non-public services require a valid authenticated principal (JWT). | All except health/metrics/docs | auth middleware (to be mounted) | **PLANNED** |
| SvcR-09 | Authorized role (from `Staff.role`) is required for each operation (RBAC). | All mutating endpoints | RBAC middleware | **PLANNED** |
| SvcR-10 | Every query is scoped to the caller's `tenantId`; cross-tenant access is denied. | All data services | service/Prisma where-clause | **PLANNED** (unscoped) |
| SvcR-11 | Per-IP rate limiting of 100 requests / 15-minute window applies to the API. | All endpoints | `rate-limiter.ts` middleware | Enforced |
| SvcR-12 | Requests exceeding the 30-second request-timeout are aborted with a timeout error. | All endpoints | timeout middleware | Enforced |
| SvcR-13 | Mutating service operations write an `AuditLog` entry (who/what/when/correlationId). | All writes | service layer | Partial (~7/34) |
| SvcR-14 | Input is sanitized against XSS/injection before persistence. | All write endpoints | sanitization middleware | Enforced |
| SvcR-15 | PHI/PII fields are encrypted at rest via field-crypto. | patients, clients, medical-records, prescriptions | Prisma field middleware | **PLANNED** (0 fields) |
| SvcR-16 | The client portal exposes only the authenticated client's own data (isolation). | client-portal | portal auth + scoping | **PLANNED** |
| SvcR-17 | Outbound webhooks are signed with a shared secret (HMAC); inbound webhooks are signature-verified before processing. | webhooks | webhook-delivery / inbound handler | Enforced (signing); inbound verify Enforced where wired |
| SvcR-18 | Soft-deleted records (`deletedAt` set) are hidden from normal reads and list results. | All soft-deletable models | service default where-clause | Enforced |
| SvcR-19 | Server computes derived/financial values (invoice totals, balances) — never trusts client-supplied totals. | invoices, estimates, payment-plans | service layer | Enforced |
| SvcR-20 | External provider calls degrade gracefully (circuit breaker / retry) without failing the core transaction. | SendGrid/Twilio/Payment/Lab | `circuit-breaker.ts`/`retry.ts` | **PLANNED** (utils unused) |
| SvcR-21 | Domain state changes emit a domain event via `domain-events.service` for downstream consumers. | stateful resources | service layer | Enforced |
| SvcR-22 | API contracts are documented in OpenAPI 3.0.3 and kept in sync with implementation. | All endpoints | swagger-jsdoc `/api-docs` | Enforced |
| SvcR-23 | Admin/operational surfaces (Bull Board queue UI) must require authentication. | jobs admin | Bull Board mount | **PLANNED** (unauthenticated) |

---

## 3. Rule Categories Summary

| Category | Rules | Predominant status |
|----------|-------|--------------------|
| API shape / contract | SvcR-01, 03, 04, 06, 22 | Enforced |
| Validation / safety | SvcR-02, 12, 14, 19 | Enforced |
| Observability / events | SvcR-05, 21 | Enforced |
| Rate / resilience | SvcR-11, 20 | Mixed (limit on, breakers off) |
| Security / access | SvcR-08, 09, 10, 16, 23 | **PLANNED** |
| Data protection / audit | SvcR-13, 15, 18 | Mixed (soft-delete on; crypto/audit gaps) |
| Integration integrity | SvcR-07, 17 | Mixed |

---

## 4. Rule Enforcement Maturity (by phase)

| Rule(s) | Now | PI-3 | PI-4 |
|---------|:---:|:----:|:----:|
| SvcR-01..06, 11, 12, 14, 18, 19, 21, 22 | Enforced | Enforced | Enforced |
| SvcR-08, 09, 10, 16 (auth/RBAC/tenancy/portal) | PLANNED | Enforced | Enforced |
| SvcR-13, 15 (audit, PHI crypto) | Partial | Enforced | Enforced |
| SvcR-07 (idempotency) | Partial | Enforced (payments) | Enforced |
| SvcR-20, 23 (breakers, admin auth) | PLANNED | Partial | Enforced |
| SvcR-17 (webhook signing) | Enforced | Enforced | Enforced |

---

## 5. Rule Violations and Handling

| Violation | Detected by | Response |
|-----------|-------------|----------|
| Validation failure (SvcR-02) | Joi middleware | 400 with error envelope, correlationId |
| Rate limit exceeded (SvcR-11) | rate-limiter | 429 with retry hint |
| Timeout (SvcR-12) | timeout middleware | 503/timeout error envelope |
| Unauthenticated (SvcR-08) | auth middleware (PI-3) | 401 (currently **not** enforced) |
| Forbidden role (SvcR-09) | RBAC (PI-3) | 403 (currently **not** enforced) |
| Cross-tenant access (SvcR-10) | tenancy scope (PI-3) | 404/empty (currently leak risk) |
| Unsigned inbound webhook (SvcR-17) | signature check | reject 401 |

---

## 6. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-6 | Interface contracts these rules govern (envelope, validation, pagination) |
| SvcV-7 | Measures over rate-limit, error rate, webhook signing |
| SvcV-8 | Phase in which PLANNED rules become Enforced |
| SvcV-10b | State-transition rules realized per resource |
| SvcV-10c | Event traces honoring SvcR-21 (domain events) and SvcR-17 (webhooks) |
| SV-10a | Underlying systems rules model |
| OV-6a | Operational business rules these service rules implement |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
