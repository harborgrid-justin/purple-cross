# CV-7: Capability to Services Mapping — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-7 Capability to Services Mapping** is produced.
CV-7 traces each CV-2 capability to the Express REST service module(s)
(`route → controller → service → Prisma`) that implement it under `/api/v1`,
cross-referenced to the Services Viewpoint (SvcV).

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-2 Taxonomy | `architecture/template.CV-2.md` | CAP-x.y IDs + modules | Capability rows |
| Routes directory | `../backend/src/routes/` | Express route files | Confirm implementing services |
| Services directory | `../backend/src/services/` | Service classes | Confirm real Prisma logic |
| SvcV-1 Services Context | `architecture/template.SvcV-1.md` | Service inventory | Align service names |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OpenAPI spec | swagger-jsdoc `/api-docs` | Endpoint contracts | Verify exposed services |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational | Flag PLANNED/unused services |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII realization diagram; mapping table
- Codebase grep/read over `routes/` and `services/`
- Git for version control

**Techniques**

- Capability-to-service realization mapping
- Service implementation attribute tabulation (protocol, validation, persistence)
- Gap/caveat registration (auth unwired, resilience unused)
- Coverage summary by domain

---

## Outputs

**Primary artifact:** `architecture/template.CV-7.md`

**Supporting outputs**

- Capability-to-service mapping table (consumed by SvcV-1/4/5)
- Service gaps & caveats register
- Coverage summary (37 modules)

---

## File Generation Workflow

1. **Inherit** — Load CAP IDs + module assignments from CV-2.
2. **Verify** — Grep `routes/` and `services/` to confirm each service exists.
3. **Map** — Tie each capability to its implementing module(s).
4. **Attribute** — Tabulate protocol, validation, persistence, observability.
5. **Caveat** — Register auth/RBAC/tenancy/audit/resilience gaps.
6. **Summarize** — Build per-domain coverage summary.
7. **Cross-link** — Reference CV-2, CV-4, CV-6, SvcV-1/4/5, SV-1.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-7-2026`)
- [ ] Every CV-2 capability maps to at least one real service module
- [ ] All 37 modules accounted for in the mapping/coverage
- [ ] `auth` service flagged as present but wired to 0 routes (PLANNED)
- [ ] Resilience utilities (circuit-breaker/retry) noted as unused
- [ ] Payments noted as absent (no Stripe SDK)
- [ ] Cross-reference validation: CV-2, CV-4, CV-6, SvcV-1, SV-1 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Were any new service modules added under `backend/src/routes`?
- Has `auth.ts` been wired to any routes yet?
- Did any service begin writing AuditLog or applying field-crypto?

**Generation order**

1. Realization overview → 2. Mapping table → 3. Attributes →
4. Gaps/caveats → 5. Coverage summary.

**Pitfalls**

- Keep service/module names identical to CV-2 and SvcV-1.
- Do not claim auth/RBAC/tenancy/audit are enforced.
- Do not map a payments service — none exists.
- Keep the module count honest at 37.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-2.itto.md` | Supplies CAP IDs + module assignments |
| `template.CV-6.itto.md` | Activities the mapped services execute |
| `template.SvcV-1.itto.md` | Authoritative service inventory |
| `template.SvcV-5.itto.md` | Activity-to-service traceability |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-7.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
