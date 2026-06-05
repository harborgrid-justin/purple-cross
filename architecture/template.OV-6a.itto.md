# OV-6a: Operational Rules Model — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-6a Operational Rules Model** for Purple
Cross is produced, validated, and consumed. OV-6a enumerates the business rules
(BR-*) that constrain operations — scheduling, prescribing, billing, data
lifecycle, and access — each with rationale and enforcement point. Use this
document when refreshing OV-6a or re-deriving rules from the service layer.

> ⚠️ **Honesty note.** OV-6a must distinguish *policy intent* from *enforced
> code*. Authorization rules cannot be enforced (auth not wired); such rules are
> marked **PLANNED**, and partially-enforced rules **PARTIAL**.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Service layer | `backend/src/services/` | Validation/guard logic | Identify real enforcement points |
| OV-5a | `architecture/template.OV-5a.md` | Activities | Scope each rule to an activity |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Auth/RBAC/tenancy/audit status | Set REAL/PARTIAL/PLANNED |
| Prisma schema | `../backend/prisma/schema.prisma` | Constraints, soft-delete, CS log | Ground structural/lifecycle rules |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Validation middleware | `backend/src/middleware/validation.ts` | Joi helpers | Confirm BR-13 enforcement |
| Constants | `backend/src/constants` | RBAC role names | Define access rules (BR-10) |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| Declarative rule authoring | State each BR-* as a constraint/obligation |
| Enforcement-point analysis | Locate rule in middleware/service/DB or mark PLANNED |
| Rule classification | Structural/scheduling/clinical/financial/lifecycle/access |
| Rule-to-state mapping | Tie rules to OV-6b transitions |
| DoDAF 2.02 OV-6a conventions | Operational (business) rules, not system rules |
| Honesty annotation | Status per rule |

---

## Outputs

### Primary Output

- `architecture/template.OV-6a.md` — the Operational Rules Model.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Rule register (BR-*) | OV-5b controls, OV-6b transition guards |
| Rule-to-state mapping | OV-6b state machines |
| Enforcement reality summary | Security review, roadmap |

---

## File Generation Workflow

1. Read services/schema to find real constraints and validation.
2. Author BR-* rules with statement, rationale, activity, enforcement point.
3. Classify rules and map them to OV-6b state transitions.
4. Set REAL/PARTIAL/PLANNED status from the gap analysis.
5. Add enforcement-reality summary and honesty/gap table.
6. Cross-reference OV-5a/5b, OV-6b/6c, OV-4, SV-10a.
7. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-6a-2026`).
- [ ] Each rule has a stable ID, rationale, activity, and enforcement point.
- [ ] Auth/RBAC/tenancy rules (BR-10/11/12) marked PLANNED.
- [ ] Refund-≤-paid (BR-05) and invoice-references-client (BR-04) present and REAL.
- [ ] Controlled-substance logging (BR-03) and soft-delete (BR-07) reflected.
- [ ] Rule-to-state mapping consistent with OV-6b entities.
- [ ] **Cross-ref validation:** BR-* used as controls in OV-5b; transitions match
      OV-6b; roles match OV-4; system rules align with SV-10a.

---

## LLM Guidance

- Distinguish *intended policy* from *enforced code* in every row.
- Never claim authorization rules are enforced — auth is not wired.
- Keep rules operational (business), not implementation-specific (that is SV-10a).
- Reuse BR-* IDs verbatim in OV-5b/OV-6b.
- For any LLM/provider-implied rule, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-5b.itto.md` | Consumes rules as activity controls |
| `template.OV-6b.itto.md` | Rules gate the state transitions |
| `template.OV-6c.itto.md` | Rule outcomes shape event traces |
| `template.OV-4.itto.md` | Access rules reference org roles |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-6a Operational Rules Model |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
