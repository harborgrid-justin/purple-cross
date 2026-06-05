# SV-8: Systems Evolution Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-8 Systems Evolution Description** for Purple
Cross is produced, validated, and consumed. SV-8 sequences the platform's
evolution from its current baseline (~85% real backend, no auth, placeholder
frontend) to a production-ready target across program increments **PI-1…PI-4
(2025 Q3 → 2026 Q4)**, with a technical-debt retirement schedule. Use this when
re-baselining the roadmap or after a phase delivers.

> ⚠️ **Honesty note.** SV-8 must report future-state items as PLANNED / IN
> PROGRESS until the gating phase lands. The baseline gaps (auth not wired, RBAC
> unenforced, `tenantId` unscoped, audit ~7/34, field-crypto 0 fields, mocked-DB
> tests, JSON metrics, unused circuit-breaker/retry) are load-bearing and must
> not be softened.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | real-vs-aspirational status | Define the honest baseline |
| Middleware / app | `backend/src/app.ts` | live pipeline, unused auth | Confirm what is/ isn't wired |
| Auth + tenancy code | `middleware/auth.ts`, Prisma extensions | defined-but-unused enforcement | Ground PLANNED items |
| SV-7 measures | `template.SV-7.md` | measurement gap summary | Feed debt items TD-06/07/08 |
| CV-3 phasing | `template.CV-3.md` | capability increments | Align phases to capabilities |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Crypto / audit utils | `utils/field-crypto.ts`, `audit-logger.ts` | unused/partial enforcement | Ground TD-04/05 |
| Resilience utils | `utils/circuit-breaker.ts`, `retry.ts` | dead code | Ground TD-08 |
| Docker compose | `docker-compose.yml` | single-node topology | Ground TD-10 / K8s target |
| AV-1 | `template.AV-1.md` | risks/recommendations | Align roadmap to REC-* |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Increment sequencing | Map work to PI-1…PI-4 with dependencies |
| Baseline/target pairing | Current state vs to-be per element |
| Capability-by-phase matrix | ✅/🔄/⬚ grid across phases |
| Technical-debt register | Stable TD-* IDs with retirement phase |
| Sequencing-constraint analysis | Encode SEQ-* ordering rules |
| Honesty annotation | Mark PLANNED/IN PROGRESS truthfully |

---

## Outputs

### Primary Output

- `architecture/template.SV-8.md` — the Systems Evolution Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| TD-* debt register | Program planning, SV-7, SV-9 |
| Capability-by-phase matrix | CV-3, AV-1 recommendations |
| Sequencing constraints (SEQ-*) | Release planning |

---

## File Generation Workflow

1. Read the gap analysis and `app.ts` to fix the honest baseline.
2. Define the to-be target per system element.
3. Build the PI-1…PI-4 timeline diagram.
4. Populate the capability-by-phase matrix (✅/🔄/⬚).
5. Enumerate technical debt with stable TD-* IDs + retirement phase.
6. Encode sequencing constraints (SEQ-*).
7. Record completed consolidation (NestJS/Next.js removed).
8. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-8-2026`, v1.0.0).
- [ ] Baseline states auth not wired, RBAC/tenant gaps, crypto 0 fields honestly.
- [ ] Every debt item has a TD-* ID and a retirement phase.
- [ ] Phases mapped to PI-1…PI-4 (2025 Q3 → 2026 Q4).
- [ ] NestJS/Next.js removal recorded as completed consolidation.
- [ ] Future items marked PLANNED / IN PROGRESS, not DONE.
- [ ] **Cross-ref validation:** gaps consistent with SV-7; tooling with SV-9;
      rule status flips align with SV-10a; circuit-breaker activation with
      SV-10b; phasing with CV-3; risks with AV-1.
- [ ] Closing classification footer present.

---

## LLM Guidance

- Never present a future-state capability as shipped; keep PLANNED labels.
- Keep TD-* and SEQ-* IDs stable across revisions for traceability.
- Sequencing matters: auth (TD-01/02) precedes tenant scoping (TD-03).
- Reconcile with SV-7's gap summary; do not invent new measurement claims.
- If referencing LLM/provider features, consult the repo's LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-7.itto.md` | Supplies the measurement gap summary |
| `template.SV-9.itto.md` | Supplies enabling technology/skills per phase |
| `template.SV-10a.itto.md` | Rule status flips tracked by the roadmap |
| `template.CV-3.itto.md` | Capability phasing alignment |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-8.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
