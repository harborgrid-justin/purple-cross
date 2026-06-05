# SV-9: Systems Technology & Skills Forecast — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-9 Systems Technology & Skills Forecast** for
Purple Cross is produced, validated, and consumed. SV-9 records the current
technology stack with versions, forecasts emerging technologies tied to the
SV-8 phases, and forecasts the workforce skills needed — most acutely for the
authentication/security rollout (Phase 3) and observability/SRE rollout
(Phase 4). Use this when the stack changes or a forecast item ships.

> ⚠️ **Honesty note.** Forecast technologies (Prometheus/Grafana, OpenTelemetry,
> Kubernetes, read replicas) are **not present** today; `prom-client` exists but
> is unwired. Mark these as forecast/target, not shipped. The security skills gap
> (SK-05) is real and load-bearing.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Backend package manifest | `backend/package.json` | dependency versions | Ground the tech baseline |
| Frontend package manifest | `frontend/package.json` | React/Vite/Query versions | Ground frontend baseline |
| Middleware / config | `backend/src/app.ts`, `config/*` | logging, Sentry, metrics | Confirm live vs unwired tech |
| SV-8 roadmap | `template.SV-8.md` | phase gating | Tie forecast tech to phases |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | honest status | Mark unwired/forecast items |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Docker compose | `docker-compose.yml` | runtime topology | Ground compose→K8s forecast |
| Test config | `jest.config.js`, Vitest setup | test tooling | Ground SK-07 / FT-07 |
| SV-7 measures | `template.SV-7.md` | tooling needs | Align FT-01/02/03 to measures |
| CV-3 | `template.CV-3.md` | capability phasing | Technology-to-capability trace |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Version cataloging | Record exact versions per technology |
| Forecast tabling | Assign FT-* IDs with maturity + target phase |
| Skills-gap analysis | Assign SK-* IDs with current vs target coverage |
| Technology-to-capability trace | Link tech/skills to CV-3 capabilities |
| Standards folding | Capture conventions absent a StdV baseline |
| Honesty annotation | Flag unwired (`prom-client`) and absent tech |

---

## Outputs

### Primary Output

- `architecture/template.SV-9.md` — the Technology & Skills Forecast.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| FT-* forecast register | SV-8 phase planning, procurement |
| SK-* skills register | Hiring/training plans, SV-8 |
| Standards-folded table | AV-2 dictionary, audits |

---

## File Generation Workflow

1. Read both `package.json` files for exact versions.
2. Build the technology baseline (runtime, frontend, quality/ops).
3. Forecast emerging tech with FT-* IDs and target phases.
4. Build the skills forecast with SK-* IDs and coverage deltas.
5. Trace technology/skills to CV-3 capabilities.
6. Fold standards (no StdV baseline) and write the gap summary.
7. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-9-2026`, v1.0.0).
- [ ] Versions match the package manifests (Node>=18, Express 4.18, Prisma 6.18, etc.).
- [ ] `prom-client` recorded as present-but-unwired.
- [ ] Forecast tech (Prometheus/Grafana/OTel/K8s/replicas) marked as target, not shipped.
- [ ] Security skills gap (SK-05) flagged as priority for Phase 3.
- [ ] **Cross-ref validation:** tooling aligns with SV-7 measures; phases with
      SV-8; capabilities with CV-3; standards folded per README (no StdV).
- [ ] Closing classification footer present.

---

## LLM Guidance

- Do not invent versions; read the manifests.
- Never label a forecast technology as live; keep target-phase framing.
- Keep FT-* and SK-* IDs stable across revisions.
- Emphasize the security skills gap honestly; do not understate it.
- If referencing LLM/provider features, consult the repo's LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-7.itto.md` | Measures needing the forecast tooling |
| `template.SV-8.itto.md` | Phases that gate each forecast item |
| `template.SV-10a.itto.md` | Rules enforced once auth/crypto tech lands |
| `template.CV-3.itto.md` | Capability phasing alignment |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-9.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
