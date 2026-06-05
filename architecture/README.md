# Purple Cross — Enterprise Architecture (DoDAF 2.02)

> A complete **DoDAF 2.02** architecture description for the **Purple Cross**
> veterinary practice management platform. Each viewpoint is captured as a
> filled-in architecture document (`template.<MODEL>.md`) plus an
> **ITTO** companion (`template.<MODEL>.itto.md`) that documents the
> **I**nputs, **T**ools & **T**echniques, and **O**utputs used to produce it.

**Project ID:** `PCVPM` · **Framework:** DoDAF 2.02 · **Architecture:** Purple Cross Veterinary Practice Management

---

## How to read this folder

- **`template.<MODEL>.md`** — the architecture artifact itself, populated with
  Purple Cross specifics (modules, Prisma models, Express services, middleware,
  external integrations). These are *grounded in the current codebase* and are
  honest about what is real vs. in-progress (see
  [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md)).
- **`template.<MODEL>.itto.md`** — the process companion: what inputs feed the
  artifact, which tools/techniques build it, and what it outputs / who consumes
  it downstream. Use these when refreshing or re-deriving a view.
- **`STATUS.md`** — folder status and inventory.

> ⚠️ **Honesty note.** Where a capability is aspirational rather than shipped
> (e.g., authentication/authorization is **not yet wired**), the documents say
> so explicitly and mark it **PLANNED** / **IN PROGRESS**. Do not read these as
> a claim that every capability is production-complete.

---

## Viewpoint index

### All Viewpoint (AV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| AV-1 | Overview and Summary Information | [`template.AV-1.md`](template.AV-1.md) | [`itto`](template.AV-1.itto.md) |
| AV-2 | Integrated Dictionary | [`template.AV-2.md`](template.AV-2.md) | [`itto`](template.AV-2.itto.md) |

### Capability Viewpoint (CV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| CV-1 | Vision | [`template.CV-1.md`](template.CV-1.md) | [`itto`](template.CV-1.itto.md) |
| CV-2 | Capability Taxonomy | [`template.CV-2.md`](template.CV-2.md) | [`itto`](template.CV-2.itto.md) |
| CV-3 | Capability Phasing | [`template.CV-3.md`](template.CV-3.md) | [`itto`](template.CV-3.itto.md) |
| CV-4 | Capability Dependencies | [`template.CV-4.md`](template.CV-4.md) | [`itto`](template.CV-4.itto.md) |
| CV-5 | Capability to Organizational Development Mapping | [`template.CV-5.md`](template.CV-5.md) | [`itto`](template.CV-5.itto.md) |
| CV-6 | Capability to Operational Activities Mapping | [`template.CV-6.md`](template.CV-6.md) | [`itto`](template.CV-6.itto.md) |
| CV-7 | Capability to Services Mapping | [`template.CV-7.md`](template.CV-7.md) | [`itto`](template.CV-7.itto.md) |

### Data and Information Viewpoint (DIV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| DIV-1 | Conceptual Data Model | [`template.DIV-1.md`](template.DIV-1.md) | [`itto`](template.DIV-1.itto.md) |
| DIV-2 | Logical Data Model | [`template.DIV-2.md`](template.DIV-2.md) | [`itto`](template.DIV-2.itto.md) |
| DIV-3 | Physical Data Model | [`template.DIV-3.md`](template.DIV-3.md) | [`itto`](template.DIV-3.itto.md) |

### Operational Viewpoint (OV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| OV-1 | High-Level Operational Concept Graphic | [`template.OV-1.md`](template.OV-1.md) | [`itto`](template.OV-1.itto.md) |
| OV-2 | Operational Resource Flow Description | [`template.OV-2.md`](template.OV-2.md) | [`itto`](template.OV-2.itto.md) |
| OV-3 | Operational Resource Flow Matrix | [`template.OV-3.md`](template.OV-3.md) | [`itto`](template.OV-3.itto.md) |
| OV-4 | Organizational Relationships Chart | [`template.OV-4.md`](template.OV-4.md) | [`itto`](template.OV-4.itto.md) |
| OV-5a | Operational Activity Decomposition Tree | [`template.OV-5a.md`](template.OV-5a.md) | [`itto`](template.OV-5a.itto.md) |
| OV-5b | Operational Activity Model | [`template.OV-5b.md`](template.OV-5b.md) | [`itto`](template.OV-5b.itto.md) |
| OV-6a | Operational Rules Model | [`template.OV-6a.md`](template.OV-6a.md) | [`itto`](template.OV-6a.itto.md) |
| OV-6b | State Transition Description | [`template.OV-6b.md`](template.OV-6b.md) | [`itto`](template.OV-6b.itto.md) |
| OV-6c | Event-Trace Description | [`template.OV-6c.md`](template.OV-6c.md) | [`itto`](template.OV-6c.itto.md) |

### Systems Viewpoint (SV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| SV-1 | Systems Interface Description | [`template.SV-1.md`](template.SV-1.md) | [`itto`](template.SV-1.itto.md) |
| SV-2 | Systems Resource Flow Description | [`template.SV-2.md`](template.SV-2.md) | [`itto`](template.SV-2.itto.md) |
| SV-3 | Systems-Systems Matrix | [`template.SV-3.md`](template.SV-3.md) | [`itto`](template.SV-3.itto.md) |
| SV-4 | Systems Functionality Description | [`template.SV-4.md`](template.SV-4.md) | [`itto`](template.SV-4.itto.md) |
| SV-5a | Operational Activity to Systems Function Traceability Matrix | [`template.SV-5a.md`](template.SV-5a.md) | [`itto`](template.SV-5a.itto.md) |
| SV-5b | Operational Activity to Systems Traceability Matrix | [`template.SV-5b.md`](template.SV-5b.md) | [`itto`](template.SV-5b.itto.md) |
| SV-6 | Systems Resource Flow Matrix | [`template.SV-6.md`](template.SV-6.md) | [`itto`](template.SV-6.itto.md) |
| SV-7 | Systems Measures Matrix | [`template.SV-7.md`](template.SV-7.md) | [`itto`](template.SV-7.itto.md) |
| SV-8 | Systems Evolution Description | [`template.SV-8.md`](template.SV-8.md) | [`itto`](template.SV-8.itto.md) |
| SV-9 | Systems Technology & Skills Forecast | [`template.SV-9.md`](template.SV-9.md) | [`itto`](template.SV-9.itto.md) |
| SV-10a | Systems Rules Model | [`template.SV-10a.md`](template.SV-10a.md) | [`itto`](template.SV-10a.itto.md) |
| SV-10b | Systems State Transition Description | [`template.SV-10b.md`](template.SV-10b.md) | [`itto`](template.SV-10b.itto.md) |
| SV-10c | Systems Event-Trace Description | [`template.SV-10c.md`](template.SV-10c.md) | [`itto`](template.SV-10c.itto.md) |

### Services Viewpoint (SvcV)

| Model | Title | Artifact | ITTO |
|-------|-------|----------|------|
| SvcV-1 | Services Context Description | [`template.SvcV-1.md`](template.SvcV-1.md) | [`itto`](template.SvcV-1.itto.md) |
| SvcV-2 | Services Resource Flow Description | [`template.SvcV-2.md`](template.SvcV-2.md) | [`itto`](template.SvcV-2.itto.md) |
| SvcV-3a | Systems-Services Matrix | [`template.SvcV-3a.md`](template.SvcV-3a.md) | [`itto`](template.SvcV-3a.itto.md) |
| SvcV-3b | Services-Services Matrix | [`template.SvcV-3b.md`](template.SvcV-3b.md) | [`itto`](template.SvcV-3b.itto.md) |
| SvcV-4 | Services Functionality Description | [`template.SvcV-4.md`](template.SvcV-4.md) | [`itto`](template.SvcV-4.itto.md) |
| SvcV-5 | Operational Activity to Services Traceability Matrix | [`template.SvcV-5.md`](template.SvcV-5.md) | [`itto`](template.SvcV-5.itto.md) |
| SvcV-6 | Services Resource Flow Matrix | [`template.SvcV-6.md`](template.SvcV-6.md) | [`itto`](template.SvcV-6.itto.md) |
| SvcV-7 | Services Measures Matrix | [`template.SvcV-7.md`](template.SvcV-7.md) | [`itto`](template.SvcV-7.itto.md) |
| SvcV-8 | Services Evolution Description | [`template.SvcV-8.md`](template.SvcV-8.md) | [`itto`](template.SvcV-8.itto.md) |
| SvcV-9 | Services Technology & Skills Forecast | [`template.SvcV-9.md`](template.SvcV-9.md) | [`itto`](template.SvcV-9.itto.md) |
| SvcV-10a | Services Rules Model | [`template.SvcV-10a.md`](template.SvcV-10a.md) | [`itto`](template.SvcV-10a.itto.md) |
| SvcV-10b | Services State Transition Description | [`template.SvcV-10b.md`](template.SvcV-10b.md) | [`itto`](template.SvcV-10b.itto.md) |
| SvcV-10c | Services Event-Trace Description | [`template.SvcV-10c.md`](template.SvcV-10c.md) | [`itto`](template.SvcV-10c.itto.md) |

---

## Coverage summary

| Viewpoint | Models | Artifacts | ITTO companions |
|-----------|-------:|----------:|----------------:|
| All Viewpoint (AV) | 2 | 2 | 2 |
| Capability (CV) | 7 | 7 | 7 |
| Data & Information (DIV) | 3 | 3 | 3 |
| Operational (OV) | 9 | 9 | 9 |
| Systems (SV) | 13 | 13 | 13 |
| Services (SvcV) | 13 | 13 | 13 |
| **Total** | **47** | **47** | **47** |

> The **Project Viewpoint (PV)** and **Standards Viewpoint (StdV)** models are
> intentionally out of scope for this baseline; standards coverage is folded
> into SV-9 / SvcV-9 (technology forecast) and the AV-2 integrated dictionary.

---

## Source-of-truth references

These DoDAF views summarize and trace back to the living engineering docs:

- [`../CLAUDE.md`](../CLAUDE.md) — repository guidance and module catalog
- [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — system architecture
- [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md) — honest real-vs-aspirational assessment
- [`../docs/DATA_FLOW_ARCHITECTURE.md`](../docs/DATA_FLOW_ARCHITECTURE.md) — data flow
- [`../backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) — data model
- [`../backend/src/app.ts`](../backend/src/app.ts) — Express app & middleware stack
