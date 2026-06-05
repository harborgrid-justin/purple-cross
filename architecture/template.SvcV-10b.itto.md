# SvcV-10b: Services State Transition Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-10b Services State Transition Description**
artifact is produced and maintained. SvcV-10b models the lifecycle state
machines of API-managed resources — Appointment, Invoice, Estimate,
InsuranceClaim, WorkflowExecution, WebhookDelivery — annotating each transition
with the **service operation (endpoint)** that triggers it and the domain event
it emits. It binds the contracts of SvcV-6 and the rules of SvcV-10a to concrete
resource lifecycles, and is the structural basis for the end-to-end traces in
SvcV-10c.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Status fields/enums, models, `deletedAt` | Ground legal states per resource |
| Service code | `../backend/src/services/*.service.ts` | Transition logic, status writes, event emits | Map transitions to operations/events |
| Route definitions | `../backend/src/routes/*.routes.ts` | Status/action endpoints (`:id/status`, `:id/send`) | Identify triggering operations |
| Workflow services | `workflow-engine.service`, `workflow-trigger.service` | Execution lifecycle | Model WorkflowExecution states |
| Webhook delivery | `webhook-delivery.service` | Queue/retry/backoff | Model WebhookDelivery states |
| SvcV-6 matrix | `architecture/template.SvcV-6.md` | `RF-nnn` endpoints | Cross-link transitions to flows |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-10a rules | `architecture/template.SvcV-10a.md` | SvcR-21 events, SvcR-17 signing | Constrain transitions |
| OV-6b state model | `architecture/template.OV-6b.md` | Operational lifecycles | Trace service states to ops states |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Payments aspirational, auth unwired | Honesty notes on actor/transition |

---

## Tools & Techniques

**Tools**

- ASCII state-diagram authoring
- Markdown transition tables (From/To/Operation/Event)
- Service/route code inspection for status enums and event names
- Git for version control

**Techniques**

- Finite-state-machine modeling per resource
- Transition annotation `event / service operation`
- State-to-Prisma-field mapping (status field per model)
- Honesty annotation (unauthenticated actor, aspirational payment transitions)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-10b.md`

**Supporting outputs**

- Six resource state machines (diagram + transition table each)
- State-persistence mapping (model → status field → soft-delete)
- Transition catalog consumed by SvcV-10c event traces

---

## File Generation Workflow

1. **Identify resources** — Select stateful resources from SvcV-6/schema.
2. **Enumerate states** — Read status enums/strings from schema/services.
3. **Map transitions** — For each, find the endpoint/operation and emitted event.
4. **Diagram** — Draw ASCII state machine with `[*]`/final markers.
5. **Tabulate** — From/To/Operation/Event table per resource.
6. **Persist mapping** — Record model, status field, soft-delete applicability.
7. **Cross-link** — Reference SvcV-6/7/10a/10c, SV-10b, OV-6b.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-10b-2026`, v1.0.0)
- [ ] All six state machines present (Appointment, Invoice, Estimate, Claim, Workflow, Webhook)
- [ ] Each transition annotated with the triggering service operation
- [ ] Each transition lists the emitted domain event (SvcR-21)
- [ ] Appointment states match the booking→completed/cancelled/no-show lifecycle
- [ ] Invoice `Paid` via Payment Provider noted aspirational
- [ ] Webhook delivery includes retry/backoff and failed (DLQ PLANNED)
- [ ] Status fields mapped to real Prisma models
- [ ] Cross-reference validation: SvcV-6, SvcV-10a/10c, SV-10b, OV-6b named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Did any status enum change in `schema.prisma`?
- Were new transition endpoints added (e.g., new claim states)?
- Is real payment capture now wired (affects Invoice `Paid`)?

**Generation order**

1. Appointment → 2. Invoice → 3. Estimate → 4. Claim →
5. WorkflowExecution → 6. WebhookDelivery → 7. Persistence → 8. Cross-refs.

**Pitfalls**

- Do **not** invent states absent from the schema/service code.
- Always tie a transition to a real endpoint or job, not a vague action.
- Note that the transition actor is currently unauthenticated (auth PLANNED).
- Keep event names consistent with SvcV-6/SvcV-10c.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-6.itto.md` | Endpoints triggering transitions |
| `template.SvcV-10a.itto.md` | Rules governing transitions |
| `template.SvcV-10c.itto.md` | Traces exercising these transitions |
| `template.SV-10b.itto.md` | Underlying systems state transitions |
| `template.OV-6b.itto.md` | Operational state model |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-10b.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
