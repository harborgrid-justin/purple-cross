# SV-5b: Operational Activity to Systems Traceability Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-5b Operational Activity to Systems
Traceability Matrix** for Purple Cross is produced, validated, and consumed.
SV-5b maps the OV-5a operational activities (A1–A9) to the implementing backend
**modules** and to the **systems** (S1–S5, X1–X5 from SV-1) that host them —
the systems-level counterpart to SV-5a's function-level trace. Use this document
when refreshing SV-5b or re-deriving it.

> ⚠️ **Honesty note.** Every activity is realized by S2 + S3; external systems
> (SendGrid, Twilio, Payment Provider, External Lab) used by an activity are
> flagged **PARTIAL/PLANNED**. The matrix records deployment reality, not intent.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Operational activities | `architecture/template.OV-5a.md` | A1–A9 | Matrix axis |
| Systems catalog | `architecture/template.SV-1.md` | S1–S5, X1–X5 | Systems axis |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules | Module axis |
| Express app wiring | `../backend/src/app.ts` | Mounting, externals | Confirm module/system use |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Status | Flag PLANNED/PARTIAL |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SV-5a | `architecture/template.SV-5a.md` | Function-level trace | Keep primaries consistent |
| Deployment topology | `../docker-compose.yml` | S3/S4/S5 presence | Confirm required systems |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Activity × module matrix | Map activities to implementing backend modules |
| Activity × system matrix | Map activities to S1–S5 + external systems |
| Required/supporting grading | `●` required / `○` supporting / `(P)` PLANNED external |
| Per-activity realization table | Required systems + primary modules + honest gap |
| DoDAF 2.02 SV-5b conventions | Systems-level trace (function-level lives in SV-5a) |

---

## Outputs

### Primary Output

- `architecture/template.SV-5b.md` — the Activity→Systems Traceability Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Activity→module mapping | Deployment/capacity planning, SV-6 |
| Activity→system mapping | Availability/DR analysis, SV-7 |
| Per-activity gap notes | Production-readiness reviews |

---

## File Generation Workflow

1. Inherit A1–A9 (OV-5a), S1–S5/X1–X5 (SV-1), and modules (CLAUDE.md/app.ts).
2. Build the activity × module matrix with required/supporting marks.
3. Build the activity × system matrix; flag external systems PLANNED/PARTIAL.
4. Write the per-activity realization table with honest gaps.
5. Add cross-references; apply header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-5b-2026`).
- [ ] Rows/columns use OV-5a A-IDs, SV-1 system IDs, real module names.
- [ ] S2 + S3 shown required for every activity.
- [ ] S4/S5 required where caching/async applies (A2/A7/A9 etc.).
- [ ] External systems flagged PLANNED/PARTIAL.
- [ ] Primary modules consistent with SV-5a primary functions.
- [ ] **Cross-ref validation:** activities match OV-5a; systems match SV-1;
      modules match SV-4; consistent with SV-5a and SvcV-5.

---

## LLM Guidance

- Keep SV-5b at **systems/module** granularity (functions are SV-5a's job).
- Reuse S1–S5/X1–X5 and module names verbatim.
- Never imply an external system is integrated when it is PLANNED.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5a.itto.md` | Source of operational activities |
| `template.SV-1.itto.md` | Source of systems |
| `template.SV-5a.itto.md` | Function-level traceability |
| `template.SvcV-5.itto.md` | Service-level traceability |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-5b Operational Activity to Systems Traceability Matrix |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
