# SV-10b: Systems State Transition Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SV-10b Systems State Transition Description** for
Purple Cross is produced, validated, and consumed. SV-10b captures the state
machines of system mechanisms — the resilience circuit breaker, the HTTP request
lifecycle, the BullMQ job, workflow execution, and webhook delivery — each with a
state diagram and a transition table (trigger, guard, side-effect). Use this when
a mechanism's states change or a PLANNED machine (circuit breaker) is activated.

> ⚠️ **Honesty note.** The **Circuit Breaker** machine documents the design in
> `utils/circuit-breaker.ts`, which is **unused (dead code)** today; its
> activation is PLANNED (SV-8 Phase 4). The request machine omits an active auth
> state because authentication is not wired. Keep these caveats explicit.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Circuit-breaker util | `backend/src/utils/circuit-breaker.ts` | CLOSED/OPEN/HALF_OPEN logic | Ground §2 (mark unused) |
| Request middleware | `backend/src/middleware/*`, `app.ts` | timeout, validation, error flow | Ground request lifecycle |
| BullMQ config | `backend/src/config/*`, `worker.ts` | queue/job states | Ground job machine |
| Workflow/webhook models | `backend/prisma/schema.prisma` | execution/delivery states | Ground §5/§6 |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | live-vs-planned status | Mark unused machines |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Retry util | `backend/src/utils/retry.ts` | backoff logic | Ground RETRYING transitions |
| Bull Board | `config/bull-board.ts` | queue observability | Note job-state visibility |
| SV-10a rules | `template.SV-10a.md` | SR-04/12/23 | Tie transitions to rules |
| SV-7 measures | `template.SV-7.md` | SM-08/17 | Tie states to measures |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| State-machine modeling | Identify states + transitions per mechanism |
| ASCII state diagrams | Draw CLOSED/OPEN/HALF_OPEN and lifecycle graphs |
| Transition tabling | From/To with trigger, guard, side-effect |
| Liveness classification | Mark each machine live vs PLANNED |
| Rule/measure linkage | Map transitions to SR-* and SM-* |
| Honesty annotation | Flag dead-code circuit breaker, skipped auth state |

---

## Outputs

### Primary Output

- `architecture/template.SV-10b.md` — the Systems State Transition Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| State diagrams + tables | SV-10c traces, SV-7 measures |
| State-machine summary | SV-8 (Phase 4 breaker activation) |
| Liveness notes | Engineering, audits |

---

## File Generation Workflow

1. Read `circuit-breaker.ts` / `retry.ts`; note they are unused.
2. Model the request lifecycle from the middleware chain.
3. Model BullMQ job states from worker/queue config.
4. Model workflow-execution and webhook-delivery from the schema.
5. Draw ASCII diagrams and transition tables for each.
6. Summarize liveness (live vs PLANNED) and link to SR-*/SM-*.
7. Apply the standard header block and footer; cross-link siblings.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-10b-2026`, v1.0.0).
- [ ] Each machine has a diagram and a transition table.
- [ ] Circuit breaker marked unused/PLANNED (dead code today).
- [ ] Request machine notes auth state as PLANNED.
- [ ] BullMQ states (WAITING/ACTIVE/COMPLETED/FAILED/RETRYING) consistent with SV-10c T2.
- [ ] **Cross-ref validation:** transitions gated by SV-10a rules; appear in
      SV-10c traces; feed SV-7 measures (SM-08/17); breaker activation per SV-8;
      operational counterpart is OV-6b.
- [ ] Closing classification footer present.

---

## LLM Guidance

- Never imply the circuit breaker is active; it is dead code today.
- Keep state names consistent with the event traces in SV-10c.
- Distinguish system state machines (here) from operational ones (OV-6b).
- Tie measurable states to the correct SM-* IDs (SM-08 queue, SM-17 breaker).
- If referencing LLM/provider features, consult the repo's LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-10a.itto.md` | Rules gating these transitions |
| `template.SV-10c.itto.md` | Event traces driving these machines |
| `template.SV-7.itto.md` | Measures fed by state transitions |
| `template.SV-8.itto.md` | Phase 4 circuit-breaker activation |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Primary Output | `architecture/template.SV-10b.md` |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
