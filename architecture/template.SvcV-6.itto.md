# SvcV-6: Services Resource Flow Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-6 Services Resource Flow Matrix** artifact is
produced and maintained. SvcV-6 decomposes the graphical flows of SvcV-2 into
concrete, tabular **interface contracts** for the Purple Cross REST API services
under `/api/v1`: representative endpoints (method + path), request/response
payload shape, Joi validation applied, the triggering event, and the downstream
effects (Prisma tables written, domain events emitted, external calls made). It
also tabulates shared platform services and external/consumed services. The
matrix is the row-level evidence base that SvcV-7 (measures), SvcV-10a (rules),
SvcV-10b (state) and SvcV-10c (event traces) build upon.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Route definitions | `../backend/src/routes/*.routes.ts` | Method/path, mounted Joi `validate*` middleware | Enumerate endpoints and validation per route |
| Controllers | `../backend/src/controllers/*.controller.ts` | Request/response handling, status codes | Confirm response envelope + status codes |
| Services | `../backend/src/services/*.service.ts` | Prisma writes, domain-event emits, external calls | Populate DB write / Events / Ext columns |
| Prisma schema | `../backend/prisma/schema.prisma` | Model/table names, soft-delete (`deletedAt`) | Ground "DB write" targets |
| Constants | `../backend/src/constants/index.ts` | `PAGINATION`, `HTTP_STATUS`, error codes | Ground common interface conventions |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Per-row honesty notes |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-1 catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry | Map each RF row to owning service |
| SvcV-2 flow description | `architecture/template.SvcV-2.md` | Aggregated flows | Identify flows to decompose |
| OpenAPI spec | swagger-jsdoc at `/api-docs` | Endpoint contracts | Validate literal method/path |
| SV-6 matrix | `architecture/template.SV-6.md` | Systems resource flow rows | Align service rows to system flows |

---

## Tools & Techniques

**Tools**

- Markdown table authoring for the resource-flow matrix
- Codebase grep over `routes/`, `controllers/`, `services/` to confirm contracts
- Prisma schema inspection for model/table names
- Git for version control of the architecture folder

**Techniques**

- Interface-contract decomposition (one RF row per representative endpoint)
- Trigger → DB-write → event → external-call causal chaining per row
- Stable `RF-nnn` identifier assignment (cross-referenced by SvcV-10c)
- Resource-flow sensitivity classification (Clinical/Financial/PII/Operational)
- Honesty annotation in a dedicated Notes column and a Gaps table

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-6.md`

**Supporting outputs**

- `RF-nnn` resource-flow registry (consumed by SvcV-7, SvcV-10b, SvcV-10c)
- Common interface conventions table (envelope, validation, pagination, tracing)
- Resource-flow classification summary (sensitivity vs encryption today)
- Gaps-and-honest-status table feeding SvcV-7/8 roadmaps

---

## File Generation Workflow

1. **Enumerate** — List `routes/` to extract method/path + validation per module.
2. **Trace** — For each endpoint, follow controller → service to record DB writes, events, external calls.
3. **Group** — Organize rows by service domain (core, extended, shared, external).
4. **Assign IDs** — Allocate stable `RF-nnn` identifiers.
5. **Classify** — Tag each flow's sensitivity and current encryption posture.
6. **Annotate honesty** — Flag auth-unwired, tenancy, PHI plaintext, payments aspirational.
7. **Cross-link** — Reference SvcV-1/2/4/7/10a/10b/10c and SV-6.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-6-2026`, v1.0.0)
- [ ] Method + path columns are literal and prefixed `/api/v1/`
- [ ] Each row records validation (validate/validateQuery/validateParams)
- [ ] DB write column names real Prisma models from `schema.prisma`
- [ ] Domain events and external calls grounded in service code
- [ ] Common conventions table present (envelope, error, pagination, tracing)
- [ ] Auth marked PLANNED; tenantId unscoped; PHI/PII plaintext noted
- [ ] Payment Provider rows marked aspirational (no SDK)
- [ ] Cross-reference validation: SvcV-1, SvcV-4, SvcV-7, SvcV-10b/10c, SV-6 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have any endpoints/paths changed under `routes/` since last revision?
- Did any service start emitting new domain events or external calls?
- Has any external integration (Payment, External Lab) moved from PLANNED to wired?

**Generation order**

1. Conventions → 2. Core matrix → 3. Extended matrix → 4. Shared services →
5. External services → 6. Classification → 7. Gaps → 8. Cross-references.

**Pitfalls**

- Do **not** invent endpoints; only list contracts present in `routes/`.
- Keep `RF-nnn` IDs stable; SvcV-10c sequence diagrams reference them.
- Do not imply auth/tenancy is enforced — it is not.
- Mark Payment Provider and External Lab as aspirational/PLANNED, not LIVE.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-2.itto.md` | Graphical flows this matrix decomposes |
| `template.SvcV-4.itto.md` | Service functions invoked by these endpoints |
| `template.SvcV-7.itto.md` | Measures/SLOs over these resource flows |
| `template.SvcV-10b.itto.md` | State machines driven by these endpoints |
| `template.SvcV-10c.itto.md` | Event traces referencing `RF-nnn` rows |
| `template.SV-6.itto.md` | Underlying systems resource flow matrix |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-6.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
