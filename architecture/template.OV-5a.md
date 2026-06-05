# OV-5a: Operational Activity Decomposition Tree

## DoDAF 2.02 Operational Viewpoint

**Document ID:** PCVPM-OV-5a-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

OV-5a presents the **hierarchical decomposition** of the operational activities
performed by a Purple Cross veterinary practice. Starting from the top-level
activity **A0 Operate Veterinary Practice**, it decomposes into nine first-level
activities (A1–A9) and their sub-activities, each mapped to the real platform
modules that support them. This tree is the activity backbone consumed by the
IDEF0 model in **OV-5b**, the capability mapping in **CV-6**, and the
function/system traceability in **SV-5a/5b**.

> ⚠️ **Honesty note.** Activities reflect operational *intent* grounded in the
> codebase. Many activities are backed by ~85%-real Prisma services, but
> supporting frontend pages are often **placeholders**, **authentication/RBAC are
> not enforced** on any activity, **tenant scoping is absent**, and the Payment
> Provider settlement step (A5.3) is **PLANNED**. See
> `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Activity Decomposition Tree

```
A0  OPERATE VETERINARY PRACTICE
│
├── A1  Manage Clients & Patients
│     ├── A1.1  Register / maintain client records           [clients]
│     ├── A1.2  Register / maintain patient records          [patients]
│     ├── A1.3  Manage patient relationships & breed info     [patient-relationships, breed-info]
│     └── A1.4  Manage client portal & loyalty                [client-portal, loyalty-programs]
│
├── A2  Schedule & Intake
│     ├── A2.1  Book appointments                             [appointments]
│     ├── A2.2  Manage waitlist & triage                      [waitlist]
│     ├── A2.3  Apply time blocks / availability              [time-blocks]
│     └── A2.4  Check-in / intake patient                     [appointments, patients]
│
├── A3  Deliver Clinical Care
│     ├── A3.1  Record vitals & observations                  [medical-records]
│     ├── A3.2  Document diagnosis & treatment plan           [medical-records]
│     └── A3.3  Author / amend medical record                 [medical-records, documents]
│
├── A4  Diagnostics & Pharmacy
│     ├── A4.1  Order & process lab tests                     [lab-tests]
│     ├── A4.2  Prescribe medication                          [prescriptions]
│     ├── A4.3  Check drug interactions                       [drug-interaction]
│     └── A4.4  Log controlled substances                     [controlled-substance-log]
│
├── A5  Billing & Revenue
│     ├── A5.1  Produce estimate                              [estimates]
│     ├── A5.2  Issue invoice                                 [invoices]
│     ├── A5.3  Collect payment / settle  (PLANNED settle)    [invoices, payment-plans]
│     ├── A5.4  Manage payment plans                          [payment-plans]
│     ├── A5.5  Process refunds                               [refunds]
│     └── A5.6  Submit & track insurance claims               [insurance-claims]
│
├── A6  Inventory & Supply
│     ├── A6.1  Track stock levels                            [inventory]
│     ├── A6.2  Manage purchase orders                        [purchase-orders]
│     └── A6.3  Manage equipment                              [equipment]
│
├── A7  Communications & Engagement
│     ├── A7.1  Send reminders & notifications                [communications, patient-reminders]
│     ├── A7.2  Run marketing campaigns                       [marketing-campaigns]
│     └── A7.3  Capture client feedback                       [feedback]
│
├── A8  Compliance & Records
│     ├── A8.1  Manage documents & templates                  [documents, document-templates, report-templates]
│     ├── A8.2  Enforce policies                              [policies]
│     └── A8.3  Maintain audit trail  (PARTIAL)               [audit-log]
│
└── A9  Platform Operations
      ├── A9.1  Authenticate & authorize  (PLANNED)           [auth]
      ├── A9.2  Observe health & metrics                      [health, metrics]
      ├── A9.3  Run analytics & reporting                     [analytics, report-templates]
      └── A9.4  Orchestrate workflows & webhooks              [workflows, webhooks]
```

---

## 3. Activity Catalog (Level 1)

| Activity | Name | Purpose | OV-1 Thread Step | Primary Modules |
|----------|------|---------|------------------|-----------------|
| A1 | Manage Clients & Patients | Maintain the people/animals the practice serves | (pre-thread) | clients, patients, breed-info |
| A2 | Schedule & Intake | Get the right patient into the right slot | Book → Check-in | appointments, waitlist, time-blocks |
| A3 | Deliver Clinical Care | Examine, diagnose, document | Treat | medical-records |
| A4 | Diagnostics & Pharmacy | Order tests, prescribe safely | Prescribe → Order Lab | lab-tests, prescriptions |
| A5 | Billing & Revenue | Turn care into collected revenue | Invoice → Collect | invoices, estimates, payment-plans, refunds, insurance-claims |
| A6 | Inventory & Supply | Keep clinical supplies available | (supports A3/A4) | inventory, purchase-orders, equipment |
| A7 | Communications & Engagement | Reach and retain clients | Follow-up | communications, patient-reminders, marketing-campaigns, feedback |
| A8 | Compliance & Records | Govern documents, policy, audit | (cross-cutting) | documents, policies, audit-log |
| A9 | Platform Operations | Operate the platform itself | (cross-cutting) | auth, health, metrics, analytics, workflows, webhooks |

---

## 4. Module-to-Activity Coverage

| Module Group | Activities Supported | Coverage State |
|--------------|----------------------|----------------|
| Core clinical (patients, medical-records, prescriptions, lab-tests) | A1, A3, A4 | Backend real (~85%) |
| Scheduling (appointments, waitlist, time-blocks) | A2 | Backend real; FE partial |
| Billing (invoices, estimates, payment-plans, refunds, insurance-claims) | A5 | Backend real; settle PLANNED |
| Supply (inventory, purchase-orders, equipment) | A6 | Backend real |
| Engagement (communications, reminders, loyalty, feedback, marketing) | A1.4, A7 | Mixed; provider-dependent |
| Governance (documents, policies, audit-log, templates) | A8 | Partial (audit limited) |
| Platform (auth, health, metrics, analytics, workflows, webhooks) | A9 | Mixed; auth PLANNED |

---

## 5. Honesty & Gap Notes

| Activity | Reality | Status |
|----------|---------|--------|
| A9.1 Authenticate & authorize | Middleware exists, 0 routes use it | PLANNED |
| A5.3 Collect/settle payment | Manual recording only; no Stripe SDK | PARTIAL / settle PLANNED |
| A4.3/A4.4 Interactions & CS logging | Models exist; enforcement partial | PARTIAL |
| A8.3 Maintain audit trail | `AuditLog` written by ~7/34 services | PARTIAL |
| A1.4 Client portal self-service | Backend endpoints; FE placeholder | IN PROGRESS |
| Tenant scoping across all activities | Fields exist; not enforced | PLANNED |

---

## 6. Cross-References

| Related View | Relationship |
|--------------|--------------|
| OV-1 | Activities A1–A9 summarized in the operational thread |
| OV-5b | ICOM model elaborating these activities |
| OV-2 / OV-3 | Resource flows produced/consumed by activities |
| OV-6a | Rules governing activity execution |
| CV-6 | Capability-to-operational-activity mapping |
| SV-5a / SV-5b | Activity-to-system-function/system traceability |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
