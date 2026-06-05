# SvcV-5: Operational Activity to Services Traceability Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-5 Operational Activity to Services Traceability
Matrix** artifact is produced and maintained. SvcV-5 traces the OV-5a operational
activities (A1–A9) to the `SVC-x` services that realize them (primary/supporting),
closing the loop from the Operational Viewpoint to the Services Viewpoint and
surfacing where realization is PLANNED or aspirational.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-5a activity tree | `architecture/template.OV-5a.md` | Operational activities A1–A9 | Provide the matrix rows |
| SvcV-1 service catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry + domains | Provide the matrix columns |
| SvcV-4 functionality | `architecture/template.SvcV-4.md` | `SFN-x` operations per service | Justify primary/supporting roles |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED/aspirational traces |
| Repository guidance | `../CLAUDE.md` | Module catalog, practice workflow | Ground activity→service mapping |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-5b activity model | `architecture/template.OV-5b.md` | Activity flow detail | Refine supporting-service assignment |
| SV-5a/5b traceability | `architecture/template.SV-5a.md` | Activity → systems | Cross-check realization completeness |
| CV-6 capability mapping | `architecture/template.CV-6.md` | Capability ↔ activities | Align capability coverage |

---

## Tools & Techniques

**Tools**

- Markdown matrix authoring (activities × services)
- Cross-document reconciliation against OV-5a and SvcV-1/4
- Git for version control of the architecture folder

**Techniques**

- Primary/supporting realization typing (● / ○)
- Planned/aspirational annotation (P / A) for unwired realizations
- Near-universal/planned service factoring (auth, cache, events, queue, payment)
- Activity realization summary roll-up

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-5.md`

**Supporting outputs**

- Activity-coverage roll-up (primary/supporting per activity)
- Realization-gap list feeding the production-hardening roadmap
- Closure evidence for OV→SvcV traceability

---

## File Generation Workflow

1. **Set rows** — Import activities A1–A9 from OV-5a.
2. **Set columns** — Import `SVC-x` registry from SvcV-1.
3. **Assign ● / ○** — Mark primary and supporting realizers per activity.
4. **Factor universals** — Pull auth/cache/events/queue/payment into §5.
5. **Annotate P / A** — Mark planned and aspirational realizations.
6. **Summarize** — Roll up realization status per activity.
7. **Cross-link** — OV-5a/5b, SvcV-1/4, SV-5a/5b, CV-6/7.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-5-2026`, v1.0.0)
- [ ] Every OV-5a activity (A1–A9) has at least one primary (●) realizer
- [ ] Columns drawn from the SvcV-1 `SVC-x` registry
- [ ] A9 Platform Operations shows auth (SVC-25) as PLANNED primary
- [ ] A5 settlement (SVC-33) marked aspirational
- [ ] A8 audit/crypto realization marked PARTIAL
- [ ] Portal-supported activities (A1/A2/A7) marked IN PROGRESS
- [ ] Cross-reference validation: OV-5a, SvcV-1, SvcV-4, CV-7 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Did the OV-5a activity set change since last revision?
- Has auth been wired (does A9's primary realizer stop being PLANNED)?
- Did payment settlement (A5) become real?

**Generation order**

1. Activity rows → 2. Service columns → 3. Realization cells → 4. Factored table →
5. Realization summary → 6. Honesty notes → 7. Cross-references.

**Pitfalls**

- Do not show A9/auth as realized — auth is unwired.
- Keep A5 settlement aspirational (no payment gateway).
- A8 compliance realization is partial — audit ~7/34, crypto 0 fields.
- Portal-backed activity realization is IN PROGRESS, not complete.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5a.itto.md` | Provides the operational activities (rows) |
| `template.SvcV-1.itto.md` | Provides the `SVC-x` services (columns) |
| `template.SvcV-4.itto.md` | Provides `SFN-x` operations justifying roles |
| `template.SV-5a.itto.md` | Activity → systems traceability cross-check |
| `template.CV-7.itto.md` | Capability-to-services mapping |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-5.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
