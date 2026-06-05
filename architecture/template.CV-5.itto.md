# CV-5: Capability to Organizational Development Mapping — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-5 Capability to Organizational Development
Mapping** is produced. CV-5 links each CV-2 capability to responsible org units
(Clinical, Front Office, Clients, Platform/Eng, Security Architect, Data) and the
organizational development (roles, skills, process maturity) each requires.

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-2 Taxonomy | `architecture/template.CV-2.md` | CAP-x.y IDs | Capability rows |
| OV-4 Org Relationships | `architecture/template.OV-4.md` | Org units & roles | Organization columns |
| AV-1 Overview | `architecture/template.AV-1.md` | Stakeholder/org scope | Confirm responsible parties |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Skills/coverage gaps | Mark Security org gap |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Roadmap / PI plan | Program Manager | Phase ownership | Org development roadmap |
| CV-3 Phasing | `architecture/template.CV-3.md` | Increment timing | Align dev roadmap |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII roadmap; mapping matrix
- Git for version control

**Techniques**

- Capability × organization responsibility matrix (B/O/U/G)
- Org development needs analysis per capability
- Skills/role gap identification
- Roadmap alignment to CV-3 phasing

---

## Outputs

**Primary artifact:** `architecture/template.CV-5.md`

**Supporting outputs**

- Capability-to-organization matrix (consumed by OV-4, SV-9/SvcV-9)
- Org development roadmap
- Roles/skills gap register

---

## File Generation Workflow

1. **Inherit** — Load CAP IDs (CV-2) and org units (OV-4/AV-1).
2. **Map** — Assign B/O/U/G per capability per org unit.
3. **Analyze** — Define org development required per capability.
4. **Roadmap** — Sequence org development to CV-3 phases.
5. **Gap** — Identify role/skill gaps (esp. Security Architect).
6. **Cross-link** — Reference CV-2, CV-3, OV-4, CV-6, SV-9/SvcV-9.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-5-2026`)
- [ ] Every CV-2 capability is a matrix row
- [ ] Each org unit from OV-4 appears as a column
- [ ] Security Architect gap flagged for CAP-4.3 Security (PLANNED)
- [ ] Frontend capacity gap noted (FE ~15–20%)
- [ ] Org development roadmap aligns with CV-3 phases
- [ ] Cross-reference validation: CV-2, CV-3, OV-4, CV-6, SV-9 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Has the org chart (OV-4) changed?
- Is a Security Architect now actively delivering CAP-4.3?
- Did frontend capacity change the adoption picture?

**Generation order**

1. Org units → 2. Responsibility matrix → 3. Dev needs →
4. Roadmap → 5. Gaps.

**Pitfalls**

- Do not imply Security org development is complete (it is PLANNED).
- Keep org units consistent with OV-4.
- Keep CAP IDs identical to CV-2.
- Distinguish Builds (Eng) from Operates/Uses (practice staff).

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-2.itto.md` | Supplies CAP IDs |
| `template.OV-4.itto.md` | Supplies org units/roles |
| `template.CV-3.itto.md` | Supplies phase timing for the roadmap |
| `template.SV-9.itto.md` | Technology & skills forecast |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-5.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
