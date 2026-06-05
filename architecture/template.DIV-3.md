# DIV-3: Physical Data Model

## DoDAF 2.02 Data and Information Viewpoint

**Document ID:** PCVPM-DIV-3-2026
**Version:** 1.0.0
**Date:** 2026-06-05
**Classification:** INTERNAL
**Status:** DRAFT
**Prepared By:** Purple Cross Architecture Team

---

## 1. Purpose and Scope

DIV-3 describes the **physical realization** of the Purple Cross logical data
model (**DIV-2**) in **PostgreSQL 15-alpine**, managed through **Prisma ORM
6.18** with `backend/prisma/schema.prisma` as the single source of truth. It
covers: table mapping, PostgreSQL data types, indexes (~**134** declared),
constraints (PK/FK/unique/enum), the cross-cutting Prisma **extensions**
(field-crypto, tenant, soft-delete, audit), migrations, connection pooling, and
the role of **Redis 7** as a cache (not a system of record).

**Database topology (from `docker-compose.yml` / config):**

| Component | Technology | Role |
|-----------|-----------|------|
| Relational store | PostgreSQL 15-alpine, port 5432 | **System of record** |
| ORM / migrations | Prisma 6.18 (`prisma-client-js`) | Schema, client, migrations |
| Cache / ephemeral | Redis 7, port 6379 | Cache, rate-limit/session backing — **not** source of record |
| Client extensions | `backend/src/config/prisma-extensions/` | field-crypto, tenant, soft-delete, audit |

> **Honesty note (critical).** Field-level at-rest encryption **exists** as a
> Prisma extension and is **wired into the client**, but it is configured for
> **only four `MedicalRecord` columns** (`chiefComplaint`, `diagnosis`,
> `treatment`, `notes`). **Every other PHI/PII column** — client names/emails/
> phones/addresses, patient identifiers, lab results, prescription detail,
> integration API secrets — is stored **PLAINTEXT**. Tenant/audit/soft-delete
> extensions are likewise wired but **gated on a request context that auth does
> not yet populate**, so they degrade to no-ops for unauthenticated/system calls.

---

## 2. Physical Table Mapping

Prisma model names (PascalCase) map to snake_case PostgreSQL tables via `@@map`.
All ~69 models become tables; PKs are `id UUID` (Prisma `@default(uuid())`).

| Logical Entity | Physical Table | Logical Entity | Physical Table |
|----------------|----------------|----------------|----------------|
| Patient | `patients` | Invoice | `invoices` |
| Client | `clients` | InvoiceLineItem | `invoice_line_items` |
| Appointment | `appointments` | Payment | `payments` |
| AppointmentReminder | `appointment_reminders` | Estimate | `estimates` |
| MedicalRecord | `medical_records` | PaymentPlan | `payment_plans` |
| Prescription | `prescriptions` | Refund | `refunds` |
| Medication | `medications` | InsuranceClaim | `insurance_claims` |
| LabTest | `lab_tests` | InventoryItem | `inventory_items` |
| Staff | `staff` | PurchaseOrder | `purchase_orders` |
| StaffSchedule | `staff_schedules` | Equipment | `equipment` |
| Communication | `communications` | WorkflowExecution | `workflow_executions` |
| Document | `documents` | WebhookDelivery | `webhook_deliveries` |
| AuditLog | `audit_logs` | User | `users` |
| ComplianceIncident | `compliance_incidents` | RefreshToken | `refresh_tokens` |
| Policy | `policies` | Tenant | `tenants` |

*(Full set of ~69 tables follows the same `@@map` convention; see
`schema.prisma`.)*

---

## 3. Data Type Mapping (Prisma → PostgreSQL)

| Prisma Type | PostgreSQL Type | Used For | Notes |
|-------------|-----------------|----------|-------|
| `String` `@id @default(uuid())` | `text` (UUID value) PK | All primary keys | UUID generated app-side by Prisma |
| `String` | `text` | Names, statuses, free-text | No length caps; `status`/`role` are free strings |
| `String?` | `text NULL` | Optional fields | |
| `String[]` | `text[]` | `tags`, `events`, `recipients`, `diagnosisCodes` | Postgres array |
| `Int` | `integer` | Counts, quantities, versions | |
| `Float` | `double precision` | Money, weights, costs | **Note:** float for currency — rounding risk |
| `Boolean` | `boolean` | Flags (`controlled`, `active`, `acceptable`) | |
| `DateTime` | `timestamp(3)` | Timestamps, dates | Millisecond precision |
| `Json` / `Json?` | `jsonb` | `vitalSigns`, `results`, `configuration`, `criteria`, workflow `actions` | Indexed via GIN only if added (none declared) |
| `enum Role` | Postgres `enum` type | `users.role` | Only enum in the schema |

---

## 4. Index Strategy

The schema declares ~**134 `@@index`** directives (plus PK and `@unique`
indexes). Indexing follows four repeated patterns across operational tables.

### 4.1 Index Patterns

| Pattern | Indexed Column(s) | Present On | Purpose |
|---------|-------------------|------------|---------|
| **Foreign-key** | `ownerId`, `patientId`, `clientId`, `veterinarianId`, `invoiceId`, `medicationId`, `staffId`, etc. | Nearly all child tables | Join/lookup performance |
| **Tenancy** | `tenantId` | Every operational table | Tenant-scoped query filtering (**PLANNED enforcement**) |
| **Soft-delete** | `deletedAt` | Every operational table | Filter out tombstoned rows |
| **Status / type** | `status`, `role`, `category`, `type`, `severity`, `tier`, `platform`, `isActive` | Status-driven tables | Worklist/filter queries |
| **Temporal** | `startTime`, `visitDate`, `orderedDate`, `sentAt`, `timestamp`, `nextRunAt`, `dueDate`, `scheduledDate` | Time-ordered tables | Calendar/range/sort queries |
| **Natural key** | `email`, `phone`, `sku`, `invoiceNumber`, `microchipId`, `ndcCode`, `serialNumber`, `claimNumber`, `poNumber`, `key` | Lookup tables | Direct retrieval / uniqueness backing |

### 4.2 Representative Index Inventory

| Table | Declared Indexes |
|-------|------------------|
| `patients` | `ownerId`, `microchipId`, `deletedAt`, `tenantId` |
| `clients` | `email`, `phone`, `deletedAt`, `tenantId` |
| `appointments` | `patientId`, `clientId`, `veterinarianId`, `startTime`, `deletedAt`, `tenantId` |
| `medical_records` | `patientId`, `veterinarianId`, `visitDate`, `deletedAt`, `tenantId` |
| `prescriptions` | `patientId`, `medicationId`, `prescribedBy`, `deletedAt`, `tenantId` |
| `invoices` | `clientId`, `invoiceNumber`, `status`, `deletedAt`, `tenantId` |
| `lab_tests` | `patientId`, `status`, `orderedDate`, `deletedAt`, `tenantId` |
| `documents` | `(relatedType, relatedId)` (composite), `category`, `deletedAt`, `tenantId` |
| `audit_logs` | `userId`, `action`, `resource`, `timestamp`, `tenantId` |
| `workflow_executions` | `templateId`, `status`, `startedAt`, `deletedAt`, `tenantId` |

> **Index gap risk:** indexes on `tenantId` exist everywhere, but because tenant
> filtering is not enforced at runtime, the planner benefit is unrealized until
> auth/tenancy ship. The `deletedAt` indexes assume the soft-delete extension
> always appends `deletedAt IS NULL` — true only under the extended client path.

---

## 5. Constraints

| Constraint Type | Realization | Examples |
|-----------------|-------------|----------|
| **Primary key** | `PRIMARY KEY (id)` on UUID | All tables |
| **Foreign key** | FK with referential action | `patients.ownerId → clients.id`; cascade FKs on owned children |
| **Unique** | `UNIQUE` index | `clients.email`, `invoices.invoiceNumber`, `patients.microchipId`, `tenants.slug`, `refresh_tokens.tokenHash`, … |
| **Composite unique** | multi-column `UNIQUE` | `patient_relationships(patientId, relatedPatientId, relationshipType)`; `drug_interactions(medication1Id, medication2Id)` |
| **Enum** | Postgres `enum` | `users.role` ∈ {ADMIN, VET, TECH, RECEPTIONIST, CLIENT_PORTAL} |
| **Not-null** | column nullability | Required business fields are `NOT NULL` |
| **Cascade delete** | `ON DELETE CASCADE` | line items, reminders, webhook deliveries, execution steps, refresh tokens |
| **Check constraints** | *none declared* | Financial/temporal invariants enforced in the service layer only (gap) |

---

## 6. Representative DDL (Generated by Prisma Migrate)

Illustrative PostgreSQL realization of the `patients` table (Prisma emits
equivalent DDL into `prisma/migrations/`):

```sql
CREATE TABLE "patients" (
  "id"                TEXT NOT NULL,            -- UUID (app-generated)
  "name"              TEXT NOT NULL,
  "species"           TEXT NOT NULL,
  "breed"             TEXT,
  "dateOfBirth"       TIMESTAMP(3) NOT NULL,
  "gender"            TEXT NOT NULL,
  "color"             TEXT,
  "weight"            DOUBLE PRECISION,
  "microchipId"       TEXT,
  "insuranceProvider" TEXT,
  "insurancePolicy"   TEXT,
  "status"            TEXT NOT NULL DEFAULT 'active',
  "ownerId"           TEXT NOT NULL,
  -- shared cross-cutting columns (see DIV-2 §5)
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL,
  "createdBy"         TEXT,
  "updatedBy"         TEXT,
  "version"           INTEGER NOT NULL DEFAULT 1,
  "deletedAt"         TIMESTAMP(3),
  "tenantId"          TEXT,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patients_microchipId_key" ON "patients"("microchipId");
CREATE INDEX "patients_ownerId_idx"   ON "patients"("ownerId");
CREATE INDEX "patients_microchipId_idx" ON "patients"("microchipId");
CREATE INDEX "patients_deletedAt_idx" ON "patients"("deletedAt");
CREATE INDEX "patients_tenantId_idx"  ON "patients"("tenantId");

ALTER TABLE "patients"
  ADD CONSTRAINT "patients_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "clients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "patients"
  ADD CONSTRAINT "patients_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
```

> Note: `name`, `microchipId`, `insurancePolicy` and other PII columns are
> **plaintext** — no field-crypto applies to `patients` (see §7).

---

## 7. Prisma Client Extensions (Physical Behaviors)

Extensions are composed in `backend/src/config/database.ts` in this order:
`fieldCrypto → tenant → softDelete → audit` (innermost first, so ciphertext is
what hits the DB and audit sees the outermost call).

| Extension | File | What It Does Physically | Enforcement Status |
|-----------|------|--------------------------|--------------------|
| **field-crypto** | `field-crypto.ts` | Encrypts/decrypts configured columns on write/read | **WIRED but minimal** — applies to **only** `MedicalRecord.{chiefComplaint, diagnosis, treatment, notes}`. **All other PHI/PII is PLAINTEXT.** |
| **tenant** | `tenant.ts` | Injects `tenantId` on writes; appends `WHERE tenantId = ?` on reads; post-filters `findUnique` | **WIRED but gated** — only acts under an authenticated request context; **no-ops (fail-open)** when context is empty/system (the usual case today, auth not wired) |
| **soft-delete** | `soft-delete.ts` | Rewrites deletes to `UPDATE … SET deletedAt = now()`; appends `deletedAt IS NULL` to reads | **WIRED** — effective on the extended client path; raw-SQL/escape paths can still hard-delete |
| **audit** | `audit.ts` | Stamps `createdBy/updatedBy`; writes `audit_logs` rows | **WIRED but partial** — `userId`/`tenantId` come from request context; absent without auth, so attribution is frequently null |

**Net physical security posture:**

| Concern | Status |
|---------|--------|
| In-transit encryption (TLS) | In place at the API edge |
| At-rest **column** encryption | Only 4 `medical_records` columns; **PII/PHI elsewhere plaintext** |
| At-rest **disk/volume** encryption | Deployment-dependent (not modeled here) |
| Tenant data isolation | **Not enforced** without auth context |
| Audit attribution | **Partial / often null** without auth context |

---

## 8. Migrations

| Migration (dir) | Purpose |
|-----------------|---------|
| `20251020144226_init` | Initial schema (core 15+ modules, extended entities) |
| `20260526135744_add_auth_user_refresh_token` | Added `users`, `refresh_tokens`, `Role` enum (auth schema; **not wired into routes**) |
| `20260526142025_add_audit_versioning_columns` | Added `createdBy/updatedBy/version/deletedAt` to operational tables |
| `20260526145634_add_multi_tenancy` | Added `tenants` + `tenantId` columns/relations |
| `20260526155432_extend_tenancy_audit_all_models` | Extended tenancy/audit columns across remaining operational tables |

- Migration lock: `prisma/migrations/migration_lock.toml` (provider = postgresql).
- Production apply path: `prisma migrate deploy` (forward-only, no interactive prompts).
- Drift detection: `prisma migrate status` against the target database.

---

## 9. Connection Pooling and Runtime

| Aspect | Realization |
|--------|-------------|
| **Driver / pool** | Prisma's built-in connection pool over the `DATABASE_URL` (libpq) |
| **Pool sizing** | Tunable via `?connection_limit=` on `DATABASE_URL` (default derived from CPU count) |
| **Singleton client** | Single extended `PrismaClient` instance reused across requests (`config/database.ts`) |
| **Timeouts** | Pool/query timeouts via Prisma; 30s request timeout middleware at the API layer |
| **Redis** | Cache/rate-limit/session backing (Redis 7); **never** authoritative — all durable state is in PostgreSQL |
| **Health** | `/health/ready` checks DB connectivity; `/metrics` exposes query-related counters |

---

## 10. Physical Data Quality and Risk Register

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| PR-1 | PHI/PII stored plaintext (all but 4 columns) | **HIGH** | Extend `ENCRYPTED_FIELDS` to client/patient/integration-secret columns; add at-rest volume encryption |
| PR-2 | Tenant isolation not enforced (extension no-ops) | **HIGH** | Wire auth → populate request context (tenantId/userId); fail-closed |
| PR-3 | `Float` used for currency | MEDIUM | Migrate money columns to `Decimal`/`numeric` |
| PR-4 | No DB-level CHECK constraints for invariants | MEDIUM | Add checks (e.g., totals, time ordering) or keep service-enforced + tests |
| PR-5 | `status`/`role` free-text (except `users.role`) | LOW | Consider Postgres enums or app-level validation parity |
| PR-6 | Hard-delete possible via raw paths | LOW | Route all writes through the extended client |

---

## 11. Relationship to Other Views

| View | Relationship |
|------|--------------|
| **DIV-2** Logical | Each table realizes a DIV-2 entity; constraints realize logical keys |
| **DIV-1** Conceptual | Tables trace to subject-area concepts via DIV-2 |
| **AV-2** Dictionary | Column definitions reconcile to the dictionary |
| **SV** systems views | Physical store underlies the Prisma-backed service tier |

---

## Appendix A: Reference Documents

| ID | Title | Location |
|----|-------|----------|
| REF-001 | Prisma Schema | `../backend/prisma/schema.prisma` |
| REF-002 | Migrations | `../backend/prisma/migrations/` |
| REF-003 | Prisma extensions | `../backend/src/config/prisma-extensions/` |
| REF-004 | DB client config | `../backend/src/config/database.ts` |
| REF-005 | Production Gap Analysis | `../docs/PRODUCTION_GAP_ANALYSIS.md` |
| REF-006 | DIV-2 Logical Data Model | `template.DIV-2.md` |

---

**Document Classification:** INTERNAL / **Document Owner:** Purple Cross Architecture Team / **Last Review:** 2026-06-05 / **Next Review:** 2026-09-05
