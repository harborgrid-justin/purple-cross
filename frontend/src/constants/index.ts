/**
 * Centralized Constants for Purple Cross Frontend
 * All hardcoded values, magic numbers, and static strings should be defined here
 */

// ============================================================================
// API Configuration
// ============================================================================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000, // 10 seconds
} as const;

// ============================================================================
// Application Info
// ============================================================================
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'Purple Cross',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
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
  CLIENT_REGISTRATION: '/clients/registration',
  CLIENT_MULTI_PET: '/clients/multi-pet',
  CLIENT_SEGMENTATION: '/clients/segmentation',
  CLIENT_PORTAL_ACCESS: '/clients/portal-access',
  CLIENT_LOYALTY: '/clients/loyalty',
  CLIENT_FEEDBACK: '/clients/feedback',
  CLIENT_COMMUNICATION_HISTORY: '/clients/communication-history',
  CLIENT_ACCOUNT_MANAGEMENT: '/clients/account-management',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  APPOINTMENT_NEW: '/appointments/new',
  APPOINTMENT_BOOKING: '/appointments/booking',
  APPOINTMENT_CALENDAR: '/appointments/calendar',
  APPOINTMENT_REMINDERS: '/appointments/reminders',
  APPOINTMENT_TYPES: '/appointments/types',
  APPOINTMENT_TIME_BLOCKS: '/appointments/time-blocks',
  APPOINTMENT_WAITLIST: '/appointments/waitlist',
  APPOINTMENT_OPTIMIZATION: '/appointments/optimization',
  APPOINTMENT_ANALYTICS: '/appointments/analytics',

  // Medical Records
  MEDICAL_RECORDS: '/medical-records',
  MEDICAL_RECORD_DETAIL: '/medical-records/:id',
  MEDICAL_RECORD_NEW: '/medical-records/new',

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_DETAIL: '/prescriptions/:id',
  PRESCRIPTION_NEW: '/prescriptions/new',
  PRESCRIPTION_HISTORY: '/prescriptions/history',
  PRESCRIPTION_E_PRESCRIBING: '/prescriptions/e-prescribing',
  PRESCRIPTION_MEDICATION_DATABASE: '/prescriptions/medication-database',
  PRESCRIPTION_DRUG_INTERACTIONS: '/prescriptions/drug-interactions',
  PRESCRIPTION_MEDICATION_REMINDERS: '/prescriptions/medication-reminders',

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_STOCK_MONITORING: '/inventory/stock-monitoring',
  INVENTORY_AUTO_REORDER: '/inventory/auto-reorder',
  INVENTORY_PURCHASE_ORDERS: '/inventory/purchase-orders',
  INVENTORY_VENDORS: '/inventory/vendors',
  INVENTORY_EQUIPMENT: '/inventory/equipment',
  INVENTORY_BARCODE: '/inventory/barcode',
  INVENTORY_VALUATION: '/inventory/valuation',
  INVENTORY_USAGE_ANALYTICS: '/inventory/usage-analytics',

  // Billing
  BILLING: '/billing',
  BILLING_INVOICE_GENERATION: '/billing/invoice-generation',
  BILLING_PAYMENT_PROCESSING: '/billing/payment-processing',
  BILLING_ESTIMATES: '/billing/estimates',
  BILLING_PAYMENT_PLANS: '/billing/payment-plans',
  BILLING_INSURANCE_CLAIMS: '/billing/insurance-claims',
  BILLING_REFUNDS: '/billing/refunds',
  BILLING_RECEIVABLES: '/billing/receivables',
  BILLING_FINANCIAL_REPORTS: '/billing/financial-reports',

  // Laboratory
  LABORATORY: '/laboratory',
  LABORATORY_IN_HOUSE: '/laboratory/in-house',
  LABORATORY_EXTERNAL: '/laboratory/external',
  LABORATORY_LAB_REPORTS: '/laboratory/lab-reports',
  LABORATORY_LAB_EQUIPMENT: '/laboratory/lab-equipment',

  // Staff
  STAFF: '/staff',
  STAFF_DETAIL: '/staff/:id',
  STAFF_NEW: '/staff/new',
  STAFF_ACCESS_CONTROL: '/staff/access-control',
  STAFF_ATTENDANCE: '/staff/attendance',
  STAFF_COMMUNICATION: '/staff/communication',
  STAFF_EDUCATION: '/staff/education',

  // Communications
  COMMUNICATIONS: '/communications',
  COMMUNICATIONS_EMAIL: '/communications/email',
  COMMUNICATIONS_SMS: '/communications/sms',
  COMMUNICATIONS_VOICE: '/communications/voice',
  COMMUNICATIONS_CLIENT_PORTAL: '/communications/client-portal',
  COMMUNICATIONS_NOTIFICATIONS: '/communications/notifications',
  COMMUNICATIONS_TELEMEDICINE: '/communications/telemedicine',
  COMMUNICATIONS_MARKETING: '/communications/marketing',
  COMMUNICATIONS_SOCIAL_MEDIA: '/communications/social-media',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENTS_STORAGE: '/documents/storage',
  DOCUMENTS_TEMPLATES: '/documents/templates',
  DOCUMENTS_E_SIGNATURE: '/documents/e-signature',
  DOCUMENTS_SCANNING: '/documents/scanning',
  DOCUMENTS_WORKFLOW: '/documents/workflow',
  DOCUMENTS_ACCESS_CONTROL: '/documents/access-control',
  DOCUMENTS_SEARCH_RETRIEVAL: '/documents/search-retrieval',
  DOCUMENTS_ANALYTICS: '/documents/analytics',

  // Reports & Analytics
  REPORTS: '/reports',

  // Compliance
  COMPLIANCE: '/compliance',
  COMPLIANCE_HIPAA: '/compliance/hipaa',
  COMPLIANCE_AUDIT_PREP: '/compliance/audit-prep',
  COMPLIANCE_CONTROLLED_SUBSTANCES: '/compliance/controlled-substances',
  COMPLIANCE_RECORD_RETENTION: '/compliance/record-retention',
  COMPLIANCE_LICENSES: '/compliance/licenses',
  COMPLIANCE_INCIDENT_REPORTING: '/compliance/incident-reporting',
  COMPLIANCE_POLICIES: '/compliance/policies',
  COMPLIANCE_UPDATES: '/compliance/updates',

  // Integrations
  INTEGRATIONS: '/integrations',
  INTEGRATIONS_API: '/integrations/api',
  INTEGRATIONS_THIRD_PARTY: '/integrations/third-party',
  INTEGRATIONS_HL7_FHIR: '/integrations/hl7-fhir',
  INTEGRATIONS_ACCOUNTING: '/integrations/accounting',
  INTEGRATIONS_SSO: '/integrations/sso',
  INTEGRATIONS_WEBHOOKS: '/integrations/webhooks',
  INTEGRATIONS_IMPORT_EXPORT: '/integrations/import-export',
  INTEGRATIONS_API_ANALYTICS: '/integrations/api-analytics',

  // Mobile
  MOBILE: '/mobile',

  // Not Found
  NOT_FOUND: '*',
} as const;

// ============================================================================
// API Endpoints
// ============================================================================
export const API_ENDPOINTS = {
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
  ANALYTICS_INVENTORY: '/analytics/inventory',
  ANALYTICS_STAFF: '/analytics/staff',

  // Breed Info
  BREED_INFO: '/breed-info',
  BREED_INFO_BY_ID: (id: string) => `/breed-info/${id}`,
  BREED_INFO_BY_BREED: (breed: string) => `/breed-info/breed/${breed}`,

  // Patient Relationships
  PATIENT_RELATIONSHIPS: '/patient-relationships',
  PATIENT_RELATIONSHIPS_BY_ID: (id: string) => `/patient-relationships/${id}`,
  PATIENT_RELATIONSHIPS_BY_PATIENT: (patientId: string) =>
    `/patient-relationships/patient/${patientId}`,
  PATIENT_FAMILY: (patientId: string) => `/patient-relationships/patient/${patientId}/family`,

  // Patient Reminders
  PATIENT_REMINDERS: '/patient-reminders',
  PATIENT_REMINDERS_BY_ID: (id: string) => `/patient-reminders/${id}`,
  PATIENT_REMINDERS_DUE: '/patient-reminders/due',
  PATIENT_REMINDERS_COMPLETE: (id: string) => `/patient-reminders/${id}/complete`,

  // Client Portal
  CLIENT_PORTAL: '/client-portal',
  CLIENT_PORTAL_BY_ID: (id: string) => `/client-portal/${id}`,
  CLIENT_PORTAL_LOGIN: '/client-portal/login',
  CLIENT_PORTAL_PASSWORD: (id: string) => `/client-portal/${id}/password`,
  CLIENT_PORTAL_2FA_ENABLE: (id: string) => `/client-portal/${id}/2fa/enable`,
  CLIENT_PORTAL_2FA_DISABLE: (id: string) => `/client-portal/${id}/2fa/disable`,

  // Loyalty Programs
  LOYALTY_PROGRAMS: '/loyalty-programs',
  LOYALTY_PROGRAMS_BY_ID: (id: string) => `/loyalty-programs/${id}`,
  LOYALTY_PROGRAMS_BY_CLIENT: (clientId: string) => `/loyalty-programs/client/${clientId}`,
  LOYALTY_PROGRAMS_TRANSACTIONS: (loyaltyProgramId: string) =>
    `/loyalty-programs/${loyaltyProgramId}/transactions`,
  LOYALTY_PROGRAMS_POINTS_ADD: '/loyalty-programs/points/add',
  LOYALTY_PROGRAMS_POINTS_REDEEM: '/loyalty-programs/points/redeem',

  // Feedback
  FEEDBACK: '/feedback',
  FEEDBACK_BY_ID: (id: string) => `/feedback/${id}`,
  FEEDBACK_NPS: '/feedback/nps',
  FEEDBACK_REVIEW: (id: string) => `/feedback/${id}/review`,
  FEEDBACK_SURVEYS: '/feedback/surveys',
  FEEDBACK_SURVEY_BY_ID: (id: string) => `/feedback/surveys/${id}`,
  FEEDBACK_SURVEY_PUBLISH: (id: string) => `/feedback/surveys/${id}/publish`,
  FEEDBACK_SURVEY_RESPONSES: '/feedback/surveys/responses',

  // Waitlist
  WAITLIST: '/waitlist',
  WAITLIST_BY_ID: (id: string) => `/waitlist/${id}`,
  WAITLIST_NOTIFY: (id: string) => `/waitlist/${id}/notify`,
  WAITLIST_BOOK: (id: string) => `/waitlist/${id}/book`,
  WAITLIST_CANCEL: (id: string) => `/waitlist/${id}/cancel`,

  // Time Blocks
  TIME_BLOCKS: '/time-blocks',
  TIME_BLOCK_BY_ID: (id: string) => `/time-blocks/${id}`,

  // Estimates
  ESTIMATES: '/estimates',
  ESTIMATE_BY_ID: (id: string) => `/estimates/${id}`,
  ESTIMATE_APPROVE: (id: string) => `/estimates/${id}/approve`,
  ESTIMATE_REJECT: (id: string) => `/estimates/${id}/reject`,
  ESTIMATE_CONVERT: (id: string) => `/estimates/${id}/convert`,

  // Payment Plans
  PAYMENT_PLANS: '/payment-plans',
  PAYMENT_PLAN_BY_ID: (id: string) => `/payment-plans/${id}`,
  PAYMENT_PLAN_DUE_INSTALLMENTS: (clientId: string) => `/payment-plans/client/${clientId}/due`,
  PAYMENT_PLAN_PAYMENT: '/payment-plans/payment',
  PAYMENT_PLAN_CANCEL: (id: string) => `/payment-plans/${id}/cancel`,

  // Purchase Orders
  PURCHASE_ORDERS: '/purchase-orders',
  PURCHASE_ORDER_BY_ID: (id: string) => `/purchase-orders/${id}`,
  PURCHASE_ORDER_APPROVE: (id: string) => `/purchase-orders/${id}/approve`,
  PURCHASE_ORDER_RECEIVE: (id: string) => `/purchase-orders/${id}/receive`,
  PURCHASE_ORDER_CANCEL: (id: string) => `/purchase-orders/${id}/cancel`,

  // Equipment
  EQUIPMENT: '/equipment',
  EQUIPMENT_BY_ID: (id: string) => `/equipment/${id}`,
  EQUIPMENT_MAINTENANCE: '/equipment/maintenance',
  EQUIPMENT_MAINTENANCE_COMPLETE: (maintenanceId: string) =>
    `/equipment/maintenance/${maintenanceId}/complete`,
  EQUIPMENT_MAINTENANCE_SCHEDULE: '/equipment/maintenance/schedule',
  EQUIPMENT_MAINTENANCE_UPCOMING: '/equipment/maintenance/upcoming',

  // Insurance Claims
  INSURANCE_CLAIMS: '/insurance-claims',
  INSURANCE_CLAIM_BY_ID: (id: string) => `/insurance-claims/${id}`,
  INSURANCE_CLAIM_STATUS: (id: string) => `/insurance-claims/${id}/status`,
  INSURANCE_CLAIM_PROCESS: (id: string) => `/insurance-claims/${id}/process`,

  // Refunds
  REFUNDS: '/refunds',
  REFUND_BY_ID: (id: string) => `/refunds/${id}`,
  REFUND_PROCESS: (id: string) => `/refunds/${id}/process`,

  // Marketing Campaigns
  MARKETING_CAMPAIGNS: '/marketing-campaigns',
  MARKETING_CAMPAIGN_BY_ID: (id: string) => `/marketing-campaigns/${id}`,
  MARKETING_CAMPAIGN_LAUNCH: (id: string) => `/marketing-campaigns/${id}/launch`,
  MARKETING_CAMPAIGN_METRICS: (id: string) => `/marketing-campaigns/${id}/metrics`,
  MARKETING_CAMPAIGN_COMPLETE: (id: string) => `/marketing-campaigns/${id}/complete`,

  // Policies
  POLICIES: '/policies',
  POLICY_BY_ID: (id: string) => `/policies/${id}`,
  POLICY_USER_ACKNOWLEDGMENTS: (userId: string) => `/policies/user/${userId}/acknowledgments`,
  POLICY_ACKNOWLEDGE: (id: string) => `/policies/${id}/acknowledge`,

  // Report Templates
  REPORT_TEMPLATES: '/report-templates',
  REPORT_TEMPLATE_BY_ID: (id: string) => `/report-templates/${id}`,
  REPORT_TEMPLATE_SCHEDULED: '/report-templates/schedule/due',
  REPORT_TEMPLATE_USE: (id: string) => `/report-templates/${id}/use`,
  REPORT_TEMPLATE_SCHEDULE: '/report-templates/schedule',

  // Document Templates
  DOCUMENT_TEMPLATES: '/document-templates',
  DOCUMENT_TEMPLATE_BY_ID: (id: string) => `/document-templates/${id}`,
  DOCUMENT_TEMPLATE_SIGNATURES: (documentId: string) =>
    `/document-templates/documents/${documentId}/signatures`,
  DOCUMENT_TEMPLATE_USE: (id: string) => `/document-templates/${id}/use`,
  DOCUMENT_TEMPLATE_SIGN: '/document-templates/signatures',
  DOCUMENT_TEMPLATE_WORKFLOWS: '/document-templates/workflows',
  DOCUMENT_TEMPLATE_WORKFLOW_ADVANCE: (workflowId: string) =>
    `/document-templates/workflows/${workflowId}/advance`,
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
// HTTP Headers
// ============================================================================
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  BEARER_PREFIX: 'Bearer',
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
// Date Formats
// ============================================================================
export const DATE_FORMAT = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  FULL: 'MMMM dd, yyyy',
} as const;

// ============================================================================
// Query Keys (for React Query)
// ============================================================================
export const QUERY_KEYS = {
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
  BREED_INFO: 'breedInfo',
  LOYALTY_PROGRAMS: 'loyaltyPrograms',
  FEEDBACK: 'feedback',
  WAITLIST: 'waitlist',
  TIME_BLOCKS: 'timeBlocks',
  ESTIMATES: 'estimates',
  PAYMENT_PLANS: 'paymentPlans',
  PURCHASE_ORDERS: 'purchaseOrders',
  EQUIPMENT: 'equipment',
  INSURANCE_CLAIMS: 'insuranceClaims',
  REFUNDS: 'refunds',
  MARKETING_CAMPAIGNS: 'marketingCampaigns',
  POLICIES: 'policies',
  REPORT_TEMPLATES: 'reportTemplates',
  DOCUMENT_TEMPLATES: 'documentTemplates',
} as const;
