/**
 * Query Key Factory
 * Type-safe query key generation for TanStack Query
 */

import { QUERY_KEYS } from '@/constants';

export const queryKeys = {
  // Authentication
  auth: {
    all: [QUERY_KEYS.AUTH] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Patients
  patients: {
    all: [QUERY_KEYS.PATIENTS] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.patients.lists(), filters] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },

  // Clients
  clients: {
    all: [QUERY_KEYS.CLIENTS] as const,
    lists: () => [...queryKeys.clients.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.clients.lists(), filters] as const,
    details: () => [...queryKeys.clients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },

  // Appointments
  appointments: {
    all: [QUERY_KEYS.APPOINTMENTS] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
  },

  // Medical Records
  medicalRecords: {
    all: [QUERY_KEYS.MEDICAL_RECORDS] as const,
    lists: () => [...queryKeys.medicalRecords.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.medicalRecords.lists(), filters] as const,
    details: () => [...queryKeys.medicalRecords.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.medicalRecords.details(), id] as const,
  },

  // Prescriptions
  prescriptions: {
    all: [QUERY_KEYS.PRESCRIPTIONS] as const,
    lists: () => [...queryKeys.prescriptions.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.prescriptions.lists(), filters] as const,
    details: () => [...queryKeys.prescriptions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.prescriptions.details(), id] as const,
  },

  // Staff
  staff: {
    all: [QUERY_KEYS.STAFF] as const,
    lists: () => [...queryKeys.staff.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.staff.lists(), filters] as const,
    details: () => [...queryKeys.staff.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.staff.details(), id] as const,
  },

  // Invoices
  invoices: {
    all: [QUERY_KEYS.INVOICES] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },

  // Analytics
  analytics: {
    all: [QUERY_KEYS.ANALYTICS] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    patients: () => [...queryKeys.analytics.all, 'patients'] as const,
    appointments: () => [...queryKeys.analytics.all, 'appointments'] as const,
    financial: () => [...queryKeys.analytics.all, 'financial'] as const,
  },
} as const;
