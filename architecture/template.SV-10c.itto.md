# SV-10c: Systems Event-Trace Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-10c Systems Event-Trace Description** for Purple
Cross is produced, validated, and consumed. SV-10c provides system-internal
sequence diagrams: (1) an HTTP request through the full middleware chain; (2) an
async BullMQ job; (3) an outbound webhook with retry; (4) a communication send
via SendGrid/Twilio. System lifelines S1–S5 are reused across the SV viewpoint.
Use this when a trace path changes or a PLANNED step (auth, resilience) is wired.

> ⚠️ **Honesty note.** The middleware chain is real, but the **auth/authz** step
> is PLANNED (shown dashed/skipped), and circuit-breaker/retry wrapping of
> external calls is PLANNED (today the provider call is direct). Keep these
> markers in the traces.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Express app | `backend/src/app.ts` | exact middleware order | Ground Trace 1 sequence |
| Middleware dir | `backend/src/middleware/*` | correlation, sanitize, rate-limit, validation, error | Ground per-step messages |
| BullMQ + worker | `backend/src/config/*`, `worker.ts` | enqueue/consume flow | Ground Traces 2 & 4 |
| Comms service | `backend/src/services/communication*.ts` | SendGrid/Twilio send | Ground Trace 4 |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | live-vs-planned | Mark skipped auth / direct calls |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SV-10a rules | `template.SV-10a.md` | SR-* enforcement points | Annotate each step |
| SV-10b machines | `template.SV-10b.md` | states reached per message | Tie traces to states |
| SV-1 interfaces | `template.SV-1.md` | static system interfaces | Confirm lifelines/edges |
| Webhook model | `backend/prisma/schema.prisma` | delivery states | Ground Trace 3 |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Sequence-trace modeling | Order messages along S1–S5 lifelines |
| ASCII sequence diagrams | Render lifelines, arrows, alt paths |
| Side-effect annotation | Note logs/metrics/Sentry per trace |
| Rule/state linkage | Map steps to SR-* and SV-10b states |
| PLANNED-step marking | Dash/skip auth and resilience steps |
| Lifeline reuse | Keep S1–S5 consistent across SV |

---

## Outputs

### Primary Output

- `architecture/template.SV-10c.md` — the Systems Event-Trace Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Trace diagrams (T1–T4) | Engineering, onboarding, SV-10b |
| Trace index | SV-1 (interfaces), SV-7 (measures) |
| Side-effect notes | Observability runbooks |

---

## File Generation Workflow

1. Read `app.ts` to fix the exact middleware order for Trace 1.
2. Trace the BullMQ enqueue→consume path for Traces 2 & 4.
3. Trace webhook delivery + retry from the worker/model for Trace 3.
4. Render ASCII sequence diagrams with S1–S5 lifelines.
5. Mark PLANNED steps (auth skipped, direct provider call).
6. Annotate side-effects (logs SR-15, metrics SM-01/19, Sentry SR-14).
7. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-10c-2026`, v1.0.0).
- [ ] Lifelines S1–S5 match the catalog reused across SV (esp. SV-7).
- [ ] Middleware order in Trace 1 matches `app.ts`.
- [ ] Auth/authz shown as PLANNED/skipped; resilience wrap noted as PLANNED.
- [ ] Each trace annotated with relevant SR-* and SM-* side-effects.
- [ ] **Cross-ref validation:** interfaces match SV-1; rules match SV-10a;
      states match SV-10b; measures match SV-7; operational counterpart is OV-6c.
- [ ] Closing classification footer present.

---

## LLM Guidance

- Preserve the exact middleware order; do not reorder for readability.
- Keep the auth step visibly PLANNED/skipped — do not imply it runs.
- Reuse S1–S5 lifelines identically to SV-7/SV-10b.
- Tie side-effects to the correct SR-*/SM-* IDs.
- If referencing LLM/provider features, consult the repo's LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-10a.itto.md` | Rules (SR-*) annotated on each step |
| `template.SV-10b.itto.md` | State machines the traces drive |
| `template.SV-7.itto.md` | Measures emitted as side-effects |
| `template.SV-1.itto.md` | Static interfaces these traces exercise |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-10c.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
