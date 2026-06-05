# OV-6c: Event-Trace Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-6c Event-Trace Description** for Purple
Cross is produced, validated, and consumed. OV-6c provides ASCII sequence traces
for three operational scenarios — booking + reminder; clinical visit → record →
prescription; invoice → payment → receipt — tying together roles (OV-4), flows
(OV-3), rules (OV-6a), and state transitions (OV-6b). Use this document when
refreshing OV-6c or re-deriving traces from the activity model.

> ⚠️ **Honesty note.** OV-6c must annotate steps that depend on unimplemented
> capabilities (auth gate, Payment Provider, full audit) as **PLANNED / PARTIAL /
> IN PROGRESS** rather than implying they execute today.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-5b | `architecture/template.OV-5b.md` | Care-to-cash activity flow | Sequence order of events |
| OV-3 | `architecture/template.OV-3.md` | Resource flows (RF-*) | Message content per step |
| OV-6b | `architecture/template.OV-6b.md` | State machines | Transitions driven by events |
| OV-6a | `architecture/template.OV-6a.md` | Business rules (BR-*) | Inline guards on events |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Status | Annotate PLANNED/PARTIAL |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-4 | `architecture/template.OV-4.md` | Roles (ORG-*) | Identify lifeline actors |
| Service layer | `backend/src/services/` | Call sequences | Validate ordering |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII sequence diagrams | Lifelines, messages, returns per scenario |
| Event tabulation | Seq/Event/From→To/Flow/Rule-State rows |
| Rule + state annotation | Inline [BR-*] and {State→State} markers |
| Cross-scenario summary | Entities transitioned, providers, flags |
| DoDAF 2.02 OV-6c conventions | Operational event traces |
| Honesty annotation | Inline (PLANNED)/(PARTIAL) markers |

---

## Outputs

### Primary Output

- `architecture/template.OV-6c.md` — the Event-Trace Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Scenario traces | SV-10c system event traces |
| Event tables | OV-6b transition validation |
| Cross-scenario summary | Test scenario derivation |

---

## File Generation Workflow

1. Read OV-5b flow, OV-3 flows, OV-6b states, OV-6a rules.
2. Select three scenarios (booking+reminder; visit→record→Rx; invoice→payment).
3. Draw ASCII sequence diagram with role/node lifelines per scenario.
4. Annotate steps with RF-*, BR-*, {State→State}, and honesty flags.
5. Build event tables and the cross-scenario summary.
6. Add honesty/gap table; cross-reference OV-1/2/3/4/5b/6a/6b/SV-10c.
7. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-6c-2026`).
- [ ] Three scenarios present (booking+reminder; visit→record→Rx; invoice→payment).
- [ ] Each trace shows actors, ordered events, and returns.
- [ ] Steps reference RF-* (OV-3) and {State→State} (OV-6b) and [BR-*] (OV-6a).
- [ ] Auth gate, Payment Provider, audit steps flagged PLANNED/PARTIAL.
- [ ] Each scenario has an accompanying event table.
- [ ] **Cross-ref validation:** RF-* match OV-3; BR-* match OV-6a; states match
      OV-6b; actors match OV-4; ordering matches OV-5b; system traces align SV-10c.

---

## LLM Guidance

- Keep ordering consistent with the OV-5b care-to-cash flow.
- Always annotate auth/payment/audit gaps inline — never imply they run today.
- Reuse RF-*, BR-*, ORG-*, and state names verbatim from sibling views.
- Prefer real module/provider names in lifelines.
- For any LLM/provider-implied step, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5b.itto.md` | Supplies the activity flow ordering |
| `template.OV-3.itto.md` | Supplies the resource flows traced |
| `template.OV-6b.itto.md` | Supplies the state transitions driven |
| `template.OV-6a.itto.md` | Supplies the inline rule guards |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-6c Event-Trace Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
