# SV-7: Systems Measures Matrix

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-7-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

SV-7 specifies the **performance and quality measures** for the Purple Cross
systems and their functions, capturing each measure's **target** versus its
**current/baseline** value and the **measurement method** used to obtain it.
Measures here are *system-level* (latency, throughput, error rate, resource
utilization, resilience, test quality) and complement the operational measures
referenced by CV-1 outcomes and the functional decomposition in SV-4.

> ⚠️ **Honesty note.** Several measurement sources are partial today. The
> `/metrics` endpoint emits an **in-memory JSON snapshot**, not a Prometheus
> exposition (a `prom-client` dependency exists but is not wired to a scrape
> path). Test coverage is measured against a **largely mocked Prisma** layer, so
> the 70% threshold is real-as-reported but **not yet a true integration
> signal**. Circuit-breaker / retry measures are **PLANNED** because the
> utilities exist but are currently unused (see SV-10b).

The systems under measurement (lifelines reused across SV-10c):

| ID | System | Description |
|----|--------|-------------|
| S1 | Express API (`backend/`) | REST API, middleware chain, services |
| S2 | PostgreSQL 15 | Relational system of record (via Prisma 6.18) |
| S3 | Redis 7 | Cache, rate-limit backing, BullMQ broker |
| S4 | BullMQ Worker | Async job processing (`worker.ts`) |
| S5 | External Providers | SendGrid, Twilio, Payment (aspirational), Lab, Sentry |

---

## 2. Measurement Architecture

```
+--------------------------------------------------------------------------+
|                       MEASUREMENT / OBSERVABILITY PLANE                   |
+--------------------------------------------------------------------------+
|                                                                          |
|   [S1 Express]---metricsMiddleware---> in-memory counters/histograms     |
|        |                                     |                           |
|        |                                     v                           |
|        |                              GET /metrics (JSON)                |
|        |                                                                 |
|        +---Winston JSON logs (PII-redacted) --> logs/*.log               |
|        |                                                                 |
|        +---Sentry SDK (errors, traces) -------> Sentry (S5)              |
|        |                                                                 |
|        +---GET /health/detailed ---> PG (S2) + Redis (S3) probes         |
|                                                                          |
|   [S4 Worker]---BullMQ events---> queue depth / job latency (Redis)      |
+--------------------------------------------------------------------------+
        Honest gap: /metrics is JSON, not Prometheus (PLANNED exporter).
```

---

## 3. Systems Measures Matrix

| Measure ID | System Fn (SV-4) | System | Metric | Unit | Target | Current / Baseline | Method / Source | Status |
|------------|------------------|--------|--------|------|--------|--------------------|-----------------|--------|
| SM-01 | SF-API-REQ | S1 | API response time (p95) | ms | < 300 | ~180–320 (dev, unverified at scale) | `/metrics` histograms | IN PROGRESS |
| SM-02 | SF-API-REQ | S1 | API response time (p99) | ms | < 800 | not yet baselined | `/metrics` histograms | PLANNED |
| SM-03 | SF-API-REQ | S1 | Throughput | req/s | 500+ per tenant | not load-tested | `/metrics` + load test | PLANNED |
| SM-04 | SF-API-REQ | S1 | Error rate (5xx) | % | < 0.5 | low (dev) | `/metrics` + Sentry | IN PROGRESS |
| SM-05 | SF-PLATFORM | S1 | Uptime / availability | % | 99.9 | not measured (no prod) | uptime monitor on `/health` | PLANNED |
| SM-06 | SF-DATA | S2 | DB query time (p95) | ms | < 100 | unbaselined | Prisma logs + `/health/detailed` | PLANNED |
| SM-07 | SF-CACHE | S3 | Cache hit ratio | % | > 80 | not measured | Redis INFO / app counters | PLANNED |
| SM-08 | SF-ASYNC | S4 | Job queue depth | jobs | < 1000 steady | n/a (dev) | BullMQ / Bull Board | IN PROGRESS |
| SM-09 | SF-ASYNC | S4 | Job processing latency (p95) | s | < 30 | unbaselined | BullMQ job timestamps | PLANNED |
| SM-10 | SF-ASYNC | S4 | Job failure / retry rate | % | < 2 | unbaselined | BullMQ event counts | PLANNED |
| SM-11 | SF-PLATFORM | S1 | Process memory (RSS) | MB | < 512 / instance | ~150–300 (dev) | `/health/detailed`, `process` | IN PROGRESS |
| SM-12 | SF-PLATFORM | S1 | CPU utilization | % | < 70 sustained | low (dev) | host metrics | PLANNED |
| SM-13 | SF-QUALITY | S1 | Test coverage (lines) | % | >= 70 | ~70 (mocked Prisma) | Jest `--coverage` | IN PROGRESS |
| SM-14 | SF-QUALITY | S1 | Test coverage (branches) | % | >= 70 | ~70 (mocked Prisma) | Jest `--coverage` | IN PROGRESS |
| SM-15 | SF-SECURITY | S1 | Rate-limit window | req / 15 min | 100 default | 100 (per IP) | `rate-limiter.ts` config | DONE |
| SM-16 | SF-API-REQ | S1 | Request timeout | s | 30 | 30 (enforced) | `timeout.ts` middleware | DONE |
| SM-17 | SF-RESILIENCE | S1 | Circuit-breaker trip rate | trips/hr | observable | n/a (utility unused) | `circuit-breaker.ts` | PLANNED |
| SM-18 | SF-RESILIENCE | S1 | Retry success-after-backoff | % | > 90 | n/a (utility unused) | `retry.ts` | PLANNED |
| SM-19 | SF-DATA | S5 | External provider call latency | ms | < 1500 | unbaselined | Sentry spans / Winston | PLANNED |
| SM-20 | SF-SECURITY | S1 | PII-redaction coverage in logs | % | 100 | enforced for known fields | Winston format | IN PROGRESS |

---

## 4. Measure Definitions and Notes

| Measure ID | Definition / Computation | Caveat |
|------------|--------------------------|--------|
| SM-01/02 | Latency from request received to response flushed, per route bucket | `/metrics` is JSON; no histogram quantile backend yet |
| SM-03 | Sustained successful requests per second per tenant | tenant scoping unenforced (see SV-10a SR-09) |
| SM-04 | 5xx responses ÷ total responses over window | Sentry captures stack + correlation ID |
| SM-05 | (uptime ÷ scheduled time) on `/health` liveness | requires external probe + prod deploy |
| SM-06 | Prisma query duration p95 across hot paths | needs Prisma `$on('query')` sampling |
| SM-07 | cache hits ÷ (hits + misses) | caching layer is selective today |
| SM-08–10 | BullMQ queue gauges and per-job durations | Bull Board at `/admin/queues` (now admin-guarded) |
| SM-13/14 | Jest coverage threshold (70% B/F/L/S) | **mocked DB** inflates confidence; real-DB tests PLANNED (Phase 4) |
| SM-15/16 | Static config constants, enforced in middleware | deterministic, verifiable from code |
| SM-17/18 | Resilience measures | **dead code today**; activate in Phase 4 |

---

## 5. Measurement Methods (Source Catalog)

| Method | Endpoint / File | Emits | Maturity |
|--------|-----------------|-------|----------|
| Metrics middleware | `backend/src/middleware/metrics.ts`, `GET /metrics` | counters, latency histograms (JSON) | in-memory, single-instance |
| Health checks | `GET /health`, `/live`, `/ready`, `/detailed` | liveness, PG+Redis readiness, resource detail | live |
| Structured logging | Winston (`config/logger.ts`), `logs/*.log` | JSON logs + correlation ID, PII redaction | live |
| Error/APM | Sentry (`config/sentry.ts`) | exceptions, traces, breadcrumbs | live (keyed by env) |
| Queue dashboard | Bull Board, `GET /admin/queues` | queue/job state | live (admin-guarded) |

---

## 6. Targets, Thresholds, and Alerting (PLANNED)

| Threshold ID | Measure | Warn | Critical | Action |
|--------------|---------|------|----------|--------|
| TH-01 | SM-01 p95 latency | > 300 ms | > 800 ms | scale API / investigate slow query |
| TH-02 | SM-04 error rate | > 0.5% | > 2% | page on-call; inspect Sentry |
| TH-03 | SM-05 uptime | < 99.9% | < 99.5% | incident response |
| TH-04 | SM-08 queue depth | > 1000 | > 5000 | scale workers |
| TH-05 | SM-13 coverage | < 70% | < 60% | block merge (CI gate) |

> Alerting is **PLANNED** and depends on the Prometheus/Grafana + OpenTelemetry
> rollout described in SV-8 (Phase 4) and SV-9 (technology forecast).

---

## 7. Honest Gap Summary

| Gap | Impact on Measurement | Resolution (see) |
|-----|-----------------------|------------------|
| `/metrics` JSON, not Prometheus | no scraping, no historical quantiles | SV-8 Phase 4, SV-9 |
| In-memory counters | metrics reset per instance/restart | SV-8 Phase 4 |
| Mocked-DB tests | coverage % overstates confidence | SV-8 Phase 4 |
| Circuit-breaker/retry unused | SM-17/18 not measurable | SV-10b, SV-8 Phase 4 |
| No load testing yet | SM-03/06/09 unbaselined | SV-9 SRE skills |
| Tenant scoping unenforced | per-tenant measures approximate | SV-10a SR-09 |

---

## 8. Cross-References

| View | Relationship |
|------|--------------|
| SV-4 | System functions (SF-*) that each measure scores |
| SV-1 | Interfaces whose throughput/latency are measured |
| SV-8 | Evolution that retires the measurement gaps above |
| SV-9 | Technology/skills enabling Prometheus/OTel/load testing |
| SV-10b | State machines whose transitions feed SM-08/17 |
| CV-3 | Capability phasing that gates measurement maturity |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
