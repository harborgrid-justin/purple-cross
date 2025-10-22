/**
 * WF-COMP-XXX | appointmentsApi.ts - Appointments API service module
 * Purpose: Appointments domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Appointment components and stores
 * Related: Appointment types, appointments Redux slice
 * Exports: appointmentsApi instance, types | Key Features: CRUD operations, validation, error handling
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service with comprehensive type safety and validation
 */

import { apiInstance } from '../config/apiConfig';
import { buildUrlParams, handleApiError, extractApiData, withRetry } from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface Appointment {
  id: string;
  patientId: string;
  clientId: string;
  veterinarianId: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  patientId: string;
  clientId: string;
  veterinarianId: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: string;
}

export interface AppointmentFilters {
  status?: string[];
  patientId?: string;
  clientId?: string;
  veterinarianId?: string;
  appointmentType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedAppointmentResponse {
  data: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AppointmentStatistics {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  upcomingToday: number;
  upcomingWeek: number;
}

export interface AppointmentsApi {
  // Basic CRUD operations
  getAll(filters?: AppointmentFilters): Promise<PaginatedAppointmentResponse>;
  getById(id: string): Promise<Appointment>;
  create(data: CreateAppointmentData): Promise<Appointment>;
  update(id: string, data: UpdateAppointmentData): Promise<Appointment>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getStatistics(filters?: AppointmentFilters): Promise<AppointmentStatistics>;
  complete(id: string): Promise<Appointment>;
  cancel(id: string, reason?: string): Promise<Appointment>;
  reschedule(id: string, newStartTime: string, newEndTime: string): Promise<Appointment>;
  search(query: string, filters?: AppointmentFilters): Promise<Appointment[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

const createAppointmentSchema = z.object({
  patientId: z.string().regex(ID_REGEX, 'Invalid patient ID format'),
  clientId: z.string().regex(ID_REGEX, 'Invalid client ID format'),
  veterinarianId: z.string().regex(ID_REGEX, 'Invalid veterinarian ID format'),
  appointmentType: z.string().min(1, 'Appointment type is required').max(100),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  reason: z.string().min(1, 'Reason is required').max(500),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  status: z
    .enum([
      'scheduled',
      'confirmed',
      'checked_in',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled',
    ])
    .optional(),
});

const appointmentFiltersSchema = z.object({
  status: z
    .array(
      z.enum([
        'scheduled',
        'confirmed',
        'checked_in',
        'in_progress',
        'completed',
        'cancelled',
        'no_show',
        'rescheduled',
      ])
    )
    .optional(),
  patientId: z.string().regex(ID_REGEX).optional(),
  clientId: z.string().regex(ID_REGEX).optional(),
  veterinarianId: z.string().regex(ID_REGEX).optional(),
  appointmentType: z.string().max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class AppointmentsApiImpl implements AppointmentsApi {
  private readonly baseEndpoint = '/appointments';
  private readonly auditResource: AuditResourceType = 'APPOINTMENT' as AuditResourceType;

  async getAll(filters?: AppointmentFilters): Promise<PaginatedAppointmentResponse> {
    try {
      const validatedFilters = filters ? appointmentFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      const data = extractApiData<PaginatedAppointmentResponse>(response);

      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters: validatedFilters, count: data.data?.length || 0 },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<Appointment> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const validatedData = createAppointmentSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdItem.id,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData },
      });

      return createdItem;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data },
      });

      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updateAppointmentSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData },
      });

      return updatedItem;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data },
      });

      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      await apiInstance.delete(`${this.baseEndpoint}/${id}`);

      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async getStatistics(filters?: AppointmentFilters): Promise<AppointmentStatistics> {
    try {
      const validatedFilters = filters ? appointmentFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url);
      return extractApiData<AppointmentStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async complete(id: string): Promise<Appointment> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.patch(`${this.baseEndpoint}/${id}/complete`);
      const data = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'complete' },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async cancel(id: string, reason?: string): Promise<Appointment> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.patch(`${this.baseEndpoint}/${id}/cancel`, { reason });
      const data = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'cancel', reason },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async reschedule(id: string, newStartTime: string, newEndTime: string): Promise<Appointment> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.patch(`${this.baseEndpoint}/${id}/reschedule`, {
        startTime: newStartTime,
        endTime: newEndTime,
      });
      const data = extractApiData<Appointment>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'reschedule', newStartTime, newEndTime },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      const validatedFilters = filters ? appointmentFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Appointment[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const appointmentsApi: AppointmentsApi = new AppointmentsApiImpl();
