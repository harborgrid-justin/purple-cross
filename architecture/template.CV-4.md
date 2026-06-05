# CV-4: Capability Dependencies

## DoDAF 2.02 Capability Viewpoint

**Document ID:** PCVPM-CV-4-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

CV-4 describes the **dependency relationships among capabilities** (from CV-2):
which capabilities require other capabilities (or external systems) to function.
It surfaces the single most important architectural fact for production
readiness: **every operational capability depends on the Security capability
(CAP-4.3 auth/RBAC/tenancy), which is PLANNED** — making it the critical gating
dependency for the whole platform.

> ⚠️ **Honesty note.** The security dependency below is currently *unsatisfied*:
> `auth.ts` is wired to zero routes, RBAC is unenforced, and queries are not
> tenant-scoped. Until CAP-4.3 (Security) is delivered (PI-3), no dependent
> capability is production-safe regardless of its own completeness.

---

## 2. Dependency Graph

```
                         CAP-4.3 SECURITY (auth/RBAC/tenancy/audit)
                              [PLANNED — CRITICAL GATE]
                                        |
            +---------------+-----------+-----------+---------------+
            | (all capabilities depend on Security for prod use)    |
            v               v           v           v               v
   +-----------------+ +-----------+ +-----------+ +-----------+ +-----------+
   | CAP-1.0 Clinical| | CAP-2.0   | | CAP-3.0   | | CAP-4.1   | | CAP-4.2   |
   | Care            | | Client &  | | Business  | | Analytics | | Documents |
   |                 | | Scheduling| | Operations| |           | |           |
   +--------+--------+ +-----+-----+ +-----+-----+ +-----+-----+ +-----------+
            |                |             |             |
            |  +-------------+             |             |
            v  v                           |             |
     CAP-2.2 Appointments                  |             |
            ^                              |             |
            |                              |             |
   CAP-1.1 Patient Records  ----+          |             |
   CAP-2.1 Client Mgmt -------+ |          |             |
                              v v          |             |
                       CAP-3.1 Billing <---+ (needs Patient+Client+Appt)
                              |
                              v
                     (payments aspirational - no Stripe SDK)

   EXTERNAL DEPENDENCIES:
   CAP-2.3 Communications --> SendGrid (email), Twilio (SMS)
   CAP-1.3 Laboratory     --> ExternalLabIntegration
   CAP-4.1/4.2/CAP-2.3    --> BullMQ/Redis (async jobs)
   ALL                    --> CAP-4.1 observability (health/metrics/logging)
```

---

## 3. Capability Dependency Matrix

Rows **depend on** columns. **X** = hard dependency · **(x)** = soft/optional ·
**G** = gating (must exist before production).

| Depends ↓ \ On → | 1.1 | 2.1 | 2.2 | 1.3 | 3.1 | 2.3 | 4.1 | 4.3-Sec |
|------------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-------:|
| CAP-1.1 Patient Records | — | (x) | | | | | (x) | G |
| CAP-1.2 Prescriptions | X | | | | | | | G |
| CAP-1.3 Laboratory | X | | | — | | | | G |
| CAP-2.1 Client Mgmt | | — | | | | | | G |
| CAP-2.2 Appointments | X | X | — | | | | | G |
| CAP-2.3 Communications | (x) | X | X | | | — | | G |
| CAP-3.1 Billing & Revenue | X | X | X | (x) | — | | (x) | G |
| CAP-3.2 Inventory | | | | | (x) | | | G |
| CAP-3.3 Workforce | | | | | | | | G |
| CAP-4.1 Analytics | X | X | X | X | X | X | — | G |
| CAP-4.2 Documents | (x) | (x) | | | (x) | | | G |
| CAP-4.3 Security | | | | | | | | — |

> The entire **4.3-Sec** column is **G** for every row: the gating dependency.

---

## 4. Key Dependency Narratives

| Dependency | Type | Description |
|------------|------|-------------|
| Billing → Patient + Client + Appointment | Hard | An invoice/estimate references a patient, an owning client, and (usually) a visit/appointment |
| Appointments → Patient + Client | Hard | A booking is for a patient owned by a client |
| Prescriptions / Lab → Patient | Hard | Rx and lab orders attach to a patient record |
| Communications → Client + Appointment | Hard | Reminders target a client about an appointment |
| Communications → SendGrid / Twilio | External | Email/SMS delivery requires external providers |
| Laboratory → ExternalLabIntegration | External | Results flow from an external lab interface |
| Analytics → (all clinical/ops capabilities) | Hard | Reporting reads across every transactional capability |
| **ALL → CAP-4.3 Security** | **Gating** | **Production use requires auth, RBAC, tenant scoping — PLANNED** |
| Async features → BullMQ/Redis | External | Reminders, exports, webhooks run via the job queue |

---

## 5. External Dependency Register

| External Dependency | Used By | Status | Failure Mode / Mitigation |
|---------------------|---------|--------|---------------------------|
| SendGrid (email) | CAP-2.3 | Integrated | Degrade comms; circuit breaker (currently unused) |
| Twilio (SMS) | CAP-2.3 | Integrated | Degrade comms; circuit breaker (currently unused) |
| ExternalLabIntegration | CAP-1.3 | Integrated | Manual result entry fallback |
| Sentry (errors) | CAP-4.1/4.3 | Integrated | Local logging continues |
| BullMQ / Redis | CAP-2.3, 4.1, 4.3 | Integrated | Synchronous fallback degraded |
| Payment provider | CAP-3.1 | **Absent (aspirational)** | Billing stays internal; no charge/refund automation |

---

## 6. Gating Dependency Callout

```
+--------------------------------------------------------------------------+
|  CRITICAL GATING DEPENDENCY                                              |
|                                                                          |
|  No capability may go to PRODUCTION until CAP-4.3 Security is delivered. |
|                                                                          |
|  State today (2026-06):                                                  |
|    - auth.ts ............ wired to 0 routes                              |
|    - authorize() (RBAC) . defined, unenforced                           |
|    - tenantId scoping ... columns exist, queries NOT scoped             |
|    - AuditLog .......... ~7 of 34 services write                        |
|    - field-crypto ...... applied to 0 fields (PHI/PII plaintext)        |
|                                                                          |
|  => Treat CAP-4.3 Security as P0 and the top of the PI-3 critical path. |
+--------------------------------------------------------------------------+
```

---

## 7. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **CV-2 Taxonomy** | Source of the CAP IDs whose dependencies are mapped here |
| **CV-3 Phasing** | Shows the gating dependency lands in PI-3 |
| **CV-7 Services Mapping** | The services that realize these dependencies |
| **OV-2 / SV-2** | Resource flows that implement the data dependencies |
| **SvcV-3b** | Service-to-service dependencies underneath these capabilities |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
