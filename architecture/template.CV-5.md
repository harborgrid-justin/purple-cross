# CV-5: Capability to Organizational Development Mapping

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-5-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-5 maps each capability (from CV-2) to the **organizational units responsible**
for operating it, and identifies the **organizational development** (roles,
skills, process maturity) required for each capability to deliver value. It links
the capability portfolio to the people and teams that build, run, and use it.

> ⚠️ **Honesty note.** The Security Architect's org development is the critical
> path: enforcing AuthN/Z, RBAC, tenancy, and audit (CAP-4.3 Security) is
> **PLANNED** work that no existing role is yet executing in code. The "build"
> column reflects the Platform/Engineering team; the "operate/use" columns
> reflect clinical and front-office practice staff.

---

## 2. Responsible Organization Units

| Org Unit | Description | Primary Role in Platform |
|----------|-------------|--------------------------|
| Clinical Users | Veterinarians, vet techs | Operate clinical capabilities (EHR, Rx, lab) |
| Front Office | Receptionists, practice managers | Operate scheduling, billing, client comms |
| Pet Owners (Clients) | External self-service users | Use client portal capabilities |
| Platform / Engineering | Purple Cross engineers & ops | Build & operate all capabilities |
| Security Architect | Security/compliance owner | Deliver CAP-4.3 Security (PLANNED) |
| Data / Analytics | Reporting & data governance | Operate analytics & reporting |

---

## 3. Capability → Organization Mapping Matrix

Legend: **B** = Builds · **O** = Operates · **U** = Uses · **G** = Governs

| Capability | Clinical | Front Office | Clients | Platform/Eng | Security Arch | Data/Analytics |
|------------|:--------:|:------------:|:-------:|:------------:|:-------------:|:--------------:|
| CAP-1.1 Patient Records | O/U | U | — | B | G | U |
| CAP-1.2 Prescriptions | O/U | — | — | B | G | — |
| CAP-1.3 Laboratory | O/U | U | — | B | G | — |
| CAP-2.1 Client Mgmt & Portal | — | O/U | U | B | G | — |
| CAP-2.2 Appointments | U | O/U | U | B | G | — |
| CAP-2.3 Communications | — | O/U | U | B | G | — |
| CAP-3.1 Billing & Revenue | — | O/U | U | B | G | U |
| CAP-3.2 Inventory | — | O/U | — | B | G | — |
| CAP-3.3 Workforce | — | O/U | — | B | G | — |
| CAP-4.1 Analytics | U | U | — | B | G | O/U |
| CAP-4.2 Documents | U | O/U | U | B | G | — |
| CAP-4.3 Security (PLANNED) | — | — | — | B | **O/G** | — |
| CAP-4.3 Observability | — | — | — | B/O | G | U |

---

## 4. Organizational Development Needed per Capability

| Capability | Org Development Required | Maturity Today |
|------------|--------------------------|----------------|
| CAP-1.0 Clinical Care | Clinical onboarding, EHR/Rx workflow training | Backend ready; UI training pending FE |
| CAP-2.0 Client & Scheduling | Front-office scheduling SOPs; portal support process | Backend ready; portal FE placeholder |
| CAP-3.0 Business Operations | Billing/AR procedures; inventory reorder policy | Backend ready; payments manual |
| CAP-4.1 Analytics | Data literacy; report-template governance | Backend ready |
| CAP-4.2 Documents | Document/template governance, retention policy | Backend ready |
| CAP-4.3 Security | **Security engineering capacity: wire auth, RBAC, tenancy, audit, key mgmt** | **PLANNED — not staffed in code yet** |

---

## 5. Org Development Roadmap (aligned to CV-3 phasing)

```
  PI-1 Backend      PI-2 Frontend     PI-3 Security      PI-4 Hardening
  Platform/Eng      Platform/Eng +    Security Arch      Platform/Eng +
  builds services   practice UAT      leads AuthN/Z,     Security Arch +
                    (clinical/front   RBAC, tenancy,     Data/Analytics
                     office train)    audit rollout      operate at scale
  +-----------+     +-----------+     +-----------+      +-----------+
  | Eng skill |---->| Practice  |---->| Security  |----->| Ops/SRE   |
  | ramp      |     | adoption  |     | hardening |      | + on-call |
  +-----------+     +-----------+     +-----------+      +-----------+
```

| Phase | Org Development Focus | Owner |
|-------|-----------------------|-------|
| PI-1 | Engineering capacity to build 37 module services | Platform/Eng |
| PI-2 | Practice user adoption & UAT of real CRUD pages | Front Office + Clinical |
| PI-3 | Security engineering to deliver CAP-4.3 Security | Security Architect |
| PI-4 | SRE/on-call, scale operations, compliance sign-off | Platform/Eng + Security |

---

## 6. Roles, Skills, and Gaps

| Role | Required Skills | Capability Served | Gap |
|------|-----------------|-------------------|-----|
| Backend Engineer | TypeScript strict, Express, Prisma, Joi | All backend capabilities | Mostly met (~85% built) |
| Frontend Engineer | React 18, TanStack Query, Zod/RHF | All UI capabilities | Capacity gap (FE ~15–20%) |
| Security Architect | JWT, RBAC, multi-tenancy, encryption, audit | CAP-4.3 Security | **Critical gap — work not started in code** |
| SRE / Ops | Docker, Redis/BullMQ, observability, load | CAP-4.3 Observability, scale | To staff for PI-4 |
| Data Analyst | SQL, reporting, report-templates | CAP-4.1 Analytics | To grow with adoption |

---

## 7. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-2 Taxonomy** | Source of capabilities mapped to organizations |
| **CV-3 Phasing** | Sequences the org-development roadmap |
| **OV-4 Organizational Relationships** | Detailed org chart underpinning this mapping |
| **CV-6 Activity Mapping** | Activities these org units perform per capability |
| **SV-9 / SvcV-9** | Technology & skills forecast supporting org development |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
