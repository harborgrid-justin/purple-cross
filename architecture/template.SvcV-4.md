# SvcV-4: Services Functionality Description

## DoDAF 2.02 Services Viewpoint

**Document ID:** PCVPM-SvcV-4-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SvcV-4 decomposes the **functionality** each Purple Cross service provides. Every
`SVC-x` (from SvcV-1) is broken into its core **operations** — standard CRUD plus
the domain-specific operations that make the service meaningful (e.g.,
appointments: book / reschedule / cancel / check-in / waitlist-promote; invoices:
create / add line item / issue / record payment / void). Operations carry function
IDs (`SFN-x.y`) and an honest real/placeholder marker.

> ⚠️ **Honesty note.** Backend service operations are **~85% real Prisma** logic.
> Cross-cutting operations are weaker: **authorize/authenticate (SVC-25) is
> unimplemented at the route layer**, **record-payment / settle-refund do not
> contact a gateway** (Payment Provider aspirational — stored manually),
> **audit-write fires in ~7/34 services**, and **encrypt-field is a no-op (0
> fields)**. Frontend realization of these operations is **~15–20%** (rest
> placeholder). Operations below describe the **service contract**, annotated for
> what is actually wired.

---

## 2. Functional Decomposition Tree

```
PURPLE CROSS SERVICE FUNCTIONALITY
|
+-- D1 CLINICAL
|   +-- SVC-01 Patients        : create · read · update · deactivate · search · merge · list-by-client
|   +-- SVC-02 Medical Records : create-record · append-note · attach-result · read-history · amend
|   +-- SVC-03 Prescriptions   : create · refill · check-drug-interaction · log-controlled-substance · discontinue
|   +-- SVC-04 Lab Tests       : order · place-with-external-lab · record-result · attach-to-record · flag-abnormal
|   +-- SVC-05 Breed Info      : list · read · search (reference data)
|   +-- SVC-45 Patient Rel.    : link · unlink · list-relationships
|
+-- D2 CLIENT / SCHEDULING
|   +-- SVC-06 Clients         : create · read · update · deactivate · search · list-pets
|   +-- SVC-07 Appointments    : book · reschedule · cancel · check-in · check-out · no-show · waitlist-promote
|   +-- SVC-08 Waitlist        : add · prioritize · promote-to-slot · remove
|   +-- SVC-09 Time Blocks     : create · update · delete · list (availability)
|   +-- SVC-10 Client Portal   : portal-login[IP] · view-pet · request-appt · view-invoice · pay[ASP]
|   +-- SVC-11 Communications  : send-email · send-sms · queue-notification · log-delivery · template-render
|   +-- SVC-12 Reminders       : schedule · enqueue · dispatch · cancel · mark-sent
|
+-- D3 BILLING / FINANCE
|   +-- SVC-13 Invoices        : create · add-line-item · issue · record-payment[manual] · void · list-by-client
|   +-- SVC-14 Estimates       : create · revise · approve · convert-to-invoice
|   +-- SVC-15 Payment Plans   : create · schedule-installments · record-installment · close
|   +-- SVC-16 Refunds         : create · approve · settle[ASP] · void
|   +-- SVC-17 Insurance Claims: create · submit · track-status · reconcile
|   +-- SVC-18 Loyalty         : enroll · accrue-points · redeem · read-balance
|
+-- D4 INVENTORY / OPERATIONS
|   +-- SVC-19 Inventory       : create-item · adjust-stock · decrement-on-dispense · low-stock-alert · count
|   +-- SVC-20 Purchase Orders : create · approve · receive · close · reorder-suggest
|   +-- SVC-21 Equipment       : register · schedule-maintenance · log-service · retire
|   +-- SVC-22 Staff           : create · update · assign-role[no-enforce] · schedule · deactivate
|
+-- D5 PLATFORM / SHARED
    +-- SVC-23 Documents       : upload · read · generate-from-template · archive
    +-- SVC-24 Analytics       : aggregate · report · trend · export
    +-- SVC-25 Auth            : register · login · issue-jwt · verify · refresh   [PLANNED — unwired]
    +-- SVC-26 Webhooks        : subscribe · sign-payload · deliver · retry · list-deliveries
    +-- SVC-27 Workflows       : define · trigger · execute-step · branch · complete
    +-- SVC-28 Wf Templates    : create · version · publish
    +-- SVC-29 Wf Executions   : start · advance · suspend · resume · audit-trace
    +-- SVC-30 Cache           : get · set · invalidate · ttl-expire
    +-- SVC-36 Health          : liveness · readiness · detailed-deps
    +-- SVC-37 Metrics         : collect · expose[in-memory JSON]
    +-- SVC-38 Domain Events   : publish · subscribe · fan-out
    +-- SVC-39 Job Queue       : enqueue · dispatch · retry · dead-letter
    +-- SVC-40 Doc Templates   : create · render · version
    +-- SVC-41 Report Templates: create · render · schedule
    +-- SVC-42 Policies        : create · publish · acknowledge
    +-- SVC-43 Feedback        : submit · list · respond
    +-- SVC-44 Marketing       : create-campaign · segment · send · track
```
> `[IP]` = IN PROGRESS · `[ASP]` = aspirational · `[PLANNED]` = unwired ·
> `[manual]` = no external gateway · `[no-enforce]` = stored but not enforced.

---

## 3. Service Functionality Catalog

| Fn ID | Service | Core Operations | CRUD? | Key Domain Ops | Reality |
|-------|---------|-----------------|:-----:|----------------|---------|
| SFN-1 | SVC-01 Patients | C/R/U/deactivate/search | ✔ | merge, list-by-client | Real |
| SFN-2 | SVC-02 Medical Records | create/read/amend | ✔ | append-note, attach-result | Real (PHI plaintext) |
| SFN-3 | SVC-03 Prescriptions | C/R/U/discontinue | ✔ | refill, drug-interaction, controlled-substance log | Real |
| SFN-4 | SVC-04 Lab Tests | C/R/U | ✔ | order, place-external, record-result, flag-abnormal | Real (callback PLANNED) |
| SFN-5 | SVC-05 Breed Info | R/search | (read) | reference lookup | Real |
| SFN-6 | SVC-06 Clients | C/R/U/deactivate/search | ✔ | list-pets | Real (PII plaintext) |
| SFN-7 | SVC-07 Appointments | C/R/U/cancel | ✔ | book, reschedule, check-in/out, no-show, waitlist-promote | Real |
| SFN-8 | SVC-08 Waitlist | C/R/U/remove | ✔ | prioritize, promote-to-slot | Real |
| SFN-9 | SVC-09 Time Blocks | C/R/U/D | ✔ | availability windows | Real |
| SFN-10 | SVC-10 Client Portal | read-mostly | partial | request-appt, view-invoice, pay | IN PROGRESS / pay ASP |
| SFN-11 | SVC-11 Communications | send/queue/log | (action) | send-email, send-sms, template-render | Real (providers external) |
| SFN-12 | SVC-12 Reminders | C/R/U/cancel | ✔ | schedule, enqueue, dispatch, mark-sent | Real |
| SFN-13 | SVC-13 Invoices | C/R/U/void | ✔ | add-line-item, issue, record-payment | Real (payment manual) |
| SFN-14 | SVC-14 Estimates | C/R/U | ✔ | revise, approve, convert-to-invoice | Real |
| SFN-15 | SVC-15 Payment Plans | C/R/U/close | ✔ | schedule-installments, record-installment | Real |
| SFN-16 | SVC-16 Refunds | C/R/U/void | ✔ | approve, settle | Real (settle ASP) |
| SFN-17 | SVC-17 Insurance Claims | C/R/U | ✔ | submit, track-status, reconcile | Real |
| SFN-18 | SVC-18 Loyalty | C/R/U | ✔ | accrue-points, redeem, read-balance | Real |
| SFN-19 | SVC-19 Inventory | C/R/U | ✔ | adjust-stock, decrement-on-dispense, low-stock-alert | Real |
| SFN-20 | SVC-20 Purchase Orders | C/R/U/close | ✔ | approve, receive, reorder-suggest | Real |
| SFN-21 | SVC-21 Equipment | C/R/U/retire | ✔ | schedule-maintenance, log-service | Real |
| SFN-22 | SVC-22 Staff | C/R/U/deactivate | ✔ | assign-role, schedule | Real (role not enforced) |
| SFN-23 | SVC-23 Documents | C/R/archive | ✔ | upload, generate-from-template | Real |
| SFN-24 | SVC-24 Analytics | read/aggregate | (read) | report, trend, export | Real (read aggregates) |
| SFN-25 | SVC-25 Auth | register/login/verify | n/a | issue-jwt, refresh | **PLANNED (unwired)** |
| SFN-26 | SVC-26 Webhooks | C/R/U | ✔ | subscribe, sign, deliver, retry | Real |
| SFN-27 | SVC-27 Workflows | C/R/U | ✔ | define, trigger, execute-step, branch | Real |
| SFN-28 | SVC-28 Wf Templates | C/R/U | ✔ | version, publish | Real |
| SFN-29 | SVC-29 Wf Executions | start/advance | (action) | suspend, resume, audit-trace | Real |
| SFN-30 | SVC-30 Cache | get/set/invalidate | n/a | ttl-expire | Real |
| SFN-31 | SVC-36 Health | probe | n/a | liveness, readiness, detailed | Real |
| SFN-32 | SVC-37 Metrics | collect/expose | n/a | in-memory JSON | PARTIAL |
| SFN-33 | SVC-38 Domain Events | publish/subscribe | n/a | fan-out | Real (partial emitters) |
| SFN-34 | SVC-39 Job Queue | enqueue/dispatch | n/a | retry, dead-letter | Real (UI unauth) |
| SFN-35 | SVC-40/41 Templates | C/R/U | ✔ | render, version, schedule | Real |
| SFN-36 | SVC-42 Policies | C/R/U | ✔ | publish, acknowledge | Real |
| SFN-37 | SVC-43 Feedback | C/R/U | ✔ | submit, respond | Real |
| SFN-38 | SVC-44 Marketing | C/R/U | ✔ | segment, send, track | Real |
| SFN-39 | SVC-45 Patient Rel. | C/R/D | ✔ | link, unlink | Real |

---

## 4. Cross-Cutting Functional Concerns

| Concern | Provided By | Applied To | Reality |
|---------|-------------|------------|---------|
| Validation | Joi schemas (validate/validateQuery/validateParams) | All service operations | Real |
| API documentation | OpenAPI 3.0.3 via `swagger-jsdoc` at `/api-docs` | All HTTP operations | Real |
| Authentication/authorization | SVC-25 Auth + RBAC | **0 operations enforce** | **PLANNED** |
| Audit logging | AuditLog write | ~7/34 services' write ops | PARTIAL |
| Field encryption | `field-crypto` | **0 fields** | PLANNED |
| Caching | SVC-30 Cache | Read-heavy operations | Real |
| Resilience | Circuit breakers + retry | External-calling operations | Real |
| Async execution | SVC-39 Job Queue | Reminders, workflow steps, campaigns | Real |

---

## 5. Honesty & Gap Notes

| Functionality | Reality | Status |
|---------------|---------|--------|
| Auth operations (SFN-25) | Implemented but enforce 0 routes | PLANNED |
| record-payment / settle-refund | No gateway call; stored in DB | Aspirational |
| assign-role (SFN-22) | Persisted but not enforced anywhere | PLANNED |
| encrypt-field | No-op (0 fields) | PLANNED |
| audit-write | Fires in ~7/34 services | PARTIAL |
| Lab result intake (SFN-4) | Inbound callback not authenticated | PLANNED |
| Portal operations (SFN-10) | Read-mostly; FE placeholder; pay aspirational | IN PROGRESS |
| Frontend realization | ~15–20% of operations wired in UI | IN PROGRESS |

---

## 6. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SvcV-1 | Service catalog (`SVC-x`) decomposed here into operations |
| SvcV-2 | Flows triggered by these operations (`SF-x`) |
| SvcV-3b | Dependencies originated by these operations |
| SvcV-5 | Operational activities traced to these functions |
| SV-4 | System functions realizing service functionality |
| OV-5a | Operational activities decomposed into tasks |
| CV-7 | Capabilities realized by these functions |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
