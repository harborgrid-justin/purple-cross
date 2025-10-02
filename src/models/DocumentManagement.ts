/**
 * Document Management Module
 * Handles document storage, templates, e-signatures, and workflows
 */

export interface Document {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  version: number;
  versionHistory: DocumentVersion[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  parentFolderId?: string;
  relatedTo?: RelatedEntity;
  metadata: Record<string, any>;
}

export interface RelatedEntity {
  type: 'patient' | 'client' | 'invoice' | 'appointment' | 'medical_record' | 'other';
  id: string;
}

export interface DocumentVersion {
  version: number;
  url: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  changes?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  createdBy: string;
  createdAt: Date;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'letter' | 'form' | 'consent' | 'prescription' | 'invoice' | 'certificate' | 'report' | 'other';
  templateContent: string;
  variables: TemplateVariable[];
  format: 'docx' | 'pdf' | 'html';
  active: boolean;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface TemplateVariable {
  name: string;
  displayName: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'list';
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  documentId: string;
  variables: Record<string, any>;
  generatedBy: string;
  generatedAt: Date;
  relatedTo?: RelatedEntity;
}

export interface ESignatureRequest {
  id: string;
  documentId: string;
  signers: Signer[];
  status: 'draft' | 'sent' | 'partially_signed' | 'completed' | 'declined' | 'expired';
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  completedAt?: Date;
  message?: string;
}

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
  ipAddress?: string;
  signature?: SignatureData;
}

export interface SignatureData {
  type: 'drawn' | 'typed' | 'uploaded';
  data: string;
  timestamp: Date;
  certificate?: string;
}

export interface DocumentScan {
  id: string;
  batchId?: string;
  documentId?: string;
  sourceType: 'scanner' | 'upload' | 'email' | 'fax';
  originalFileName: string;
  scannedAt: Date;
  scannedBy: string;
  pageCount: number;
  ocrPerformed: boolean;
  ocrText?: string;
  quality: 'low' | 'medium' | 'high';
  indexed: boolean;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  documentId: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkflowStep {
  stepNumber: number;
  name: string;
  assignedTo: string[];
  action: 'review' | 'approve' | 'sign' | 'comment' | 'update';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rejected';
  dueDate?: Date;
  completedBy?: string;
  completedAt?: Date;
  comments?: string;
  required: boolean;
}

export interface DocumentSearch {
  query: string;
  filters: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageSize: number;
  page: number;
}

export interface SearchFilter {
  field: 'category' | 'tags' | 'createdBy' | 'createdDate' | 'fileType' | 'accessLevel' | 'relatedTo';
  operator: 'equals' | 'contains' | 'between' | 'in';
  value: any;
}

export interface DocumentAccess {
  documentId: string;
  userId: string;
  accessType: 'view' | 'edit' | 'delete' | 'share';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface ShareLink {
  id: string;
  documentId: string;
  token: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  accessCount: number;
  maxAccessCount?: number;
  requiresPassword: boolean;
  passwordHash?: string;
  allowDownload: boolean;
  active: boolean;
}

export interface DocumentAnnotation {
  id: string;
  documentId: string;
  page: number;
  type: 'highlight' | 'note' | 'comment' | 'drawing' | 'stamp';
  content?: string;
  position: AnnotationPosition;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  resolved: boolean;
}

export interface AnnotationPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  coordinates?: number[];
}

export interface DocumentAudit {
  id: string;
  documentId: string;
  action: 'created' | 'viewed' | 'downloaded' | 'updated' | 'deleted' | 'shared' | 'signed';
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export interface StorageMetrics {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  documentCount: number;
  byCategory: Record<string, StorageUsage>;
  byFileType: Record<string, StorageUsage>;
  growthRate: number;
}

export interface StorageUsage {
  count: number;
  size: number;
  percentage: number;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  description?: string;
  category: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  action: 'archive' | 'delete' | 'review';
  active: boolean;
  lastApplied?: Date;
}

export interface ArchivedDocument {
  documentId: string;
  originalLocation: string;
  archiveLocation: string;
  archivedAt: Date;
  archivedBy: string;
  reason: string;
  retrievable: boolean;
  destructionDate?: Date;
}
