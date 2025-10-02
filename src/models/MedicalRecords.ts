/**
 * Medical Records & History Module
 * Handles electronic medical records and clinical documentation
 */

export interface MedicalRecord {
  id: string;
  patientId: string;
  visitId: string;
  recordDate: Date;
  veterinarianId: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis: Diagnosis[];
  treatments: Treatment[];
  prescriptions: string[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagnosis {
  id: string;
  code: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'resolved' | 'chronic';
  diagnosedDate: Date;
  resolvedDate?: Date;
}

export interface Treatment {
  id: string;
  type: 'medication' | 'surgery' | 'therapy' | 'procedure' | 'other';
  description: string;
  startDate: Date;
  endDate?: Date;
  outcome?: string;
  performedBy: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  noteType: 'soap' | 'progress' | 'discharge' | 'consultation' | 'procedure';
  templateId?: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  signatureId?: string;
}

export interface NoteTemplate {
  id: string;
  name: string;
  noteType: string;
  structure: string;
  quickTextShortcuts: Record<string, string>;
  fields: TemplateField[];
}

export interface TemplateField {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface DiagnosticResult {
  id: string;
  patientId: string;
  testType: 'lab' | 'imaging' | 'pathology' | 'other';
  testName: string;
  orderDate: Date;
  resultDate?: Date;
  status: 'ordered' | 'in_progress' | 'completed' | 'cancelled';
  results: TestResult[];
  interpretation?: string;
  attachments: string[];
  orderedBy: string;
  reviewedBy?: string;
}

export interface TestResult {
  parameter: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  flag?: 'low' | 'high' | 'critical' | 'abnormal';
}

export interface TreatmentHistory {
  patientId: string;
  treatments: HistoricalTreatment[];
  surgeries: Surgery[];
  medications: MedicationRecord[];
  outcomes: TreatmentOutcome[];
}

export interface HistoricalTreatment {
  id: string;
  date: Date;
  type: string;
  description: string;
  performedBy: string;
  success: boolean;
  notes?: string;
}

export interface Surgery {
  id: string;
  procedureName: string;
  surgeryDate: Date;
  surgeonId: string;
  anesthesiaType: string;
  duration: number;
  complications?: string;
  outcome: string;
  followUpRequired: boolean;
}

export interface MedicationRecord {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  administeredBy?: string;
  reason: string;
}

export interface TreatmentOutcome {
  treatmentId: string;
  outcome: 'cured' | 'improved' | 'stable' | 'worsened' | 'died';
  notes: string;
  followUpDate?: Date;
  recordedAt: Date;
}

export interface VitalSignsHistory {
  patientId: string;
  records: VitalSignRecord[];
}

export interface VitalSignRecord {
  recordDate: Date;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  weight: number;
  bloodPressure?: string;
  painScore?: number;
  recordedBy: string;
}

export interface MedicalAttachment {
  id: string;
  patientId: string;
  recordId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

export interface RecordAudit {
  recordId: string;
  action: 'created' | 'viewed' | 'updated' | 'deleted' | 'shared';
  userId: string;
  timestamp: Date;
  changes?: Record<string, any>;
  ipAddress?: string;
}
