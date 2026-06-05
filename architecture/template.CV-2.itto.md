# CV-2: Capability Taxonomy — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-2 Capability Taxonomy** is produced. CV-2
decomposes the CV-1 vision pillars into a hierarchy of capability domains,
capabilities, and sub-capabilities (CAP-x.y), each mapped to the 37 real backend
modules. It is the authoritative source of CAP identifiers for CV-3 through CV-7.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-1 Vision | `architecture/template.CV-1.md` | Vision pillars + domains | Top of the decomposition |
| Module catalog | `../CLAUDE.md` | 37 module names (core + extended) | Map modules to sub-capabilities |
| Prisma schema | `../backend/prisma/schema.prisma` | Data models per module | Confirm capability boundaries |
| Routes directory | `../backend/src/routes/` | route→controller→service wiring | Verify modules are real |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational | Flag PLANNED sub-capabilities |
| System architecture | `../docs/ARCHITECTURE.md` | Layering | Validate domain grouping |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII tree diagramming
- Codebase grep/read over `backend/src/routes` and `schema.prisma`
- Git for version control

**Techniques**

- Functional decomposition (domain → capability → sub-capability)
- Module-to-capability affinity mapping (single-home rule)
- Stable identifier assignment (CAP-x.y)
- Honesty annotation for PLANNED features (auth, RBAC, tenancy, audit, crypto)

---

## Outputs

**Primary artifact:** `architecture/template.CV-2.md`

**Supporting outputs**

- CAP-x.y identifier registry (consumed by CV-3..CV-7)
- Module-to-capability coverage table (all 37 modules)
- Taxonomy summary matrix

---

## File Generation Workflow

1. **Inherit** — Pull the four domains from CV-1.
2. **Decompose** — Break each domain into 3 sub-capabilities.
3. **Map modules** — Assign each of the 37 modules to one sub-capability.
4. **Assign IDs** — Allocate stable CAP-x.y identifiers.
5. **Draw tree** — Render the ASCII taxonomy tree.
6. **Tabulate** — Build catalog + full module coverage table.
7. **Annotate** — Flag PLANNED security sub-capabilities under CAP-4.3.
8. **Cross-link** — Reference CV-1, CV-3, CV-4, CV-6, CV-7, SvcV-1.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-2-2026`)
- [ ] All 37 modules appear in the coverage table exactly once
- [ ] Every CAP-x.y ID is unique and stable
- [ ] Tree and tables agree (no orphan modules)
- [ ] auth/RBAC/tenancy/audit/at-rest crypto flagged PLANNED
- [ ] Payments noted as aspirational (no Stripe SDK)
- [ ] Cross-reference validation: CV-1, CV-3, CV-4, CV-6, CV-7 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have any modules been added/removed since the last revision?
- Did any PLANNED sub-capability ship (re-check gap analysis)?
- Does any module belong to a different sub-capability now?

**Generation order**

1. Domains → 2. Sub-capabilities → 3. Module mapping → 4. CAP IDs →
5. Tree → 6. Tables → 7. Honesty annotations.

**Pitfalls**

- Do not split a module across two sub-capabilities (single-home rule).
- Keep CAP IDs identical to those referenced downstream in CV-3..CV-7.
- Do not invent a payments capability or claim auth is wired.
- Keep the module count honest at 37.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-1.itto.md` | Supplies vision pillars/domains |
| `template.CV-3.itto.md` | Sequences these CAP IDs across PIs |
| `template.CV-4.itto.md` | Defines dependencies between CAP IDs |
| `template.CV-7.itto.md` | Maps CAP IDs to services/modules |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-2.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
