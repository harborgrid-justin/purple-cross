# AV-1: Overview and Summary Information

## DoDAF 2.02 All Viewpoint

**Document ID:** PCVPM-AV-1-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Architecture Identification Information

### 1.1 Architecture Name and Description

| Attribute | Value |
|-----------|-------|
| **Architecture Name** | Purple Cross Enterprise Architecture |
| **Architecture ID** | PCVPM-EA |
| **Short Name** | Purple Cross |
| **Version** | 1.0.0 |
| **Status** | DRAFT (production hardening in progress) |

**Description:** Purple Cross is a veterinary practice management platform built
with TypeScript across a single production stack — an **Express** REST API
(`backend/`) backed by **PostgreSQL** via **Prisma ORM**, and a **Vite + React 18**
single-page application (`frontend/`) using TanStack Query for server state. The
platform delivers 15+ functional modules spanning patient and client management,
appointment scheduling, medical records, prescriptions, inventory, billing,
laboratory, staff, communications, documents, analytics, and a set of extended
modules (client portal, loyalty, insurance claims, purchase orders, equipment,
and more). The architecture emphasizes type safety (strict TypeScript, zero
`any`), a layered route → controller → service → Prisma backend, and
production-oriented resilience and observability middleware.

### 1.2 Architecture Development Information

| Attribute | Value |
|-----------|-------|
| **Lead Architect** | Purple Cross Architecture Team |
| **Sponsoring Organization** | Purple Cross |
| **Architecture Start Date** | 2025-Q3 |
| **Architecture Approval Date** | TBD |
| **Architecture Review Date** | 2026-06-05 |
| **Framework** | DoDAF 2.02 |
| **Tool Suite** | Markdown + Mermaid/ASCII; Prisma schema as data source of truth |

### 1.3 Architecture Points of Contact

| Role | Organization | Responsibility |
|------|--------------|----------------|
| Chief Architect | Purple Cross | Overall architecture direction and governance |
| Solutions Architect | Purple Cross | Express/React design, integration patterns |
| Data Architect | Purple Cross | Prisma schema, data model, information governance |
| Security Architect | Purple Cross | AuthN/Z rollout, PHI/PII handling, compliance |
| Product Owner | Purple Cross | Requirements, practice-workflow liaison |
| Program Manager | Purple Cross | Timeline, resources, delivery |

### 1.4 Architecture Version History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2026-06-05 | Architecture Team | Initial DoDAF 2.02 baseline grounded in current codebase |

---

## 2. Scope and Purpose

### 2.1 Architecture Purpose

The Purple Cross Enterprise Architecture serves the following purposes:

1. **Strategic Planning** — Provide a single, framework-aligned description of
   the platform to guide the production-hardening roadmap.
2. **Stakeholder Communication** — Give practice owners, clinicians, and
   engineers a shared model of how the system is structured and operated.
3. **Compliance Demonstration** — Document data handling, security posture, and
   the path to HIPAA-equivalent controls for veterinary client/patient data.
4. **Integration Planning** — Define external interfaces (email/SMS providers,
   payments) and internal module boundaries.
5. **Acquisition Support** — Inform technology and vendor decisions (cloud,
   monitoring, message infrastructure) with traceable rationale.
6. **Risk Management** — Surface the real-vs-aspirational gaps (notably that
   authentication is not yet wired) so risk is managed explicitly.

### 2.2 Architecture Scope

#### 2.2.1 Scope Boundaries

```
+----------------------------------------------------------------------------------------+
|                          ARCHITECTURE SCOPE BOUNDARY                                    |
+----------------------------------------------------------------------------------------+
|                                                                                         |
|   +---------------------------------------------------------------------------------+  |
|   |                    PURPLE CROSS PLATFORM (IN SCOPE)                              |  |
|   |                                                                                  |  |
|   |  +---------------------------+  +---------------------------+                   |  |
|   |  | Clinical Care             |  | Client & Front Office     |                   |  |
|   |  | - Patient Management      |  | - Client Management       |                   |  |
|   |  | - Medical Records         |  | - Appointments / Waitlist |                   |  |
|   |  | - Prescriptions / Lab     |  | - Communications / Portal |                   |  |
|   |  +---------------------------+  +---------------------------+                   |  |
|   |                                                                                  |  |
|   |  +---------------------------+  +---------------------------+                   |  |
|   |  | Business Operations       |  | Platform Services         |                   |  |
|   |  | - Billing / Invoices      |  | - Analytics / Reporting   |                   |  |
|   |  | - Inventory / Purchasing  |  | - Documents / Templates   |                   |  |
|   |  | - Staff / Equipment       |  | - Observability / Health  |                   |  |
|   |  +---------------------------+  +---------------------------+                   |  |
|   +---------------------------------------------------------------------------------+  |
|                                                                                         |
+----------------------------------------------------------------------------------------+
|                          EXTERNAL SYSTEMS (INTERFACE SCOPE)                             |
+----------------------------------------------------------------------------------------+
|  SendGrid (Email)                 Twilio (SMS)                     Payment Provider     |
+----------------------------------------------------------------------------------------+
```

#### 2.2.2 Functional Scope

| Domain | Modules | Functional Coverage | Key Capabilities |
|--------|---------|---------------------|------------------|
| **Clinical Care** | ~5 | Patients, medical records, prescriptions, lab tests, breeds | EHR, Rx, diagnostics |
| **Client & Front Office** | ~6 | Clients, appointments, waitlist, time blocks, communications, portal | Scheduling, outreach, self-service |
| **Business Operations** | ~7 | Invoices, estimates, payment plans, refunds, inventory, purchase orders, staff, equipment | Billing, supply chain, workforce |
| **Platform Services** | ~4 | Analytics, documents, templates, reminders, loyalty, feedback, marketing, policies | Reporting, content, engagement |
| **TOTAL** | **15+ core + extended** | **Full practice lifecycle** | **End-to-end PIMS** |

#### 2.2.3 Technical Scope

| Layer | Technology | In Scope | Purpose |
|-------|------------|----------|---------|
| **Frontend** | React 18, Vite, TanStack Query, React Router 6, TypeScript | Yes | SPA UI for staff and clients |
| **Backend** | Node.js, Express, TypeScript, `express-async-errors` | Yes | REST API, business logic |
| **Database** | PostgreSQL + Prisma ORM | Yes | Relational system of record |
| **Cache / Async** | Redis | Yes | Caching, rate-limit/session backing |
| **API** | REST under `/api/v1`, Joi validation | Yes | Versioned, validated contracts |
| **Security** | Helmet, CORS, input sanitization; JWT auth | Partial | Headers/CORS live; **auth not yet wired** |

#### 2.2.4 Organizational Scope

| Stakeholder Type | Organizations | Role |
|------------------|---------------|------|
| **Veterinary Practice** | Clinic owners, veterinarians, vet techs | Primary operators / clinical users |
| **Front Office** | Receptionists, practice managers | Scheduling, billing, client service |
| **Pet Owners (Clients)** | External clients | Self-service via client portal |
| **Platform Team** | Purple Cross engineering & ops | Build, operate, secure the platform |

### 2.3 Architecture Timeframe

```
Timeline: 2025 Q3 -----> 2026 Q4

         PI-1        PI-2        PI-3        PI-4
        (2025Q3)    (2025Q4)    (2026Q1-2)  (2026Q3-4)
           |           |           |           |
           v           v           v           v
     +----------+ +----------+ +----------+ +----------+
     | Phase 1  | | Phase 2  | | Phase 3  | | Phase 4  |
     | Backend  | | Frontend | | AuthN/Z  | | Harden   |
     | services | | real CRUD| | + tenancy| | + scale  |
     +----------+ +----------+ +----------+ +----------+
           |           |           |           |
           v           v           v           v
       Services ~85%  Pages live  Security    Production
       real           (in prog)   cutover     readiness
```

---

## 3. Context Diagram

### 3.1 System Context

```
                                    EXTERNAL ENVIRONMENT
+--------------------------------------------------------------------------------+
|                                                                                 |
|   +------------------+                                   +------------------+   |
|   | SendGrid         |                                   | Twilio           |   |
|   | - Email delivery |                                   | - SMS delivery   |   |
|   +--------+---------+                                   +--------+---------+   |
|            |                                                      |             |
|            | HTTPS/REST                                 HTTPS/REST              |
|            v                                                      v             |
|   +--------+---------+   +------------------+   +--------+---------+            |
|   | Comms Service    |   |                  |   | Comms Service    |            |
|   +------------------+   |   PURPLE CROSS   |   +------------------+            |
|                          |   Express API    |                                   |
|   +------------------+   |   +-----------+  |   +------------------+            |
|   | Payment Provider +-->+   | Services  |  +<--+ Browser SPA      |            |
|   +------------------+   |   | + Prisma  |  |   | (React/Vite)     |            |
|                          +--------+---------+   +------------------+            |
|                                   |                                             |
|                                   v                                             |
|   +--------------------------------------------------------------------------+ |
|   |                          USER COMMUNITY                                   | |
|   |  +-------------+  +-------------+  +-------------+  +-------------+      | |
|   |  | Veterinarian|  | Vet Tech    |  | Front Office|  | Pet Owner   |      | |
|   |  +-------------+  +-------------+  +-------------+  +-------------+      | |
|   +--------------------------------------------------------------------------+ |
|                                                                                 |
+--------------------------------------------------------------------------------+
```

### 3.2 Information Exchange Summary

| External System | Protocol | Direction | Data Types |
|-----------------|----------|-----------|------------|
| SendGrid | HTTPS / REST | Outbound | Appointment reminders, receipts, notifications |
| Twilio | HTTPS / REST | Outbound | SMS reminders, alerts |
| Payment Provider | HTTPS / REST | Bidirectional | Charges, payment status, refunds |
| Browser SPA | HTTPS / REST (`/api/v1`) | Bidirectional | All practice data (JSON) |

---

## 4. High-Level Operational Concept

### 4.1 Operational Overview

A veterinary practice runs its day on Purple Cross: front office books and
manages appointments, clinicians document care in medical records and write
prescriptions, lab results attach to patients, billing produces invoices and
collects payment, and inventory/purchasing keeps supplies stocked. All modules
read and write a unified PostgreSQL data layer through the Prisma-backed service
tier, and every request is traced end-to-end via correlation IDs.

```
                           OPERATIONAL CONCEPT OVERVIEW
+----------------------------------------------------------------------------+
|                                                                             |
|                        PRACTICE OPERATIONS                                  |
|                  (book -> treat -> bill -> follow up)                       |
|                               |                                             |
|                               v                                             |
|   +---------------------------------------------------------------+        |
|   |                    UNIFIED DATA LAYER (PostgreSQL/Prisma)      |        |
|   |  +------------------+  +------------------+  +---------------+ |        |
|   |  | Patients/Clients |  | Appointments     |  | Invoices/Rx   | |        |
|   |  +------------------+  +------------------+  +---------------+ |        |
|   +---------------------------------------------------------------+        |
|                               |                                             |
|          +--------------------+--------------------+                        |
|          |                    |                    |                        |
|          v                    v                    v                        |
|   +--------------+    +--------------+    +--------------+                  |
|   | Clinical care|    | Front office |    | Business ops |                  |
|   +--------------+    +--------------+    +--------------+                  |
|                                                                             |
+----------------------------------------------------------------------------+
```

### 4.2 Operational Modes

| Mode | Description | Active Capabilities |
|------|-------------|---------------------|
| **Normal Operations** | Standard day-to-day platform usage | All modules operational |
| **Emergency Mode** | Walk-in / urgent care surge | Patient + medical records + Rx prioritized |
| **Maintenance Mode** | Scheduled maintenance windows | Read-only access, no data modifications |
| **Degraded Mode** | Partial availability; integration outage | Core CRUD only; circuit breakers shed email/SMS/payments |
| **Disaster Recovery** | Primary database unavailable | Failover to DR replica; RPO/RTO targets apply |

---

## 5. Summary of Capabilities

### 5.1 Capability Hierarchy

```
PURPLE CROSS CAPABILITIES
|
+-- 1.0 Clinical Care Management
|   +-- 1.1 Patient Records (EHR)
|   +-- 1.2 Prescriptions
|   +-- 1.3 Laboratory & Diagnostics
|
+-- 2.0 Client & Scheduling
|   +-- 2.1 Client Management & Portal
|   +-- 2.2 Appointment Scheduling / Waitlist
|   +-- 2.3 Communications & Reminders
|
+-- 3.0 Business Operations
|   +-- 3.1 Billing, Invoices, Payment Plans
|   +-- 3.2 Inventory & Purchasing
|   +-- 3.3 Staff & Equipment
|
+-- 4.0 Platform Services
    +-- 4.1 Analytics & Reporting
    +-- 4.2 Documents & Templates
    +-- 4.3 Observability, Resilience, Security
```

### 5.2 Capability Summary Matrix

| Capability ID | Capability Name | Sub-Capabilities | Modules | Status | Priority |
|---------------|-----------------|------------------|---------|--------|----------|
| CAP-1.0 | Clinical Care Management | 3 | Patients, Medical Records, Prescriptions, Lab | Backend real (~85%) | P0 |
| CAP-2.0 | Client & Scheduling | 3 | Clients, Appointments, Waitlist, Communications, Portal | Backend real; FE in progress | P0 |
| CAP-3.0 | Business Operations | 3 | Invoices, Estimates, Inventory, Purchase Orders, Staff, Equipment | Backend real | P1 |
| CAP-4.0 | Platform Services | 3 | Analytics, Documents, Templates, Observability | Mixed | P1 |
| **TOTAL** | **4 Major Domains** | **12** | **15+** | | |

### 5.3 Key Performance Targets

| Metric | Target | Measurement Method | Compliance Reference |
|--------|--------|-------------------|---------------------|
| **Concurrent Users** | 500+ per practice tenant | Active sessions | Scalability requirement |
| **API Response Time (p95)** | < 300 ms | `/metrics` histograms | Performance requirement |
| **System Uptime** | 99.9% | Uptime monitoring on `/health` | Availability requirement |
| **Data Encryption Coverage** | 100% (transit now; at-rest target) | Security audit | Compliance requirement |

---

## 6. Findings, Conclusions, and Recommendations

### 6.1 Key Findings

#### 6.1.1 Architecture Strengths

| Finding ID | Finding | Impact |
|------------|---------|--------|
| F-001 | Consistent layered backend (route → controller → service → Prisma) across all modules | Predictable, low-friction extension |
| F-002 | Production-grade cross-cutting middleware (correlation IDs, sanitization, rate limiting, circuit breakers, structured logging) | Strong observability and resilience baseline |
| F-003 | Strict TypeScript with zero-`any` policy and centralized constants | High type safety, low drift |

#### 6.1.2 Architecture Risks

| Finding ID | Finding | Risk Level | Mitigation |
|------------|---------|------------|------------|
| R-001 | **Authentication/authorization not yet wired** | HIGH | Prioritize AuthN/Z + RBAC + tenancy (Phase 3); document as PLANNED throughout |
| R-002 | Many frontend pages are still placeholders | MEDIUM | Convert to real CRUD against `/api/v1` (in progress) |
| R-003 | Tests historically used fully-mocked DBs | MEDIUM | Migrate to real-DB integration tests |

### 6.2 Conclusions

1. **Architecture Viability**: The single Express + React + PostgreSQL stack is
   coherent and viable; the layered pattern scales across 15+ modules.
2. **Competitive Differentiation**: Enterprise resilience/observability built in
   from the start differentiates from typical PIMS offerings.
3. **Compliance Readiness**: Transit encryption and sanitization are in place;
   authn/authz, audit, and at-rest encryption are the gating items.
4. **Scalability**: Stateless API + PostgreSQL + Redis supports horizontal scale.

### 6.3 Recommendations

| Rec ID | Recommendation | Priority | Timeline | Owner |
|--------|----------------|----------|----------|-------|
| REC-001 | Wire JWT auth + RBAC + tenant isolation across all routes | P0 | 2026 Q1–Q2 | Security Architect |
| REC-002 | Replace placeholder frontend pages with real CRUD | P1 | 2026 Q1–Q3 | Solutions Architect |
| REC-003 | Add audit logging + at-rest encryption for PHI/PII | P1 | 2026 Q2 | Security Architect |

---

## 7. Relationships to Other Architectures

### 7.1 Parent Architectures

| Architecture | Relationship | Description |
|--------------|--------------|-------------|
| Purple Cross Business/Operating Model | Parent | Practice operating model the platform supports |

### 7.2 Peer Architectures

| Architecture | Relationship | Interface |
|--------------|--------------|-----------|
| Payment Provider platform | Peer/Integration | REST charge/refund APIs |
| SendGrid / Twilio | Peer/Integration | REST messaging APIs |

### 7.3 Child Architectures

| Architecture | Description |
|--------------|-------------|
| Module-level service designs | Per-module route/controller/service/Prisma detail (see SV/SvcV) |

---

## 8. Architecture Constraints and Assumptions

### 8.1 Constraints

| Constraint ID | Constraint | Rationale |
|---------------|------------|-----------|
| CON-001 | Single production stack: Express backend + Vite/React frontend + PostgreSQL | One source of truth; NestJS/Next.js forks removed |
| CON-002 | Strict TypeScript, zero `any`, ESLint-enforced | Maintain 100% type-safety standard |
| CON-003 | All hardcoded values centralized in constants modules | Avoid drift; single change point |

### 8.2 Assumptions

| Assumption ID | Assumption | Risk if Invalid |
|---------------|------------|-----------------|
| ASM-001 | PostgreSQL is the sole system of record | Re-architecture of data layer |
| ASM-002 | Auth/tenancy will be delivered before production launch | Data exposure across tenants |
| ASM-003 | External providers (SendGrid/Twilio/payments) remain available | Degraded comms/billing; mitigated by circuit breakers |

---

## 9. Approval and Authorization

### 9.1 Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Architect | | | |
| Solutions Architect | | | |
| Security Architect | | | |
| Product Owner | | | |
| Program Manager | | | |

---

## Appendix A: Reference Documents

| Document ID | Document Title | Version | Location |
|-------------|----------------|---------|----------|
| REF-001 | System Architecture | — | `../docs/ARCHITECTURE.md` |
| REF-002 | Production Gap Analysis | — | `../docs/PRODUCTION_GAP_ANALYSIS.md` |
| REF-003 | Data Flow Architecture | — | `../docs/DATA_FLOW_ARCHITECTURE.md` |
| REF-004 | Prisma Schema | — | `../backend/prisma/schema.prisma` |

---

## Appendix B: Acronyms

| Acronym | Definition |
|---------|------------|
| PIMS | Practice Information Management System |
| EHR | Electronic Health Record |
| RBAC | Role-Based Access Control |
| PHI/PII | Protected Health / Personally Identifiable Information |
| RPO/RTO | Recovery Point / Time Objective |
| ORM | Object-Relational Mapping (Prisma) |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
