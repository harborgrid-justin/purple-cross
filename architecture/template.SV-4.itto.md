# SV-4: Systems Functionality Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-4 Systems Functionality Description**
for Purple Cross is produced, validated, and consumed. SV-4 decomposes the system
functions hosted on S2 (the Express API) — the cross-cutting middleware pipeline
(SF-A/SF-E), the 12 core and 22 extended module functions (SF-B/SF-C), and the
platform/utility functions (SF-D) — into a hierarchy and a catalog with stable
SF-x IDs. Use this document when refreshing SV-4 or re-deriving it from code.

> ⚠️ **Honesty note.** SV-4 must record functions that exist-but-are-unenforced
> or unused: SF-AUTHZ (RBAC, few routes), SF-TENANT (absent), SF-CRYPTO (0 fields),
> SF-AUDIT (~7/34 services), SF-RESIL (circuit breaker/retry — **dead code**).
> These appear so downstream traceability (SV-5a) does not over-claim.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Express app wiring | `../backend/src/app.ts` | Middleware order, route mounting | Derive SF-A pipeline + module mounts |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules + utility services | Enumerate SF-B/SF-C/SF-D |
| Services + middleware | `backend/src/services/`, `backend/src/middleware/` | Implementing artifacts | Map each SF to a file |
| Prisma schema | `../backend/prisma/schema.prisma` | Models per module | Populate primary model column |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Flag PLANNED/PARTIAL/DEAD CODE |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Swagger config | `backend/src/config/swagger.ts` | OpenAPI generation | Document SF-E3 |
| Health routes | `backend/src/routes/health.routes.ts` | Probe set | Document SF-E1 |
| Bull Board / logger / Sentry config | `backend/src/config/*` | Ops functions | Document SF-E4/E5/E6 |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Function decomposition tree | Render SF-0 → SF-A/B/C/D/E hierarchy |
| Function cataloging | Tabulate ID, name, implementing artifact, status |
| Layered-pattern mapping | route→controller→service→Prisma per module |
| Middleware-order fidelity | SF-A sequence must match `app.ts` |
| Status flagging | LIVE / PARTIAL / PLANNED / DEAD CODE per function |
| DoDAF 2.02 SV-4 conventions | Functions only; trace to activities in SV-5a |

---

## Outputs

### Primary Output

- `architecture/template.SV-4.md` — the Systems Functionality Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Function IDs (SF-A..SF-E, SF-B/C/D) | SV-5a (activity→function), SV-6 |
| Module→model mapping | SV-6, DIV-3 |
| Gap flags on functions | SV-5a/5b reviewers, SvcV-4 |

---

## File Generation Workflow

1. Read `app.ts` to derive the SF-A pipeline order and module mounts.
2. Enumerate core (SF-B01–12) and extended (SF-C01–22) module functions.
3. Add utility/platform functions (SF-D) and observability functions (SF-E).
4. Build the function hierarchy tree (SF-0 root).
5. Tabulate catalogs: cross-cutting, modules, utilities — with implementing files.
6. Flag unenforced/unused functions honestly.
7. Add behavior notes and cross-references; apply header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-4-2026`).
- [ ] SF-A middleware order matches `app.ts` exactly.
- [ ] All 12 core + 22 extended module functions catalogued with mounts/models.
- [ ] Utility functions (cache, domain-events, job queue, webhook delivery, workflow engine, integration adapters) present.
- [ ] SF-AUTHZ/SF-TENANT/SF-CRYPTO/SF-AUDIT/SF-RESIL flagged honestly.
- [ ] `/metrics` noted as in-memory JSON (not Prometheus); Swagger as OpenAPI 3.0.3.
- [ ] **Cross-ref validation:** SF IDs reused in SV-5a/SV-6; modules align with OV-5a activities;
      models align with DIV-3; functions align with SvcV-4.

---

## LLM Guidance

- Keep SV-4 about **functions**, not flows (SV-2) or matrices (SV-3).
- Reuse SF-x IDs verbatim in SV-5a and SV-6.
- Preserve real file paths and module mounts; do not invent services.
- Never mark SF-AUTHZ/SF-TENANT/SF-CRYPTO as fully enforced; SF-RESIL is dead code.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-1.itto.md` | S2 subsystem decomposition |
| `template.SV-5a.itto.md` | Activity → function traceability |
| `template.SV-6.itto.md` | Endpoint realization of functions |
| `template.SvcV-4.itto.md` | Service functionality (complementary) |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-4 Systems Functionality Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
