# DIV-1: Conceptual Data Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **DIV-1 Conceptual Data Model** artifact is produced
and maintained. DIV-1 captures the business-level information concepts of Purple
Cross, organized into ten subject areas, and the relationships among them — with
**no** attributes, keys, or physical detail. It is the top of the Data and
Information Viewpoint chain and feeds **DIV-2** (logical) and, transitively,
**DIV-3** (physical). It draws concept definitions from the **AV-2** integrated
dictionary and abstracts the ~69 Prisma models in `schema.prisma`.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | ~69 models, relations, `@@map` table names | Authoritative entity/relationship source to abstract from |
| AV-2 Integrated Dictionary | `architecture/template.AV-2.md` | Canonical term/concept definitions | Keep concept names and meanings consistent |
| AV-1 Overview | `architecture/template.AV-1.md` | Scope, module catalog, subject framing | Inherit scope and subject-area boundaries |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark tenancy/audit/crypto concepts honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Data Flow Architecture | `../docs/DATA_FLOW_ARCHITECTURE.md` | How information moves between modules | Validate cross-area relationships |
| Repository guidance | `../CLAUDE.md` | Module catalog and stack | Confirm subject-area-to-module mapping |
| Domain SME interviews | Lead Vet / Practice Manager | Business meaning of concepts | Refine definitions and stewardship |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII/Mermaid entity-relationship diagramming
- `grep`/`read` over `schema.prisma` to enumerate models and relations
- Git for version control of the architecture folder

**Techniques**

- Subject-area decomposition (group ~69 models into 10 conceptual areas)
- Concept abstraction (fold reference/child/auth tables into parent concepts)
- Entity-relationship modeling at concept level (no attributes)
- Cardinality assignment from Prisma relation arities
- Honesty annotation (mark Tenancy/Audit/Crypto as PLANNED / not enforced)

---

## Outputs

**Primary artifact:** `architecture/template.DIV-1.md`

**Supporting outputs**

- Subject-area table (consumed by DIV-2 to organize logical entities)
- Core ER concept diagram (referenced by OV-2/OV-3 resource flows)
- Concept definition table (cross-checked against AV-2)

---

## File Generation Workflow

1. **Enumerate** — Read `schema.prisma`; list all models and `@@map` names.
2. **Cluster** — Assign each model to one of ten subject areas.
3. **Abstract** — Fold reference/child/auth tables into parent concepts.
4. **Relate** — Derive concept-level relationships and cardinalities from relations.
5. **Diagram** — Draw the Client→Patient→Care→Money core spine + per-area views.
6. **Define** — Write business definitions, aligned to AV-2.
7. **Govern** — Add stewardship/sensitivity table.
8. **Annotate honesty** — Mark Tenant/Audit/at-rest-crypto as not-yet-enforced.
9. **Cross-link** — Reference DIV-2, DIV-3, AV-2, OV-2/OV-3.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-DIV-1-2026`, v1.0.0)
- [ ] **No attributes/keys/data types** appear (that is DIV-2/DIV-3 scope)
- [ ] All ~69 models accounted for across the ten subject areas
- [ ] Core ER diagram shows Client→Patient→Care→Money spine
- [ ] Cardinalities match Prisma relation arities
- [ ] Concept names/definitions reconcile with **AV-2** dictionary
- [ ] Cross-reference validation: **DIV-2** entity list is a strict elaboration of these concepts
- [ ] Cross-reference validation: **DIV-3** physical tables trace back to these concepts via DIV-2
- [ ] Tenancy/Audit/at-rest crypto marked PLANNED / not enforced
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have new models been added to `schema.prisma` since the last revision?
- Did any concept change subject area (e.g., a CRM concept moving to Billing)?
- Has tenant/audit enforcement shipped (re-check the gap analysis)?

**Generation order**

1. Subject areas → 2. Core ER spine → 3. Per-area diagrams →
4. Concept definitions → 5. Cross-area relationships → 6. Governance → 7. Honesty notes.

**Pitfalls**

- Do **not** introduce attributes, primary/foreign keys, or types here.
- Do **not** claim tenant isolation or audit logging are enforced at runtime.
- Keep concept names identical to AV-2 to avoid dictionary drift.
- Do not invent concepts absent from `schema.prisma` (no payment-gateway entity).

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.AV-2.itto.md` | Supplies canonical definitions for every concept |
| `template.DIV-2.itto.md` | Consumes subject areas; elaborates concepts into entities |
| `template.DIV-3.itto.md` | Realizes the logical model physically (downstream) |
| `template.OV-2.itto.md` | Consumes core ER concepts into operational resource flows |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Data and Information Viewpoint |
| Primary Output | `architecture/template.DIV-1.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
