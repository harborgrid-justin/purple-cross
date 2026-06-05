# SvcV-7: Services Measures Matrix

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-7-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

The **SvcV-7 Services Measures Matrix** specifies the service-level **measures of
performance** (SLA/SLO-style) for the Purple Cross platform services — the REST
API services under `/api/v1`, the shared platform services (cache,
domain-events, webhook delivery, workflow engine, job queue), and the consumed
external services (SendGrid, Twilio, Payment Provider, External Lab, Sentry).

Each measure records a **target**, the **current/baseline** value, and the
**measurement method**. Measurement today is intentionally modest: the `/metrics`
endpoint emits **in-memory JSON counters** (not Prometheus), `/health` provides
liveness/readiness, Winston provides structured logs, and Sentry captures
errors. There is **no per-service SLO monitoring or alerting** yet — most
"current" values are baselines/estimates, not enforced SLOs.

> ⚠️ **Honesty note.** The measures below are the **intended** targets and the
> **observable** baselines. Until per-service histograms and SLO alerting are in
> place (Phase 4, see SvcV-8), "current" values are best-effort estimates derived
> from `/metrics` aggregate counters and ad-hoc load testing, not contractually
> monitored SLOs.

### 1.1 Measure Identification Scheme

| Prefix | Meaning | Example |
|--------|---------|---------|
| `SM-Pnn` | Performance measure (latency/throughput) | SM-P01 p95 latency |
| `SM-Ann` | Availability measure | SM-A01 API uptime |
| `SM-Enn` | Error/quality measure | SM-E01 error rate |
| `SM-Xnn` | External-service measure | SM-X01 SendGrid success |
| `SM-Jnn` | Async/job/webhook measure | SM-J01 job latency |

---

## 2. Measurement Infrastructure (current)

| Mechanism | Endpoint / Tool | Emits | Limitation |
|-----------|-----------------|-------|------------|
| Metrics | `GET /metrics` | In-memory JSON counters (request count, status classes, durations) | **Not Prometheus**; resets on restart; no histograms per route |
| Health | `GET /health`, `/health/live`, `/health/ready`, `/health/detailed` | Liveness/readiness, dependency checks | No historical retention |
| Structured logs | Winston (JSON) + `X-Correlation-ID` | Per-request logs with correlation IDs | No log-based SLO aggregation wired |
| Error tracking | Sentry SDK | Unhandled error events | PARTIAL init; not all paths instrumented |
| Job dashboard | Bull Board `/admin/queues` | Queue depth, job state | **Unauthenticated** (gap); manual inspection only |

---

## 3. Services Measures Matrix — Platform-Wide API Measures

| Measure ID | Service / Scope | Metric | Target (SLO) | Current / Baseline | Measurement Method |
|------------|-----------------|--------|--------------|--------------------|--------------------|
| SM-A01 | All `/api/v1` services | Availability (uptime) | 99.9% | Not measured (no uptime monitor) | `/health/ready` probe (PLANNED alerting) |
| SM-P01 | All `/api/v1` services | Response time p95 | < 300 ms | ~150–250 ms (local/estimate) | `/metrics` duration counters (no per-route histogram yet) |
| SM-P02 | All `/api/v1` services | Response time p99 | < 800 ms | Not measured | PLANNED (histogram) |
| SM-E01 | All `/api/v1` services | Error rate (5xx / total) | < 0.5% | < 1% (estimate) | `/metrics` status-class counters |
| SM-E02 | All `/api/v1` services | Validation-reject rate (4xx) | informational | tracked | `/metrics` + Joi reject logs |
| SM-T01 | All `/api/v1` services | Throughput | 500+ concurrent users/tenant | Not load-validated | ad-hoc load test (PLANNED k6) |
| SM-R01 | All `/api/v1` services | Rate limit | 100 req / 15 min / IP | Enforced (rate-limiter middleware) | `rate-limiter.ts` (per-IP, in-memory/Redis) |
| SM-C01 | Correlation coverage | % requests with correlation ID | 100% | 100% | correlation-id middleware (universal) |

---

## 4. Services Measures Matrix — Per-Service (representative)

| Measure ID | Service (SVC) | Metric | Target | Current / Baseline | Method |
|------------|---------------|--------|--------|--------------------|--------|
| SM-P10 | patients (SVC-C01) | p95 read latency | < 200 ms | ~120 ms (est) | `/metrics` |
| SM-P11 | appointments (SVC-C03) | p95 write latency (book) | < 300 ms | ~200 ms (est) | `/metrics` |
| SM-P12 | analytics (SVC-C12) | p95 dashboard latency | < 1500 ms | ~900 ms (est, heavy aggregate) | `/metrics` — cache candidate |
| SM-P13 | medical-records (SVC-C04) | p95 write latency | < 300 ms | ~180 ms (est) | `/metrics` |
| SM-P14 | invoices (SVC-C07) | p95 create latency | < 300 ms | ~220 ms (est) | `/metrics` |
| SM-A10 | client-portal (SVC-E) | availability | 99.5% | Not measured; isolation PLANNED | `/health` |
| SM-E10 | inventory (SVC-C06) | adjust-conflict rate | < 0.1% | Not measured | logs (PLANNED metric) |

> Per-service histograms do not exist yet; these rows define the **target shape**
> of SvcV-7 once OpenTelemetry/Prometheus is adopted (SvcV-8 Phase 4, SvcV-9).

---

## 5. Services Measures Matrix — External / Consumed Services

| Measure ID | External Service (SVC-X) | Metric | Target | Current / Baseline | Method |
|------------|--------------------------|--------|--------|--------------------|--------|
| SM-X01 | SendGrid (SVC-X01) | Email send success rate | ≥ 99% | Provider-reported (not aggregated locally) | SDK response + logs |
| SM-X02 | SendGrid | Email send p95 latency | < 2 s | ~1 s (est) | logs |
| SM-X03 | Twilio (SVC-X02) | SMS send success rate | ≥ 99% | Provider-reported | SDK response + logs |
| SM-X04 | Twilio | SMS send p95 latency | < 3 s | ~1.5 s (est) | logs |
| SM-X05 | Payment Provider (SVC-X03) | Charge success rate | ≥ 99.5% | **N/A — aspirational (no SDK)** | PLANNED |
| SM-X06 | External Lab (SVC-X04) | Order/result round-trip | < 24 h | **N/A — not wired (PLANNED)** | PLANNED |
| SM-X07 | Sentry (SVC-X05) | Error capture coverage | 100% paths | PARTIAL | SDK init audit |
| SM-X08 | All external | Circuit-breaker trip handling | graceful shed | **Not active — circuit-breaker.ts UNUSED** | PLANNED (Phase 4) |

---

## 6. Services Measures Matrix — Async, Webhook & Job Measures

| Measure ID | Scope | Metric | Target | Current / Baseline | Method |
|------------|-------|--------|--------|--------------------|--------|
| SM-J01 | BullMQ jobs (reminders) | Processing latency (enqueue→done) | < 60 s | ~few s (est) | Bull Board / logs |
| SM-J02 | BullMQ jobs | Job failure rate | < 1% | Not aggregated | Bull Board (unauth) |
| SM-J03 | Webhook delivery (SVC-P03) | Delivery success rate (first attempt) | ≥ 95% | Not measured | webhook-delivery logs |
| SM-J04 | Webhook delivery | Retry exhaustion rate | < 1% | Not measured | retry policy (BullMQ backoff) |
| SM-J05 | Webhook delivery | Signature-verify failures (inbound) | 0 accepted unsigned | enforced (HMAC) | webhook handler |
| SM-J06 | Workflow engine (SVC-P05) | Execution success rate | ≥ 99% | Not measured | workflow-execution records |
| SM-J07 | Cache (SVC-P01) | Hit ratio | ≥ 70% (where used) | Not measured | Redis stats (PLANNED) |

---

## 7. Measure Aggregation and Reporting Cadence (target)

| Tier | Measures | Reporting Cadence (target) | Consumer |
|------|----------|----------------------------|----------|
| Real-time | SM-A01, SM-E01, SM-X08 | live dashboard (PLANNED) | On-call / SRE |
| Daily | SM-P01, SM-J01, SM-J03 | daily rollup (PLANNED) | Platform team |
| Weekly | per-service SM-P1x, SM-X0x | weekly review | Architecture team |
| Release-gate | SM-P01, SM-E01, SM-T01 | per deploy (PLANNED contract tests) | Release manager |

---

## 8. Gaps and Honest Status

| Gap ID | Description | Affected Measures | Status |
|--------|-------------|-------------------|--------|
| M-01 | `/metrics` is in-memory JSON, not Prometheus; no per-route histograms | SM-P01..P14 | PLANNED (Phase 4) |
| M-02 | No uptime/SLO monitoring or alerting wired | SM-A01, SM-A10 | PLANNED |
| M-03 | No load testing validates throughput target | SM-T01 | PLANNED |
| M-04 | External success/latency not aggregated locally | SM-X01..X04 | IN PROGRESS |
| M-05 | Payment/External Lab measures N/A (integrations aspirational) | SM-X05, SM-X06 | ASPIRATIONAL / PLANNED |
| M-06 | Circuit breaker exists but inactive → no shed metric | SM-X08 | IN PROGRESS (Phase 4) |
| M-07 | Webhook/job success not measured; Bull Board unauthenticated | SM-J01..J06 | PLANNED |
| M-08 | Sentry coverage partial | SM-X07 | IN PROGRESS |

---

## 9. Cross-References

| View | Relationship |
|------|--------------|
| SvcV-1 | Services and external nodes these measures apply to |
| SvcV-4 | Service functions whose performance is measured |
| SvcV-6 | Resource flows (`RF-nnn`) over which measures are taken |
| SvcV-8 | Evolution that delivers the measurement infrastructure (Phase 4 SLOs) |
| SvcV-9 | Technology (OpenTelemetry, Prometheus, contract testing) enabling measures |
| SV-7 | Underlying systems measures matrix |
| OV-6 | Operational rules/timing constraints these measures serve |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
