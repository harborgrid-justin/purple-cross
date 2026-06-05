# OV-6b: State Transition Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-6b State Transition Description** for
Purple Cross is produced, validated, and consumed. OV-6b defines the state
machines for key operational entities — Appointment, Invoice, Estimate,
InsuranceClaim, and Waitlist — with their states, events, and OV-6a guard rules.
Use this document when refreshing OV-6b or re-deriving state models from the
Prisma schema and services.

> ⚠️ **Honesty note.** OV-6b must reflect real status. Card-settlement and
> access-controlled transitions are **PLANNED**; partially enforced transitions
> are **PARTIAL**. Never imply a transition is fully guarded when it is not.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Status enums/fields per entity | Enumerate states |
| Service layer | `backend/src/services/` | Transition logic | Confirm events and guards |
| OV-6a | `architecture/template.OV-6a.md` | Business rules (BR-*) | Guard each transition |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Status | Mark PLANNED/PARTIAL |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Constants | `backend/src/constants` | STATUS.* values | Validate state names |
| Controllers | `backend/src/controllers/` | Transition endpoints | Identify trigger events |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII state diagrams | Render states and transitions per entity |
| Transition tables | From/Event/To/Guard/Status rows |
| Guard mapping | Link transitions to OV-6a BR-* |
| State model summary | Count states, terminals, enforcement |
| DoDAF 2.02 OV-6b conventions | Operational entity lifecycles |
| Honesty annotation | Status per transition |

---

## Outputs

### Primary Output

- `architecture/template.OV-6b.md` — the State Transition Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Entity state machines | OV-6c event traces, SV-10b |
| Transition tables | OV-6a rule validation |
| State model summary | DIV-2 status fields, roadmap |

---

## File Generation Workflow

1. Read Prisma status enums and services for each entity.
2. Draw the ASCII state diagram per entity.
3. Build the transition table (From/Event/To/Guard/Status).
4. Map each transition to an OV-6a BR-* guard.
5. Mark card-settlement and access-controlled transitions PLANNED.
6. Add state-model summary and honesty/gap table.
7. Cross-reference OV-6a/6c, OV-5b, SV-10b, DIV-2.
8. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-6b-2026`).
- [ ] All five entities modeled (Appointment, Invoice, Estimate, Claim, Waitlist).
- [ ] Each transition lists From/Event/To/Guard/Status.
- [ ] Card-settlement → Paid marked PLANNED.
- [ ] Guards reference valid OV-6a BR-* IDs.
- [ ] Terminal states identified per entity.
- [ ] **Cross-ref validation:** guards match OV-6a; events align with OV-6c;
      triggering activities align with OV-5b; system states align with SV-10b;
      entities match DIV-2.

---

## LLM Guidance

- Use state names from the Prisma status enums / constants where present.
- Never show card-payment or access-guarded transitions as fully enforced.
- Keep transitions operational (entity lifecycle), not system internals (SV-10b).
- Reuse BR-* guard IDs verbatim from OV-6a.
- For any LLM/provider-implied transition, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-6a.itto.md` | Supplies transition guards (rules) |
| `template.OV-6c.itto.md` | Event traces that drive transitions |
| `template.OV-5b.itto.md` | Activities that fire transition events |
| `template.OV-3.itto.md` | Flows that trigger transitions |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-6b State Transition Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
