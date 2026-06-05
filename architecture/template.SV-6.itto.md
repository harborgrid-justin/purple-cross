# SV-6: Systems Resource Flow Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-6 Systems Resource Flow Matrix** for
Purple Cross is produced, validated, and consumed. SV-6 specifies the discrete,
endpoint-level data exchanges over interface I1: representative REST endpoints
(`/api/v1/<resource>`), their triggers, request/response JSON payloads, and the
PostgreSQL tables touched in S3 — plus the internal/async exchanges over I3/I4/I5.
It is the most concrete SV artifact and the bridge to DIV-3. Use this document
when refreshing SV-6 or re-deriving it.

> ⚠️ **Honesty note.** Endpoints sit under the global `authenticate` guard, but
> route-level RBAC and tenant scoping are **PLANNED**; the "Tables" column reflects
> unscoped access today. Payment/lab exchanges are **PLANNED**; `AuditLog` writes
> occur in ~7/34 services only.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Route modules | `backend/src/routes/*.routes.ts` | Methods, paths, validation | Enumerate endpoints |
| Controllers/services | `backend/src/controllers/`, `backend/src/services/` | Request/response shapes, side-effects | Payloads + tables touched |
| Prisma schema | `../backend/prisma/schema.prisma` | Models/tables | "S3 Tables Touched" column |
| Express app wiring | `../backend/src/app.ts` | Mounts, auth guard, ops endpoints | Base paths, access posture |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Status | Flag PLANNED/PARTIAL, audit coverage |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Swagger spec | `/api-docs.json` / `backend/src/config/swagger.ts` | OpenAPI 3.0.3 | Confirm payload contracts |
| Validation schemas | `backend/src/middleware/validation.ts` + route Joi | Query/body params | Document list params |
| BullMQ / cache services | `backend/src/services/*` | Async/cache exchanges | Internal flow rows |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Endpoint inventory | Extract method+path per module |
| Resource-flow tabulation | Trigger, request, response, tables per endpoint |
| Side-effect tracing | Map service writes to Prisma tables (R/W) |
| Async/internal flow capture | I3/I4/I5 cache + BullMQ exchanges |
| Envelope/standardization | `{status,data,meta}` conventions section |
| DoDAF 2.02 SV-6 conventions | Interface-level detail; bridge to DIV-3 |

---

## Outputs

### Primary Output

- `architecture/template.SV-6.md` — the Systems Resource Flow Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Endpoint catalog | API consumers, integration tests, SvcV-6 |
| Endpoint→table mapping | DIV-3, data-impact analysis |
| Async/internal flow rows | SV-2 cross-check, capacity planning |

---

## File Generation Workflow

1. Read route modules to enumerate representative endpoints per module.
2. Read controllers/services to capture payloads and Prisma side-effects.
3. Build the core-module matrix, then the extended-module matrix.
4. Add internal/async (I3/I4/I5) and ops/docs endpoint tables.
5. Add the conventions section (base path, auth, envelopes, list params).
6. Flag PLANNED/PARTIAL exchanges and partial audit writes.
7. Add cross-references; apply header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-6-2026`).
- [ ] Endpoints use real `/api/v1/<resource>` paths and HTTP methods.
- [ ] Each row has trigger, request, response, and S3 tables touched.
- [ ] Tables map to real Prisma models (align with DIV-3).
- [ ] Async (BullMQ) and cache (Redis) flows captured.
- [ ] Ops endpoints noted: `/metrics` in-memory JSON, `/api-docs` OpenAPI 3.0.3, `/admin/queues` Bull Board, `/health/ready` checks PG+Redis.
- [ ] PLANNED/PARTIAL (payments, lab, audit) flagged.
- [ ] **Cross-ref validation:** interface I1 from SV-1; flows from SV-2; functions from SV-4;
      activities from SV-5a/5b; tables from DIV-3; complements SvcV-6.

---

## LLM Guidance

- Keep endpoints **representative**, not exhaustive — cover all core modules and a
  representative slice of extended modules.
- Use real model names in the tables column; do not invent tables.
- Mark `AuditLog` writes with the ~7/34 caveat; never imply universal audit.
- Never present payment/lab exchanges as live.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-2.itto.md` | Flows detailed at endpoint level here |
| `template.SV-4.itto.md` | Functions realized by these endpoints |
| `template.DIV-3.itto.md` | Physical tables touched |
| `template.SvcV-6.itto.md` | Service resource flow matrix |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-6 Systems Resource Flow Matrix |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
