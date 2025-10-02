/**
 * Purple Cross - Enterprise Veterinary Practice Management Platform
 * 
 * A comprehensive, enterprise-grade platform for veterinary practices
 * featuring 15 primary modules with 120 sub-features.
 */

// Module 1: Patient Management
export * from './models/PatientManagement';

// Module 2: Client Management
export * from './models/ClientManagement';

// Module 3: Appointment Scheduling
export * from './models/AppointmentScheduling';

// Module 4: Medical Records & History
export * from './models/MedicalRecords';

// Module 5: Prescription & Medication Management
export * from './models/PrescriptionManagement';

// Module 6: Inventory & Supply Chain Management
export * from './models/InventoryManagement';

// Module 7: Billing & Payment Processing
export * from './models/BillingPayment';

// Module 8: Laboratory Management
export * from './models/LaboratoryManagement';

// Module 9: Staff & User Management
export * from './models/StaffManagement';

// Module 10: Reporting & Analytics
export * from './models/ReportingAnalytics';

// Module 11: Communication & Messaging
export * from './models/CommunicationMessaging';

// Module 12: Document Management
export * from './models/DocumentManagement';

// Module 13: Compliance & Regulatory Management
export * from './models/ComplianceRegulatory';

// Module 14: Integration & API Management
export * from './models/IntegrationAPI';

// Module 15: Mobile & Remote Access
export * from './models/MobileRemoteAccess';

/**
 * Platform Information
 */
export const PLATFORM_INFO = {
  name: 'Purple Cross',
  version: '1.0.0',
  description: 'Enterprise-grade veterinary practice management platform',
  modules: 15,
  subFeatures: 120,
  features: [
    'Patient (Pet) Management System',
    'Client (Pet Owner) Management',
    'Appointment Scheduling & Calendar',
    'Medical Records & History',
    'Prescription & Medication Management',
    'Inventory & Supply Chain Management',
    'Billing & Payment Processing',
    'Laboratory Management',
    'Staff & User Management',
    'Reporting & Analytics',
    'Communication & Messaging',
    'Document Management',
    'Compliance & Regulatory Management',
    'Integration & API Management',
    'Mobile & Remote Access'
  ]
};

/**
 * Get platform information
 */
export function getPlatformInfo() {
  return PLATFORM_INFO;
}

/**
 * Check if a module is available
 */
export function isModuleAvailable(moduleName: string): boolean {
  return PLATFORM_INFO.features.includes(moduleName);
}

/**
 * Get list of all available modules
 */
export function getAvailableModules(): string[] {
  return [...PLATFORM_INFO.features];
}
