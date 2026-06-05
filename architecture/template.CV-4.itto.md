# CV-4: Capability Dependencies — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-4 Capability Dependencies** view is produced.
CV-4 maps hard/soft/gating dependencies among the CV-2 capabilities and to
external systems, and explicitly surfaces the **CAP-4.3 Security gating
dependency** that blocks production for every capability.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-2 Taxonomy | `architecture/template.CV-2.md` | CAP-x.y IDs | Nodes of the dependency graph |
| Prisma schema | `../backend/prisma/schema.prisma` | FK relations | Derive hard data dependencies |
| External integrations | `../CLAUDE.md` | SendGrid/Twilio/labs/Redis | External dependency register |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Security gaps | Mark gating dependency state |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Service code | `../backend/src/services/` | Cross-service calls | Confirm soft dependencies |
| Data flow doc | `../docs/DATA_FLOW_ARCHITECTURE.md` | Flow detail | Validate dependency direction |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII dependency graph + matrix
- Prisma relation inspection
- Git for version control

**Techniques**

- Dependency matrix construction (rows depend on columns)
- Hard/soft/gating classification
- External dependency registration with failure modes
- Gating-dependency callout (security as P0 gate)

---

## Outputs

**Primary artifact:** `architecture/template.CV-4.md`

**Supporting outputs**

- Capability dependency matrix (consumed by CV-3 phasing, SV-2/SvcV-3b)
- External dependency register
- Gating dependency callout (feeds risk management)

---

## File Generation Workflow

1. **Inherit** — Load CAP IDs from CV-2.
2. **Derive** — Extract data dependencies from Prisma relations.
3. **Classify** — Tag each as hard / soft / gating.
4. **Register externals** — List SendGrid, Twilio, labs, Redis, payments.
5. **Highlight gate** — Build the CAP-4.3 Security gating callout.
6. **Graph + matrix** — Render diagram and dependency matrix.
7. **Cross-link** — Reference CV-2, CV-3, CV-7, OV-2, SV-2, SvcV-3b.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-4-2026`)
- [ ] Every CV-2 capability is a node in graph and matrix
- [ ] Billing shown depending on Patient + Client + Appointment
- [ ] Communications shown depending on SendGrid/Twilio
- [ ] CAP-4.3 Security marked as gating (G) for all rows
- [ ] Payments noted as absent/aspirational
- [ ] Cross-reference validation: CV-2, CV-3, CV-7, SvcV-3b named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Did any new module introduce a cross-capability dependency?
- Has the security gating dependency been satisfied yet (re-check gap analysis)?
- Did a new external integration appear?

**Generation order**

1. Graph → 2. Matrix → 3. Narratives → 4. External register →
5. Gating callout.

**Pitfalls**

- Do not mark the security gating dependency as satisfied.
- Keep dependency direction correct (rows depend on columns).
- Do not invent a payment dependency that the code does not implement.
- Keep CAP IDs identical to CV-2.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-2.itto.md` | Supplies CAP IDs (nodes) |
| `template.CV-3.itto.md` | Schedules the gating dependency in PI-3 |
| `template.CV-7.itto.md` | Maps dependencies to implementing services |
| `template.SvcV-3b.itto.md` | Service-to-service dependency detail |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-4.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
