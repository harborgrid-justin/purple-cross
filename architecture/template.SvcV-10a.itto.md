# SvcV-10a: Services Rules Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-10a Services Rules Model** artifact is
produced and maintained. SvcV-10a captures the service-contract invariants every
`/api/v1` service is expected to honor — versioning, Joi-before-controller
validation, response/error envelope shape, pagination defaults, idempotency,
rate limiting, authentication/authorization, tenancy isolation, webhook signing,
soft-delete, server-side financial computation, and resilience — each with its
scope, enforcement point, and honest status (Enforced / Partial / PLANNED). It
is the rule layer underpinning SvcV-6 contracts and SvcV-10b/10c behavior.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Middleware stack | `../backend/src/middleware/` | validation, correlation-id, rate-limiter, sanitization, timeout, error-handler | Identify enforcement points |
| App setup | `../backend/src/app.ts` | `/api/v1` mounting, `/api-docs`, `/metrics`, `/health` | Confirm versioning + doc rules |
| Refactor helper | `../backend/src/utils/refactor-helper.ts` | `ServiceHelper`/`ControllerHelper` envelopes | Ground response/error rules |
| Constants | `../backend/src/constants/index.ts` | `PAGINATION`, error codes, `TIME` | Ground pagination/timeout rules |
| Prisma schema | `../backend/prisma/schema.prisma` | `deletedAt`, `tenantId`, AuditLog | Ground soft-delete/tenancy/audit |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Unwired auth, unscoped tenancy, plaintext PHI | Mark PLANNED/Partial honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-6 matrix | `architecture/template.SvcV-6.md` | Contract conventions | Trace rules to contracts |
| SvcV-8 evolution | `architecture/template.SvcV-8.md` | Phase plan | Set rule enforcement maturity |
| OV-6a rules | `architecture/template.OV-6a.md` | Operational business rules | Trace service rules to ops rules |
| webhook/resilience code | `webhook-delivery.service`, `circuit-breaker.ts` | Signing, breakers | Ground SvcR-17/SvcR-20 |

---

## Tools & Techniques

**Tools**

- Markdown table authoring for the rule register
- Codebase inspection of middleware and service helpers
- Git for version control

**Techniques**

- Contract-invariant extraction (one `SvcR-nn` per rule)
- Enforcement-point attribution (which middleware/layer enforces each rule)
- Honest status labeling (Enforced / Partial / PLANNED)
- Rule categorization + phase-based enforcement-maturity scoring
- Violation-handling mapping (rule → detection → HTTP response)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-10a.md`

**Supporting outputs**

- `SvcR-nn` rule register (referenced by SvcV-6/10b/10c and audits)
- Rule-category summary and enforcement-maturity-by-phase table
- Violation-handling table (HTTP semantics per rule)

---

## File Generation Workflow

1. **Extract rules** — Derive invariants from middleware, helpers, constants, schema.
2. **Attribute enforcement** — Name the code point that enforces each rule.
3. **Status** — Label Enforced / Partial / PLANNED per honest reality.
4. **Categorize** — Group rules (contract, validation, security, data, integration).
5. **Phase maturity** — Map PLANNED rules to PI-3/PI-4 (per SvcV-8).
6. **Violations** — Map each rule to detection + HTTP response.
7. **Cross-link** — Reference SvcV-6/7/8/10b/10c, SV-10a, OV-6a.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-10a-2026`, v1.0.0)
- [ ] Each rule has Scope, Enforcement point, and Status columns
- [ ] `/api/v1` versioning, Joi-before-controller, envelope rules Enforced
- [ ] Pagination defaults, rate limit 100/15min, 30s timeout Enforced
- [ ] Auth (SvcR-08), RBAC (SvcR-09), tenancy (SvcR-10) marked PLANNED
- [ ] PHI/PII crypto (SvcR-15) PLANNED; audit (SvcR-13) Partial
- [ ] Webhook signing (SvcR-17) and soft-delete (SvcR-18) Enforced
- [ ] Circuit-breaker rule (SvcR-20) PLANNED (utils unused)
- [ ] Cross-reference validation: SvcV-6, SvcV-10b/10c, SV-10a, OV-6a named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Has auth/RBAC/tenancy middleware been mounted (flip PLANNED→Enforced)?
- Did field-crypto get applied to any fields?
- Did Bull Board get an auth gate?

**Generation order**

1. Contract rules → 2. Categories → 3. Enforcement maturity →
4. Violations → 5. Cross-references.

**Pitfalls**

- Do **not** label PLANNED rules as Enforced; this is the integrity of the doc.
- Keep `SvcR-nn` IDs stable; SvcV-10b/10c and audits reference them.
- Idempotency (SvcR-07) is only partial — do not overstate for payments.
- Server-side financial computation (SvcR-19) is real — keep it Enforced.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-6.itto.md` | Contracts these rules govern |
| `template.SvcV-10b.itto.md` | State transitions constrained by rules |
| `template.SvcV-10c.itto.md` | Event traces honoring event/webhook rules |
| `template.SV-10a.itto.md` | Underlying systems rules model |
| `template.OV-6a.itto.md` | Operational business rules |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-10a.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
