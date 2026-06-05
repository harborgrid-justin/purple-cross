# OV-4: Organizational Relationships Chart

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-4-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-4 describes the **organizational roles** that operate a Purple Cross veterinary
practice and the **reporting and collaboration relationships** among them. It maps
the internal operational nodes of **OV-1/OV-2** to human roles, documents their
responsibilities and skills, and shows how roles interact across the care-to-cash
workflow. The pet owner (client) is shown as an external party.

> ⚠️ **Honesty note.** Purple Cross defines RBAC roles (e.g., `admin`, `vet`,
> `tech`, `front-office`) in constants, but **these roles are NOT enforced**:
> authentication is not wired (auth middleware exists, 0 routes consume it; the
> frontend hardcodes `isAuthenticated = true`), so every role's system access is
> currently identical. The org relationships below are the *intended* operating
> model; access-control enforcement is **PLANNED**. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Organizational Chart

```
                          PURPLE CROSS — PRACTICE ORGANIZATION (OV-4)

                              ┌────────────────────────────┐
                              │   Practice Owner (ORG-1)    │
                              │   business accountability   │
                              └──────────────┬─────────────┘
                                             │ governs
                                             ▼
                              ┌────────────────────────────┐
                              │  Practice Manager (ORG-2)   │
                              │  operations & supervision   │
                              └───┬───────────┬─────────┬───┘
                supervises        │           │         │       supervises
              ┌───────────────────┘           │         └───────────────────┐
              ▼                                ▼                             ▼
   ┌────────────────────┐         ┌────────────────────┐        ┌────────────────────┐
   │ Veterinarian       │  clin.  │ Veterinary Tech    │        │ Front Office /     │
   │ (ORG-3)            │◄───────►│ (ORG-4)            │        │ Receptionist(ORG-5)│
   │ clinical authority │ support │ clinical support   │        │ scheduling/billing │
   └─────────┬──────────┘         └─────────┬──────────┘        └─────────┬──────────┘
             │ collaborate                   │ collaborate                 │ serves
             └───────────────────────────────┴─────────────┬───────────────┘
                                                            ▼
                                              ┌────────────────────────────┐
                                              │  Pet Owner / Client (ORG-6) │
                                              │  EXTERNAL — receives care    │
                                              └────────────────────────────┘

   Legend:  ──► reporting/supervision    ◄──► peer collaboration    ▼ service relationship
```

---

## 3. Roles, Responsibilities & Skills

| Role ID | Role | Maps to Node | Key Responsibilities | Required Skills | Intended RBAC Role* |
|---------|------|--------------|----------------------|-----------------|---------------------|
| ORG-1 | Practice Owner | (governance) | Business strategy, financial accountability, compliance ownership | Business mgmt, veterinary licensure (often) | `admin` |
| ORG-2 | Practice Manager | ON-8 | Staffing, scheduling policy, reporting, supply approval, escalations | Operations mgmt, analytics literacy | `admin` / `manager` |
| ORG-3 | Veterinarian | ON-2 | Diagnosis, treatment, prescribing, lab ordering, record authorship | DVM licensure, clinical judgment, prescribing authority | `vet` |
| ORG-4 | Veterinary Technician | ON-3 | Vitals, sample collection, lab prep, treatment assistance, inventory pulls | Vet-tech credential, clinical handling | `tech` |
| ORG-5 | Front Office / Receptionist | ON-1, ON-6 | Booking, check-in, client intake, invoice/payment capture, communications | Scheduling, customer service, basic billing | `front-office` |
| ORG-6 | Pet Owner / Client | ON-7 | Books visits, consents to care, pays invoices, receives reminders | (external) | none (portal user) |

\* Intended RBAC role exists in `backend/src/constants` but is **not enforced**
at any route (PLANNED).

---

## 4. Role-Interaction Matrix

Cell shows the dominant interaction; "—" = no direct operational interaction.

| ↓ initiates / → with | ORG-1 Owner | ORG-2 Mgr | ORG-3 Vet | ORG-4 Tech | ORG-5 Front | ORG-6 Owner(Client) |
|----------------------|-------------|-----------|-----------|------------|-------------|---------------------|
| **ORG-1 Owner** | — | Governs | Policy/clinical standards | Policy | Policy | Brand/relationship |
| **ORG-2 Mgr** | Reports up | — | Schedules/supports | Schedules/supports | Supervises | Escalations |
| **ORG-3 Vet** | Clinical input | Reports clinical | — | Delegates clinical tasks | Hands off billing items | Consults/treats |
| **ORG-4 Tech** | — | Reports | Assists | — | Provides visit status | Assists handling |
| **ORG-5 Front** | — | Reports | Routes patients | Coordinates flow | — | Books/checks-in/bills |
| **ORG-6 Owner** | — | — | Receives care | — | Requests/pays | — |

---

## 5. Organizational Resource Mapping

How roles relate to the OV-2 needlines and OV-3 flows they originate or consume.

| Role | Originates (produces) | Consumes | Primary Modules |
|------|-----------------------|----------|-----------------|
| ORG-2 Practice Mgr | Schedule policy (RF-03), approvals (RF-28) | Metrics/reports (RF-27) | analytics, staff, time-blocks, purchase-orders |
| ORG-3 Veterinarian | Records (RF-29), Rx (RF-08), lab orders (RF-12) | History (RF-05), results (RF-14) | medical-records, prescriptions, lab-tests |
| ORG-4 Vet Tech | Vitals (RF-07), specimen handoff (RF-13) | Task orders (RF-06) | medical-records, lab-tests, inventory |
| ORG-5 Front Office | Bookings (RF-01/02), invoices (RF-15), dispatch (RF-24/25) | Schedule (RF-28), payments (RF-17) | appointments, clients, invoices, communications |
| ORG-6 Pet Owner | Booking req (RF-01), payment (RF-17) | Reminders/receipts (RF-20/26) | client-portal, communications |

---

## 6. Multi-Tenancy & Governance Notes

| Aspect | Intended Model | Reality | Status |
|--------|----------------|---------|--------|
| One organization = one practice tenant | Roles scoped to a tenant | Tenant fields exist; **not scoped** in queries | PLANNED |
| Role-based access per ORG role | RBAC from constants enforced at routes | **Unenforced** — no route checks role | PLANNED |
| Authenticated identity per user | JWT login establishes ORG identity | **Auth not wired**; FE hardcodes authenticated | PLANNED |
| Audit of who-did-what by role | Every privileged action logged | `AuditLog` written by ~7/34 services | PARTIAL |

---

## 7. Honesty & Gap Notes

| Org Element | Reality | Status |
|-------------|---------|--------|
| RBAC roles (`admin`/`vet`/`tech`/`front-office`) | Defined in constants only | DEFINED, NOT ENFORCED |
| Supervisory access boundaries | Same system access for all roles today | PLANNED |
| Client (ORG-6) portal self-service | Endpoints exist; FE largely placeholder | IN PROGRESS |
| Cross-tenant isolation between practices | Not enforced | PLANNED |

---

## 8. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-1 | Internal nodes mapped to these roles |
| OV-2 / OV-3 | Needlines/flows each role produces/consumes |
| OV-5a/5b | Activities performed by these roles (mechanisms) |
| OV-6a | Rules that *would* enforce role authority (PLANNED) |
| CV-5 | Capability-to-organization mapping |
| SV-2 | Systems supporting role interactions |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
