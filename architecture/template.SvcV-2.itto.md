# SvcV-2: Services Resource Flow Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **SvcV-2 Services Resource Flow Description** artifact
is produced and maintained. SvcV-2 refines the SvcV-1 service context into named
**resource flows** (`SF-x`) between consumers and services, between services, and
between services and external/consumed providers (D6). It inherits the `SVC-x`
registry from SvcV-1 and supplies the `SF-x` flow identifiers reused by SvcV-3b
and SvcV-6.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SvcV-1 service catalog | `architecture/template.SvcV-1.md` | `SVC-x` registry, domains, consumers | Anchor producers/consumers of each flow |
| Service implementations | `../backend/src/services/*.service.ts` | Inter-service calls, provider calls | Derive C2/C5 flows (SF-10..24) |
| Domain-events bus | `../backend/src/services/domain-events.service.ts` | Event emit/subscribe | Derive C3 event flows (SF-16..18) |
| Webhook delivery | `../backend/src/services/webhook-delivery.*`, `webhook-events.*` | Outbound delivery, retries | Derive SF-25..26 |
| External integrations | Communications/Lab/Sentry clients + circuit breakers | Provider REST calls | Derive SF-19..24, SF-27 |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark payment/lab-callback honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Data Flow Architecture | `../docs/DATA_FLOW_ARCHITECTURE.md` | End-to-end data movement | Validate flow direction/triggers |
| SV-2 Systems Resource Flow | `architecture/template.SV-2.md` | System-level flows | Align service flows to system flows |
| BullMQ / worker config | `../backend/src/` worker + queue setup | Job enqueue/dispatch | Derive C7 queue flows (SF-28..29) |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII diagramming for the resource-flow diagram
- Codebase grep over `services/` for cross-service and provider calls
- Git for version control of the architecture folder

**Techniques**

- Flow-class taxonomy (C1 Consumer↔Service … C7 Service→Queue)
- Producer/consumer/resource/protocol/trigger tabulation
- Event-flow tracing through the domain-events bus
- Honesty annotation (Aspirational / PLANNED / PARTIAL)

---

## Outputs

**Primary artifact:** `architecture/template.SvcV-2.md`

**Supporting outputs**

- `SF-x` flow registry (consumed by SvcV-3b, SvcV-6)
- External provider flow summary (D6) for resilience planning
- Trigger catalog feeding OV-6c event traces

---

## File Generation Workflow

1. **Inherit** — Pull `SVC-x` and domains from SvcV-1.
2. **Classify** — Define flow classes C1–C7.
3. **Trace** — Walk `services/` for inter-service and provider calls.
4. **Register** — Assign stable `SF-x` IDs; record protocol + trigger.
5. **Diagram** — Draw consumer/service/external/data flow graph.
6. **Detail external** — Tabulate D6 outbound/inbound + resilience.
7. **Annotate honesty** — Payments aspirational, lab callback PLANNED.
8. **Cross-link** — SvcV-1/3a/3b/6, SV-2, OV-2/3, CV-7.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SvcV-2-2026`, v1.0.0)
- [ ] Every flow has producer, consumer, resource, protocol, trigger, status
- [ ] `SF-x` IDs are stable and unique
- [ ] Outbound flows to SendGrid/Twilio/Payment/Lab/Sentry present
- [ ] Inbound webhook + lab-callback flows present
- [ ] Payment flows (SF-21/22) marked Aspirational (no SDK)
- [ ] Lab result callback (SF-27) marked PLANNED
- [ ] PHI/PII plaintext + no-auth on C1 flows noted
- [ ] Cross-reference validation: SV-2, SvcV-1, OV-3, CV-7 named correctly
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Were new inter-service calls or provider integrations added since last revision?
- Has the Payment Provider SDK been wired (does SF-21/22 become real)?
- Is there now an authenticated inbound lab-result endpoint (SF-27)?

**Generation order**

1. Flow classes → 2. Flow diagram → 3. Flow catalog → 4. External detail →
5. Honesty notes → 6. Cross-references.

**Pitfalls**

- Do **not** depict the payment gateway as wired — SF-21/22 are aspirational.
- Keep `SF-x` IDs stable; SvcV-3b and SvcV-6 reference them.
- Do not imply C1 flows are authorized — auth (SVC-25) gates 0 routes.
- Mark PHI/PII payloads as plaintext; field-crypto applies to 0 fields.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SvcV-1.itto.md` | Provides the `SVC-x` registry and consumers |
| `template.SvcV-3b.itto.md` | Abstracts SF-10..18 into the services-services matrix |
| `template.SvcV-6.itto.md` | Tabular extension of the `SF-x` flow registry |
| `template.SV-2.itto.md` | Underlying systems resource flows |
| `template.OV-3.itto.md` | Operational resource flows realized by these |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Services Viewpoint |
| Primary Output | `architecture/template.SvcV-2.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
