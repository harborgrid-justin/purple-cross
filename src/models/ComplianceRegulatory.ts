/**
 * Compliance & Regulatory Management Module
 * Handles legal compliance, regulations, and audit requirements
 */

export interface ComplianceStandard {
  id: string;
  name: string;
  type: 'HIPAA' | 'GDPR' | 'DEA' | 'state_veterinary_board' | 'OSHA' | 'EPA' | 'custom';
  description: string;
  requirements: ComplianceRequirement[];
  applicableJurisdictions: string[];
  effectiveDate: Date;
  lastReviewDate?: Date;
  nextReviewDate: Date;
  active: boolean;
}

export interface ComplianceRequirement {
  id: string;
  standardId: string;
  requirement: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  controls: ComplianceControl[];
  evidence: string[];
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  responsible: string;
  automated: boolean;
  lastAssessment?: Date;
  nextAssessment: Date;
  status: 'effective' | 'needs_improvement' | 'ineffective';
}

export interface DataEncryption {
  dataType: 'patient_records' | 'financial_data' | 'client_info' | 'communications' | 'credentials';
  encryptionMethod: string;
  keyManagement: string;
  atRest: boolean;
  inTransit: boolean;
  compliantWith: string[];
  lastAudit: Date;
}

export interface AccessAudit {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'view' | 'create' | 'update' | 'delete' | 'export' | 'print';
  resource: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress: string;
  userAgent?: string;
  location?: string;
  success: boolean;
  failureReason?: string;
  dataAccessed?: string[];
}

export interface PrivacyPolicy {
  id: string;
  version: string;
  effectiveDate: Date;
  content: string;
  changes?: string;
  approvedBy: string;
  approvedAt: Date;
  acknowledgments: PolicyAcknowledgment[];
}

export interface PolicyAcknowledgment {
  userId: string;
  acknowledgedAt: Date;
  ipAddress: string;
  version: string;
}

export interface DataBreachProtocol {
  id: string;
  protocolName: string;
  steps: BreachResponseStep[];
  notificationRequirements: NotificationRequirement[];
  responsibleParties: string[];
  lastReviewed: Date;
  lastTested?: Date;
}

export interface BreachResponseStep {
  stepNumber: number;
  action: string;
  responsible: string;
  timeframe: string;
  documentation: string[];
}

export interface NotificationRequirement {
  party: 'affected_clients' | 'authorities' | 'media' | 'insurance' | 'vendors';
  timeframe: string;
  method: string[];
  template?: string;
}

export interface License {
  id: string;
  type: 'veterinary_license' | 'dea_registration' | 'state_permit' | 'business_license' | 'controlled_substance';
  licenseNumber: string;
  issuedTo: string;
  issuedBy: string;
  issueDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'pending_renewal' | 'revoked';
  renewalDate?: Date;
  documentUrl?: string;
  cost?: number;
  notes?: string;
}

export interface LicenseRenewal {
  licenseId: string;
  renewalDueDate: Date;
  remindersSent: RenewalReminder[];
  renewalSubmitted: boolean;
  renewalDate?: Date;
  newExpirationDate?: Date;
  cost?: number;
  status: 'pending' | 'submitted' | 'approved' | 'denied';
}

export interface RenewalReminder {
  sentDate: Date;
  recipient: string;
  method: 'email' | 'sms' | 'notification';
  acknowledged: boolean;
}

export interface ControlledSubstanceReport {
  id: string;
  reportType: 'DEA_222' | 'DEA_106' | 'state_inventory' | 'disposal';
  reportingPeriod: { start: Date; end: Date };
  generatedDate: Date;
  generatedBy: string;
  substances: SubstanceRecord[];
  totalValue: number;
  submittedDate?: Date;
  submittedTo?: string;
  confirmationNumber?: string;
  status: 'draft' | 'pending' | 'submitted' | 'approved';
}

export interface SubstanceRecord {
  substanceId: string;
  substanceName: string;
  deaSchedule: string;
  openingBalance: number;
  received: number;
  dispensed: number;
  destroyed: number;
  transferred: number;
  closingBalance: number;
  discrepancy?: number;
  notes?: string;
}

export interface MedicalRecordRetention {
  recordId: string;
  recordType: 'medical_record' | 'prescription' | 'lab_result' | 'imaging' | 'consent_form';
  patientId: string;
  createdDate: Date;
  retentionPeriod: number;
  retentionUnit: 'years';
  disposalDate: Date;
  legalHold: boolean;
  legalHoldReason?: string;
  status: 'active' | 'archived' | 'scheduled_for_disposal' | 'disposed';
}

export interface LegalHold {
  id: string;
  name: string;
  reason: string;
  initiatedBy: string;
  initiatedDate: Date;
  affectedRecords: string[];
  releasedDate?: Date;
  releasedBy?: string;
  status: 'active' | 'released';
}

export interface IncidentReport {
  id: string;
  incidentType: 'adverse_event' | 'medication_error' | 'data_breach' | 'safety_incident' | 'compliance_violation' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dateOccurred: Date;
  location: string;
  reportedBy: string;
  reportedDate: Date;
  patientsAffected?: string[];
  staffInvolved?: string[];
  witnessess?: string[];
  immediateActions: string[];
  investigation: Investigation;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
}

export interface Investigation {
  assignedTo: string;
  startDate: Date;
  completedDate?: Date;
  findings: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  preventiveMeasures: string[];
  reportSubmitted: boolean;
  reportUrl?: string;
}

export interface CorrectiveAction {
  id: string;
  action: string;
  responsible: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedDate?: Date;
  effectiveness?: 'effective' | 'partially_effective' | 'ineffective';
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: 'clinical' | 'administrative' | 'hr' | 'compliance' | 'safety' | 'other';
  version: string;
  content: string;
  effectiveDate: Date;
  reviewCycle: number;
  reviewCycleUnit: 'months' | 'years';
  nextReviewDate: Date;
  owner: string;
  approvers: string[];
  status: 'draft' | 'review' | 'approved' | 'archived';
  acknowledgmentRequired: boolean;
  acknowledgments: PolicyAcknowledgment[];
}

export interface TrainingRecord {
  id: string;
  trainingName: string;
  trainingType: 'compliance' | 'safety' | 'privacy' | 'security' | 'clinical' | 'other';
  employeeId: string;
  completionDate: Date;
  expirationDate?: Date;
  score?: number;
  passed: boolean;
  certificateUrl?: string;
  mandatoryForCompliance: boolean;
}

export interface AuditPreparation {
  id: string;
  auditType: 'internal' | 'external' | 'regulatory' | 'certification';
  auditScope: string[];
  scheduledDate: Date;
  auditor?: string;
  auditorOrganization?: string;
  checklist: AuditChecklistItem[];
  documentsRequired: string[];
  status: 'planning' | 'preparing' | 'in_progress' | 'completed';
  findings?: AuditFinding[];
}

export interface AuditChecklistItem {
  id: string;
  item: string;
  category: string;
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  evidence?: string[];
  notes?: string;
}

export interface AuditFinding {
  id: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  area: string;
  finding: string;
  requirement: string;
  evidence: string;
  correctiveAction?: CorrectiveAction;
  preventiveMeasure?: string;
}

export interface RegulatoryUpdate {
  id: string;
  regulationType: string;
  jurisdiction: string;
  updateTitle: string;
  description: string;
  effectiveDate: Date;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  requiredActions: string[];
  assignedTo?: string;
  implementationDate?: Date;
  status: 'new' | 'under_review' | 'implementing' | 'implemented';
}

export interface ComplianceReport {
  id: string;
  reportType: string;
  period: { start: Date; end: Date };
  overallStatus: 'compliant' | 'mostly_compliant' | 'partially_compliant' | 'non_compliant';
  standards: StandardCompliance[];
  gaps: ComplianceGap[];
  recommendations: string[];
  generatedDate: Date;
  generatedBy: string;
}

export interface StandardCompliance {
  standardId: string;
  standardName: string;
  complianceRate: number;
  status: 'compliant' | 'partial' | 'non_compliant';
  requirementsMet: number;
  totalRequirements: number;
}

export interface ComplianceGap {
  requirementId: string;
  requirement: string;
  currentState: string;
  desiredState: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  targetDate?: Date;
}
