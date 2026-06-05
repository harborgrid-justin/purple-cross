# SvcV-3a: Systems-Services Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-3a Systems-Services Matrix** artifact is
produced and maintained. SvcV-3a maps the SV-1 systems (S1–S5) and external D6
providers (X-*) to the `SVC-x` services from SvcV-1, recording who **hosts**,
**consumes**, and **backs** each service. It is the structural bridge between the
Services Viewpoint and the Systems Viewpoint (SV-1/SV-3).

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-1 service catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry + domains | Provide the matrix row set |
| SV-1 systems | `architecture/template.SV-1.md` | System nodes S1–S5 + external | Provide the matrix column set |
| App/gateway setup | `../backend/src/app.ts` | `/api/v1` mounting in S2 | Confirm S2 as universal realizer |
| DB/cache config | `../backend/prisma/schema.prisma`, Redis/BullMQ config | Backing stores | Assign B (backs) cells to S3/S4/S5 |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark auth-unwired, payments aspirational |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-2 flows | `architecture/template.SvcV-2.md` | Producer/consumer flows | Validate C (consume) cells |
| SV-3 systems matrix | `architecture/template.SV-3.md` | System-system pairings | Align hosting/backing relationships |
| Worker/queue source | `../backend/src/` worker setup | Background jobs | Assign S5 host/consume cells |

---

## Tools & Techniques

**Tools**

- Markdown table authoring for the systems × services matrix
- Codebase grep for service→store and service→external calls
- Git for version control of the architecture folder

**Techniques**

- Relationship typing (H host, C consume, B back, X external, P planned)
- Single-realizer monolith modeling (all in-scope services in S2)
- Backing-store assignment (S3 PostgreSQL, S4 Redis, S5 worker)
- Honesty annotation (auth-unwired, payments aspirational)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-3a.md`

**Supporting outputs**

- System hosting summary (host/consume/back counts per system)
- Input to SV-3/SV-1 cross-checks (system realizer confirmation)
- Backing-store map feeding deployment/scaling discussions

---

## File Generation Workflow

1. **Set rows** — Import `SVC-x` registry from SvcV-1.
2. **Set columns** — Import systems S1–S5 + external X-* from SV-1.
3. **Assign H/C/B** — Mark host, consume, back per service.
4. **Assign X/P** — Mark external realizers and planned relationships.
5. **Summarize** — Tabulate per-system host/consume/back counts.
6. **Annotate honesty** — Auth unwired, payments aspirational, metrics in-memory.
7. **Cross-link** — SvcV-1/2/3b, SV-1/3/4.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-3a-2026`, v1.0.0)
- [ ] All `SVC-x` rows present; all S1–S5 + external columns present
- [ ] Every in-scope REST service shows S2 as host (H)
- [ ] External services (SVC-31..35) show X realizer + internal consumer
- [ ] SVC-25 Auth shows hosted but 0-route consumption (P)
- [ ] SVC-33 Payment realizer marked aspirational (P / X)
- [ ] Backing stores (S3/S4/S5) assigned correctly
- [ ] Cross-reference validation: SV-1, SV-3, SV-4, SvcV-1/2/3b named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Have any services been split out of the S2 monolith into separate runtimes?
- Has auth become consumed by any route (does SVC-25 gain real C cells)?
- Was a payment SDK wired into S2 (does X-PAY stop being aspirational)?

**Generation order**

1. Rows (services) → 2. Columns (systems) → 3. H/C/B/X/P cells →
4. Hosting summary → 5. Honesty notes → 6. Cross-references.

**Pitfalls**

- Do not show per-service deployment isolation — it is one S2 process.
- Do not mark SVC-25 as consumed — 0 routes enforce auth.
- Keep X-PAY aspirational unless the gap analysis says otherwise.
- Metrics (SVC-37) is in-memory in S2, not backed by S3/S4.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-1.itto.md` | Provides the `SVC-x` registry (rows) |
| `template.SV-1.itto.md` | Provides systems S1–S5 (columns) |
| `template.SvcV-3b.itto.md` | Complementary services-services matrix |
| `template.SvcV-2.itto.md` | Flows that validate consume relationships |
| `template.SV-3.itto.md` | Systems-systems matrix alignment |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-3a.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
