# OV-5a: Operational Activity Decomposition Tree — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-5a Operational Activity Decomposition
Tree** for Purple Cross is produced, validated, and consumed. OV-5a decomposes
**A0 Operate Veterinary Practice** into nine first-level activities (A1–A9) and
their sub-activities, mapping each to real platform modules. Use this document
when refreshing OV-5a or re-deriving the activity tree from the module catalog.

> ⚠️ **Honesty note.** OV-5a must remain grounded. Where an activity is backed by
> placeholder UI, unenforced auth/RBAC, absent tenant scoping, or a missing
> Payment Provider, OV-5a marks it **PLANNED / IN PROGRESS / PARTIAL**.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules | Define activities and module mapping |
| OV-1 | `architecture/template.OV-1.md` | Operational thread A1–A9 | Anchor level-1 activities |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark activity status honestly |
| Service layer | `backend/src/services/` | Business logic per module | Validate sub-activity existence |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Entities per activity | Confirm activity data backing |
| Controllers | `backend/src/controllers/` | Endpoint behaviors | Refine sub-activity granularity |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII decomposition tree | Render A0 → A1..A9 → A1.1.. hierarchy |
| IDEF0 numbering | Stable A-level activity identifiers |
| Module-to-activity mapping | Tie each leaf to real modules |
| Coverage analysis | Summarize backend/FE reality per activity group |
| DoDAF 2.02 OV-5a conventions | Pure decomposition; flows deferred to OV-5b |
| Honesty annotation | Status per activity |

---

## Outputs

### Primary Output

- `architecture/template.OV-5a.md` — the Operational Activity Decomposition Tree.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Activity catalog (A1–A9) | OV-5b ICOM, CV-6, SV-5a/5b |
| Module-to-activity coverage | Roadmap planning, gap tracking |
| Activity IDs | OV-6a rule scoping, OV-6c traces |

---

## File Generation Workflow

1. Read the module catalog and OV-1 thread to set A1–A9.
2. Decompose each level-1 activity into A.x sub-activities.
3. Map each leaf activity to real modules in brackets.
4. Build the level-1 activity catalog and coverage table.
5. Add honesty/gap table; cross-reference OV-5b/CV-6/SV-5a/5b.
6. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-5a-2026`).
- [ ] A0 decomposes into exactly A1–A9 as specified.
- [ ] Every leaf maps to at least one real module.
- [ ] Auth (A9.1) and payment settle (A5.3) marked PLANNED.
- [ ] Audit (A8.3), CS/interactions (A4.3/4.4), portal (A1.4) marked PARTIAL/IN PROGRESS.
- [ ] Activity IDs are stable and reused downstream.
- [ ] **Cross-ref validation:** A-IDs reused in OV-5b/OV-6a/OV-6c; capability map
      consistent with CV-6; function/system traceability consistent with SV-5a/5b.

---

## LLM Guidance

- Keep OV-5a a **pure decomposition** — no ICOM arrows (that is OV-5b).
- Never mark auth, payment settlement, or full tenant scoping as done.
- Reuse A-IDs verbatim downstream so traceability holds.
- Map leaves to real module names from the catalog.
- For any LLM/provider-implied activity, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-1.itto.md` | Supplies the operational thread |
| `template.OV-5b.itto.md` | Elaborates activities into ICOM model |
| `template.OV-6a.itto.md` | Rules scoped to these activities |
| `template.OV-6c.itto.md` | Event traces realizing activities |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-5a Operational Activity Decomposition Tree |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
