/**
 * Models that carry the Phase 2 cross-cutting columns
 * (createdBy/updatedBy/version/deletedAt) and are audited. Extensions key off
 * the Prisma model name (PascalCase, as passed to `$allModels` query hooks).
 *
 * Start with the clinically/financially critical entities; the same pattern
 * extends to the remaining modules in follow-up migrations.
 */
export const CORE_MODELS = [
  'Patient',
  'Client',
  'Appointment',
  'MedicalRecord',
  'Prescription',
  'Invoice',
] as const;

export type CoreModel = (typeof CORE_MODELS)[number];

/** Models that get createdBy/updatedBy stamped from request context. */
export const STAMPED_MODELS = new Set<string>(CORE_MODELS);

/** Models with an optimistic-locking `version` column (auto-incremented). */
export const VERSIONED_MODELS = new Set<string>(CORE_MODELS);

/** Models for which mutations write an AuditLog row. */
export const AUDITED_MODELS = new Set<string>(CORE_MODELS);

/** Models with a `deletedAt` column and soft-delete semantics. */
export const SOFT_DELETE_MODELS = new Set<string>(CORE_MODELS);

/** Models scoped to a tenant (carry a `tenantId`, enforced by the extension). */
export const TENANT_MODELS = new Set<string>(CORE_MODELS);
