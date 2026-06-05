# SV-1: Systems Interface Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-1 Systems Interface Description** for
Purple Cross is produced, validated, and consumed. SV-1 enumerates the platform's
systems (S1 SPA, S2 Express API, S3 PostgreSQL, S4 Redis, S5 Worker) and external
systems (SendGrid, Twilio, Payment Provider, External Lab, Sentry), and the
interfaces (I1–I12) between them. It is the structural anchor for the rest of the
Systems Viewpoint. Use this document when refreshing SV-1 or re-deriving it from
the codebase.

> ⚠️ **Honesty note.** SV-1 must stay grounded in the real deployment. When an
> interface or system is aspirational (Payment Provider, External Lab interchange)
> or partially enforced (route-level RBAC, tenant scoping, at-rest encryption),
> SV-1 marks it **PLANNED / PARTIAL / GAP / DEAD CODE** rather than implying it is
> production-complete.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Express app wiring | `../backend/src/app.ts` | Middleware order, route mounting, auth guard, health/metrics/queues | Ground S2 subsystems and interface I1/I12 |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | 37 modules + utility services | Enumerate functions hosted on S2 |
| Deployment topology | `../docker-compose.yml` | postgres:5432, redis:6379, backend:3000, frontend:5173, nginx | Identify S3/S4/S5 and ports |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED/PARTIAL/GAP honestly |
| Auth middleware | `backend/src/middleware/auth.ts` | `authenticate` / `authorize` behavior | State auth posture accurately |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Swagger config | `backend/src/config/swagger.ts` | OpenAPI 3.0.3 spec generation | Document API contract standard |
| Cache / queue services | `backend/src/services/cache.service.ts`, BullMQ config | Redis usage, job broker | Confirm I3/I5 |
| Sentry config | `backend/src/config/sentry.ts` | `SENTRY_DSN` wiring | Confirm X5 / I10 |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII system interface diagram | Render S1–S5, external systems, and interfaces I1–I12 |
| System cataloging | Enumerate Sx with type, runtime, port |
| Subsystem decomposition | Break S2 into middleware/routing/service/data/integration tiers |
| Interface tabulation | Protocol, port, payload, security, status per interface |
| DoDAF 2.02 SV-1 conventions | Keep to systems + interfaces; defer flows to SV-2, matrix to SV-3 |
| Honesty annotation | Tag aspirational/partial interfaces with status flags |

---

## Outputs

### Primary Output

- `architecture/template.SV-1.md` — the Systems Interface Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| System IDs (S1–S5, X1–X5) | SV-2, SV-3, SV-4, SV-5b, SV-6 |
| Interface IDs (I1–I12) | SV-2, SV-3, SV-6 |
| Subsystem decomposition of S2 | SV-4 function hierarchy |
| Honesty/gap table | SV-5a/5b reviewers, SvcV-1 |

---

## File Generation Workflow

1. Read `app.ts`, `docker-compose.yml`, and the gap analysis to fix scope and honesty posture.
2. Enumerate systems S1–S5 and external systems X1–X5; classify internal vs external.
3. Draw the ASCII system interface diagram (external → platform → data tier).
4. Author the systems catalog with runtimes and ports.
5. Decompose S2 into subsystems aligned to the middleware stack.
6. Tabulate interfaces I1–I12 with protocol/port/payload/security/status.
7. Add deployment/physical view from `docker-compose.yml`.
8. Add honesty/gap table and cross-references to SV/OV/SvcV siblings.
9. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-1-2026`).
- [ ] All systems have stable IDs (S1–S5, X1–X5) reused across the SV series.
- [ ] All interfaces have stable IDs (I1–I12) with protocol, port, payload, security.
- [ ] Middleware order matches `app.ts` exactly.
- [ ] External systems shown: SendGrid, Twilio, Payment Provider, External Lab, Sentry.
- [ ] nginx reverse proxy noted for production.
- [ ] Aspirational/partial elements flagged PLANNED/PARTIAL/GAP/DEAD CODE.
- [ ] **Cross-ref validation:** system IDs reused consistently in SV-2/SV-3/SV-4/SV-5b/SV-6;
      operational nodes align with OV-2; data tier aligns with DIV-3; services align
      with SvcV-1/SvcV-2.

---

## LLM Guidance

- Keep SV-1 **structural** — do not duplicate SV-2 flow detail or SV-3 matrix cells.
- Never upgrade a PLANNED interface (Payment Provider, External Lab) to "done".
- State auth honestly: `authenticate` **is** wired globally and verifies JWTs, but
  route-level RBAC, tenant scoping, and at-rest encryption are PLANNED/PARTIAL.
- Reuse system IDs (S1–S5) verbatim across SV-2/SV-3/SV-4/SV-5b/SV-6.
- Prefer real ports (3000/5432/6379) and real module names.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.AV-1.itto.md` | Parent context/summary |
| `template.SV-2.itto.md` | Resource flows over SV-1 interfaces |
| `template.SV-3.itto.md` | Systems-Systems matrix derived from SV-1 |
| `template.SV-4.itto.md` | Functional decomposition of S2 |
| `template.SvcV-1.itto.md` | Services context hosted on S2 |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-1 Systems Interface Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
