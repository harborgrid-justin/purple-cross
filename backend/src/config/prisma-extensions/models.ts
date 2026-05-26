/**
 * Models that carry the Phase 2 cross-cutting columns
 * (createdBy/updatedBy/version/deletedAt) and are tenant-scoped/audited.
 * Extensions key off the Prisma model name (PascalCase, as passed to
 * `$allModels` query hooks).
 *
 * A name mismatch here silently no-ops the relevant extension; a name listed
 * for a model that lacks the underlying column will throw at runtime — so the
 * lists below are kept in exact sync with `schema.prisma`.
 */

/** The clinically/financially critical entities seeded in the first rollout. */
export const CORE_MODELS = [
  'Patient',
  'Client',
  'Appointment',
  'MedicalRecord',
  'Prescription',
  'Invoice',
] as const;

export type CoreModel = (typeof CORE_MODELS)[number];

/**
 * Every operational model that carries the full lifecycle column set
 * (createdBy/updatedBy/deletedAt + tenantId) and participates in tenant
 * isolation, audit stamping, and soft-delete. Includes the CORE_MODELS above.
 *
 * Excludes global reference / platform / auth tables (Medication, BreedInformation,
 * DrugInteraction, RegulatoryUpdate, ApiKey, ApiUsageMetric, WebhookSubscription,
 * WebhookDelivery, AuditLog, User, Tenant, RefreshToken) and cascade-owned
 * line-item children (InvoiceLineItem, EstimateLineItem, PurchaseOrderItem,
 * PaymentPlanInstallment, AppointmentReminder, WorkflowExecutionStep).
 */
export const OPERATIONAL_MODELS = [
  // Core
  'Patient',
  'Client',
  'Appointment',
  'MedicalRecord',
  'Prescription',
  'Invoice',
  // Clinical / inventory / billing operations
  'InventoryItem',
  'Payment',
  'LabTest',
  'Staff',
  'StaffSchedule',
  'Communication',
  'Document',
  'ComplianceIncident',
  // Patient extensions
  'PatientRelationship',
  'PatientReminder',
  // Client extensions
  'ClientPortalAccess',
  'LoyaltyProgram',
  'LoyaltyTransaction',
  'ClientFeedback',
  'Survey',
  'SurveyResponse',
  'ClientSegment',
  // Appointment extensions
  'Waitlist',
  'TimeBlock',
  // Medical record extensions
  'ClinicalTemplate',
  'MedicalRecordShare',
  // Prescription extensions
  'ControlledSubstanceLog',
  'CompoundingFormula',
  // Inventory extensions
  'PurchaseOrder',
  'Equipment',
  'EquipmentMaintenance',
  // Billing extensions
  'InsuranceClaim',
  'Estimate',
  'PaymentPlan',
  'Refund',
  // Laboratory extensions
  'ExternalLabIntegration',
  'QualityControlRecord',
  // Staff extensions
  'TimeAttendance',
  'PerformanceReview',
  'ContinuingEducation',
  // Reporting extensions
  'ReportTemplate',
  'ReportSchedule',
  // Communication / marketing extensions
  'MarketingCampaign',
  'PushSubscription',
  'SocialMediaPost',
  // Document extensions
  'DocumentTemplate',
  'DocumentSignature',
  'DocumentWorkflow',
  // Workflow engine
  'WorkflowTemplate',
  'WorkflowExecution',
  // Compliance extensions
  'Policy',
  'PolicyAcknowledgment',
  // Integration extensions
  'DataImportJob',
] as const;

export type OperationalModel = (typeof OPERATIONAL_MODELS)[number];

/** Models that get createdBy/updatedBy stamped from request context. */
export const STAMPED_MODELS = new Set<string>(OPERATIONAL_MODELS);

/**
 * Models with an optimistic-locking `version` column (auto-incremented).
 *
 * `Policy` is intentionally excluded: it already exposes a domain-level
 * `version String` (the policy document revision label), so it carries audit
 * and soft-delete columns but no integer optimistic-lock column.
 */
export const VERSIONED_MODELS = new Set<string>(
  OPERATIONAL_MODELS.filter((model) => model !== 'Policy'),
);

/** Models for which mutations write an AuditLog row. */
export const AUDITED_MODELS = new Set<string>(OPERATIONAL_MODELS);

/** Models with a `deletedAt` column and soft-delete semantics. */
export const SOFT_DELETE_MODELS = new Set<string>(OPERATIONAL_MODELS);

/** Models scoped to a tenant (carry a `tenantId`, enforced by the extension). */
export const TENANT_MODELS = new Set<string>(OPERATIONAL_MODELS);
