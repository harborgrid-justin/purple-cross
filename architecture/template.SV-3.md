# SV-3: Systems-Systems Matrix

## DoDAF 2.02 Systems Viewpoint

**Document ID:** PCVPM-SV-3-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose

SV-3 presents the **Systems-Systems Matrix**: an N×N cross-tabulation of which
systems interface with which, and the **type of interface** in each populated
cell. It summarizes, in matrix form, the interfaces from [SV-1](template.SV-1.md)
and the resource flows from [SV-2](template.SV-2.md), making system coupling and
integration points visible at a glance. Systems retain their SV-1 IDs (S1–S5
internal; X1–X5 external).

> ⚠️ **Honesty note.** Cells marked **PLANNED** (Payment Provider, External Lab)
> have no working integration today; **PARTIAL** cells (SendGrid/Twilio sends,
> webhook delivery, `/metrics` + `/admin/queues` access) are implemented but
> incompletely hardened. Internal data-tier links (S2/S5 ⇄ S3/S4) are LIVE.
> See `../docs/PRODUCTION_GAP_ANALYSIS.md`.

---

## 2. Legend

| Code | Meaning |
|------|---------|
| `REST/TLS` | HTTPS REST over TLS (JSON) |
| `Prisma/5432` | TCP PostgreSQL wire protocol via Prisma (SQL) |
| `RESP/6379` | TCP Redis RESP (cache + BullMQ jobs) |
| `BullMQ` | Asynchronous job produce/consume over Redis |
| `Webhook` | Outbound HMAC-signed HTTPS callback |
| `Telemetry` | One-way HTTPS error/metrics export |
| `—` | No direct interface |
| **(P)** | PLANNED — not yet integrated |
| **(◐)** | PARTIAL — implemented, not fully hardened |
| **(L)** | LIVE |

Row = **source / initiator**; Column = **destination / provider**.

---

## 3. Systems-Systems Matrix (Internal Systems)

| ↓ Source \ Dest → | **S1** SPA | **S2** API | **S3** PG | **S4** Redis | **S5** Worker |
|-------------------|-----------|-----------|-----------|--------------|---------------|
| **S1** React/Vite SPA | — | `REST/TLS` (L) | — | — | — |
| **S2** Express API | `REST/TLS` (resp) (L) | — | `Prisma/5432` (L) | `RESP/6379` + `BullMQ` (L) | `BullMQ` (enqueue) (L) |
| **S3** PostgreSQL 15 | — | row sets (L) | — | — | — |
| **S4** Redis 7 | — | cache hits (L) | — | — | `BullMQ` (deliver) (L) |
| **S5** Worker/Job Proc | — | — | `Prisma/5432` (L) | `RESP/6379` (consume) (L) | — |

> S2 ⇄ S3 and S2/S5 ⇄ S4 are the load-bearing internal couplings. S1 talks **only**
> to S2 (no direct DB/Redis access). S5 shares the S2 image but is a separate
> process that consumes jobs from S4 and writes side-effects to S3.

---

## 4. Systems-Systems Matrix (Internal → External)

| ↓ Source \ Dest → | **X1** SendGrid | **X2** Twilio | **X3** Payment | **X4** Ext Lab | **X5** Sentry |
|-------------------|-----------------|---------------|----------------|----------------|---------------|
| **S2** Express API | `REST/TLS` (◐) | `REST/TLS` (◐) | `REST/TLS` **(P)** | `REST/TLS` **(P)** | `Telemetry` (◐ optional) |
| **S5** Worker/Job Proc | `REST/TLS` (◐) | `REST/TLS` (◐) | — | — | `Telemetry` (◐ optional) |
| **S1** SPA | — | — | — | — | `Telemetry` **(P)** (FE Sentry not wired) |
| **S5** → tenant URLs | `Webhook` (◐) — outbound to client-registered endpoints | | | | |

> External systems are providers only; they do not initiate inbound calls into S2
> except as **provider callbacks/webhooks** (e.g., Payment status, Twilio status),
> which are **PLANNED** — no inbound webhook receiver routes are wired today.

---

## 5. Interface-Type Summary

| System Pair | Interface (SV-1) | Flow (SV-2) | Type | Status |
|-------------|------------------|-------------|------|--------|
| S1 ⇄ S2 | I1 | RF-01/02 | REST/TLS JSON `/api/v1` | LIVE |
| S2 ⇄ S3 | I2 | RF-03/04 | Prisma SQL :5432 | LIVE |
| S2 ⇄ S4 | I3 | RF-05 | RESP cache + BullMQ enqueue :6379 | LIVE |
| S5 ⇄ S3 | I4 | RF-06 | Prisma SQL :5432 | LIVE |
| S5 ⇄ S4 | I5 | RF-08 | RESP BullMQ consume :6379 | LIVE |
| S2 → X1/X2 | I6/I7 | RF-07 | REST email/SMS | PARTIAL |
| S5 → tenant URLs | I11 | RF-09 | Signed webhook | PARTIAL |
| S2/S5 → X5 | I10 | RF-10 | Telemetry | OPTIONAL |
| S2 ⇄ X3 | I8 | RF-11 | REST charge/refund | PLANNED |
| S2 ⇄ X4 | I9 | RF-12 | REST lab order/result | PLANNED |

---

## 6. Coupling Observations

| Observation | Implication |
|-------------|-------------|
| S1 is fully decoupled from data tier (only I1 to S2) | Clean trust boundary; all access mediated by API |
| S2 is the integration hub (touches S3, S4, all externals) | Single point of concentration; resilience matters but circuit breakers are **unused (dead code)** |
| S5 shares the S2 codebase/image | Consistent models; deploy them together |
| All external couplings are PARTIAL/PLANNED | Limited blast radius today; hardening required before launch |
| No inbound external→S2 webhook receivers wired | Payment/lab status callbacks are PLANNED |

---

## 7. Cross-References

| Related View | Relationship |
|--------------|--------------|
| SV-1 | Source of system IDs and interfaces summarized here |
| SV-2 | Resource flows underlying each matrix cell |
| SV-4 | Functions hosted on S2 that drive these couplings |
| SV-6 | Endpoint-level detail of the S1⇄S2 cell |
| SvcV-3a | Systems-Services matrix (complementary view) |
| DIV-3 | Physical model behind the S2⇄S3 cell |

---

**Document Classification:** INTERNAL
**Document Owner:** Purple Cross Architecture Team
**Last Review:** 2026-06-05
**Next Review:** 2026-09-05
