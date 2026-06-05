# AV-2: Integrated Dictionary — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO describes how to produce and maintain the **AV-2 Integrated
Dictionary** ([`template.AV-2.md`](template.AV-2.md)) — the single authoritative
glossary of every term, data entity, capability, activity, system, and service
used across the Purple Cross DoDAF description. AV-2 is a *living* artifact: it
is updated in lockstep with every other view.

---

## Inputs (Prerequisites)

### Required Inputs

#### 1. Prisma Schema (data entities)
- **Source:** [`../backend/prisma/schema.prisma`](../backend/prisma/schema.prisma)
- **Contains:** ~69 models and shared columns (`createdAt`, `tenantId`, `deletedAt`, …)
- **Purpose:** Canonical definitions for the data dictionary (§6)

#### 2. Module Catalog
- **Source:** [`../CLAUDE.md`](../CLAUDE.md), `backend/src/routes/`
- **Contains:** 37 module names mapped to services
- **Purpose:** Service and capability vocabulary

#### 3. Constants Modules
- **Source:** `backend/src/constants/index.ts`, `frontend/src/constants/index.ts`
- **Contains:** Status enums, roles, HTTP codes, pagination, time limits
- **Purpose:** Authoritative status values and role names

#### 4. Production Gap Analysis
- **Source:** [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md)
- **Contains:** Real-vs-aspirational status for each capability
- **Purpose:** Correct `REAL / IN PROGRESS / PLANNED` markers (§5)

### Optional Inputs
- **All sibling views** — every new acronym/entity introduced elsewhere
- **OpenAPI spec** (`/api-docs.json`) — exact resource and field names

---

## Tools & Techniques

### Tools
- **Markdown tables** for term/definition pairs
- **ripgrep** to harvest model names, enums, and acronyms from the codebase
- **Git diff review** to catch new vocabulary entering any view

### Techniques
- **Term harvesting** — extract every PascalCase model and ALL-CAPS acronym
- **Subject-area grouping** — cluster entities (Clinical, CRM, Billing, …)
- **Status tagging** — mark each capability/term `REAL / IN PROGRESS / PLANNED`
- **Single-source enforcement** — define each term exactly once; other views link here
- **Consistency sweep** — reconcile IDs (CAP-/A/S/SF-/SVC-/rule prefixes) across views

---

## Outputs (Generated Artifacts)

### Primary Output
- **Artifact:** [`template.AV-2.md`](template.AV-2.md)
- **Contains:** Conventions, framework terms, platform/tech terms, security terms
  (with honest status), the integrated data dictionary (entities by subject
  area), operator roles, and acronyms.

### Supporting Outputs
- **Acronym table** consumed by AV-1 Appendix B
- **Entity subject-area grouping** consumed by DIV-1/DIV-2

---

## File Generation Workflow

1. **Harvest** model names from `schema.prisma`; group by subject area.
2. **Harvest** acronyms and status enums from constants and views.
3. **Write** framework, platform, and security term tables.
4. **Apply status markers** using the gap analysis (auth/RBAC/tenancy/audit/
   encryption = PLANNED/IN PROGRESS).
5. **Cross-check** every ID prefix against CV/OV/SV/SvcV.
6. **Publish**; thereafter update on every view change.

---

## Quality Checklist

- [ ] Every Prisma model appears exactly once in §6
- [ ] Shared columns (audit/soft-delete/tenant) documented once
- [ ] Security terms carry honest `PLANNED/IN PROGRESS` status
- [ ] Every acronym used in any view is defined in §8
- [ ] ID conventions (CAP-/A/S/SF-/SVC-/OR-/SR-/SvcR-) match sibling views
- [ ] No term defined in two places with conflicting meaning
- [ ] Source references appendix is current

---

## LLM Guidance

**Questions to resolve first:** Has a new entity/acronym been introduced by any
view? Is its status REAL, IN PROGRESS, or PLANNED per the gap analysis?

**Generation order:** conventions → framework → platform → security →
data dictionary → roles → acronyms.

**Pitfalls to avoid:**
1. Listing a model that does not exist in `schema.prisma`.
2. Marking auth/tenancy/encryption as REAL — they are PLANNED.
3. Defining the same acronym differently from a sibling view.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| [`template.AV-1.itto.md`](template.AV-1.itto.md) | AV-1 draws all terminology from AV-2 |
| [`template.DIV-1.itto.md`](template.DIV-1.itto.md) | DIV-1 expands the AV-2 entity definitions into relationships |
| [`template.DIV-2.itto.md`](template.DIV-2.itto.md) | DIV-2 adds attributes/keys to AV-2 entities |
| [`template.CV-2.itto.md`](template.CV-2.itto.md) | CV-2 capability names are registered in AV-2 |

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Template Version** | 1.0.0 |
| **Last Updated** | 2026-06-05 |
| **Maintained By** | Purple Cross Architecture Team |
| **Framework** | DoDAF 2.02 |
| **View Type** | All Viewpoint |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Related Artifact:** [`template.AV-2.md`](template.AV-2.md)
