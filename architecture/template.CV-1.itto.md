# CV-1: Vision — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-1 Vision** artifact is produced and maintained.
CV-1 captures the strategic capability vision, business context, PI-level goals,
desired outcomes, and vision-to-capability traceability for Purple Cross. It is
the top of the Capability Viewpoint chain and feeds **CV-2** (taxonomy) and
**CV-3** (phasing).

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Keep vision honest about delivered vs. planned |
| Repository guidance | `../CLAUDE.md` | Module catalog, stack, phasing | Ground vision in actual platform |
| AV-1 Overview | `architecture/template.AV-1.md` | Scope, timeframe, capability summary | Inherit scope/timeframe and capability summary |
| Roadmap / PI plan | Program Manager | PI-1..PI-4 increment goals | Sequence capability goals |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| System architecture | `../docs/ARCHITECTURE.md` | Stack and middleware detail | Validate technical feasibility of pillars |
| Stakeholder interviews | Product Owner | Practice pain points | Refine business context and outcomes |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII/Mermaid diagramming
- Git for version control of the architecture folder
- Codebase grep/read to confirm grounded facts

**Techniques**

- Vision pillar decomposition (pillar → capability domain → PI)
- Outcome/effect definition with measurable targets
- Traceability matrix construction (vision → CV-2 CAP IDs)
- Honesty annotation (mark PLANNED / IN PROGRESS explicitly)

---

## Outputs

**Primary artifact:** `architecture/template.CV-1.md`

**Supporting outputs**

- Vision-to-capability traceability table (consumed by CV-2)
- PI capability-goal table (consumed by CV-3)
- Desired-outcomes register (referenced by SV-7 / SvcV-7 measures)

---

## File Generation Workflow

1. **Gather** — Read AV-1, CLAUDE.md, and the Production Gap Analysis.
2. **Frame** — Draft the vision statement and pillars.
3. **Contextualize** — Write the business-context narrative + diagram.
4. **Sequence** — Populate PI capability goals (PI-1..PI-4) with honest status.
5. **Define effects** — Enumerate desired outcomes with measures.
6. **Trace** — Build the vision → CV-2 CAP traceability table.
7. **Annotate honesty** — Mark AuthN/Z, tenancy, audit, at-rest crypto as PLANNED.
8. **Cross-link** — Reference CV-2/CV-3/CV-4 and OV-1.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-1-2026`, v1.0.0)
- [ ] Vision statement is singular, testable, and practice-focused
- [ ] PI goals align with CV-3 phasing (no contradictions)
- [ ] Every outcome has a measure and a source view
- [ ] AuthN/Z, tenancy, audit, at-rest crypto marked PLANNED/IN PROGRESS
- [ ] Vision-to-capability table references valid CV-2 CAP IDs
- [ ] Cross-reference validation: CV-2, CV-3, CV-4, OV-1 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Has the PI roadmap changed since the last revision?
- Are any PLANNED items now delivered (re-check the gap analysis)?
- Do new modules change the pillar-to-domain mapping?

**Generation order**

1. Vision statement + pillars → 2. Business context → 3. PI goals →
4. Outcomes → 5. Traceability → 6. Constraints/assumptions.

**Pitfalls**

- Do **not** claim auth/tenancy/audit/at-rest crypto are done.
- Keep CAP IDs consistent with CV-2 (CAP-1.0 … CAP-4.3).
- Avoid inventing payment capability — no Stripe SDK is present.
- Keep PI dates aligned with AV-1 timeframe (2025Q3–2026Q4).

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.AV-1.itto.md` | Parent overview; supplies scope/timeframe |
| `template.CV-2.itto.md` | Consumes vision traceability into taxonomy |
| `template.CV-3.itto.md` | Consumes PI goals into phasing matrix |
| `template.CV-4.itto.md` | Surfaces gating dependency (AuthN/Z) |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-1.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
