# SV-3: Systems-Systems Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-3 Systems-Systems Matrix** for Purple
Cross is produced, validated, and consumed. SV-3 cross-tabulates which systems
(S1–S5, X1–X5) interface with which, recording the interface type and status in
each cell. It is a matrix summary of the SV-1 interfaces and SV-2 resource flows.
Use this document when refreshing SV-3 or re-deriving it from the codebase.

> ⚠️ **Honesty note.** SV-3 cells must reflect reality: PLANNED couplings
> (Payment Provider, External Lab, inbound webhook receivers) carry no working
> integration; PARTIAL couplings (email/SMS, webhook delivery, metrics/queue
> access) are implemented but unhardened. Internal data-tier links are LIVE.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SV-1 interface catalog | `architecture/template.SV-1.md` | Systems S1–S5/X1–X5, interfaces I1–I12 | Define matrix axes |
| SV-2 resource flows | `architecture/template.SV-2.md` | RF-01..RF-13 directional flows | Populate cell types/status |
| Express app wiring | `../backend/src/app.ts` | Mounting, externals touched | Confirm which pairs interface |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Set cell status flags |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Deployment topology | `../docker-compose.yml` | Service adjacency | Confirm internal couplings |
| Integration services | `backend/src/services/communication*.ts`, `webhook-delivery*.ts` | External call sites | Confirm PARTIAL externals |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| N×N adjacency matrix | Render source (row) × destination (column) couplings |
| Cell typing | Encode interface type (REST/TLS, Prisma, RESP, BullMQ, Webhook, Telemetry) |
| Status flagging | Mark cells LIVE / PARTIAL / PLANNED |
| Legend definition | Define codes and row/column orientation |
| DoDAF 2.02 SV-3 conventions | Pure matrix; defer flow detail to SV-2, endpoints to SV-6 |

---

## Outputs

### Primary Output

- `architecture/template.SV-3.md` — the Systems-Systems Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Coupling matrix | SV-4 (function placement), architecture reviews |
| Interface-type summary | SvcV-3a, integration planning |
| Coupling observations | Risk/resilience planning, SV-7 |

---

## File Generation Workflow

1. Read SV-1 and SV-2 to inherit systems, interfaces, and flows.
2. Define the legend and row/column orientation (source × destination).
3. Populate the internal-systems matrix (S1–S5).
4. Populate the internal→external matrix (S2/S5 → X1–X5, tenant URLs).
5. Add the interface-type summary table tying pairs back to I/RF IDs.
6. Add coupling observations and cross-references.
7. Apply the standard header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-3-2026`).
- [ ] Axes use SV-1 system IDs (S1–S5, X1–X5) verbatim.
- [ ] Every populated cell has a type and status flag.
- [ ] Legend defines all codes and row=source/column=destination.
- [ ] PLANNED/PARTIAL/LIVE consistent with SV-1/SV-2.
- [ ] S1 shown talking only to S2 (no direct DB/Redis).
- [ ] **Cross-ref validation:** cells trace to SV-1 interfaces and SV-2 flows;
      complements SvcV-3a; data-tier cell aligns with DIV-3.

---

## LLM Guidance

- Keep SV-3 a **matrix** — do not restate SV-2 flow narratives.
- Reuse SV-1 IDs and SV-2 RF references; do not invent new system pairs.
- Never upgrade a PLANNED cell to LIVE.
- Remember S1 ↔ data tier is **no direct interface** (all via S2).
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-1.itto.md` | Systems/interfaces forming the axes |
| `template.SV-2.itto.md` | Flows underlying the cells |
| `template.SV-4.itto.md` | Functions hosted on coupled systems |
| `template.SvcV-3a.itto.md` | Complementary systems-services matrix |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-3 Systems-Systems Matrix |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
