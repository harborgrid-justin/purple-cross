# CV-6: Capability to Operational Activities Mapping — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-6 Capability to Operational Activities Mapping**
is produced. CV-6 traces each CV-2 capability to the operational activities it
enables, using the OV-5a activity decomposition (Book Appointment, Document
Visit, Prescribe, Order Lab, Invoice, Collect Payment, Manage Inventory, etc.).

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-2 Taxonomy | `architecture/template.CV-2.md` | CAP-x.y IDs | Capability rows |
| OV-5a Activity Tree | `architecture/template.OV-5a.md` | A1..A6 activities | Activity columns |
| OV-5b Activity Model | `architecture/template.OV-5b.md` | Activity I/O | Validate enabling capability |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational | Honesty on UI/security gaps |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Service code | `../backend/src/services/` | Activity implementation | Confirm capability support |
| Prisma schema | `../backend/prisma/schema.prisma` | Data context | Validate activity dependencies |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII activity tree; mapping matrix
- Git for version control

**Techniques**

- Capability × activity traceability matrix (X / supporting)
- Activity narrative grounding to real services
- Coverage summary by activity area
- Honesty annotation (security supports all activities, PLANNED)

---

## Outputs

**Primary artifact:** `architecture/template.CV-6.md`

**Supporting outputs**

- Capability-to-activity matrix (consumed by SV-5a, SvcV-5)
- Activity narratives (link to CV-7 services)
- Coverage summary

---

## File Generation Workflow

1. **Inherit** — Load CAP IDs (CV-2) and activities (OV-5a).
2. **Map** — Mark primary (X) and supporting (x) per cell.
3. **Narrate** — Describe enabling capability per key activity.
4. **Summarize** — Build coverage summary with backend/UI status.
5. **Annotate** — Mark CAP-4.3 Security as supporting-all (PLANNED).
6. **Cross-link** — Reference CV-2, OV-5a/5b, CV-7, SV-5a/SvcV-5.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-6-2026`)
- [ ] Every CV-2 capability is a matrix row
- [ ] Every OV-5a leaf activity is a matrix column
- [ ] Billing activities depend on patient/client/appointment capabilities
- [ ] CAP-4.3 Security shown as supporting all activities (PLANNED)
- [ ] Payments noted as aspirational under A4.2
- [ ] Cross-reference validation: CV-2, OV-5a, OV-5b, CV-7, SvcV-5 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Did OV-5a add/remove activities?
- Did any capability change which activities it enables?
- Has security control over activities been implemented yet?

**Generation order**

1. Activity tree → 2. Matrix → 3. Narratives → 4. Coverage summary.

**Pitfalls**

- Keep activity IDs identical to OV-5a (A1.1 … A6.3).
- Keep CAP IDs identical to CV-2.
- Do not claim charge automation under A4.2 (no Stripe SDK).
- Do not omit the security-supports-all row.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-2.itto.md` | Supplies CAP IDs |
| `template.OV-5a.itto.md` | Supplies activity decomposition |
| `template.CV-7.itto.md` | Maps capabilities to implementing services |
| `template.SvcV-5.itto.md` | Activity-to-service traceability |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-6.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
