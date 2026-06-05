# SvcV-8: Services Evolution Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-8 Services Evolution Description** artifact is
produced and maintained. SvcV-8 is the **services roadmap**: it maps the current
service baseline (~85% real backend, auth unwired, payments aspirational,
in-memory metrics) onto four program increments (PI-1..PI-4), showing when each
honest gap closes — frontend consumption (PI-2), security cutover / auth / RBAC
/ tenancy / real payments (PI-3), and hardening / versioning / SLOs / contract
testing / circuit-breaker activation (PI-4). It must stay consistent with the
capability phasing in CV-3 and the technology forecast in SvcV-9.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational, % real | Establish PI-1 baseline honestly |
| Repository guidance | `../CLAUDE.md` | Production-hardening narrative, phases | Frame Phase 1–4 themes |
| Route/service inventory | `../backend/src/routes`, `services` | Current module reality | Confirm what exists vs planned |
| Resilience utils | `../backend/src/utils/circuit-breaker.ts`, `retry.ts` | Exist but unused | Schedule activation in PI-4 |
| Auth status | `../backend/src/` (no mounted auth routes) | 0 auth routes | Schedule auth wiring in PI-3 |
| AV-1 timeframe | `architecture/template.AV-1.md` | PI-1..PI-4 timeline, recommendations | Align phase dates |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-6 matrix | `architecture/template.SvcV-6.md` | Contracts to stabilize in PI-2 | Tie evolution to flows |
| SvcV-7 measures | `architecture/template.SvcV-7.md` | Target SLOs | Schedule SLO enforcement |
| SvcV-9 forecast | `architecture/template.SvcV-9.md` | OTel/Prometheus/gateway | Sequence technology adoption |
| CV-3 phasing | `architecture/template.CV-3.md` | Capability increments | Keep capability/service phases consistent |

---

## Tools & Techniques

**Tools**

- Markdown + ASCII timeline diagram authoring
- Maturity matrix (phase × concern) tabulation
- Git for version control

**Techniques**

- Increment-based roadmapping (PI-1 baseline → PI-4 production-ready)
- Gap-to-phase scheduling (each honest gap assigned a closing increment)
- Maturity legend scoring (none / partial / done) per concern per phase
- Deprecation/decommission planning (additive, hardening-oriented)
- Dependency/risk identification per evolution step

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-8.md`

**Supporting outputs**

- Service-maturity-by-phase matrix (consumed by program planning, CV-3)
- Phase exit-criteria list (release gating)
- Evolution dependency/risk register

---

## File Generation Workflow

1. **Set baseline** — Capture PI-1 reality per service group from the gap analysis.
2. **Draw timeline** — ASCII PI-1..PI-4 with phase themes.
3. **Detail phases** — PI-2 frontend, PI-3 security, PI-4 hardening tables.
4. **Score maturity** — Fill phase × concern matrix with legend marks.
5. **Plan deprecations** — Unauth access, in-memory metrics, `/api/v1` long-term.
6. **Register risks** — Auth/tenancy retrofit, payment vendor, breaker semantics.
7. **Cross-link** — Reference SvcV-1/6/7/9/10a, SV-8, CV-3.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-8-2026`, v1.0.0)
- [ ] PI-1 baseline states ~85% real backend and auth NOT wired
- [ ] PI-3 schedules auth/RBAC/tenancy/PHI-crypto/real payments
- [ ] PI-4 schedules /api/v2, SLOs, contract testing, breaker activation, OTel
- [ ] Maturity matrix covers all honest gaps with explicit phase
- [ ] Payment Provider shown aspirational until PI-3
- [ ] Circuit breakers shown unused until PI-4
- [ ] Cross-reference validation: SvcV-7, SvcV-9, SV-8, CV-3 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have any PI-2/PI-3 items already shipped (would shift baseline)?
- Is a Payment Provider vendor now selected (affects PI-3 detail)?
- Has the team committed phase dates that differ from AV-1?

**Generation order**

1. Baseline → 2. Timeline → 3. Phase detail → 4. Maturity matrix →
5. Deprecations → 6. Risks → 7. Cross-references.

**Pitfalls**

- Do **not** mark unshipped items as done in the baseline column.
- Keep phase themes aligned with CV-3 and AV-1 timeframe.
- Do not promise a specific payment vendor; keep the interface abstract.
- Evolution is additive — no service modules are removed in PI-2..PI-4.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-6.itto.md` | Contracts stabilized during evolution |
| `template.SvcV-7.itto.md` | Measures becoming enforced SLOs |
| `template.SvcV-9.itto.md` | Technology/skills enabling each phase |
| `template.SV-8.itto.md` | Underlying systems evolution |
| `template.CV-3.itto.md` | Capability phasing alignment |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-8.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
