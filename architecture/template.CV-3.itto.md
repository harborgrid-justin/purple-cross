# CV-3: Capability Phasing — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO documents how the **CV-3 Capability Phasing** matrix is produced. CV-3
maps the CV-2 capabilities onto the four Program Increments (PI-1..PI-4) with
honest Delivered / In Progress / Planned status, and schedules cross-cutting
platform concerns (auth, tenancy, audit, at-rest crypto, resilience).

---

## Inputs

### Required Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| CV-2 Taxonomy | `architecture/template.CV-2.md` | CAP-x.y IDs | Rows of the phasing matrix |
| CV-1 Vision | `architecture/template.CV-1.md` | PI goals | Column semantics (phases) |
| Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` | Real-vs-aspirational | Set honest status per cell |
| Roadmap / PI plan | Program Manager | Increment dates/goals | Align timeline |

### Optional Inputs

| Input | Source | Contains | Purpose |
|-------|--------|----------|---------|
| Source middleware | `../backend/src/middleware/auth.ts` | Auth wiring state | Confirm auth is unwired |
| Frontend routing | `../frontend/src/` `ProtectedRoute` | Auth gate state | Confirm hardcoded auth |

---

## Tools & Techniques

**Tools**

- Markdown authoring; ASCII timeline + matrix
- Codebase grep/read to verify Delivered vs Planned claims
- Git for version control

**Techniques**

- Capability × increment matrix construction
- Status classification (D / IP / P) grounded in code
- Exit-criteria definition per increment
- Risk identification for phasing slips

---

## Outputs

**Primary artifact:** `architecture/template.CV-3.md`

**Supporting outputs**

- Capability phasing matrix (consumed by SV-8 / SvcV-8 evolution)
- Cross-cutting concern schedule (auth, tenancy, audit, crypto)
- Phasing risk register

---

## File Generation Workflow

1. **Inherit** — Pull CAP IDs from CV-2 and PI goals from CV-1.
2. **Classify** — Set D/IP/P per capability per increment from the gap analysis.
3. **Verify** — Grep code to confirm auth/tenancy/audit are unwired.
4. **Define exits** — Write exit criteria per PI.
5. **Schedule concerns** — Map cross-cutting concerns to phases.
6. **Assess risk** — Capture phasing risks and mitigations.
7. **Cross-link** — Reference CV-1, CV-2, CV-4, SV-8/SvcV-8.

---

## Quality Checklist

- [ ] Header block matches house style (Document ID `PCVPM-CV-3-2026`)
- [ ] Every CV-2 capability appears as a matrix row
- [ ] Status cells are honest (security = Planned, FE mostly IP/P)
- [ ] Backend tier shown as Delivered (~85%) for PI-1
- [ ] Cross-cutting concern table cites real code artifacts
- [ ] Exit criteria defined for each PI
- [ ] Cross-reference validation: CV-1, CV-2, CV-4, SV-8 named
- [ ] Closing classification footer present

---

## LLM Guidance

**Questions to ask first**

- Has any PLANNED item shipped since last revision?
- Did the PI dates move?
- Is the frontend completion percentage still ~15–20%?

**Generation order**

1. Timeline → 2. Matrix rows from CV-2 → 3. Status cells →
4. Exit criteria → 5. Cross-cutting schedule → 6. Risks.

**Pitfalls**

- Never mark auth/RBAC/tenancy/audit/at-rest crypto as Delivered.
- Keep CAP IDs identical to CV-2.
- Distinguish CAP-4.3 observability (Delivered) from CAP-4.3 security (Planned).
- Do not phase a payments capability — none exists.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| `template.CV-1.itto.md` | Supplies PI goals |
| `template.CV-2.itto.md` | Supplies CAP IDs |
| `template.CV-4.itto.md` | Explains security gating dependency |
| `template.SV-8.itto.md` | Systems evolution realizing the phasing |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Template Version | 1.0.0 |
| Framework | DoDAF 2.02 |
| View Type | Capability Viewpoint |
| Primary Output | `architecture/template.CV-3.md` |
| Last Review | 2026-06-05 |
| Next Review | 2026-09-05 |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
