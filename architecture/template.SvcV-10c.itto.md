# SvcV-10c: Services Event-Trace Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-10c Services Event-Trace Description** artifact
is produced and maintained. SvcV-10c renders ASCII **sequence diagrams** of
service interactions for concrete scenarios — book appointment + reminder,
invoice + payment + receipt, lab order + inbound result webhook, and workflow
execution across services. Lifelines are the platform's services and external
providers (SendGrid, Twilio, Payment Provider, External Lab). Each trace ties
back to SvcV-6 resource-flow rows (`RF-nnn`) and SvcV-10b state transitions and
honestly flags steps that depend on unwired integrations or unenforced controls.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Service code | `../backend/src/services/*.service.ts` | Call order, event emits, external calls | Sequence the hops accurately |
| Domain events | `domain-events.service` | Emit/subscribe wiring | Show event-driven steps |
| Job queue | BullMQ usage (reminders, webhook retry) | Async enqueue/worker | Show delayed/async hops |
| Webhook delivery | `webhook-delivery.service` + inbound handler | Signing, verification | Model inbound/outbound webhook steps |
| Workflow engine | `workflow-engine.service`, `workflow-trigger.service` | Step orchestration | Build Scenario 4 |
| SvcV-6 matrix | `architecture/template.SvcV-6.md` | `RF-nnn` rows, external services | Reference flows in traces |
| SvcV-10b | `architecture/template.SvcV-10b.md` | State transitions | Tie traces to lifecycle changes |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-10a rules | `architecture/template.SvcV-10a.md` | Correlation/validation/auth/webhook rules | Cross-cutting concerns table |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Aspirational integrations | Mark `[PLANNED]` steps |
| OV-6c traces | `architecture/template.OV-6c.md` | Operational scenarios | Align operational ↔ service traces |

---

## Tools & Techniques

**Tools**

- ASCII sequence-diagram authoring (lifelines + arrows)
- Service/event/queue code inspection to confirm call ordering
- Git for version control

**Techniques**

- Scenario-based event-trace modeling (one diagram per scenario)
- Lifeline selection (services + external providers + DE/JQ/WD/WE/DB)
- Sync (`->>`) vs async (`-->>`) message notation
- `[PLANNED]` annotation for unwired/aspirational steps
- Scenario-to-reference mapping (RF rows, state machines, external services)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-10c.md`

**Supporting outputs**

- Four scenario sequence diagrams with notes
- Cross-cutting concerns table (correlation/validation/auth/events per hop)
- Scenario-to-reference map linking traces to SvcV-6/10b and external services

---

## File Generation Workflow

1. **Select scenarios** — Booking+reminder, invoice+payment, lab+webhook, workflow.
2. **Choose lifelines** — Services and external providers per scenario.
3. **Order hops** — Follow service code: validate → DB → event → job → external.
4. **Annotate** — Reference `RF-nnn`; mark `[PLANNED]` steps honestly.
5. **Tie to state** — Note SvcV-10b transitions advanced by each trace.
6. **Cross-cutting** — Add correlation/validation/auth/event concerns table.
7. **Cross-link** — Reference SvcV-6/7/10a/10b, SV-10c, OV-6c.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-10c-2026`, v1.0.0)
- [ ] All four scenarios present with ASCII sequence diagrams
- [ ] Lifelines include external providers (SendGrid/Twilio/Payment/Lab)
- [ ] Each trace references `RF-nnn` rows from SvcV-6
- [ ] Payment Provider charge step marked `[PLANNED]`/aspirational
- [ ] External Lab order + inbound result webhook marked `[PLANNED]`
- [ ] Inbound webhook signature verification shown (SvcR-17)
- [ ] Auth/tenancy/circuit-breaker noted as not-yet-enforced
- [ ] Cross-reference validation: SvcV-6, SvcV-10a/10b, SV-10c, OV-6c named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Did call ordering change in any service (new event/external hop)?
- Is Payment Provider or External Lab now wired (remove `[PLANNED]`)?
- Were circuit breakers activated on outbound calls (update concerns table)?

**Generation order**

1. Scenario 1 → 2. Scenario 2 → 3. Scenario 3 → 4. Scenario 4 →
5. Cross-cutting concerns → 6. Reference map → 7. Cross-references.

**Pitfalls**

- Do **not** show Payment/External Lab as live; mark `[PLANNED]`.
- Keep `RF-nnn` references consistent with SvcV-6.
- Show the in-process domain-events bus, not a durable broker (none yet).
- Do not imply authenticated actors — auth is unwired.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-6.itto.md` | Resource flows exercised by traces |
| `template.SvcV-10a.itto.md` | Rules applied per hop |
| `template.SvcV-10b.itto.md` | State transitions advanced by traces |
| `template.SV-10c.itto.md` | Underlying systems event traces |
| `template.OV-6c.itto.md` | Operational event-trace scenarios |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-10c.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
