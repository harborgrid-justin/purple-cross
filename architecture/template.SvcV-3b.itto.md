# SvcV-3b: Services-Services Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-3b Services-Services Matrix** artifact is
produced and maintained. SvcV-3b is the N×N **service-to-service dependency
matrix**: for each ordered `SVC-x` pair it records whether the row service
**calls**, **emits-event to**, or **shares-data with** the column service. The
dependencies are abstracted from the SvcV-2 `SF-x` flows and expose platform
coupling and blast radius.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-1 service catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry | Define the matrix axes (rows = columns) |
| SvcV-2 flow catalog | `architecture/template.SvcV-2.md` | `SF-x` producer/consumer flows | Abstract flows into dependency types |
| Service implementations | `../backend/src/services/*.service.ts` | Inter-service imports/calls | Confirm `calls` and `shares-data` edges |
| Domain-events bus | `../backend/src/services/domain-events.service.ts` | Emit/subscribe wiring | Confirm `emits-event` edges |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark auth/payment dependencies planned |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Foreign keys between models | Derive `shares-data` edges |
| Workflow engine | `../backend/src/services/workflow-engine.*` | Orchestrated service calls | Populate SVC-27 fan-out row |
| SvcV-3a matrix | `architecture/template.SvcV-3a.md` | System hosting | Bound in-proc vs external calls |

---

## Tools & Techniques

**Tools**

- Markdown N×N matrix authoring
- Codebase grep for cross-service imports and event emit/subscribe
- Prisma schema inspection for foreign-key shared data
- Git for version control of the architecture folder

**Techniques**

- Dependency typing (calls ▸ / emits-event ◇ / shares-data ▪ / planned P)
- Near-universal dependency factoring (auth, cache, Sentry, events) into a side table
- Dependency-chain identification (billing, reminders, pharmacy, automation)
- Honesty annotation (auth planned, payment aspirational, partial events)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-3b.md`

**Supporting outputs**

- Coupling/blast-radius view for change-impact analysis
- Key dependency chains feeding OV-6c event traces
- Near-universal dependency table (auth/cache/audit gaps)

---

## File Generation Workflow

1. **Set axes** — Use the `SVC-x` registry as both rows and columns.
2. **Map flows** — Translate `SF-x` flows into ▸ / ◇ / ▪ cells.
3. **Factor universals** — Pull auth/cache/Sentry/events into §4 side table.
4. **Trace chains** — Document billing, reminders, pharmacy, automation chains.
5. **Annotate honesty** — Mark all→auth planned, billing→payment aspirational.
6. **Cross-link** — SvcV-1/2/3a/4, SV-3, CV-7.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-3b-2026`, v1.0.0)
- [ ] Matrix axes both drawn from the same `SVC-x` registry
- [ ] Dependency-type legend present (calls/emits-event/shares-data)
- [ ] all→auth dependency marked planned (0 routes enforce)
- [ ] billing→payment dependency marked aspirational (no SDK)
- [ ] Cache (SVC-30) near-universal dependency captured as real
- [ ] Event coverage marked partial
- [ ] Key dependency chains enumerated
- [ ] Cross-reference validation: SvcV-1/2, SV-3, CV-7 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Were new inter-service calls or event subscriptions added since last revision?
- Did auth get wired (does all→auth become a real dependency)?
- Did billing→payment become real (SDK wired)?

**Generation order**

1. Axes → 2. Core matrix → 3. Near-universal table → 4. Dependency chains →
5. Honesty notes → 6. Cross-references.

**Pitfalls**

- Do not mark all→auth as a live dependency — it is planned everywhere.
- Keep billing→payment aspirational; no charge/refund call is wired.
- Event coverage is partial — do not imply every service emits events.
- Audit-log sharing is partial (~7/34 services), not universal.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-1.itto.md` | Provides the `SVC-x` registry (axes) |
| `template.SvcV-2.itto.md` | Provides `SF-x` flows abstracted here |
| `template.SvcV-3a.itto.md` | Systems hosting the dependent services |
| `template.SvcV-4.itto.md` | Operations that originate the dependencies |
| `template.CV-7.itto.md` | Capability-to-services coupling |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-3b.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
