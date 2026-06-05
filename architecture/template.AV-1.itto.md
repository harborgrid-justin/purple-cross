# AV-1: Overview and Summary Information — ITTO (Inputs, Tools & Techniques, Outputs)

## Overview

This ITTO document describes the prerequisites, tools, techniques, and outputs
for producing the **AV-1 Overview and Summary Information** artifact
([`template.AV-1.md`](template.AV-1.md)) for the Purple Cross veterinary
practice management platform. AV-1 is the executive entry point to the DoDAF
description: it states scope, purpose, capabilities, context, and an honest
findings/risks summary.

---

## Inputs (Prerequisites)

### Required Inputs

#### 1. Repository Guidance & Module Catalog
- **Source:** [`../CLAUDE.md`](../CLAUDE.md)
- **Contains:** Stack decisions, module list (15+ core + extended), standards
- **Purpose:** Establishes authoritative scope and module inventory

#### 2. System Architecture Document
- **Source:** [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- **Contains:** Layered backend, technology stack, module architecture
- **Purpose:** Grounds the technical scope and context diagram

#### 3. Production Gap Analysis
- **Source:** [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md)
- **Contains:** Honest real-vs-aspirational assessment (auth not wired, etc.)
- **Purpose:** Drives the Findings/Risks/Recommendations sections truthfully

#### 4. Prisma Schema
- **Source:** [`../backend/prisma/schema.prisma`](../backend/prisma/schema.prisma)
- **Contains:** ~69 data models, relationships, indexes
- **Purpose:** Substantiates the data-bearing capability claims

#### 5. Express App Composition
- **Source:** [`../backend/src/app.ts`](../backend/src/app.ts)
- **Contains:** Middleware stack, route mounting, API prefix `/api/v1`
- **Purpose:** Confirms cross-cutting capabilities and external interfaces

### Optional Inputs
- **Existing enterprise docs** (`ENTERPRISE_CAPABILITIES.md`) — prior baseline
- **Constants modules** (`backend/src/constants`) — performance/limit defaults
- **`.env.production.example`** — external integration inventory (SendGrid, Twilio)

---

## Tools & Techniques

### Tools
- **Markdown editor** (VS Code) for authoring
- **ASCII / Mermaid** for context, capability hierarchy, and timeline diagrams
- **Git** for version history and review
- **grep/ripgrep over the codebase** to validate every capability claim

### Techniques
- **Stakeholder analysis** — derive the operator roles (vet, tech, front office, manager, client)
- **Boundary analysis** — separate in-scope platform from external systems
- **Capability mapping** — decompose into 4 domains / 12 sub-capabilities
- **Honest gap assessment** — cross-check each claim against the gap analysis; mark PLANNED where not shipped
- **Risk assessment** — rate gaps (auth = HIGH) with mitigations and owners

---

## Outputs (Generated Artifacts)

### Primary Output
- **Artifact:** [`template.AV-1.md`](template.AV-1.md)
- **Contains:** Identification, scope & purpose, context diagram, operational
  concept, capability summary, findings/conclusions/recommendations,
  architecture relationships, constraints & assumptions, approvals, appendices.

### Supporting Outputs
- **Context diagram** (system boundary + external interfaces)
- **Capability hierarchy** (CAP-1.0 … CAP-4.0)
- **Stakeholder/PoC table**
- **Acronym dictionary** (feeds AV-2)

---

## File Generation Workflow

1. **Gather** the five required inputs above.
2. **Draft identification** (name, ID `PCVPM-EA`, version, PoCs).
3. **Define scope** boundaries (in-scope domains vs external systems).
4. **Build the context diagram** from `app.ts` + integrations.
5. **Summarize capabilities** from the module catalog → CAP IDs.
6. **Run the honest gap pass** against `PRODUCTION_GAP_ANALYSIS.md`; populate
   findings, risks, and recommendations.
7. **Cross-link** to CV-1 (vision), OV-1 (operations), SV-1 (systems).
8. **Review & route** for approval.

---

## Quality Checklist

- [ ] All capability claims verified against actual code (no aspirational claims stated as done)
- [ ] Authentication/authorization explicitly marked **PLANNED / not yet wired**
- [ ] Scope boundary lists in-scope domains and external systems
- [ ] Context diagram matches `app.ts` middleware/integrations
- [ ] Capability IDs (CAP-x.0) align with **CV-2** taxonomy
- [ ] External system names align with **SV-1** interfaces
- [ ] Performance targets align with **SV-7** measures
- [ ] Risks have levels, mitigations, owners
- [ ] Acronyms defined (and consistent with **AV-2**)
- [ ] Document control footer present

---

## LLM Guidance

**Questions to resolve first:** What is in scope vs external? Which capabilities
are shipped vs planned? Who are the operator roles? What are the gating risks?

**Generation order:** identification → scope → context → operational concept →
capabilities → findings/risks → relationships → constraints → appendices.

**Pitfalls to avoid:**
1. Restating aspirational features (MongoDB/Kafka/NestJS from the older
   `docs/ARCHITECTURE.md`) — the real stack is Express + React + PostgreSQL only.
2. Claiming auth/tenancy/audit/encryption are complete — they are **PLANNED**.
3. Inventing module or model names — use the verified catalog.

---

## Related ITTO Documents

| Document | Relationship |
|----------|--------------|
| [`template.AV-2.itto.md`](template.AV-2.itto.md) | AV-1 terminology is defined in the AV-2 dictionary |
| [`template.CV-1.itto.md`](template.CV-1.itto.md) | AV-1 summarizes the CV-1 vision |
| [`template.OV-1.itto.md`](template.OV-1.itto.md) | AV-1 summarizes the OV-1 operational concept |
| [`template.SV-1.itto.md`](template.SV-1.itto.md) | AV-1 references SV-1 interfaces |

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
**Related Artifact:** [`template.AV-1.md`](template.AV-1.md)
