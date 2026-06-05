# CV-1: Vision

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-1 articulates the **strategic vision** that drives the Purple Cross capability
portfolio. It establishes the *why* behind the platform, the business context for
veterinary practices, the capability goals across the four Program Increments
(PI-1..PI-4), the desired operational outcomes/effects, and the traceability from
vision statements to the capabilities described in **CV-2 (Capability Taxonomy)**
and sequenced in **CV-3 (Capability Phasing)**.

> ⚠️ **Honesty note.** This vision is grounded in the current codebase. Backend
> services are ~85% real (Prisma-backed); the frontend is ~15–20% real CRUD;
> authentication, authorization, multi-tenant isolation, audit logging, and
> at-rest encryption are **PLANNED / IN PROGRESS** and are not claimed as
> delivered. See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Vision Statement

> **Purple Cross will be the type-safe, observable, and secure operating system
> for the modern veterinary practice — letting clinical and front-office teams
> run the full patient lifecycle (book → treat → bill → follow up) on a single
> unified data platform, while meeting HIPAA-equivalent expectations for the
> handling of client and patient information.**

### 2.1 Vision Pillars

| Pillar | Statement | Realized By |
|--------|-----------|-------------|
| **Unified practice operations** | One system of record for clinical, scheduling, and business workflows | 37 Express modules over a single PostgreSQL/Prisma data layer |
| **Type-safe by construction** | Defects caught at compile time, not in the clinic | Strict TypeScript 5.3, zero-`any`, Joi + Zod validation |
| **Observable & resilient** | Every request traceable; failures contained | Correlation IDs, Winston JSON logs, circuit breakers, retries |
| **Secure & compliant** | Tenant-isolated, audited, encrypted PHI/PII | AuthN/Z + RBAC + tenancy + audit + at-rest crypto (**PLANNED**) |
| **Self-service for clients** | Pet owners transact without a phone call | Client Portal, reminders, loyalty, feedback |

---

## 3. Business Context

### 3.1 The Veterinary Practice Problem

Veterinary practices juggle clinical care, scheduling, inventory, billing, and
client communication across fragmented tools. Paper records and disconnected
point solutions create double entry, missed reminders, billing leakage, and weak
auditability of who touched what patient record and when. Purple Cross
consolidates this into one platform.

```
                       BUSINESS CONTEXT FOR PURPLE CROSS
+----------------------------------------------------------------------------+
|  Drivers (external)                  Pressures (internal)                   |
|  - Rising visit volume               - Staff burnout / turnover            |
|  - Client self-service expectation   - Billing leakage & no-shows          |
|  - Data-protection expectations      - Fragmented point tools              |
|                 \                          /                                |
|                  v                        v                                 |
|            +------------------------------------+                          |
|            |   PURPLE CROSS CAPABILITY PORTFOLIO |                          |
|            |   (4 domains, see CV-2 taxonomy)    |                          |
|            +------------------------------------+                          |
|                  |                        |                                 |
|                  v                        v                                 |
|       Operational outcomes        Compliance outcomes                       |
|       (throughput, retention)     (audit, tenancy, encryption)             |
+----------------------------------------------------------------------------+
```

### 3.2 Stakeholders and Their Stake

| Stakeholder | What they need from the vision |
|-------------|--------------------------------|
| Clinical users (vets, techs) | Fast EHR, Rx, lab ordering; minimal clicks during care |
| Front office | Reliable scheduling, waitlist, billing, client comms |
| Pet owners (clients) | Self-service booking, reminders, transparent billing |
| Platform/Engineering team | Maintainable, type-safe, observable codebase |
| Security Architect | Enforceable AuthN/Z, tenant isolation, audit, encryption |
| Practice owner | Throughput, retention, compliance, total cost of ownership |

---

## 4. Capability Goals by Program Increment

The vision is delivered incrementally. Each PI advances specific capability goals;
detailed status by capability is in **CV-3 (Capability Phasing)**.

```
   PI-1 (2025Q3)     PI-2 (2025Q4)     PI-3 (2026Q1-2)    PI-4 (2026Q3-4)
   Phase 1           Phase 2           Phase 3            Phase 4
   Backend services  Frontend real     AuthN/Z + tenancy  Hardening + scale
   (~85% real)       CRUD (in prog)    (PLANNED)          (PLANNED)
   +-------------+   +-------------+   +-------------+    +-------------+
   | Prisma data |-->| React pages |-->| JWT + RBAC  |--> | At-rest enc |
   | + 37 modules|   | TanStack Q  |   | tenant scope|    | 500+ users  |
   | REST /v1    |   | real forms  |   | audit write |    | p95<300ms   |
   +-------------+   +-------------+   +-------------+    +-------------+
        v                 v                 v                  v
   Service tier      Usable UI for     Secure multi-      Production
   functionally      core workflows    tenant platform    readiness
   complete
```

| PI | Phase | Capability Goal | Desired State |
|----|-------|-----------------|---------------|
| **PI-1** | Backend services | Stand up all 37 module services on Prisma/PostgreSQL with REST `/api/v1`, validation, observability | Service tier ~85% real; APIs callable and validated |
| **PI-2** | Frontend real CRUD | Replace placeholder pages with real list/create/edit wired to TanStack Query | Core workflows usable end-to-end in the SPA |
| **PI-3** | AuthN/Z + tenancy | Wire JWT auth, enforce RBAC, scope every query by tenant, write audit logs | Platform is secure and tenant-isolated |
| **PI-4** | Hardening + scale | At-rest encryption of PHI/PII, load to 500+ users/tenant, 99.9% uptime, p95 < 300 ms | Production-ready, compliant, scalable |

---

## 5. Desired Outcomes and Effects

| Outcome ID | Desired Effect | Measure | Source View |
|------------|----------------|---------|-------------|
| OUT-1 | Reduced front-office time per appointment | Appointment booking p95 < 300 ms | SvcV-7 / SV-7 |
| OUT-2 | Fewer no-shows via automated reminders | Reminder delivery rate (SendGrid/Twilio) | CV-7, OV-6c |
| OUT-3 | Complete, auditable clinical records | % services writing AuditLog (target 100%; ~7/34 today) | CV-5, SV-10a |
| OUT-4 | No cross-tenant data exposure | 100% of queries tenant-scoped (currently 0%) | CV-4 (gating) |
| OUT-5 | PHI/PII protected at rest and in transit | 100% transit (now) + 100% at-rest (target) | CV-3, DIV-3 |
| OUT-6 | Scales to busy multi-location practices | 500+ concurrent users/tenant, 99.9% uptime | SV-7, SvcV-7 |

---

## 6. Vision-to-Capability Traceability

This table is the primary CV-1 → CV-2 hook. Each vision pillar maps to the
top-level capability domains in **CV-2** and is sequenced in **CV-3**.

| Vision Pillar | Capability Domain (CV-2) | Lead PI | Honest Status |
|---------------|--------------------------|---------|---------------|
| Unified practice operations | CAP-1.0 Clinical Care; CAP-2.0 Client & Scheduling; CAP-3.0 Business Operations | PI-1/PI-2 | Backend real; FE in progress |
| Type-safe by construction | CAP-4.0 Platform Services (build/validation) | PI-1 | Real (strict TS, Joi, Zod) |
| Observable & resilient | CAP-4.3 Observability, Resilience, Security | PI-1 | Logging/health real; breakers unused |
| Secure & compliant | CAP-4.3 (AuthN/Z, tenancy, audit, crypto) | PI-3/PI-4 | **PLANNED — gating dependency** |
| Self-service for clients | CAP-2.1 Client Mgmt & Portal | PI-2 | Backend real; FE placeholder |

---

## 7. Vision Constraints and Assumptions

| ID | Type | Statement | Risk if Invalid |
|----|------|-----------|-----------------|
| CON-001 | Constraint | Single stack: Express + React + PostgreSQL (NestJS/Next forks removed) | Re-architecture; loss of single source of truth |
| CON-002 | Constraint | Strict TypeScript, zero `any`, centralized constants | Type drift, regressions |
| ASM-001 | Assumption | AuthN/Z + tenancy ship before any production launch | Cross-tenant PHI exposure — vision invalidated |
| ASM-002 | Assumption | External providers (SendGrid/Twilio) remain available | Degraded comms; mitigated by circuit breakers (when wired) |
| ASM-003 | Assumption | Payments remain out of scope until a provider SDK is integrated | Billing flows stay manual; no Stripe SDK present today |

---

## 8. Relationships to Other Viewpoints

| Viewpoint | Relationship |
|-----------|--------------|
| AV-1 Overview | Parent summary; this CV-1 expands the capability vision |
| CV-2 Capability Taxonomy | Decomposes the vision pillars into CAP IDs |
| CV-3 Capability Phasing | Sequences the PI goals in Section 4 |
| CV-4 Capability Dependencies | Surfaces AuthN/Z as the gating dependency for the secure pillar |
| OV-1 Operational Concept | Operationalizes "book → treat → bill → follow up" |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
