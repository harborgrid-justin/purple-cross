# SV-2: Systems Resource Flow Description — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **SV-2 Systems Resource Flow Description**
for Purple Cross is produced, validated, and consumed. SV-2 details the data and
control resources (RF-01..RF-13) that move across the SV-1 interfaces between
systems S1–S5 and external systems X1–X5, including protocol, port, payload
format, direction, and the security applied in transit and at rest. Use this
document when refreshing SV-2 or re-deriving it from the codebase.

> ⚠️ **Honesty note.** SV-2 must stay grounded in the real deployment. Flows that
> are aspirational (Payment Provider, External Lab) or partial (SendGrid/Twilio,
> webhook delivery) are marked **PLANNED / PARTIAL**. SV-2 explicitly records that
> TLS protects transit but **field-level encryption is applied to 0 fields** and
> flows are **not tenant-scoped**.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| SV-1 interface catalog | `architecture/template.SV-1.md` | Systems S1–S5, interfaces I1–I12 | Anchor each resource flow to an interface |
| Express app wiring | `../backend/src/app.ts` | Middleware order, route mounting, auth guard | Ground ingress flow RF-01/RF-02 |
| Cache / queue services | `backend/src/services/cache.service.ts`, BullMQ config | Redis cache + job broker usage | Ground RF-05/RF-08 |
| Deployment topology | `../docker-compose.yml` | postgres:5432, redis:6379, backend:3000, frontend:5173, nginx | Ports and transports |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Mark PLANNED/PARTIAL honestly |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Communications service | `backend/src/services/communication*.ts` | Email/SMS send paths | Confirm RF-07 |
| Webhook delivery | `backend/src/services/webhook-delivery*.ts` | Signed delivery to tenant URLs | Confirm RF-09 |
| Sentry config | `backend/src/config/sentry.ts` | Telemetry envelope | Confirm RF-10 |
| Prisma schema | `../backend/prisma/schema.prisma` | Resource/data objects | Build resource inventory |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII resource flow diagram | Render systems with directional RF arrows and protocols |
| Resource flow tabulation | Per-flow protocol, port, payload, direction, security, status |
| Resource (data object) inventory | Map flows to Prisma models / event payloads |
| Security/QoS annotation | Record TLS, authN/Z, encryption, tenancy, audit posture |
| DoDAF 2.02 SV-2 conventions | Stay at flow level; defer adjacency to SV-3, endpoints to SV-6 |
| Honesty annotation | Tag aspirational/partial flows with status flags |

---

## Outputs

### Primary Output

- `architecture/template.SV-2.md` — the Systems Resource Flow Description.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Resource flow IDs (RF-01..RF-13) | SV-3, SV-6 |
| Resource/data object inventory | SV-6, DIV-3 |
| Security/QoS annotations | SV-7 (measures), SvcV-2 |

---

## File Generation Workflow

1. Read SV-1 to inherit systems (S1–S5) and interfaces (I1–I12).
2. Read `app.ts`, cache/queue services, and `docker-compose.yml` for transports/ports.
3. Draw the ASCII resource flow diagram (SPA → API → data tier → externals).
4. Tabulate flows RF-01..RF-13 with protocol/port/payload/direction/security/status.
5. Build the resource (data object) inventory mapping flows to Prisma models.
6. Add security/QoS annotations honest about encryption, tenancy, audit, resilience.
7. Add cross-references and apply the standard header/footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-SV-2-2026`).
- [ ] Every flow references a valid SV-1 interface (I1–I12).
- [ ] Protocol, port, payload, direction, security, status present for each flow.
- [ ] Real ports used (3000/5432/6379/443).
- [ ] TLS-in-transit stated; at-rest encryption gap (0 fields) stated.
- [ ] Aspirational/partial flows flagged PLANNED/PARTIAL.
- [ ] **Cross-ref validation:** system/interface IDs match SV-1; flows align with OV-2/OV-3;
      persisted resources align with DIV-3; service flows align with SvcV-2.

---

## LLM Guidance

- Keep SV-2 at the **flow** level — do not duplicate SV-3 matrix cells or SV-6 endpoints.
- Reuse SV-1 system IDs (S1–S5) and interface IDs (I1–I12) verbatim.
- Never upgrade a PLANNED flow (payments, lab interchange) to "done".
- State the at-rest encryption gap and tenant-scoping gap explicitly.
- Note circuit-breaker/retry utilities are **unused** — flows are not wrapped.
- If a provider (Claude/Anthropic) or LLM feature is referenced, consult the
  repo's LLM guidance before asserting capabilities.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.SV-1.itto.md` | Systems/interfaces these flows traverse |
| `template.SV-3.itto.md` | Adjacency matrix derived from these flows |
| `template.SV-6.itto.md` | Endpoint-level resource flow matrix |
| `template.OV-2.itto.md` | Operational resource flows |
| `template.SvcV-2.itto.md` | Service resource flows |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Systems Viewpoint |
| Artifact | SV-2 Systems Resource Flow Description |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |
