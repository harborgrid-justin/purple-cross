/**
 * WF-COMP-XXX | patientsApi.ts - Patients API service module
 * Purpose: Patients domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Patient components and stores
 * Related: Patient types, patients Redux slice
 * Exports: patientsApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: string;
  gender: string;
  ownerId: string;
  microchipNumber?: string;
  weight?: number;
  color?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientData {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: string;
  gender: string;
  ownerId: string;
  microchipNumber?: string;
  weight?: number;
  color?: string;
  notes?: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  status?: string;
}

export interface PatientFilters {
  status?: string[];
  species?: string;
  ownerId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedPatientResponse {
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PatientStatistics {
  total: number;
  bySpecies: Record<string, number>;
  byStatus: Record<string, number>;
  averageAge: number;
}

export interface PatientsApi {
  // Basic CRUD operations
  getAll(filters?: PatientFilters): Promise<PaginatedPatientResponse>;
  getById(id: string): Promise<Patient>;
  create(data: CreatePatientData): Promise<Patient>;
  update(id: string, data: UpdatePatientData): Promise<Patient>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getStatistics(filters?: PatientFilters): Promise<PatientStatistics>;
  bulkUpdate(ids: string[], data: Partial<UpdatePatientData>): Promise<Patient[]>;
  export(filters?: PatientFilters): Promise<Blob>;
  import(file: File): Promise<{ success: number; errors: string[] }>;

  // Search and filtering
  search(query: string, filters?: PatientFilters): Promise<Patient[]>;
  getFilters(): Promise<{ [key: string]: string[] }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

/**
 * Create patient validation schema
 */
const createPatientSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),

    species: z
      .string()
      .min(1, 'Species is required')
      .max(50, 'Species cannot exceed 50 characters'),

    breed: z.string().max(50, 'Breed cannot exceed 50 characters').optional(),

    dateOfBirth: z.string().datetime('Invalid date format'),

    gender: z.enum(['male', 'female', 'unknown']),

    ownerId: z.string().regex(ID_REGEX, 'Invalid owner ID format'),

    microchipNumber: z.string().max(50, 'Microchip number cannot exceed 50 characters').optional(),

    weight: z.number().positive('Weight must be positive').optional(),

    color: z.string().max(50, 'Color cannot exceed 50 characters').optional(),

    notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  })
  .strict();

/**
 * Update patient validation schema (partial of create)
 */
const updatePatientSchema = createPatientSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'deceased']).optional(),
});

/**
 * Filter validation schema
 */
const patientFiltersSchema = z
  .object({
    status: z.array(z.enum(['active', 'inactive', 'deceased'])).optional(),
    species: z.string().max(50).optional(),
    ownerId: z.string().regex(ID_REGEX).optional(),
    search: z.string().max(100).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
    sort: z.string().max(50).optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict();

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class PatientsApiImpl implements PatientsApi {
  private readonly baseEndpoint = '/patients';
  private readonly auditResource: AuditResourceType = AuditResourceType.PATIENT;

  /**
   * Get all patient items with filtering and pagination
   */
  async getAll(filters?: PatientFilters): Promise<PaginatedPatientResponse> {
    try {
      // Validate filters
      const validatedFilters = filters ? patientFiltersSchema.parse(filters) : {};

      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      // Extract and validate response
      const data = extractApiData<PaginatedPatientResponse>(response);

      // Audit the operation
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters: validatedFilters, count: data.data?.length || 0 },
      });

      return data;
    } catch (error) {
      // Audit the failure
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

  /**
   * Get a single patient item by ID
   */
  async getById(id: string): Promise<Patient> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Patient>(response);

      // Audit successful read
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });

      return data;
    } catch (error) {
      // Audit failed read
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

  /**
   * Create a new patient item
   */
  async create(data: CreatePatientData): Promise<Patient> {
    try {
      // Validate input data
      const validatedData = createPatientSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Patient>(response);

      // Audit successful creation
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdItem.id,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData },
      });

      return createdItem;
    } catch (error) {
      // Audit failed creation
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

  /**
   * Update an existing patient item
   */
  async update(id: string, data: UpdatePatientData): Promise<Patient> {
    try {
      // Validate ID and input data
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updatePatientSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Patient>(response);

      // Audit successful update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData },
      });

      return updatedItem;
    } catch (error) {
      // Audit failed update
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

  /**
   * Delete a patient item
   */
  async delete(id: string): Promise<void> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      await apiInstance.delete(`${this.baseEndpoint}/${id}`);

      // Audit successful deletion
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });
    } catch (error) {
      // Audit failed deletion
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

  /**
   * Get statistics for patient items
   */
  async getStatistics(filters?: PatientFilters): Promise<PatientStatistics> {
    try {
      const validatedFilters = filters ? patientFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url);
      return extractApiData<PatientStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Bulk update multiple patient items
   */
  async bulkUpdate(ids: string[], data: Partial<UpdatePatientData>): Promise<Patient[]> {
    try {
      // Validate IDs
      ids.forEach((id) => {
        if (!ID_REGEX.test(id)) {
          throw new Error(`Invalid ID format: ${id}`);
        }
      });

      const validatedData = updatePatientSchema.partial().parse(data);

      const response = await apiInstance.patch(`${this.baseEndpoint}/bulk`, {
        ids,
        data: validatedData,
      });

      const updatedItems = extractApiData<Patient[]>(response);

      // Audit bulk update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: `bulk-${ids.length}`,
        status: AuditStatus.SUCCESS,
        details: { ids, updated: validatedData },
      });

      return updatedItems;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: `bulk-${ids.length}`,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  /**
   * Export patient data
   */
  async export(filters?: PatientFilters): Promise<Blob> {
    try {
      const validatedFilters = filters ? patientFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/export${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url, {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Import patient data from file
   */
  async import(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiInstance.post(`${this.baseEndpoint}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return extractApiData<{ success: number; errors: string[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Search patient items
   */
  async search(query: string, filters?: PatientFilters): Promise<Patient[]> {
    try {
      const validatedFilters = filters ? patientFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Patient[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get available filter options
   */
  async getFilters(): Promise<{ [key: string]: string[] }> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/filters`);
      return extractApiData<{ [key: string]: string[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

/**
 * Singleton instance of PatientsApi
 * Use this throughout the application
 */
export const patientsApi: PatientsApi = new PatientsApiImpl();

// Type exports are included in the interface export above
