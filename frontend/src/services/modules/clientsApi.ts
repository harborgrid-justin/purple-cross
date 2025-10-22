/**
 * WF-COMP-XXX | clientsApi.ts - Clients API service module
 * Purpose: Clients domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Client components and stores
 * Related: Client types, clients Redux slice
 * Exports: clientsApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  secondaryPhone?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  secondaryPhone?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: string;
}

export interface ClientFilters {
  status?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedClientResponse {
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientStatistics {
  total: number;
  active: number;
  inactive: number;
  byState: Record<string, number>;
}

export interface ClientsApi {
  // Basic CRUD operations
  getAll(filters?: ClientFilters): Promise<PaginatedClientResponse>;
  getById(id: string): Promise<Client>;
  create(data: CreateClientData): Promise<Client>;
  update(id: string, data: UpdateClientData): Promise<Client>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getStatistics(filters?: ClientFilters): Promise<ClientStatistics>;
  search(query: string, filters?: ClientFilters): Promise<Client[]>;
  export(filters?: ClientFilters): Promise<Blob>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

const createClientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).trim(),
  lastName: z.string().min(1, 'Last name is required').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format'),
  address: z.string().min(1, 'Address is required').max(200).trim(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().length(2, 'State must be 2 characters').toUpperCase(),
  zipCode: z.string().regex(ZIP_REGEX, 'Invalid ZIP code'),
  secondaryPhone: z.string().regex(PHONE_REGEX, 'Invalid phone number format').optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

const updateClientSchema = createClientSchema.partial().extend({
  status: z.enum(['active', 'inactive']).optional(),
});

const clientFiltersSchema = z.object({
  status: z.array(z.enum(['active', 'inactive'])).optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class ClientsApiImpl implements ClientsApi {
  private readonly baseEndpoint = '/clients';
  private readonly auditResource: AuditResourceType = AuditResourceType.CLIENT;

  async getAll(filters?: ClientFilters): Promise<PaginatedClientResponse> {
    try {
      const validatedFilters = filters ? clientFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      const data = extractApiData<PaginatedClientResponse>(response);

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

  async getById(id: string): Promise<Client> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Client>(response);

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

  async create(data: CreateClientData): Promise<Client> {
    try {
      const validatedData = createClientSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Client>(response);

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

  async update(id: string, data: UpdateClientData): Promise<Client> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updateClientSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Client>(response);

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

  async getStatistics(filters?: ClientFilters): Promise<ClientStatistics> {
    try {
      const validatedFilters = filters ? clientFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url);
      return extractApiData<ClientStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: ClientFilters): Promise<Client[]> {
    try {
      const validatedFilters = filters ? clientFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Client[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async export(filters?: ClientFilters): Promise<Blob> {
    try {
      const validatedFilters = filters ? clientFiltersSchema.parse(filters) : {};
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
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const clientsApi: ClientsApi = new ClientsApiImpl();
