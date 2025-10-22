/**
 * WF-COMP-XXX | medicalRecordsApi.ts - Medical Records API service module
 * Purpose: Medical Records domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Medical record components and stores
 * Related: MedicalRecord types, medical records Redux slice
 * Exports: medicalRecordsApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string;
  veterinarianId: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordData {
  patientId: string;
  visitDate: string;
  veterinarianId: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface UpdateMedicalRecordData extends Partial<CreateMedicalRecordData> {}

export interface MedicalRecordFilters {
  patientId?: string;
  veterinarianId?: string;
  startDate?: string;
  endDate?: string;
  followUpRequired?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedMedicalRecordResponse {
  data: MedicalRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MedicalRecordsApi {
  // Basic CRUD operations
  getAll(filters?: MedicalRecordFilters): Promise<PaginatedMedicalRecordResponse>;
  getById(id: string): Promise<MedicalRecord>;
  create(data: CreateMedicalRecordData): Promise<MedicalRecord>;
  update(id: string, data: UpdateMedicalRecordData): Promise<MedicalRecord>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getByPatient(patientId: string, filters?: MedicalRecordFilters): Promise<MedicalRecord[]>;
  getFollowUps(filters?: MedicalRecordFilters): Promise<MedicalRecord[]>;
  search(query: string, filters?: MedicalRecordFilters): Promise<MedicalRecord[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

const createMedicalRecordSchema = z.object({
  patientId: z.string().regex(ID_REGEX, 'Invalid patient ID format'),
  visitDate: z.string().datetime('Invalid visit date format'),
  veterinarianId: z.string().regex(ID_REGEX, 'Invalid veterinarian ID format'),
  diagnosis: z.string().min(1, 'Diagnosis is required').max(500),
  treatment: z.string().min(1, 'Treatment is required').max(500),
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters').optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime('Invalid follow-up date format').optional(),
});

const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

const medicalRecordFiltersSchema = z.object({
  patientId: z.string().regex(ID_REGEX).optional(),
  veterinarianId: z.string().regex(ID_REGEX).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  followUpRequired: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class MedicalRecordsApiImpl implements MedicalRecordsApi {
  private readonly baseEndpoint = '/medical-records';
  private readonly auditResource: AuditResourceType = 'MEDICAL_RECORD' as AuditResourceType;

  async getAll(filters?: MedicalRecordFilters): Promise<PaginatedMedicalRecordResponse> {
    try {
      const validatedFilters = filters ? medicalRecordFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      const data = extractApiData<PaginatedMedicalRecordResponse>(response);

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

  async getById(id: string): Promise<MedicalRecord> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<MedicalRecord>(response);

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

  async create(data: CreateMedicalRecordData): Promise<MedicalRecord> {
    try {
      const validatedData = createMedicalRecordSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<MedicalRecord>(response);

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

  async update(id: string, data: UpdateMedicalRecordData): Promise<MedicalRecord> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updateMedicalRecordSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<MedicalRecord>(response);

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

  async getByPatient(patientId: string, filters?: MedicalRecordFilters): Promise<MedicalRecord[]> {
    try {
      if (!ID_REGEX.test(patientId)) {
        throw new Error('Invalid patient ID format');
      }

      const validatedFilters = filters ? medicalRecordFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, patientId });

      const response = await apiInstance.get(
        `${this.baseEndpoint}/patient/${patientId}?${params.toString()}`
      );
      return extractApiData<MedicalRecord[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getFollowUps(filters?: MedicalRecordFilters): Promise<MedicalRecord[]> {
    try {
      const validatedFilters = filters ? medicalRecordFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, followUpRequired: true });

      const response = await apiInstance.get(
        `${this.baseEndpoint}/follow-ups?${params.toString()}`
      );
      return extractApiData<MedicalRecord[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: MedicalRecordFilters): Promise<MedicalRecord[]> {
    try {
      const validatedFilters = filters ? medicalRecordFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<MedicalRecord[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const medicalRecordsApi: MedicalRecordsApi = new MedicalRecordsApiImpl();
