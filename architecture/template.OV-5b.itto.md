# OV-5b: Operational Activity Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-5b Operational Activity Model** for
Purple Cross is produced, validated, and consumed. OV-5b applies the IDEF0 **ICOM**
(Inputs, Controls, Outputs, Mechanisms) convention to the key activities from
OV-5a and composes them into the care-to-cash activity flow. Use this document
when refreshing OV-5b or re-deriving the ICOM model.

> ⚠️ **Honesty note.** OV-5b must remain grounded. Where a control (auth/RBAC,
> tenant scope) or mechanism (Payment Provider) is not implemented, OV-5b marks it
> **PLANNED / PARTIAL** and shows AuthN/Z controls as not enforced.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-5a | `architecture/template.OV-5a.md` | Activity tree (A1–A9) | Activities to model with ICOM |
| OV-2 / OV-3 | `template.OV-2.md`, `template.OV-3.md` | Needlines/flows | Inputs/Outputs of each activity |
| OV-4 | `template.OV-4.md` | Organizational roles | Mechanisms (human roles) |
| OV-6a | `template.OV-6a.md` | Business rules | Controls on activities |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Status | Mark PLANNED/PARTIAL |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Service layer | `backend/src/services/` | Business logic | Confirm mechanisms |
| Middleware | `backend/src/middleware/` | Validation/auth | Identify control mechanisms |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| IDEF0 ICOM modeling | Inputs/Controls/Outputs/Mechanisms per activity |
| ASCII activity flow | Compose care-to-cash chain A2→A3→A4→A5→A7 |
| Mechanism inventory | Catalog human/platform/provider mechanisms |
| Dependency analysis | Activity-to-activity input/trigger dependencies |
| DoDAF 2.02 OV-5b conventions | Behavioral model atop OV-5a decomposition |
| Honesty annotation | Mark unimplemented controls/mechanisms |

---

## Outputs

### Primary Output

- `architecture/template.OV-5b.md` — the Operational Activity Model.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| ICOM tables | SV-4/SV-5a function traceability |
| Care-to-cash flow | OV-6c event traces |
| Mechanism inventory | OV-4 validation, SV mechanism mapping |

---

## File Generation Workflow

1. Read OV-5a activities and OV-2/OV-3 flows.
2. For each key activity, populate I/C/O/M from flows, rules, roles, modules.
3. Compose the care-to-cash ASCII flow linking outputs to next inputs.
4. Build dependency summary and mechanism inventory.
5. Mark auth/tenant controls and Payment Provider mechanism as PLANNED.
6. Add honesty/gap table; cross-reference OV-4/OV-6a/OV-6c/SV-4/SV-5a.
7. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-5b-2026`).
- [ ] Each modeled activity has all four ICOM categories populated.
- [ ] Inputs/Outputs reference real RF-* flows from OV-3.
- [ ] Controls reference real business rules (OV-6a BR-*).
- [ ] Mechanisms reference real roles (OV-4 ORG-*) and modules.
- [ ] AuthN/Z control and Payment Provider mechanism marked PLANNED.
- [ ] **Cross-ref validation:** A-IDs match OV-5a; RF-* match OV-3; BR-* match
      OV-6a; ORG-* match OV-4; flow aligns with OV-6c; functions trace to SV-4/5a.

---

## LLM Guidance

- Keep controls and mechanisms distinct — rules vs. performers.
- Never show auth as an active control or Payment Provider as a live mechanism.
- Reference RF-*, BR-*, ORG-* IDs verbatim for traceability.
- Use real module names as platform mechanisms.
- For any LLM/provider-implied mechanism, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5a.itto.md` | Supplies the activity decomposition |
| `template.OV-3.itto.md` | Supplies inputs/outputs (flows) |
| `template.OV-6a.itto.md` | Supplies controls (rules) |
| `template.OV-6c.itto.md` | Sequences the modeled flow as events |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-5b Operational Activity Model |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
