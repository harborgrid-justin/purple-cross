/**
 * WF-IDX-XXX | index.ts - Services module exports
 * Purpose: Centralized exports for all service modules
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// ==========================================
// CORE INFRASTRUCTURE EXPORTS
// ==========================================

export { apiInstance, tokenUtils, API_CONFIG } from './config/apiConfig';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export {
  handleApiError,
  extractApiData,
  extractApiDataOptional,
  buildUrlParams,
  buildPaginationParams,
  formatDateForApi,
  parseDateFromApi,
  withRetry,
  createFormData,
  isApiResponse,
  isPaginatedResponse,
  apiCache as utilsApiCache,
  withCache,
  debounce,
} from './utils/apiUtils';

export type {
  ApiError as UtilsApiError,
  ApiResponse as UtilsApiResponse,
  PaginatedResponse as UtilsPaginatedResponse,
  RetryOptions,
} from './utils/apiUtils';

export {
  classifyError,
  transformError,
  getUserFriendlyMessage,
  logError,
  isRecoverableError,
  requiresAuthentication,
  isValidationError,
} from './utils/errorHandlers';

export type { AppError, ErrorType } from './utils/errorHandlers';

export {
  ID_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  URL_REGEX,
  ZIP_CODE_REGEX,
  idSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  dateStringSchema,
  dateSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  statusSchema,
  appointmentStatusSchema,
  paymentStatusSchema,
  paginationSchema,
  searchSchema,
  addressSchema,
  nameSchema,
  descriptionSchema,
  notesSchema,
  currencySchema,
  fileSchema,
  imageFileSchema,
  pdfFileSchema,
  requiredString,
  optionalString,
  enumSchema,
} from './utils/validators';

export {
  toISOString,
  fromISOString,
  formatDate,
  formatDateTime,
  getRelativeTime,
  formatCurrency,
  parseCurrency,
  formatPhoneNumber,
  cleanPhoneNumber,
  formatFullName,
  getInitials,
  titleCase,
  formatAddress,
  arrayToString,
  stringToArray,
  removeEmpty,
  deepClone,
  deepMerge,
  formatBoolean,
  formatNumber,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from './utils/transformers';

// ==========================================
// CORE SERVICE EXPORTS
// ==========================================

export * from './core';

// ==========================================
// SECURITY EXPORTS
// ==========================================

export { secureTokenManager } from './security/SecureTokenManager';
export {
  setupCsrfProtection,
  generateCsrfToken,
  initializeCsrfToken,
  clearCsrfToken,
  getCsrfToken,
} from './security/CsrfProtection';
export { permissionChecker, Permission, ROLE_PERMISSIONS } from './security/PermissionChecker';
export type { User } from './security/PermissionChecker';

// ==========================================
// MONITORING EXPORTS
// ==========================================

export { apiMetrics } from './monitoring/ApiMetrics';
export { errorReporting } from './monitoring/ErrorReporting';

// ==========================================
// RESILIENCE EXPORTS
// ==========================================

export { CircuitBreaker, CircuitState, circuitBreakerRegistry } from './resilience/CircuitBreaker';

export {
  RetryStrategy,
  calculateExponentialBackoff,
  calculateLinearBackoff,
  calculateFibonacciBackoff,
  withRetry as retryWithStrategy,
  createRetryFunction,
  quickRetry,
  standardRetry,
  aggressiveRetry,
} from './resilience/RetryStrategies';

export type { RetryConfig, RetryStats } from './resilience/RetryStrategies';

// ==========================================
// CACHE EXPORTS
// ==========================================

export { apiCache, ApiCache } from './cache/ApiCache';
export {
  CacheStrategy,
  cacheFirst,
  networkFirst,
  cacheOnly,
  networkOnly,
  staleWhileRevalidate,
  createCacheStrategy,
  invalidateOnMutation,
  invalidateRelated,
  buildListCacheKey,
  buildDetailCacheKey,
  buildCustomCacheKey,
} from './cache/CacheStrategies';

// ==========================================
// AUDIT EXPORTS
// ==========================================

export { auditService, AuditAction, AuditResourceType, AuditStatus } from './audit';

export type { AuditEntry } from './audit';

// ==========================================
// DOMAIN API EXPORTS
// ==========================================

// Patients API
export { patientsApi } from './modules/patientsApi';
export type {
  PatientsApi,
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PatientFilters,
  PaginatedPatientResponse,
  PatientStatistics,
} from './modules/patientsApi';

// Clients API
export { clientsApi } from './modules/clientsApi';
export type {
  ClientsApi,
  Client,
  CreateClientData,
  UpdateClientData,
  ClientFilters,
  PaginatedClientResponse,
  ClientStatistics,
} from './modules/clientsApi';

// Appointments API
export { appointmentsApi } from './modules/appointmentsApi';
export type {
  AppointmentsApi,
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  PaginatedAppointmentResponse,
  AppointmentStatistics,
} from './modules/appointmentsApi';

// Medical Records API
export { medicalRecordsApi } from './modules/medicalRecordsApi';
export type {
  MedicalRecordsApi,
  MedicalRecord,
  CreateMedicalRecordData,
  UpdateMedicalRecordData,
  MedicalRecordFilters,
  PaginatedMedicalRecordResponse,
} from './modules/medicalRecordsApi';

// Invoices API
export { invoicesApi } from './modules/invoicesApi';
export type {
  InvoicesApi,
  Invoice,
  InvoiceItem,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  PaginatedInvoiceResponse,
  InvoiceStatistics,
} from './modules/invoicesApi';

// Staff API
export { staffApi } from './modules/staffApi';
export type {
  StaffApi,
  Staff,
  CreateStaffData,
  UpdateStaffData,
  StaffFilters,
  PaginatedStaffResponse,
  StaffStatistics,
} from './modules/staffApi';

// ==========================================
// LEGACY COMPATIBILITY
// ==========================================

// Export legacy API client for backward compatibility
export { api } from './api';
export default { api: () => import('./api').then((m) => m.api) };
