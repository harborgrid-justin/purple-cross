# DIV-2: Logical Data Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **DIV-2 Logical Data Model** artifact is produced and
maintained. DIV-2 elaborates the ten DIV-1 subject areas into the **~69 entities**
of Purple Cross, each with key attributes, primary/foreign keys, cardinalities,
and normalization — independent of the physical PostgreSQL realization (DIV-3).
It also documents the **shared audit / soft-delete / tenancy column set** and is
honest that those columns are **defined but not fully enforced**. DIV-2 consumes
**DIV-1** and the live `schema.prisma`, and feeds **DIV-3**.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | ~69 models, fields, relations, unique/index decls | Authoritative entity/attribute/key source |
| Extension model lists | `../backend/src/config/prisma-extensions/models.ts` | CORE_MODELS / OPERATIONAL_MODELS / TENANT_MODELS | Determine which entities carry the shared column set |
| DIV-1 Conceptual Model | `architecture/template.DIV-1.md` | Subject areas, concepts, core ER spine | Structure entities by subject area; inherit cardinalities |
| AV-2 Integrated Dictionary | `architecture/template.AV-2.md` | Canonical entity/attribute definitions | Reconcile names and meanings |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark audit/tenancy/soft-delete enforcement honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Extension implementations | `prisma-extensions/{tenant,audit,soft-delete,field-crypto}.ts` | Runtime behavior of cross-cutting columns | Confirm exact enforcement status |
| Service layer | `../backend/src/services/*.ts` | Application-enforced rules | Source data-quality/integrity rules (DQ-x) |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII relationship-matrix tables
- `grep`/`read` over `schema.prisma` and `prisma-extensions/`
- Git for version control

**Techniques**

- Entity attribution (extract significant attributes per model)
- Key analysis (surrogate PKs, natural/unique keys, composite uniqueness)
- Cardinality derivation from Prisma relation arities
- Normalization review (confirm 3NF core; justify JSON/array denormalization)
- Cross-cutting column-set documentation with enforcement-status grading
- Honesty annotation (Enforced / Partial / Defined-not-enforced)

---

## Outputs

**Primary artifact:** `architecture/template.DIV-2.md`

**Supporting outputs**

- Per-subject-area entity tables (consumed by DIV-3 for table mapping)
- Logical relationship matrix for core entities (referenced by SV views)
- Shared column-set table (consumed by DIV-3 §audit/tenant/soft-delete)
- Key/uniqueness register (consumed by DIV-3 index/constraint strategy)

---

## File Generation Workflow

1. **Inventory** — Read `schema.prisma`; enumerate every model and its fields.
2. **Classify** — Use `models.ts` to tag entities that carry the shared columns.
3. **Attribute** — List significant attributes, marking nullability and uniques.
4. **Key** — Record PKs, natural/unique keys, composite uniqueness, FKs/cascades.
5. **Relate** — Build the core relationship matrix and cardinalities.
6. **Normalize** — Confirm 3NF; document JSON/array exceptions with rationale.
7. **Cross-cut** — Document audit/soft-delete/tenancy columns + enforcement status.
8. **Quality** — Capture DQ rules (application-enforced vs DB-enforced).
9. **Cross-link** — Reference DIV-1, DIV-3, AV-2.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-DIV-2-2026`, v1.0.0)
- [ ] All ~69 entities present and assigned to a DIV-1 subject area
- [ ] Each entity lists PK, significant attributes, and FKs
- [ ] Unique/natural keys and composite uniqueness enumerated
- [ ] Cascade-delete children identified; logical-only references flagged
- [ ] Shared column set (createdAt/updatedAt/createdBy/updatedBy/version/deletedAt/tenantId) documented
- [ ] Audit/soft-delete/tenancy marked **defined-but-not-fully-enforced** (honest)
- [ ] Cross-reference validation: entities are a strict elaboration of **DIV-1** concepts
- [ ] Cross-reference validation: every entity maps to a physical table in **DIV-3**
- [ ] Cross-reference validation: attribute names reconcile with **AV-2** dictionary
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have models/fields changed in `schema.prisma` since the last revision?
- Has any cross-cutting column moved from Partial to Enforced (re-check extensions)?
- Did `OPERATIONAL_MODELS`/`TENANT_MODELS` membership change?

**Generation order**

1. Subject-area entity tables → 2. Keys/RI → 3. Relationship matrix →
4. Shared column set → 5. Normalization → 6. Data-quality rules.

**Pitfalls**

- Do **not** introduce PostgreSQL types, DDL, or index internals (that is DIV-3).
- Do **not** claim tenant isolation/audit stamping are enforced — they no-op
  without an authenticated request context (auth not wired).
- Distinguish **User** (auth) from **Staff** (HR) and **ClientPortalAccess**.
- Keep `version`/`deletedAt`/`tenantId` listed as Partial/Defined, not Enforced.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.DIV-1.itto.md` | Parent conceptual model; supplies subject areas/concepts |
| `template.DIV-3.itto.md` | Consumes entities/keys into physical tables and indexes |
| `template.AV-2.itto.md` | Supplies canonical entity/attribute definitions |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Data and Information Viewpoint |
| Primary Output | `architecture/template.DIV-2.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
