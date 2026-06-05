# OV-1: High-Level Operational Concept Graphic — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-1 High-Level Operational Concept
Graphic** for Purple Cross is produced, validated, and consumed. OV-1 is the
orienting picture of the Operational Viewpoint: it names the operational nodes
(roles + external systems) and draws the core care-to-cash operational thread
(book → check-in → treat → prescribe → order lab → invoice → collect →
follow-up). Use this document when refreshing OV-1 or re-deriving it from the
codebase.

> ⚠️ **Honesty note.** OV-1 must remain grounded in the real system. When a
> concept element is aspirational (auth not wired, RBAC unenforced, Payment
> Provider absent, client portal placeholder), OV-1 marks it **PLANNED /
> IN PROGRESS / PARTIAL** rather than implying it is delivered.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules and their roles | Identify operational functions per node |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED/IN PROGRESS honestly |
| AV-1 | `template.AV-1.md` | Context diagram, operational modes | Parent concept this view elaborates |
| Prisma schema | `../backend/prisma/schema.prisma` | Entities behind each node's data | Ground node→module mapping |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Data flow doc | `../docs/DATA_FLOW_ARCHITECTURE.md` | Request/data movement | Validate operational thread |
| Communications service | `backend/src/services/communications.service.ts` | SendGrid/Twilio usage | Confirm external messaging nodes |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII operational context diagram | Render nodes, external systems, and the linear care-to-cash thread |
| Operational node cataloging | Enumerate ON-* nodes with type and primary modules |
| Scenario narration | Walk 2–3 representative threads (wellness, walk-in, billing) |
| DoDAF 2.02 OV-1 conventions | Keep to high-level concept; defer detail to OV-2/5/6 |
| Honesty annotation | Tag aspirational elements with status flags |

---

## Outputs

### Primary Output

- `architecture/template.OV-1.md` — the High-Level Operational Concept Graphic.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Operational node list (ON-*) | OV-2, OV-3, OV-4 |
| Operational thread (book→follow-up) | OV-5a, OV-5b, OV-6c |
| Honesty/gap table | CV-6, SV-5a/5b reviewers |

---

## File Generation Workflow

1. Read AV-1 and the gap analysis to fix scope and honesty posture.
2. Enumerate operational nodes from routes/modules; classify internal vs external.
3. Draw the ASCII operational context diagram (external env → platform → roles).
4. Author the node table with module mappings.
5. Narrate Scenarios A (wellness), B (walk-in), C (billing/reminder).
6. Add operational modes and stakeholder value tables.
7. Add honesty/gap table and cross-references to OV/CV/SV siblings.
8. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-1-2026`).
- [ ] All operational nodes have stable IDs (ON-1..ON-8, ON-EXT-1..4).
- [ ] External systems shown: SendGrid, Twilio, Payment Provider, External Lab.
- [ ] Core thread book→check-in→treat→prescribe→lab→invoice→collect→follow-up present.
- [ ] 2–3 scenarios included.
- [ ] Aspirational elements flagged PLANNED/IN PROGRESS/PARTIAL.
- [ ] **Cross-ref validation:** node IDs reused consistently in OV-2/OV-3;
      activities align with OV-5a; states/events align with OV-6b/OV-6c;
      capability mapping consistent with CV-6; traceability consistent with
      SV-5a/SV-5b.

---

## LLM Guidance

- Keep OV-1 **high level** — do not duplicate OV-2 needline detail or OV-5 ICOM.
- Never upgrade a PLANNED capability to "done"; cross-check the gap analysis.
- Reuse node IDs verbatim across OV-2/OV-3/OV-4 so traceability holds.
- Prefer real module names (`appointments`, `prescriptions`, `lab-tests`).
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.AV-1.itto.md` | Parent concept/summary |
| `template.OV-2.itto.md` | Resource flows among OV-1 nodes |
| `template.OV-5a.itto.md` | Activity decomposition of the thread |
| `template.OV-6c.itto.md` | Event traces for OV-1 scenarios |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-1 High-Level Operational Concept Graphic |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
