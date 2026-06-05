# SvcV-9: Services Technology & Skills Forecast — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-9 Services Technology & Skills Forecast**
artifact is produced and maintained. SvcV-9 inventories the technologies that
enable the Purple Cross service tier today (Express, Joi, swagger-jsdoc/OpenAPI
3.0.3, Prisma, BullMQ, Axios, SendGrid/Twilio SDKs, Winston, Sentry), projects
the target stack (OpenTelemetry, Prometheus, API gateway, contract testing,
real Payment SDK, activated circuit breakers), and forecasts the **skills**
(API design, OpenAPI, integration engineering, security/OAuth, SRE, tenancy,
crypto) needed to deliver them. It is the standards/technology anchor for the
Services Viewpoint and pairs with SvcV-8's phased roadmap.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Backend package manifest | `../backend/package.json` | Express 4.18, Joi, Prisma 6.18, BullMQ, Axios, SendGrid/Twilio, jsonwebtoken | Ground current technology + versions |
| App setup | `../backend/src/app.ts` | Middleware, `/api-docs`, `/metrics`, `/health` | Confirm OpenAPI/observability tooling |
| Resilience utils | `../backend/src/utils/circuit-breaker.ts`, `retry.ts` | Exist but unused | Forecast activation (FT-11) |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Missing tooling, unwired auth | Distinguish current vs target |
| SvcV-8 evolution | `architecture/template.SvcV-8.md` | Phase themes | Sequence technology adoption by PI |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-7 measures | `architecture/template.SvcV-7.md` | SLO/observability gaps | Justify OTel/Prometheus forecast |
| SV-9 forecast | `architecture/template.SV-9.md` | Systems-level tech/skills | Align service-tier subset |
| AV-2 dictionary | `architecture/template.AV-2.md` | Standards references | Standards-alignment table |
| CLAUDE.md | `../CLAUDE.md` | Stack, constants, standards | Confirm strict-TS, OpenAPI usage |

---

## Tools & Techniques

**Tools**

- `package.json` inspection for technology versions
- Markdown table + ASCII roadmap authoring
- Git for version control

**Techniques**

- Current-vs-target technology mapping with phase assignment
- Skills-gap analysis (current level vs required level vs phase of need)
- Standards alignment (OpenAPI, OAuth/JWT, OpenTelemetry, TLS)
- Technology risk/constraint identification
- Honest separation of adopted vs PLANNED/aspirational tech

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-9.md`

**Supporting outputs**

- Technology baseline (`ST-xx`) and forecast (`FT-xx`) registers
- Skills forecast (`SK-xx`) with acquisition strategy (hiring/upskilling)
- Standards-alignment table feeding AV-2 and StdV concerns

---

## File Generation Workflow

1. **Inventory** — Read `package.json`/`app.ts` for current tech + versions.
2. **Baseline** — Record `ST-xx` with honest status (live/unused/absent).
3. **Forecast** — Define `FT-xx` target tech and assign a phase (PI-3/PI-4).
4. **Roadmap** — Draw ASCII adoption timeline.
5. **Skills** — Score `SK-xx` current vs required; flag gaps (security/SRE).
6. **Risks/standards** — Tabulate technology risks and standards alignment.
7. **Cross-link** — Reference SvcV-4/6/7/8/10a, SV-9, AV-2.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-9-2026`, v1.0.0)
- [ ] Versions grounded (Express 4.18, Prisma 6.18, OpenAPI 3.0.3)
- [ ] `circuit-breaker.ts`/`retry.ts` marked exists-but-unused
- [ ] JWT marked present-but-not-wired; auth tech forecast in PI-3
- [ ] Payment Provider SDK marked absent/aspirational
- [ ] `/metrics` in-memory JSON; Prometheus/OTel forecast in PI-4
- [ ] Skills gaps (security/OAuth, tenancy, crypto, SRE) called out
- [ ] Cross-reference validation: SvcV-7, SvcV-8, SV-9, AV-2 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have dependency versions changed in `package.json`?
- Has any forecast tech (OTel, Prometheus, Payment SDK) been added?
- Were security/SRE hires made (updates skills levels)?

**Generation order**

1. Baseline tech → 2. Forecast tech → 3. Roadmap → 4. Skills →
5. Risks/standards → 6. Cross-references.

**Pitfalls**

- Do **not** list forecast tech as adopted; keep current/target separate.
- Do not claim auth is wired — JWT dep exists, routes do not verify it.
- Do not invent a payment SDK version; it is absent.
- Keep `ST-xx`/`FT-xx`/`SK-xx` IDs stable across revisions.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-7.itto.md` | Measures requiring OTel/Prometheus |
| `template.SvcV-8.itto.md` | Evolution phases sequencing adoption |
| `template.SV-9.itto.md` | Systems-level technology/skills forecast |
| `template.AV-2.itto.md` | Integrated dictionary / standards |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-9.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
