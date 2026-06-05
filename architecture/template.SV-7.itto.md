# SV-7: Systems Measures Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-7 Systems Measures Matrix** for Purple Cross is
produced, validated, and consumed. SV-7 enumerates system-level performance and
quality measures (latency, throughput, error rate, uptime, DB/cache, queue,
resource, test coverage, rate-limit, resilience) with **target vs current**
values and their **measurement method**. Use this when re-baselining measures or
after a new observability source comes online.

> ⚠️ **Honesty note.** SV-7 must report measurement *maturity* truthfully:
> `/metrics` is in-memory JSON (not Prometheus), coverage is measured against a
> mocked Prisma layer, and circuit-breaker/retry measures are not yet
> observable because the utilities are unused. Mark such measures PLANNED /
> IN PROGRESS.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Middleware stack | `backend/src/app.ts`, `middleware/metrics.ts` | metrics, timeout, rate-limit config | Identify what is measured and where |
| Health endpoints | `backend/src/routes/health.routes.ts` | live/ready/detailed probes | Define availability + readiness sources |
| Constants | `backend/src/constants/index.ts` | rate-limit, timeout, pagination values | Ground deterministic targets (SM-15/16) |
| Test config | `backend/jest.config.js` (coverage 70%) | coverage thresholds | Ground SM-13/14 and the mocked-DB caveat |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | real-vs-aspirational status | Mark PLANNED measures honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Sentry config | `backend/src/config/sentry.ts` | error/trace capture | Source for SM-04/19 |
| BullMQ config | `backend/src/config/bull-board.ts`, `worker.ts` | queue/job telemetry | Source for SM-08–10 |
| Logger config | `backend/src/config/logger.ts` | Winston JSON + PII redaction | Source for SM-20 |
| CV-1 outcomes | `template.CV-1.md` | desired outcome targets | Align system targets to capability goals |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Measure cataloging | Assign stable SM-* IDs to each metric |
| Target/baseline pairing | Record target vs current with maturity status |
| Source mapping | Tie each measure to a concrete endpoint/file |
| ASCII observability diagram | Show metrics/logs/health/Sentry planes |
| Honesty annotation | Flag JSON-metrics, mocked-DB, unused-resilience gaps |
| Threshold/alert drafting | Define warn/critical bands (PLANNED) |

---

## Outputs

### Primary Output

- `architecture/template.SV-7.md` — the Systems Measures Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| SM-* measure register | SV-8 (gap retirement), SV-9 (tooling), CV-3 |
| Threshold table (TH-*) | SRE/observability runbooks (PLANNED) |
| Honest gap summary | Gap analysis maintainers, SV-8 |

---

## File Generation Workflow

1. Read `app.ts`, `metrics.ts`, health routes, and constants for grounded sources.
2. Enumerate measures with stable SM-* IDs; map each to a system (S1–S5) and SF-*.
3. Pair target vs current/baseline; mark maturity (DONE / IN PROGRESS / PLANNED).
4. Draft the measurement-architecture ASCII diagram.
5. Add method catalog and (PLANNED) thresholds/alerting.
6. Write the honest gap summary (JSON metrics, mocked DB, unused resilience).
7. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-7-2026`, v1.0.0).
- [ ] Every measure has SM-* ID, target, current/baseline, and method.
- [ ] `/metrics` documented as in-memory JSON, not Prometheus.
- [ ] Coverage measures carry the mocked-DB caveat (70% threshold).
- [ ] Circuit-breaker/retry measures marked PLANNED (unused utilities).
- [ ] Rate-limit (100/15min) and 30s timeout recorded as DONE/deterministic.
- [ ] **Cross-ref validation:** SF-* IDs match SV-4; interfaces match SV-1;
      gaps align with SV-8; tooling aligns with SV-9; states feeding SM-08/17
      align with SV-10b; phasing consistent with CV-3.
- [ ] Closing classification footer present.

---

## LLM Guidance

- Do **not** report measured production values you cannot ground; mark unbaselined.
- Never upgrade a PLANNED measure to DONE without a real source.
- Keep SM-* IDs stable across revisions so trend tracking holds.
- Reuse system lifelines S1–S5 consistently with SV-10c.
- If an LLM/provider feature is referenced, consult the repo's LLM guidance
  before asserting capability or cost numbers.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-4.itto.md` | Supplies system functions (SF-*) being measured |
| `template.SV-8.itto.md` | Consumes gap summary into evolution roadmap |
| `template.SV-9.itto.md` | Supplies tooling (Prometheus/OTel) for measures |
| `template.SV-10b.itto.md` | State machines feeding queue/resilience measures |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-7.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
