# SvcV-4: Services Functionality Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-4 Services Functionality Description** artifact
is produced and maintained. SvcV-4 decomposes every `SVC-x` service (from SvcV-1)
into its core **operations** — CRUD plus domain-specific operations — with function
IDs (`SFN-x`) and honest real/placeholder annotations. It is the functional
backbone the SvcV-5 traceability matrix maps operational activities onto.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-1 service catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry + domains | Provide the services to decompose |
| Controllers | `../backend/src/controllers/*.controller.ts` | Exposed operation handlers | Enumerate per-service operations |
| Services (business logic) | `../backend/src/services/*.service.ts` | Domain operations (book, issue, refill…) | Identify non-CRUD operations |
| Routes | `../backend/src/routes/*.routes.ts` | HTTP verbs/paths + Joi validation | Confirm operation surface + validation |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark unwired/placeholder operations |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OpenAPI spec | `swagger-jsdoc` at `/api-docs` | Operation contracts | Validate operation naming |
| SV-4 system functions | `architecture/template.SV-4.md` | System function decomposition | Align service ops to system functions |
| Constants | `../backend/src/constants/index.ts` | Status/field enums | Ground domain operations (status transitions) |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII functional-decomposition tree
- Codebase grep over `controllers/` and `services/` for operation methods
- Git for version control of the architecture folder

**Techniques**

- Functional decomposition (service → operations) with `SFN-x` IDs
- CRUD-plus-domain-operation classification
- Cross-cutting concern factoring (validation, auth, audit, caching)
- Honesty annotation (PLANNED / Aspirational / PARTIAL / IN PROGRESS / manual)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-4.md`

**Supporting outputs**

- `SFN-x` operation registry (consumed by SvcV-5 traceability)
- Functional decomposition tree reused by CV-7
- Cross-cutting concern table (auth/audit/crypto gaps)

---

## File Generation Workflow

1. **Inherit** — Pull `SVC-x` registry and domains from SvcV-1.
2. **Enumerate** — List each service's controller/service operations.
3. **Classify** — Separate CRUD from domain operations; assign `SFN-x`.
4. **Tree** — Draw the functional-decomposition tree by domain.
5. **Catalog** — Tabulate operations with reality markers.
6. **Factor concerns** — Tabulate validation/auth/audit/caching/resilience.
7. **Annotate honesty** — Auth unwired, payments manual, crypto no-op.
8. **Cross-link** — SvcV-1/2/3b/5, SV-4, OV-5a, CV-7.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-4-2026`, v1.0.0)
- [ ] Every `SVC-x` decomposed into operations with an `SFN-x` ID
- [ ] Domain operations (book/issue/refill/promote/void) captured, not just CRUD
- [ ] Auth operations (SFN-25) marked PLANNED/unwired
- [ ] record-payment / settle-refund marked manual/aspirational
- [ ] encrypt-field marked no-op (0 fields); audit-write partial (~7/34)
- [ ] Cross-cutting concern table present
- [ ] Cross-reference validation: SV-4, OV-5a, CV-7, SvcV-5 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Were new operations added to any controller/service since last revision?
- Has auth enforcement been applied to any operation?
- Did record-payment/settle-refund gain a real gateway call?

**Generation order**

1. Decomposition tree → 2. Functionality catalog → 3. Cross-cutting concerns →
4. Honesty notes → 5. Cross-references.

**Pitfalls**

- Do not present auth operations as enforced — they gate 0 routes.
- record-payment stores manually; settle-refund is aspirational.
- encrypt-field is a no-op; do not claim PHI/PII operations encrypt.
- Frontend wires only ~15–20% of operations — mark the rest IN PROGRESS.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-1.itto.md` | Provides the `SVC-x` services to decompose |
| `template.SvcV-5.itto.md` | Maps operational activities onto `SFN-x` operations |
| `template.SvcV-3b.itto.md` | Dependencies originated by these operations |
| `template.SV-4.itto.md` | System functions realizing service operations |
| `template.CV-7.itto.md` | Capabilities realized by these operations |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-4.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
