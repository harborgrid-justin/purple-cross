/**
 * Centralized Constants for Purple Cross Backend
 * All hardcoded values, magic numbers, and static strings should be defined here
 */

// ============================================================================
// HTTP Status Codes
// ============================================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// Entity Status Values
// ============================================================================
export const STATUS = {
  // General statuses
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  SUCCESS: 'success',

  // Appointment statuses
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  IN_PROGRESS: 'in_progress',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',

  // Payment/Invoice statuses
  PAID: 'paid',
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
  REFUNDED: 'refunded',

  // Order statuses
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ORDERED: 'ordered',
  RECEIVED: 'received',

  // Document statuses
  SIGNED: 'signed',
  UNSIGNED: 'unsigned',

  // Communication statuses
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  BOUNCED: 'bounced',

  // Lab test statuses
  ROUTINE: 'routine',
  URGENT: 'urgent',
  STAT: 'stat',

  // Staff statuses
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  ON_LEAVE: 'on_leave',

  // Claim statuses
  NEW: 'new',
  PROCESSING: 'processing',
  REPORTED: 'reported',

  // Equipment statuses
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',

  // Feedback/Survey statuses
  REGISTERED: 'registered',
} as const;

// ============================================================================
// Circuit Breaker States
// ============================================================================
export const CIRCUIT_STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
} as const;

// ============================================================================
// Default Pagination Values
// ============================================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// ============================================================================
// Default Query Limits
// ============================================================================
export const QUERY_LIMITS = {
  MEDICAL_RECORDS: 10,
  APPOINTMENTS: 5,
  INVOICES: 10,
  RECENT_ITEMS: 10,
  PATIENTS: 5,
} as const;

// ============================================================================
// Time Constants (in milliseconds)
// ============================================================================
export const TIME = {
  // Timeouts
  DEFAULT_REQUEST_TIMEOUT: 30000, // 30 seconds
  GRACEFUL_SHUTDOWN_TIMEOUT: 10000, // 10 seconds
  API_TIMEOUT: 10000, // 10 seconds

  // Rate limiting
  AUTH_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes

  // Retry delays
  MIN_RETRY_DELAY: 100, // 100ms
  MAX_RETRY_DELAY: 5000, // 5 seconds
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================
export const RATE_LIMIT = {
  AUTH_MAX_REQUESTS: 5,
  AUTH_SKIP_SUCCESSFUL: true,
} as const;

// ============================================================================
// File Upload
// ============================================================================
export const FILE_UPLOAD = {
  MAX_SIZE: 10485760, // 10MB in bytes
  BODY_LIMIT: '10mb',
} as const;

// ============================================================================
// Circuit Breaker Configuration Defaults
// ============================================================================
export const CIRCUIT_BREAKER_DEFAULTS = {
  FAILURE_THRESHOLD: 5,
  SUCCESS_THRESHOLD: 2,
  TIMEOUT: 60000, // 60 seconds
} as const;

// ============================================================================
// Retry Configuration Defaults
// ============================================================================
export const RETRY_DEFAULTS = {
  MAX_RETRIES: 3,
  BASE_DELAY: 1000, // 1 second
} as const;

// ============================================================================
// Health Check Paths
// ============================================================================
export const HEALTH_PATHS = {
  HEALTH: '/health',
  READY: '/health/ready',
  LIVE: '/health/live',
  DETAILED: '/health/detailed',
  METRICS: '/metrics',
} as const;

// ============================================================================
// Error Codes
// ============================================================================
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  TIMEOUT: 'TIMEOUT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CIRCUIT_OPEN: 'CIRCUIT_OPEN',
} as const;

// ============================================================================
// Error Messages
// ============================================================================
export const ERROR_MESSAGES = {
  NOT_FOUND: (entity: string) => `${entity} not found`,
  ALREADY_EXISTS: (entity: string) => `${entity} already exists`,
  TIME_SLOT_BOOKED: 'Time slot already booked',
  CIRCUIT_BREAKER_OPEN: (service: string) => `Circuit breaker is open for ${service}`,
  RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later.',
  AUTH_RATE_LIMIT_EXCEEDED: 'Too many authentication attempts, please try again later.',
  REQUEST_TIMEOUT: 'Request timeout',
  MISSING_ENV_VARS: (vars: string[]) =>
    `Missing required environment variables: ${vars.join(', ')}`,
} as const;

// ============================================================================
// Default Environment Values
// ============================================================================
export const DEFAULT_ENV = {
  NODE_ENV: 'development',
  PORT: 3000,
  API_PREFIX: '/api/v1',
  REDIS_URL: 'redis://localhost:6379',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  MAX_FILE_SIZE: 10485760,
  UPLOAD_DIR: './uploads',
  JWT_SECRET_FALLBACK: 'change-me-in-production',
} as const;

// ============================================================================
// Required Environment Variables
// ============================================================================
export const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'] as const;

// ============================================================================
// Database Query Modes
// ============================================================================
export const QUERY_MODE = {
  INSENSITIVE: 'insensitive',
  SENSITIVE: 'sensitive',
} as const;

// ============================================================================
// Sort Orders
// ============================================================================
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// ============================================================================
// Common Field Names
// ============================================================================
export const FIELDS = {
  ID: 'id',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  START_TIME: 'startTime',
  VISIT_DATE: 'visitDate',
  INVOICE_DATE: 'invoiceDate',
  NAME: 'name',
  STATUS: 'status',
} as const;

// ============================================================================
// Loyalty Program Tiers
// ============================================================================
export const LOYALTY_TIER = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

// ============================================================================
// Contact Preferences
// ============================================================================
export const CONTACT_PREFERENCE = {
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
} as const;

// ============================================================================
// Communication Types
// ============================================================================
export const COMMUNICATION_TYPE = {
  EMAIL: 'email',
  SMS: 'sms',
  PHONE: 'phone',
  VOICE: 'voice',
  IN_PERSON: 'in_person',
} as const;

// ============================================================================
// Document Entity Types
// ============================================================================
export const DOCUMENT_ENTITY_TYPE = {
  PATIENT: 'patient',
  CLIENT: 'client',
  APPOINTMENT: 'appointment',
  MEDICAL_RECORD: 'medical_record',
  INVOICE: 'invoice',
  LAB_TEST: 'lab_test',
} as const;

// ============================================================================
// Report Formats
// ============================================================================
export const REPORT_FORMAT = {
  PDF: 'pdf',
  CSV: 'csv',
  EXCEL: 'excel',
  JSON: 'json',
} as const;

// ============================================================================
// Staff Roles
// ============================================================================
export const STAFF_ROLE = {
  VETERINARIAN: 'veterinarian',
  TECHNICIAN: 'technician',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin',
  MANAGER: 'manager',
} as const;

// ============================================================================
// Appointment Types
// ============================================================================
export const APPOINTMENT_TYPE = {
  CONSULTATION: 'consultation',
  SURGERY: 'surgery',
  VACCINATION: 'vaccination',
  CHECKUP: 'checkup',
  EMERGENCY: 'emergency',
  FOLLOW_UP: 'follow_up',
} as const;

// ============================================================================
// Species
// ============================================================================
export const SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  REPTILE: 'reptile',
  OTHER: 'other',
} as const;

// ============================================================================
// Gender
// ============================================================================
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const;

// ============================================================================
// Integration Status
// ============================================================================
export const INTEGRATION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  PENDING: 'pending',
} as const;
