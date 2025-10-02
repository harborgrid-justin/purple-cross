/**
 * Integration & API Management Module
 * Handles third-party integrations, APIs, and data exchange
 */

export interface Integration {
  id: string;
  name: string;
  type: 'lab' | 'pharmacy' | 'payment' | 'insurance' | 'email' | 'sms' | 'accounting' | 'other';
  provider: string;
  description?: string;
  status: 'active' | 'inactive' | 'error' | 'configuring';
  configuration: IntegrationConfig;
  lastSync?: Date;
  syncFrequency?: number;
  syncFrequencyUnit?: 'minutes' | 'hours' | 'days';
  createdAt: Date;
  createdBy: string;
}

export interface IntegrationConfig {
  endpoint?: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  webhookUrl?: string;
  customFields?: Record<string, any>;
  timeout?: number;
  retryAttempts?: number;
  authMethod: 'api_key' | 'oauth2' | 'basic' | 'bearer' | 'custom';
}

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  version: string;
  category: string;
  authentication: 'required' | 'optional' | 'none';
  rateLimit?: RateLimit;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  deprecated: boolean;
  deprecationDate?: Date;
}

export interface RateLimit {
  requests: number;
  period: number;
  periodUnit: 'second' | 'minute' | 'hour' | 'day';
  perUser: boolean;
}

export interface APIKey {
  id: string;
  key: string;
  name: string;
  description?: string;
  userId: string;
  scopes: string[];
  rateLimit?: RateLimit;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  active: boolean;
}

export interface APIRequest {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  apiKeyId?: string;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  requestHeaders: Record<string, string>;
  requestBody?: any;
  responseStatus: number;
  responseTime: number;
  responseSize: number;
  error?: string;
}

export interface DataImport {
  id: string;
  source: string;
  dataType: 'patients' | 'clients' | 'appointments' | 'medical_records' | 'inventory' | 'other';
  fileName: string;
  fileSize: number;
  fileFormat: 'csv' | 'excel' | 'json' | 'xml' | 'hl7' | 'fhir';
  uploadedBy: string;
  uploadedAt: Date;
  status: 'uploaded' | 'validating' | 'processing' | 'completed' | 'failed' | 'partially_completed';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: ImportError[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface ImportError {
  row: number;
  field?: string;
  value?: any;
  error: string;
  severity: 'warning' | 'error';
}

export interface FieldMapping {
  importId: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: any;
  required: boolean;
}

export interface DataExport {
  id: string;
  dataType: string;
  format: 'csv' | 'excel' | 'json' | 'xml' | 'pdf';
  filters: ExportFilter[];
  fields: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  expiresAt?: Date;
}

export interface ExportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between' | 'in';
  value: any;
}

export interface HL7Message {
  id: string;
  messageType: string;
  triggerEvent: string;
  sendingApplication: string;
  sendingFacility: string;
  receivingApplication: string;
  receivingFacility: string;
  messageTimestamp: Date;
  messageContent: string;
  direction: 'inbound' | 'outbound';
  status: 'received' | 'processed' | 'acknowledged' | 'failed';
  acknowledgment?: string;
  processedAt?: Date;
  error?: string;
}

export interface FHIRResource {
  id: string;
  resourceType: 'Patient' | 'Practitioner' | 'Observation' | 'MedicationRequest' | 'Appointment' | 'DiagnosticReport';
  version: string;
  data: Record<string, any>;
  lastUpdated: Date;
  source: string;
}

export interface Webhook {
  id: string;
  name: string;
  description?: string;
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
  retryAttempts: number;
  retryDelay: number;
  headers?: Record<string, string>;
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  attemptNumber: number;
  deliveredAt: Date;
  responseStatus?: number;
  responseBody?: string;
  responseTime?: number;
  success: boolean;
  error?: string;
  nextRetry?: Date;
}

export interface SSOConfiguration {
  id: string;
  provider: 'saml' | 'oauth2' | 'openid' | 'active_directory';
  name: string;
  enabled: boolean;
  entityId?: string;
  ssoUrl?: string;
  sloUrl?: string;
  certificate?: string;
  clientId?: string;
  clientSecret?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  scopes?: string[];
  attributeMapping: AttributeMapping;
}

export interface AttributeMapping {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  customAttributes?: Record<string, string>;
}

export interface AccountingSyncConfig {
  id: string;
  provider: 'quickbooks' | 'xero' | 'sage' | 'freshbooks' | 'other';
  companyId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  syncEnabled: boolean;
  syncFrequency: number;
  syncFrequencyUnit: 'hours' | 'days';
  lastSync?: Date;
  chartOfAccountsMapping: AccountMapping[];
  autoCreateItems: boolean;
}

export interface AccountMapping {
  localAccount: string;
  externalAccount: string;
  accountType: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
}

export interface SyncTransaction {
  id: string;
  integrationId: string;
  syncType: 'manual' | 'automatic';
  direction: 'import' | 'export' | 'bidirectional';
  startedAt: Date;
  completedAt?: Date;
  status: 'in_progress' | 'completed' | 'failed' | 'partially_completed';
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  errors: SyncError[];
}

export interface SyncError {
  recordId?: string;
  recordType: string;
  error: string;
  timestamp: Date;
  retryable: boolean;
}

export interface APIAnalytics {
  period: { start: Date; end: Date };
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  byEndpoint: EndpointMetrics[];
  byConsumer: ConsumerMetrics[];
  errorRate: number;
  topErrors: ErrorMetric[];
}

export interface EndpointMetrics {
  endpoint: string;
  method: string;
  requests: number;
  averageResponseTime: number;
  errorRate: number;
  maxResponseTime: number;
}

export interface ConsumerMetrics {
  consumerId: string;
  consumerName?: string;
  requests: number;
  dataTransferred: number;
  averageResponseTime: number;
  errorRate: number;
  rateLimitHits: number;
}

export interface ErrorMetric {
  statusCode: number;
  error: string;
  count: number;
  percentage: number;
  lastOccurrence: Date;
}

export interface APIThrottle {
  consumerId: string;
  endpoint?: string;
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
  limitReached: boolean;
  resetAt: Date;
}

export interface IntegrationHealth {
  integrationId: string;
  integrationName: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  uptime: number;
  averageLatency: number;
  errorRate: number;
  lastError?: string;
  lastErrorTime?: Date;
}
