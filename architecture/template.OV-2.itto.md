# OV-2: Operational Resource Flow Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-2 Operational Resource Flow
Description** for Purple Cross is produced, validated, and consumed. OV-2 names
the operational nodes (front office, clinician, vet tech, pharmacy, lab, billing,
owner, practice manager, and external providers) and the **needlines** that carry
resources between them. Use this document when refreshing OV-2 or re-deriving the
needline catalog from the codebase.

> ⚠️ **Honesty note.** OV-2 must remain grounded. Where a needline is
> aspirational (Payment Provider charge, access-controlled flows, tenant-scoped
> flows, portal-mediated owner flows), OV-2 marks it **PLANNED / IN PROGRESS /
> PARTIAL** rather than implying delivery.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-1 | `architecture/template.OV-1.md` | Operational nodes (ON-*), core thread | Inherit node IDs and flow sequence |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules and their data | Map needlines to carrier modules |
| Prisma schema | `../backend/prisma/schema.prisma` | Entities exchanged across nodes | Ground resource-flow content |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED/IN PROGRESS flows |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Data flow doc | `../docs/DATA_FLOW_ARCHITECTURE.md` | Request/data movement | Validate flow directions |
| Communications service | `backend/src/services/communications.service.ts` | SendGrid/Twilio usage | Confirm notification needlines |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII node–needline diagram | Render nodes and aggregated needlines |
| Needline cataloging | Enumerate NL-* with producer/consumer/flows/module |
| Resource-flow classification | Tag flows clinical/financial/PII/operational/notification |
| Steward (system-of-record) analysis | Identify which node/module owns each resource |
| DoDAF 2.02 OV-2 conventions | Keep to needlines; defer per-flow detail to OV-3 |
| Honesty annotation | Flag aspirational needlines with status |

---

## Outputs

### Primary Output

- `architecture/template.OV-2.md` — the Operational Resource Flow Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Needline catalog (NL-*) | OV-3 (matrix rows), SV-2/SV-6 |
| Node responsibility table | OV-4, OV-5b mechanisms |
| Flow classification | Security review, DIV sensitivity tagging |

---

## File Generation Workflow

1. Read OV-1 to fix node IDs (ON-*) and the operational thread.
2. Enumerate needlines from the thread; assign stable NL-* IDs.
3. Map each needline to producer/consumer nodes and carrier modules.
4. Draw the ASCII node–needline diagram.
5. Populate the needline catalog and flow-classification tables.
6. Add node responsibility (produces/consumes/stewards) table.
7. Add honesty/gap table; cross-reference OV-3/OV-4/OV-5/SV-2/SV-6.
8. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-2-2026`).
- [ ] Node IDs (ON-*) identical to OV-1 / OV-4.
- [ ] Every needline has a stable ID (NL-01..NL-16) and producer/consumer.
- [ ] External providers shown: SendGrid, Twilio, Payment Provider, External Lab.
- [ ] Each needline maps to at least one real carrier module.
- [ ] Aspirational needlines flagged PLANNED/IN PROGRESS/PARTIAL.
- [ ] **Cross-ref validation:** NL-* IDs reused verbatim in OV-3; node IDs match
      OV-1/OV-4; flows align with OV-5b ICOM; SV-2/SV-6 implement these needlines;
      CV-6 capability mapping consistent.

---

## LLM Guidance

- Keep OV-2 at the **needline** level; per-flow trigger/frequency/media belongs in OV-3.
- Never upgrade Payment Provider or access-controlled flows to "done."
- Reuse ON-* and NL-* IDs verbatim across OV-3/OV-4 so traceability holds.
- Prefer real module names (`prescriptions`, `lab-tests`, `insurance-claims`).
- If an LLM/provider feature is implied for a flow, consult the repo LLM guidance
  before asserting capability.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-1.itto.md` | Supplies operational nodes and thread |
| `template.OV-3.itto.md` | Decomposes needlines into the resource-flow matrix |
| `template.OV-4.itto.md` | Organizational roles behind internal nodes |
| `template.OV-5b.itto.md` | ICOM activity model producing/consuming flows |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-2 Operational Resource Flow Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
