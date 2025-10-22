/**
 * WF-COMP-XXX | staffApi.ts - Staff API service module
 * Purpose: Staff domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Staff components and stores
 * Related: Staff types, staff Redux slice
 * Exports: staffApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  hireDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  hireDate: string;
}

export interface UpdateStaffData extends Partial<CreateStaffData> {
  status?: string;
}

export interface StaffFilters {
  role?: string[];
  status?: string[];
  specialization?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedStaffResponse {
  data: Staff[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StaffStatistics {
  total: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
  veterinarians: number;
  technicians: number;
}

export interface StaffApi {
  // Basic CRUD operations
  getAll(filters?: StaffFilters): Promise<PaginatedStaffResponse>;
  getById(id: string): Promise<Staff>;
  create(data: CreateStaffData): Promise<Staff>;
  update(id: string, data: UpdateStaffData): Promise<Staff>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getStatistics(filters?: StaffFilters): Promise<StaffStatistics>;
  getByRole(role: string, filters?: StaffFilters): Promise<Staff[]>;
  getAvailable(date: string, startTime: string, endTime: string): Promise<Staff[]>;
  search(query: string, filters?: StaffFilters): Promise<Staff[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

const createStaffSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).trim(),
  lastName: z.string().min(1, 'Last name is required').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format'),
  role: z.string().min(1, 'Role is required').max(50),
  specialization: z.string().max(100).optional(),
  licenseNumber: z.string().max(50).optional(),
  hireDate: z.string().datetime('Invalid hire date format'),
});

const updateStaffSchema = createStaffSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
});

const staffFiltersSchema = z.object({
  role: z.array(z.string()).optional(),
  status: z.array(z.enum(['active', 'inactive', 'on_leave'])).optional(),
  specialization: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class StaffApiImpl implements StaffApi {
  private readonly baseEndpoint = '/staff';
  private readonly auditResource: AuditResourceType = 'STAFF' as AuditResourceType;

  async getAll(filters?: StaffFilters): Promise<PaginatedStaffResponse> {
    try {
      const validatedFilters = filters ? staffFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      const data = extractApiData<PaginatedStaffResponse>(response);

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

  async getById(id: string): Promise<Staff> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Staff>(response);

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

  async create(data: CreateStaffData): Promise<Staff> {
    try {
      const validatedData = createStaffSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Staff>(response);

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

  async update(id: string, data: UpdateStaffData): Promise<Staff> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updateStaffSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Staff>(response);

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

  async getStatistics(filters?: StaffFilters): Promise<StaffStatistics> {
    try {
      const validatedFilters = filters ? staffFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url);
      return extractApiData<StaffStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getByRole(role: string, filters?: StaffFilters): Promise<Staff[]> {
    try {
      const validatedFilters = filters ? staffFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, role: [role] });

      const response = await apiInstance.get(
        `${this.baseEndpoint}/role/${role}?${params.toString()}`
      );
      return extractApiData<Staff[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAvailable(date: string, startTime: string, endTime: string): Promise<Staff[]> {
    try {
      const params = buildUrlParams({ date, startTime, endTime });

      const response = await apiInstance.get(`${this.baseEndpoint}/available?${params.toString()}`);
      return extractApiData<Staff[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: StaffFilters): Promise<Staff[]> {
    try {
      const validatedFilters = filters ? staffFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Staff[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const staffApi: StaffApi = new StaffApiImpl();
