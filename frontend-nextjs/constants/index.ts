/**
 * Centralized Constants for Purple Cross Next.js Frontend
 * All hardcoded values, magic numbers, and static strings should be defined here
 */

// ============================================================================
// API Configuration
// ============================================================================
export const API_CONFIG = {
  BASE_URL: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000/api/v1',
  TIMEOUT: 30000, // 30 seconds
} as const;

// ============================================================================
// Application Info
// ============================================================================
export const APP_INFO = {
  NAME: process.env['NEXT_PUBLIC_APP_NAME'] || 'Purple Cross',
  VERSION: process.env['NEXT_PUBLIC_APP_VERSION'] || '2.0.0',
} as const;

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
// Default Pagination Values
// ============================================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// ============================================================================
// Local Storage Keys
// ============================================================================
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// ============================================================================
// Route Paths
// ============================================================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  DASHBOARD: '/dashboard',

  // Patients
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  PATIENT_NEW: '/patients/new',

  // Clients
  CLIENTS: '/clients',
  CLIENT_DETAIL: '/clients/:id',
  CLIENT_NEW: '/clients/new',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  APPOINTMENT_NEW: '/appointments/new',

  // Medical Records
  MEDICAL_RECORDS: '/medical-records',
  MEDICAL_RECORD_DETAIL: '/medical-records/:id',
  MEDICAL_RECORD_NEW: '/medical-records/new',

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_DETAIL: '/prescriptions/:id',
  PRESCRIPTION_NEW: '/prescriptions/new',

  // Inventory
  INVENTORY: '/inventory',

  // Billing
  BILLING: '/billing',

  // Laboratory
  LABORATORY: '/laboratory',

  // Staff
  STAFF: '/staff',
  STAFF_DETAIL: '/staff/:id',
  STAFF_NEW: '/staff/new',

  // Communications
  COMMUNICATIONS: '/communications',

  // Documents
  DOCUMENTS: '/documents',

  // Reports & Analytics
  REPORTS: '/reports',

  // Not Found
  NOT_FOUND: '*',
} as const;

// ============================================================================
// API Endpoints
// ============================================================================
export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',

  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,

  // Clients
  CLIENTS: '/clients',
  CLIENT_BY_ID: (id: string) => `/clients/${id}`,

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: (id: string) => `/appointments/${id}`,

  // Medical Records
  MEDICAL_RECORDS: '/medical-records',
  MEDICAL_RECORD_BY_ID: (id: string) => `/medical-records/${id}`,

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_BY_ID: (id: string) => `/prescriptions/${id}`,

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_BY_ID: (id: string) => `/inventory/${id}`,

  // Invoices
  INVOICES: '/invoices',
  INVOICE_BY_ID: (id: string) => `/invoices/${id}`,

  // Lab Tests
  LAB_TESTS: '/lab-tests',
  LAB_TEST_BY_ID: (id: string) => `/lab-tests/${id}`,

  // Staff
  STAFF: '/staff',
  STAFF_BY_ID: (id: string) => `/staff/${id}`,

  // Communications
  COMMUNICATIONS: '/communications',
  COMMUNICATION_BY_ID: (id: string) => `/communications/${id}`,

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_BY_ID: (id: string) => `/documents/${id}`,

  // Analytics
  ANALYTICS_DASHBOARD: '/analytics/dashboard',
  ANALYTICS_PATIENTS: '/analytics/patients',
  ANALYTICS_APPOINTMENTS: '/analytics/appointments',
  ANALYTICS_FINANCIAL: '/analytics/financial',
} as const;

// ============================================================================
// HTTP Headers
// ============================================================================
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  BEARER_PREFIX: 'Bearer',
  CORRELATION_ID: 'X-Correlation-ID',
} as const;

// ============================================================================
// Content Types
// ============================================================================
export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;

// ============================================================================
// Query Keys (for TanStack Query)
// ============================================================================
export const QUERY_KEYS = {
  AUTH: 'auth',
  PATIENTS: 'patients',
  PATIENT: 'patient',
  CLIENTS: 'clients',
  CLIENT: 'client',
  APPOINTMENTS: 'appointments',
  APPOINTMENT: 'appointment',
  MEDICAL_RECORDS: 'medicalRecords',
  MEDICAL_RECORD: 'medicalRecord',
  PRESCRIPTIONS: 'prescriptions',
  PRESCRIPTION: 'prescription',
  INVENTORY: 'inventory',
  INVENTORY_ITEM: 'inventoryItem',
  INVOICES: 'invoices',
  INVOICE: 'invoice',
  LAB_TESTS: 'labTests',
  LAB_TEST: 'labTest',
  STAFF: 'staff',
  STAFF_MEMBER: 'staffMember',
  COMMUNICATIONS: 'communications',
  COMMUNICATION: 'communication',
  DOCUMENTS: 'documents',
  DOCUMENT: 'document',
  ANALYTICS: 'analytics',
} as const;

// ============================================================================
// TanStack Query Performance Configuration
// ============================================================================

/**
 * Stale time constants for different data types in milliseconds
 */
export const QUERY_STALE_TIME = {
  REAL_TIME: 0, // 0ms - Always stale, refetch on every mount
  DYNAMIC: 30000, // 30 seconds
  STANDARD: 300000, // 5 minutes
  SEMI_STATIC: 600000, // 10 minutes
  STATIC: 3600000, // 1 hour
  CACHED: 86400000, // 24 hours
} as const;

/**
 * Cache time (garbage collection time) for queries
 */
export const QUERY_CACHE_TIME = {
  DEFAULT: 600000, // 10 minutes
  SHORT: 300000, // 5 minutes
  LONG: 1800000, // 30 minutes
  PERSISTENT: 86400000, // 24 hours
} as const;

/**
 * Retry configuration for failed queries
 */
export const QUERY_RETRY = {
  DEFAULT: 3,
  CRITICAL: 5,
  NO_RETRY: 0,
  MINIMAL: 1,
} as const;

/**
 * Refetch intervals for polling queries (in milliseconds)
 */
export const QUERY_REFETCH_INTERVAL = {
  FAST: 5000, // 5 seconds
  MODERATE: 30000, // 30 seconds
  SLOW: 60000, // 1 minute
  VERY_SLOW: 300000, // 5 minutes
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
