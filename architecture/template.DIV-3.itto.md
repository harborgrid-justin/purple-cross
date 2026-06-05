# DIV-3: Physical Data Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **DIV-3 Physical Data Model** artifact is produced
and maintained. DIV-3 realizes the logical model (**DIV-2**) in **PostgreSQL 15**
via **Prisma ORM 6.18**: table mapping, type mapping, the ~134 declared indexes,
constraints, the cross-cutting client extensions (field-crypto, tenant,
soft-delete, audit), migrations, connection pooling, and Redis-as-cache. It is
the most implementation-coupled DIV artifact and must be re-derived whenever
`schema.prisma`, the migrations, or the extensions change. It is honest about the
**plaintext-PHI** and **unenforced-tenancy** gaps.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Models, `@@map`, `@@index`, `@unique`, types, enum | Authoritative physical mapping source |
| Migrations | `../backend/prisma/migrations/` | Generated DDL, migration ordering, lock file | Ground table/index/constraint DDL and history |
| Prisma extensions | `../backend/src/config/prisma-extensions/` | field-crypto, tenant, soft-delete, audit, models | Document physical runtime behaviors honestly |
| DB client config | `../backend/src/config/database.ts` | Extension composition order, pool/client setup | Confirm what is wired and how |
| DIV-2 Logical Model | `architecture/template.DIV-2.md` | Entities, keys, shared columns | Map each entity to a table/constraints |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| docker-compose / env | `../docker-compose.yml`, `../backend/.env.example` | PG/Redis versions, `DATABASE_URL` | Topology, pooling, versions |
| Field-crypto util | `prisma-extensions/field-crypto.ts` | `ENCRYPTED_FIELDS` map | Enumerate exactly which columns are encrypted |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Calibrate the risk register |

---

## Tools & Techniques

**Tools**

- Markdown authoring; SQL/DDL code blocks; ASCII index tables
- `grep`/`read` over `schema.prisma`, migrations, and extensions
- `prisma migrate status` / generated SQL for DDL grounding
- Git for version control

**Techniques**

- `@@map` table-name extraction; Prisma→Postgres type mapping
- Index inventory and pattern classification (FK / tenant / soft-delete / status / temporal / natural-key)
- Constraint cataloging (PK/FK/unique/composite-unique/enum/cascade)
- Representative DDL synthesis from a core table
- Extension behavior tracing with enforcement-status grading
- Risk-register construction (plaintext PHI, unenforced tenancy, float-currency)

---

## Outputs

**Primary artifact:** `architecture/template.DIV-3.md`

**Supporting outputs**

- Table-mapping table (model → `@@map`)
- Index strategy + representative index inventory
- Representative DDL example (consumed by DBAs / reviewers)
- Extension-behavior + physical-security-posture tables
- Physical risk register (referenced by SV-7 measures / security reviews)

---

## File Generation Workflow

1. **Map tables** — Extract every model's `@@map` snake_case table name.
2. **Map types** — Build the Prisma→PostgreSQL type table (incl. jsonb, text[]).
3. **Inventory indexes** — Enumerate `@@index`/`@unique`; classify by pattern.
4. **Catalog constraints** — PK/FK/unique/composite/enum/cascade/not-null.
5. **Synthesize DDL** — Produce a representative table (e.g., `patients`).
6. **Trace extensions** — Document field-crypto/tenant/soft-delete/audit physically.
7. **Record migrations** — List migration dirs and the apply/drift workflow.
8. **Pooling/Redis** — Describe connection pool and Redis-as-cache boundary.
9. **Risk register** — Plaintext PHI, unenforced tenancy, float-currency, no CHECKs.
10. **Cross-link** — Reference DIV-2, DIV-1, AV-2.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-DIV-3-2026`, v1.0.0)
- [ ] Table mapping uses actual `@@map` names from `schema.prisma`
- [ ] Type mapping is accurate (UUID-as-text PK, `Float`→`double precision`, `Json`→`jsonb`)
- [ ] ~134 indexes represented; index patterns (tenantId/FK/status/date) called out
- [ ] Constraints include composite uniques and cascade deletes
- [ ] Representative DDL compiles conceptually and matches schema
- [ ] field-crypto documented as covering **only 4 MedicalRecord columns** — rest PLAINTEXT
- [ ] tenant/audit/soft-delete documented as wired-but-gated (no-op without auth context)
- [ ] Migrations list matches `prisma/migrations/` directory
- [ ] Redis documented as cache, **not** source of record
- [ ] Cross-reference validation: every table traces to a **DIV-2** entity
- [ ] Cross-reference validation: shared columns match **DIV-2 §5**
- [ ] Cross-reference validation: column definitions reconcile with **AV-2**
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have new migrations been added since the last revision?
- Did `ENCRYPTED_FIELDS` expand beyond the four MedicalRecord columns?
- Was auth wired (would flip tenant/audit from no-op to enforced)?
- Did any column type change (e.g., `Float`→`Decimal` for currency)?

**Generation order**

1. Table mapping → 2. Type mapping → 3. Indexes → 4. Constraints →
5. DDL example → 6. Extensions → 7. Migrations → 8. Pooling/Redis → 9. Risks.

**Pitfalls**

- Do **not** claim broad at-rest encryption — only 4 columns are encrypted.
- Do **not** claim tenant isolation is enforced — the extension no-ops without
  an authenticated request context (auth not wired).
- Use real `@@map` names; do not invent table names.
- Keep Redis strictly a cache; PostgreSQL is the sole system of record.
- Note `Float`-for-currency as a real precision risk, not a recommendation.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.DIV-2.itto.md` | Parent logical model; supplies entities/keys/shared columns |
| `template.DIV-1.itto.md` | Conceptual model; subject-area traceability |
| `template.AV-2.itto.md` | Supplies canonical column/entity definitions |
| `template.SV-7.itto.md` | Consumes physical risk/measures into systems measures |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Data and Information Viewpoint |
| Primary Output | `architecture/template.DIV-3.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
