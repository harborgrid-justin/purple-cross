# SV-5a: Operational Activity to Systems Function Traceability Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-5a Operational Activity to Systems
Function Traceability Matrix** for Purple Cross is produced, validated, and
consumed. SV-5a maps the OV-5a operational activities (A1–A9) to the SV-4 system
functions (SF-x) that support them, closing the operational↔systems trace. Use
this document when refreshing SV-5a or re-deriving it.

> ⚠️ **Honesty note.** Cross-cutting functions that are unenforced/unused
> (SF-AUTHZ, SF-TENANT, SF-CRYPTO, SF-RESIL) are marked **(P)** PLANNED in the
> matrix so coverage is not over-stated. SF-AUDIT is PARTIAL.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Operational activities | `architecture/template.OV-5a.md` | A1–A9 activity set | Define matrix rows/columns |
| System functions | `architecture/template.SV-4.md` | SF-x catalog | Define the function axis |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | Module→activity affinity | Populate cells |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Enforcement status | Flag PLANNED cells |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-5b activity model | `architecture/template.OV-5b.md` | Activity I/O | Refine support mapping |
| SvcV-5 | `architecture/template.SvcV-5.md` | Service traceability | Keep mappings consistent |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Traceability matrix | Activities (cols) × functions (rows) with support marks |
| Support grading | `●` primary / `○` secondary / `·` n/a / `(P)` PLANNED |
| Cross-cutting separation | Distinct matrix for SF-A/D/E that span all activities |
| Coverage summary | Per-activity primary functions + honest caveats |
| DoDAF 2.02 SV-5a conventions | Function-level trace; systems-level trace deferred to SV-5b |

---

## Outputs

### Primary Output

- `architecture/template.SV-5a.md` — the Activity→Function Traceability Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Activity→function cells | Requirements traceability, gap reviews |
| Coverage summary | SV-5b, capability assessments |

---

## File Generation Workflow

1. Inherit A1–A9 from OV-5a and SF-x from SV-4.
2. Build the module-function matrix (SF-B/SF-C) with support grades.
3. Build the cross-cutting/platform matrix (SF-A/SF-D/SF-E) with PLANNED flags.
4. Write the per-activity coverage summary with honest caveats.
5. Add cross-references; apply header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-5a-2026`).
- [ ] Rows/columns use OV-5a A-IDs and SV-4 SF-IDs verbatim.
- [ ] Every activity has at least one primary (`●`) function.
- [ ] Unenforced functions (SF-AUTHZ/TENANT/CRYPTO/RESIL) marked `(P)`.
- [ ] SF-AUDIT shown PARTIAL.
- [ ] **Cross-ref validation:** activities match OV-5a/OV-5b; functions match SV-4;
      consistent with SV-5b systems mapping and SvcV-5.

---

## LLM Guidance

- Keep cells at **support** granularity; do not restate SV-4 function text.
- Never upgrade a `(P)` cross-cutting function to fully covered.
- Reuse A1–A9 and SF-x IDs verbatim; align primary functions with SV-5b systems.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5a.itto.md` | Source of operational activities |
| `template.SV-4.itto.md` | Source of system functions |
| `template.SV-5b.itto.md` | Activity → systems traceability |
| `template.SvcV-5.itto.md` | Activity → services traceability |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-5a Operational Activity to Systems Function Traceability Matrix |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
