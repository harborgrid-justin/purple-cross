# OV-3: Operational Resource Flow Matrix — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-3 Operational Resource Flow Matrix**
for Purple Cross is produced, validated, and consumed. OV-3 decomposes the OV-2
needlines into individually identified resource flows (RF-*), each with producer,
consumer, resource, trigger, frequency, and media. Use this document when
refreshing OV-3 or re-deriving the flow matrix from OV-2 and the codebase.

> ⚠️ **Honesty note.** OV-3 must remain grounded. Where a flow is aspirational
> (Payment Provider settlement, access-controlled or tenant-scoped flows), OV-3
> marks it **PLANNED / PARTIAL** rather than implying delivery.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| OV-2 | `architecture/template.OV-2.md` | Needline catalog (NL-*) | Decompose each needline into RF-* rows |
| OV-1 | `architecture/template.OV-1.md` | Node IDs (ON-*), thread | Producer/consumer identification |
| Module catalog | `../CLAUDE.md`, `backend/src/routes/` | Modules and endpoints | Determine media (REST/DB/Ext-REST) |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational status | Set REAL/PARTIAL/PLANNED per flow |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Prisma schema | `../backend/prisma/schema.prisma` | Entities exchanged | Confirm resource content |
| Communications service | `backend/src/services/communications.service.ts` | Provider dispatch | Set Email/SMS media + frequency |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Matrix tabulation | One row per resource flow with full attributes |
| Needline decomposition | Expand each OV-2 NL into one or more RF-* |
| Trigger/frequency profiling | Classify synchronous/asynchronous/batch flows |
| Media legend mapping | REST/DB/Email/SMS/Ext-REST/Manual |
| DoDAF 2.02 OV-3 conventions | Authoritative flow register feeding SV-6 |
| Honesty annotation | Status column per flow |

---

## Outputs

### Primary Output

- `architecture/template.OV-3.md` — the Operational Resource Flow Matrix.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| RF-* register | SV-6 (system resource flow matrix) |
| Flow-class summary | DIV sensitivity tagging, security review |
| Trigger/frequency profile | OV-6c event traces, performance planning |

---

## File Generation Workflow

1. Read OV-2 to obtain needline catalog (NL-*) and node IDs.
2. Expand each needline into one or more RF-* rows.
3. Fill producer, consumer, resource, trigger, frequency, media per row.
4. Set REAL/PARTIAL/PLANNED status using the gap analysis.
5. Build flow-class summary and trigger/frequency profile tables.
6. Add honesty/gap table; cross-reference OV-2/OV-5b/OV-6c/SV-6.
7. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-3-2026`).
- [ ] Every RF-* references a valid parent NL from OV-2.
- [ ] Producer/Consumer use ON-* IDs consistent with OV-1/OV-2.
- [ ] Each flow has trigger, frequency, media, and status.
- [ ] Payment Provider settlement flows marked PLANNED.
- [ ] PHI flows noted plaintext-at-rest; access/tenant gaps flagged.
- [ ] **Cross-ref validation:** NL-* parents match OV-2; ON-* match OV-1;
      RF-* are realized by SV-6 system flows; activity producers align with
      OV-5b; sequencing aligns with OV-6c.

---

## LLM Guidance

- One row per discrete flow; do not collapse distinct resources into one row.
- Never mark Payment Provider settlement REAL — no Stripe SDK exists.
- Keep RF-* numbering stable; append new flows rather than renumber.
- Use real module names when attributing media/carrier.
- For any LLM/provider-implied flow, consult the repo LLM guidance first.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-2.itto.md` | Supplies needlines decomposed here |
| `template.OV-1.itto.md` | Supplies node IDs and thread |
| `template.OV-5b.itto.md` | Activity ICOM that produces/consumes flows |
| `template.OV-6c.itto.md` | Event traces sequencing these flows |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-3 Operational Resource Flow Matrix |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
