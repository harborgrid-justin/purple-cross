# SV-10a: Systems Rules Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-10a Systems Rules Model** for Purple Cross is
produced, validated, and consumed. SV-10a enumerates the *technical* system-level
rules (SR-*) — correlation IDs, request context, timeout, rate limiting, input
sanitization, soft-delete filtering, Joi validation, structured error handling,
strict-TypeScript, plus the defined-but-unenforced security/tenancy/audit/crypto
rules — with each rule's enforcement point and status. Use this when a middleware
or Prisma extension changes, or when a PLANNED rule becomes enforced.

> ⚠️ **Honesty note.** SV-10a must distinguish ENFORCED from PLANNED/PARTIAL.
> Authentication (SR-18), RBAC (SR-19), tenant scoping (SR-20), field encryption
> (SR-22), and resilience (SR-23) are **not enforced**; audit (SR-21) and the
> admin guard (SR-25) are **partial**. Do not mark these ENFORCED.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Express app | `backend/src/app.ts` | middleware order, admin guard | Ground SR-01…SR-14, pipeline order |
| Middleware dir | `backend/src/middleware/*` | correlation, timeout, rate-limit, sanitize, validation, auth, error | Ground per-rule enforcement points |
| Prisma extensions | `backend/prisma/*`, client setup | soft-delete/tenant/audit/crypto | Ground SR-11/20/21/22 status |
| Constants | `backend/src/constants/index.ts` | timeout, rate-limit values | Ground SR-04/07/09 |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | enforcement reality | Mark PLANNED/PARTIAL honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Logger / PII redact | `config/logger.ts`, `utils/pii-redact.ts` | log redaction | Ground SR-15 |
| ESLint / tsconfig | repo configs | zero-`any`, strict mode | Ground SR-16 |
| Auth utils | `utils/jwt.ts`, `middleware/auth.ts` | unused enforcement | Ground SR-18/19 |
| Resilience utils | `utils/circuit-breaker.ts`, `retry.ts` | dead code | Ground SR-23 |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Rule cataloging | Assign stable SR-* IDs with type + enforcement point |
| Pipeline ordering | Sequence rules as the middleware chain executes |
| Status classification | ENFORCED / PARTIAL / PLANNED per rule |
| Dependency/conflict analysis | Encode RD-* notes (auth before tenant, etc.) |
| ASCII pipeline diagram | Visualize rule order with PLANNED markers |
| Honesty annotation | Flag unenforced security/tenancy/crypto rules |

---

## Outputs

### Primary Output

- `architecture/template.SV-10a.md` — the Systems Rules Model.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| SR-* rule register | SV-10b/10c, SV-8 (status flips), audits |
| Dependency notes (RD-*) | Release sequencing, SV-8 SEQ-* |
| Honest gap summary | Gap-analysis maintainers, SV-8 |

---

## File Generation Workflow

1. Read `app.ts` to capture middleware order verbatim.
2. Inspect each middleware/util/Prisma extension for enforcement reality.
3. Enumerate rules with stable SR-* IDs, type, enforcement point, status.
4. Draw the enforcement-pipeline ASCII with PLANNED markers.
5. Record dependency/conflict notes (RD-*).
6. Write the honest gap summary tied to SV-8 phases.
7. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-10a-2026`, v1.0.0).
- [ ] Every rule has SR-* ID, type, enforcement point, and status.
- [ ] Middleware order matches `app.ts` exactly.
- [ ] Auth/RBAC/tenant/crypto rules marked PLANNED; audit/admin-guard PARTIAL.
- [ ] Soft-delete, sanitize, Joi, timeout, rate-limit, AppError marked ENFORCED.
- [ ] **Cross-ref validation:** rules align with OV-6a (business counterpart),
      constrain SV-4 functions, gate SV-10b transitions, appear in SV-10c
      traces, and flip status per SV-8 / enabling tech per SV-9.
- [ ] Closing classification footer present.

---

## LLM Guidance

- Never upgrade a PLANNED/PARTIAL rule to ENFORCED without code evidence.
- Preserve the exact middleware order from `app.ts`.
- Keep SR-* and RD-* IDs stable across revisions.
- Distinguish system rules (here) from business rules (OV-6a).
- If referencing LLM/provider features, consult the repo's LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-10b.itto.md` | State machines gated by these rules |
| `template.SV-10c.itto.md` | Event traces exercising the SR-* pipeline |
| `template.SV-8.itto.md` | Roadmap flipping PLANNED rules to ENFORCED |
| `template.SV-9.itto.md` | Technology enabling enforcement (auth/crypto) |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-10a.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
