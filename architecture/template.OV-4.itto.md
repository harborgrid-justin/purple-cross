# OV-4: Organizational Relationships Chart — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO companion documents how the **OV-4 Organizational Relationships Chart**
for Purple Cross is produced, validated, and consumed. OV-4 names the practice
roles (Owner, Manager, Veterinarian, Vet Tech, Front Office) and the external
client, and describes their reporting and collaboration relationships, mapping
each internal role to the operational nodes of OV-1/OV-2. Use this document when
refreshing OV-4 or re-deriving the org model from the codebase RBAC constants.

> ⚠️ **Honesty note.** OV-4 documents the *intended* operating model. RBAC roles
> exist in constants but are **not enforced** (auth not wired). OV-4 must mark
> access-control enforcement as **PLANNED** and never imply roles gate access.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| RBAC role constants | `backend/src/constants` | Role names (admin/vet/tech/front-office) | Define intended RBAC roles |
| OV-1 / OV-2 | `architecture/template.OV-1.md`, `template.OV-2.md` | Internal nodes (ON-*), needlines | Map roles to nodes/flows |
| Gap analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Auth/RBAC/tenancy status | Mark enforcement PLANNED |
| Module catalog | `../CLAUDE.md` | Modules per responsibility | Attribute role responsibilities |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Auth middleware | `backend/src/middleware` | Auth/role guard code | Confirm middleware exists but unused |
| Staff service | `backend/src/services/staff.service.ts` | Staff modeling | Validate role attributes |

---

## Tools & Techniques

| Tool / Technique | Application |
|------------------|-------------|
| ASCII org chart | Render reporting/supervision and collaboration lines |
| Role catalog | Responsibilities, skills, intended RBAC role per ORG-* |
| Role-interaction matrix | Dominant interaction between each role pair |
| Node-to-role mapping | Tie ORG-* to ON-* from OV-1/OV-2 |
| DoDAF 2.02 OV-4 conventions | Organizational relationships, not system interfaces |
| Honesty annotation | Flag RBAC unenforced / auth not wired |

---

## Outputs

### Primary Output

- `architecture/template.OV-4.md` — the Organizational Relationships Chart.

### Supporting Outputs

| Output | Consumed By |
|--------|-------------|
| Role catalog (ORG-*) | OV-5b mechanisms, CV-5 |
| Role-interaction matrix | OV-6c actor sequencing |
| Org resource mapping | OV-2/OV-3 producer/consumer validation |

---

## File Generation Workflow

1. Read RBAC constants and OV-1/OV-2 to fix roles and node mappings.
2. Draw the ASCII org chart (Owner → Manager → Vet/Tech/Front; Client external).
3. Author the role catalog (responsibilities, skills, intended RBAC role).
4. Build the role-interaction matrix and org-resource mapping.
5. Add multi-tenancy/governance notes with honest status.
6. Add honesty/gap table; cross-reference OV-5/OV-6a/CV-5/SV-2.
7. Apply the standard header block and footer.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-OV-4-2026`).
- [ ] Roles have stable IDs (ORG-1..ORG-6) mapped to ON-* nodes.
- [ ] Client (ORG-6) shown as external party.
- [ ] Intended RBAC roles cited from constants and marked **NOT ENFORCED**.
- [ ] Auth-not-wired and tenant-not-scoped gaps flagged.
- [ ] Role-interaction matrix complete and symmetric in coverage.
- [ ] **Cross-ref validation:** ON-* match OV-1/OV-2; ORG-* reused in OV-5b/OV-6c;
      capability-org mapping consistent with CV-5.

---

## LLM Guidance

- Never state that RBAC roles gate access — they are defined but unenforced.
- Keep OV-4 about **organizational** relationships, not system interfaces (SV).
- Reuse ORG-* IDs verbatim across OV-5b/OV-6c.
- Map each role to real modules and OV-3 flows it produces/consumes.
- For any LLM/provider-implied role behavior, consult the repo LLM guidance.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.OV-1.itto.md` | Supplies internal operational nodes |
| `template.OV-2.itto.md` | Needlines each role produces/consumes |
| `template.OV-5b.itto.md` | Activity mechanisms performed by roles |
| `template.OV-6a.itto.md` | Rules that would enforce role authority (PLANNED) |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Operational Viewpoint |
| Artifact | OV-4 Organizational Relationships Chart |
| Owner | Purple Cross Architecture Team |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
