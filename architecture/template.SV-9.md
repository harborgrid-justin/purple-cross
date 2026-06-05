# SV-9: Systems Technology & Skills Forecast

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-9-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-9 documents the **current technology stack** (with versions) underpinning the
Purple Cross systems and **forecasts** the technologies and **workforce skills**
needed to deliver the SV-8 evolution roadmap. It is organized as three forecasts:
(a) a **technology baseline**, (b) an **emerging-technology** outlook tied to the
PI-1…PI-4 timeframe, and (c) a **skills** forecast highlighting the training and
hiring needed — most acutely for the **authentication / security rollout**
(Phase 3) and the **observability / SRE** rollout (Phase 4).

> ⚠️ **Honesty note.** Some forecast items (Prometheus/Grafana, OpenTelemetry,
> Kubernetes, read replicas) are **not yet present** in the codebase — they are
> targets gated by SV-8 phases, not shipped capabilities. Where a dependency
> exists but is unused (e.g., `prom-client` not wired to a scrape path), it is
> noted as such.

Systems referenced (reused across SV): **S1** Express API, **S2** PostgreSQL,
**S3** Redis, **S4** BullMQ worker, **S5** external providers.

---

## 2. Technology Baseline (Current)

### 2.1 Runtime & Backend

| Technology | Version | System | Role | Status |
|------------|---------|--------|------|--------|
| Node.js | >= 18 | S1/S4 | JS runtime | live |
| TypeScript | 5.3 | S1/S4 | Strict-typed language (zero `any`) | live |
| Express | 4.18 | S1 | HTTP framework / middleware chain | live |
| Prisma ORM | 6.18 | S1/S2 | Data access, migrations | live |
| PostgreSQL | 15 | S2 | Relational system of record | live |
| Redis | 7 | S3 | Cache, rate-limit backing, BullMQ broker | live |
| BullMQ | 5 | S4 | Async job queue | live |
| Winston | 3.11 | S1 | Structured JSON logging + PII redaction | live |
| Sentry SDK | 10 | S1 | Error / trace capture | live (env-keyed) |
| Joi | (current) | S1 | Request validation middleware | live |
| `prom-client` | (present) | S1 | Metrics primitives | **present, unwired** |

### 2.2 Frontend

| Technology | Version | Role | Status |
|------------|---------|------|--------|
| React | 18 | SPA UI library | live |
| Vite | 5 | Build / dev server | live |
| TanStack Query | 5 | Server-state fetching/caching | live |
| React Router | 6 | Client routing | live |
| Zustand | 4 | Client state | live (selective) |
| React Hook Form | 7 | Form state | live |
| Zod | 4 | Schema validation (shared form layer) | live |

### 2.3 Quality, Build & Ops

| Technology | Version | Role | Status |
|------------|---------|------|--------|
| Jest + ts-jest | 29 | Backend unit/integration tests | live (mocked DB) |
| Vitest | 1.6 | Frontend tests | live |
| Cypress | 15 | E2E (browser) | live |
| Playwright | 1.40 | E2E / cross-browser | live |
| ESLint + Prettier | (current) | Lint/format, enforces zero-`any` | live |
| Docker / docker-compose | (current) | Local orchestration (pg/redis/backend/frontend) | live |
| nginx | (current) | Production static serving / reverse proxy | live |

---

## 3. Technology Forecast (Emerging / Target)

| Tech ID | Technology | Purpose | Maturity Now | Target Phase | Trigger / Dependency |
|---------|-----------|---------|--------------|--------------|----------------------|
| FT-01 | Prometheus exporter (`prom-client` wired) | Scrapable metrics, quantiles | dep present, unwired | Phase 4 | Replaces in-memory `/metrics` JSON |
| FT-02 | Grafana | Dashboards / visualization | absent | Phase 4 | After FT-01 |
| FT-03 | OpenTelemetry | Distributed tracing (spans) | absent | Phase 4 | Complements Sentry; OTel collector |
| FT-04 | Kubernetes + Helm | Orchestration, autoscaling | compose only | Phase 4 | Replaces single-node compose |
| FT-05 | PostgreSQL read replicas | Read scaling / HA | single instance | Phase 4 (eval) | After load baselining |
| FT-06 | Alertmanager / on-call | Threshold alerting (SV-7 TH-*) | absent | Phase 4 | After FT-01/FT-02 |
| FT-07 | Testcontainers / ephemeral PG | Real-DB integration tests | absent | Phase 4 | Retires mocked-DB caveat (TD-06) |
| FT-08 | Secrets manager (Vault/KMS) | Key custody for field-crypto | env vars | Phase 3→4 | Gates at-rest encryption (TD-04) |
| FT-09 | CDN / object storage | Document & asset delivery | local/disk | Phase 4 (eval) | Document module scale |

---

## 4. Skills Forecast

| Skill ID | Skill Area | Current Coverage | Target Coverage | Gating Phase | Action |
|----------|-----------|------------------|-----------------|--------------|--------|
| SK-01 | TypeScript / Node backend | Strong | Strong | — | Maintain |
| SK-02 | React / TanStack Query frontend | Moderate | Strong | Phase 2 | Upskill for CRUD buildout |
| SK-03 | Prisma / PostgreSQL DBA | Moderate | Strong | Phase 3/4 | Migrations, indexing, replicas |
| SK-04 | DevOps: Docker → Kubernetes/Helm | Basic (compose) | Strong | Phase 4 | Training + possible hire (SRE) |
| SK-05 | Security / HIPAA-equivalent (AuthN/Z, RBAC, crypto) | **Low (gap)** | Strong | Phase 3 | **Priority training/hire** |
| SK-06 | SRE / Observability (Prometheus, OTel, alerting) | Low | Strong | Phase 4 | Training; owns SV-7 thresholds |
| SK-07 | Test engineering (real-DB, contract, load) | Moderate | Strong | Phase 4 | Retire mocked-DB practice |
| SK-08 | Integration eng. (SendGrid/Twilio/payments/lab) | Moderate | Moderate+ | Phase 4 | Resilience (circuit-breaker/retry) |

> The **highest-priority skills gap is SK-05 (security)**: authentication is not
> yet wired and PHI/PII is plaintext at rest, so the auth/security rollout
> (SV-8 Phase 3) requires dedicated training or hiring **before** public launch.

---

## 5. Technology-to-Capability Traceability

| Capability (CV-3) | Enabling Tech (current) | Enabling Tech (forecast) | Skills |
|-------------------|-------------------------|--------------------------|--------|
| Secure access (AuthN/Z) | `jwt.ts`, `auth.ts` (unused) | FT-08 secrets manager | SK-05 |
| Tenant isolation | Prisma extensions (planned) | — | SK-03, SK-05 |
| Observability | Winston, Sentry, `/metrics` JSON | FT-01/02/03/06 | SK-06 |
| Scale & HA | Express stateless, Redis | FT-04/05 | SK-04 |
| Data protection at rest | `field-crypto.ts` (unused) | FT-08 | SK-05 |
| Test confidence | Jest/Vitest (mocked) | FT-07 | SK-07 |
| Resilience | `circuit-breaker.ts`/`retry.ts` (unused) | — | SK-08 |

---

## 6. Standards Folded In (No StdV Baseline)

| Domain | Standard / Convention | Where Enforced |
|--------|-----------------------|----------------|
| API | REST under `/api/v1`, Joi-validated contracts | `routes/*`, `middleware/validation.ts` |
| Type safety | Strict TypeScript, zero `any` (ESLint) | `tsconfig`, ESLint config |
| Logging | JSON structured logs + PII redaction | `config/logger.ts`, `utils/pii-redact.ts` |
| Security headers | Helmet defaults; CORS via `CORS_ORIGIN` | `app.ts` |
| Containerization | Docker / OCI images, compose topology | `docker-compose.yml` |

> Per the architecture README, **StdV** is intentionally out of scope; standards
> coverage is folded here and into AV-2.

---

## 7. Honest Gap Summary

| Gap | Forecast Resolution | See |
|-----|---------------------|-----|
| `prom-client` present but unwired | FT-01 Prometheus exporter | SV-7, SV-8 P4 |
| No K8s (compose only) | FT-04 Kubernetes/Helm | SV-8 P4 |
| Security skills gap (SK-05) | Training / hire before Phase 3 | SV-8 P3 |
| No load-test tooling | SRE buildout (SK-06) baselines SM-03/06/09 | SV-7 |
| Key custody = env vars | FT-08 secrets manager gates crypto | SV-8 P4 |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SV-7 | Measures whose tooling (Prometheus/OTel) is forecast here |
| SV-8 | Phases that gate each forecast item (FT-*) |
| SV-10a | Rules enforced once auth/crypto tech lands |
| CV-3 | Capability phasing aligned to technology readiness |
| AV-2 | Integrated dictionary for technology terms |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
