# SvcV-7: Services Measures Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-7 Services Measures Matrix** artifact is
produced and maintained. SvcV-7 specifies service-level measures (SLA/SLO-style)
for the Purple Cross REST API services, shared platform services, and external
consumed services — each with a target, a current/baseline value, and the
measurement method. The artifact is deliberately honest: it documents that
measurement today is `/metrics` in-memory JSON counters, `/health` probes,
Winston logs, and Sentry, with **no per-service SLO monitoring yet**, and it
defines the *target shape* of measures once Phase 4 observability lands.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Metrics middleware | `../backend/src/middleware/` (metrics) + `/metrics` route | In-memory counters, status classes | Ground what is actually measured today |
| Health endpoints | `../backend/src/app.ts`, health routes | `/health[/live|/ready|/detailed]` | Ground availability measurement method |
| Rate limiter | `../backend/src/middleware/rate-limiter.ts` | 100 req / 15 min / IP | Ground SM-R01 rate-limit measure |
| Constants (time/limits) | `../backend/src/constants/index.ts` | timeouts, request-timeout (30s) | Ground latency/timeout targets |
| Resilience utils | `../backend/src/utils/circuit-breaker.ts`, `retry.ts` | Exist but unused | Honestly mark SM-X08 inactive |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Observability gaps | Mark measures PLANNED / estimate |
| AV-1 KPIs | `architecture/template.AV-1.md` | p95 < 300ms, 99.9% uptime, 500+ users | Inherit platform-wide targets |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-6 matrix | `architecture/template.SvcV-6.md` | `RF-nnn` flows | Scope measures to flows |
| SvcV-8 evolution | `architecture/template.SvcV-8.md` | Phase 4 SLO/observability plan | Align "target" with roadmap |
| SvcV-9 forecast | `architecture/template.SvcV-9.md` | OpenTelemetry/Prometheus | Name enabling technology |
| Bull Board | `/admin/queues` | Queue depth, job state | Ground job/webhook measures |

---

## Tools & Techniques

**Tools**

- Markdown table authoring for measure matrices
- Inspection of `/metrics`, `/health`, Winston config, Sentry init
- Bull Board (manual queue inspection) for async baselines
- Git for version control

**Techniques**

- SLO/SLI definition (target vs current/baseline vs method)
- Stable `SM-xnn` identifier assignment (Perf/Avail/Error/External/Job)
- Honest baseline labeling ("estimate", "not measured", "N/A — aspirational")
- Reporting-cadence tiering (real-time/daily/weekly/release-gate)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-7.md`

**Supporting outputs**

- `SM-xnn` measure registry (consumed by SvcV-8 roadmap and ops dashboards)
- Measurement-infrastructure table (current mechanisms and limitations)
- Gaps table feeding the Phase 4 observability backlog

---

## File Generation Workflow

1. **Inventory infra** — Record `/metrics`, `/health`, Winston, Sentry, Bull Board.
2. **Define platform measures** — Availability, p95/p99, error rate, throughput, rate limit.
3. **Define per-service measures** — Representative latency/error per SVC.
4. **Define external measures** — SendGrid/Twilio/Payment/Lab/Sentry.
5. **Define async measures** — Jobs, webhook delivery, workflow, cache.
6. **Label honestly** — Mark estimates, not-measured, aspirational N/A.
7. **Cross-link** — Reference SvcV-1/4/6/8/9, SV-7, OV-6.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-7-2026`, v1.0.0)
- [ ] Every measure has Target, Current/Baseline, and Method columns
- [ ] p95 < 300 ms and rate limit 100/15min reflect codebase
- [ ] `/metrics` stated as in-memory JSON, **not** Prometheus
- [ ] No per-service SLO monitoring claimed as live
- [ ] Payment/External Lab measures marked N/A — aspirational/PLANNED
- [ ] Circuit-breaker/retry noted as existing-but-unused (SM-X08)
- [ ] Bull Board noted as unauthenticated
- [ ] Cross-reference validation: SvcV-4, SvcV-8, SV-7, OV-6 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Has Prometheus/OpenTelemetry been adopted (would convert estimates to real SLIs)?
- Is any SLO alerting now wired (would update SM-A01)?
- Did circuit breakers get activated on external calls (would update SM-X08)?

**Generation order**

1. Infra → 2. Platform measures → 3. Per-service → 4. External →
5. Async/job → 6. Cadence → 7. Gaps → 8. Cross-references.

**Pitfalls**

- Do **not** present estimates as measured SLOs; label them.
- Do not claim Prometheus — `/metrics` is in-memory JSON.
- Do not give Payment/External Lab real numbers — integrations are aspirational.
- Keep `SM-xnn` IDs stable for downstream dashboards.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-6.itto.md` | Resource flows the measures are taken over |
| `template.SvcV-8.itto.md` | Evolution delivering measurement infrastructure |
| `template.SvcV-9.itto.md` | Technology enabling SLO measurement |
| `template.SV-7.itto.md` | Underlying systems measures matrix |
| `template.OV-6c.itto.md` | Operational timing constraints measures serve |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-7.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
