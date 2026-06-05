# SvcV-1: Services Context Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-1 Services Context Description** artifact is
produced and maintained. SvcV-1 establishes the Purple Cross **services
landscape**: the six service domains, the `SVC-x` catalog of REST API services,
shared platform services, external/consumed services, and the consumers that
reach them through the `/api/v1` gateway. It is the entry point of the Services
Viewpoint and seeds the `SVC-x` identifier scheme reused across SvcV-2..5.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Route inventory | `../backend/src/routes/*.routes.ts` | 37 mounted modules + prefixes | Enumerate exposed services and endpoint prefixes |
| Service inventory | `../backend/src/services/*.service.ts` | Business-logic units incl. shared (cache, domain-events, webhook, workflow) | Identify shared/utility services |
| App/gateway setup | `../backend/src/app.ts` | `/api/v1` mounting, middleware, `/api-docs`, `/metrics`, `/health` | Define the gateway and cross-cutting context |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED / IN PROGRESS honestly |
| Repository guidance | `../CLAUDE.md` | Module catalog, stack, external providers | Ground domains and consumers |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| AV-1 Overview | `architecture/template.AV-1.md` | Scope, external interfaces | Inherit external-system list and scope |
| SV-1 Interfaces | `architecture/template.SV-1.md` | System nodes S1–S5 | Align service hosting with systems |
| OpenAPI spec | `swagger-jsdoc` output at `/api-docs` | Endpoint contracts | Validate endpoint prefixes |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII diagramming for the services context diagram
- Codebase `ls`/grep over `routes/` and `services/` to confirm module set
- Git for version control of the architecture folder

**Techniques**

- Service-domain decomposition (D1 Clinical … D6 External/Consumed)
- Stable `SVC-x` identifier assignment (catalog as registry)
- Consumer-to-gateway-to-service context modeling
- Honesty annotation (PLANNED / IN PROGRESS / Aspirational / PARTIAL)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-1.md`

**Supporting outputs**

- `SVC-x` service registry (consumed by SvcV-2, SvcV-3a/3b, SvcV-4, SvcV-5)
- Service-domain taxonomy (D1–D6) reused across the Services Viewpoint
- Consumer list (SPA, client portal, webhook subscribers, ops probes)

---

## File Generation Workflow

1. **Inventory** — List `routes/` and `services/` to enumerate modules + shared services.
2. **Domain-group** — Assign each service to a domain (D1–D6).
3. **Register** — Allocate stable `SVC-x` IDs and endpoint prefixes.
4. **Diagram** — Draw consumer → gateway → domain → data-store context.
5. **Identify consumers** — SPA, portal, webhook subscribers, ops, worker.
6. **Annotate honesty** — Mark auth-unwired, tenancy, PHI crypto, payments.
7. **Cross-link** — Reference SV-1/SV-4, SvcV-2..5, OV-5a, CV-7.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-1-2026`, v1.0.0)
- [ ] Every mounted module appears in the catalog with an `SVC-x` ID
- [ ] Shared services (cache, domain-events, webhook-delivery, workflow-engine) included
- [ ] External services SendGrid/Twilio/Payment/Lab/Sentry present in D6
- [ ] Auth (SVC-25) marked PLANNED/unwired; portal (SVC-10) IN PROGRESS
- [ ] Payment Provider (SVC-33) marked Aspirational (no Stripe SDK)
- [ ] PHI/PII plaintext and tenant-unscoped noted
- [ ] Cross-reference validation: SV-1, SV-4, OV-5a, CV-7 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have any modules been added/removed under `routes/` since last revision?
- Has auth been wired to any route yet (re-check the gap analysis)?
- Did the client portal auth path converge with staff auth?

**Generation order**

1. Domains → 2. Context diagram → 3. Service catalog → 4. Consumers →
5. Honesty notes → 6. Cross-references.

**Pitfalls**

- Do **not** claim auth is enforced — it enforces 0 routes.
- Keep `SVC-x` IDs stable; downstream SvcV files depend on them.
- Do not invent a payment gateway integration — none is wired.
- Treat in-memory `/metrics` and unauth Bull Board as honest gaps.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-1.itto.md` | Systems that host the services |
| `template.SvcV-2.itto.md` | Consumes `SVC-x` registry into resource flows |
| `template.SvcV-3a.itto.md` | Consumes registry into systems-services matrix |
| `template.SvcV-4.itto.md` | Decomposes each `SVC-x` into operations |
| `template.CV-7.itto.md` | Capability-to-services mapping |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-1.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
